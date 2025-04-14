import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
import quickPay from './quickPay/quickPay.vue';
import cCashier from './common/cashier/cashier.vue';
import deskList from './restaurant/deskList/deskList.vue';
import roomList from './privateRoom/roomList/roomList.vue';
import roomList2 from './privateRoom/roomList2/roomList2.vue';
import prCashier from './privateRoom/cashier/cashier.vue';
import peddingList from './meiye/peddingList/peddingList.vue';
import education from './education/cashier/cashier.vue';
import fitness from './fitness/cashier/cashier.vue';
import privateRoomTips from './privateRoom/privateRoomTips/privateRoomTips.vue';
export default {
    components: { quickPay, cCashier, deskList, peddingList, education, roomList, roomList2, prCashier, fitness, privateRoomTips },
    name: 'home',
    data() {
        return {
            activeMask: -2,                         // -1 显示前台收银  >-1 显示引导页
            showPrivateRoomTips: false,             // 棋牌预结弹窗提醒
            fastPayInfo: {
                is_scancode: false,
                isSet: false,
                payment: ''
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'isLightMeal', 'memberInfo', 'cashierJurisdiction', 'selectedInfo', 'carttingData', 'customerDisplayData']),
        isCommon() {
            // 1-美业 6-棋牌茶楼 27-餐饮 11-艺培 32-健身房
            let industrytypeIncludes = [1, 6, 11, 27, 32, 69]
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype) === false
        },
        isPrivateRoom() {
            // 6-棋牌茶楼
            let industrytypeIncludes = [6]
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype)
        },
    },
    beforeRouteLeave(to, from, next) {
        if (this.userInfo.sv_us_industrytype === 11 && this.$refs.courseCashier) {
            if (this.$refs.courseCashier.courseCashierNotNull()) {
                return this.$confirm('您有课程在购物车待处理! 离开当前页面将会清空，是否确定？', '提示', {
                    confirmButtonText: '确定',
                    cancleButtonText: '取消',
                    callback: action => {
                        if (action === 'confirm') {
                            this.$root.$emit('keyCode', 112);
                            this.clearCartting();
                            this.clearMember();
                            next()
                        }
                    }
                });
            }
        }
        if (this.userInfo.sv_us_industrytype === 32 && this.$refs.fitnessCashier) {
            if (this.$refs.fitnessCashier.courseCashierNotNull()) {
                return this.$confirm('您有课程在购物车待处理! 离开当前页面将会清空，是否确定？', '提示', {
                    confirmButtonText: '确定',
                    cancleButtonText: '取消',
                    callback: action => {
                        if (action === 'confirm') {
                            this.$root.$emit('keyCode', 112);
                            this.clearCartting();
                            this.clearMember();
                            next()
                        }
                    }
                });
            }
        }
        if (this.$route.query.isOrderBack && !this.$app.isNull(this.selectedInfo.sv_order_list_id) && this.carttingData.productResults.length > 0) {
            return this.$confirm('购物车有反结账单待处理！离开当前页面将终止反结账，原订单则整单退', '提示', {
                confirmButtonText: '确定',
                cancleButtonText: '取消',
                callback: action => {
                    if (action === 'confirm') {
                        this.clearCartting();
                        this.clearMember();
                        this.clearSelectedInfo();
                        next()
                    }
                }
            });
        }
        next()
    },

    mounted() {
        const isOrderBack = this.$route.query.isOrderBack || false;
        this.getSettlementOrder();              // 查询当天上一笔订单
        this.getPermissions_Client();           // 获取模块权限
        this.getActiveMask();                   // 获取引导图次数
        if (!isOrderBack) {
            this.update({
                key: 'selectedInfo',
                data: {
                    ...this.selectedInfo,
                    sv_order_list_id: null,
                    sv_without_list_id: null
                }
            });
            this.updateCartting();
        }
        this.$root.$on('settlementOrderRefresh', this.getSettlementOrder);
        this.$root.$on('tablePrenotRemind', this.handleShowPrivateRoomTips);
    },
    beforeDestroy() {
        this.$root.$off('settlementOrderRefresh', this.getSettlementOrder);
        this.$root.$off('tablePrenotRemind', this.handleShowPrivateRoomTips);
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'clearSelectedInfo']),
        ...mapMutations('permission', ['setPermission']),
        ...mapActions(['updateCartting']),
        handleShowPrivateRoomTips() {
            this.showPrivateRoomTips = true;
            this.$refs.refPrivateRoomTips && this.$refs.refPrivateRoomTips.show();
        },
        getActiveMask() {                       // 判断是否显示引导图
            this.activeMask = this.$store.state.maskEntity.id === -1 ? -1 : this.$store.state.maskEntity.count < 3 ? 0 : -1;
        },
        getSettlementOrder() {                  // 查询当天上一笔订单
            stockApi.getSettlementOrder().then(res => {
                let settlementOrder = {
                    order_id: ''
                }
                if (res) {
                    settlementOrder = res;
                }
                this.update({
                    key: 'settlementOrder',
                    data: settlementOrder
                })
            });
        },
        getPermissions_Client() {
            let menuJson = this.$app.getLocalStorage('menuJson');
            let industryCode = 'FrontManage';
            if (this.userInfo.sv_us_industrytype === 27) {
                industryCode = 'Catering';
            }
            let permissionItem = menuJson ? menuJson.find(e => e.menu_code === industryCode) : null;
            if (this.$app.isNull(permissionItem)) return
            let query = {
                module_code: permissionItem.menu_code,
                sp_grouping_id: this.userInfo.sp_grouping_id
            }
            stockApi.getPermissions_Client(query).then(res => {
                if (res) {
                    this.setPermission({
                        key: 'CashierManage',
                        data: res
                    })
                    return
                }
                console.log('未获取到权限');
            });
        },
        handleLeftRight(number) {               // 左右切换
            this.activeMask = this.activeMask + number;
        },
        handleSubmit(number, type) {            // 提交引导显示次数
            this.activeMask = -1;
            let sv_novice_count = type === 'add' ? this.$store.state.maskEntity.count + number : number;
            stockApi.OperateNoviceGuide({ id: this.$store.state.maskEntity.id, sv_novice_count: sv_novice_count }).then(res => {
                this.$store.commit('updateMaskEntity', { id: -1, count: 0 });
            });
        },
    }
};
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
import cCashierRoom from './other/cashierRoom/cashierRoom.vue';
import mCashierRoom from './meiye/cashierRoom/cashierRoom.vue';
export default {
    components: { cCashierRoom, mCashierRoom },
    name: 'cashierRoom',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState(['userInfo', 'isLightMeal', 'memberInfo', 'cashierJurisdiction', 'selectedInfo', 'carttingData', 'customerDisplayData']),
        isMeiye() {
            // 1-丽人美业
            let industrytypeIncludes = [1]
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype)
        },
    },

    mounted() {
        
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
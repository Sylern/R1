import mCashier from '../cashier/cashier.vue';
import { stockApi } from "@/api/index.js";
import utils from '@/utils/utils';
import servicerSettingSingle from '../../../../base/servicerSettingSingle/servicerSettingSingle.vue';
import servicesPersonSelect from '../servicesPersonSelect/servicesPersonSelect.vue';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
const { debounce, throttle } = utils;
export default {
    components: { servicerSettingSingle, servicesPersonSelect, numberChange, mCashier },
    name: 'peddingList',
    data() {
        return {
            isOrderBack: false,                                 // 是否反结账
            imgBase: stockApi.imgBase(),
            filterServicerStatus: false,                        // 展示员工筛选
            afterPedding: false,                                // 请求列表后
            btnFilterText: '选择开单人',                         // 删选开单人按钮文本
            showServicesPrrson: false,                          // 是否展示选择开单人
            showCashier: false,                                 // 是否展示收银台
            pendingOrderId: null,                               // 选择的挂单id
            isDataLast: false,                                  // 列表数据到底了
            queryList: {
                date: '',
                keywards: '',
                id: 0,                                          // 开单人
                page: 1,
                sv_catering_grade: '',
                pagesize: 999,
                type: -1,                                       // 1散客,2会员
            },
            orderList: [],                                      // 挂单列表
            employeeList: [],
            isSetHandNumber: false,
            numberChangeStatus: false,
            clickEmployeeItem: {},
            inputHandNumber: '',
        }
    },
    computed: {
        ...mapState(['storeEmployeeList', 'userInfo', 'selectedInfo']),
    },
    watch: {
		showCashier: {
			immediate: true,
			handler(newval) {
				this.update({
					key: 'isInCartting',
					data: newval
				});
			}
		}
    },
    beforeMount() {
        this.isOrderBack = this.$route.query.isOrderBack || false;
        this.showCashier = this.isOrderBack ? true : false;
    },
    mounted() {
        this.queryList.date = this.$app.currentTime(new Date(), 'yyyy-MM-dd');
        this.clearMember();
        this.clearCartting();
        this.getServiceOrders();
        this.getUserModuleConfig();
        this.getUiGroupingEmployeeList();
        window.addEventListener('scroll', this.pageNextThrottle, true);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.pageNextThrottle, true);
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember']),
        ...mapActions(['getUiGroupingEmployeeList', 'meiyeTakeOrder', 'requsetMemberInfo']),
        pageNextThrottle: throttle('handleScroll', 200),    // 节流翻页
        //#region 获取数据
        getServiceOrders(initList) {
            stockApi.getServiceOrders(this.queryList).then(res => {
                this.afterPedding = true;
                this.filterServicerStatus = false;
                this.queryList.sv_catering_grade = '';
                if (initList) this.orderList = [];
                let resList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                    let wt_datetime = this.$app.currentTime(new Date(e.wt_datetime), 'yyyy-MM-dd HH:mm:ss')
                    return {
                        ...e,
                        id: e.sv_pending_order_id,
                        wt_datetime
                    }
                });
                this.orderList = this.orderList.concat(resList);
                this.employeeList = this.$app.isNull(res.bizemployeeList) ? [] : res.bizemployeeList;
                this.isDataLast = this.orderList.length === res.total ? true : false;
                this.$nextTick(() => {
                    !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                    !!this.$refs.workerListScroll && this.$refs.workerListScroll.update();
                    this.clearCartting();
                })
            }).catch(_ => {
                this.filterServicerStatus = false;
            });
        },
        getUserModuleConfig() {                             // 获取配置
            stockApi.getUserModuleConfig({ moduleCode: 'ReceptionCashierSet' }).then(res => {
                if (res) {
                    const ReceptionCashierSet = this.$app.isNull(res) ? [] : res.find(e => e.sv_user_module_code === 'ReceptionCashierSet');
                    const HandNumber = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'HandNumber');
                    const handNumbeHasDetail = this.$app.isNull(HandNumber) ? false : this.$app.isNull(HandNumber.childDetailList) ? false : true;
                    this.isSetHandNumber = handNumbeHasDetail ? HandNumber.childDetailList[0].sv_detail_is_enable : false;
                    this.$nextTick(() => {
                        if (this.isSetHandNumber) {
                            !!this.$refs.isSetHandNumber && this.$refs.isSetHandNumber.focus();
                        } else {
                            !!this.$refs.peddingList && this.$refs.peddingList.focus();
                        }
                    })
                }
            })
        },
        handleTakeOrder(item) {
            // this.clearMember();
            stockApi.takeOrder({ sv_pending_order_id: item.id }).then(res => {
                if (this.$app.isNull(res.product)) return this.$message.warning('没有找到挂单商品，请稍候再试');
                this.clearCartting();
                let goodsList = res.product.map(e => {
                    let productChangePrice = null;
                    let setmealId = null;
                    if (!this.$app.isNull(e.sv_preferential)) {
                        productChangePrice = JSON.parse(e.sv_preferential).type === 2 ? JSON.parse(e.sv_preferential).value : null;
                        setmealId = JSON.parse(e.sv_preferential).type === 3 ? JSON.parse(e.sv_preferential).value : null;
                    }
                    return {
                        productId: e.product_id,
                        multCommissions: this.$app.isNull(e.multiple_provider) ? null : e.multiple_provider.map(workerItem => {
                            return workerItem.map(em => {
                                return {
                                    sp_grouping_name: em.g_name,
                                    sv_employee_id: em.e_id,
                                    sv_employee_name: em.e_name,
                                    sv_employee_number: em.e_number,
                                    sv_employee_photo: em.e_photo,
                                    isAppoint: em.type === 1 ? true : false,
                                    percent: em.percent,
                                    selectedType: em.selectedType,
                                    sv_sex: em.sv_sex,
                                }
                            })
                        }),
                        number: e.product_num,
                        setmealId: setmealId,
                        productChangePrice,
                        remark: e.remark,
                    }
                });
                // if (res.member_id != 0) this.requsetMemberInfo(res.member_id);
                let obj = {
                    member_id: res.member_id,
                    list: goodsList
                }
                this.meiyeTakeOrder(obj);
                this.update({
                    key: 'selectedInfo',
                    data: {
                        ...this.selectedInfo,
                        sv_without_list_id: res.sv_pending_order_id,
                        sv_catering_grade: res.sv_catering_grade || null
                    }
                });
                this.update({
                    key: 'selectedEmployee',
                    data: {
                        sv_employee_id: res.sv_bizemployee_id,
                        sv_employee_name: res.sv_bizemployee_name,
                        sv_employee_photo: res.sv_bizemployee_photo,
                        wt_datetime: res.wt_datetime,
                        sv_sex: res.sv_sex,
                        sv_remark: res.sv_remark
                    }
                });
                this.showServicesPrrson = false;
                this.showCashier = true;
            });
        },
        handleDelete(item) {
            this.$confirm('是否删除当前挂单？').then(_ => {
                stockApi.deleteWithOrderList({ withListId: item.id }).then(res => {
                    if (res.succeed) {
                        this.$message({ message: '删除成功', type: 'success' });
                        this.queryList.page = 1;
                        this.getServiceOrders(true);
                    }
                });
            }).catch(_ => {

            });
        },
        //#endregion

        //#region   事件
        handleEnter() {
            return false
        },
        handleScroll() {                                    // 定点列表滚动监听事件
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 300;
            if (scrollTop > this.$refs.peddingListWrap.offsetHeight && !this.isDataLast) {
                this.queryList.page++;
                this.getServiceOrders();
            }
        },
        dateChange(time) {                                  // 时间筛选
            this.queryList.date = this.$app.currentTime(new Date(time), 'yyyy-MM-dd');
            this.queryList.page = 1;
            this.getServiceOrders(true);
        },
        handleFilterServicer(item) {                        // 员工筛选
            if (this.$app.isNull(item)) {
                if (this.queryList.id === 0) return this.filterServicerStatus = false;
            } else {
                if (this.queryList.id === item.sv_employee_id) return this.filterServicerStatus = false;
            }
            this.queryList.id = this.$app.isNull(item) ? 0 : item.sv_employee_id;
            this.btnFilterText = this.$app.isNull(item) ? '选择开单人' : item.sv_employee_name;
            this.queryList.page = 1;
            this.getServiceOrders(true);
        },

        handleNumberChange(number) {                        // 确定牌号
            this.inputHandNumber = number;
            if (this.clickEmployeeItem.sv_employee_id) {    // 如果是点击底部员工
                this.handleShowCashier(this.clickEmployeeItem);
                return
            }
            this.showCashier = false;
            this.showServicesPrrson = true;
        },
        showPendingList() {                                 // 展示挂单页
            this.showServicesPrrson = false;
            this.showCashier = false;
            this.queryList.page = 1;
            this.queryList.sv_catering_grade = '';
            this.getServiceOrders(true);
            this.getUiGroupingEmployeeList();
            this.$nextTick(() => {
                !!this.$refs.isSetHandNumber && this.$refs.isSetHandNumber.focus()
            })
        },
        handleOrderStart() {                                // 点击开单
            if (this.isSetHandNumber) {
                this.clickEmployeeItem = {};
                this.inputHandNumber = '';
                this.numberChangeStatus = true;
                return
            }
            this.showCashier = false;
            this.showServicesPrrson = true;
        },
        handlEemployee(item) {                              // 点击头像
            if (this.isSetHandNumber) {
                this.clickEmployeeItem = item;
                this.inputHandNumber = '';
                this.numberChangeStatus = true;
                return
            }
            this.handleShowCashier(item);
        },
        handleShowCashier(item) {                           // services-person 点击头像回调
            this.update({
                key: 'selectedInfo',
                data: {
                    preOrderMoney: 0,
                    sv_without_list_id: null,
                    sv_catering_grade: this.inputHandNumber || null
                }
            });
            this.showServicesPrrson = false;
            this.showCashier = true;
            this.clearCartting();
            this.update({
                key: 'selectedEmployee',
                data: item
            })
        },
        //#endregion
    }
};
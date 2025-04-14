import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import popTableList from '../../../../base/popTableList/popTableList.vue';
import popTableAnd from '../../../../base/popTableAnd/popTableAnd.vue';
import carttingCoffee from '../../../../base/carttingCoffee/carttingCoffee.vue';
import carttingCoffeeMore from '../../../../base/carttingCoffeeMore/carttingCoffeeMore.vue';
import carttingPreOrder from '../../../../base/carttingPreOrder/carttingPreOrder.vue';
import cashierRight from '../cashierRight/cashierRight.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../../base/memberRecharge/memberRecharge.vue';
import cateringReturn from '../../../../base/cateringReturn/cateringReturn.vue';
import updateBillabletimeSelect from '../../../../base/updateBillabletimeSelect/updateBillabletimeSelect.vue';
export default {
    components: { numberChange, popTableList, popTableAnd, carttingCoffee, carttingCoffeeMore, carttingPreOrder, cashierRight, memberAdd, memberRecharge, cateringReturn, updateBillabletimeSelect },
    name: 'c-cashier',
    props: {
        dataJson: {
            type: Object,
            default: () => {
                return {
                    producttype: '-1'
                }
            }
        }
    },
    data() {
        return {
            isSubmitting: false,                                // 是否在提交下单 加菜
            isOrderBack: false,                                 // 是否反结账
            sv_is_rouse: 0,                                     // 餐饮等叫 0 等叫 1 需要起菜
            isOrderList: null,                                  // 餐饮订单列表
            tableInfo: {
                sv_billable_id: null,
                billabletime_code: null,
                sv_table_id: null,
                booking_type: 0,                                // 0-普通 1-预付金 : 2-预约时间
                is_have_prepayment: false,                      // 是否支付预付金
                is_online_order: false,                         // 是否小程序下单
                sv_region_name: '',
                sv_employee_id: 0,
                sv_employee_name: null,
                sv_without_list_id: null,
                sv_table_name: '',
                sv_person_num: '',
                preknot_time: '',
                sv_table_using_state: null,
                sv_service_fee_json: [],
                sv_remark: '',
                wt_datetime: '',
                mergeCateringTableIds: [],
                preOrderMoney: 0,
            },
            popPreknotTime: false,                              // 修改自动预结时间
            sv_preknot_hour: 0,                                 // 自动预结帐小时
            sv_preknot_minute: 0,                               // 自动预结帐分钟
            update_preknot_time: '',                            // 展示的修改后自动预结时间
            mergeCateringList: [],
            billabletimeUpdateStatus: false,                    // 修改计费规则弹窗
            billabletimeTipsStatus: false,                      // 暂停恢复弹窗
            billableTimer: null,                                // 计费循环时间器
            billabletimeInfo: {                                 // 计费数据
                id: null,
                configId: null,
                code: '',
                configNameId: '',
                configName: '',                                     // 计费名称
                startTime: '',                                      // 开始时间
                endTime: '',                                        // 结束时间
                durationUpdateTime: '',                             // 时长更新时间
                duration: null,                                     // 累积时长
                durationString: '',                                 // 累积时长string
                status: -1,                                         // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                statusString: '',                                   // 计费状态
                totalMoney: 0,                                      // 计费金额
                pauseDuration: null,                                // 有效暂停时长
                pauseTime: null,                                    // 可暂停时长
                canPause: false,                                    // 是否允许暂停
            },

            cateringReturnInfo: {                               // 退菜信息
                title: '退菜',
                money: 0,                                           // 单价金额
                number: 1
            },
            returnNumberStatus: false,                          // 退货数量状态
            orderData: {                                        // 房台下单后数据
                productResults: []
            },

            dishContentList: [],                                // 餐饮加菜列表
            searchText: '',                                     // 搜索关键字输入框绑定
            searchKeywords: '',                                 // 搜索关键字传组件
            popTableListStatus: false,                          // 房台列表弹窗
            popTableAndStatus: false,                           // 并台弹窗
            popTableData: {
                title: '',
                dataType: 0
            },
            numberChangeStatus: false,                          // 修改就餐人数
            preOrderStatus: false,                              // 预付金列表
            moreTableStatus: false,                             // 并台信息
            memberAddImport: '',
            memberAddStatus: false,                             // 新增会员弹窗
            memberRechargeStatus: false,                        // 会员充值弹窗
            categoryFirstStatus: false,                         // 新增一级分类弹窗
            categorySecondStatus: false,                        // 新增二级分类弹窗
            firstSelected: 0,                                   // 一级菜单选中
            firstSelectedItem: {                                // 一级菜单选中item
                id: -1,
                label: ''
            },
            secondSelected: 0,                                  // 二级菜单选中
            secondSelectedItem: {                               // 二级菜单选中item
                id: -1,
                label: ''
            },
            isOrderList: false,
            firstCategory: [],
            secondCategory: [],
            tipsNum: 0                                          // 消息提示数量
        }
    },
    computed: {
        ...mapState(['isCefClient', 'userInfo', 'caleStep', 'carttingData', 'takeASingleCale3', 'cashierJurisdiction', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'pricingScaleData', 'user_local_data', 'carttingSearchCursor', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return this.memberInfo.member_id !== ''
        },
        orderTotalMoney() {
            let billabletimeMoney = 0;
            if (this.mergeCateringList.length > 0) {
                this.mergeCateringList.forEach(e => {
                    if (e.billabletime) billabletimeMoney += e.billabletime.totalMoney
                })
            } else {
                billabletimeMoney = this.billabletimeInfo.totalMoney
            }
            this.orderData.productResults.forEach(e => {
                if (e.billabletime_code) {
                    billabletimeMoney = this.$app.addNumber(e.dealMoney, billabletimeMoney || 0)
                }
            })
            const caleMoney = this.$app.moneyFixed(this.$app.addNumber(this.orderData.dealMoney || 0, billabletimeMoney || 0))
            return this.takeASingleCale3.sv_isbeforehand && this.takeASingleCale3.sv_order_actual_money > 0 ? this.$app.moneyFixed(this.takeASingleCale3.sv_order_actual_money) : caleMoney
        },
        carttingTotalMoney() {
            return this.$app.moneyFixed(this.$app.addNumber(this.carttingData.dealMoney || 0, this.billabletimeInfo.totalMoney || 0))
        },
        isShowClearTable() {
            let allReturn = this.$app.isNull(this.orderData.productResults) ? null : this.orderData.productResults.filter(e => e.sv_return_status !== 2);
            return !this.$app.isNull(allReturn) && allReturn.length > 0 ? false : true
        },
        scaleSwitch() {
            return this.user_local_data.scaleSwitch
        },
        waittingStatus() {
            return this.sv_is_rouse === 1 ? true : false
        },
        dataLength() {
            let length = 0;
            if (this.$app.isNull(this.orderData.productResults)) return length;
            this.orderData.productResults.forEach(e => {
                length = this.$app.addNumber(length, e.number)
            })
            return length
        },
    },
    watch: {
        carttingSearchCursor: {                                         // 监听购物车商品加入结束
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
                    })
                }
            }
        },
        billabletimeInfo: {
            handler(newVal, oldVal) {
                if (newVal.status === 1 || newVal.status === 2) {
                    // 暂停或者运行中
                    if (this.tableInfo.sv_table_using_state !== 5) {
                        // 非预结单
                        this.startBillableTimer();
                    }
                }
                if (newVal.pauseDuration >= newVal.pauseTime && newVal.pauseTime > 0 && newVal.status === 2 && this.caleStep === 1) {
                    // 暂停超时，需要弹出提示窗口
                    this.billabletimeTipsStatus = true;
                }
            }
        },
    },
    beforeMount() {
        this.isOrderBack = this.$route.query.isOrderBack || false;
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
        }
        this.tableInfo.sv_table_id = this.dataJson.sv_table_id;
        this.tableInfo.sv_table_using_state = this.dataJson.sv_table_using_state;
        const takeOrderStatus = [1, 2, 4, 5, 9];
        if (takeOrderStatus.includes(this.tableInfo.sv_table_using_state)) {
            // 使用中，页面取单
            this.isOrderList = true;
        }
        !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
            })
        });
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });
        this.$root.$on('restaurant', this.pageFocus);
        this.$root.$on('updateCateringState', this.updateCateringState);
        this.$root.$on('preOrdered', this.getCateringModel);
        this.$root.$on('showCatting', () => {
            this.isOrderList = false;
        });

        this.getCateringRegionPageList()                            // 获取消息提示数
        this.getFirstCategory();
        if (this.isOrderBack) {
            this.getReturnTableInfo();
            return
        }
        this.clearCartting();
        this.getCateringModel();
    },
    beforeDestroy() {
        this.$root.$off('restaurant', this.updateCateringState);
        this.$root.$off('updateCateringState', this.updateCateringState);
        this.$root.$off('preOrdered', this.getCateringModel);
        this.clearBillableTimer();
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'clearCartting', 'clearMember', 'syncCarttingData', 'setCateringReturn', 'touchCarttingCursor']),
        ...mapActions(['requsetMemberInfo']),
        handleCashier() {
            if (this.moreTableStatus) {
                this.moreTableStatus = false;
            }
            if (this.preOrderStatus) {
                this.preOrderStatus = false;
            }
        },
        pageFocus() {
            this.$nextTick(() => {
                this.$refs.restaurant && this.$refs.restaurant.focus();
            })
        },
        handleCloseBillable() {
            this.handleStatusIcon();
        },
        //#endregion
        handleHexiao() {                                            // 点击核销图标
            this.$root.$emit('keyCode', 1001);
        },
        handleMessage() {                                           // 点击消息图标
            this.$router.push({
                path: '/messageManagemen/priceChange'
            })
        },
        handleBack() {                                              // 返回房台
            if (this.isOrderBack) {
                this.$router.push('/cashier/orderList');
                return
            }
            if (!this.isOrderList && !this.$app.isNull(this.orderData.productResults)) {
                return this.isOrderList = true;
            }
            if (this.carttingData.productResults.length !== 0 && this.tableInfo.sv_table_using_state !== 4) {
                this.$confirm('您有未下单的菜，返回后将清空，是否返回？', '提示', {
                    confirmButtonText: '确定',
                    cancleButtonText: '取消',
                    callback: action => {
                        if (action === 'confirm') {
                            this.clearCartting();
                            this.$root.$emit('onTable');
                        }
                    }
                });
                return
            }
            this.$root.$emit('onTable');
        },
        clearBillableTimer() {                                      // 清除计时费timer
            console.log('clear');
            clearTimeout(this.billableTimer);
            this.billableTimer = null;
            this.update({
                key: 'billabletimeInfo',
                data: {
                    id: null,
                    configId: '',
                    configNameId: '',
                    configName: '',                                     // 计费名称
                    startTime: '',                                      // 开始时间
                    endTime: '',                                        // 结束时间
                    duration: '',                                       // 累积时长
                    durationString: '',
                    status: -1,                                         // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                    statusString: '',                                   // 计费状态
                    totalMoney: 0,                                      // 计费金额
                }
            })
            this.billabletimeInfo.status = -1;
        },
        pauseBillableTimer() {                                      // 暂停计时费timer
            console.log('pause');
            this.billabletimeInfo.status = 2;
        },
        startBillableTimer() {
            let tableBillableRunningStatus = false, goodsBillableRunningStatus = false
            if (this.billabletimeInfo.status === 1 || this.billabletimeInfo.status === 2) {
                if (this.billabletimeInfo.configId === this.tableInfo.sv_billable_id) {
                    tableBillableRunningStatus = true;
                }
            }
            const postData = this.orderData.productResults.filter(k => k.isAssistant).map(e => {
                return {
                    code: e.billabletime_code,
                    endTime: this.tableInfo.preknot_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
            })
            if (postData.length > 0) {
                goodsBillableRunningStatus = true;
            }
            if (tableBillableRunningStatus || goodsBillableRunningStatus) {
                console.log('start');
                const cycleTime = 60000;
                this.billableTimer = setTimeout(() => {
                    Promise.all([this.getTableBillabletime(), this.getGoodsBillabletime()]).then(res => {
                        clearTimeout(this.billableTimer);
                        this.billableTimer = null;
                        this.startBillableTimer();
                    });
                }, cycleTime)
            } else {
                clearTimeout(this.billableTimer);
                this.billableTimer = null;
            }
        },
        showBillableTimeUpdate() {
            this.billabletimeUpdateStatus = true;
        },
        handleBillableTimeUpdate(code) {
            this.tableInfo.billabletime_code = code;
            this.getTableBillabletime();
            this.getCateringModel();
        },
        updateCateringState(type) {                                  // 餐饮结算成功更新房台
            // state 1需要自动清桌 2展示手动清桌弹窗 3预打
            stockApi.updateCateringState({ tableId: this.tableInfo.sv_table_id, state: type }).then(res => {
                if (res || res === null) {
                    if (type === 1) this.handleBack();
                }
            });
        },
        returnWithout_list_id(val) {
            this.tableInfo.sv_without_list_id = val === 0 ? null : val;
        },
        handleClearTable() {                                        // 清房台
            this.$refs.restaurant.blur();
            this.$alert('清空当前房台？', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if (action === 'confirm') {
                        let obj = { operateTableId: this.tableInfo.sv_table_id, operateType: 1, sv_table_using_state: 1 };
                        stockApi.OperateCateringTableByOperateType(obj).then(res => {
                            if (res || res === null) {
                                this.$message.success('清台成功');
                                this.handleBack();
                            }
                        });
                    } else {
                        this.pageFocus();
                    }
                }
            });
        },
        handleClearTableOrShowOrder() {                             // 展示订单或者请房台
            if (this.$app.isNull(this.orderData.productResults)) return this.handleClearTable();
            return this.isOrderList = true
        },
        handleNumberChange(val) {                                   // 修改就餐人数
            this.tableInfo.sv_person_num = parseInt(val);
            this.updateTableInfo(1);
        },
        handleReturnNumberChange(data) {                            // 退菜数量填写返回
            let dataList = JSON.parse(JSON.stringify(this.orderData.productResults));
            let item = dataList[this.$refs.carttingCoffee.getOrderListPos()];
            let number_return = parseFloat(data.number);
            item.number_return = number_return;
            item.remark = data.remark;
            if (data.psw) item.refundPassword = data.psw;
            if (item.number === number_return) {
                item.sv_return_status = 2;
                item.totalMoney = 0;
            } else {
                item.number = this.$app.subtractNumber(item.number, parseFloat(data.number));
                item.sv_return_status = 1;
                let dataIndex = dataList.findIndex(e => e.id === item.id);
                let spliceItem = {
                    ...item,
                    number: number_return,
                    sv_return_status: 2,
                    totalMoney: 0
                }
                dataList.splice(dataIndex + 1, 0, spliceItem);
            }
            let array = [];
            array.push({
                ...item,
                number: number_return
            });
            this.saveProductReturnRecord(item, () => {
                this.returnNumberStatus = false;
                this.takeASingleUpdateCatering(dataList, '退菜成功', () => {
                    this.$nextTick(() => {
                        this.$refs.cashierRight.getGoodsList();
                    });
                });
                this.getKitchenPrinter(JSON.parse(JSON.stringify(array)), 'return');
                this.handelFrontPrint(JSON.parse(JSON.stringify(array)), 3);
            });
        },
        handleRefresh() {
            this.$message.success('操作成功');
            this.takeASingleAndPrint();
            this.getCateringModel();
        },
        handleUpdateTable(val) {                                    // 0 换台 1 并台 2 移菜
            if (val.type === 1) {
                // 并台
                stockApi.mergeCateringTable({
                    sv_source_type: 100,
                    operateTableId: this.tableInfo.sv_table_id,
                    mergeCateringTableIds: val.list
                }).then(res => {
                    if (res) {
                        this.popTableAndStatus = false;
                        this.$message.success('操作成功');
                        this.takeASingleAndPrint();
                        this.getCateringModel();
                    }
                })
                return
            }
            if (val.type === 2) {
                // 移菜
                let query = {
                    sv_table_id_org: this.tableInfo.sv_table_id,
                    sv_table_id_new: val.id,
                    list_id: [this.orderData.productResults[this.$refs.carttingCoffee.currentPos].sv_without_product_id],
                    sv_without_list_id_org: this.tableInfo.sv_without_list_id,
                    sv_without_list_id_new: val.sv_without_list_id,
                    sv_p_source: 100
                }
                stockApi.editRestaurant_Dishes(query).then(res => {
                    this.$message.success('移菜成功');
                    this.handleBack()
                });
                return
            }

            stockApi.operateCateringTable({
                operateTableId: this.tableInfo.sv_table_id,
                changeOrFightCateringTableId: val.id,
                operateType: val.type === 0 ? 3 : 5
            }).then(res => {
                if (res) {
                    let printTableName = this.tableInfo.sv_table_name + '->' + val.name;
                    this.tableInfo.sv_table_id = val.id;
                    this.tableInfo.sv_table_name = val.name;
                    this.popTableListStatus = false;
                    this.$message.success('操作成功');
                    if (this.$app.isNull(this.orderData.productResults)) {
                        this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
                    } else {
                        this.takeASingleAndPrint(() => {
                            this.getKitchenPrinter(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 'change' : 'and', printTableName);
                            this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
                        });
                    }
                    this.getCateringModel();
                }
            });
        },
        caterCallback(type) {                                       // 单品起菜
            if (type === 1) {
                // 移菜
                this.popTableListStatus = true;
                this.popTableData = {
                    tableId: this.tableInfo.sv_table_id,
                    tableName: this.tableInfo.sv_table_name,
                    title: '移单 - 选择房台',
                    dataType: 2
                }
                return
            }
            if (type === 2) {
                // 起菜
                if (this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()].sv_is_rouse !== 1) return this.$message.warning('菜品不需要起菜')
                stockApi.updateTableRouse({
                    tableId: this.tableInfo.sv_table_id,
                    sv_is_rouse: 2,
                    sv_without_product_ids: [this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()].sv_without_product_id]
                }).then(res => {
                    if (res) {
                        this.$message.success('起菜成功');
                        this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()].sv_is_rouse = 2;
                        this.getKitchenPrinter([this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()]], 'unWait');
                    }
                });
                return
            }
            if (type === 3) {
                // 退菜
                this.handleBtnControl(3);
                return
            }
        },
        showPreOrder() {                                            // 展示预付金列表
            this.preOrderStatus = !this.preOrderStatus;
        },
        showMoreTable() {
            this.moreTableStatus = !this.moreTableStatus;
        },
        handleBtnControl(type) {                                    // 订单按钮回调
            if (type === 1) {
                // 加菜
                this.isOrderList = false;
                return
            }
            if (type === 2) {
                // 催菜
                let dataList = [];
                if (this.$refs.carttingCoffee.getOrderListPos() === -1) {
                    dataList = this.orderData.productResults;
                } else {
                    dataList.push(this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()]);
                }
                const ids = dataList.filter(e => e.sv_return_status !== 2).map(e => e.sv_without_product_id);
                if (ids.length < 1) return this.$message.warning('没有菜品需要催单');
                stockApi.updateTableUrgedishes({
                    sv_without_list_id: this.tableInfo.sv_without_list_id,
                    sv_source_type: 100,
                    sv_without_product_ids: ids
                }).then(res => {
                    if (res) {
                        this.$message.success('已通知厨房尽快为您上菜');
                        this.getKitchenPrinter(JSON.parse(JSON.stringify(dataList)), 'call');
                    }
                });
                return
            }
            if (type === 3) {
                // 退菜
                if (this.$refs.carttingCoffee.getOrderListPos() === -1) return this.$message.warning('请选择要退的菜品')
                if (this.orderData.productResults[this.$refs.carttingCoffee.getOrderListPos()].sv_return_status === 2) return this.$message.warning('选择菜品已退')
                let dataList = JSON.parse(JSON.stringify(this.orderData.productResults));
                let item = dataList[this.$refs.carttingCoffee.getOrderListPos()];
                this.cateringReturnInfo = {
                    title: '退单',
                    money: item.dealPrice,
                    number: item.number
                }
                return this.returnNumberStatus = true;
            }
            if (type === 4) {
                // 起菜
                if (this.$app.isNull(this.orderData.productResults)) return this.$message.warning('没有菜品需要起菜')
                let hasRouse = this.orderData.productResults.filter(e => e.sv_is_rouse === 1);
                if (hasRouse.length === 0) return this.$message.warning('没有菜品需要起菜');
                stockApi.updateTableRouse({
                    tableId: this.tableInfo.sv_table_id,
                    sv_is_rouse: 2,
                    sv_source_type: 100,
                    sv_without_product_ids: []
                }).then(res => {
                    if (res) {
                        this.$message.success('起菜成功');
                        let printDataList = this.orderData.productResults.filter(e => e.sv_is_rouse === 1);
                        this.orderData.productResults.forEach(item => {
                            item.sv_is_rouse = item.sv_is_rouse === 1 ? 2 : item.sv_is_rouse;
                        });
                        this.getKitchenPrinter(printDataList, 'unWait');
                    }
                });
                return
            }
            if (type === 5) {
                // 并台
                this.popTableAndStatus = true;
                this.popTableData = {
                    tableId: this.tableInfo.sv_table_id,
                    tableName: this.tableInfo.sv_table_name,
                    title: '并台 - 选择房台',
                    dataType: 1
                }
                return
            }
            if (type === 6) {
                // 换台
                this.popTableListStatus = true;
                this.popTableData = {
                    tableId: this.tableInfo.sv_table_id,
                    tableName: this.tableInfo.sv_table_name,
                    title: '换台 - 选择房台',
                    dataType: 0
                }
                return
            }
        },
        clearCarttingList() {                                       // 清空购物车
            this.$root.$emit('keyCode', 112);
        },
        handleSearch() {
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.cashierRight.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        handleSearchCheckIn() {                                     // 搜索栏按空格键直接弹结算
            this.$refs.searchKeywords.blur();
            this.showCheckin();
        },
        handleEnter() {
            if (this.isOrderList) {
                if (this.isShowClearTable) return this.handleClearTable()
                return this.showCheckin()
            }
            return this.handleOrder()
        },
        showMemberList() {                                          // 显示会员选择列表
            this.$root.$emit('setUseType', 'allow_Consumption');
            this.$root.$emit('keyCode', 117);
        },
        showMemberAdd(dataObj) {                                    // 显示新增会员弹窗
            this.memberAddStatus = true;
            if (this.$app.isNull(dataObj)) {
                this.memberAddImport = {
                    newType: 'phone',
                    val: ''
                };
            }
        },
        handleSubtract(item, index) {                               // 加菜数量减
            if (item.product_num <= 1) return;
            item.product_num -= 1;
            this.$set(this.dishContentList, index, item);
        },
        handleAdd(item, index) {                                    // 加菜数量加
            item.product_num += 1;
            this.$set(this.dishContentList, index, item);
        },
        getRemark(remark) {
            this.update({
                key: 'selectedInfo',
                data: {
                    ...this.selectedInfo,
                    sv_remark: remark
                }
            });
        },
        handleOrderRemark() {                                       // 填写整单备注
            this.$prompt('请输入备注内容', '整单备注', {
                inputPlaceholder: '请输入备注内容，限100个字',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{0,100}$/,
                inputValue: this.tableInfo.sv_remark || '',
                inputErrorMessage: '请输入备注内容，限100个字',
            }).then(({ value }) => {
                this.tableInfo.sv_remark = value;
                this.updateTableInfo(2);
            }).catch(e => {

            });
            return
        },
        handleCancelPreTime() {                                     // 取消预结
            this.$confirm('是否取消预结?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stockApi.updateCateringState({ tableId: this.tableInfo.sv_table_id, state: 8 }).then(res => {
                    if (res || res === null) {
                        this.getCateringModel();
                        this.update({
                            key: 'takeASingleCale3',
                            data: {
                                sv_isbeforehand: false,
                                tableId: null,
                                member_id: '',
                                sv_integral: 0,
                                sv_coupon_record_ids: [],
                                sv_employee_ids: '',
                                sv_order_receivable: 0,
                                sv_order_actual_money: 0
                            }
                        });
                    }
                });
            }).catch(() => {

            });
        },
        handleStatusIcon() {                                        // 点击计费状态按钮
            // 非运行中或者暂停中无法通过按钮操作状态
            if (this.billabletimeInfo.status !== 1 && this.billabletimeInfo.status !== 2) return
            if (this.billabletimeInfo.status === 1) {
                stockApi.billabletimePause({ code: this.billabletimeInfo.code }).then(res => {
                    // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                    this.pauseColse();
                    this.getTableBillabletime();
                });
                return
            }
            if (this.billabletimeInfo.status === 2) {
                stockApi.billabletimeResume({ code: this.billabletimeInfo.code }).then(res => {
                    // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                    this.billabletimeTipsStatus = false;
                    this.resumeOpen();
                    this.getTableBillabletime();
                });
                return
            }
        },
        handleShowUpdatePreknotTime() {                             // 弹出修改自动预结时间
            this.popPreknotTime = true;
            this.update_preknot_time = this.tableInfo.preknot_time;
        },
        handleUpdatePreknotSelect() {
            const newTime = new Date(this.tableInfo.preknot_time).getTime() + (this.sv_preknot_hour * 60 + this.sv_preknot_minute) * 60 * 1000;
            this.update_preknot_time = this.$app.currentTime(new Date(newTime), 'yyyy-MM-dd HH:mm:ss')
        },
        handleUpdatePreknotTime() {                                 // 修改自动预结时间
            if (this.sv_preknot_hour === 0 && this.sv_preknot_minute === 0) return this.popPreknotTime = false;
            const postData = {
                sv_table_id: this.tableInfo.sv_table_id,
                sv_preknot_hour: this.sv_preknot_hour,
                sv_preknot_minute: this.sv_preknot_minute,
                sv_type: 7,
            }
            stockApi.operateCateringTableUsing(postData).then(res => {
                if (res || res === null) {
                    this.popPreknotTime = false;
                    this.$message.success('修改成功');
                    this.getTableBillabletime();
                    this.getCateringModel();
                }
            });
        },
        pauseColse() {                                              // 暂停计时关灯
            stockApi.pauseColse({ tableId: this.tableInfo.sv_table_id });
        },
        resumeOpen() {                                              // 恢复计时开灯并延长预结时长
            stockApi.resumeOpen({ tableId: this.tableInfo.sv_table_id });
        },
        getReturnTableInfo() {                                      // 通过挂单id获取房台基础信息
            if (this.$app.isNull(this.selectedInfo.sv_without_list_id) || this.selectedInfo.sv_without_list_id === '0') {
                // return this.$message.warning('没有查到挂单信息');
                return
            }
            let query = {
                wtId: parseInt(this.selectedInfo.sv_without_list_id)
            }
            stockApi.getCateringModelByWtId(query).then(res => {
                if (res) {
                    this.tableInfo = {
                        sv_billable_id: res.sv_billable_id,
                        is_have_prepayment: res.is_have_prepayment,
                        is_online_order: res.is_online_order,
                        booking_type: res.booking_type,
                        preOrderMoney: this.tableInfo.preOrderMoney,
                        billabletime_code: res.billabletime_code,
                        sv_region_name: res.sv_region_name,
                        sv_table_using_state: this.tableInfo.sv_table_using_state,
                        preknot_time: res.preknot_time,
                        sv_without_list_id: res.sv_without_list_id,
                        sv_table_id: res.sv_table_id,
                        sv_employee_id: res.sv_employee_id,
                        sv_employee_name: res.sv_employee_name,
                        sv_table_name: res.sv_table_name,
                        sv_person_num: res.sv_person_num,
                        sv_service_fee_json: JSON.parse(res.sv_service_fee_json),
                        sv_remark: res.sv_remark || this.selectedInfo.sv_remark,
                        sv_table_prekont_date: res.sv_table_prekont_date || null,
                        wt_datetime: this.$app.currentTime(new Date(res.wt_datetime), 'yyyy-MM-dd HH:mm:ss'),
                        mergeCateringTableIds: res.mergeCateringTableIds || []
                    }
                }
            });
        },
        getTableBillabletime() {
            return stockApi.getBillabletime({ code: this.tableInfo.billabletime_code, dateTime: this.tableInfo.sv_table_prekont_date }).then(res => {
                if (res) {
                    this.billabletimeInfo = {
                        id: res.id,
                        configId: res.configId,
                        code: res.code,
                        configNameId: 'Billabletime-' + res.configId,
                        configName: res.configName,
                        startTime: res.startTime,
                        endTime: '',
                        duration: res.duration,
                        durationString: res.durationString,
                        durationUpdateTime: res.durationUpdateTime,
                        status: res.status,                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                        statusString: res.statusString,
                        totalMoney: res.totalMoney,
                        pauseDuration: res.pauseDuration,
                        pauseTime: res.pauseTime,
                        canPause: res.pauseTime > 0
                    }
                    this.update({
                        key: 'billabletimeInfo',
                        data: this.billabletimeInfo
                    })
                    // !!fn && fn()

                }
            });
        },
        getGoodsBillabletime() {
            const postData = this.orderData.productResults.filter(k => k.isAssistant).map(e => {
                return {
                    code: e.billabletime_code,
                    endTime: this.tableInfo.preknot_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
            })
            if (postData.length === 0) return
            return stockApi.getBantchBillabletime(postData).then(res => {
                if (res) {
                    (res || []).forEach(item => {
                        if (item.code === 1) {
                            const billableItem = item.data;
                            const billableIndex = this.orderData.productResults.findIndex(e => e.billabletime_code === billableItem.code)
                            if (billableIndex > -1) {
                                const productItem = this.orderData.productResults[billableIndex];
                                productItem.dealMoney = billableItem.totalMoney;
                                productItem.dealPrice = billableItem.totalMoney;
                                productItem.billable = billableItem;
                                this.$set(this.orderData.productResults, billableItem, billableIndex);
                            }
                        } else {
                            this.$message.error(item.msg)
                        }
                    })
                }
            });
        },
        getCateringModel() {                                        // 获取房台基础信息
            let query = {
                tableId: this.tableInfo.sv_table_id
            }
            stockApi.getCateringModel(query).then(res => {
                if (res) {
                    this.tableInfo = {
                        sv_billable_id: res.sv_billable_id,
                        booking_type: res.booking_type,
                        is_have_prepayment: res.is_have_prepayment,
                        is_online_order: res.is_online_order,
                        preOrderMoney: this.tableInfo.preOrderMoney,
                        billabletime_code: res.billabletime_code,
                        sv_table_using_state: res.sv_table_using_state,
                        sv_without_list_id: res.sv_without_list_id || null,
                        sv_table_id: res.sv_table_id,
                        preknot_time: res.preknot_time,
                        sv_employee_id: res.sv_employee_id,
                        sv_employee_name: res.sv_employee_name,
                        sv_region_name: res.sv_region_name,
                        sv_table_name: res.sv_table_name,
                        sv_person_num: res.sv_person_num,
                        sv_service_fee_json: JSON.parse(res.sv_service_fee_json),
                        sv_remark: res.sv_remark,
                        sv_table_prekont_date: res.sv_table_prekont_date || null,
                        wt_datetime: this.$app.currentTime(new Date(res.wt_datetime), 'yyyy-MM-dd HH:mm:ss'),
                        mergeCateringTableIds: res.mergeCateringTableIds || []
                    }
                    if (this.tableInfo.is_have_prepayment) {
                        // 预付金
                        this.getPrepaymentMoney4Table();
                    }
                    if (this.tableInfo.mergeCateringTableIds.length > 0) {
                        const dataArray = [{ sv_table_id: this.tableInfo.sv_table_id, sv_without_list_id: this.tableInfo.sv_without_list_id }, ...this.tableInfo.mergeCateringTableIds]
                        this.getMergeCateringList(dataArray);
                    } else {
                        this.moreTableStatus = false;
                        this.preOrderStatus = false;
                    }
                    if (!this.$app.isNull(this.tableInfo.billabletime_code)) this.getTableBillabletime();
                }
            });
        },
        getPrepaymentMoney4Table() {
            let query = {
                tableId: this.tableInfo.sv_table_id
            }
            stockApi.getPrepaymentMoney4Table(query).then(res => {
                this.tableInfo.preOrderMoney = res;
                this.tableInfo.is_have_prepayment = this.tableInfo.preOrderMoney > 0 ? true : false;
            });
        },
        getMergeCateringList(tableList) {
            stockApi.getMergeCateringList(tableList).then(res => {
                if (res) {
                    this.mergeCateringList = res;
                }
            });
        },
        saveProductReturnRecord(item, callback) {
            let query = {
                sv_without_product_id: item.sv_without_product_id,
                sv_without_list_id: this.tableInfo.sv_without_list_id,
                product_id: item.productId,
                product_num: item.number_return,
                product_price: this.$app.multiplyNumber(item.dealPrice, item.number_return),
                product_num_before: item.product_num,
                product_price_before: this.$app.multiplyNumber(item.dealPrice, item.number),
                sv_remark: item.remark
            }
            if (item.refundPassword) query.refundPassword = item.refundPassword;
            stockApi.saveProductReturnRecord(query).then(res => {
                if (res) {
                    !!callback && callback();
                }
            });
        },
        getKitchenPrinter(dataList, type, tableName) {              // 获取厨打方案并打印
            // // 后厨打印已转为推送打印后厨
            // return
            let ids = [];
            dataList.forEach(e => {
                if (e.isPackage) {
                    e.packageGroups.forEach(p => {
                        p.products.forEach(k => {
                            ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), packageproduct_id: e.productId, packagegroup_id: p.id, product_id: k.productId })
                        })
                    })
                } else {
                    ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), product_id: e.productId, packageproduct_id: 0, packagegroup_id: 0 })
                }
            })
            if (ids.length === 0) return
            stockApi.getKitchenPrinter(ids).then(res => {
                if (res) {
                    this.sv_is_rouse = 0;                   // 打印数据保存后，清除状态
                    // 厨打 type-厨打类型 add-加菜单 return-退菜单 online-厨打单 change-换台 and-并台
                    const extendInfo = {
                        isWaitting: this.sv_is_rouse === 1 ? true : false,
                        tableName: tableName || this.tableInfo.sv_table_name,
                        everyday_serialnumber: '',
                        orderTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        remark: this.tableInfo.sv_remark,
                    }
                    kitchenPrintMain(res, dataList, type, extendInfo);
                }
            });
        },
        takeASingleAndPrint(returnFn) {                             // 取单并打印
            let query = {
                tableId: this.tableInfo.sv_table_id
            }
            stockApi.takeASingle(query).then(res => {
                if (res) {
                    this.tableInfo.sv_without_list_id = res.sv_without_list_id;
                    this.update({
                        key: 'takeASingleCale3',
                        data: {
                            sv_isbeforehand: res.sv_isbeforehand,
                            tableId: this.tableInfo.sv_table_id,
                            member_id: res.member_id,
                            sv_integral: res.sv_integral,
                            sv_coupon_record_ids: res.sv_coupon_record_ids,
                            sv_employee_ids: res.sv_employee_ids,
                            sv_order_receivable: res.sv_order_receivable,
                            sv_order_actual_money: res.sv_order_actual_money
                        }
                    });
                    if (this.tableInfo.sv_table_using_state === 4) {
                        // 待接单
                        this.syncCarttingData(res);
                    } else {
                        this.isOrderList = true;
                        this.clearCartting();
                        this.clearMember();
                        this.update({
                            key: 'takeASingleCale3',
                            data: {
                                sv_isbeforehand: res.sv_isbeforehand,
                                tableId: this.tableInfo.sv_table_id,
                                member_id: res.member_id,
                                sv_integral: res.sv_integral,
                                sv_coupon_record_ids: res.sv_coupon_record_ids,
                                sv_employee_ids: res.sv_employee_ids,
                                sv_order_receivable: res.sv_order_receivable,
                                sv_order_actual_money: res.sv_order_actual_money
                            }
                        });
                        this.orderData = {
                            ...res,
                            productResults: (res.productResults || []).map((e, i) => {
                                let multCommissions = [];
                                (e.multiple_provider || []).forEach((workerItem) => {
                                    let emArray = [];
                                    workerItem.forEach(em => {
                                        emArray.push({
                                            selectedType: em.selectedType || '',
                                            isAppoint: em.isAppoint || false,
                                            sv_employee_id: em.e_id,
                                            sv_employee_name: em.e_name,
                                            sv_employee_number: em.e_number,
                                            sv_employee_photo: em.e_photo,
                                            grouping_name: em.g_name,
                                            percent: em.percent,
                                            status: e.without_project_status,
                                            start_time: e.without_project_start_time,
                                            end_time: e.without_project_end_time,
                                        });
                                    })
                                    multCommissions.push(emArray);
                                })
                                return {
                                    ...e,
                                    isAssistant: this.$app.isNull(e.billabletime_code) ? false : true,
                                    multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                                }
                            })
                        }
                        if (!this.$app.isNull(res.member_id)) this.requsetMemberInfo(res.member_id);
                        !!returnFn && returnFn();
                    }
                }
            });
        },
        updateTableInfo(type) {                                     // 修改人数和备注
            let query = {
                sv_type: type,                                      // 1人数 2备注
                sv_table_id: this.tableInfo.sv_table_id,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                user_id: this.userInfo.user_id,
                sv_order_source: 0
            }
            stockApi.updatePersonNumRemark(query).then(res => {
                if (res) {
                    return this.$message.success('修改成功')
                }
            });
        },
        post_guadan() {                                             // 开台后下单
            if (this.isSubmitting) return;
            if (this.carttingData.productResults.length < 1) return;
            // this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'online');
            // this.handelFrontPrint(JSON.parse(JSON.stringify(this.carttingData.productResults)), 1);
            // return

            let prlist = this.carttingData.productResults.map((e, i) => {
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_is_rouse: e.waittingStatus ? 1 : 0,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney,
                    without_project_status: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].status : 0,
                    without_project_start_time: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].start_time : '',
                    without_project_end_time: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].end_time : '',
                    multiple_provider_list: e.multCommissions[0].length === 0 ? null : e.multCommissions.map(workerItem => {
                        return workerItem.map(em => {
                            return {
                                selectedType: em.selectedType,
                                isAppoint: em.isAppoint,
                                sv_billable_id: em.billable_id || 0,
                                billabletime_code: em.billabletime_code || '',
                                e_id: em.employeeId,
                                percent: em.percent,
                                status: em.status,
                                start_time: em.start_time,
                                end_time: em.end_time
                            }
                        })
                    })
                }
            });
            let query = {
                sv_order_source: 0,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                sv_table_id: this.tableInfo.sv_table_id,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_table_is_together: false,                        // 是否拼桌
                sv_without_list_id: this.$app.isNull(this.selectedInfo.sv_without_list_id) ? 0 : this.selectedInfo.sv_without_list_id,
                wt_datetime: this.tableInfo.wt_datetime,
                sv_order_data_type: 0
            }
            this.isSubmitting = true;
            stockApi.post_guadan(query).then(res => {
                this.isSubmitting = false;
                if (res) {
                    this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'online');
                    this.handelFrontPrint(JSON.parse(JSON.stringify(this.carttingData.productResults)), 1);

                    this.tableInfo.sv_table_using_state = 2;
                    this.isOrderList = true;
                    this.clearCartting();
                    this.$nextTick(() => {
                        this.$refs.cashierRight.getGoodsList();
                    });
                    return this.$message.success('下单成功')
                }
            }).catch(_ => {
                this.isSubmitting = false;
            })
        },
        update_guadan() {                                           // 预付选会员，更新挂单
            let dataList = JSON.parse(JSON.stringify(this.orderData.productResults));
            this.takeASingleUpdateCatering(dataList, null, null);
        },
        takeASingleUpdateCatering(dataList, tips, callBackFn) {     // 修改挂单 
            // if (dataList.length < 1) return;
            let prlist = dataList.map(e => {
                let multiple_provider_list = [];
                (e.multCommissions || []).forEach(workerItem => {
                    let emArray = []
                    workerItem.forEach(em => {
                        emArray.push({
                            selectedType: em.selectedType || '',
                            sv_billable_id: em.billable_id || 0,
                            billabletime_code: em.billabletime_code || '',
                            isAppoint: em.isAppoint || false,
                            e_id: em.e_id || em.sv_employee_id,
                            percent: em.percent
                        })
                    })
                    multiple_provider_list.push(emArray)
                })
                return {
                    product_id: e.productId,
                    sv_without_product_id: e.sv_without_product_id,
                    product_price: e.price,
                    product_name: e.productName,
                    sv_table_id_old: e.sv_table_id_old,
                    multiple_provider_list: e.sv_return_status === 2 ? null : multiple_provider_list,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_is_rouse: e.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney,
                }
            });

            let query = {
                sv_order_source: 0,
                wt_datetime: this.tableInfo.wt_datetime,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                sv_table_id: this.tableInfo.sv_table_id,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_table_is_together: false,                        // 是否拼桌
                sv_order_data_type: 0
            }
            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    this.isOrderList = true;
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.update({
                        key: 'takeASingleCale3',
                        data: {
                            sv_isbeforehand: res.sv_isbeforehand,
                            tableId: this.tableInfo.sv_table_id,
                            member_id: res.member_id,
                            sv_integral: res.sv_integral,
                            sv_coupon_record_ids: res.sv_coupon_record_ids,
                            sv_employee_ids: res.sv_employee_ids,
                        }
                    });
                    this.orderData = {
                        ...res,
                        productResults: (res.productResults || []).map((e, i) => {
                            let multCommissions = [];
                            (e.multiple_provider || []).forEach((workerItem) => {
                                let emArray = [];
                                workerItem.forEach(em => {
                                    emArray.push({
                                        sv_billable_id: em.billable_id || 0,
                                        billabletime_code: em.billabletime_code || '',
                                        selectedType: em.selectedType || '',
                                        isAppoint: em.isAppoint || false,
                                        sv_employee_id: em.e_id,
                                        sv_employee_name: em.e_name,
                                        sv_employee_number: em.e_number,
                                        sv_employee_photo: em.e_photo,
                                        grouping_name: em.g_name,
                                        percent: em.percent,
                                        status: e.without_project_status,
                                        start_time: e.without_project_start_time,
                                        end_time: e.without_project_end_time,
                                    });
                                })
                                multCommissions.push(emArray);
                            })

                            return {
                                ...e,
                                isAssistant: this.$app.isNull(e.billabletime_code) ? false : true,
                                multCommissions: multCommissions.length === 0 ? [[]] : multCommissions
                            }
                        })
                    }
                    this.getGoodsBillabletime(this.orderData.productResults);
                    this.touchCarttingCursor();
                    !!callBackFn && callBackFn();
                    return tips && this.$message.success(tips)
                }
            });
        },
        addToOrder() {                                              // 加菜
            const permissionItem = this.CashierManage.openCateringTable_add_dish || { enabled: true }
            if (!permissionItem.enabled) {
                return this.$message.warning(permissionItem.tips)
            }
            let dataList = [];
            if (this.carttingData.productResults < 1) return;
            let carttingDataList = this.carttingData.productResults.map((e, i) => {
                return {
                    ...e,
                    sv_is_rouse: e.waittingStatus ? 1 : 0,
                    is_add: true,
                    sv_table_id_old: this.tableInfo.sv_table_id,
                    without_project_status: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].status : 0,
                    without_project_start_time: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].start_time : '',
                    without_project_end_time: e.multCommissions[0].length > 0 ? e.multCommissions[0][0].end_time : '',
                    multiple_provider_list: e.multCommissions[0].length === 0 ? null : e.multCommissions.map(workerItem => {
                        return workerItem.map(em => {
                            return {
                                selectedType: em.selectedType,
                                isAppoint: em.assign,
                                sv_billable_id: em.billable_id || 0,
                                e_id: em.employeeId,
                                percent: em.percent,
                                status: em.status,
                                start_time: em.start_time,
                                end_time: em.end_time
                            }
                        })
                    })
                }
            })
            dataList = this.orderData.productResults.map(e => {
                let multiple_provider_list = [];
                (e.multCommissions || []).forEach(workerItem => {
                    let emArray = []
                    workerItem.forEach(em => {
                        emArray.push({
                            selectedType: em.selectedType || '',
                            sv_billable_id: em.billable_id || 0,
                            billabletime_code: e.billabletime_code || '',
                            isAppoint: em.isAppoint || false,
                            e_id: em.sv_employee_id,
                            percent: em.percent
                        })
                    })
                    multiple_provider_list.push(emArray)
                })
                return {
                    ...e,
                    multiple_provider_list,
                    sv_without_list_id: this.tableInfo.sv_without_list_id,
                    without_project_status: e.without_project_status,
                    without_project_time: e.without_project_time,
                }
            }).concat(carttingDataList);
            if (dataList.length < 1) return;
            let prlist = dataList.map((e, i) => {
                return {
                    product_id: e.productId,
                    sv_without_product_id: e.sv_without_product_id,
                    product_price: e.price,
                    product_name: e.productName,
                    is_add: e.is_add,
                    sv_table_id_old: e.sv_table_id_old,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    // sv_p_unitprice: e.price,
                    sv_is_rouse: this.$app.isNull(e.sv_is_rouse) ? (this.sv_is_rouse ? 1 : 0) : e.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney,
                    without_project_status: e.without_project_status,
                    without_project_start_time: e.without_project_start_time,
                    without_project_end_time: e.without_project_end_time,
                    multiple_provider_list: e.multiple_provider_list,
                }
            });
            let query = {
                sv_order_source: 0,
                wt_datetime: this.tableInfo.wt_datetime,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                sv_table_id: this.tableInfo.sv_table_id,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_table_is_together: false,                        // 是否拼桌
                sv_order_data_type: 0
            }

            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    // 加菜打印
                    this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'add');
                    this.handelFrontPrint(JSON.parse(JSON.stringify(this.carttingData.productResults)), 2);

                    this.isOrderList = true;
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.touchCarttingCursor();
                    this.$nextTick(() => {
                        this.$refs.cashierRight.getGoodsList();
                    });
                    stockApi.updateCateringState({ tableId: this.tableInfo.sv_table_id, state: 8 }).then(res => {
                        if (res || res === null) {
                            this.getCateringModel();
                            this.update({
                                key: 'takeASingleCale3',
                                data: {
                                    sv_isbeforehand: false,
                                    tableId: null,
                                    member_id: '',
                                    sv_integral: 0,
                                    sv_coupon_record_ids: [],
                                    sv_employee_ids: '',
                                    sv_order_receivable: 0,
                                    sv_order_actual_money: 0
                                }
                            });
                        }
                    });
                    this.$message.success('下单成功');
                }
            });
        },
        handleSubmitOrder() {                                       // 下单
            if (this.isOrderBack && !this.$app.isNull(this.carttingData.productResults)) {
                this.update({
                    key: 'selectedInfo',
                    data: {
                        ...this.selectedInfo,
                        sv_table_name: this.tableInfo.sv_table_name,
                        sv_person_num: this.tableInfo.sv_person_num,
                        sv_remark: this.tableInfo.sv_remark
                    }
                });
                this.$root.$emit('keyCode', 13);
                return
            }
            if (this.$app.isNull(this.orderData.productResults)) {
                if (this.carttingTotalMoney && this.$app.isNull(this.carttingData.productResults)) {
                    // 购物车状态，计时费大于0，发起结算
                    this.showCheckin();
                    return
                }
                // 下单
                const permissionItem = this.CashierManage.openCateringTable_order || { enabled: true }
                if (!permissionItem.enabled) {
                    return this.$message.warning(permissionItem.tips)
                }
                return this.post_guadan();
            }
            this.addToOrder();
        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
            let syncToCart = JSON.parse(JSON.stringify(this.orderData));
            syncToCart.productResults = this.orderData.productResults.map(e => {
                let billabletime = null;
                if (!this.$app.isNull(e.billabletime_code)) {
                    billabletime = {
                        dateTime: e.billable.durationUpdateTime,
                        duration: e.billable.duration,
                        money: e.billable.totalMoney,
                        code: e.billable.code
                    }
                    return {
                        ...e,
                        productId: e.productId,
                        billabletime,
                        isHidden: true,
                        configNameId: 'Billabletime-' + e.billable.configId,
                        productName: e.productName,
                        barCode: '',
                        number: 1,
                        unitName: '',
                        price: e.billable.totalMoney,
                        productChangePrice: e.billable.totalMoney,
                        couponMoney: 0,
                        sv_return_status: 0,
                        dealMoney: e.billable.totalMoney,
                    }
                }
                return {
                    ...e
                }
            })
            if (this.mergeCateringList.length > 0) {
                let feeList = [];
                this.mergeCateringList.forEach(e => {
                    if (e.billabletime) {
                        let billabletime = null;
                        if (!this.$app.isNull(e.billabletime.code)) {
                            billabletime = {
                                dateTime: e.billabletime.durationUpdateTime,
                                duration: e.billabletime.duration,
                                money: e.billabletime.totalMoney,
                                code: e.billabletime.code
                            }
                        }
                        if (e.billabletime.totalMoney > 0) {
                            let feeItem = {
                                productId: 0,
                                billabletime,
                                isHidden: true,
                                configNameId: 'Billabletime-' + e.billabletime.configId,
                                productName: e.billabletime.configName,
                                barCode: '',
                                number: 1,
                                unitName: '',
                                price: e.billabletime.totalMoney,
                                productChangePrice: e.billabletime.totalMoney,
                                couponMoney: 0,
                                sv_return_status: 0,
                                dealMoney: e.billabletime.totalMoney,
                            }
                            feeList.push(feeItem);
                        }
                    }
                })
                syncToCart.productResults = [...feeList, ...syncToCart.productResults];
            } else {
                if (!this.$app.isNull(this.billabletimeInfo.totalMoney) && !this.$app.isNull(this.billabletimeInfo.id)) {
                    let billabletime = null;
                    if (!this.$app.isNull(this.billabletimeInfo.code)) {
                        billabletime = {
                            dateTime: this.billabletimeInfo.durationUpdateTime,
                            duration: this.billabletimeInfo.duration,
                            money: this.billabletimeInfo.totalMoney,
                            code: this.billabletimeInfo.code
                        }
                    }
                    let feeItem = {
                        productId: 0,
                        billabletime,
                        isHidden: true,
                        configNameId: 'Billabletime-' + this.billabletimeInfo.configId,
                        productName: this.billabletimeInfo.configName,
                        barCode: '',
                        number: 1,
                        unitName: '',
                        price: this.billabletimeInfo.totalMoney,
                        productChangePrice: this.billabletimeInfo.totalMoney,
                        couponMoney: 0,
                        sv_return_status: 0,
                        dealMoney: this.billabletimeInfo.totalMoney,
                    }
                    syncToCart.productResults.unshift(feeItem);
                }
            }
            this.billabletimeInfo.endTime = this.tableInfo.sv_table_prekont_date || this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.update({
                key: 'billabletimeInfo',
                data: this.billabletimeInfo
            })
            if (syncToCart.productResults.length < 1) return this.$message.warning('还未下单商品，无法结算');
            syncToCart.givePromotions = [];
            syncToCart.productResults = syncToCart.productResults.filter(e => e.sv_return_status !== 2)
            let hasReturn = this.orderData.productResults.filter(e => e.sv_return_status === 2).map(e => {
                return {
                    ...e,
                    productName: '(退)' + e.productName
                }
            });
            this.update({
                key: 'selectedInfo',
                data: JSON.parse(JSON.stringify(this.tableInfo))
            });
            this.clearCartting();
            this.syncCarttingData(syncToCart);
            this.setCateringReturn(hasReturn);
            this.$root.$emit('keyCode', 13);
        },
        //#region 
        getFirstCategory() {                                        // 获取商品一级分类
            stockApi.getFirstCategory({ is_cashier: true }).then(res => {
                if (res) {
                    this.firstCategory = this.$app.isNull(res) ? [] : res;
                    this.touchCarttingCursor();
                }
            });
        },
        getSecondCategory() {                                       // 获取商品二级分类
            stockApi.getSecondCategory({ cid: this.firstSelectedItem.id }).then(res => {
                if (res.succeed) {
                    this.secondCategory = this.$app.isNull(res.values) ? [] : res.values;
                    this.touchCarttingCursor();
                }
            });
        },
        handelFrontPrint(dataList, printType) {                     // 餐饮前台单
            // printType 1宾客单  
            // return // 后厨打印已转为推送打印后厨
            if (!this.cashierJurisdiction.PrintSet_guestorderprint) return;
            let printTypeText = ['', '宾客单', '加菜单', '退菜单', '换台单', '并台单'];
            let printDataList = [];

            let dataArray1 = [
                {
                    type: 'line',
                    text: this.userInfo.sv_us_shortname,
                    size: 17,
                    lineHeight: 30,
                    align: 1,
                    spaceLine: 0
                },
                {
                    type: 'line',
                    text: printTypeText[printType],
                    size: 14,
                    lineHeight: 24,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '房台：' + this.tableInfo.sv_table_name,
                    align: 0,
                    spaceLine: 0,
                    size: 12,
                    lineHeight: 20
                },
                {
                    type: 'line',
                    text: '时间：' + this.$app.currentTime(new Date()),
                    align: 0,
                    spaceLine: 0
                },
                {
                    type: 'line',
                    text: '操作员：' + this.userInfo.sv_ul_name,
                    align: 0,
                    spaceLine: 0
                }
            ]
            // 合并打印数组-第一部分
            printDataList = printDataList.concat(dataArray1);
            let tableData = {
                header: ['商品/编码', '数量', '单价', '小计'],
                list: [],
                footer: []
            }
            let buyNumber = 0, dealMoney = 0;
            tableData.list = dataList.map(e => {
                buyNumber = this.$app.addNumber(buyNumber, e.number);
                dealMoney += this.$app.multiplyNumber(e.dealPrice, e.number);
                let specs = '', tastes = '', chargings = ''
                e.specs.forEach(k => {
                    specs += '[' + k.name + k.price + '元]'
                })
                e.tastes.forEach(k => {
                    tastes += '[' + k.name + k.price + '元]'
                })
                e.chargings.forEach(k => {
                    chargings += '[' + k.name + k.price + '元]'
                })
                let productName = e.productName + specs + tastes + chargings;
                return {
                    name: e.isPackage ? '※' + productName : productName,
                    code: e.barCode,
                    number: e.number + '',
                    remark: e.remark || null,
                    specs: [],
                    tastes: [],
                    chargings: [],
                    couponMoney: e.productCouponMoney,
                    price: this.$app.moneyFixed(e.price, 2),
                    dealPrice: e.dealPrice,
                    total: this.$app.moneyFixed(e.dealMoney, 2),
                    packageGroups: e.isPackage ? e.packageGroups : null
                }
            })
            tableData.footer = ['合计', buyNumber + '', '', this.$app.moneyFixed(dealMoney)];
            let isDriverType = this.cashierJurisdiction.printName.indexOf('免驱动') < 0;
            let tableArray = this.$app.printTableDateCater(tableData, isDriverType, this.$store.state.printTemplate.salesData.width);
            // 合并打印数组-表格
            printDataList = printDataList.concat(tableArray);

            // 宾客单和加菜单不打印合计以后的内容
            let shopInfo = []
            // 宾客单\加菜单\退菜单不要地址、电话
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '电话：' + this.userInfo.sv_us_phone, align: 0, spaceLine: 0 })
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '地址：' + this.userInfo.sv_us_address, align: 0, spaceLine: 0 })

            shopInfo.push({ type: 'line', text: '备注：' + (this.$app.isNull(this.tableInfo.sv_remark) ? '' : this.tableInfo.sv_remark), align: 0, spaceLine: 2 })

            // 宾客单\加菜单\退菜单不要谢谢惠顾
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1, spaceLine: 0 })

            printDataList = printDataList.concat(shopInfo);

            this.$print.sales(printDataList);
        },
        getCateringRegionPageList() {                               // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        }
    }
};
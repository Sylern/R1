import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from "vuex";
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import popTableList from '../../../../base/popTableList/popTableList.vue';
import cartting from '../../../../base/cartting/cartting.vue';
import carttingCater from '../../../../base/carttingCater/carttingCater.vue';
import goodsList from '../../../../base/goodsList/goodsList.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../../base/memberRecharge/memberRecharge.vue';
import cateringReturn from '../../../../base/cateringReturn/cateringReturn.vue';
import categoryFirstAdd from '../../../../base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '../../../../base/categorySecondAdd/categorySecondAdd.vue';
export default {
    components: { numberChange, popTableList, cartting, carttingCater, goodsList, memberAdd, memberRecharge, cateringReturn, categoryFirstAdd, categorySecondAdd },
    name: 'c-cashier',
    props: {
        dataJson: {
            type: Object,
            default: () => {
                return {

                }
            }
        }
    },
    data() {
        return {
            isSubmitting: false,                                // 是否在提交下单 加菜
            isOrderBack: false,                                 // 是否反结账
            priceScaleTimer: null,                              // 电子计价秤延迟事件
            confingList: ['Set_Hareware_Scale'],
            priceScaleCatchMessage: false,
            priceScaleData: {                                   // 电子计价秤配置
                scale_Type: '',
                scale_Baud: '',
                Scale_Port: ''
            },
            sv_is_rouse: 0,                                     // 餐饮等叫 0 等叫 1 需要起菜
            isOrderList: false,                                 // 餐饮订单列表
            tableInfo: {
                sv_table_id: null,
                sv_without_list_id: null,
                sv_table_name: '',
                sv_person_num: '',
                sv_table_using_state: null,
                sv_service_fee_json: [],
                sv_remark: '',
                preOrderMoney: 0,
                wt_datetime: ''
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
            popTableData: {
                title: '',
                dataType: 0
            },
            numberChangeStatus: false,                          // 修改就餐人数
            memberAddImport: null,
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
            goodsWrapHeight: '',                                // 商品列表的高度
            firstCategory: [],
            secondCategory: [],
            templateList: [],                                   // 标签模板

            tipsNum: 0                                          // 消息提示数量
        }
    },
    computed: {
        ...mapState(['isCefClient', 'userInfo', 'carttingData', 'cashierJurisdiction', 'memberInfo', 'couponCountNumber', 'takeASingleCale3', 'selectedInfo', 'pricingScaleData', 'user_local_data', 'carttingSearchCursor', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return this.memberInfo.member_id !== ''
        },
        service_fee_data() {
            let text = '', name = '', number = 1, type, price = 0, total = 0;
            let feeList = this.$app.isNull(this.tableInfo.sv_service_fee_json) ? [] : this.tableInfo.sv_service_fee_json;
            if (feeList.length > 0) {
                let item = feeList[0];
                text = item.name + ' - ';
                if (item.type === 2) {
                    text += '收取消费金额的' + item.price + '%';
                    name = item.name;
                    let dataPrice = this.orderData.productResults.length > 0 ? this.orderData.dealMoney : this.carttingData.dealMoney;
                    price = this.$app.divideNumber(item.price * dataPrice, 100);
                    total = price;
                    type = item.type;
                }
                if (item.type === 3) {
                    text += '每人收取' + item.price + '元';
                    name = item.name;
                    number = this.tableInfo.sv_person_num;
                    price = item.price;
                    total = this.$app.multiplyNumber(item.price, this.tableInfo.sv_person_num);
                    type = item.type
                }
            }
            return {
                text: text,
                name: name,
                number: number,
                type: type,
                price: price,
                total: total
            }
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
        'orderData.dealMoney': {
            handler(newVal, oldVal) {
                if (this.customerDisplayData.enable) {
                    this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 2, this.$app.addNumber(newVal, this.service_fee_data.price));
                }
            }
        }
    },
    beforeMount() {
        this.isOrderBack = this.$route.query.isOrderBack || false;
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
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
        this.getCateringRegionPageList()                            // 获取消息提示数
        this.getFirstCategory();
        this.clearCartting();
        this.clearMember();
        if (this.isOrderBack) {
            this.getReturnTableInfo();
            return
        }
        this.$root.$on('restaurant', this.pageFocus);
        this.$root.$on('updateCateringState', this.updateCateringState);
        this.tableInfo.sv_table_id = this.dataJson.code;
        this.handleCarttingShow();                                  // 监听加菜
        this.clearCartting();
        this.getCateringModel();
        this.tableInfo.sv_table_using_state = this.dataJson.sv_table_using_state;
        if (this.tableInfo.sv_table_using_state === 2 || this.tableInfo.sv_table_using_state === 4 || this.tableInfo.sv_table_using_state === 5) {
            // 使用中，页面取单
            this.isOrderList = true;
            // this.takeASingle();
        }                                      // 获取销售单号
        // this.calcGoodsWrapHeight();
        this.getUserModuleConfigs();
    },
    beforeDestroy() {
        this.$root.$off('restaurant', this.updateCateringState);
        this.$root.$off('updateCateringState', this.updateCateringState);
        this.priceScaleStop();
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'clearCartting', 'clearMember', 'syncCarttingData', 'setCateringReturn', 'touchCarttingCursor']),
        pageFocus() {
            this.$nextTick(() => {
                this.$refs.restaurant && this.$refs.restaurant.focus();
            })
        },
        //#region 电子计价秤
        getUserModuleConfigs() {                                    // 获取配置
            if (!this.isCefClient) return;
            stockApi.getUserModuleConfigs(this.confingList).then(res => {
                if (res) {
                    let dataPriceScale = res.find(e => e.sv_user_module_code === 'Set_Hareware_Scale');
                    let Set_Hareware_Scale_Type = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Type');
                    let Set_Hareware_Scale_Port = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Port');
                    let Set_Hareware_Scale_Baud = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Baud');
                    let Set_Hareware_Barcode = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Barcode');

                    let hasHarewareBarcodeDetail = !this.$app.isNull(Set_Hareware_Barcode.childDetailList);
                    this.updateUserLocalData({
                        ...this.user_local_data,
                        scaleSwitch: hasHarewareBarcodeDetail ? Set_Hareware_Barcode.childDetailList[0].sv_detail_is_enable : false
                    });

                    this.priceScaleData = {
                        scale_Type: this.$app.isNull(Set_Hareware_Scale_Type.childDetailList) ? '' : Set_Hareware_Scale_Type.childDetailList[0].sv_detail_value,
                        scale_Port: this.$app.isNull(Set_Hareware_Scale_Port.childDetailList) ? '' : Set_Hareware_Scale_Port.childDetailList[0].sv_detail_value,
                        scale_Baud: this.$app.isNull(Set_Hareware_Scale_Baud.childDetailList) ? '' : Set_Hareware_Scale_Baud.childDetailList[0].sv_detail_value
                    }
                    if (!this.scaleSwitch) return
                    if (!this.$app.isNull(this.priceScaleData.scale_Type) && !this.$app.isNull(this.priceScaleData.scale_Port) && !this.$app.isNull(this.priceScaleData.scale_Baud)) {
                        this.priceScaleStart();
                    }
                }
            })
        },
        priceScaleStart() {
            let demo_weight;
            this.priceScaleTimer = setInterval(async () => {
                try {
                    if (this.priceScaleData.scale_Type == 1) {
                        //大华电子秤
                        demo_weight = await Cef.DHGetWeight(this.priceScaleData.scale_Port, parseInt(this.priceScaleData.scale_Baud));
                        if (demo_weight) {
                            //大华电子秤
                            var weightModel = demo_weight;
                            if (weightModel) {
                                weightModel = weightModel.trim();
                                var weightModelLines = weightModel.split(' ');
                                if (weightModelLines && weightModelLines.length > 0) {
                                    for (var i = 0; i < 1; i++) {
                                        var weightData = parseInt(weightModelLines[i]) / 1000;
                                        if (weightData > 0) {
                                            // this.$message.error('1-'+parseFloat(weightData));
                                            // this.$message.error('2-'+parseFloat(this.pricingScaleData.tare));
                                            // this.$message.error('3-'+this.$app.moneyFixed(parseFloat(weightData) - parseFloat(this.pricingScaleData.tare)))
                                            this.update({
                                                key: 'pricingScaleData',
                                                data: {
                                                    tare: this.pricingScaleData.tare,
                                                    weight: this.$app.moneyFixed(this.$app.subtractNumber(weightData, this.pricingScaleData.tare), 3) || '0.00',
                                                    unit_price: this.pricingScaleData.unit_price,
                                                    total_price: this.pricingScaleData.total_price,
                                                    isStabilize: true
                                                }
                                            });
                                            this.priceScaleCatchMessage = false;
                                        }

                                        if (!this.$app.verifyNumber(weightData)) {
                                            this.$message.error("大华电子秤：read=" + demo_weight);
                                            clearInterval(this.priceScaleTimer);
                                        }
                                        break;
                                    }
                                }
                            }
                        } else {
                            this.update({
                                key: 'pricingScaleData',
                                data: {
                                    tare: this.pricingScaleData.tare,
                                    weight: '0.00',
                                    unit_price: '',
                                    total_price: '',
                                    isStabilize: true
                                }
                            })
                        }
                    } else {
                        //顶尖电子秤
                        demo_weight = await Cef.GetWeight(this.priceScaleData.scale_Port, parseInt(this.priceScaleData.scale_Baud));
                        if (demo_weight) {
                            //顶尖电子秤
                            var weightModel = JSON.parse(demo_weight);
                            this.update({
                                key: 'pricingScaleData',
                                data: {
                                    tare: this.pricingScaleData.tare,
                                    weight: this.$app.moneyFixed(this.$app.subtractNumber(weightData, this.pricingScaleData.tare), 3) || '0.00',
                                    unit_price: this.pricingScaleData.unit_price,
                                    total_price: this.pricingScaleData.total_price,
                                    isStabilize: true
                                }
                            })
                            this.priceScaleCatchMessage = false;
                            if (!this.$app.verifyNumber(weightModel.Weight)) {
                                clearInterval(this.priceScaleTimer);
                                this.$message.error("顶尖电子秤：read=" + demo_weight);
                            }
                        }
                    }

                } catch (e) {
                    // this.priceScaleStop();
                    // 已经弹出过异常提示的，不再二次提示，直到连接成功条码秤
                    if (this.priceScaleCatchMessage) return;
                    this.priceScaleCatchMessage = true;
                    this.$message.error(e.message + ',' + demo_weight);
                }
            }, 500);
        },
        priceScaleStop() {
            clearInterval(this.priceScaleTimer);
            this.priceScaleTimer = null;
        },
        handleTare() {                                              // 计重秤去皮
            if (this.$app.isNull(this.pricingScaleData.weight)) return;
            this.update({
                key: 'pricingScaleData',
                data: {
                    tare: this.pricingScaleData.weight,
                    weight: '0.00',
                    unit_price: '',
                    total_price: '',
                    isStabilize: true
                }
            })
        },
        handleReset() {                                             // 计重秤重置
            this.update({
                key: 'pricingScaleData',
                data: {
                    tare: '0.00',
                    weight: '0.00',
                    unit_price: '',
                    total_price: '',
                    isStabilize: true
                }
            })
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
                            this.orderData = {
                                productResults: []
                            }
                            this.$root.$emit('onTable');
                        }
                    }
                });
                return
            }
            this.$root.$emit('onTable');
        },
        handleCarttingShow() {                                      // 展示购物车
            this.$root.$on('showCatting', () => {
                this.isOrderList = false;
            });
        },
        updateCateringState(type) {                                 // 餐饮更新房台
            // state 1需要自动清桌 2展示手动清桌弹窗 3预打
            stockApi.updateCateringState({ tableId: this.tableInfo.sv_table_id, state: type }).then(res => {
                if (res || res === null) {
                    if (type === 1) this.handleBack();
                }
            });
        },
        returnWithout_list_id(val) {
            this.tableInfo.sv_without_list_id = val;
        },
        handleWaitting() {                                          // 改变商品等叫状态
            if (this.$app.isNull(this.carttingData.productResults)) return;
            this.sv_is_rouse = this.sv_is_rouse === 0 ? 1 : 0;
        },
        handleClearTable() {                                        // 清房台
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
            let item = dataList[this.$refs.carttingCater.getOrderListPos()];
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
                        this.$refs.goodsList.getGoodsList(true);
                    });
                });
                this.getKitchenPrinter(JSON.parse(JSON.stringify(array)), 'return');
                this.handelFrontPrint(JSON.parse(JSON.stringify(array)), 3);
            });
        },
        handleUpdateTable(val) {                                    // 0 换台 1 并台 2 移菜
            if (val.type === 2) {
                // 移菜
                let query = {
                    sv_table_id_org: this.tableInfo.sv_table_id,
                    sv_table_id_new: val.id,
                    list_id: [this.orderData.productResults[this.$refs.carttingCater.currentPos].sv_without_product_id],
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
                    this.takeASingleAndPrint(() => {
                        this.getKitchenPrinter(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 'change' : 'and', printTableName);
                        this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
                    });
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
                    title: '移菜 - 选择房台',
                    dataType: 2
                }
                return
            }
            if (type === 2) {
                // 起菜
                if (this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()].sv_is_rouse !== 1) return this.$message.warning('菜品不需要起菜')
                stockApi.updateTableRouse({
                    tableId: this.tableInfo.sv_table_id,
                    sv_is_rouse: 2,
                    sv_without_product_ids: [this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()].sv_without_product_id]
                }).then(res => {
                    if (res) {
                        this.$message.success('起菜成功');
                        this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()].sv_is_rouse = 2;
                        this.getKitchenPrinter([this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()]], 'unWait');
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
        handleBtnControl(type) {                                    // 订单按钮回调
            if (type === 1) {
                // 加菜
                this.isOrderList = false;
                return
            }
            if (type === 2) {
                // 催菜
                let dataList = [];
                if (this.$refs.carttingCater.getOrderListPos() === -1) {
                    dataList = this.orderData.productResults;
                } else {
                    dataList.push(this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()]);
                }
                const ids = dataList.filter(e => e.sv_return_status !== 2).map(e => e.sv_without_product_id);
                if (ids.length < 1) return this.$message.warning('没有菜品需要催菜');
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
                if (this.$refs.carttingCater.getOrderListPos() === -1) return this.$message.warning('请选择要退的菜品')
                if (this.orderData.productResults[this.$refs.carttingCater.getOrderListPos()].sv_return_status === 2) return this.$message.warning('选择菜品已退')
                let dataList = JSON.parse(JSON.stringify(this.orderData.productResults));
                let item = dataList[this.$refs.carttingCater.getOrderListPos()];
                this.cateringReturnInfo = {
                    title: '退菜',
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
                this.popTableListStatus = true;
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
            this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
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
        showMemberRecharge() {                                      // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        showCategorySecond() {                                      // 显示新增二级分类
            this.categorySecondStatus = true;
        },
        updateGoodsNumber(type) {                                   // 修改选中商品数量
            if (type == 'add') {
                this.$root.$emit('keyCode', 107);
            } else if (type == 'subtract') {
                this.$root.$emit('keyCode', 109);
            }
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
                inputValidator: /^.{0,100}$/,
                inputValue: this.tableInfo.sv_remark || '',
                inputErrorMessage: '请输入备注内容，限100个字',
            }).then(({ value }) => {
                this.tableInfo.sv_remark = value;
                if (this.isOrderList) this.updateTableInfo(2);
            }).catch(e => {

            });
            return
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
                        sv_table_using_state: this.tableInfo.sv_table_using_state,
                        sv_without_list_id: res.sv_without_list_id,
                        sv_table_id: res.sv_table_id,
                        sv_table_name: res.sv_table_name,
                        sv_person_num: res.sv_person_num,
                        preOrderMoney: 0,
                        sv_service_fee_json: JSON.parse(res.sv_service_fee_json),
                        sv_remark: res.sv_remark || this.selectedInfo.sv_remark,
                        wt_datetime: this.$app.currentTime(new Date(res.wt_datetime), 'yyyy-MM-dd HH:mm:ss')
                    }
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
                        sv_table_using_state: this.tableInfo.sv_table_using_state,
                        sv_without_list_id: res.sv_without_list_id,
                        sv_table_id: res.sv_table_id,
                        sv_table_name: res.sv_table_name,
                        sv_person_num: res.sv_person_num,
                        preOrderMoney: 0,
                        sv_service_fee_json: JSON.parse(res.sv_service_fee_json),
                        sv_remark: res.sv_remark,
                        wt_datetime: this.$app.currentTime(new Date(res.wt_datetime), 'yyyy-MM-dd HH:mm:ss')
                    }
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
                    if (this.tableInfo.sv_table_using_state === 4) {
                        // 待接单
                        this.syncCarttingData(res);
                    } else {
                        this.isOrderList = true;
                        this.clearCartting();
                        this.clearMember();
                        this.orderData = res;
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
                        !!returnFn && returnFn();
                    }
                }
            });
        },
        updateTableInfo(type) {                                     // 修改人数/备注
            let query = {
                sv_type: type,                                          // 1人数 2备注
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

            let prlist = this.carttingData.productResults.map(e => {
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    // sv_is_rouse: (this.sv_is_rouse ? 1 : 0),
                    sv_is_rouse: e.waittingStatus ? 1 : 0,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: e.totalMoney
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
                    // this.takeASingle();
                    // this.handleBack();
                    this.$nextTick(() => {
                        this.$refs.goodsList.getGoodsList(true);
                    });
                    return this.$message.success('下单成功')
                }
            }).catch(_ => {
                this.isSubmitting = false;
            })
        },
        takeASingleUpdateCatering(dataList, tips, callBackFn) {     // 修改挂单 
            if (dataList.length < 1) return;
            let prlist = dataList.map(e => {
                return {
                    product_id: e.productId,
                    sv_without_product_id: e.sv_without_product_id,
                    product_price: e.price,
                    product_name: e.productName,
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
                    product_total: e.totalMoney
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
                sv_order_data_type: 0
            }
            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    this.isOrderList = true;
                    this.orderData = res;
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
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.touchCarttingCursor();
                    !!callBackFn && callBackFn();
                    return this.$message.success(tips)
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
            let carttingDataList = this.carttingData.productResults.map(e => {
                return {
                    ...e,
                    sv_is_rouse: e.waittingStatus ? 1 : 0,
                    is_add: true
                }
            })
            dataList = this.orderData.productResults.concat(carttingDataList);
            if (dataList.length < 1) return;
            let prlist = dataList.map(e => {
                return {
                    product_id: e.productId,
                    sv_without_product_id: e.sv_without_product_id,
                    product_price: e.price,
                    product_name: e.productName,
                    is_add: e.is_add,
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
                    product_total: e.totalMoney
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
                    this.touchCarttingCursor();
                    this.$nextTick(() => {
                        this.$refs.goodsList.getGoodsList(true);
                    });
                    this.$message.success('下单成功');
                }
            });
        },
        handleOrder() {                                             // 下单
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
            if (this.orderData.productResults.length < 1) return this.$message.warning('还未下单商品，无法结算');
            let syncToCart = JSON.parse(JSON.stringify(this.orderData));
            if (this.service_fee_data.price > 0) {
                let feeItem = {
                    productId: 0,
                    productName: this.service_fee_data.name,
                    barCode: '',
                    number: this.service_fee_data.number,
                    unitName: '',
                    price: this.$app.moneyFixed(this.service_fee_data.price, 2),
                    productChangePrice: this.$app.moneyFixed(this.service_fee_data.price, 2),
                    couponMoney: 0,
                    sv_return_status: 0,
                    dealMoney: this.service_fee_data.price,
                }
                syncToCart.productResults.unshift(feeItem);
            }
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
            this.syncCarttingData(syncToCart);
            this.setCateringReturn(hasReturn);
            this.$root.$emit('keyCode', 13);
        },
        handleFirstCategoryAll() {                                  // 一级菜单点击事件-全部
            this.firstSelected = 0;
            this.secondSelected = 0;
            this.firstSelectedItem = {
                id: -1,
                label: ''
            };
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.$nextTick(() => {
                this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            });
        },
        handleFirstCategory(item, index) {                          // 一级菜单点击事件
            if (this.firstSelected == index && this.firstSelected != 0) return;
            this.firstSelected = index;
            this.firstSelectedItem = {
                id: item.productcategory_id,
                label: item.sv_pc_name
            };
            this.secondSelected = 0;
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.getSecondCategory(item.productcategory_id);
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        handleSecondCategoryAll() {                                 // 二级菜单点击事件-全部
            if (this.secondSelected == 0) return;
            this.secondSelected = 0;
            this.secondSelectedItem = {
                id: -1,
                label: ''
            };
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        handleSecondCategory(item, index) {                         // 二级菜单点击事件
            this.searchKeywords = this.searchText;
            if (this.secondSelected == index) return;
            this.secondSelected = index;
            this.secondSelectedItem = {
                id: item.productsubcategory_id,
                label: item.sv_psc_name
            };
            this.$nextTick(() => {
                this.$refs.goodsList.getGoodsList(true);
            });
        },
        firstAddBack() {                                            // 新增一级分类回调
            this.firstSelected++;
            this.getFirstCategory();
        },
        secondAddBack() {                                           // 新增二级分类回调
            this.getSecondCategory();
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
                    align: 1
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
                    size: 12,
                    lineHeight: 20
                },
                {
                    type: 'line',
                    text: '人数：' + this.tableInfo.sv_person_num
                },
                {
                    type: 'line',
                    text: '时间：' + this.$app.currentTime(new Date())
                },
                {
                    type: 'line',
                    text: '操作员：' + this.userInfo.sv_ul_name
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
                    total: this.$app.moneyFixed(this.$app.multiplyNumber(e.number, e.dealPrice), 2),
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
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '电话：' + this.userInfo.sv_us_phone })
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '地址：' + this.userInfo.sv_us_address })

            shopInfo.push({ type: 'line', text: '备注：' + (this.$app.isNull(this.tableInfo.sv_remark) ? '' : this.tableInfo.sv_remark), spaceLine: 2 })

            // 宾客单\加菜单\退菜单不要谢谢惠顾
            printType !== 1 && printType !== 2 && printType !== 3 && shopInfo.push({ type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1 })

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
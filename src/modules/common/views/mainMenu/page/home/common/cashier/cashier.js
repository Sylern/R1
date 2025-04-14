import { stockApi } from "@/api/index.js";
import { mapMutations, mapState, mapGetters } from "vuex";
import cartting from '../../../../base/cartting/cartting.vue';
import goodsList from '../../../../base/goodsList/goodsList.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../../base/memberRecharge/memberRecharge.vue';
import categoryFirstAdd from '../../../../base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '../../../../base/categorySecondAdd/categorySecondAdd.vue';
export default {
    components: { cartting, goodsList, memberAdd, memberRecharge, categoryFirstAdd, categorySecondAdd },
    name: 'c-cashier',
    props: {
        fastPayInfo: {
            type: Object,
            default: () => {
                return {
                    is_scancode: false,
                    isSet: false,
                    payment: ''
                }
            }
        }
    },
    data() {
        return {
            isSubmitting: false,                                // 是否在提交挂单
            priceScaleTimer: null,                              // 电子计价秤延迟事件
            confingList: ['Set_Hareware_Scale'],
            priceScaleCatchMessage: false,
            priceScaleData: {                                   // 电子计价秤配置
                scale_Type: '',
                scale_Baud: '',
                Scale_Port: ''
            },
            postPopStatus: false,                               // 挂单弹窗
            postPopText: '',                                    // 挂单输入
            searchText: '',                                     // 搜索关键字输入框绑定
            searchKeywords: '',                                 // 搜索关键字传组件
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

            tipsNum: 0                                          // 消息提示数量
        }
    },
    computed: {
        ...mapGetters(['hasStoreCard']),
        ...mapState(['isCefClient', 'settlementOrder', 'carttingData', 'carttingSearchCursor', 'userInfo', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'pricingScaleData', 'user_local_data', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        imgBase() {
            return stockApi.imgBase()
        },
        isOrderTake() {                                        // 展示挂单状态
            return this.carttingData.productResults.length > 0
        },
        scaleSwitch() {
            return this.user_local_data.scaleSwitch
        }
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
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
        }
        this.$nextTick(() => {
            !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
        })
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchKeywords && this.$refs.searchKeywords.focus();
            })
        })
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });

        this.$root.$on('handleOrderTake', () => {
            this.handleOrderTake();
        });

        this.getFirstCategory();
        this.getCateringRegionPageList()                            // 获取消息提示数
        // this.getUserModuleConfigs();
    },
    beforeDestroy() {
        this.priceScaleStop();
    },
    deactivated() {
        this.priceScaleStop();
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'clearCartting', 'clearMember', 'clearSelectedInfo', 'touchCarttingCursor']),
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
        handleTare() {                                              // 去皮
            this.$root.$emit('handleTare');
        },
        handleReset() {                                             // 重置
            this.$root.$emit('handleReset');
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
                                // alert('weightModel:'+ weightModel);
                                // alert('weightModelLines:'+ weightModelLines);
                                if (weightModelLines && weightModelLines.length > 0) {
                                    var weightData = parseInt(weightModelLines[0]) / 1000;
                                    this.priceScaleCatchMessage = false;
                                    this.update({
                                        key: 'pricingScaleData',
                                        data: {
                                            tare: this.pricingScaleData.tare,
                                            weight: this.$app.moneyFixed(parseFloat(weightData) - parseFloat(this.pricingScaleData.tare), 3) || '0.00',
                                            unit_price: this.pricingScaleData.unit_price,
                                            total_price: this.pricingScaleData.total_price,
                                            isStabilize: true
                                        }
                                    });

                                    if (!this.$app.verifyNumber(weightData)) {
                                        this.$message.error("大华电子秤：read=" + demo_weight);
                                        // clearInterval(this.priceScaleTimer);
                                    }
                                }
                            }
                        } else {
                            // this.update({
                            //     key: 'pricingScaleData',
                            //     data: {
                            //         tare: this.pricingScaleData.tare,
                            //         weight: '0.00',
                            //         unit_price: '',
                            //         total_price: '',
                            //     }
                            // })
                        }
                    } else {
                        //顶尖电子秤
                        demo_weight = await Cef.GetWeight(this.priceScaleData.scale_Port, parseInt(this.priceScaleData.scale_Baud));
                        if (demo_weight) {
                            //顶尖电子秤
                            var weightModel = JSON.parse(demo_weight);
                            this.priceScaleCatchMessage = false;
                            this.update({
                                key: 'pricingScaleData',
                                data: {
                                    tare: this.pricingScaleData.tare,
                                    weight: this.$app.moneyFixed(parseFloat(weightModel.Weight) - parseFloat(this.pricingScaleData.tare), 3),
                                    unit_price: this.pricingScaleData.unit_price,
                                    total_price: this.pricingScaleData.total_price,
                                }
                            })
                            if (!this.$app.verifyNumber(weightModel.Weight)) {
                                // this.priceScaleStop();
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
        //#endregion
        handleSearch() {
            if (this.$app.quickScanPayCheck(this.searchKeywords) && this.fastPayInfo.is_scancode) {
                this.$root.$emit('quickCashier', { payment: '扫码支付', authCode: this.searchKeywords })
                this.$refs.searchKeywords.blur();
                this.$nextTick(() => {
                    this.searchKeywords = '';
                });
                return
            }
            this.firstSelected = 0;                                 // 一级菜单置为全部
            this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        handleSearchCheckIn() {                                     // 搜索栏按空格键直接弹结算
            let permissionItem = this.CashierManage.Collection || { enabled: true };
            if (!permissionItem.enabled) return
            this.$refs.searchKeywords.blur();
            this.showCheckin();
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
        currentCardInfo() {
            return this.memberInfo.wallets_list.find(e => e.sv_wallet_id === this.memberInfo.sv_wallet_id) || {}
        },
        showStoreCard() {
            this.$root.$emit('keyCode', 80);
        },
        showEquityCard() {
            this.$root.$emit('keyCode', 85);
        },
        handleClearMember() {                                       // 清除选中会员
            this.clearMember();
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
        handleOrderTake() {                                         // 挂单-取单
            if (this.isOrderTake) {
                // 挂单
                this.postPopText = this.selectedInfo.sv_remark;
                this.postPopStatus = true;
                this.$nextTick(() => {
                    this.$refs.popOrderTake.focus();
                })
                return
            }
            this.$root.$emit('keyCode', 81);
        },
        handlePostPop() {                                           // 提交挂单
            if (this.isSubmitting) return;
            // if (this.$app.isNull(this.postPopText)) return this.$message.warning('请输入挂单备注');
            let prlist = this.carttingData.productResults.map(e => {
                return {
                    product_id: e.productId,
                    product_price: e.price,
                    product_name: e.productName,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: this.$app.isNull(e.productChangePrice) ? e.dealPrice : e.productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    tradePrice: e.tradePrice || null,
                    product_total: e.dealMoney
                }
            });
            let query = {
                sv_order_source: 0,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_remark: this.postPopText,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                // sv_without_list_id: this.$app.isNull(this.selectedInfo.sv_without_list_id) ? 0 : this.selectedInfo.sv_without_list_id,
                sv_without_list_id: 0,
                sv_order_data_type: 0
            }
            this.isSubmitting = true;
            stockApi.fast_post_guadan(query).then(res => {
                this.isSubmitting = false;
                if (res) {
                    this.clearCartting();
                    this.clearMember();
                    this.clearSelectedInfo();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.postPopText = '';
                    this.postPopStatus = false;
                    return this.$message.success('挂单成功')
                }
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },
        postFastPay() {
            this.$root.$emit('quickCashier', { payment: this.fastPayInfo.payment })
        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
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
        getCateringRegionPageList() {         // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        }
    }
};
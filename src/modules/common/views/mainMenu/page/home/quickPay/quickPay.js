import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from "vuex";
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import bindCode from '../../../base/bindCode/bindCode.vue';
export default {
    components: { payTypeList, bindCode },
    name: 'quickPay',
    data() {
        return {
            Forbid: '',
            ckeckInSuccessStatus: false,
            successTimer: null,
            successShowTime: 1,
            isSubmitting: false,
            AutoBindCode: {
                enable: false
            },
            needBindCode: false,                                // 是否需要绑定票码
            bindCodeStatus: false,                              // 绑定票码弹窗
            bindOrderId: null,                                  // 需要绑定票码的订单id
            payInfo: {
                queryId: '',
                svOrderListId: null,
                receivableMoney: null,                          // 应收金额
                money: null                                     // 扫码支付金额
            },
            paymentList: [],
            successInfo: {
                paymentList: [],                    // 支付
                orderId: '',                        // 订单号
                printTime: '',                      // 订单生成时间
                orderNumber: '',                    // 订单流水号-打印
                everyday_serialnumber: '',          // 每日流水号-取餐号
                receivableMoney: 0,                 // 应收
                couponMoney: 0,                     // 优惠
                dealMoney: 0,                       // 实收
                sv_mr_name: '',                     // 会员名称
                sv_mr_cardno: null,                 // 会员卡号
                availableamount: 0,                 // 储值余额
                availablepoint: 0,                  // 积分余额
                order_integral: 0,                  // 订单获得积分
                orderDeduction_integral: 0,         // 订单积分抵扣
                credit: 0                           // 欠款金额
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'isLightMeal', 'memberInfo', 'cashierJurisdiction', 'selectedInfo', 'carttingData', 'customerDisplayData']),
    },
    watch: {
        ckeckInSuccessStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.successTimer = setTimeout(() => {
                        this.successShowTime = this.successShowTime - 1;
                        if (this.successShowTime === 0) {
                            this.successShowTime = 1;
                            this.ckeckInSuccessStatus = false;

                            if (this.needBindCode) {
                                this.bindCodeStatus = true;
                            }
                            this.$root.$emit('refreshGoodsList');
                        }
                    }, 900);
                }
            }
        },
        paymentList: {
            handler(newVal) {
                let is_scancode = false, isSet = false, payment = '';
                const scancodeItem = newVal.find(e => e.name === '扫码支付');
                if (scancodeItem) {
                    is_scancode = scancodeItem.is_scancode
                }
                const fastItem = newVal.find(e => e.is_fast);
                if (fastItem) {
                    isSet = true;
                    payment = fastItem.name
                }

                this.$emit('update:fastPayInfo', { is_scancode, isSet, payment });
            }
        }
    },
    mounted() {
        this.getUserModuleConfigs();
        this.$root.$on('quickCashier', this.quickCashier);
    },
    beforeDestroy() {
        this.$root.$off('quickCashier', this.quickCashier);
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember']),
        getUserModuleConfigs() {
            if (this.userInfo.sv_us_industrytype !== 9) return
            const configList = ['Playground'];
            stockApi.getUserModuleConfigs(configList).then(res => {
                if (res) {
                    let AutoBindCode;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'Playground':
                                AutoBindCode = item.childInfolist.find(e => e.sv_user_config_code === 'AutoBindCode');
                                return
                        }
                    });
                    let AutoBindCodeDetail = this.$app.isNull(AutoBindCode.childDetailList) ? false : true;
                    this.AutoBindCode.enable = AutoBindCodeDetail ? AutoBindCode.childDetailList[0].sv_detail_is_enable : false;
                }
            })
        },
        quickCashier(quickData) {
            if (this.isSubmitting) return
            const { payment, authCode } = quickData;
            if (this.carttingData.productResults.length === 0) return
            if (!this.userInfo.dec_payment_config.ConvergePay && payment === '扫码支付') return this.$message.warning('您尚未开通扫码支付，请联系客服')
            let buySteps = this.carttingData.productResults.map((e, i) => {
                let serviceName = e.productId === 0 ? e.productName : null;
                let packageGroups = [];
                if (!this.$app.isNull(e.packageGroups)) {
                    e.packageGroups.forEach(e => {
                        packageGroups.push({
                            groupId: e.id,
                            products: e.products.map(k => {
                                return {
                                    productId: k.productId,
                                    specIds: this.$app.isNull(k.specs) ? [] : [...k.specs.map(eki => eki.id)],
                                    chargingIds: this.$app.isNull(k.chargings) ? [] : [...k.chargings.map(eki => eki.id)],
                                    tasteIds: this.$app.isNull(k.tastes) ? [] : [...k.tastes.map(eki => eki.id)],
                                }
                            })
                        })
                    })
                }
                let promotionId = this.$app.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
                let billabletime = null;
                return {
                    index: i + 1,
                    billabletime,
                    productId: e.productId,
                    withoutProductId: e.withoutProductId,
                    number: e.number,
                    booking: null,
                    tradePrice: e.tradePrice,
                    serviceName: serviceName,
                    setmealId: promotionId,
                    tasteIds: [...e.tastes.map(e => { return e.id })] || [],
                    chargingIds: [...e.chargings.map(e => { return e.id })] || [],
                    specIds: [...e.specs.map(e => { return e.id })] || [],
                    productChangePrice: e.productChangePrice,                   // 售价改价
                    productChangeMoney: e.productChangeMoney,                   // 小计改价
                    packageGroups: packageGroups,
                    multCommissions: null
                }
            });
            let paymentList = [{
                name: payment,
                money: this.carttingData.dealMoney,
                data: null
            }];
            let postData = {
                antiSettleOrderId: null,
                svWithoutListId: null,
                totalMoney: this.carttingData.totalMoney,           // 原总价
                dealMoney: this.carttingData.dealMoney,             // 成交总价 === dealMoney
                exchangeMoney: 0,                                   // 找零金额
                payments: paymentList,
                caleDto: {
                    buySteps: buySteps,
                    bookingClassId: null,
                    giveSteps: [],                                                                  // 赠送商品列表
                    memberId: this.memberInfo.member_id,                                            // 会员Id
                    walletId: null,
                    couponRecordIds: null,                                                          // 优惠券Id
                    orderChangeMoney: this.carttingData.orderChangeMoney,                           // 整单改价改折
                    memberPoint: null                                                               // 积分抵扣
                },
                remark: '',
                sourceType: 100,
                password: null,
                orderDateTime: null,
                bizEmployeeId: null,
                isSettle: true
            }
            this.isSubmitting = true;
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
            const loadingData = {
                isLoding: false,
                text: '正在支付...',
                fullscreen: true,
                background: 'rgba(0, 0, 0, 0.7)'
            }
            const loading = this.$loading.service(loadingData);
            stockApi.orderSave(postData, this.Forbid).then(res => {
                if (res !== false && !this.$app.isNull(res)) {
                    this.successInfo.paymentList = paymentList;
                    this.successInfo.dealMoney = this.carttingData.dealMoney;
                    if (payment === '扫码支付') {
                        this.payInfo = {
                            queryId: res.queryId,
                            svOrderListId: res.svOrderListId,
                            receivableMoney: res.payMoney,
                            money: res.payMoney
                        }
                        if (!!this.$refs.quickPayList) {
                            this.$nextTick(() => {
                                this.$refs.quickPayList.handleScan(true);
                                this.$refs.quickPayList.concatAuthcode({ keyCode: 13, authCode })
                            })
                        }
                    } else {
                        this.submitSuccess(res.svOrderListId);
                    }
                }
            }).then(_ => {
                setTimeout(() => {
                    loading.close();
                    this.isSubmitting = false;
                    this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                }, 1000)
            })
        },
        handleCloseScan() {
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
            this.isSubmitting = false;
        },
        submitSuccess(id = this.successInfo.orderNumber) {          // 结算成功回调
            stockApi.getMemberOrderIntegral({ id: id }).then(res => {
                this.checkinStatus = false;
                this.successInfo = {
                    printTime: res.order_datetime,
                    paymentList: this.successInfo.paymentList,
                    orderId: id,
                    orderNumber: res.order_running_id,                                                  // 订单号
                    everyday_serialnumber: this.userInfo.sv_us_industrytype === 27 ? res.everyday_serialnumber : '',      // 每日流水号-取餐号
                    receivableMoney: res.order_receivable,                                              // 应收
                    couponMoney: res.order_coupon_money,                                                // 优惠
                    dealMoney: res.order_money,                                                         // 实收===收款
                    exchangeMoney: res.order_change,                                                    // 找零
                    duration: res.duration,                                                             // 房台时长
                    sv_mr_name: res.sv_mr_name,                                                         // 会员名称
                    sv_mr_cardno: res.sv_mr_cardno,                                                     // 会员卡号
                    sv_mr_mobile: res.sv_mr_mobile,                                                     // 会员手机号
                    availableamount: res.effective_amount,                                              // 储值余额
                    order_integral: res.order_integral,                                                 // 订单获得积分
                    orderDeduction_integral: res.orderDeduction_integral,                               // 订单积分抵扣
                    availablepoint: res.effective_integral,                                             // 积分余额
                    credit: res.sv_mw_credit                                                            // 欠款金额
                };
                if (this.customerDisplayData.enable) {
                    if (res.order_change > 0) {
                        this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 4, res.order_change);
                    } else {
                        this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
                    }
                }
                this.isSubmitting = false;
                this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                // 游乐场是否绑定票码
                const goodsList = (res.plist || []).filter(e => e.producttype_id === 2);
                const packageList = (res.plist || []).filter(e => !this.$app.isNull(e.combinationGroupPrint));
                const packageGoodsList = [];
                packageList.forEach(packageItem => {
                    // 有套餐内商品是计时商品
                    packageItem.combinationGroupPrint.forEach(groupItem => {
                        groupItem.combinationPrint.forEach(pGoodsItem => {
                            if (pGoodsItem.producttype_id === 2) {
                                packageGoodsList.push(pGoodsItem)
                            }
                        })
                    })
                })
                if (!this.$app.isNull(goodsList.concat(packageGoodsList)) && !this.AutoBindCode.enable) {
                    this.needBindCode = true;
                    this.bindOrderId = id;
                } else {
                    this.needBindCode = false;
                    this.bindOrderId = null;
                }

                if (this.cashierJurisdiction.printEnable) {
                    this.handlePrintPlay(res, this.cashierJurisdiction.printSum, this.successInfo.printTime);
                }
                !!this.isLightMeal && this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'checkin', this.successInfo.printTime);
                setTimeout(() => {
                    this.clearCartting(this.successInfo.exchangeMoney);
                    this.clearMember();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.ckeckInSuccessStatus = true;
                    // 刷新上一次订单结果
                    this.getSettlementOrder();
                }, 300);
            })
        },
        closeSuccessDialog() {
            this.ckeckInSuccessStatus = false;
            this.successShowTime = 0;
            clearTimeout(this.successTimer);
            if (this.needBindCode) {
                this.bindCodeStatus = true;
            }
            this.$root.$emit('refreshGoodsList');
        },
        handlePrintPlay(orderData, times = 1, printTime) {
            let qrCodeList = [];
            let currentBillabletimePos = 1;
            let billabletimeArray = [{ id: orderData.sv_table_id, value: currentBillabletimePos }];
            const tempPrintProduct = orderData.plist.map((e, i) => {
                const isBillableProduct = (e.sv_p_barcode || '').indexOf('Billabletime-') > -1;
                const billabletimeItem = billabletimeArray.find(item => item.id === e.sv_table_id_old);
                let tablePos = 0;
                if (billabletimeItem) {
                    tablePos = billabletimeItem.value * 100 + (isBillableProduct ? 0 : (i + 1));
                } else {
                    currentBillabletimePos++;
                    billabletimeArray.push({ id: orderData.sv_table_id_old, value: currentBillabletimePos })
                    tablePos = currentBillabletimePos * 100 + (isBillableProduct ? 0 : (i + 1));
                }
                return {
                    ...e,
                    tablePos
                }
            }).sort((a, b) => a.tablePos - b.tablePos);
            let tableList = tempPrintProduct.map(e => {
                const packageList = this.$app.isNull(e.combinationGroupPrint) ? [] : e.combinationGroupPrint;
                let packageGroups = packageList.map(packageItem => {
                    return {
                        id: packageItem.groupId,
                        name: packageItem.groupName,
                        products: packageItem.combinationPrint.map(groupListItem => {
                            if (this.AutoBindCode.enable) {
                                // 开启自动绑定票码，则需要打印
                                let sv_bar_code_list = this.$app.isNull(groupListItem.sv_bar_code) ? [] : groupListItem.sv_bar_code.split(';') || [];
                                sv_bar_code_list.forEach(code => {
                                    qrCodeList.push({
                                        code: code,
                                        orderId: orderData.order_running_id,
                                        qrcode: stockApi.imgQr() + '?content=' + code + '&key=' + localStorage.getItem('token'),
                                        name: groupListItem.sv_p_name,
                                        number: 1,
                                        price: this.$app.moneyFixed(groupListItem.sv_price)
                                    })
                                })
                            }
                            let groupProductName = groupListItem.sv_p_name + (this.$app.isNull(groupListItem.taste_data) ? '' : '[' + groupListItem.taste_data + ']');
                            if (!this.$app.isNull(groupListItem.sv_p_specs)) groupProductName += '[' + groupListItem.sv_p_specs + ']';
                            return {
                                specs: [],
                                tastes: [],
                                chargings: [],
                                name: groupProductName,
                                barCode: groupListItem.sv_p_barcode,
                                number: groupListItem.product_number,
                                unitName: '',
                                price: groupListItem.sv_price
                            }
                        })
                    }
                })
                if (this.AutoBindCode.enable) {
                    // 开启自动绑定票码，则需要打印
                    let sv_bar_code_list = this.$app.isNull(e.sv_bar_code) ? [] : e.sv_bar_code.split(';') || [];
                    sv_bar_code_list.forEach(code => {
                        qrCodeList.push({
                            code: code,
                            orderId: orderData.order_running_id,
                            qrcode: stockApi.imgQr() + '?content=' + code + '&key=' + localStorage.getItem('token'),
                            name: e.product_name,
                            number: 1,
                            price: this.$app.moneyFixed(e.product_unitprice)
                        })
                    })
                }
                let productName = e.product_name + (this.$app.isNull(e.taste_data) ? '' : '[' + e.taste_data + ']');
                if (!this.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                return {
                    isPackage: packageList.length > 0,
                    id: e.id,
                    productName,
                    tableName: (e.sv_p_barcode || '').indexOf('Billabletime-') > -1 ? e.sv_table_name_old : '',
                    duration: e.duration,
                    barCode: e.sv_p_barcode,
                    unitName: e.sv_p_unit,
                    number: e.product_num_bak,
                    price: (e.sv_p_barcode || '').indexOf('Billabletime-') > -1 ? '' : e.product_price,
                    dealMoney: e.product_total,
                    productCouponMoney: this.$app.multiplyNumber(this.$app.subtractNumber(e.product_price, e.product_unitprice), e.product_num_bak),
                    packageGroups,
                }
            });
            let printArray = [];
            tableList.forEach(e => {
                // 合并同商品id且同成交价
                let filterItem = printArray.find(k => k.id === e.id);
                if (filterItem && !e.isPackage) {
                    filterItem.number = this.$app.addNumber(filterItem.number, e.number);
                    filterItem.dealMoney = this.$app.addNumber(filterItem.dealMoney, e.dealMoney);
                    filterItem.productCouponMoney = this.$app.addNumber(filterItem.productCouponMoney, e.productCouponMoney);
                    filterItem.orderCouponMoney = this.$app.addNumber(filterItem.orderCouponMoney, e.orderCouponMoney);
                } else {
                    printArray.push(e)
                }
            })
            const payTypeList = [
                {
                    name: orderData.order_payment,
                    money: orderData.order_money
                }
            ]
            if (orderData.order_money2 > 0) {
                payTypeList.push({
                    name: orderData.order_payment2,
                    money: orderData.order_money2
                })
            }
            let printData = {
                customTitle: this.$route.query.isOrderBack ? '反结单' : '销售小票',
                /*打印类型*/
                printType: 1,                                   // 1 ? '销售小票' : '预打/预结小票',
                /*打印份数*/
                printSum: parseInt(times),
                /*店铺logo*/
                shopLogo: orderData.sv_store_logo,
                /*店铺名称*/
                shopName: orderData.sv_us_shortname,
                /*电话*/
                shopTel: orderData.sv_us_phone,
                /*地址*/
                shopAddress: orderData.sv_us_address,
                /*每日流水号-取餐号*/
                dailySerialNumber: orderData.everyday_serialnumber || '',
                /*订单号*/
                orderNumber: orderData.order_running_id,
                /*销售时间*/
                salePrintTime: printTime,
                /*操作员*/
                controlName: this.selectedInfo.sv_employee_name || orderData.order_operator_name,
                /*销售人员*/
                salesName: orderData.salesperson,
                /*次卡抵扣表格*/
                cardList: [],
                /*商品表格*/
                tableList: printArray,
                /*票码数据 */
                qrCodeList,
                /*合计总数量*/
                totalNumber: orderData.numcount,
                /*合计总金额*/
                dealTotalMoney: this.$app.moneyFixed(orderData.order_receivable),
                /*原价金额*/
                totalMoney: this.$app.moneyFixed(orderData.sv_order_total_money),
                /*优惠金额*/
                discountMoney: this.$app.moneyFixed(orderData.order_coupon_money),
                /*应收*/
                receivableMoney: this.$app.moneyFixed(orderData.order_receivable),
                /*实收*/
                collectionsMoney: this.$app.moneyFixed(this.$app.addNumber(orderData.order_money, orderData.order_money2)),
                /*找零*/
                exchangeMoney: this.$app.moneyFixed(orderData.order_change),
                /*支付方式*/
                payTypeList,
                /*支付单号*/
                payOrderNumber: orderData.order_running_id,
                /*会员信息*/
                memberInfo: {
                    member_id: orderData.member_id === '0' ? null : orderData.member_id,
                    sv_mr_name: orderData.member_id === '0' ? null : orderData.sv_mr_name,
                    sv_mr_cardno: orderData.member_id === '0' ? null : orderData.sv_mr_cardno,
                    sv_mr_mobile: orderData.member_id === '0' ? null : orderData.sv_mr_mobile,
                    availableamount: orderData.member_id === '0' ? null : orderData.effective_amount,
                    integral: orderData.member_id === '0' ? null : (orderData.order_integral + '/' + orderData.effective_integral),
                    effective_integral: orderData.member_id === '0' ? null : orderData.effective_integral,
                    sv_mr_platenumber: orderData.member_id === '0' ? null : orderData.sv_mr_platenumber
                },
                /*备注*/
                remark: orderData.sv_remarks,
                printTime: this.$app.currentTime(new Date()),
                /*房台号*/
                sv_catering_grade: orderData.sv_catering_grade,
                // /*房台ID*/
                sv_table_id: orderData.sv_table_id,
                /*就餐人数*/
                sv_person_num: orderData.sv_person_num,
            }
            this.$print.customSales(printData);
        },
        //#region  获取厨打方案并打印
        getKitchenPrinter(dataList, type) {                         // 获取厨打方案并打印
            let ids = [];
            dataList.forEach(e => {
                if (e.isPackage) {
                    e.packageGroups.forEach(p => {
                        p.products.forEach(k => {
                            // 组件id 套餐id  分组id  商品id
                            ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), packageproduct_id: e.productId, packagegroup_id: p.id, product_id: k.productId })
                        })
                    })
                } else {
                    ids.push({ sv_without_product_id: parseInt(e.productId + '' + e.index), product_id: e.productId, packageproduct_id: 0, packagegroup_id: 0 })
                }
            })
            stockApi.getKitchenPrinter(ids).then(res => {
                if (res) {
                    // 厨打 type-厨打类型 add-加菜单 return-退菜单 online-厨打单 change-换台 and-并台
                    const extendInfo = {
                        tableName: '',
                        everyday_serialnumber: this.successInfo.everyday_serialnumber,
                        remark: this.selectedInfo.sv_remark,
                    }
                    kitchenPrintMain(res, dataList, type, extendInfo);
                }
            });
        },
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
import base from '@/api/base';
import { stockApi } from '@/api/index.js';
import { mapActions, mapMutations, mapState } from 'vuex';
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import { printLabel } from '@/utils/prin';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import orderSupplement from '../orderSupplement/orderSupplement.vue';
import numberChange from '../numberChange/numberChange.vue';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import discount from '../discount/discount.vue';
import memberList from '../memberList/memberList.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import priceChange from '../priceChange/priceChange.vue';
import memberCardCheck from '../memberCardCheck/memberCardCheck.vue';
import bindCode from '../bindCode/bindCode.vue';
export default {
    name: 'checkin',
    components: { payTypeList, orderSupplement, numberChange, guiderSelect, discount, memberList, memberRecharge, priceChange, memberCardCheck, bindCode },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        const prePrint_cache_name = ['cache_name_catering', 'cache_name_coffee']
        const prePrintText = prePrint_cache_name.includes(this.$store.state.userInfo.sv_uit_cache_name) ? '预结' : '预打';
        return {
            isFixing: false,                                    // 是否在维护补单
            fixingTime: new Date(),                             // 维护补单时间
            fixPassword: '',                                    // 补单密码    
            Forbid: '',                                         // 结算接口时间戳
            limitedTimer: null,
            prePrintText: prePrintText,
            inputPriceTimer: null,
            inputPriceHandler: 0,                               // 输入金额控制，小于 1 时覆盖，否则累加
            checkOrderTimer: null,                              // 扫码支付请求延时
            checkinStatus: true,                                // 结算弹窗
            ckeckInSuccessStatus: false,                        // 结算成功弹窗
            inputMemberKeyword: '',                             // 会员搜索输入框
            usePointCheck: false,                               // 勾选使用积分
            receiveBase: 0,                                     // 初始应收金额
            discountBase: 0,                                    // 可折扣优惠金额
            receivableMoney: 0,                                 // 应收金额

            showDownPayment: false,                             // 弹窗使用订金
            showDownPaymentContent: false,                      // 订金消费详情弹窗
            downPaymentSetted: false,                           // 已设置使用订金
            downPaymentMoney: 0,                                // 使用订金金额
            hasDownPayment: false,
            downPaymentInfo: {                                  // 订金使用内容
                no: '',
                isShowInCheckIn: false
            },

            preOrderMoneyData: {
                used: false,
                money: 0
            },

            showBillabletimeUpdate: false,                      // 展示修改计时
            isMultiPayType: false,                              // 是否选择组合支付
            payInfo: {
                queryId: '',
                svOrderListId: null,
                receivableMoney: null,                          // 应收金额
                money: null                                     // 扫码支付金额
            },
            brandNum: '',                                       // 输入的牌号
            showBrandNum: false,                                // 轻餐牌号
            afterBrandNum: false,                               // 是否输入牌号后
            orderSupplementStatus: false,                       // 补单弹窗状态
            memberPointStatus: false,                           // 修改积分使用弹窗状态
            guiderSelectStatus: false,                          // 销售员弹窗状态
            discountStatus: false,                              // 优惠券弹窗状态
            memberListStatus: false,                            // 会员列表弹窗状态
            allStoreStatus: true,                               // 会员列表是否查询跨店会员
            memberRechargeStatus: false,                        // 会员充值弹窗状态
            storeCardStatus: false,                             // 选择储值卡弹窗状态
            afterPriceChange: false,                            // 是否在整单改价之后
            priceChangeMenuPos: 1,
            priceChangeStatus: false,                           // 改价改折弹窗状态
            memberCardCheckStatus: false,                       // 结算前储值卡支付验证弹窗
            paymentList: [],                                    // 所有支付方式
            paySelectedList: [],                                // 已选支付方式
            needBindCode: false,                                // 是否需要绑定票码
            bindCodeStatus: false,                              // 绑定票码弹窗
            bindOrderId: null,                                  // 需要绑定票码的订单id
            sv_uc_isenablepwd: false,                           // 结算前储值卡支付-用户配置是否要验证
            memberCardCheckType: -1,                            // 储值卡结算验证类型

            guiderList: [],
            salesNameList: [],

            inputNumber: '',
            checkPrint: false,                                  // 是否打印
            isSubmitting: false,                                // 正在结算
            btnCalculator: [
                {
                    key: 'line10',
                    value: '7'
                },
                {
                    key: 'line11',
                    value: '8'
                },
                {
                    key: 'line12',
                    value: '9'
                },
                {
                    key: 'line20',
                    value: '4'
                },
                {
                    key: 'line21',
                    value: '5'
                },
                {
                    key: 'line22',
                    value: '6'
                },
                {
                    key: 'line30',
                    value: '1'
                },
                {
                    key: 'line31',
                    value: '2'
                },
                {
                    key: 'line32',
                    value: '3'
                },
                {
                    key: 'line40',
                    value: '.'
                },
                {
                    key: 'line41',
                    value: '0'
                }
                // {
                //     key: 'line42',
                //     value: '打印'
                // }
            ],
            btnControl: [
                {
                    key: 'line10',
                    value: '100'
                },
                {
                    key: 'line11',
                    value: 'C'
                },
                {
                    key: 'line20',
                    value: '50'
                },
                {
                    key: 'line21',
                    value: '折扣',
                    permission: 'key_discount'
                },
                {
                    key: 'line30',
                    value: '20'
                }
                // {
                //     key: 'line31',
                //     value: '预结'
                // },
                // {
                //     key: 'line40',
                //     value: '确定结算'
                // }
            ],
            AutoBindCode: {
                enable: false
            },
            Service_Commission_Switch: {
                sv_config_code: 'Service_Commission_Switch',
                sv_config_name: '服务商品业绩平分',
                sv_is_enable: false
            },
            queryPay: {
                authCode: '',                       // 支付码，扫客户付款码
                money: '',                          // 收款金额
                subject: 'PC端扫码支付',             // 收款说明
                businessType: 1,                    // 1:WebCheckout,网页收银台;
                queryId: ''                         // 查询Id
            },
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
            successTimer: null,
            successShowTime: 1,
            checkBillabletimeInfo: {},
            handleUpdateTimeProp: false,
            updateBillabletimeInfo: {}
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'cashierJurisdiction', 'memberSetting', 'isLightMeal', 'carttingData', 'billabletimeInfo', 'cateringReturn', 'carttingGiveData', 'hasGoodsActivity', 'queryUpdateCartting', 'memberInfo', 'userPoint', 'selectedInfo', 'takeASingleCale3', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        isCatering() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype === 27
        },
        imgBase() {
            return stockApi.imgBase()
        },
        hasGuider() {                               // 该行业是否结账选导购
            let industrytypeIncludes = [1]
            return !industrytypeIncludes.includes(this.userInfo.sv_us_industrytype) || this.isLightMeal || this.$route.path === '/cashier/cashierRoom'
        },
        hasOrderCouponMoney() {                     // 有可以折扣的金额
            return this.carttingData.lastOrderCouponMoney > 0
        },
        hasPointWrap() {
            return this.userPoint.switch && parseFloat(this.pointData.point) > 0
        },
        pointData() {                              // 积分抵扣金额
            let orderPromotionPoint = !this.$app.isNull(this.carttingData.orderPromotions) ? this.carttingData.orderPromotions.find(e => e.type === 11) : '';
            return {
                money: this.$app.isNull(orderPromotionPoint) ? '' : orderPromotionPoint.couponMoney,
                point: this.$app.isNull(orderPromotionPoint) ? this.userPoint.inputValue : orderPromotionPoint.data
            }
        },
        canUsePointMoney() {                        // 可以积分抵扣金额
            return this.carttingData.lastOrderCouponMoney
        },
        couponSelected() {                          // 已选择优惠券
            let orderPromotionCoupon = !this.$app.isNull(this.carttingData.orderPromotions) ? this.carttingData.orderPromotions.filter(e => e.type === 10) : '';
            return this.$app.isNull(orderPromotionCoupon) ? [] : orderPromotionCoupon.map(e => e.data)
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        discountMoney() {                           // 优惠金额
            return this.$app.moneyFixed(this.carttingData.couponMoney)
        },
        freeZeroMoney() {                           // 展示抹零金额
            return this.carttingData.freeZeroMoney || 0
        },
        exchangeMoney() {                           // 展示找零金额
            let money = parseFloat(this.inputNumber) || 0;
            if (this.preOrderMoneyData.used && money > 0) {
                money = this.$app.addNumber(money, this.preOrderMoneyData.money)
            }
            if (this.downPaymentInfo.isShowInCheckIn && this.downPaymentSetted) {
                money = this.$app.subtractNumber(money, this.downPaymentMoney)
            }
            const moneyExchange = this.$app.subtractNumber(money, parseFloat(this.receivableMoney));
            return moneyExchange > 0 ? moneyExchange : 0
        },
        preMoneyEnough() {
            return parseFloat(this.inputNumber) === 0 && (this.downPaymentSetted || this.preOrderMoneyData.used)
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                    this.bindCodeStatus = false;
                    this.successShowTime = 1;
                    this.checkinStatus = true;
                    this.ckeckInSuccessStatus = false;
                    this.payInfo = {
                        queryId: '',
                        svOrderListId: null,
                        receivableMoney: this.receivableMoney,
                        money: null
                    };
                    this.successInfo = {
                        printTime: '',
                        paymentList: [],                    // 支付
                        orderId: '',                        // 订单号
                        orderNumber: '',                    // 订单流水号-打印
                        everyday_serialnumber: '',          // 每日流水号
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
                    };
                    this.sv_uc_isenablepwd = false;
                    this.brandNum = '';                                      // 输入的牌号
                    this.showBrandNum = false;                               // 轻餐牌号
                    this.afterBrandNum = false;                              // 是否输入牌号后
                    this.isMultiPayType = false;
                    this.showDownPayment = false;                            // 弹窗使用订金
                    this.showDownPaymentContent = false;                     // 订金消费详情弹窗
                    this.downPaymentSetted = false;                          // 已设置使用订金
                    this.downPaymentMoney = 0;                               // 使用订金金额
                    this.downPaymentInfo = {                                 // 订金使用内容
                        no: '',
                        isShowInCheckIn: false
                    };
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    let menuJson = this.$app.getLocalStorage('menuJson') || [];
                    const downPaymentItem = menuJson.find(e => e.menu_code === '/downPayment_classifyEntry');
                    if (downPaymentItem) {
                        // 开启订金未隐藏
                        if (downPaymentItem.sv_enabled && !downPaymentItem.sv_is_hide) {
                            this.hasDownPayment = true;
                        }
                    }
                    let endTime = this.billabletimeInfo.endTime ? this.billabletimeInfo.endTime : this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    let durationTime = new Date(endTime).getTime() - new Date(this.billabletimeInfo.startTime).getTime();
                    this.checkBillabletimeInfo = {
                        ...this.billabletimeInfo,
                        durationTime: this.$app.timeStampFomart(durationTime),
                        endTime,
                    };
                    this.preOrderMoneyData.used = this.selectedInfo.preOrderMoney > 0 ? true : false;
                    this.preOrderMoneyData.money = this.selectedInfo.preOrderMoney > 0 ? this.selectedInfo.preOrderMoney : 0;
                    this.$nextTick(() => {
                        this.receivableMoney = this.$app.moneyFixed(this.$app.subtractNumber(this.carttingData.dealMoney, this.freeZeroMoney));

                        this.inputNumber = this.$app.subtractNumber(this.receivableMoney, this.preOrderMoneyData.money || 0);
                        if (this.inputNumber < 0) {
                            this.inputNumber = 0
                        }
                        this.receiveBase = this.carttingData.dealMoney;
                        this.discountBase = this.carttingData.lastOrderCouponMoney;
                    })
                    this.guiderList = [];
                    this.salesNameList = [];
                    this.usePointCheck = false;
                    if (this.takeASingleCale3.sv_isbeforehand && this.takeASingleCale3.tableId === this.selectedInfo.sv_table_id) {
                        this.usePointCheck = this.takeASingleCale3.sv_integral > 0 ? true : false;
                        this.guiderList = this.$app.isNull(this.takeASingleCale3.sv_employee_ids) ? [] : JSON.parse(this.takeASingleCale3.sv_employee_ids);
                        this.changeQueryUpdateCartting({
                            couponRecordIds: this.takeASingleCale3.sv_coupon_record_ids.length > 0 ? this.takeASingleCale3.sv_coupon_record_ids : null,
                            point: this.takeASingleCale3.sv_integral > 0 ? this.takeASingleCale3.sv_integral : null
                        })
                    }
                    this.checkInFocus();
                    this.getUserConfigInfo();
                    this.getUserModuleConfigs();
                    this.getConfigSwitchList();
                } else {
                    this.update({
                        key: 'isInShowCheckin',
                        data: false
                    })
                    this.checkInBlur();
                    let needClearCartting = !this.$app.isNull(this.selectedInfo.sv_table_id)
                    this.syncCloseCheckin(needClearCartting);
                    this.update({
                        key: 'userPoint',
                        data: {
                            switch: false,                                  // 是否开启
                            proportion: 0,                                  // 比例
                            maxValue: '',                                   // 可输入最大积分
                            inputValue: ''
                        }
                    })
                }

                if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1 && this.userInfo.sv_us_industrytype !== 1 && this.userInfo.sv_us_industrytype !== 6) {
                    this.$nextTick(() => {
                        this.showGuiderSelect();
                    })
                }
            }
        },
        carttingData: {
            handler(newVal, oldVal) {
                if (this.receiveBase === 0) {
                    this.receiveBase = this.inputNumber;
                }
            }
        },
        'carttingData.dealMoney': {
            handler(newVal, oldVal) {
                this.receivableMoney = this.$app.moneyFixed(this.$app.subtractNumber(newVal, this.freeZeroMoney));
                this.inputNumber = this.$app.subtractNumber(this.receivableMoney, this.selectedInfo.preOrderMoney || 0);
                if (this.inputNumber < 0) {
                    this.inputNumber = 0
                }
                if (!this.afterPriceChange) {
                    this.discountBase = this.carttingData.lastOrderCouponMoney;
                    this.receiveBase = newVal;
                } else {
                    this.afterPriceChange = false;
                }
                this.payInfo.receivableMoney = this.receivableMoney;
                if (this.customerDisplayData.enable && newVal) {
                    this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 2, this.receivableMoney);
                }
            }
        },
        usePointCheck: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.changeQueryUpdateCartting({
                        ...this.queryUpdateCartting,
                        point: null
                    })
                    this.beforeUpdateCatting();
                }
            }
        },
        'memberInfo.member_id': {
            handler(newVal, oldVal) {
                if (this.$route.path !== '/cashier/home') return;
                this.usePointCheck = false;
                // console.log('checkin member change');
                this.changeQueryUpdateCartting({
                    couponRecordIds: null,
                    point: null
                });
                this.receiveBase = 0;
            }
        },
        showBrandNum: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.checkInFocus();
                }
            }
        },
        orderSupplementStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.priceChangeMenuPos = 1;
                    this.checkInFocus();
                }
            }
        },
        guiderSelectStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.checkInFocus();
                }
            }
        },
        memberListStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.checkInFocus();
                }
            }
        },
        memberPointStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.checkInFocus();
                }
            }
        },
        priceChangeStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.priceChangeMenuPos = 1;
                    this.checkInFocus();
                }
            }
        },
        discountStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkInBlur();
                } else {
                    this.priceChangeMenuPos = 1;
                    this.checkInFocus();
                }
            }
        },
        ckeckInSuccessStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.successTimer = setTimeout(() => {
                        this.successShowTime = this.successShowTime - 1;
                        if (this.successShowTime < 1) {
                            if (this.needBindCode) {
                                this.bindCodeStatus = true;
                            } else {
                                this.closeDialog();
                            }
                            clearTimeout(this.successTimer);
                            this.$root.$emit('updateMeiyeHome');
                            this.$root.$emit('refreshGoodsList');
                            this.$root.$emit('refreshVenue');
                        }
                    }, 900);
                }
            }
        },
    },
    methods: {
        ...mapMutations(['update', 'changeQueryUpdateCartting', 'syncCarttingData', 'updateOrderChangePrice', 'clearOrderChangePrice', 'clearMember', 'clearCartting', 'clearSelectedInfo']),
        ...mapActions(['checkInUpdateCatting', 'syncCloseCheckin']),
        showFix() {
            this.$prompt('请输入密码', {
                inputPlaceholder: '请输入密码',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'password',
                inputPattern: /^.{0,100}$/,
                inputValue: '',
                inputErrorMessage: '补单密码错误',
            }).then(({ value }) => {
                // if(value !== 'deke123456') return this.$message.error('补单密码不正确')
                if (this.$app.isNull(value)) return this.$message.error('请输入密码')
                this.isFixing = true;
                this.fixPassword = this.$app.md5(value).toUpperCase();
                this.fixingTime = new Date();
            }).catch(e => {

            });
            return
        },
        handleInputLimited() {
            if (this.memberSetting.keyCardInitial) {
                clearTimeout(this.limitedTimer);
                this.limitedTimer = setTimeout(e => {
                    this.inputMemberKeyword = ''
                }, 100)
            }
        },
        closeSuccessDialog() {
            this.ckeckInSuccessStatus = false;
            this.successShowTime = 0;
            clearTimeout(this.successTimer);
            if (this.needBindCode) {
                this.bindCodeStatus = true;
            } else {
                this.closeDialog();
            }
            this.$root.$emit('updateMeiyeHome');
            this.$root.$emit('refreshGoodsList');
            this.$root.$emit('refreshVenue');
        },
        handleEndTimeChange() {
            if (this.updateBillabletimeInfo.endTime.getTime() < new Date(this.updateBillabletimeInfo.startTime).getTime()) {
                this.updateBillabletimeInfo.endTime = this.checkBillabletimeInfo.endTime;
                return this.$message.warning('选择的时间早于开单时间')
            }
            stockApi.getBillabletime({ code: this.updateBillabletimeInfo.code, dateTime: this.updateBillabletimeInfo.endTime }).then(res => {
                if (res) {
                    let durationTime = new Date(this.updateBillabletimeInfo.endTime).getTime() - new Date(this.updateBillabletimeInfo.startTime).getTime();
                    this.updateBillabletimeInfo = {
                        id: res.id,
                        code: res.code,
                        configNameId: 'Billabletime-' + res.configId,
                        configName: res.configName,
                        startTime: res.startTime,
                        endTime: this.$app.currentTime(this.updateBillabletimeInfo.endTime, 'yyyy-MM-dd HH:mm:ss'),
                        duration: res.duration,
                        durationTime: this.$app.timeStampFomart(durationTime),
                        durationUpdateTime: res.durationUpdateTime,
                        status: res.status,                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
                        statusString: res.statusString,
                        totalMoney: res.totalMoney,
                        pauseDuration: res.pauseDuration,
                        pauseTime: res.pauseTime,
                        canPause: res.pauseTime > 0
                    }
                }
            }).finally(() => {
                this.handleUpdateTimeProp = false;
            });
        },
        handleUpdateBilltimeSure() {
            if (this.handleUpdateTimeProp) return
            this.checkBillabletimeInfo = { ...this.updateBillabletimeInfo };
            let feeItem = this.carttingData.productResults.find(e => e.barCode === this.checkBillabletimeInfo.configNameId);
            if (feeItem) {
                feeItem.price = this.checkBillabletimeInfo.totalMoney;
                feeItem.productChangePrice = this.checkBillabletimeInfo.totalMoney;
                feeItem.dealMoney = this.checkBillabletimeInfo.totalMoney;
                feeItem.billabletime = {
                    dateTime: this.checkBillabletimeInfo.durationUpdateTime,
                    duration: this.checkBillabletimeInfo.duration,
                    money: this.checkBillabletimeInfo.totalMoney,
                    code: this.checkBillabletimeInfo.code,
                }
                this.carttingData.orderChangeMoney = null;
                this.syncCarttingData(this.carttingData);
                this.beforeUpdateCatting();
            }
            this.receiveBase = this.carttingData.dealMoney;
            this.showBillabletimeUpdate = false;
        },
        handleShowUpdateTime() {
            this.showBillabletimeUpdate = true;
            this.handleUpdateTimeProp = false;
            this.updateBillabletimeInfo = { ...this.checkBillabletimeInfo }
        },
        checkInFocus() {
            this.$nextTick(() => {
                // !!this.$refs.checkin && this.$refs.checkin.focus();
                !!this.$refs.searchMember && this.$refs.searchMember.focus();
            })
        },
        checkInBlur() {
            this.$nextTick(() => {
                // !!this.$refs.checkin && this.$refs.checkin.blur();
                !!this.$refs.searchMember && this.$refs.searchMember.blur();
            })
        },
        changePayment(list) {
            this.paySelectedList = list;
            this.checkInFocus();
        },
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleSubmit();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                case 8:                                       // back
                    this.deleteInput();
                    return;
                case 46:                                      // delete
                    this.deleteInput();
                    return;
                case 77:                                      // m
                    !!this.$refs.payTypeList && this.$refs.payTypeList.handleMultiPayChange();
                    return;
                case 48:                                      // 0
                    this.calculateInput('0');
                    return;
                case 96:                                      // 0
                    this.calculateInput('0');
                    return;
                case 49:                                      // 1
                    this.calculateInput('1');
                    return;
                case 97:                                      // 1
                    this.calculateInput('1');
                    return;
                case 50:                                      // 2
                    this.calculateInput('2');
                    return;
                case 98:                                      // 2
                    this.calculateInput('2');
                    return;
                case 51:                                      // 3
                    this.calculateInput('3');
                    return;
                case 99:                                      // 3
                    this.calculateInput('3');
                    return;
                case 52:                                      // 4
                    this.calculateInput('4');
                    return;
                case 100:                                     // 4
                    this.calculateInput('4');
                    return;
                case 53:                                      // 5
                    this.calculateInput('5');
                    return;
                case 101:                                     // 5
                    this.calculateInput('5');
                    return;
                case 54:                                      // 6
                    this.calculateInput('6');
                    return;
                case 102:                                     // 6
                    this.calculateInput('6');
                    return;
                case 55:                                      // 7
                    this.calculateInput('7');
                    return;
                case 103:                                     // 7
                    this.calculateInput('7');
                    return;
                case 56:                                      // 8
                    this.calculateInput('8');
                    return;
                case 104:                                     // 8
                    this.calculateInput('8');
                    return;
                case 57:                                      // 9
                    this.calculateInput('9');
                    return;
                case 105:                                     // 9
                    this.calculateInput('9');
                    return;
                case 190:                                     // .
                    this.calculateInput('.');
                    return;
                case 110:                                     // .
                    this.calculateInput('.');
                    return;
                case 67:                                      // C
                    this.calculateInput('C');
                    return;
                case 74:                                      // J 积分
                    if (this.hasPointWrap) this.usePointCheck = true, this.handlePointSwitch();
                    return;
                case 81:                                      // Q 补单
                    this.showOrderSupplement();
                    return;
                case 115:                                     // F4 折扣
                    this.showPriceChange();
                    return;
                case 116:                                     // F5 会员刷卡

                    return;
                case 117:                                     // F6 会员刷卡
                    this.showMemberList();
                    return;
                case 118:                                     // F7 开钱箱

                    return;
                case 119:                                     // F8 优惠券
                    this.showDiscount();
                    return;
                default:
                    console.log('key ' + code + ' is click');
                    this.saleNumber = code;
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.bindCodeStatus = false;
            this.$root.$emit('handleInputFocus')
        },
        handleSearchMemberEnter() {                                 // 会员输入框事件阻止
            if (this.$app.isNull(this.inputMemberKeyword)) {
                this.handleSubmit();
                return
            }
            const payScanItem = this.paySelectedList.find(e => e.name === '扫码支付') || {};
            if (this.$app.quickScanPayCheck(this.inputMemberKeyword) && payScanItem.is_scancode) {
                if (payScanItem) {
                    this.checkInBlur();
                    this.handleSubmit(this.inputMemberKeyword);
                } else {
                    this.$message.warning('只有扫码支付才支持扫码付款');
                }
                this.$nextTick(() => {
                    this.inputMemberKeyword = '';
                });
                return
            }
            this.showMemberList();
        },
        handleBrandNum(e) {
            this.brandNum = e;
            this.afterBrandNum = true;
            this.handleSubmit();
        },
        showOrderSupplement() {                                     // 显示补单弹窗
            this.orderSupplementStatus = true;
        },
        showGuiderSelect() {                                        // 显示销售员弹窗
            this.guiderSelectStatus = true;
        },
        handleGoodsActivity() {
            this.$emit('handleGoodsActivity')
        },
        handleCloseMember() {                                       // 关闭会员弹窗触发
            this.memberListStatus = false;
        },
        handleLeavePage() {
            this.closeDialog();
        },
        handlePointSwitch() {                                       // 打开积分开关
            if (this.usePointCheck && this.userPoint.maxValue > 0) this.memberPointStatus = true;
        },
        handlePointClose() {                                        // 使用积分弹窗关闭
            this.usePointCheck = false;
        },
        handlePointChange(e) {                                      // 返回使用的积分
            let inputPoint = e - e % this.userPoint.proportion;
            if (inputPoint < this.userPoint.proportion) {
                this.usePointCheck = false;
                return this.$message.warning(this.userPoint.proportion + '抵扣1元，请使用 ' + this.userPoint.proportion + '的倍数')
            }
            this.update({
                key: 'userPoint',
                data: {
                    ...this.userPoint,
                    inputValue: inputPoint
                }
            })
            this.changeQueryUpdateCartting({
                ...this.queryUpdateCartting,
                point: inputPoint
            })
            this.beforeUpdateCatting();
        },
        beforeUpdateCatting() {
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
            })
            this.checkInUpdateCatting();
        },
        showNumberChange() {                                        // 显示积分修改弹窗
            this.beforeAcitvityCheck(() => {
                this.memberPointStatus = true;
            });
        },
        showDiscount() {                                            // 显示优惠券弹窗
            this.beforeAcitvityCheck(() => {
                this.discountStatus = true;
            });
        },
        showStoreCard() {
            this.$root.$emit('keyCode', 80);
        },
        showEquityCard() {
            this.$root.$emit('keyCode', 85);
        },
        beforeAcitvityCheck(callback) {                             // 变更会员、改价改折、积分、优惠券弹窗前验证
            if (this.carttingGiveData.length > 0 && this.hasGoodsActivity) {
                this.$confirm('您已选促销商品，继续操作后需重新选择，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    !!callback && callback();
                }).catch(() => {

                });
            } else {
                !!callback && callback();
            }
        },
        showMemberList() {                                          // 显示会员弹窗
            let permissionItem = this.CashierManage.Select_Members || { enabled: true };
            if (!permissionItem.enabled) return this.$message.warning(permissionItem.tips || '无权限')
            this.beforeAcitvityCheck(() => {
                this.allStoreStatus = this.memberSetting.isRechargeInitial && this.memberSetting.isMemberConsume;
                this.memberListStatus = true;
                this.$nextTick(() => {
                    this.inputMemberKeyword = '';
                })
            })
        },
        handleReceivable() {
            this.priceChangeMenuPos = 0;
            this.showPriceChange();
        },
        showPriceChange() {                                         // 显示改价改折弹窗
            if (this.discountBase) {
                this.beforeAcitvityCheck(() => {
                    this.priceChangeStatus = true;
                });
            } else {
                this.$message.warning('活动商品，不参与折扣');
            }
        },
        getGuiderSelected(array) {
            this.guiderList = array;
        },
        getCouponRecordId(list) {                                     // 选中的优惠券id
            this.changeQueryUpdateCartting({
                ...this.queryUpdateCartting,
                couponRecordIds: list.map(e => e.sv_record_id)
            })
            this.beforeUpdateCatting();
        },
        handleRecharge() {                                          // 会员充值
            this.memberRechargeStatus = true;
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '0';
        },
        deleteInput() {                                             // 输入框从后删除一格
            const inputValue = this.inputNumber + '';
            if (inputValue == '0') return;
            if (inputValue.length == 1) return this.inputNumber = '0';
            this.inputNumber = inputValue.substring(0, inputValue.length - 1);
        },
        calculateInput(value) {                                     // 快捷键输入框的值
            const inputValue = this.inputNumber + '';
            if (this.isSubmitting) return;
            // 输入内容存在 ‘.’时，再次输入‘.’ return 
            if (inputValue.indexOf('.') > -1 && value.indexOf('.') > -1) return;
            if (this.inputPriceHandler < 1) {
                this.inputNumber = '';
                this.inputPriceHandler = 5;
            }
            clearTimeout(this.inputPriceTimer);
            this.inputPriceTimer = setTimeout(() => {
                this.inputPriceHandler = 0;
                this.inputPriceTimer = null;
                clearTimeout(this.inputPriceTimer);
            }, 5000);
            if (value != '0') {
                if (inputValue === '0' && value != '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + value;
            } else {
                if (parseFloat(inputValue) > 0 || inputValue === '0.') {
                    this.inputNumber = this.inputNumber + value;
                }
            }
            this.inputNumber = this.$app.verifyNumberDecimal(this.inputNumber);
        },
        handleBtnPrint() {                                          // 切换打印开关状态
            this.checkPrint = !this.checkPrint;
        },
        handleBtnInput(item) {                                      // 计算输入框的值
            if (this.preOrderMoneyData.used && this.preOrderMoneyData.money >= this.receivableMoney) return
            let value = item.value;
            if (value == '打印') {
                this.checkPrint = !this.checkPrint;
                return;
            }
            if (this.preMoneyEnough) {
                this.downPaymentSetted && this.$message.warning('已选择订金支付，不需要输入金额')
                this.preOrderMoneyData.used && this.$message.warning('已选择预付金支付，不需要输入金额')
                return
            }
            const inputValue = this.inputNumber + '';
            if (inputValue.indexOf('.') > -1 && value.indexOf('.') > -1) return;
            if (this.inputPriceHandler < 1) {
                this.inputNumber = '';
                this.inputPriceHandler = 5;
            }
            clearTimeout(this.inputPriceTimer);
            this.inputPriceTimer = setTimeout(() => {
                this.inputPriceHandler = 0;
                this.inputPriceTimer = null;
                clearTimeout(this.inputPriceTimer);
            }, 5000);
            if (value !== '0') {
                if (inputValue === '0' && value !== '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + value;
            } else {
                if (inputValue.indexOf('.') < 0 && parseFloat(this.inputNumber) === 0) return;
                this.inputNumber = this.inputNumber + value;
            }
            this.inputNumber = this.$app.verifyNumberDecimal(this.inputNumber);
        },
        handleControl(item) {                                       // 计算器右侧操作按钮点击事件
            switch (item.key) {
                case 'line10':
                    // 100
                    if (this.preOrderMoneyData.used && this.preOrderMoneyData.money >= this.receivableMoney) return
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
                case 'line11':
                    // 清除
                    this.clearInputNumber();
                    return;
                case 'line20':
                    // 50
                    if (this.preOrderMoneyData.used && this.preOrderMoneyData.money >= this.receivableMoney) return
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
                case 'line21':
                    // 打开折扣弹窗
                    this.showPriceChange();
                    return;
                case 'line30':
                    // 20
                    if (this.preOrderMoneyData.used && this.preOrderMoneyData.money >= this.receivableMoney) return
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
            }
        },
        preSubmit() {                                               // 预打/预结按钮提交
            this.$message.success(this.prePrintText + '成功');
            let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm');
            this.handlePrint(2, JSON.parse(JSON.stringify(this.carttingData)), 1, printTime);
            if (!this.$app.isNull(this.selectedInfo.sv_table_id)) {
                const postData = {
                    tableId: this.selectedInfo.sv_table_id,
                    state: 3,
                    sv_source_type: 100,
                    usingId: 0,
                    member_id: this.memberInfo.member_id,
                    // sv_employee_ids: (this.guiderList.map(e => e.id) || []).join(),
                    sv_employee_ids: JSON.stringify(this.guiderList),
                    sv_integral: this.usePointCheck ? parseFloat(this.pointData.point) : 0,
                    sv_coupon_record_ids: this.couponSelected ? this.couponSelected : '',
                    sv_order_receivable: this.receivableMoney,
                    sv_order_actual_money: this.carttingData.orderChangeMoney || 0
                }
                stockApi.updateCateringStateNew(postData).then(res => {
                    if (res || res === null) {
                        this.$root.$emit('preOrdered');
                    }
                });
            }
        },
        submitMoney(val) {                                          // 提交改价改折
            this.afterPriceChange = true;
            if (this.downPaymentInfo.isShowInCheckIn && this.downPaymentSetted && this.downPaymentMoney > val) {
                this.downPaymentMoney = val
            }
            this.updateOrderChangePrice(parseFloat(val));
            this.beforeUpdateCatting();
        },
        getUserConfigInfo() {                                       // 获取userInfo配置
            stockApi.getUserConfigInfo().then(res => {
                if (res) {
                    this.sv_uc_isenablepwd = res.sv_uc_isenablepwd;
                    if (!this.$app.isNull(res.sv_uc_isenableohter)) this.memberCardCheckType = res.sv_uc_isenableohter;
                }
            })
        },
        getConfigSwitchList() {                                     // 获取服务商品业绩平分
            stockApi.getConfigSwitchList().then(res => {
                if (res) {
                    this.Service_Commission_Switch = res[0];
                }
            })
        },
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
        updateCateringState() {                                     // 餐饮结算成功更新房台
            this.$root.$emit('updateCateringState', 1);
            if (this.$route.query.isOrderBack) {
                this.$router.push('/cashier/orderList');
            }
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

                if (this.checkPrint) {
                    this.handlePrintPlay(res, this.cashierJurisdiction.printSum, this.successInfo.printTime);
                    // if (this.userInfo.sv_us_industrytype === 1 || this.userInfo.sv_us_industrytype === 6 || this.userInfo.sv_us_industrytype === 9) {
                    //     this.handlePrintPlay(res, this.cashierJurisdiction.printSum, this.successInfo.printTime);
                    // } else {
                    //     this.handlePrint(1, JSON.parse(JSON.stringify(this.carttingData)), this.cashierJurisdiction.printSum, this.successInfo.printTime);
                    // }
                }
                !!this.isLightMeal && this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'checkin', this.successInfo.printTime);
                setTimeout(() => {
                    this.clearCartting(res.order_change);
                    this.updateCateringState();
                    this.clearMember();
                    this.clearSelectedInfo();

                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.ckeckInSuccessStatus = true;
                    // 刷新上一次订单结果
                    this.$root.$emit('settlementOrderRefresh');
                }, 300);
            })
        },
        handleCloseScan() {
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
            this.isSubmitting = false;
            this.checkInFocus();
        },
        handleDownPaymet() {                                        // 弹出订金搜索
            if (!this.downPaymentSetted) {
                this.showDownPayment = true;
            } else {
                this.$confirm('是否取消使用订金?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.inputNumber = this.receivableMoney;
                    this.downPaymentSetted = false;
                    this.downPaymentMoney = 0;
                    this.downPaymentInfo = {
                        no: '',
                        isShowInCheckIn: false
                    };
                    !!this.$refs.payTypeList && this.$refs.payTypeList.setDefaultPayTypeSelected();
                }).catch(() => {

                });
            }
        },
        handlePreMoneyPaymet() {
            if (!this.preOrderMoneyData.used) {
                this.preOrderMoneyData.used = true;
                this.inputNumber = this.$app.subtractNumber(this.receivableMoney, this.preOrderMoneyData.money || 0);
                if (this.inputNumber <= 0) {
                    this.inputNumber = 0;
                }
                this.$nextTick(() => {
                    !!this.$refs.payTypeList && this.$refs.payTypeList.clearPaySelectedList()
                })
            } else {
                this.$confirm('是否取消使用预付金?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.inputNumber = this.receivableMoney;
                    this.preOrderMoneyData.used = false;
                    !!this.$refs.payTypeList && this.$refs.payTypeList.setDefaultPayTypeSelected();
                }).catch(() => {

                });
            }
        },
        handleDownPaymentContentCancel() {                          // 订金详情取消
            this.showDownPaymentContent = false;
            this.showDownPayment = true;
        },
        handleDownPaymentContentSure() {                            // 订金详情确定
            if (parseFloat(this.receivableMoney) > this.downPaymentInfo.money) {
                this.downPaymentMoney = this.downPaymentInfo.money;
                this.inputNumber = this.$app.subtractNumber(parseFloat(this.receivableMoney), this.downPaymentInfo.money) + '';
            } else {
                this.downPaymentMoney = this.receivableMoney;
                this.inputNumber = '0';
            }
            this.downPaymentSetted = true;
            this.downPaymentInfo.isShowInCheckIn = true;
            this.showDownPaymentContent = false;
            this.showDownPayment = false;
            this.$nextTick(() => {
                this.$refs.payTypeList.clearPaySelectedList()
            })
        },
        handleDownPaymentChange(val) {                              // 输入订金单结果回调
            stockApi.getDownPaymentOrderInfoByNo({ no: val + '' }).then(res => {
                this.downPaymentInfo = res;
                this.downPaymentInfo.isShowInCheckIn = false;
                this.showDownPayment = false;
                this.showDownPaymentContent = true;
            });
        },
        //#region  确定结算
        handleSubmit(authCode) {                                   // 确定结算
            // let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            // !!this.isLightMeal && this.getKitchenPrinter(JSON.parse(JSON.stringify(this.carttingData.productResults)), 'checkin', printTime);
            // return
            // if (!this.JurisdictionObj.Cashlebtn) return this.$message.warning('没有结算权限');
            if (this.isSubmitting) return
            let isOpenBrandNum = this.$app.getLocalStorage('isOpenBrandNum') || false;
            if (this.isLightMeal && isOpenBrandNum && !this.afterBrandNum) {
                return this.showBrandNum = true;
            }
            let Select_Salesman = this.CashierManage.Select_Salesman ? this.CashierManage.Select_Salesman : { actions: '{ "visible":true, "disabled":false, "executable":true }' }
            let actions = JSON.parse(Select_Salesman.actions)
            if (!actions.executable && this.guiderList.length < 1) {
                // 选择导购员权限不可执行，且未选导购员，需弹出选择导购员
                this.showGuiderSelect();
                return this.$message.warning('请选择导购员')
            }
            let needMoney = this.$app.subtractNumber(this.carttingData.dealMoney, this.freeZeroMoney);
            if (this.preOrderMoneyData.used) {
                needMoney = this.$app.subtractNumber(needMoney, this.preOrderMoneyData.money || 0);
            }
            if (this.preOrderMoneyData.used && this.preOrderMoneyData.money >= this.receivableMoney) {
                // 预付款足够
                this.doSubmit();
            } else {
                if (this.paySelectedList.length < 1 && !this.downPaymentInfo.isShowInCheckIn) return this.$message({ message: '请选择支付方式', type: 'warning' });
                let multiPayStatus = this.isMultiPayType && this.paySelectedList.length > 1;
                const paymentMoneyInput = parseFloat(this.inputNumber);
                if (this.downPaymentSetted && this.downPaymentInfo.isShowInCheckIn && this.$app.addNumber(paymentMoneyInput, this.downPaymentMoney) < needMoney) {
                    return this.$message({ message: '收款金额不足' + needMoney, type: 'warning' });
                }

                if (!this.downPaymentSetted && !this.downPaymentInfo.isShowInCheckIn && paymentMoneyInput < needMoney && !multiPayStatus) {
                    return this.$message({ message: '收款金额不足' + needMoney, type: 'warning' });
                }

                if (this.$refs.payTypeList.checkChangezero().length > 0 && parseFloat(this.exchangeMoney) > 0) {
                    return this.$message({ message: this.$refs.payTypeList.checkChangezero(), type: 'warning' });
                }

                if (this.paySelectedList.find(e => e.name === '储值卡') && this.sv_uc_isenablepwd) {
                    // 储值卡验证 (设置储值卡验证为储值卡密码，会员未设置密码时，不验证)
                    // if (!this.$app.isNull(this.memberInfo.sv_mr_pwd) || this.memberCardCheckType !== 1) return this.memberCardCheckStatus = true;
                    if (this.memberCardCheckType !== 0) {
                        if (this.memberCardCheckType === 1) {
                            if (!this.$app.isNull(this.memberInfo.sv_mr_pwd)) return this.memberCardCheckStatus = true;
                        } else {
                            return this.memberCardCheckStatus = true;
                        }
                    }
                }
                this.doSubmit(authCode);
            }
        },
        memberCardCheckSuccess() {                                  // 会员储值卡消费验证成功回调
            this.doSubmit();
        },
        doSubmit(authCode) {                                        // 执行结算
            if (this.userInfo.sv_us_industrytype !== 1 && !this.$app.isNull(this.guiderList)) {
                this.salesNameList.push(this.guiderList.map(e => e.name).join('、'))
            }
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
                // #region 计算提成人
                let commissions = [];
                let pmArray = [];
                this.guiderList.forEach((gItem, gIndex) => {
                    const itemPercent = this.guiderList.length === 1 ? 100 : parseInt(100 / this.guiderList.length);
                    const setPercent = gIndex !== this.guiderList.length - 1 ? itemPercent : (100 - itemPercent * (this.guiderList.length - 1));
                    pmArray.push({
                        employeeId: gItem.id,
                        assign: false,
                        percent: this.Service_Commission_Switch.sv_is_enable && e.productType === 1 ? 100 : setPercent,
                        sex: 0
                    })
                })
                if (!this.$app.isNull(pmArray)) commissions.push(pmArray)
                if (!this.$app.isNull(e.buyStep.multCommissions)) {
                    // 购物车有提成人，使用购物车演算提成人
                    commissions = e.buyStep.multCommissions.map(workerItem => {
                        return workerItem.map(em => {
                            return {
                                employeeId: em.employeeId,
                                assign: em.assign,
                                percent: em.percent,
                                sex: em.sex
                            }
                        })
                    });
                }
                // #endregion
                let promotionId = this.$app.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
                let billabletime = null;
                if (this.carttingData.calcDto.buySteps[i].billabletime) {
                    const currentConfigcode = this.carttingData.calcDto.buySteps[i].code
                    if (currentConfigcode === this.checkBillabletimeInfo.code) {
                        billabletime = {
                            dateTime: this.checkBillabletimeInfo.durationUpdateTime,
                            duration: this.checkBillabletimeInfo.duration,
                            money: this.checkBillabletimeInfo.totalMoney,
                            code: this.checkBillabletimeInfo.code,
                        }
                    } else {
                        billabletime = {
                            dateTime: this.carttingData.calcDto.buySteps[i].billabletime.dateTime,
                            duration: this.carttingData.calcDto.buySteps[i].billabletime.duration,
                            money: this.carttingData.calcDto.buySteps[i].billabletime.money,
                            code: this.carttingData.calcDto.buySteps[i].billabletime.code,
                        }
                    }
                }
                return {
                    index: i + 1,
                    billabletime,
                    productId: e.productId,
                    withoutProductId: e.withoutProductId,
                    number: e.number,
                    booking: this.$app.isNull(e.bookingResult) ? null : {
                        bookingPrice: e.dealPrice,
                        bookingDate: e.bookingResult.bookingTimeDateString,
                        bookingTime: e.bookingResult.bookingTimeStartString + '-' + e.bookingResult.bookingTimeEndString,
                        packageGuid: e.bookingResult.packageId
                    },
                    tradePrice: e.tradePrice,
                    serviceName: serviceName,
                    setmealId: promotionId,
                    tasteIds: [...e.tastes.map(e => { return e.id })] || [],
                    chargingIds: [...e.chargings.map(e => { return e.id })] || [],
                    specIds: [...e.specs.map(e => { return e.id })] || [],
                    productChangePrice: e.productChangePrice,                   // 售价改价
                    productChangeMoney: e.productChangeMoney,                   // 小计改价
                    packageGroups: packageGroups,
                    multCommissions: commissions.length > 0 ? commissions : null
                }
            });
            let paymentList = [];
            if (this.downPaymentSetted && this.downPaymentInfo.isShowInCheckIn) {
                paymentList.push({
                    name: '订金',
                    money: parseFloat(this.downPaymentMoney),
                    data: this.downPaymentInfo.id
                })
            }
            if (this.preOrderMoneyData.used && this.preOrderMoneyData.money > 0) {
                paymentList.push({
                    name: '预付金',
                    money: parseFloat(this.receivableMoney) > parseFloat(this.preOrderMoneyData.money) ? parseFloat(this.preOrderMoneyData.money) : parseFloat(this.receivableMoney),
                    data: parseFloat(this.preOrderMoneyData.money)
                })
            }
            let hasStoreCard = false;
            this.paySelectedList.forEach((e, i) => {
                let paymentMoney = parseFloat(this.inputNumber);
                if (this.isMultiPayType) {
                    if (this.receivableMoney > paymentMoney) {
                        paymentMoney = i === 0 ? paymentMoney : this.$app.subtractNumber(this.receivableMoney, paymentMoney)
                    } else {
                        paymentMoney = i === 0 ? paymentMoney : 0
                    }
                }
                if (e.name === '储值卡') hasStoreCard = true;
                paymentList.push({
                    name: e.name,
                    money: paymentMoney,
                    data: e.name === '储值卡' ? this.memberInfo.sv_wallet_id : null
                })
            })
            let filter = this.paySelectedList.filter(e => e.name === '扫码支付');
            if (filter.length > 0) {
                if (!this.userInfo.dec_payment_config.ConvergePay) return this.$message.warning('您尚未开通扫码支付，请联系客服')
                if (this.carttingData.dealMoney === 0) {
                    return this.$message.warning('收款金额为零，支付方式不支持扫码支付')
                }
            }
            if (this.isMultiPayType) {
                // 组合支付过滤金额为零
                paymentList = paymentList.filter(e => e.money !== 0)
            }
            this.successInfo.dealMoney = this.carttingData.dealMoney;
            const svWithoutListId = this.selectedInfo.sv_without_list_id || null
            let postData = {
                antiSettleOrderId: this.$app.isNull(this.selectedInfo.sv_order_list_id) ? null : this.selectedInfo.sv_order_list_id,
                svWithoutListId: this.$route.query.isOrderBack ? null : svWithoutListId,
                totalMoney: this.carttingData.totalMoney,           // 原总价
                dealMoney: this.carttingData.dealMoney,             // 成交总价 === dealMoney
                exchangeMoney: this.exchangeMoney,                  // 找零金额
                payments: paymentList,
                caleDto: {
                    buySteps: buySteps,
                    bookingClassId: this.carttingData.bookingClassId || null,
                    tableId: this.selectedInfo.sv_table_id || null,
                    giveSteps: this.carttingGiveData,               // 赠送商品列表
                    memberId: this.memberInfo.member_id,            // 会员Id
                    // walletId: this.$app.isNull(this.memberInfo.member_id) || !hasStoreCard ? null : this.memberInfo.sv_wallet_id,
                    walletId: this.carttingData.calcDto.walletId,
                    couponRecordIds: this.couponSelected ? this.couponSelected : null,              // 优惠券Id
                    orderChangeMoney: this.carttingData.orderChangeMoney,                           // 整单改价改折
                    memberPoint: this.usePointCheck ? parseFloat(this.pointData.point) : null       // 积分抵扣
                },
                remark: this.selectedInfo.sv_remark,
                sourceType: 100,
                password: this.isFixing ? this.fixPassword : null,
                orderDateTime: this.isFixing ? this.$app.currentTime(new Date(this.fixingTime), 'yyyy-MM-dd HH:mm:ss') : null,
                bizEmployeeId: this.$app.isNull(this.selectedInfo.sv_employee_id) ? null : this.selectedInfo.sv_employee_id,    // 美业开单人
                isSettle: true
            }
            this.isSubmitting = true;
            stockApi.orderSave(postData, this.Forbid, this.isFixing).then(res => {
                if (res !== false && !this.$app.isNull(res)) {
                    this.successInfo.paymentList = paymentList;
                    if (paymentList.findIndex(p => p.name === '扫码支付') > -1 && !!this.$refs.payTypeList && this.$refs.payTypeList.isScanPay()) {
                        this.payInfo = {
                            queryId: res.queryId,
                            svOrderListId: res.svOrderListId,
                            receivableMoney: this.receivableMoney,
                            money: paymentList.find(p => p.name === '扫码支付').money
                        }
                        this.checkInBlur();
                        if (!!this.$refs.payTypeList) {
                            this.$nextTick(() => {
                                this.$refs.payTypeList.handleScan(authCode ? true : false);
                                if (!this.$app.isNull(authCode)) this.$refs.payTypeList.concatAuthcode({ keyCode: 13, authCode })
                            })
                        }
                    } else {
                        this.submitSuccess(res.svOrderListId);
                    }
                } else {
                    this.isSubmitting = false;
                    this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                }
            }).catch(_ => {
                this.isSubmitting = false;
                this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
            });
        },
        //#region  小票打印
        handlePrint(printType = 1, carttingData, times = 1, printTime) {
            const isCloudPrint = this.cashierJurisdiction.printCloudType === 1;
            let giveProductResults = this.$app.isNull(carttingData.giveProductResults) ? [] : carttingData.giveProductResults.map(e => {
                let typeName = e.giveStepPromotion.type === 3 ? '满送-' : '加价购-';
                return {
                    ...e,
                    productName: typeName + e.productName
                }
            });
            let cardList = carttingData.productResults.filter(e => e.buyStepPromotion && e.buyStepPromotion.type === 15);
            cardList = cardList.map(e => {
                let promotionId = e.buyStepPromotion.promotionId;
                let leftcount, validity_date;
                for (let index = 0; index < this.memberInfo.cardPackageList.length; index++) {
                    let card = this.memberInfo.cardPackageList[index];
                    for (let subIndex = 0; subIndex < card.list.length; subIndex++) {
                        let cardItem = this.memberInfo.cardPackageList[index].list[subIndex];
                        if (cardItem.userecord_id == promotionId) {
                            leftcount = cardItem.sv_mcc_leftcount;
                            validity_date = cardItem.validity_date;
                            break;
                        }
                    }
                }
                return {
                    ...e,
                    leftcount: leftcount,
                    validity_date: validity_date
                }
            });
            // 合并同商品id且同成交价
            let tableList = carttingData.productResults.filter(e => e.buyStepPromotion === null || e.buyStepPromotion.type !== 15).concat(giveProductResults).concat(this.cateringReturn);

            let printArray = [];
            tableList.forEach(e => {
                let filterItem = printArray.find(k => k.productId === e.productId && k.dealPrice === e.dealPrice && k.sepcs === e.sepcs && JSON.stringify(k.chargings) === JSON.stringify(e.chargings) && JSON.stringify(k.tastes) === JSON.stringify(e.tastes) && JSON.stringify(k.specs) === JSON.stringify(e.specs));
                if (filterItem && !e.isPackage) {
                    filterItem.number = this.$app.addNumber(filterItem.number, e.number);
                    filterItem.dealMoney = this.$app.addNumber(filterItem.dealMoney, e.dealMoney);
                    filterItem.productCouponMoney = this.$app.addNumber(filterItem.productCouponMoney, e.productCouponMoney);
                    filterItem.orderCouponMoney = this.$app.addNumber(filterItem.orderCouponMoney, e.orderCouponMoney);
                } else {
                    printArray.push(e)
                }
            })

            let printData = {
                customTitle: this.$route.query.isOrderBack ? '反结单' : '',
                /*打印类型*/
                printType: printType,                        // 1 ? '销售小票' : '预打/预结小票',
                printTitleSymbol: this.prePrintText,         // 预打 or 预结        
                /*打印份数*/
                printSum: parseInt(times),
                /*店铺logo*/
                shopLogo: this.userInfo.sv_store_logo,
                /*店铺名称*/
                shopName: this.userInfo.sv_us_shortname,
                /*电话*/
                shopTel: this.userInfo.sv_us_phone,
                /*地址*/
                shopAddress: this.userInfo.sv_us_address,
                dailySerialNumber: this.successInfo.everyday_serialnumber || '',
                /*订单号*/
                orderNumber: this.successInfo.orderNumber !== 0 ? this.successInfo.orderNumber : '',
                /*销售时间*/
                salePrintTime: printType === 1 ? printTime : null,
                /*打印时间*/
                printTime: printTime,
                /*操作员*/
                controlName: this.selectedInfo.sv_employee_name || this.userInfo.sv_ul_name,
                /*销售人员*/
                salesName: this.salesNameList.join('|'),
                /*次卡抵扣表格*/
                cardList: cardList,
                /*商品表格*/
                tableList: printArray,
                /*合计总数量*/
                totalNumber: carttingData.buyNumber,
                /*合计总金额*/
                dealTotalMoney: this.$app.moneyFixed(carttingData.dealMoney),
                /*原价金额*/
                totalMoney: this.$app.moneyFixed(carttingData.totalMoney),
                /*优惠金额*/
                discountMoney: this.$app.isNull(this.discountMoney) ? '' : this.discountMoney,
                /*应收*/
                receivableMoney: this.receivableMoney,
                /*实收*/
                collectionsMoney: this.$app.moneyFixed(this.successInfo.dealMoney),
                /*抹零*/
                freeZeroMoney: this.freeZeroMoney,
                /*找零*/
                exchangeMoney: this.$app.moneyFixed(this.successInfo.exchangeMoney),
                /*支付方式*/
                payTypeList: this.successInfo.paymentList,
                /*支付单号*/
                // payOrderNumber: printType === 1 && !this.$app.isNull(this.queryPay.queryId) ? this.queryPay.queryId : '',
                payOrderNumber: printType === 1 && !this.$app.isNull(this.successInfo.orderNumber) ? this.successInfo.orderNumber : '',
                duration: printType === 1 && !this.$app.isNull(this.successInfo.duration) ? this.successInfo.duration : '',
                /*会员信息*/
                // memberInfo: this.$app.isNull(this.memberInfo.member_id) ? {} : JSON.parse(JSON.stringify(this.memberInfo)),
                memberInfo: {
                    member_id: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.member_id,
                    sv_mr_name: printType === 1 ? this.successInfo.sv_mr_name : this.memberInfo.sv_mr_name,
                    sv_mr_cardno: printType === 1 ? this.successInfo.sv_mr_cardno : this.memberInfo.sv_mr_cardno,
                    sv_mr_mobile: printType === 1 ? this.successInfo.sv_mr_mobile : this.memberInfo.sv_mr_mobile,
                    sv_mr_address: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.sv_mr_address,
                    availableamount: printType === 1 ? this.successInfo.availableamount : this.memberInfo.sv_mw_availableamount,
                    integral: printType === 1 ? (this.successInfo.order_integral + '/' + this.successInfo.availablepoint) : '--/--',
                    effective_integral: printType === 1 ? this.successInfo.availablepoint : '--',
                    sv_mr_platenumber: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.sv_mr_platenumber
                },
                /*备注*/
                remark: this.selectedInfo.sv_remark,
                /*轻餐牌号*/
                brandNum: this.brandNum,
                /*房台号*/
                sv_catering_grade: this.selectedInfo.sv_table_name,
                /*房台ID*/
                sv_table_id: this.selectedInfo.sv_table_id,
                /*就餐人数*/
                sv_person_num: this.selectedInfo.sv_person_num,
            }
            if (isCloudPrint) {
                // let dataObj = this.$print.customSales(printData, isCloudPrint);
                // this.handleCloudPrint(dataObj);
            } else {
                this.$print.customSales(printData, isCloudPrint);
            }
        },
        //#region  小票打印-游乐场
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
                if (!this.$app.isNull(e.sv_skill_name)) productName = e.sv_skill_name;
                if (!this.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                return {
                    isPackage: packageList.length > 0,
                    sv_return_status: e.sv_return_status,
                    id: e.product_id,
                    productName: (e.sv_return_status !== 0 ? '(退)' : '') + productName,
                    tableName: (e.sv_p_barcode || '').indexOf('Billabletime-') > -1 ? e.sv_table_name_old : '',
                    duration: e.duration,
                    barCode: e.sv_p_barcode,
                    unitName: e.sv_p_unit,
                    number: e.sv_return_status !== 0 ? e.product_num : e.product_num_bak,
                    price: (e.sv_p_barcode || '').indexOf('Billabletime-') > -1 ? '' : e.product_price,
                    product_unitprice: e.product_unitprice,
                    dealMoney: e.product_total,
                    productCouponMoney: this.$app.multiplyNumber(this.$app.subtractNumber(e.product_price, e.product_unitprice), e.product_num_bak),
                    packageGroups,
                }
            });
            let printArray = [];
            tableList.forEach(e => {
                // 合并同商品id、同成交价、非退款商品
                let filterItem = printArray.find(k => k.productName === e.productName && k.product_unitprice === e.product_unitprice && k.sv_return_status === e.sv_return_status);
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
        //#region  小票打印-云打印
        handleCloudPrint(dataObj) {
            let query = {
                id: this.cashierJurisdiction.cloundPrintId,
                type: 0,
                brand_id: 0,
                userid: this.userInfo.user_id,
                info: dataObj.printData,
                print_times: dataObj.printSum,
            }
            stockApi.postCloudPrint(query).then(res => {
                if (res.success) {
                    this.$message.success('正在执行云打印')
                }
            })
        },
        getFoodTastes(e) {                                                      // 获取口味
            let tastes = '';
            !this.$app.isNull(e.tastes) && (tastes = e.tastes.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ''));
            !this.$app.isNull(e.chargings) && (tastes += e.chargings.reduce((txt, item, i) => (txt + (i === 0 ? '' : ' ') + item.name), ' '));
            return tastes
        },
        async getTemplate(temId) {                                              // 获取用户标签模板
           
        },
        //#region  标签打印
        async printPriceTag(e, kitchenPrinter) {                                // 打印商品标签
            await this.getTemplate()
            if (this.$app.isNull(this.templateList)) return this.$message.error('获取标签模板数据失败')
            const temJson = this.templateList.find(e => e.templateId === kitchenPrinter[0].sv_labeltemplate_id);
            let productName = e.productName;
            !this.$app.isNull(e.specs) && (productName += '(' + e.specs[0].name + ')');
            const tastes = this.getFoodTastes(e);
            const prData = {
                sv_without_list_id: this.successInfo.orderNumber,                   // 单号
                everyday_serialnumber: this.successInfo.everyday_serialnumber,      // 取餐号
                sv_p_name: productName,                                             // 商品名称
                sv_production_date: new Date(),                                     // 打印时间
                tastes: tastes,                                                     // 口味
                sv_p_unitprice: e.dealPrice,                                        // 单价
                sv_productionplace: this.userInfo.sv_us_address,                    // 店铺地址
                sv_us_phone: this.userInfo.sv_us_phone,                             // 店铺电话
                sv_catering_grade: '',                                              // 台号->牌号
            }

            for (let i = 0; i < e.number; i++) {
                printLabel({
                    data: [prData],
                    tem: temJson,
                    printName: kitchenPrinter[0].sv_printer_ip,
                    dir: '0',
                    columnNum: 1,
                    userInfo: this.userInfo
                });
            }
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
    }
};
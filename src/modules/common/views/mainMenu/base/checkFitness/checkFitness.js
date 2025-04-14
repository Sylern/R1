import base from '@/api/base';
import { mapActions, mapMutations, mapState } from 'vuex';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import memberCardCheck from '../memberCardCheck/memberCardCheck.vue';
import priceChange from '../priceChange/priceChange.vue';
import classSelection from '../classSelection/classSelection.vue';
export default {
    name: 'checkFitness',
    components: { payTypeList, guiderSelect, memberList, memberRecharge, memberCardCheck, priceChange, classSelection },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        },
        courseType: {
            type: Number,
            default: 1
        },
        extendInfo: {
            type: Object,
            default: () => {
                return {
                    extendId: 0,
                    sv_p_name: '',
                    courseDataType: 1,
                    sv_number_people: 0,
                    sv_product_total: 0,
                    sv_effective_time: '',
                    sv_effective_time_start: '',
                    sv_effective_time_end: '',
                    sv_effective_time_num: '',
                    sv_effective_unit_type: 100,
                    open_card_way: 100,
                    sv_open_card_way_list: [],
                }
            }
        },
        importInfo: {
            type: Object,
            default: () => {
                return {
                    num: 0,
                    give: 0,
                    remark: '',
                    givePoint: 0,
                    courseMoney: 0,
                    money: 0
                }
            }
        }
    },
    data() {
        return {
            Forbid: '',                                         // 结算接口时间戳
            checkMoney: null,                                   // 应收金额
            inputNumber: '',                                    // 实付款
            discountBase: 0,                                    // 可折扣优惠金额

            inputPriceTimer: null,
            inputPriceHandler: 0,                               // 输入金额控制，小于 1 时覆盖，否则累加
            checkFitnessStatus: true,                            // 结算弹窗
            ckeckReturnSuccessStatus: false,                    // 结算成功弹窗
            inputMemberKeyword: '',                             // 会员搜索输入框
            guiderSelectStatus: false,                          // 销售员弹窗状态
            memberListStatus: false,                            // 会员列表弹窗状态
            memberRechargeStatus: false,                        // 会员充值弹窗状态
            afterPriceChange: false,                            // 是否在整单改价之后
            payTypePos: 0,                                      // 支付方式选择
            priceChangeMenuPos: 0,
            priceChangeStatus: false,                           // 改价改折弹窗状态
            memberCardCheckStatus: false,                       // 结算前储值卡支付验证弹窗
            classSelectionStatus: false,                        // 选择班级弹窗
            classSelectionOrderId: '',                          // 选择班级-订单id
            classSelectionMemberId: '',                         // 选择班级-会员id

            payTypeList: [],
            guiderList: [],
            checkPrint: true,                                   // 是否打印
            isSubmitting: false,                                // 正在结算
            payInfo: {
                queryId: '',
                businessType: 1,
                svOrderListId: null,
                receivableMoney: null,                          // 应收金额
                money: null                                     // 扫码支付金额
            },
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
                    value: '折扣'
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
            successInfo: {
                orderNumber: '',                    // 订单号
                payment: '',                        // 支付
                checkMoney: 0,                      // 应收金额
                dealMoney: 0,                       // 实收金额
                memberName: '',                     // 会员名称
                availableamount: '',                // 储值卡余额
            },
            successShowTime: 3,
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'cashierJurisdiction', 'memberInfo', 'selectedInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        isCommon() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype != 27
        },
        imgBase() {
            return base.frontImgBase
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
                    this.checkMoney = this.importInfo.money;
                    this.inputNumber = this.importInfo.money;
                    // this.discountBase = this.$app.addNumber(this.importInfo.courseMoney, this.carttingData.lastOrderCouponMoney);
                    this.discountBase = this.$app.subtractNumber(this.importInfo.money, this.carttingData.dealMoney);
                    this.successInfo = {
                        orderNumber: '',                    // 订单号
                        payment: '',                        // 支付
                        checkMoney: 0,                      // 应付金额
                        dealMoney: 0,                       // 实付金额
                        memberName: '',                     // 会员名称
                        availableamount: '',                // 储值卡余额
                    };
                    this.guiderList = [];
                    this.isSubmitting = false;
                    this.successShowTime = 3;
                    this.checkFitnessStatus = true;
                    this.ckeckReturnSuccessStatus = false;
                    this.payInfo = {
                        queryId: '',
                        svOrderListId: null,
                        businessType: 1,
                        receivableMoney: this.checkMoney,
                        money: this.checkMoney
                    };

                    this.getUserConfigInfo();
                    this.$nextTick(() => {
                        !!this.$refs.checkFitness && this.$refs.checkFitness.focus();
                    });
                } else {
                    !!this.$refs.checkFitness && this.$refs.checkFitness.blur();
                }
            }
        },
        memberSelected: {
            inmmediate: true,
            handler(newVal, oldVal) {
                this.payTypePos = 0;
                if (newVal) {
                    this.payTypeList.unshift({
                        icon: 'p_cardpay',
                        name: '储值卡'
                    });
                } else {
                    this.payTypeList = this.payTypeList.filter(e => e.name !== '储值卡')
                }
            }
        },
        memberListStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkFitness.blur();
                } else {
                    this.$refs.checkFitness.focus();
                }
            }
        },
        memberRechargeStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkFitness.blur();
                } else {
                    this.$refs.checkFitness.focus();
                }
            }
        },
        priceChangeStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkFitness.blur();
                } else {
                    this.priceChangeMenuPos = 1;
                    this.$refs.checkFitness.focus();
                }
            }
        },
        ckeckReturnSuccessStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let timer = null;
                    timer = setInterval(() => {
                        this.successShowTime = this.successShowTime - 1;
                        if (this.successShowTime === 0) {
                            this.closeDialog();
                            clearInterval(timer);
                            this.$root.$emit('refreshGoodsList');
                        }
                    }, 600);
                }
            }
        },
        'memberInfo.member_id': {
            handler(newVal, oldVal) {
                this.inputNumber = this.checkMoney = this.$app.addNumber(this.importInfo.courseMoney, this.carttingData.dealMoney || 0);
            }
        },
    },
    methods: {
        ...mapMutations(['update', 'updateOrderChangePrice', 'clearMember']),
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
                case 115:                                     // F4 折扣
                    this.showPriceChange();
                    return;
                case 116:                                     // F5 会员刷卡

                    return;
                default:
                    console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        checkInFocus() {
            this.$nextTick(() => {
                !!this.$refs.checkFitness && this.$refs.checkFitness.focus();
            })
        },
        checkInBlur() {
            this.$nextTick(() => {
                !!this.$refs.checkFitness && this.$refs.checkFitness.blur();
            })
        },

        handlePrevent(e) {                                          // 会员输入框事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.showMemberList();
            } else {
                return false;
            }
        },
        showGuiderSelect() {                                        // 显示销售员弹窗
            this.guiderSelectStatus = true;
        },
        showStoreCard() {
            this.$root.$emit('keyCode', 80);
        },
        showEquityCard() {
            this.$root.$emit('keyCode', 85);
        },
        showMemberList() {                                          // 显示会员弹窗
            this.memberListStatus = true;
            this.$nextTick(() => {
                this.inputMemberKeyword = '';
            })
        },
        handleInputMoney() {
            this.showPriceChange(1);
        },
        showPriceChange(pos) {                                      // 显示改价改折弹窗
            // if (this.isCommon && !this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限')
            // if (!this.isCommon && !this.JurisdictionObj.key_change_price_catering) return this.$message.warning('没有改价权限')
            this.priceChangeMenuPos = pos;
            this.priceChangeStatus = true;
        },
        getGuiderSelected(array) {
            this.guiderList = array;
        },
        handleRecharge() {                                          // 会员充值
            this.memberRechargeStatus = true;
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '0';
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputNumber == '0') return;
            if (this.inputNumber.length == 1) return this.inputNumber = '0';
            this.inputNumber = this.inputNumber.substring(0, this.inputNumber.length - 1);
        },
        calculateInput(value) {                                     // 快捷键输入框的值
            if (this.isSubmitting) return;
            // 输入内容存在 ‘.’时，再次输入‘.’ return 
            if (this.inputNumber.indexOf('.') > -1 && value.indexOf('.') > -1) return;
            if (this.inputPriceHandler < 1) {
                this.inputNumber = '';
                this.inputPriceHandler = 5;
            }
            clearInterval(this.inputPriceTimer);
            this.inputPriceTimer = setInterval(() => {
                this.inputPriceHandler--;
                if (this.inputPriceHandler < 1) {
                    this.inputPriceTimer = null;
                    clearInterval(this.inputPriceTimer);
                }
            }, 1000);
            if (value != '0') {
                if (this.inputNumber == '0' && value != '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + value;
            } else {
                if (parseFloat(this.inputNumber) > 0 || this.inputNumber === '0.') {
                    this.inputNumber = this.inputNumber + value;
                }
            }
            this.inputNumber = this.$app.verifyNumberDecimal(this.inputNumber);
        },
        handleCloseMember() {                                       // 关闭会员弹窗触发
            this.memberListStatus = false;
        },
        handleBtnPrint() {                                          // 切换打印开关状态
            this.checkPrint = !this.checkPrint;
        },
        handleBtnInput(item) {                                      // 计算输入框的值
            let value = item.value;
            if (this.inputNumber.indexOf('.') > -1 && value.indexOf('.') > -1) return;
            if (value == '打印') {
                this.checkPrint = !this.checkPrint;
                return;
            }
            if (this.inputPriceHandler < 1) {
                this.inputNumber = '';
                this.inputPriceHandler = 5;
            }
            clearInterval(this.inputPriceTimer);
            this.inputPriceTimer = setInterval(() => {
                this.inputPriceHandler--;
                if (this.inputPriceHandler < 1) {
                    this.inputPriceTimer = null;
                    clearInterval(this.inputPriceTimer);
                }
            }, 1000);
            if (value != '0') {
                if (this.inputNumber == '0' && value != '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + value;
            } else {
                if (this.inputNumber.indexOf('.') < 0 && parseFloat(this.inputNumber) === 0) return;
                this.inputNumber = this.inputNumber + value;
            }
            this.inputNumber = this.$app.verifyNumberDecimal(this.inputNumber);
        },
        handleControl(item) {                                       // 计算器右侧操作按钮点击事件
            switch (item.key) {
                case 'line10':
                    // 100
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
                case 'line11':
                    // 清除
                    this.clearInputNumber();
                    return;
                case 'line20':
                    // 50
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
                case 'line21':
                    // 打开折扣弹窗
                    this.showPriceChange();
                    return;
                case 'line30':
                    // 20
                    this.inputNumber = this.$app.moneyFixed(item.value, 2);
                    return;
            }
        },
        preSubmit() {                                               // 预打/预结按钮提交
            this.$message.success('预打成功');
            let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.handlePrint(2, 1, printTime);
        },
        submitMoney(val) {                                          // 提交改价改折
            this.inputNumber = val;
            this.checkMoney = val;
            this.payInfo.receivableMoney = val;
        },
        handleCloseScan() {
            this.checkInFocus();
        },
        successHandle() {
            this.isSubmitting = false;
            this.checkFitnessStatus = false;
            this.ckeckReturnSuccessStatus = true;
            this.successInfo = {
                payment: this.$refs.payTypeList.getPayTypeInfo()[0].name,
                orderNumber: this.successInfo.orderNumber,                                          // 订单号
                checkMoney: this.$app.moneyFixed(this.checkMoney),                                  // 应收金额
                dealMoney: this.$app.moneyFixed(this.inputNumber),                                  // 实退款
                memberName: this.memberInfo.sv_mr_name,                                             // 会员名称
                availableamount: this.$app.moneyFixed(this.successInfo.availableamount)
            };
            this.$nextTick(() => {
                this.$emit('handleSuccess');
            });
            if (this.checkPrint) {
                let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.handlePrint(1, 1, printTime);
            }
        },
        handleSubmit() {                                            // 确定结算
            if (!this.memberSelected) return this.showMemberList()
            if (!this.JurisdictionObj.Cashlebtn) return this.$message.warning('没有结算权限')
            if (this.payTypePos === -1) return this.$message({ message: '请选择支付方式', type: 'warning' });
            if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1) {
                this.showGuiderSelect();
                return this.$message.warning('请选择业绩归属人')
            }
            if (parseFloat(this.inputNumber) < parseFloat(this.checkMoney)) {
                return this.$message({ message: '收款金额不足' + this.checkMoney, type: 'warning' });
            }

            if (parseFloat(this.inputNumber) > parseFloat(this.checkMoney) && this.$refs.payTypeList.getPayTypeInfo()[0].name !== '现金') {
                return this.$message({ message: '只有现金支付，才可以找零操作', type: 'warning' });
            }
            if (this.$refs.payTypeList.getPayTypeInfo().find(e => e.name === '储值卡')) {
                if (parseFloat(this.checkMoney) > this.memberInfo.sv_mw_availableamount) return this.$message({ message: '储值卡余额不足' + this.checkMoney, type: 'warning' });
                if (this.sv_uc_isenablepwd) {
                    // 储值卡验证 (设置储值卡验证为储值卡密码，会员未设置密码时，不验证)
                    if (this.memberCardCheckType !== 0) {
                        if (this.memberCardCheckType === 1) {
                            if (!this.$app.isNull(this.memberInfo.sv_mr_pwd)) return this.memberCardCheckStatus = true;
                        } else {
                            return this.memberCardCheckStatus = true;
                        }
                    }
                }
            }
            this.doSubmit();
        },
        getUserConfigInfo() {                                       // 获取userInfo配置
            stockApi.getUserConfigInfo().then(res => {
                if (res) {
                    this.sv_uc_isenablepwd = res.sv_uc_isenablepwd;
                    if (!this.$app.isNull(res.sv_uc_isenableohter)) this.memberCardCheckType = res.sv_uc_isenableohter;
                }
            })
        },
        doSubmit() {                                                // 执行结算
            this.isSubmitting = true;
            let commissions = [];
            this.guiderList.forEach((e, i) => {
                const itemPercent = this.guiderList.length === 1 ? 100 : parseInt(100 / this.guiderList.length)
                commissions.push({
                    employeeId: e.id,
                    assign: false,
                    percent: i !== this.guiderList.length - 1 ? itemPercent : (100 - itemPercent * (this.guiderList.length - 1)),
                    sex: 0
                })
            })
            let list = this.dataList.map((e, i) => {
                return {
                    sv_product_id: e.sv_product_id,
                    sv_course_packageid: this.extendInfo.courseDataType === 2 ? this.extendInfo.extendId : 0,
                    sv_product_class_hourid: e.sv_product_class_hourid,
                    sv_class_hour_num: e.number,
                    sv_give_num: e.sv_give_class_hour,
                    sv_subtotal: parseFloat(e.priceTotal),                      // 小计
                    sv_price: parseFloat(e.unitprice),                          // 单价
                    sv_favorable: 1,
                    sv_start_date: null,
                    sv_end_date: null,
                    sv_remarks: '',
                    sv_draft_detail_id: null
                }
            });

            let ordinary_order = {
                antiSettleOrderId: null,
                svWithoutListId: null,
                totalMoney: this.carttingData.dealMoney,
                dealMoney: this.carttingData.dealMoney,
                exchangeMoney: 0,
                caleDto: {
                    buySteps: this.carttingData.productResults.map((e, i) => {
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
                        return {
                            index: i + 1,
                            productId: e.productId,
                            number: e.number,
                            tradePrice: e.tradePrice,
                            serviceName: serviceName,
                            setmealId: promotionId,
                            tasteIds: [...e.tastes.map(e => { return e.id })] || [],
                            chargingIds: [...e.chargings.map(e => { return e.id })] || [],
                            specIds: [...e.specs.map(e => { return e.id })] || [],
                            productChangePrice: e.productChangePrice,                   // 售价改价
                            productChangeMoney: e.productChangeMoney,                   // 小计改价
                            packageGroups: packageGroups,
                            commissions: commissions.length > 0 ? commissions : null
                        }
                    }),
                    giveSteps: [],
                    memberId: this.memberInfo.member_id,            // 会员Id
                    couponRecordIds: null,
                    orderChangeMoney: null,
                    memberPoint: null
                },
                remark: this.importInfo.remark,
                password: null,
                orderDateTime: null,
                bizEmployeeId: null,
                isSettle: true
            };

            let query = {
                ordinary_order,
                course_order: this.$app.isNull(list) ? null : {
                    sv_order_belong_type: this.extendInfo.courseDataType,
                    sv_open_card_way: this.extendInfo.open_card_way,
                    sv_open_card_day: this.extendInfo.open_card_way === 200 ? this.extendInfo.sv_open_card_way_list.find(e => e.value === 200).data : 0,
                    sv_start_date: this.extendInfo.open_card_way === 300 ? this.extendInfo.sv_effective_time_start : null,
                    sv_receivable: parseFloat(this.$app.subtractNumber(this.inputNumber, this.carttingData.dealMoney)),
                    sv_paid_amount: parseFloat(this.$app.subtractNumber(this.inputNumber, this.carttingData.dealMoney)),
                    sv_favorable: parseFloat(this.importInfo.money) === 0 ? 1 : this.$app.moneyFixed(this.$app.divideNumber(this.checkMoney, this.importInfo.money), 2),
                    sv_order_num: this.importInfo.num,
                    sv_affiliation_m_id: this.extendInfo.sv_affiliation_m_id.map(e => e.id),
                    sv_commission_peoples: commissions,
                    sv_source: 100,
                    list
                },

                sv_member_id: this.memberInfo.member_id,
                sv_wallet_id: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.sv_wallet_id,
                sv_receivable: parseFloat(this.inputNumber),
                sv_paid_amount: parseFloat(this.inputNumber),
                sv_payment_method: this.$refs.payTypeList.getPayTypeInfo()[0].name,
                sv_annexs: [],                                                  // 附件
                sv_order_time: this.importInfo.orderTime,
                sv_remarks: this.importInfo.remark,
                sv_give_integral: this.importInfo.givePoint,
            }
            cardManageApi.mixedSettleOrder(query, this.Forbid).then(res => {
                this.isSubmitting = false;
                if (res !== false && !this.$app.isNull(res)) {
                    this.classSelectionOrderId = res.orderId;
                    this.classSelectionMemberId = res.memberId;
                    this.successInfo.orderNumber = res.orderId;
                    this.successInfo.availableamount = res.availableamount;
                    if (res.isQuery) {
                        // 扫码支付
                        this.payInfo = {
                            queryId: res.queryId,
                            svOrderListId: res.svOrderListId,
                            businessType: res.businessType,
                            receivableMoney: query.sv_payment_amount,
                            money: res.payMoney
                        }
                        this.checkInBlur();
                        this.$refs.payTypeList.handleScan();
                    } else {
                        this.successHandle();
                    }
                }
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },

        handlePrint(printType = 1, times = 1, printTime) {
            let tableList = [...this.dataList].concat(this.carttingData.productResults.map(e => {
                return {
                    sv_p_name: e.productName,
                    number: e.number + '',
                    priceTotal: e.price,
                    timedetail: [],
                    sv_effective_time: ''
                }
            }))
            let printData = {
                /*打印类型*/
                printTtitle: printType === 1 ? '结算小票' : '预打单',
                /*打印份数*/
                printSum: parseInt(times),
                /*店铺logo*/
                shopLogo: this.userInfo.sv_store_logo,
                /*店铺名称*/
                shopName: this.userInfo.sv_us_shortname,
                isFitness: true,
                /*电话*/
                shopTel: this.userInfo.sv_us_phone,
                /*地址*/
                shopAddress: this.userInfo.sv_us_address,
                /*订单号*/
                orderNumber: this.successInfo.orderNumber !== 0 ? this.successInfo.orderNumber : '',
                /*打印时间*/
                printTime: printTime,
                /*操作员*/
                controlName: this.userInfo.sv_ul_name,
                /*商品表格*/
                tableList: tableList,
                /*合计总数量*/
                totalNumber: this.importInfo.number,
                /*应付金额*/
                totalMoney: this.$app.moneyFixed(this.checkMoney),
                /*实付款*/
                dealMoney: this.$app.moneyFixed(this.inputNumber),
                /*支付方式*/
                payment: this.successInfo.payment,
                /*会员信息*/
                memberInfo: this.$app.isNull(this.memberInfo.member_id) ? {} : JSON.parse(JSON.stringify(this.memberInfo)),
                /*会员储值余额*/
                availableamount: this.$app.isNull(this.memberInfo.member_id) ? 0 : this.successInfo.availableamount,
                /*备注*/
                remark: this.importInfo.remark
            }
            this.$print.salesCourse(printData);
        },
    }
};
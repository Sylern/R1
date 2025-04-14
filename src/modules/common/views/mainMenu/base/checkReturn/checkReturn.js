import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import { returnPsw } from '@/components/index';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import memberList from '../memberList/memberList.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import priceChange from '../priceChange/priceChange.vue';
export default {
    name: 'checkReturn',
    components: { payTypeList, returnPsw, guiderSelect, memberList, memberRecharge, priceChange },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderNumber: {
            type: Number,
            default: null
        },
        orderList: {
            type: Array,
            default: () => {
                return []
            }
        },
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        },
        importMoneyInfo: {
            type: Object,
            default: () => {
                return {
                    orderMoney: 0,
                    addGoodsMoney: 0,
                    payMoney: 0
                }
            }
        }
    },
    data() {
        return {
            isOriginalReturn: false,                            // 是否原路退
            inputNumber: '',                                    // 实退款

            inputPriceTimer: null,
            inputPriceHandler: 0,                               // 输入金额控制，小于 1 时覆盖，否则累加
            checkReturnStatus: true,                            // 结算弹窗
            ckeckReturnSuccessStatus: false,                    // 结算成功弹窗
            inputMemberKeyword: '',                             // 会员搜索输入框
            guiderSelectStatus: false,                          // 销售员弹窗状态
            memberListStatus: false,                            // 会员列表弹窗状态
            memberRechargeStatus: false,                        // 会员充值弹窗状态
            afterPriceChange: false,                            // 是否在整单改价之后
            priceChangeMenuPos: 1,
            priceChangeStatus: false,                           // 改价改折弹窗状态
            memberCardCheckStatus: false,                       // 结算前储值卡支付验证弹窗

            guiderList: [],
            checkPrint: true,                                   // 是否打印
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
            payInfo: {
                queryId: '',
                svOrderListId: null,
                receivableMoney: null,                          // 应收金额
                money: null                                     // 扫码支付金额
            },
            successInfo: {
                orderNumber: '',                    // 订单号
                payment: '',                        // 支付方式
                returnMoney: 0,                     // 退款金额
                dealMoney: 0,                       // 实退款
                memberName: '',                     // 会员名称
                availableamount: '',                // 储值卡余额
            },
            successShowTime: 3,
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'cashierJurisdiction', 'memberInfo', 'selectedInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        pageTitle() {
            return this.$app.isNull(this.orderNumber) || this.dataList.length === 0 ? '退货退款' : '换 货'
        },
        isCommon() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype != 27
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.inputNumber = Math.abs(this.importMoneyInfo.payMoney) + '';
                    this.successInfo = {
                        orderNumber: '',                    // 订单号
                        payment: '',                        // 支付
                        orderMoney: '',
                        returnMoney: 0,                     // 退款金额
                        dealMoney: 0,                       // 实退款
                        memberName: '',                     // 会员名称
                        availableamount: '',                // 储值卡余额
                    };
                    this.guiderList = [];
                    this.isSubmitting = false;
                    this.successShowTime = 3;
                    this.checkReturnStatus = true;
                    this.ckeckReturnSuccessStatus = false;
                    // this.checkInFocus();
                    if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1 && this.userInfo.sv_us_industrytype !== 1) {
                        if (this.dataList.length > 0 && this.orderList.length > 0) {
                            // 换货
                            this.showGuiderSelect();
                        }
                    }
                } else {
                    this.isOriginalReturn = false;
                    this.checkInBlur();
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
        memberRechargeStatus: {
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
        ckeckReturnSuccessStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let timer = null;
                    this.clearMember();
                    timer = setInterval(() => {
                        this.successShowTime = this.successShowTime - 1;
                        if (this.successShowTime === 0) {
                            this.closeDialog();
                            clearInterval(timer);
                            this.$root.$emit('refreshGoodsList');
                        }
                    }, 800);
                }
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
        showStoreCard() {
            this.$root.$emit('keyCode', 80);
        },
        showEquityCard() {
            this.$root.$emit('keyCode', 85);
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
        showMemberList() {                                          // 显示会员弹窗
            this.memberListStatus = true;
            this.$nextTick(() => {
                this.inputMemberKeyword = '';
            })
        },
        handleInputMoney() {
            if (this.orderNumber) return
            this.priceChangeMenuPos = 0;
            this.showPriceChange();
        },
        showPriceChange() {                                         // 显示改价改折弹窗
            if (this.isCommon && !this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限')
            if (!this.isCommon && !this.JurisdictionObj.key_change_price_catering) return this.$message.warning('没有改价权限')
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
            if (this.orderNumber && this.dataList.length === 0) return this.$message.warning('按单退货不支持改价');
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
            if (this.orderNumber) {
                return this.$message.warning(this.dataList.length === 0 ? '按单退货不支持改价' : '换货不支持改价');
            }
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
            if (this.orderNumber) {
                return this.$message.warning(this.dataList.length === 0 ? '按单退货不支持改价' : '换货不支持改价');
            }
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
        },
        submitSuccess() {                                           // 结算成功回调
            this.isSubmitting = false;
            this.checkReturnStatus = false;
            this.ckeckReturnSuccessStatus = true;
            this.successInfo = {
                payment: this.isOriginalReturn ? '原路退回' : this.$refs.payTypeList.getPayTypeInfo()[0].name,
                // orderNumber: this.successInfo.orderNumber,                                          // 订单号
                returnMoney: this.$app.moneyFixed(this.importMoneyInfo.payMoney),                   // 应付金额 or 应退金额 
                dealMoney: this.$app.moneyFixed(this.inputNumber),                                  // 实付款 or 实退款
                memberName: this.memberInfo.sv_mr_name,                                             // 会员名称
                availableamount: this.$app.moneyFixed(this.successInfo.availableamount)
            };
            let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            if (this.checkPrint) {
                this.handlePrint(1, 1, printTime);
            }
            this.$emit('handleSuccess');
        },
        handlePswInput(target) {

        },
        checkInFocus() {
            this.$nextTick(() => {
                !!this.$refs.checkReturn && this.$refs.checkReturn.focus();
            })
        },
        checkInBlur() {
            this.$nextTick(() => {
                !!this.$refs.checkReturn && this.$refs.checkReturn.blur();
            })
        },
        handleCloseScan() {
            this.isSubmitting = false;
            this.checkInFocus();
        },
        handleSubmit() {                                            // 确定结算
            // if (!this.JurisdictionObj.Cashlebtn) return this.$message.warning('没有结算权限')
            if (this.isSubmitting) return
            if (!this.isOriginalReturn) {
                if (this.$refs.payTypeList.getPayTypeInfo().length === 0) return this.$message.warning('请选择支付方式')
                if (this.$app.isNull(this.orderNumber) || this.importMoneyInfo.payMoney <= 0) {
                    if (this.$refs.payTypeList.isScanPay()) return this.$message.warning('退款操作不支持扫码支付')
                }
            }
            // if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1) {
            //     this.showGuiderSelect();
            //     return this.$message.warning('请选择导购员')
            // }
            this.$refs.returnPsw.showPswWrap();
        },
        doSubmit(val) {                                             // 执行结算
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
            let exchanges = null, buySteps = null;
            if (this.$app.isNull(this.orderNumber)) {
                // 无单退
                exchanges = this.dataList.map((e, i) => {
                    return {
                        productId: e.productId,
                        number: e.number,
                        commissions: commissions.length > 0 ? commissions : null,
                        productChangePrice: parseFloat(e.dealPrice)
                    }
                });
            } else {
                exchanges = this.orderList.map((e, i) => {
                    return {
                        orderProductId: e.id,
                        number: e.number,
                        productChangePrice: parseFloat(e.dealPrice)
                    }
                });
                if (this.dataList.length > 0) {
                    buySteps = this.dataList.map((e, i) => {
                        return {
                            index: i + 1,
                            productId: e.productId,
                            number: e.number,
                            productChangePrice: parseFloat(e.dealPrice),
                            commissions: commissions.length > 0 ? commissions : null,
                        }
                    });
                }
            }

            let query = {
                originSvOrderListId: this.orderNumber || null,
                refundDealMoney: parseFloat((this.importMoneyInfo.payMoney > 0 ? '' : '-') + this.inputNumber),
                refundPassword: val,                                    // 退货密码
                reason: this.selectedInfo.sv_remark,                    // 退货备注
                member_id: this.memberInfo.member_id,                   // 会员id
                walletId: this.memberInfo.sv_wallet_id || null,
                payment: this.isOriginalReturn ? null : this.$refs.payTypeList.getPayTypeInfo()[0].name,
                exchanges,                                              // 退货商品
                buySteps,                                               // 换货商品
                isSettle: !this.$app.isNull(this.orderNumber) ? true : false
            }
            if (!this.isOriginalReturn) {
                if (this.$refs.payTypeList.getPayTypeInfo()[0].name === '储值卡' && this.memberSelected && this.memberInfo.sv_wallet_id !== '') query.walletId = this.memberInfo.sv_wallet_id
            }
            stockApi.returnOrExchange(query).then(res => {
                if (this.memberSelected) {
                    if (this.isOriginalReturn) {
                        this.successInfo.availableamount = this.memberInfo.sv_mw_availableamount;
                    } else {
                        const member_amount = this.importMoneyInfo.payMoney > 0 && !this.$app.isNull(this.orderNumber) ? this.$app.subtractNumber(this.memberInfo.sv_mw_availableamount, parseFloat(this.inputNumber)) : this.$app.addNumber(this.memberInfo.sv_mw_availableamount, parseFloat(this.inputNumber));
                        this.successInfo.availableamount = this.$refs.payTypeList.getPayTypeInfo()[0].name !== '储值卡' ? this.memberInfo.sv_mw_availableamount : member_amount;
                    }
                }
                if (this.$app.isNull(res.queryId)) {
                    this.isSubmitting = false;
                    this.submitSuccess();
                } else {
                    if (this.isOriginalReturn) {
                        this.isSubmitting = false;
                        this.submitSuccess();
                    } else {
                        if (this.$refs.payTypeList.isScanPay()) {
                            this.payInfo = {
                                queryId: res.queryId,
                                receivableMoney: this.importMoneyInfo.payMoney,
                                money: query.refundDealMoney
                            }
                            this.checkInBlur();
                            this.$refs.payTypeList.handleScan();
                        } else {
                            this.isSubmitting = false;
                            this.submitSuccess();
                        }
                    }
                }
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },

        handlePrint(printType = 1, times = 1, printTime) {
            const preTitle = this.$app.isNull(this.orderNumber) || this.dataList.length === 0 ? '退货' : '换货';
            let tablePrintList = [];
            if (this.$app.isNull(this.orderNumber)) {
                tablePrintList = JSON.parse(JSON.stringify(this.dataList))
            } else {
                if (this.dataList.length === 0) {
                    tablePrintList = JSON.parse(JSON.stringify(this.orderList))
                } else {
                    tablePrintList = this.orderList.map(e => {
                        return {
                            ...e,
                            number: parseInt('-' + e.currentNumber)
                        }
                    }).concat(this.dataList)
                }
            }
            let totalNumber = 0;
            tablePrintList.forEach(e => {
                totalNumber = this.$app.addNumber(totalNumber, e.number);
            });
            const collectionsMoney = this.$app.isNull(this.orderNumber) ? this.inputNumber : (this.importMoneyInfo.payMoney > 0 ? '' : '-') + this.inputNumber;
            let printData = {
                /*打印类型*/
                printTtitle: preTitle + (printType === 1 ? '小票' : '预打单'),
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
                /*订单号*/
                orderNumber: this.$app.isNull(this.orderNumber) ? '' : this.orderNumber,
                // orderNumber: this.successInfo.orderNumber !== 0 ? this.successInfo.orderNumber : '',
                /*打印时间*/
                printTime: '打印时间：' + printTime,
                /*操作员*/
                controlName: '操作员：' + this.userInfo.sv_ul_name,
                /*商品表格*/
                tableList: tablePrintList,
                /*合计总数量*/
                totalNumber,
                /*合计总金额*/
                totalMoney: this.$app.moneyFixed(this.importMoneyInfo.payMoney),
                /*退款金额*/
                returnMoney: this.$app.moneyFixed(this.$app.isNull(this.orderNumber) ? this.importMoneyInfo.addGoodsMoney : this.importMoneyInfo.orderMoney),
                /*换货金额*/
                addGoodsMoney: this.$app.moneyFixed(this.importMoneyInfo.addGoodsMoney),
                /*是否有应付金额*/
                hasPayMoney: this.$app.isNull(this.orderNumber) ? false : true,
                /*实退款*/
                collectionsMoney: this.$app.moneyFixed(parseFloat(collectionsMoney)),
                /*支付方式*/
                payment: this.successInfo.payment,
                /*会员信息*/
                memberInfo: this.$app.isNull(this.memberInfo.member_id) ? {} : JSON.parse(JSON.stringify(this.memberInfo)),
                /*会员储值余额*/
                availableamount: this.$app.isNull(this.memberInfo.member_id) ? 0 : this.successInfo.availableamount,
                /*备注*/
                remark: this.selectedInfo.sv_remark
            }
            this.$print.salesReturn(printData);
        },
    }
};
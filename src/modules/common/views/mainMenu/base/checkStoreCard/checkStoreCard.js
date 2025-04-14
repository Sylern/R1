import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import memberList from '../memberList/memberList.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import priceChange from '../priceChange/priceChange.vue';
export default {
    name: 'checkStoreCard',
    components: { payTypeList, guiderSelect, memberList, memberRecharge, priceChange },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        importInfo: {
            type: Object,
            default: () => {
                return {
                    cardId: '',
                    cardName: '',
                    num: 1,
                    money: 0,
                    present: 0,
                    remark: '',
                }
            }
        },
        importMemberInfo: {
            type: Object,
            default: () => {
                return {
                    member_id: null
                }
            }
        },
    },
    data() {
        return {
            sv_card_number: '',
            inputMoney: '',                                     // 开卡本金
            inputPresent: '',                                   // 开卡赠送金额
            checkMoney: null,                                   // 应收金额
            isMultiPayType: false,
            payMoney1: '',
            payMoney2: '',
            inputPriceTimer: null,
            inputPriceHandler: 0,                               // 输入金额控制，小于 1 时覆盖，否则累加
            checkStoreCardStatus: true,                         // 结算弹窗
            ckeckReturnSuccessStatus: false,                    // 结算成功弹窗
            inputMemberKeyword: '',                             // 会员搜索输入框
            guiderSelectStatus: false,                          // 销售员弹窗状态
            memberListStatus: false,                            // 会员列表弹窗状态
            memberRechargeStatus: false,                        // 会员充值弹窗状态
            afterPriceChange: false,                            // 是否在整单改价之后
            payTypePos: 0,                                      // 支付方式选择
            priceChangeMenuPos: 0,
            priceChangeStatus: false,                           // 改价改折弹窗状态

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
            successInfo: {
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
        currentMemberInfo() {
            return this.importMemberInfo.member_id !== null ? this.importMemberInfo : this.memberInfo
        },
        memberSelected() {
            return !this.$app.isNull(this.currentMemberInfo.member_id)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.checkMoney = this.importInfo.money;
                    this.inputMoney = this.importInfo.money;
                    this.inputPresent = this.importInfo.present;
                    this.successInfo = {
                        payment: '',                        // 支付
                        checkMoney: 0,                      // 应付金额
                        dealMoney: 0,                       // 实付金额
                        memberName: '',                     // 会员名称
                        availableamount: '',                // 储值卡余额
                    };
                    this.guiderList = [];
                    this.isSubmitting = false;
                    this.successShowTime = 3;
                    this.checkStoreCardStatus = true;
                    this.ckeckReturnSuccessStatus = false;
                    this.payInfo = {
                        queryId: '',
                        svOrderListId: null,
                        businessType: 1,
                        receivableMoney: this.checkMoney,
                        money: this.checkMoney
                    };
                    this.getCardNumber();
                    this.$nextTick(() => {
                        !!this.$refs.checkStoreCard && this.$refs.checkStoreCard.focus();
                    });
                } else {
                    !!this.$refs.checkStoreCard && this.$refs.checkStoreCard.blur();
                }
            }
        },
        memberListStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkStoreCard.blur();
                } else {
                    this.$refs.checkStoreCard.focus();
                }
            }
        },
        memberRechargeStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkStoreCard.blur();
                } else {
                    this.$refs.checkStoreCard.focus();
                }
            }
        },
        priceChangeStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.checkStoreCard.blur();
                } else {
                    this.priceChangeMenuPos = 1;
                    this.$refs.checkStoreCard.focus();
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
        isMultiPayType: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.payMoney1 = this.checkMoney;
                    this.payMoney2 = 0;
                } else {

                }
            }
        }
    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleSubmit();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;                              // F5 会员刷卡
                default:
                    console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        getCardNumber(addFlag) {
            stockApi.getAutomaticallyGenerateMemberWalletCardCode({ plusOne: addFlag ? true : false }).then(res => {
                this.sv_card_number = res
            })
        },
        handleInput(value, type) {
            this[type] = this.$app.verifyNumberDecimal(value);
            if (type === 'inputMoney') {
                this.inputPresent = '';
                this.checkMoney = parseFloat(this.inputMoney || 0)
            }
        },
        handleInputMoney(value, type) {
            let currentValue = this.$app.verifyNumberDecimal(value);
            if (parseFloat(currentValue) > parseFloat(this.checkMoney)) currentValue = parseFloat(this.checkMoney);
            let nextMoney = this.$app.subtractNumber(this.checkMoney, currentValue);
            if (type === 1) {
                this.payMoney1 = currentValue;
                this.payMoney2 = nextMoney;
            } else {
                this.payMoney1 = nextMoney;
                this.payMoney2 = currentValue;
            }
        },
        checkInFocus() {
            this.$nextTick(() => {
                !!this.$refs.checkStoreCard && this.$refs.checkStoreCard.focus();
            })
        },
        checkInBlur() {
            this.$nextTick(() => {
                !!this.$refs.checkStoreCard && this.$refs.checkStoreCard.blur();
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
        showMemberList() {                                          // 显示会员弹窗
            this.memberListStatus = true;
            this.$nextTick(() => {
                this.inputMemberKeyword = '';
            })
        },
        getGuiderSelected(array) {
            this.guiderList = array;
        },
        handleRecharge() {                                          // 会员充值
            this.memberRechargeStatus = true;
        },
        handleCloseMember() {                                       // 关闭会员弹窗触发
            this.memberListStatus = false;
        },
        handleCloseScan() {
            this.checkInFocus();
        },
        successHandle() {
            this.isSubmitting = false;
            this.checkStoreCardStatus = false;
            this.ckeckReturnSuccessStatus = true;

            let sv_mrr_payment = this.$refs.payTypeListStoreCard.getPayTypeInfo()[0].name, sv_mrr_payment2 = null;
            let sv_principal = parseFloat(this.checkMoney), sv_principal2 = null;
            if (this.isMultiPayType && this.$refs.payTypeListStoreCard.getPayTypeInfo().length > 1) {
                sv_mrr_payment2 = this.$refs.payTypeListStoreCard.getPayTypeInfo()[1].name;
                sv_principal = parseFloat(this.payMoney1);
                sv_principal2 = parseFloat(this.payMoney2);
            }
            if (this.$app.isNull(sv_mrr_payment2)) {
                this.successInfo = {
                    payment: sv_mrr_payment,
                    checkMoney: this.$app.moneyFixed(this.checkMoney),                                  // 应收金额
                    memberName: this.currentMemberInfo.sv_mr_name,                                      // 会员名称
                    availableamount: this.$app.addNumber(this.currentMemberInfo.sv_mw_availableamount, this.$app.addNumber(this.importInfo.money, this.importInfo.present))
                };
            } else {
                this.successInfo = {
                    payment: sv_mrr_payment + '(' + sv_principal + ')、' + sv_mrr_payment2 + '(' + sv_principal2 + ')',
                    checkMoney: this.$app.moneyFixed(this.checkMoney),                                  // 应收金额
                    memberName: this.currentMemberInfo.sv_mr_name,                                      // 会员名称
                    availableamount: this.$app.addNumber(this.currentMemberInfo.sv_mw_availableamount, this.$app.addNumber(this.importInfo.money, this.importInfo.present))
                };
            }
            this.$nextTick(() => {
                this.$emit('handleSuccess');
            });
            if (this.checkPrint) {
                let printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.handlePrint(printTime);
            }
        },
        handleSubmit() {                                            // 确定结算
            if (this.$app.isNull(this.sv_card_number)) {
                this.$refs.cardNumber && this.$refs.cardNumber.focus();
                this.$message.warning('请输入储值卡号')
                return
            }
            if (!this.memberSelected) return this.showMemberList()
            if (!this.JurisdictionObj.Cashlebtn) return this.$message.warning('没有结算权限')
            if (this.payTypePos === -1) return this.$message({ message: '请选择支付方式', type: 'warning' });
            if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1) {
                this.showGuiderSelect();
                return this.$message.warning('请选择业绩归属人')
            }
            this.doSubmit();
        },
        handleClearMember() {
            this.clearMember();
            this.$emit('clearMember');
        },
        doSubmit() {                                                // 执行结算
            if (this.isMultiPayType && this.$refs.payTypeListStoreCard.getPayTypeInfo().length > 1) {
                if (this.$refs.payTypeListStoreCard.getPayTypeInfo().find(e => e.name === '扫码支付')) return this.$refs.payTypeListStoreCard.handleScan();
            } else {
                if (this.$refs.payTypeListStoreCard.getPayTypeInfo()[0].name === '扫码支付') return this.$refs.payTypeListStoreCard.handleScan();
            }
            this.isSubmitting = true;
            let query = this.handleSubmitQuery();
            for (const key in query) {
                if (query[key] === null) {
                    delete query[key]
                }
            }
            stockApi.openCardRechargeNewWallet(query).then(res => {
                this.isSubmitting = false;
                this.successHandle();
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },
        handleSubmitQuery() {
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
            let sv_mrr_payment = this.$refs.payTypeListStoreCard.getPayTypeInfo()[0].name, sv_mrr_payment2 = null;
            let sv_principal = parseFloat(this.checkMoney), sv_principal2 = null;
            if (this.isMultiPayType && this.$refs.payTypeListStoreCard.getPayTypeInfo().length > 1) {
                sv_mrr_payment2 = this.$refs.payTypeListStoreCard.getPayTypeInfo()[1].name;
                sv_principal = parseFloat(this.payMoney1);
                sv_principal2 = parseFloat(this.payMoney2);
            }

            return {
                source: 100,
                sv_card_number: this.sv_card_number,                                                // 储值卡号
                sv_mrr_payment,                                                                     // 支付方式1
                sv_mrr_payment2,                                                                    // 支付方式2
                sv_principal,                                                                       // 支付金额1
                sv_principal2,                                                                      // 支付金额2
                sv_user_givingtype: 2,                                                              // 赠送类型 1积分，2现金
                sv_gifts: parseFloat(this.inputPresent || 0),                                       // 赠送金额
                sv_mrr_type: 4,                                                                     // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值  
                commissionemployePercent: commissions,                                              // 提成人员
                is_version_flat: true,                                                              // 实付金额是否减去赠送金额
                sv_record_ids: [],                                                                  // 优惠券
                sv_member_id: this.currentMemberInfo.member_id,                                     // 会员id
                sv_wallet_id: '',                                                                   // 会员钱包id
                sv_wallet_card_id: this.importInfo.cardId,                                          // 储值卡id
                sv_remarks: this.importInfo.remark,                                                 // 备注
            }
        },
        submitScan(authCode) {
            this.isSubmitting = true;
            let query = this.handleSubmitQuery();
            query.authcode = authCode;
            for (const key in query) {
                if (query[key] === null) {
                    delete query[key]
                }
            }
            stockApi.appOpenCardRechargeNewWallet(query).then(res => {
                if (res) {
                    this.isSubmitting = false;
                    this.$refs.payTypeListStoreCard.getConvergePayResult(res.serialNumber);
                }
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },

        handlePrint(printTime) {
            let printDataList = [
                {
                    type: 'line',
                    text: '储值卡小票',
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: this.userInfo.sv_us_name,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '会员姓名：' + this.currentMemberInfo.sv_mr_name
                },
                {
                    type: 'line',
                    text: '会员卡号：' + this.currentMemberInfo.sv_mr_cardno
                },
                {
                    type: 'line',
                    text: '储值卡：' + this.importInfo.cardName
                },
                this.guiderList.length > 0 && {
                    type: 'line',
                    text: '销售人员：' + this.guiderList.map(e => e.name).join('、')
                },
                {
                    type: 'line',
                    text: '购买时间：' + printTime,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '储值金额：' + this.$app.moneyFixed(this.checkMoney)
                },
                parseFloat(this.inputPresent || 0) > 0 && {
                    type: 'line',
                    text: '赠送金额：' + this.$app.moneyFixed(this.inputPresent || 0)
                },
                {
                    type: 'line',
                    text: '付款金额：' + this.$app.moneyFixed(this.checkMoney)
                },
                {
                    type: 'line',
                    text: '付款方式：' + this.successInfo.payment,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '店铺电话：' + this.userInfo.sv_us_phone
                },
                {
                    type: 'line',
                    text: '店铺地址：' + this.userInfo.sv_us_address
                },
                {
                    type: 'line',
                    text: '备注：' + this.importInfo.remark,
                    spaceLine: 1
                }
            ]
            this.$print.sales(printDataList);
        },
    }
};
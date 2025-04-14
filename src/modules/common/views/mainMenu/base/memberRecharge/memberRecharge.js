import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import memberList from '../memberList/memberList.vue';
export default {
    name: 'memberRecharge',
    components: { payTypeList, memberList },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        useType: {
            type: String,
            default: 'common'
        },
        successNeedClearMember: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            isMultiPayType: false,
            payMoney1: '',
            payMoney2: '',
            discountId: '',
            selectedDiscount: {},                               // 选中的充值活动
            discountListTotal: [],                              // 充值活动列表
            discountListByMember: [],                           // 当前会员活动列表
            memberListStatus: false,                            // 会员列表弹窗
            showMain: true,                                     // 展示充值主窗口
            checkPrint: false,                                  // 打印充值小票
            payStep: 0,                                         // 扫码支付步骤
            isScanning: false,                                  // 扫码支付弹框状态
            inputRechargeMoney: '',                             // 输入的充值金额
            inputPresentMoney: '',                              // 输入的赠送金额
            rechargeMemberInfo: {
                member_id: '',
                sv_mr_headimg: '',
                sv_mr_name: '',
                sv_ml_name: '',
                sv_mr_cardno: '',
                sv_mr_mobile: '',
                memberlevel_id: '',
                sv_mw_availableamount: '',
                sv_mw_availablepoint: '',
                couponCountNumber: 0
            },
            queryRecharge: {
                source: 100,
                sv_mrr_type: 0,                                 // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值 5:退还
                sv_mrr_payment: '',                             // 支付方式
                commissionemployePercent: [],                   // 提成人员
                is_version_flat: true,                          // 实付金额是否减去赠送金额
                sv_record_ids: [],                              // 优惠券
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_wallet_card_id: '',                          // 储值卡id
                sv_principal: '',                               // 充值金额
                sv_user_givingtype: 0,                          // 赠送类型 1积分，2现金
                sv_gifts: '',                                   // 赠送金额
                sv_deposit: '',                                 // 押金
                sv_gifts_integral: '',                          // 赠送积分
                sv_detali_proportionalue: 0,                    // 配置比例值
                sv_detail_value: 0,                             // 优惠值（积分）
                sv_detail_value_integral: 0,                    // 充值活动送金额同时赠送的积分
                sv_remarks: '',
            },
            scanAuthcode: '',                                   // 付款码
            employeeList: [],                                   // 导购员列表
            payInfo: {
                queryId: '',
                money: null
            },
            customPayList: [],                                  // 自定义支付方式
            guiderList: []
        }
    },
    computed: {
        ...mapState(['JurisdictionObj', 'cashierJurisdiction', 'userInfo', 'memberInfo', 'couponCountNumber']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        imgBase() {
            return stockApi.imgBase()
        },
        storeCardList() {
            return this.$app.isNull(this.rechargeMemberInfo.member_id) ? [] : this.rechargeMemberInfo.wallets_list.map(e => {
                return {
                    ...e,
                    label: e.sv_card_name,
                    value: e.sv_wallet_id
                }
            })
        },
        hasMultiPay() {
            return !this.$app.isNull(this.queryRecharge.sv_wallet_id) && parseFloat(this.queryRecharge.sv_deposit) === 0
        },
        payMoneyCalc() {
            return this.$app.addNumber(parseFloat(this.inputRechargeMoney) || 0, parseFloat(this.queryRecharge.sv_deposit || 0))
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.initRechargeData();
                    if (!this.$app.isNull(this.memberInfo.member_id)) {
                        this.rechargeMemberInfo = {
                            member_id: this.memberInfo.member_id,
                            sv_mw_availablepoint: this.memberInfo.sv_mw_availablepoint,
                            memberlevel_id: this.memberInfo.memberlevel_id,
                            sv_mr_headimg: this.memberInfo.sv_mr_headimg,
                            sv_mr_name: this.memberInfo.sv_mr_name,
                            sv_mr_cardno: this.memberInfo.sv_mr_cardno,
                            sv_ml_name: this.memberInfo.sv_ml_name,
                            sv_mr_mobile: this.memberInfo.sv_mr_mobile,
                            sv_mw_availableamount: this.memberInfo.sv_mw_availableamount,
                            wallets_list: this.memberInfo.wallets_list,
                            couponCountNumber: this.memberInfo.couponCountNumber
                        }
                        if (this.memberInfo.wallets_list.length > 0) {
                            this.queryRecharge.sv_wallet_id = this.memberInfo.sv_wallet_id ? this.memberInfo.sv_wallet_id : this.memberInfo.wallets_list[0].sv_wallet_id;
                            if (this.memberInfo.wallets_list[0].sv_member_deposit === 0) {
                                this.queryRecharge.sv_deposit = this.memberInfo.wallets_list[0].sv_deposit;
                            }
                        }
                    }
                    this.queryRecharge.member_id = this.rechargeMemberInfo.member_id;
                    this.getDiscountList();
                    this.getEmployeePageList();
                    this.$nextTick(() => {
                        if (this.$app.isNull(this.memberInfo.member_id)) {
                            this.memberListStatus = true;
                            this.showMain = false;
                        } else {
                            this.memberListStatus = false;
                            this.showMain = true;
                            this.$refs.inputRechargeMoney && this.$refs.inputRechargeMoney.focus();
                        }
                    })
                }
            }
        },
        inputRechargeMoney: {
            handler(newVal, oldVal) {
                if (this.isMultiPayType) {
                    this.payMoney1 = this.inputRechargeMoney;
                    this.payMoney2 = 0;
                }
            }
        },
        isMultiPayType: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.payMoney1 = this.inputRechargeMoney;
                    this.payMoney2 = 0;
                } else {

                }
            }
        }
    },
    mounted() {
        this.queryRecharge.user_id = this.userInfo.user_id;
    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        ...mapActions(['requsetMemberInfo']),
        listenKeyup(e) {
            if (this.isScanning) return;
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleSubmit();
                    return;
                case 27:                                      // Esc
                    this.closeDialogRecharge();
                    return;
                default:
                    console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeMemberListBack() {                              // 联动关闭会员充值
            if (this.showMain === false) {
                this.closeDialogRecharge();
            }
        },
        handleInputMoney(value, type) {
            let currentValue = this.$app.verifyNumberDecimal(value);
            if (parseFloat(currentValue) > parseFloat(this.inputRechargeMoney)) currentValue = parseFloat(this.inputRechargeMoney);
            let nextMoney = this.$app.subtractNumber(parseFloat(this.inputRechargeMoney), currentValue);
            if (type === 1) {
                this.payMoney1 = currentValue;
                this.payMoney2 = nextMoney;
            } else {
                this.payMoney1 = nextMoney;
                this.payMoney2 = currentValue;
            }
        },
        initRechargeData() {
            this.discountId = '';
            this.employeeList = [];
            this.inputRechargeMoney = '0';
            this.inputPresentMoney = '';
            this.guiderList = [];                               // 清空选择导购员
            this.queryRecharge = {
                source: 100,
                sv_mrr_type: 0,                                 // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值 5:退还
                sv_mrr_payment: '',                             // 支付方式
                commissionemployePercent: [],                   // 提成人员
                is_version_flat: true,                          // 实付金额是否减去赠送金额
                sv_record_ids: [],                              // 优惠券
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_wallet_card_id: '',                          // 储值卡id
                sv_principal: '',                               // 充值金额
                sv_user_givingtype: 0,                          // 赠送类型 1积分，2现金
                sv_gifts: '',                                   // 赠送金额
                sv_deposit: '',                                 // 押金
                sv_gifts_integral: '',                          // 赠送积分
                sv_detali_proportionalue: 0,                    // 配置比例值
                sv_detail_value: 0,                             // 优惠值（积分）
                sv_detail_value_integral: 0,                    // 充值活动送金额同时赠送的积分
                sv_remarks: '',
            }
        },
        selectMember(data) {
            this.showMain = true;
            this.rechargeMemberInfo = {
                member_id: data.member_id,
                memberlevel_id: data.memberlevel_id,
                sv_mr_headimg: data.sv_mr_headimg,
                sv_mr_name: data.sv_mr_name,
                sv_mr_cardno: data.sv_mr_cardno,
                sv_ml_name: data.sv_ml_name,
                sv_mr_mobile: data.sv_mr_mobile,
                sv_mw_availableamount: data.sv_mw_availableamount,
                sv_mw_availablepoint: data.sv_mw_availablepoint,
                wallets_list: [],
                couponCountNumber: 0
            }
            this.queryRecharge.member_id = this.rechargeMemberInfo.member_id;
            stockApi.getMemberStoreCards({ m_id: this.queryRecharge.member_id }).then(res => {
                if (res) {
                    this.rechargeMemberInfo.wallets_list = (res.wallets_list || []);
                    if (this.rechargeMemberInfo.wallets_list.length > 0) {
                        this.queryRecharge.sv_wallet_id = this.rechargeMemberInfo.wallets_list[0].sv_wallet_id;
                        if (this.rechargeMemberInfo.wallets_list[0].sv_member_deposit === 0) {
                            this.queryRecharge.sv_deposit = this.rechargeMemberInfo.wallets_list[0].sv_deposit;
                        }
                    }
                }
            })
            this.discountListByMember = this.discountListTotal.filter(e => e.sv_user_leveltype_id === this.rechargeMemberInfo.memberlevel_id);
            this.$nextTick(() => {
                this.$refs.inputRechargeMoney.focus();
                !!this.$refs.memberRechargeScroll && this.$refs.memberRechargeScroll.update();
            })
        },
        handleInput({ target }, key) {                       // 输入控制只能输入数字和两位小数
            this[key] = this.$app.verifyNumberDecimal(target.value);
            if (key === 'inputRechargeMoney') {
                this.handleInputRechargeMoney();
            }
        },
        handleInputDeposit({ target }) {                     // 输入押金控制
            this.queryRecharge.sv_deposit = this.$app.verifyNumberDecimal(target.value);
        },
        closeDialogRecharge() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'memberRecharge');
            this.$root.$emit('restaurant', 'memberRecharge');
        },
        showMemberList() {                                   // 选择会员列表
            this.memberListStatus = true;
        },
        getDiscountList() {                                  // 获取充值活动
            stockApi.getUserConfig({ moduleCode: 'Preferential', type: 1 }).then((res) => {
                if (res && !this.$app.isNull(res)) {
                    let that = this;
                    let data = res[0].childInfolist.find(e => e.sv_user_config_name == '充值赠送');
                    let list = data.childDetailList && data.childDetailList.filter(e => e.sv_detail_is_enable);
                    this.discountListTotal = this.$app.isNull(list) ? [] : list.map(e => {
                        return {
                            ...e,
                            discountName: handleActivityTitle(e),
                        }
                    })
                    function handleActivityTitle(item) {         // 活动标题
                        const rechargeMoney = item.sv_detali_proportionalue;
                        const presentNum = item.sv_detail_value;
                        const presentTitle = item.sv_user_givingtype == 1 ? '积分' : item.sv_user_givingtype == 2 ? (item.sv_p_commissiontype == 1 ? '%' : '元') : '';
                        const presentCoupon = item.sv_record_id > 0 ? '(优惠券:' + item.sv_record_name + ')' : '';
                        const value_integral = !that.$app.isNull(item.sv_detail_value_integral) && parseInt(item.sv_detail_value_integral) > 0 ? (item.sv_detail_value_integral + '积分') : '';
                        let title = `充值${rechargeMoney}元送${presentNum}${presentTitle}${presentCoupon}${value_integral}`;
                        return title
                    };
                    if (!this.$app.isNull(this.rechargeMemberInfo.memberlevel_id)) this.discountListByMember = this.discountListTotal.filter(e => e.sv_user_leveltype_id === this.rechargeMemberInfo.memberlevel_id);
                }
            })
        },
        getEmployeePageList() {                              // 获取导购员
            stockApi.getEmployeePageListV2().then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.guiderList = res.values.map(e => {
                        return {
                            ...e,
                            value: e.sv_employee_id,
                            label: e.sv_employee_name,
                            isSelected: false
                        }
                    });
                }
            });
        },
        handleInputRechargeMoney() {
            if (this.inputRechargeMoney < this.selectedDiscount.sv_detali_proportionalue) {
                this.inputPresentMoney = 0;
            } else {
                if (this.selectedDiscount.sv_user_givingtype === 2) {
                    this.inputPresentMoney = this.selectedDiscount.sv_p_commissiontype === 1 ? parseInt(this.selectedDiscount.sv_detail_value) * this.inputRechargeMoney / 100 : parseInt(this.selectedDiscount.sv_detail_value);
                } else {
                    this.inputPresentMoney = 0;
                }
            }

            if (this.discountListByMember.length < 1) return
            // 如果已选中活动就不再自动匹配最高条件活动 否则 获取最高条件的活动
            let checkActivity
            this.discountId = null;
            // 获取最高范围活动
            let list = this.discountListByMember.filter(e => e.sv_detali_proportionalue <= this.inputRechargeMoney)
            if (list.length > 0) {
                checkActivity = list.reduce((a, b) => { return a.sv_detali_proportionalue > b.sv_detali_proportionalue ? a : b })
                this.discountId = checkActivity.sv_user_configdetail_id;

                const presentMoney = checkActivity.sv_p_commissiontype == 1 ? this.$app.multiplyNumber(this.$app.divideNumber(checkActivity.sv_detail_value, 100), this.form.sv_principal) : checkActivity.sv_detail_value;
                this.queryRecharge.sv_record_ids = checkActivity.sv_record_ids;
                this.inputPresentMoney = presentMoney;                                                          // 赠送金额
                this.queryRecharge.sv_user_givingtype = checkActivity.sv_user_givingtype;                       // 赠送类型 1积分，2现金
                this.queryRecharge.sv_gifts_integral = checkActivity.sv_user_givingtype == 1 ? checkActivity.sv_detail_value : checkActivity.sv_detail_value_integral;                // 赠送积分
                this.queryRecharge.sv_remarks = checkActivity.sv_mrr_desc;
            }
        },
        handleDiscount(item) {                               // 选中充值活动
            this.discountId = item.sv_user_configdetail_id;
            this.selectedDiscount = item;
            this.queryRecharge.sv_user_givingtype = item.sv_user_givingtype;
            this.queryRecharge.sv_remarks = item.discountName;
            this.queryRecharge.sv_record_ids = item.sv_record_ids;

            // 赠送金额计算 sv_p_commissiontype == 1 为百分比赠送
            const presentMoney = item.sv_p_commissiontype == 1 ? this.$app.multiplyNumber(this.$app.divideNumber(item.sv_detail_value, 100), this.form.sv_principal) : item.sv_detail_value;
            this.queryRecharge.sv_record_ids = item.sv_record_ids;
            this.inputRechargeMoney = item.sv_detali_proportionalue;            // 活动金额
            this.inputPresentMoney = presentMoney;                                   // 赠送金额
            this.queryRecharge.sv_user_givingtype = item.sv_user_givingtype;                     // 赠送类型 1积分，2现金
            this.queryRecharge.sv_gifts_integral = item.sv_user_givingtype == 1 ? item.sv_detail_value : item.sv_detail_value_integral;                // 赠送积分
            this.queryRecharge.sv_remarks = item.sv_mrr_desc;
        },
        handleChangeStoreCard(val) {                         // 切换储值卡
            const item = this.storeCardList.find(e => e.sv_wallet_id === val);
            if (item.sv_member_deposit === 0) {
                this.queryRecharge.sv_deposit = item.sv_deposit + '';
            }
            this.inputRechargeMoney = '';
            this.inputPresentMoney = '';
        },
        handleGuider(item) {                                 // 选择导购员
            let isInList = this.employeeList.find(e => e === item.sv_employee_id);
            if (isInList) {
                item.isSelected = false;
                this.employeeList.remove(item.sv_employee_id);
            } else {
                if (this.employeeList.length > 2) return this.$message({ type: 'warning', message: '导购员不能超过三个' });
                item.isSelected = true;
                this.employeeList.push(item.sv_employee_id);
            }
        },
        handleSubmit() {
            if (this.queryRecharge.sv_wallet_id === null) return this.$message({ type: 'warning', message: '请选择储值卡' });
            if (this.$app.isNull(this.rechargeMemberInfo.member_id)) return this.$message({ type: 'warning', message: '请选择' + this.$store.getters.memberText });
            if (this.$app.isNull(this.inputRechargeMoney) && this.$app.isNull(this.inputPresentMoney)) return this.$message({ type: 'warning', message: '请输入充值金额' });
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });
            let filter = this.$refs.payTypeListRecharge.getPayTypeInfo().filter(e => e.name === '扫码支付');
            if (filter.length > 0) {
                if (!this.userInfo.dec_payment_config.ConvergePay) return this.$message.warning('您尚未开通扫码支付，请联系客服')
            }

            if (this.$refs.payTypeListRecharge.isScanPay()) {
                this.$refs.memberRecharge.blur();
                this.$refs.payTypeListRecharge.handleScan();
            } else {
                this.recharge();
            }
        },

        handleSubmitQuery() {                           // 获取结算参数
            this.isSubmitting = true;
            if (this.$app.isNull(this.queryRecharge.member_id)) return this.$message.error('请选择' + this.$store.getters.memberText)
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });
            if (this.employeeList.length > 0) {
                // this.queryRecharge.commissionemployePercent = this.employeeList.join(',');
                this.employeeList.forEach((e, i) => {
                    const itemPercent = this.employeeList.length === 1 ? 100 : parseInt(100 / this.employeeList.length)
                    this.queryRecharge.commissionemployePercent.push({
                        employeeId: e,
                        percent: i !== this.employeeList.length - 1 ? itemPercent : (100 - itemPercent * (this.employeeList.length - 1)),
                    })
                })
            }
            if (this.cashierJurisdiction.RechargeSelectCommissionRequired && this.queryRecharge.commissionemployePercent.length < 1) {
                this.$message.warning('请选择导购员')
                return false
            }

            // 已选储值卡
            const selectStoreCard = this.storeCardList.find(e => e.value === this.queryRecharge.sv_wallet_id);
            // 已选充值活动
            let sv_mrr_payment = this.$refs.payTypeListRecharge ? this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name : '';
            let sv_mrr_payment2 = null;
            let sv_principal = this.payMoneyCalc, sv_principal2 = null;
            if (this.isMultiPayType && this.$refs.payTypeListRecharge.getPayTypeInfo().length > 1) {
                sv_mrr_payment2 = this.$refs.payTypeListRecharge.getPayTypeInfo()[1].name;
                sv_principal = parseFloat(this.payMoney1);
                sv_principal2 = parseFloat(this.payMoney2);
            }
            let query = {
                source: 100,
                sv_mrr_payment,                                                                         // 支付方式1
                sv_mrr_payment2,                                                                        // 支付方式2
                sv_principal,                                                                           // 支付金额1
                sv_principal2,                                                                          // 支付金额2
                sv_deposit: parseFloat(this.queryRecharge.sv_deposit) || 0,                             // 押金
                sv_mrr_type: this.queryRecharge.sv_mrr_type,                                            // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值 5:退还
                commissionemployePercent: this.queryRecharge.commissionemployePercent,                  // 提成人员
                is_version_flat: true,                                                                  // 实付金额是否减去赠送金额
                sv_member_id: this.queryRecharge.member_id,                                             // 会员id
                sv_wallet_id: selectStoreCard.sv_wallet_id,                                             // 会员钱包id
                sv_record_ids: this.queryRecharge.sv_record_ids,                                        // 优惠券
                sv_user_givingtype: this.queryRecharge.sv_user_givingtype,                              // 赠送类型 1积分，2现金
                sv_gifts: parseFloat(this.inputPresentMoney || 0),                                      // 赠送金额
                sv_gifts_integral: parseInt(this.queryRecharge.sv_gifts_integral || 0),                 // 赠送积分
                sv_detali_proportionalue: this.queryRecharge.sv_detali_proportionalue,                  // 配置比例值
                sv_remarks: this.queryRecharge.sv_remarks,                                              // 备注
            }
            return query
        },
        closeScanning() {                                    // 关闭扫码提示弹窗
            this.queryRecharge.authcode = '';
            this.isScanning = false;
            this.payStep = 0;
        },
        recharge() {                                         // 会员充值 记账
            let query = this.handleSubmitQuery();
            for (const key in query) {
                if (query[key] === null) {
                    delete query[key]
                }
            }
            if (!query) return
            stockApi.openCardRechargeNewWallet(query).then(res => {
                this.scanPaySuccess();
            })
        },
        appRecharge(authCode) {                              // 会员充值 聚合支付
            let query = this.handleSubmitQuery();
            for (const key in query) {
                if (query[key] === null) {
                    delete query[key]
                }
            }
            if (!query) return
            query.authcode = authCode;
            stockApi.appOpenCardRechargeNewWallet(query).then(res => {
                if (res) {
                    this.$refs.payTypeListRecharge.getConvergePayResult(res.serialNumber);
                }
            }).catch(e => {
                this.$message.error('充值失败');
            })
        },
        getAuthCode(val) {
            this.appRecharge(val)
        },
        handleCloseScan() {
            // this.$message.success('充值失败');
        },
        scanPaySuccess() {
            let sv_mw_availableamount = this.$app.addNumber(this.rechargeMemberInfo.sv_mw_availableamount, this.$app.addNumber(this.inputRechargeMoney, this.inputPresentMoney))
            if (this.checkPrint) {
                let salemanList = this.employeeList.map(e => {
                    return this.guiderList.find(k => k.value === e).label
                })
                let sv_mrr_payment = this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name, sv_mrr_payment2 = null;
                let sv_principal = parseFloat(this.inputRechargeMoney), sv_principal2 = null;
                if (this.isMultiPayType && this.$refs.payTypeListRecharge.getPayTypeInfo().length > 1) {
                    sv_mrr_payment2 = this.$refs.payTypeListRecharge.getPayTypeInfo()[1].name;
                    sv_principal = parseFloat(this.payMoney1);
                    sv_principal2 = parseFloat(this.payMoney2);
                }
                if (!this.$app.isNull(sv_mrr_payment2)) {
                    sv_mrr_payment = sv_mrr_payment + '(' + sv_principal + ')、' + sv_mrr_payment2 + '(' + sv_principal2 + ')';
                }
                let printData = {
                    sv_mrr_date: this.$app.currentTime(new Date()),                                                     // 充值时间
                    sv_mr_name: this.rechargeMemberInfo.sv_mr_name,                                                     // 会员名称
                    sv_mr_cardno: this.rechargeMemberInfo.sv_mr_cardno,                                                 // 会员卡号
                    sv_principal: this.$app.moneyFixed(this.inputRechargeMoney, 2),                                     // 充值金额
                    sv_mrr_present: this.$app.moneyFixed(this.inputPresentMoney, 2),                                    // 赠送金额
                    sv_deposit: parseFloat(this.queryRecharge.sv_deposit),                                              // 押金
                    sv_mrr_payment,                                                                                     // 支付方式
                    sv_mw_availableamount: this.$app.moneyFixed(this.rechargeMemberInfo.sv_mw_availableamount, 2),      // 充值前金额
                    sv_mrr_amountafter: this.$app.moneyFixed(sv_mw_availableamount, 2),                                 // 充值后金额
                    sv_mrr_operator: this.userInfo.sv_ul_name,                                                          // 操作员
                    salemanText: salemanList.join('/'),                                                                 // 销售人员
                    sv_remarks: this.queryRecharge.sv_remarks || ''                                                     // 备注
                }
                this.handelPrint(printData);
            }
            this.rechargeMemberInfo.sv_mw_availableamount = this.$app.moneyFixed(sv_mw_availableamount, 2);
            if (this.successNeedClearMember) {
                this.clearMember();
            } else {
                this.requsetMemberInfo(this.rechargeMemberInfo.member_id);
            }
            this.closeDialogRecharge();
            this.inputRechargeMoney = '0';
            this.inputPresentMoney = '';
            this.queryRecharge.sv_principal = '';
            this.queryRecharge.sv_mrr_present = '';
            this.queryRecharge.sv_remarks = '';
            this.queryRecharge.commissionemployePercent = [];
            this.$message.success('充值成功');
        },
        handelPrint(printData) {
            let printDataList = [
                {
                    type: 'line',
                    text: '充值小票',
                    size: 23,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: this.userInfo.sv_us_name,
                    size: 14,
                    lineHeight: 60,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: this.$store.getters.memberText + '名称：' + printData.sv_mr_name
                },
                {
                    type: 'line',
                    text: this.$store.getters.memberText + '卡号：' + printData.sv_mr_cardno
                },
                {
                    type: 'line',
                    text: '销售人员：' + (printData.salemanText || '--')
                },
                {
                    type: 'line',
                    text: '操作员：' + printData.sv_mrr_operator,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '类型：充值'
                },
                {
                    type: 'line',
                    text: '充值金额：' + printData.sv_principal
                },
                printData.sv_deposit && {
                    type: 'line',
                    text: '押金金额：' + printData.sv_deposit
                },
            ];
            if (parseFloat(printData.sv_mrr_present) > 0) {
                printDataList.push({
                    type: 'line',
                    text: '赠送金额：' + printData.sv_mrr_present
                })
            }
            let dataList2 = [
                {
                    type: 'line',
                    text: '付款方式：' + printData.sv_mrr_payment
                },
                {
                    type: 'line',
                    text: '充值前金额：' + printData.sv_mw_availableamount
                },
                {
                    type: 'line',
                    text: '充值后金额：' + printData.sv_mrr_amountafter
                },
                {
                    type: 'line',
                    text: '充值时间：' + printData.sv_mrr_date
                },
                {
                    type: 'line',
                    text: '备注：' + printData.sv_remarks
                }
            ];
            printDataList = printDataList.concat(dataList2);
            this.$print.sales(printDataList);
        }
    }
};
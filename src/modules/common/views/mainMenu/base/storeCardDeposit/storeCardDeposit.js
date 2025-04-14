import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import memberList from '../memberList/memberList.vue';
export default {
    name: 'storeCardDeposit',
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
    },
    data() {
        return {
            memberListStatus: false,                            // 会员列表弹窗
            showMain: true,                                     // 展示充值主窗口
            checkPrint: false,                                  // 打印充值小票
            payStep: 0,                                         // 扫码支付步骤
            isScanning: false,                                  // 扫码支付弹框状态
            inputPresentMoney: '',                              // 输入的赠送金额
            currentMemberInfo: {
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
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_wallet_card_id: '',                          // 储值卡id
                sv_deposit: '',                                 // 押金金额
                sv_remarks: '',
            },
            scanAuthcode: '',                                   // 付款码
            payInfo: {
                queryId: '',
                money: null
            },
            customPayList: [],                                  // 自定义支付方式
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
            return this.$app.isNull(this.currentMemberInfo.member_id) ? [] : this.currentMemberInfo.wallets_list.map(e => {
                return {
                    ...e,
                    label: e.sv_card_name,
                    value: e.sv_wallet_id
                }
            })
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.initRechargeData();
                    if (!this.$app.isNull(this.memberInfo.member_id)) {
                        this.currentMemberInfo = {
                            member_id: this.memberInfo.member_id,
                            sv_mw_availablepoint: this.memberInfo.sv_mw_availablepoint,
                            memberlevel_id: this.memberInfo.memberlevel_id,
                            sv_mr_headimg: this.memberInfo.sv_mr_headimg,
                            sv_mr_name: this.memberInfo.sv_mr_name,
                            sv_mr_cardno: this.memberInfo.sv_mr_cardno,
                            sv_ml_name: this.memberInfo.sv_ml_name,
                            sv_mr_mobile: this.memberInfo.sv_mr_mobile,
                            sv_mw_availableamount: this.memberInfo.sv_mw_availableamount,
                            wallets_list: this.memberInfo.wallets_list || [],
                            couponCountNumber: this.memberInfo.couponCountNumber
                        }
                        const currentWallet = this.currentMemberInfo.wallets_list.length > 0 ? this.currentMemberInfo.wallets_list[0] : {}
                        if (currentWallet.sv_wallet_id) {
                            this.queryRecharge.sv_wallet_id = currentWallet.sv_wallet_id;
                            this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit > 0 ? '' : currentWallet.sv_deposit
                        }
                    }
                    this.queryRecharge.member_id = this.currentMemberInfo.member_id;
                    this.$nextTick(() => {
                        if (this.$app.isNull(this.memberInfo.member_id)) {
                            this.memberListStatus = true;
                            this.showMain = false;
                        } else {
                            this.memberListStatus = false;
                            this.showMain = true;
                            this.$refs.inputDepositMoney.focus();
                        }
                    })
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
            console.log(code);
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
        initRechargeData() {
            this.queryRecharge = {
                source: 100,
                sv_mrr_type: 0,                                 // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值 5:退还
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_wallet_card_id: '',                          // 储值卡id
                sv_deposit: '',                                 // 押金金额
                sv_remarks: '',
            }
        },
        selectMember(data) {
            this.initRechargeData();
            this.showMain = true;
            this.currentMemberInfo = {
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
            this.queryRecharge.member_id = this.currentMemberInfo.member_id;
            stockApi.getMemberStoreCards({ m_id: this.queryRecharge.member_id }).then(res => {
                if (res) {
                    this.queryRecharge.sv_wallet_id = null;
                    this.currentMemberInfo = {
                        member_id: res.member_id,
                        sv_mw_availablepoint: res.sv_mw_availablepoint,
                        memberlevel_id: res.memberlevel_id,
                        sv_mr_headimg: res.sv_mr_headimg,
                        sv_mr_name: res.sv_mr_name,
                        sv_mr_cardno: res.sv_mr_cardno,
                        sv_ml_name: res.sv_ml_name,
                        sv_mr_mobile: res.sv_mr_mobile,
                        sv_mw_availableamount: res.sv_mw_availableamount,
                        wallets_list: res.wallets_list || [],
                        couponCountNumber: this.memberInfo.couponCountNumber || 0
                    }
                    const currentWallet = res.wallets_list.length > 0 ? res.wallets_list[0] : {}
                    if (currentWallet.sv_wallet_id) {
                        this.queryRecharge.sv_wallet_id = currentWallet.sv_wallet_id;
                        this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit > 0 ? '' : currentWallet.sv_deposit;
                    }
                }
            })
            this.$nextTick(() => {
                this.$refs.inputDepositMoney.focus();
                !!this.$refs.storeCardDepositScroll && this.$refs.storeCardDepositScroll.update();
            })
        },
        handleChangeWallet(target) {
            const currentWallet = this.storeCardList.find(e => e.value === target);
            if (currentWallet.sv_wallet_id) {
                this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit > 0 ? '' : currentWallet.sv_deposit;
            }
        },
        handleInputDeposit({ target }) {                     // 输入控制只能输入数字和两位小数
            target.value = this.$app.verifyNumberDecimal(target.value);
            // const selectStoreCard = this.storeCardList.find(e => e.value === this.queryRecharge.sv_wallet_id);
            // const inputMax = this.$app.subtractNumber(selectStoreCard.sv_deposit, selectStoreCard.sv_member_deposit);
            // if (parseFloat(target.value) > inputMax) {
            //     if (inputMax > 0) {
            //         this.queryRecharge.sv_deposit = inputMax > 0 ? inputMax : '';
            //         return this.$message({ type: 'warning', message: '输入押金金额超过设置，已调整为最大金额' });
            //     } else {
            //         this.queryRecharge.sv_deposit = '';
            //         return this.$message({ type: 'warning', message: '输入押金金额超过设置' });
            //     }
            // }
            this.queryRecharge.sv_deposit = target.value;
        },
        closeDialogRecharge() {
            this.dialogVisible = 'close';
        },
        showMemberList() {                                   // 选择会员列表
            this.memberListStatus = true;
        },
        handleSubmit() {
            if (this.queryRecharge.sv_wallet_id === null) return this.$message({ type: 'warning', message: '请选择储值卡' });
            if (this.$app.isNull(this.currentMemberInfo.member_id)) return this.$message({ type: 'warning', message: '请选择' + this.$store.getters.memberText });
            if (this.$app.isNull(this.queryRecharge.sv_deposit)) return this.$message({ type: 'warning', message: '请输入押金金额' });
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });
            let filter = this.$refs.payTypeListRecharge.getPayTypeInfo().filter(e => e.name === '扫码支付');
            if (filter.length > 0) {
                if (!this.userInfo.dec_payment_config.ConvergePay) return this.$message.warning('您尚未开通扫码支付，请联系客服')
            }

            if (this.$refs.payTypeListRecharge.isScanPay()) {
                this.$refs.storeCardDeposit.blur();
                this.$refs.payTypeListRecharge.handleScan();
            } else {
                this.recharge();
            }
        },

        handleSubmitQuery() {                                   // 获取结算参数
            this.isSubmitting = true;
            if (this.$app.isNull(this.queryRecharge.member_id)) return this.$message.error('请选择' + this.$store.getters.memberText)
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });

            // 已选储值卡
            const selectStoreCard = this.storeCardList.find(e => e.value === this.queryRecharge.sv_wallet_id);
            // 已选充值活动
            let sv_mrr_payment = this.$refs.payTypeListRecharge ? this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name : '';
            let sv_deposit = parseFloat(this.queryRecharge.sv_deposit);
            let query = {
                source: 100,
                is_deposit: true,
                sv_mrr_payment,                                                                         // 支付方式1
                sv_mrr_payment2: null,                                                                  // 支付方式2
                sv_deposit,                                                                             // 押金金额
                sv_principal: 0,                                                                        // 支付金额1
                sv_principal2: 0,                                                                       // 支付金额2
                sv_mrr_type: this.queryRecharge.sv_mrr_type,                                            // 0:充值 1:扣费 2:订单消费 3:订单退款 4:开卡充值 5:退还
                sv_member_id: this.queryRecharge.member_id,                                             // 会员id
                sv_wallet_id: selectStoreCard.sv_wallet_id,                                             // 会员钱包id
                sv_remarks: this.queryRecharge.sv_remarks,                                              // 备注
            }
            return query
        },
        closeScanning() {                                       // 关闭扫码提示弹窗
            this.queryRecharge.authcode = '';
            this.isScanning = false;
            this.payStep = 0;
        },
        recharge() {                                            // 会员充值 记账
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
        appRecharge(authCode) {                                 // 会员充值 聚合支付
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
            if (this.checkPrint) {
                let sv_mrr_payment = this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name;
                let printData = {
                    sv_mrr_date: this.$app.currentTime(new Date()),                                                     // 支付时间
                    sv_mr_name: this.currentMemberInfo.sv_mr_name,                                                      // 会员名称
                    sv_mr_cardno: this.currentMemberInfo.sv_mr_cardno,                                                  // 会员卡号
                    sv_deposit: this.$app.moneyFixed(this.queryRecharge.sv_deposit, 2),                                 // 押金金额
                    sv_mrr_payment,                                                                                     // 支付方式
                    sv_mrr_operator: this.userInfo.sv_ul_name,                                                          // 操作员
                    sv_remarks: this.queryRecharge.sv_remarks || ''                                                     // 备注
                }
                this.handelPrint(printData);
            }
            this.closeDialogRecharge();
            this.initRechargeData();
            // this.requsetMemberInfo(this.currentMemberInfo.member_id);
            this.clearMember();
            this.$message.success('押金支付成功');
        },
        handelPrint(printData) {
            let printDataList = [
                {
                    type: 'line',
                    text: '押金小票',
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
                    text: '操作员：' + printData.sv_mrr_operator,
                    bottomLine: true
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
                    text: '押金金额：' + printData.sv_deposit,
                    topLine: true
                },
                {
                    type: 'line',
                    text: '付款方式：' + printData.sv_mrr_payment,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '支付时间：' + printData.sv_mrr_date
                },
                {
                    type: 'line',
                    text: '备注：' + printData.sv_remarks
                }
            ];
            this.$print.sales(printDataList);
        }
    }
};
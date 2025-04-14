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
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_principal: '',                               // 储值余额
                sv_gifts: '',                                   // 赠送金额
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
        cardReturnMoney() {
            return this.$app.addNumber(this.queryRecharge.sv_principal, this.queryRecharge.sv_deposit)
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
                    // this.checkPrint = this.cashierJurisdiction.printEnable;
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
                            this.queryRecharge.sv_principal = currentWallet.sv_principal;
                            this.queryRecharge.sv_gifts = currentWallet.sv_gifts;
                            this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit;
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
                sv_member_id: '',                               // 会员id
                sv_wallet_id: null,                             // 会员钱包id
                sv_principal: '',                               // 储值余额
                sv_gifts: '',                                   // 赠送金额
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
                    const currentWallet = this.currentMemberInfo.wallets_list.length > 0 ? this.currentMemberInfo.wallets_list[0] : {}
                    if (currentWallet.sv_wallet_id) {
                        this.queryRecharge.sv_wallet_id = currentWallet.sv_wallet_id;
                        this.queryRecharge.sv_principal = currentWallet.sv_principal;
                        this.queryRecharge.sv_gifts = currentWallet.sv_gifts;
                        this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit;
                    }
                }
            })
            this.$nextTick(() => {
                !!this.$refs.storeCardDepositReturnScroll && this.$refs.storeCardDepositReturnScroll.update();
            })
        },
        handleChangeWallet(target) {
            const currentWallet = this.storeCardList.find(e => e.value === target);
            if (currentWallet.sv_wallet_id) {
                this.queryRecharge.sv_principal = currentWallet.sv_principal;
                this.queryRecharge.sv_gifts = currentWallet.sv_gifts;
                this.queryRecharge.sv_deposit = currentWallet.sv_member_deposit;
            }
        },
        closeDialogRecharge() {
            this.dialogVisible = 'close';
        },
        showMemberList() {                                      // 选择会员列表
            this.memberListStatus = true;
        },
        handleSubmit() {
            if (this.queryRecharge.sv_wallet_id === null) return this.$message({ type: 'warning', message: '请选择储值卡' });
            if (this.$app.isNull(this.currentMemberInfo.member_id)) return this.$message({ type: 'warning', message: '请选择' + this.$store.getters.memberText });
            if (this.queryRecharge.sv_principal === 0 && this.queryRecharge.sv_gifts === 0 && this.queryRecharge.sv_deposit === 0) return this.$message({ type: 'warning', message: '储值卡已清零，不需要退卡' });
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });
            let query = this.handleSubmitQuery();
            stockApi.returncard(query).then(res => {
                this.scanPaySuccess();
            })
        },
        handleSubmitQuery() {                                   // 获取结算参数
            if (this.$app.isNull(this.queryRecharge.member_id)) return this.$message.error('请选择' + this.$store.getters.memberText)
            if (this.$refs.payTypeListRecharge.getPayTypeInfo().length < 1) return this.$message({ type: 'warning', message: '请选择支付方式' });
            let sv_mrr_payment = this.$refs.payTypeListRecharge ? this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name : '';
            let query = {
                walletId: this.queryRecharge.sv_wallet_id,                                              // 会员钱包id
                payment: sv_mrr_payment,                                                                // 支付方式
                principal: parseFloat(this.queryRecharge.sv_principal),                                 // 储值余额
                gift: parseFloat(this.queryRecharge.sv_gifts),                                          // 赠金余额
                deposit: parseFloat(this.queryRecharge.sv_deposit),                                     // 押金金额
                remark: this.queryRecharge.sv_remarks,                                                  // 备注
            }
            return query
        },
        scanPaySuccess() {
            if (this.checkPrint) {
                let sv_mrr_payment = this.$refs.payTypeListRecharge.getPayTypeInfo()[0].name;
                let printData = {
                    sv_mrr_date: this.$app.currentTime(new Date()),                                                     // 充值时间
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
            this.clearMember();
            this.$message.success('退卡成功');
        },
        handelPrint(printData) {
            let printDataList = [
                {
                    type: 'line',
                    text: '支付押金小票',
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
                }
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
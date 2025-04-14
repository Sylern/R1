import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'payTypeList',
    props: {
        value: {
            type: Array,
            default: () => []
        },
        isMultiPay: {
            type: Boolean,
            default: false
        },
        isMultiPaySelected: {
            type: Boolean,
            default: false
        },
        isRecharge: {
            type: Boolean,
            default: false
        },
        notSupportScan: {
            type: Boolean,
            default: false
        },
        canMulti: {
            type: Boolean,
            default: true
        },
        preMoneyEnough: {
            type: Boolean,
            default: false
        },
        preOrderMoneyEnough: {
            type: Boolean,
            default: false
        },
        import_member_id: {
            type: String,
            default: null
        },
        showChuzhi: {
            type: Boolean,
            default: false
        },
        isOneCardModel: {
            // 会员储值卡旧版
            type: Boolean,
            default: false
        },
        payInfo: {
            type: Object,
            default: () => {
                return {
                    queryId: '',
                    businessType: 1,
                    subject: 'PC端扫码支付',
                    receivableMoney: null,
                    money: null
                }
            }
        },
        isDisabled: { type: Boolean, default: false }
    },
    data() {
        return {
            nextRequestTimer: null,                 // 下一次5秒轮询计时器
            customPayList: [],                                  // 自定义支付方式
            payTypeList: [                                      // 支付方式列表

            ],
            paySelectedList: [],                    // 已选择的支付方式
            payStep: 0,                             // 扫码支付步骤
            queryPay: {
                authCode: '',                       // 支付码，扫客户付款码
                money: '',                          // 收款金额
                subject: 'PC端扫码支付',             // 收款说明
                businessType: 1,                    // 1:WebCheckout,网页收银台;
                queryId: ''                         // 查询Id
            },
            payScanVisible: false,

            paySuccessId: 0,
            isLoop: true,                           // 轮询开关
        }
    },
    computed: {
        ...mapState(['memberInfo', 'cashierJurisdiction']),
        ...mapState('permission', ['CashierManage']),
        isInMultiPay: {
            get() { return this.isMultiPaySelected; }, set(value) {
                this.$emit('update:isMultiPaySelected', value);
            }
        },
        totalPayTypeList() {
            return this.payTypeList.concat(this.customPayList).filter(e => e.isShow)
        },
    },
    watch: {
        'memberInfo.member_id': {
            handler(newVal, oldVal) {
                // this.getPayment();
                if (this.preMoneyEnough) return
                this.payTypeList = this.payTypeList.map((e, i) => {
                    let isShow = this.isRecharge ? e.recharge_enable : e.settlement_enable;
                    if (this.isRecharge) {
                        if (e.name === '赊账' || e.name === '储值卡') isShow = false;
                        if (e.name === '储值卡' && this.showChuzhi) isShow = true;
                    } else if (this.$app.isNull(this.memberInfo.member_id)) {
                        if (e.name === '赊账') isShow = false;
                    }
                    return {
                        ...e,
                        index: i,
                        showIcon: base.frontImgBase + '/images/cashier/payImg/' + e.icon + '.png',
                        isShow: isShow
                    }
                });
                if (this.$app.isNull(newVal) || this.isRecharge) {
                    let payTypeListShow = this.payTypeList.filter(e => e.isShow);
                    // if (payTypeListShow.length > 0) this.paySelectedList.push(payTypeListShow[0]);
                    if (payTypeListShow.length > 0) this.setDefaultPayTypeSelected(payTypeListShow[0].name);
                } else {
                    this.setDefaultPayTypeSelected('储值卡');
                }
            }
        },
        'payInfo.receivableMoney': {
            handler(newVal, oldVal) {
                if (newVal == 0) {
                    this.setDefaultPayTypeSelected('现金');
                }
            }
        },
        paySelectedList: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$emit('change', newVal)
                }
            }
        },
        import_member_id: {
            handler(newVal, oldVal) {
                if (this.$app.isNull(newVal) && this.paySelectedList.findIndex(e => e.name === '储值卡') > -1) {
                    this.setDefaultPayTypeSelected('现金');
                }
            }
        },
        showChuzhi: {
            handler(newVal, oldVal) {
                this.payTypeList.find(e => e.name === '储值卡').isShow = newVal ? true : false
            }
        },
    },
    mounted() {
        this.getPayment();
        window.showBarCode = this.getAndroidScan;
    },
    beforeDestroy() {
        clearTimeout(this.nextRequestTimer);
    },
    methods: {
        ...mapMutations(['update']),
        clearPaySelectedList() {
            this.isInMultiPay = false;
            let array = [];
            if (this.paySelectedList.length > 0 && !this.preMoneyEnough) {
                array.push(this.paySelectedList[0])
            }
            this.paySelectedList = array;
            if (this.paySelectedList.findIndex(e => e.name === '储值卡') === -1 && e.name !== '储值卡' && this.memberInfo.sv_wallet_id !== '') {
                this.update({
                    key: 'memberInfo',
                    data: {
                        ...this.memberInfo,
                        sv_wallet_id: ''
                    }
                })
            }
        },
        checkChangezero() {
            let tipsArray = []
            this.paySelectedList.forEach(item => {
                if (!item.is_changezero) {
                    tipsArray.push(item.name + '不支持找零')
                }
            });
            return tipsArray.join()
        },
        getPayment() {                                              // 获取支付设置
            this.isInMultiPay = false;
            this.paySelectedList = [];
            stockApi.getPayment().then(res => {
                if (res) {
                    this.payTypeList = this.$app.isNull(res.detailItem) ? [] : res.detailItem.map((e, i) => {
                        let isShow = this.isRecharge ? e.recharge_enable : e.settlement_enable;
                        if (this.isRecharge) {
                            if (e.name === '赊账' || e.name === '储值卡') isShow = false;
                            if (e.name === '储值卡' && this.showChuzhi) isShow = true;
                        } else if (this.$app.isNull(this.memberInfo.member_id)) {
                            // if (e.name === '赊账' || e.name === '储值卡') isShow = false;
                            if (e.name === '赊账') isShow = false;
                        }
                        if (this.notSupportScan) {
                            if (e.name === '扫码支付') isShow = false;
                        }
                        return {
                            ...e,
                            index: i,
                            showIcon: base.frontImgBase + '/images/cashier/payImg/' + e.icon + '.png',
                            isShow: isShow
                        }
                    });
                    this.$emit('update:paymentList', this.payTypeList);
                    let payTypeName = '';
                    if (this.$app.isNull(this.memberInfo.member_id) || this.isRecharge) {
                        let payTypeListShow = this.payTypeList.filter(e => e.isShow);
                        if (payTypeListShow.length === 0) return;
                        payTypeName = payTypeListShow[0].name;
                    } else {
                        payTypeName = '储值卡';
                    }
                    if (this.payInfo.receivableMoney == 0) payTypeName = '现金';
                    if (!this.preMoneyEnough) {
                        this.setDefaultPayTypeSelected(payTypeName);
                    }
                    if (this.paySelectedList.findIndex(e => e.name === '储值卡') === -1 && e.name !== '储值卡' && this.memberInfo.sv_wallet_id !== '') {
                        this.update({
                            key: 'memberInfo',
                            data: {
                                ...this.memberInfo,
                                sv_wallet_id: ''
                            }
                        })
                    }

                    this.$root.$on('setStoreCard', () => {
                        const storeCardItem = this.payTypeList.find(e => e.name === '储值卡' && e.isShow);
                        this.paySelectedList.push(storeCardItem);
                        if (!this.isInMultiPay) {
                            if (this.paySelectedList.length > 1) return this.paySelectedList.shift();
                        }
                        if (this.paySelectedList.length > 2) return this.paySelectedList.shift();
                    })

                }
            });
        },
        setDefaultPayTypeSelected(payName) {                        // 设置默认支付方式
            let payTypeListShow = this.payTypeList.filter(e => e.isShow);
            if (payTypeListShow.length === 0) return;
            this.paySelectedList = [];
            if (this.$app.isNull(this.memberInfo.member_id) || this.isRecharge) return this.paySelectedList.push(payTypeListShow[0]);

            const storeCardItem = this.payTypeList.find(e => e.name === '储值卡' && e.isShow);
            if (payName === '储值卡') {
                if (!storeCardItem) {
                    if (payTypeListShow[0].name !== '储值卡') this.paySelectedList.push(payTypeListShow[0]);
                    this.$message.warning('未开启储值卡支付');
                    return
                }
                // if (this.payInfo.receivableMoney > this.memberInfo.sv_mw_availableamount) return this.paySelectedList.push(payTypeListShow[0]);
                // this.paySelectedList.push(storeCardItem);
                if (this.memberInfo.wallets_list.length > 1 && this.memberInfo.sv_wallet_id === '') {
                    this.$root.$emit('keyCode', 80);
                } else {
                    if (this.memberInfo.wallets_list.length === 0) return
                    this.paySelectedList.push(storeCardItem);
                    if (!this.isInMultiPay) {
                        if (this.paySelectedList.length > 1) return this.paySelectedList.shift();
                    }
                    if (this.paySelectedList.length > 2) return this.paySelectedList.shift();
                }
                return
            }
            const cashItem = payTypeListShow.find(e => e.name === '现金' && e.isShow);
            if (payName === '现金') {
                if (cashItem) {
                    this.paySelectedList.push(cashItem);
                } else {
                    if (payTypeListShow[0].name !== '现金') this.paySelectedList.push(payTypeListShow[0]);
                }
                return
            }
            this.paySelectedList.push(payTypeListShow[0]);
            if (this.paySelectedList.findIndex(e => e.name === '储值卡') === -1 && e.name !== '储值卡' && this.memberInfo.sv_wallet_id !== '') {
                this.update({
                    key: 'memberInfo',
                    data: {
                        ...this.memberInfo,
                        sv_wallet_id: ''
                    }
                })
            }
        },
        changePayType(item) {                                       // 修改支付方式
            if (this.isDisabled) return;                            // 禁用选择支付方式
            if (this.preMoneyEnough) return this.$message.warning('金额足够，请点击取消已选支付方式')
            if (this.paySelectedList.find(e => e.name === item.name)) {
                this.paySelectedList = this.paySelectedList.filter(e => e.name !== item.name);
                return
            }
            if (item.name === '储值卡') {
                const cashierRouter = ['/cashier/home', '/cashier/cashierRoom', '/cashier/lightMeal', '/cashier/return', '/cashier/cardRecharge', '/reservation/reservationMain'];
                if (this.$app.isNull(this.memberInfo.member_id) && cashierRouter.includes(this.$route.path)) return this.$emit('handleMemberCard')
                if (!this.isOneCardModel) {
                    if (!cashierRouter.includes(this.$route.path)) {
                        if (this.$app.isNull(this.import_member_id)) {
                            this.$emit('handleNoMember')
                        } else {
                            this.paySelectedList.push(item);
                            this.paySelectedList.shift();
                        }
                        return
                    }

                    // if (this.memberInfo.sv_mw_availableamount === 0) {
                    //     return this.$message.warning('会员储值卡余额不足');
                    // }
                    // if (this.payInfo.receivableMoney > this.memberInfo.sv_mw_availableamount && !this.isInMultiPay) return this.$message.warning('会员储值卡余额不足');
                    if (this.memberInfo.wallets_list.length === 0) return this.$message.warning('该会员没有储值卡')
                    if (this.memberInfo.wallets_list.length === 1) {
                        this.update({
                            key: 'memberInfo',
                            data: {
                                ...this.memberInfo,
                                sv_wallet_id: this.memberInfo.wallets_list[0].sv_wallet_id
                            }
                        })
                    }
                    if (this.memberInfo.wallets_list.length > 1) {
                        this.$root.$emit('keyCode', 80);
                        return
                    }
                }
            }
            this.paySelectedList.push(item);
            if (!this.isInMultiPay) {
                if (this.paySelectedList.length > 1) this.paySelectedList.shift();
            }
            if (this.paySelectedList.length > 2) this.paySelectedList.shift();
            if (this.paySelectedList.findIndex(e => e.name === '储值卡') === -1 && e.name !== '储值卡' && this.memberInfo.sv_wallet_id !== '') {
                this.update({
                    key: 'memberInfo',
                    data: {
                        ...this.memberInfo,
                        sv_wallet_id: ''
                    }
                })
            }
        },
        handleMultiPayChange() {
            if (!this.canMulti && !this.isInMultiPay) {
                this.isInMultiPay = false;
                return this.$message.warning('使用订金，无法组合支付');
            }
            // this.isInMultiPay = !this.isInMultiPay;
            this.$nextTick(() => {
                if (!this.isInMultiPay && this.paySelectedList.length > 1) this.paySelectedList.pop();
            })
        },
        handleScan(quickPay = false) {
            this.isLoop = true;
            this.payScanVisible = true;
            this.$nextTick(() => {
                if (!quickPay && this.cashierJurisdiction.CashierVoiceEnable) {
                    this.$refs['showScan'].play();
                }
                !!this.$refs['scaningCode'] && this.$refs['scaningCode'].focus();
                if (this.$app.isAndroid()) {
                    window.injectedObject.showScan()
                }
            })
            this.resetData();
        },
        getAndroidScan(val) {                       // 获取安卓摄像头返回的扫码code值
            this.queryPay.authCode = val;
            this.postConvergePay();
        },
        resetData() {
            this.paying = false;
            this.payStep = 0;
            this.queryPay = {
                authCode: '',                       // 支付码，扫客户付款码
                money: '',                          // 收款金额
                subject: 'PC端扫码支付',             // 收款说明
                businessType: 1,                    // 1:WebCheckout,网页收银台;
                queryId: ''                         // 查询Id
            }
        },
        isScanPay() {
            return this.paySelectedList.find(e => e.name === '扫码支付')
        },
        getPayTypeInfo() {
            return this.paySelectedList
        },
        getPayTypeList() {
            return this.payTypeList
        },
        getPaySuccessInfo() {
            return this.paySuccessId
        },
        btnScanClose() {                            // 关闭扫码弹框
            if (this.payStep == 1) {
                this.$confirm('关闭窗口可能会导致订单异常，确认关闭吗？').then(_ => {
                    this.handleColseScan()
                }).catch(_ => {
                    this.$refs['scaningCode'].focus();
                });
            } else {
                this.handleColseScan();
            }
        },
        handleColseScan() {
            this.isLoop = false;
            this.payScanVisible = false;
            this.resetData();
            this.$emit('closeScan');
        },
        concatAuthcode(e) {                         // 输入框键盘监听事件
            if (e.keyCode === 27) { this.handleColseScan(); return }
            if (e.keyCode === 13) {
                this.payStep = 1;
                if (!this.$app.isNull(e.authCode)) this.queryPay.authCode = e.authCode;
                if (this.$app.isNull(this.queryPay.authCode)) return this.$message.warning('请提供支付码')
                if (this.isRecharge) {
                    this.$emit('returnCode', this.queryPay.authCode);
                    return
                }
                return this.postConvergePay();
            }
        },
        postConvergePay() {                         // 聚合支付
            if (this.paying) return;
            this.paying = true;
            this.queryPay.queryId = this.payInfo.queryId;
            this.queryPay.businessType = this.payInfo.businessType || 1;
            this.queryPay.subject = this.payInfo.subject || 'PC端扫码支付';
            this.queryPay.money = this.payInfo.money;
            this.appRecharge();
        },
        appRecharge() {                             // 扫码付 聚合支付
            stockApi.convergePay(this.queryPay).then(res => {
                if (res === null) { this.isLoop = true; this.getConvergePayResult(this.queryPay.queryId); }
            }).catch(e => {
                this.payStep = 3;
                this.$message.error('支付失败');
                setTimeout(() => {
                    this.handleColseScan();
                }, 1000);
            })
        },
        getConvergePayResult(code, times = 10) {
            if (times) {
                times--;
                if (times < 0) {
                    this.$message.error('订单异常');
                    return this.handleColseScan();
                }
            }
            this.multiCoverPayResult(code, new Date().getTime());
            return
            stockApi.getConvergePayResult(code).then(res => {
                if (res && !isInNextRequest) {
                    needNextRequest = false;
                    if (res.action == -1) {
                        // 查询支付状态失败，提示错误信息
                        this.handleColseScan();
                        return this.$message.error(res.msg);
                    }
                    if (res.action == 1) {
                        // 支付状态完成
                        if (res.status == 1) {
                            this.paySuccessId = res.dataId || '';
                            this.payStep = 2;                       // 显示支付成功页面
                            // this.$refs['successTips'].play();
                            this.$root.$emit('successTips', this.queryPay.money + '')
                            this.$emit('paySuccess', this.paySuccessId);
                            setTimeout(() => {
                                this.handleColseScan();
                            }, 1000)
                            return
                        }
                        if (res.status == -1) {
                            this.payStep = 3;                       // 显示充值成功页面
                            setTimeout(() => {
                                this.$message.success('付款失败');       // 扫码失败提示
                                this.handleColseScan();
                            }, 2000)
                            return
                        }
                    }
                    // 支付状态 2-排队中  需轮询支付状态
                    if (this.isLoop) setTimeout(() => { this.getConvergePayResult(code); }, 1000);
                }
            })
        },
        // 处理长时间接口没有返回响应，5秒轮询一次
        multiCoverPayResult(code, time) {
            let needNextRequest = true;
            clearTimeout(this.nextRequestTimer);
            stockApi.getConvergePayResult(code).then(res => {
                const now = new Date().getTime();
                if (res && this.$app.subtractNumber(now, time) < 5000) {
                    needNextRequest = false;
                    if (res.action == -1) {
                        // 查询支付状态失败，提示错误信息
                        this.handleColseScan();
                        return this.$message.error(res.msg);
                    }
                    if (res.action == 1) {
                        // 支付状态完成
                        if (res.status == 1) {
                            this.paySuccessId = res.dataId || '';
                            this.payStep = 2;                       // 显示支付成功页面
                            // this.$refs['successTips'].play();
                            this.$root.$emit('successTips', this.queryPay.money + '')
                            this.$emit('paySuccess', this.paySuccessId);
                            setTimeout(() => {
                                this.handleColseScan();
                            }, 1000)
                            return
                        }
                        if (res.status == -1) {
                            this.payStep = 3;                       // 显示充值成功页面
                            setTimeout(() => {
                                this.$message.success('付款失败');       // 扫码失败提示
                                this.handleColseScan();
                            }, 2000)
                            return
                        }
                    }
                    // 支付状态 2-排队中  需轮询支付状态
                    if (this.isLoop) setTimeout(() => { this.getConvergePayResult(code); }, 1000);
                }
            })
            this.nextRuestTimer = setTimeout(() => {
                if (needNextRequest) {
                    this.multiCoverPayResult(code, new Date().getTime());
                }
            }, 5000)
        }
    }
};
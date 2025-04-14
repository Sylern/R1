//#region
    /*  聚合支付组件所需参数  业务：父组件调用聚合支付接口,本组件只做接收支付接口返回来的回调数据并做支付状态轮询
        visible                                 弹框状态
        closePay                                强行关闭弹框回调
        convergePayApi(authcode,callback)       聚合支付接口  authcode-付款码 callback-回调函数(接收父组件传过来的数据)
        payRequest(boolean)                     支付完成回调  boolean-支付结果(true-完成,false-失败)
    */
//#endregion
import { stockApi } from '@/api';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        payInfo: {
            type: Object,
            default: () => { return {} }
        }
    },
    data() {
        return {
            payStep: 0,                 // 扫码支付步骤
            scanInputErr: false,        // 扫码输入框失去焦点提示
            queryPay: {
                authCode: '',                       // 支付码，扫客户付款码
                money: '',                          // 收款金额
                subject: 'PC端扫码支付',             // 收款说明
                businessType: 1,                    // 1:WebCheckout,网页收银台;
                queryId: ''                         // 查询Id
            },
            paying: false,              // 支付状态
            isLoop: true,               // 轮询开关
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        }
    },
    watch: {
        visible: {
            handler(newVal, oldVal) {
                if (newVal){
                    this.queryPay.businessType = this.payInfo.payType;
                    this.queryPay.subject = this.payInfo.subject;
                    this.$nextTick(() => {
                        this.$refs['scaningCode'].focus();
                    })
                }
            }
        }
    },
    mounted() {
    },
    methods: {
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
            this.dialogVisible = 'close';
            this.resetData();
            this.$emit('closeScan');
        },
        handleScanClose() {
            this.dialogVisible = 'close';
        },
        concatAuthcode(e) {                         // 输入框键盘监听事件
            if (e.keyCode === 27) { this.handleColseScan(); return }
            if (e.keyCode === 13) {
                this.payStep = 1;
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
            stockApi.getConvergePayResult(code).then(res => {
                if (res) {
                    if (res.action == -1) {
                        // 查询支付状态失败，提示错误信息
                        this.handleColseScan();
                        return this.$message.error(res.msg);
                    }
                    if (res.action == 1) {
                        // 支付状态完成
                        const orderJson = this.$app.isNull(res.orderJson) ? {} : JSON.parse(res.orderJson);
                        this.paymentType = orderJson.order_payment;
                        if (res.status == 1) {
                            // this.paySuccessId = res.
                            this.payStep = 2;                       // 显示支付成功页面
                            // this.$refs['successTips'].play();
                            this.$emit('paySuccess');
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
        }
    }
}

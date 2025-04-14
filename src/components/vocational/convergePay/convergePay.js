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
        form: {
            type: Object,
            default: () => { return {} }
        }
    },
    data() {
        return {
            authcode: '',               // 付款码
            payStep: 0,                 // 扫码支付步骤
            scanInputErr: false,        // 扫码输入框失去焦点提示
            paying: false,              // 支付状态
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('updateVisible', value);
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal){
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
            setTimeout(() => {
                this.authcode = '';
                this.payStep = 0;
                this.paying = false;
            }, 1000);
        },
        handleScanClose() {                 // 关闭扫码弹框
            if (this.payStep == 1) {
                this.$confirm('关闭窗口可能会导致订单异常，确认关闭吗？').then(_ => {
                    this.$emit('closePay')
                    this.dialogVisible = 'close';
                    this.resetData()
                }).catch(_ => {
                    this.$refs['scaningCode'].focus();
                });
            } else {
                this.$emit('closePay')
                this.dialogVisible = 'close';
                this.resetData()
            }
        },
        concatAuthcode(e) {                 // 输入框键盘监听事件
            if (e.keyCode === 27) { this.closeScanning(); return }
            if (e.keyCode === 13) { this.payStep = 1, this.postConvergePay(); return }
        },
        postConvergePay() {             // 会员充值 聚合支付
            if (this.paying) return;
            this.paying = true;
            this.$emit('convergePayApi', this.authcode, res => {
                // 如果没有回调数据表示已在父组件完成支付 需初始化扫码数据 和关闭扫码弹框
                if (this.$app.isNull(res)) {
                    this.$emit('closePay')
                    this.dialogVisible = 'close';
                    this.resetData()
                    return
                };
                this.getConvergePayStatus(res)
            })
        },
        getConvergePayStatus(code) {                 // 查询聚合支付状态
            stockApi.convergePay(code).then(res => {
                if (res) {
                    if (res.action == -1) {             // 查询支付状态失败，提示错误信息
                        this.$emit('closePay')
                        this.dialogVisible = 'close';
                        return this.$message.error(res.msg);
                    }
                    if (res.action == 1) {              // 支付状态完成
                        if (res.status == 1) {
                            this.payStep = 2;                       // 显示充值成功页面
                            this.$emit('payRequest', true);         // 扫码支付结束调起父组件回调
                            this.resetData()                        // 初始化扫码数据
                            return
                        }
                        if (res.status == -1) {
                            this.payStep = 3;                       // 显示充值成功页面
                            this.$message.success('付款失败');       // 扫码失败提示
                            this.$emit('payRequest', false);        // 扫码支付结束调起父组件回调
                            this.resetData()                        // 初始化扫码数据
                            return
                        }
                    }

                    // 支付状态 2-排队中  需轮询支付状态
                    setTimeout(() => { this.getConvergePayStatus(code); }, 1000);
                }
            })
        }
    }
}

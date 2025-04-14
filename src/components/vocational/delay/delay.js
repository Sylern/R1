export default {
    name: 'delay',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        importTime: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            tabPosition: 0,
            currentTime: '',
            timeDisabled: true,
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                this.tabPosition = 0;
                this.currentTime = this.$app.isNull(this.importTime) ? new Date() : new Date(this.importTime);
            }
        },
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
        handleClose() {
            this.dialogVisible = 'close';
        },
        handleTab(tabKey) {
            this.timeDisabled = true;
            let date = this.$app.isNull(this.importTime) ? new Date() : new Date(this.importTime);
            switch (tabKey) {
                case '1':
                    this.currentTime = date.setMonth(date.getMonth() + 1);
                    return;
                case '2':
                    this.currentTime = date.setMonth(date.getMonth() + 3);
                    return;
                case '3':
                    this.currentTime = date.setMonth(date.getMonth() + 6);
                    return;
                case '4':
                    this.currentTime = date.setFullYear(date.getFullYear() + 1);
                    return;
                case '5':
                    this.currentTime = date.setFullYear(date.getFullYear() + 10);
                    return;
                case '6':
                    this.timeDisabled = false;
                    return;
                default:
                    return;
            }
        },
        handleSure() {
            this.handleClose();
            if (this.tabPosition !== 0) this.$emit('callback', this.$app.currentTime(new Date(this.currentTime), 'yyyy-MM-dd'))
        },
    }
};
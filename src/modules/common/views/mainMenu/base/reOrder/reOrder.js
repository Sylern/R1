import base from '@/api/base';
import { mapMutations, mapState } from 'vuex';
import { returnPsw } from '@/components/index';
export default {
    name: 'reOrder',
    components: { returnPsw },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        reOrderInfo: {
            type: Object,
            default: () => {
                return {
                    title: '退货',
                    money: 0
                }
            }
        },
    },
    data() {
        return {
            dataReason: '',
            dataRemark: '',
            payTypePos: -1,                                     // 支付方式pos
            psw: '',
            payTypeList: [                                      // 支付方式列表
                {
                    code: 'p_cashpay',
                    icon: base.frontImgBase + '/images/cashier/payImg/p_cashpay.png',
                    name: '现金'
                },
                {
                    code: 'p_cardpay',
                    icon: base.frontImgBase + '/images/cashier/payImg/p_cardpay.png',
                    name: '原路退'
                }
            ],
        }
    },
    computed: {
        ...mapState(['memberInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        returnMoney() {
            return this.$app.moneyFixed(this.reOrderInfo.money)
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataReason = '';
                    this.dataRemark = '';
                    this.payTypePos = -1;
                    this.showInputResult = false;
                    this.$nextTick(() => {
                        this.$refs.reOrder.focus();
                    })
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('reOrder key ' + code + ' is click');
                    return;
            }
        },
        changePayType(index) {
            this.payTypePos = index;
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        showPswWrap() {
            let remark = this.dataReason === '其他原因' ? this.dataRemark : this.dataReason;
            if (this.$app.isNull(remark)) return this.$message.warning('请选择原因');
            this.$refs.returnPsw.showPswWrap();
        },
        handlePswReturn(val) {
            let dataObj = {
                psw: val,
                remark: '反结账原因：' + (this.dataReason === '其他原因' ? this.dataRemark : this.dataReason)
            }
            this.$emit('handleBack', dataObj);
            this.closeDialog();
        }
    }
};
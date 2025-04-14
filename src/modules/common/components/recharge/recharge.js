import base from '@/api/base';
export default {
    components: {},
    name: 'recharge',
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Object, default: () => { return [] } }
    },
    data() {
        return {
            form: {
                rechargeMoney: '',          // 充值金额
                giveMoney: '',              // 赠送金额
                activity: '',               // 充值活动
                remarks: '',                // 备注信息
                salesman: '',               // 销售人员
                print: '',                  // 打印小票
                payment: '',                // 支付方式
            }
        }
    },
    watch: {
    },
    methods: {
        onSubmit() {            // 充值
            this.form = {
                rechargeMoney: '',          // 充值金额
                giveMoney: '',              // 赠送金额
                activity: '',               // 充值活动
                remarks: '',                // 备注信息
                salesman: '',               // 销售人员
                print: '',                  // 打印小票
                payment: '',                // 支付方式
            }
        }
    }
}
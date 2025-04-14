import { stockApi } from '@/api'
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            settingSwitch: false,                                  //是否开启客显
            ports: [],                                             //端口
            baudRates: [2400, 9600],                               //波特率
            query: [                                               //客显配置
                {
                    value: 'COM2',
                    enable: false,
                    code: 'Set_Hardware_CusDisplay_Port',
                    name: '客显通讯端口'
                },
                {
                    value: '',
                    enable: false,
                    code: 'Set_Hardware_CusDisplay_Baud',
                    name: '客显波特率'
                }
            ],

            testData: { price: '', pay: '', get: '', total: '' }     //测试数据
        }
    },
    mounted() {
        this.initPorts()
        stockApi.GetUserModuleList({ code: 'Set_Hardware_CusDisplay' }).then(res => {
            const { enable, list } = res
            this.query[0].value = list.find(e => e.code === 'Set_Hardware_CusDisplay_Port').value;
            this.query[1].value = list.find(e => e.code === 'Set_Hardware_CusDisplay_Baud').value;
            this.settingSwitch = enable
        })
    },
    methods: {
        ...mapMutations(['update']),
        async initPorts() {
            if (typeof Cef !== 'undefined') {
                this.ports = JSON.parse(await Cef.GetComList() || '[]')
            }
        },
        testHandle(type, data) {
            const { query: [{ value: port }, { value: baud }] } = this
            if (!port) { this.$message({ type: 'error', message: '请选择通信端口' }); return }
            if (!baud) { this.$message({ type: 'error', message: '请选择波特率' }); return }
            this.$app.showCustomerDisplay(port, baud, type, data);
            // if (typeof Cef !== 'undefined') {
            //     Cef.CustomerDisplay(port, parseInt(baud), 'One', 8, type, data)
            // }
        },

        handleSave() {
            const [{ value: port }, { value: baud }] = this.query
            if (!port) { this.$message({ type: 'error', message: '请选择通信端口' }); return }
            if (!baud) { this.$message({ type: 'error', message: '请选择波特率' }); return }
            const postData = this.query.map(e => {
                return {
                    ...e,
                    enable: this.settingSwitch
                }
            })
            stockApi.BatchUpdateUserModuleConfigdetailValue(postData).then(() => {
                const data = {
                    enable: this.settingSwitch,
                    port: this.query[0].value,
                    baud: this.query[1].value,
                }
                this.update({
                    key: 'customerDisplayData',
                    data,
                });
                this.$message({ type: 'success', message: '保存成功' })
            })
        }
    }
}
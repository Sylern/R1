import { mapState } from 'vuex';
import { stockApi } from '@/api/index';
import pluSetting from '../pluSetting/pluSetting.vue';
export default {
    name: 'hotkeySetting',
    components: { pluSetting },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataItem: {
            type: Object,
            default: () => {
                return {
                    sv_scale_id: ''
                }
            }
        }
    },
    data() {
        return {
            pluSettingStatus: false,                          // 数字弹窗状态
            keyItem: {},                                        // 选择的按键
            keySelected: [],                                    // 条码秤已配置plu
            keyNumList: [],                                     // 可以设置条码的按键
            keyboardList: {
                lineOne: [
                    {
                        keyName: '1',
                        keyValue: 1,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '2',
                        keyValue: 2,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '3',
                        keyValue: 3,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '4',
                        keyValue: 4,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '5',
                        keyValue: 5,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '6',
                        keyValue: 6,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '7',
                        keyValue: 7,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '8',
                        keyValue: 8,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '9',
                        keyValue: 9,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '10',
                        keyValue: 10,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '11',
                        keyValue: 11,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '12',
                        keyValue: 12,
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineTwo: [
                    {
                        keyName: '13',
                        keyValue: 13,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '14',
                        keyValue: 14,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '15',
                        keyValue: 15,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '16',
                        keyValue: 16,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '17',
                        keyValue: 17,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '18',
                        keyValue: 18,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '19',
                        keyValue: 19,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '20',
                        keyValue: 20,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '21',
                        keyValue: 21,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '22',
                        keyValue: 22,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '23',
                        keyValue: 23,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '24',
                        keyValue: 24,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '25',
                        keyValue: 25,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '26',
                        keyValue: 26,
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineThree: [
                    {
                        keyName: '27',
                        keyValue: 27,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '28',
                        keyValue: 28,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '29',
                        keyValue: 29,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '30',
                        keyValue: 30,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '31',
                        keyValue: 31,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '32',
                        keyValue: 32,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '33',
                        keyValue: 33,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '34',
                        keyValue: 34,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '35',
                        keyValue: 35,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '36',
                        keyValue: 36,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '37',
                        keyValue: 37,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '38',
                        keyValue: 38,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '39',
                        keyValue: 39,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '40',
                        keyValue: 40,
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineFour: [
                    {
                        keyName: '41',
                        keyValue: 41,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '42',
                        keyValue: 42,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '43',
                        keyValue: 43,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '44',
                        keyValue: 44,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '45',
                        keyValue: 45,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '46',
                        keyValue: 46,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '47',
                        keyValue: 47,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '48',
                        keyValue: 48,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+A',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '折扣',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '7',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '8',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '9',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '功能',
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineFive: [
                    {
                        keyName: '49',
                        keyValue: 49,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '50',
                        keyValue: 50,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '51',
                        keyValue: 51,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '52',
                        keyValue: 52,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '53',
                        keyValue: 53,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '54',
                        keyValue: 54,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '55',
                        keyValue: 55,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '56',
                        keyValue: 56,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+B',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '倍数',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '4',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '5',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '6',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '确认',
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineSix: [
                    {
                        keyName: '57',
                        keyValue: 57,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '58',
                        keyValue: 58,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '59',
                        keyValue: 59,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '60',
                        keyValue: 60,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '61',
                        keyValue: 61,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '62',
                        keyValue: 62,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '63',
                        keyValue: 63,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '64',
                        keyValue: 64,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+C',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '修正',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '1',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '2',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '3',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '日期',
                        handleName: '',
                        userKeycode: ''
                    }
                ],
                lineSeven: [
                    {
                        keyName: '65',
                        keyValue: 65,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '66',
                        keyValue: 66,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '67',
                        keyValue: 67,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '68',
                        keyValue: 68,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '69',
                        keyValue: 69,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '70',
                        keyValue: 70,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '71',
                        keyValue: 71,
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'plu',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+D',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '清除',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '0',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '去皮',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '置零',
                        handleName: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '打印',
                        handleName: '',
                        userKeycode: ''
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState(['isCefClient']),
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
                if (newVal) {
                    this.initKeySetting();
                    this.$nextTick(() => {
                        this.$refs.hotkeySetting.focus();
                    })
                }
            }
        },
        pluSettingStatus: {                                   // 监听改数字弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.hotkeySetting.blur();
                } else {
                    this.$refs.hotkeySetting.focus();
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        initKeySetting() {
            this.keyNumList = [];
            this.keySelected = this.dataItem.configList;
            Object.keys(this.keyboardList).forEach(key => {
                this.keyboardList[key].forEach(e => {
                    e.userKeycode = '0000';
                    this.keySelected.forEach(item => {
                        if (e.keyValue === item.sv_scale_product_key) {
                            e.userKeycode = item.sv_scale_product_plu;
                        }
                    });
                    if (e.keyValue) this.keyNumList.push(e)
                });
            });
        },
        updateKeySetting(code) {
            let boolscale = false;                        // 根据填写好的plu码和商品配置的plu是不有相同，默认没有
            this.dataItem.configList.forEach(item => {
                if (code == item.sv_scale_product_plu) {
                    item.sv_scale_product_key = this.keyItem.keyValue;
                    boolscale = true                      // 如果存在相同变为true
                }
            })
            if (!boolscale) return this.$message.error('填写的plu没有设置，请重新配置');
            this.keyNumList = [];
            Object.keys(this.keyboardList).forEach(key => {
                this.keyboardList[key].forEach(e => {
                    if (e.userKeycode === code) {
                        e.userKeycode = '0000';
                    }
                    if (e.keyValue === this.keyItem.keyValue) {
                        e.userKeycode = code
                    }
                    if (e.keyValue) this.keyNumList.push(e)
                });
            });
            this.keyItem = {};
        },
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
                    console.log('hotKeySetting key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        showNumberChange(e) {                                 // 显示PLU设置
            if (this.$app.isNull(e.keyValue)) return
            if (this.dataItem.configList.length === 0) return this.$message.error('当前还没有配置下发商品');
            this.keyItem = e;
            this.pluSettingStatus = true;
        },
        handleEnter() {                                       // 确定事件
            // this.closeDialog();
            if (!this.isCefClient) return this.$message.warning('请使用客户端连接使用');
            // 热键配置第一次下发为1-36（大华称只配置72键）
            let setArray = [
                {
                    headText: '!0L00A',
                    keyString: ''
                },
                {
                    headText: '!0L01A',
                    keyString: ''
                }
            ]
            this.keyNumList.forEach((item, index) => {
                if (index < 36) {
                    setArray[0].keyString += item.userKeycode
                } else {
                    setArray[1].keyString += item.userKeycode
                }
            });
            if (typeof Cef.dhSendFastKey !== 'undefined') {
                const loadingData = {
                    isLoding: false,
                    name: '配置下发中...',
                    fullscreen: true,
                    background: 'rgba(0, 0, 0, 0.7)'
                }
                let loading = this.$loading.service(loadingData);
                this.$nextTick(()=>{
                    setArray.forEach(async (item, index) => {
                        let msg = item.headText + item.keyString + (index === 0 ? 'B' : '0072B');
                        var c1 = await Cef.dhSendFastKey(
                            this.dataItem.sv_scale_ip,
                            msg,
                            '',
                            parseInt(this.dataItem.sv_scale_port)
                        )
                        if (!c1) return this.$message.error('热键配置失败');
                    })
                    const model = {
                        sv_scale_id: this.dataItem.sv_scale_id,                     // 秤id
                        sv_scale_name: this.dataItem.sv_scale_name,                 // 条码秤名
                        sv_scale_ip: this.dataItem.sv_scale_ip,                     // 条码秤ip
                        sv_scale_port: this.dataItem.sv_scale_port,                 // 条码秤端口
                        sv_scale_brand: this.dataItem.sv_scale_brand,               // 厂商
                        sv_scale_type: this.dataItem.sv_scale_type,                 // 设备类型
                        sv_scale_format: this.dataItem.sv_scale_format,             // 秤编码
                        sv_scale_templete: 1,                                       // 标签模板只有默认一个
                        sv_scale_remark: this.dataItem.sv_scale_remark,             // 备注信息
                        sv_scale_codeformat: this.dataItem.sv_scale_codeformat,     // 条码格式
                        configList: this.dataItem.configList
                    }
                    stockApi.addOrUpdateScale(model).then(res => {
                        this.closeDialog();
                        loading.close();
                        this.$message({
                            type: 'success',
                            message: '配置成功'
                        })
                    })
                })
            }
        },
    }
};
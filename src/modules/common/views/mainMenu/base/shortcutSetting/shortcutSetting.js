import { mapMutations, mapState } from 'vuex';
export default {
    name: 'shortcutSetting',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            keyWord: '',
            keyboardList: {
                lineOne: [
                    {
                        keyName: 'Esc',
                        handleName: '关闭弹窗',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F1',
                        handleName: '新增商品',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F2',
                        handleName: '退货',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F3',
                        handleName: '订单',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F4',
                        handleName: '整单折扣',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F5',
                        handleName: '会员刷卡',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F6',
                        handleName: '选择会员',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F7',
                        handleName: '开钱箱',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F8',
                        handleName: '优惠券',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F9',
                        handleName: '收银',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F10',
                        handleName: '单品/整单折',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F11',
                        handleName: '快捷键设置',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F12',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Del',
                        handleName: '删除',
                        defaultKeycode: '',
                        userKeycode: ''
                    }
                ],
                lineTwo: [
                    {
                        keyName: '~',
                        handleName: '侧边栏显示',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '1',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '2',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '3',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '4',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '5',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '6',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '7',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '8',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '9',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '0',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '-',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Backspace',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: '',
                        otherStyle: true
                    },
                    {
                        keyName: 'NumLock',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '/',
                        handleName: '清除价格',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '*',
                        handleName: '数量',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '-',
                        handleName: '抹零',
                        defaultKeycode: '',
                        userKeycode: ''
                    }
                ],
                lineThree: [
                    {
                        keyName: 'Tab',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Q',
                        handleName: '取单',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'W',
                        handleName: '会员充值',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'E',
                        handleName: '换货',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'R',
                        handleName: '充值',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'T',
                        handleName: '商品条码枪',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Y',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'U',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'I',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'O',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'P',
                        handleName: '储值卡',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '[',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: ']',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: '',
                        otherMargin: true
                    },
                    {
                        keyName: '7',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '8',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '9',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '+',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    }
                ],
                lineFour: [
                    {
                        keyName: 'Caps Lock',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'A',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'S',
                        handleName: '扫码付',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'D',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'F',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'G',
                        handleName: '商品改价',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'H',
                        handleName: '挂单/取单',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'J',
                        handleName: '积分抵扣',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'K',
                        handleName: '无码收银',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'L',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: ';',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '|',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Enter',
                        handleName: '确认',
                        defaultKeycode: '',
                        userKeycode: '',
                        otherMargin: true
                    },
                    {
                        keyName: '4',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '5',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '6',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    }
                ],
                lineFive: [
                    {
                        keyName: 'Shift',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Z',
                        handleName: '',
                        // handleName: '赊账',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'X',
                        handleName: '',
                        // handleName: '现金',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'C',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'V',
                        handleName: '',
                        // handleName: '银行卡',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'B',
                        handleName: '',
                        // handleName: '整单取消',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'N',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'M',
                        handleName: '',
                        // handleName: '组合支付',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: ',',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '.',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '/',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Shift',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: '',
                        otherMargin: true
                    },
                    {
                        keyName: '1',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '2',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '3',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Enter',
                        handleName: '收款/结算',
                        defaultKeycode: '',
                        userKeycode: ''
                    }
                ],
                lineSix: [
                    {
                        keyName: 'Ctrl',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Win',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Fn',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Alt',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: '',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: '',
                        isSpace: true
                    },
                    {
                        keyName: 'Alt',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        keyName: 'Ctrl',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: ''
                    },
                    {
                        inBox: true,
                        list: [
                            {
                                keyName: '↑',
                                handleName: '',
                                defaultKeycode: '',
                                userKeycode: '',
                                isTop: true
                            },
                            {
                                keyName: '←',
                                handleName: '',
                                defaultKeycode: '',
                                userKeycode: '',
                                inline: true,
                            },
                            {
                                keyName: '↓',
                                handleName: '',
                                defaultKeycode: '',
                                userKeycode: '',
                                inline: true,
                            },
                            {
                                keyName: '→',
                                handleName: '收款/结算',
                                defaultKeycode: '',
                                userKeycode: '',
                                inline: true,
                            }
                        ]
                    },
                    {
                        keyName: '0',
                        handleName: '',
                        defaultKeycode: '',
                        userKeycode: '',
                        isZero: true,
                    },
                    {
                        keyName: '.',
                        handleName: '打印小票',
                        defaultKeycode: '',
                        userKeycode: '',
                        otherMargin: true
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState(['memberList']),
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
                    this.$nextTick(()=>{
                        this.$refs.shortcutSetting.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'shortcutSetting');
            this.$root.$emit('restaurant', 'shortcutSetting');
        },
        handleEnter() {                                       // 确定事件
            this.closeDialog();
        },
    }
};
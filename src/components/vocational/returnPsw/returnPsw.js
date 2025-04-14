import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsReturn',
    props: {},
    data() {
        return {
            hasReturnPsw: true,
            pswWrap: false,
            psw: '',
        }
    },
    computed: {
        ...mapState(['memberInfo']),
    },
    watch: {
        pswWrap: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(e => {
                        !!this.hasReturnPsw && this.$refs.refPsw.focus();
                    })
                } else {
                    this.$emit('cancel')
                }
            }
        },
    },
    mounted() {
        this.pswWrap = false;
        this.getUserModuleConfigs();                // 获取退款密码设置
    },
    methods: {
        ...mapMutations(['update']),
        getUserModuleConfigs() {                                    // 获取配置
            stockApi.getUserModuleConfigs(['Refund_Password_Manage']).then(res => {
                if (res) {
                    let Refund_Password_Switch,
                        Refund_Password_Value;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'Refund_Password_Manage':
                                Refund_Password_Switch = item.childInfolist.find(e => e.sv_user_config_code === 'Refund_Password_Switch');
                                Refund_Password_Value = item.childInfolist.find(e => e.sv_user_config_code === 'Refund_Password_Value');
                                break;
                            default:
                                break;
                        }
                    });
                    /** Refund_Password_Manage 退款密码管理
                        * Refund_Password_Switch 退款密码开关
                        * Refund_Password_Value 退款密码
                    **/

                    let refundHasDetail = !this.$app.isNull(Refund_Password_Switch.childDetailList);
                    let Refund_Password_Switch_Enable = refundHasDetail ? Refund_Password_Switch.childDetailList[0].sv_detail_is_enable : true;

                    let refund_PasswordHasDetail = !this.$app.isNull(Refund_Password_Value.childDetailList);
                    let Refund_Password_Value_detail = refund_PasswordHasDetail ? Refund_Password_Value.childDetailList[0].sv_detail_value : '';
                    if (Refund_Password_Switch_Enable && !this.$app.isNull(Refund_Password_Value_detail)) {
                        this.hasReturnPsw = true;
                    } else {
                        this.hasReturnPsw = false;
                    }
                }
            })
        },
        closeDialog() {
            this.pswWrap = false;
        },
        showPswWrap() {
            this.psw = '';
            if (this.hasReturnPsw) {
                this.pswWrap = true;
            } else {
                this.$emit('submitPsw', '');
                this.closeDialog();
            }
        },
        handleEnter() {
            if (!this.hasReturnPsw) {
                this.closeDialog();
                this.$root.$emit('closeOrderWiped')
                this.$router.push({
                    path: '/cashier/setting',
                    query: {
                        settingTitle: '安全设置'
                    }
                })
                return
            }
            if (this.psw.length !== 6) return this.$message.warning('请输入6位数退款密码');
            this.$emit('submitPsw', this.$app.md5(this.psw).toUpperCase());
            this.closeDialog();
        },
    }
};
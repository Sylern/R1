import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'memberCardCheck',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        checkType: {
            type: Number,
            default: 3
        },
        memberInfo: {
            type: {},
            default: () => {
                return {}
            }
        },
        paymentAmount: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            titleList: ['请输入手机号', '请输入会员密码', '请输入验证码'],
            checkPhoneNumber: '',                       // 输入的手机号
            checkMemberPSW: '',                         // 输入的用户密码
            showNC: false,
            verifi_code_time: 61,                       // 再次发送验证码时间
            nvcVal: '',
            messageCode: ''                             // 输入的短信验证码
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        wrapTitle() {
            return this.titleList[this.checkType]
        },

    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPhoneNumber = '';
                    this.checkMemberPSW = '';
                    this.messageCode = '';
                    this.showNC = false;
                    this.$nextTick(() => {
                        this.$refs.memberCardCheck.focus();
                    })
                }
            }
        }
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
                    console.log('memberCardCheck key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'memberCardCheck');
            this.$root.$emit('restaurant', 'memberCardCheck');
        },
        handleEnter() {
            if (this.checkType === 0) {
                // 手机号验证
                if (this.$app.isNull(this.checkPhoneNumber)) return this.$message.warning('请输入手机号码')
                if (this.checkPhoneNumber !== this.memberInfo.sv_mr_mobile) return this.$message.warning('输入手机号不正确')
                this.$emit('success')
                this.closeDialog();
                return
            }
            if (this.checkType === 1) {
                // 会员密码验证
                if (this.$app.isNull(this.checkMemberPSW)) return this.$message.warning('请输入会员密码')
                if (this.$app.md5(this.checkMemberPSW) !== this.memberInfo.sv_mr_pwd && this.checkMemberPSW !== this.memberInfo.sv_mr_pwd) return this.$message.warning('会员密码错误')
                this.$emit('success')
                this.closeDialog();
                return
            }
            if (this.checkType === 2) {
                // 短信验证
                if (this.$app.isNull(this.messageCode)) return this.$message.warning('请输入验证码')
                let query = {
                    moble: this.memberInfo.sv_mr_mobile,
                    code: this.messageCode
                }
                stockApi.checkoutCode(query).then(res => {
                    if (res !== false) {
                        this.$emit('success')
                        this.closeDialog();
                    }
                });
                return
            }
        },
        getUserModuleConfigs() {                        // 获取退款密码
            let confingList = ['Refund_Password_Manage'];
            stockApi.getUserModuleConfigs(confingList).then(res => {
                if (res) {
                    let Return_Vegetables_Pwd,
                        Refund_Password_Switch,
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
                    this.configData = {
                        Return_Vegetables_Pwd,
                        Refund_Password_Switch,
                        Refund_Password_Value
                    }
                    /**
                        * Return_Vegetables_Pwd 退菜密码
                        * Refund_Password_Manage 退款密码管理
                        * Refund_Password_Switch 退款密码开关
                        * Refund_Password_Value 退款密码
                    **/
                    let return_VegetablesHasDetail = !this.$app.isNull(this.configData.Return_Vegetables_Pwd.childDetailList);
                    this.dataObj.Return_Vegetables_Pwd.enable = return_VegetablesHasDetail ? this.configData.Refund_Password_Switch.childDetailList[0].sv_detail_is_enable : true;
                    this.dataObj.Return_Vegetables_Pwd.value = return_VegetablesHasDetail ? this.configData.Refund_Password_Switch.childDetailList[0].sv_detail_value : '';

                    let refundHasDetail = !this.$app.isNull(this.configData.Refund_Password_Switch.childDetailList);
                    this.dataObj.Refund_Password_Switch.enable = refundHasDetail ? this.configData.Refund_Password_Switch.childDetailList[0].sv_detail_is_enable : true;

                    let refund_PasswordHasDetail = !this.$app.isNull(this.configData.Refund_Password_Value.childDetailList);
                    this.dataObj.Refund_Password_Value.sv_detail_value = refund_PasswordHasDetail ? this.configData.Refund_Password_Value.childDetailList[0].sv_detail_value : '';

                    this.psw = this.userInfo.sv_uit_cache_name === 'cache_name_catering' ? this.dataObj.Return_Vegetables_Pwd.value : this.dataObj.Refund_Password_Value.sv_detail_value;
                }
            })
        },
        handlerInput({ target }) {                              // 输入验证为数字
            target.value = this.$app.verifyNumber(target.value);
        },
        handleSend() {                                          // 点击发送验证码
            if (this.verifi_code_time < 61) return
            this.showNC = true;
            let that = this;
            this.$nextTick(() => { that.initNcView(); });
        },
        initNcView() {                                          // 初始化滑动验证
            let that = this;
            let nc_token = ["FFFF0N00000000009961", (new Date()).getTime(), Math.random()].join(':');
            let nc = NoCaptcha.init({
                //声明滑动验证需要渲染的目标元素ID。
                renderTo: '#nc',
                //应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
                appkey: 'FFFF0N00000000009961',
                //使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
                scene: 'shotMessage',
                //滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：”您的appkey”+”时间戳”+”随机数”。
                token: nc_token,
                //业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
                trans: { "key1": "code0" },
                //语言，默认值为cn（中文）。HTML5应用类型默认支持简体中文、繁体中文、英文语言。
                language: "cn",
                //内部网络请求的超时时间。一般情况建议保持默认值（10000ms）。
                timeout: 10000,
                //允许服务器超时重复次数，默认5次。
                retryTimes: 5,
                //验证通过后，验证码组件是否自动隐藏，默认不隐藏（false）。
                bannerHidden: false,
                //是否默认不渲染，默认值false。当设置为true时，不自动渲染，需要自行调用show方法进行渲染。
                initHidden: false,
                //前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
                callback: function (data) {
                    const nonce = that.$app.getRandomNum(6);                                         // 随机六位数
                    const timestamp = that.$app.getTimeStamp(10);                                    // 时间
                    const signature = that.$app.getSignature(that.memberInfo.sv_mr_mobile, timestamp, nonce);            // 签名
                    let query = {
                        sv_mr_cardno: that.memberInfo.sv_mr_cardno,
                        phone: that.memberInfo.sv_mr_mobile,
                        paymentAmount: parseFloat(that.paymentAmount),
                        sid: data.csessionid,
                        sig: data.sig,
                        token: nc_token,
                        scene: "nc_shotMessage",
                        usertypecode: '',
                        signature,
                        timestamp: timestamp,
                        nonce
                    }
                    stockApi.postMemberPayMsreg(query).then(res => {
                        if (res !== false) {
                            that.showNC = false;
                            that.handleCodeTime();
                            that.$message({ message: '验证码发送成功', type: 'success' });
                        }
                    });
                },
                error: function (s) { }
            });
            NoCaptcha.setEnabled(true);
            //请务必在此处调用一次reset()方法。
            nc.reset();
            //用于配置滑动验证的自定义文案。详细信息，请参见自定义文案与多语言文档。
            NoCaptcha.upLang('cn', {
                //加载状态提示。
                'LOADING': "加载中...",
                //等待滑动状态提示。
                'SLIDER_LABEL': "请向右滑动验证",
                //验证通过状态提示。
                'CHECK_Y': "验证通过",
                //验证失败触发拦截状态提示。
                'ERROR_TITLE': "非常抱歉，这出错了..."
            });
        },
        handleCodeTime() {                                      // 开始验证码倒计时
            let timeout = setInterval(() => {
                if (this.verifi_code_time < 1) {
                    this.verifi_code_time = 61;
                    clearInterval(timeout);
                } else {
                    this.verifi_code_time--;
                }
                this.$app.setLocalStorage('getVerifi_code_time', this.verifi_code_time);
            }, 1000)
        },
    }
};
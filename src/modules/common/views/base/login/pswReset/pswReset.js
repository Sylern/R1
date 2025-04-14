import base from '@/api/base';
import { basicApi } from '@/api/index';
import { setTimeout } from 'core-js';

export default {
    components: {},
    data() {
        return {
            loginPageType: '',                      // 0-app 1-供应商 
            showPsw: false,                         // 显示密码
            showPswAgain: false,                    // 显示再次确认密码
            verifi_code_time: 61,                   // 验证码时间
            agreementStatus: true,
            stepPos: 0,
            loginForm: {
                user_id: '',
                user_psw: '',
                user_psw_again: '',
                picture_code: '',
                verifi_code: '',
                sid: '',
                sig: '',
                token: '',
                scene: '',
            },
            rulesLoginForm: {
                user_id: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: ['change']
                }],
                picture_code: [{
                    required: true,
                    message: '请输入图形码',
                    trigger: ['change']
                }],
                verifi_code: [{
                    required: true,
                    message: '请输入手机验证码',
                    trigger: ['change']
                }],
            },
            rulesPasswordForm: {
                user_psw: [{
                    required: true,
                    message: '请输入密码',
                    trigger: ['change']
                }],
                user_psw_again: [{
                    required: true,
                    message: '请再次输入密码',
                    trigger: ['change']
                }]
            },
            logoUrl: '',                            // logoUrl
            timestamp: '',                          // 时间戳
            slideDialogVisible: false,              // 滑动验证对话框
        }
    },
    computed: {
        verifi_code_text() {
            return this.verifi_code_time < 61 ? this.verifi_code_time + 's' : '获取验证码'
        }
    },
    created() {
        window.localStorage.clear();
        document.cookie = '';
        this.getWebGetSiteConfig()          // 获取站点配置 判断德客  oem
    },
    mounted() {
        this.verifi_code_time = parseInt(window.localStorage.getItem('getVerifi_code_time')) || this.verifi_code_time;
        if (this.verifi_code_time < 61) {
            this.handleCodeTime()           // 开始验证码倒计时
        }
    },
    beforeDestroy() {
        window.localStorage.setItem('getVerifi_code_time', this.verifi_code_time);
    },
    methods: {
        handelGetVerifiCode() {                 // 获取手机验证码，弹出滑动验证
            if (this.verifi_code_time !== 61) return
            if (this.loginForm.user_id.length != 11 || !this.$app.isPhoneNumber(this.loginForm.user_id)) return this.$message({
                message: '请输入正确手机号',
                type: 'warning'
            });
            this.slideDialogVisible = true;
            this.$nextTick(() => {
                this.initNcView();
            })
        },
        initNcView() {                          // 初始化滑动验证
            let that = this;
            let nc_token = ["FFFF0N00000000009961", (new Date()).getTime(), Math.random()].join(':');
            let nc = NoCaptcha.init({
                //声明滑动验证需要渲染的目标元素ID。
                renderTo: '#nc',
                //应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
                appkey: 'FFFF0N00000000009961',
                //使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
                scene: 'register',
                //滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：”您的appkey”+”时间戳”+”随机数”。
                token: nc_token,
                //业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
                trans: {
                    "key1": "code0"
                },
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
                    that.loginForm.sid = data.csessionid;
                    that.loginForm.sig = data.sig;
                    that.loginForm.token = nc_token;
                    that.loginForm.scene = "nc_register";
                    const nonce = that.$app.getRandomNum(6);                                                // 随机六位数
                    const userName = that.loginForm.user_id;                                                // 获取用户名
                    const signature = that.$app.getSignature(userName, that.timestamp, nonce);              // 签名
                    let entry = {
                        userName: that.loginForm.user_id,
                        sid: data.csessionid,
                        sig: data.sig,
                        token: nc_token,
                        scene: "nc_register",
                        signature,
                        timestamp: that.timestamp,
                        nonce
                    }
                    basicApi.postWebSendReSetSms(entry).then(res => {
                        if (res !== false) {
                            that.slideDialogVisible = false;
                            if (res.succeed) {
                                that.handleCodeTime();
                                that.$message({
                                    message: '验证码发送成功',
                                    type: 'success'
                                });
                            } else {
                                that.$message.error(res.errmsg);
                            }
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
        handleLogin() {
            this.$router.push('/login');
        },
        handleNext() {
            if (this.stepPos === 0) {                           // 对比验证码是否正确
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        const password = this.$app.md5(this.loginForm.user_psw)
                        basicApi.postCheckoutCode(this.loginForm.verifi_code, this.loginForm.user_id).then(res => {
                            res !== false && this.stepPos++;
                        });
                    }
                });
            } else if (this.stepPos === 1) {                   // 重置密码
                this.$refs.passwordForm.validate((valid) => {
                    if (valid) {
                        if (this.loginForm.user_psw && this.loginForm.user_psw_again && (this.loginForm.user_psw === this.loginForm.user_psw_again)) {
                            const password = this.$app.md5(this.loginForm.user_psw)
                            basicApi.postWebResetPwd(this.loginForm.verifi_code, password, this.loginForm.user_id).then(res => {
                                res.succeed ? (this.$message({ type: 'success', message: res.values }), setTimeout(() => { this.handleLogin() }, 1000), this.stepPos++) : this.$message.error({ message: res.values });
                            });
                        } else {
                            this.$message.error({ message: '两次密码不一致' })
                        }
                    }
                });
            } else this.stepPos++;
        },
        handleCodeTime() {                      // 开始验证码倒计时
            let timeout = setInterval(() => {
                if (this.verifi_code_time < 1) {
                    this.verifi_code_time = 61;
                    clearInterval(timeout);
                } else {
                    this.verifi_code_time--;
                }
                window.localStorage.setItem('getVerifi_code_time', this.verifi_code_time);
            }, 1000)
        },
        getWebGetSiteConfig() {                 // 获取站点配置  判断德客或oem
            basicApi.GetDstributorConfig({ url: this.$app.getHost() }).then(res => {
                if (res) {
                    this.loginPageType = res.userType
                    this.timestamp = res.timestamp;
                    this.logoUrl = res.sv_dc_websitelogo ? res.sv_dc_websitelogo.replace('http://', '//') : '';
                }
                const icoUrl = this.loginPageType === 0 ? './decerp.ico' : './agent.ico';
                document.querySelector('link[rel*="icon"]').href = icoUrl;
            })
        }
    }
}

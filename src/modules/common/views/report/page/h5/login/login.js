import { basicApi } from '@/api/index';

export default {
    components: {},
    data() {
        return {
            loginPageType: '',                  // 0-app 1-供应商 
            agreementStatus: false,             // 同意用户协议
            loginForm: {
                user_id: '',
                user_psw: '',
                sid: '',
                sig: '',
                token: '',
                scene: 'nvc_login',
            },
            rulesLoginForm: {
                user_id: [{ required: true, message: '请输入您的注册手机号', trigger: ['change'] }],
                user_psw: [{ required: true, message: '请输入您的密码', trigger: ['change'] }, { min: 6, max: 15, message: '请输入6-15位密码', trigger: 'blur' }],
            },
            userTypeCode: '',                   // 用户类型
            logoUrl: '',                        // logoUrl
            timestamp: '',                      // 时间戳
            slideDialogVisible: false,          // 滑动验证对话框
            nvcVal: '',                         // 人机信息串
            loginDisabled: false,               // 防止多次提交登录
            isGetNc: false,                     // 二次验证中 初始化参数appkey，scene，test的值
        }
    },
    computed: {
    },
    created() {
        this.getWebGetSiteConfig()              // 获取站点配置 判断德客  oem
    },
    mounted() {
        localStorage.removeItem('token');
        this.nvcInit();
    },
    beforeDestroy() {
    },
    methods: {
        nvcInit() {
            let that = this;
            AWSC.use("nvc", function (state, module) {              // 实例化nvc 对无痕验证进行初始化操作
                window.nvc = module.init({                          // 初始化 调用module.init进行初始化
                    appkey: "FFFF0N00000000009961",                 // 应用类型标识。它和使用场景标识（scene字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型
                    scene: "nvc_login",                             // 使用场景标识。它和应用类型标识（appkey字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型
                    success: function (data) {                      // 二次验证获取人机信息串，跟随业务请求一起上传至业务服务器，由业务服务器进行验签。
                        data && (that.nvcVal = data, that.submitLogin());
                    },
                    fail: function (failCode) {                     // 前端二次验证失败时触发该回调参数
                        that.$message.error('验证失败，请刷新页面重试(' + failCode + ')');
                    },
                    error: function (errorCode) {                   // 前端二次验证加载异常时触发该回调参数。
                        that.$message.error(failCode);
                    }
                });
            });
        },
        resetSlide() {                          // 刷新滑动验证组件
            // !this.isGetNc ? (document.getElementById('nvc').innerHTML = '', window.nvc.getNC({ renderTo: 'nvc' })) : window.nvc.reset();    // 唤醒二次验证（滑动验证码）
            // this.isGetNc = true;
            this.slideDialogVisible = true;
            this.$nextTick(() => {
                document.getElementById('nvc').innerHTML = '';
                window.nvc.getNC({ renderTo: 'nvc' })
            })
        },
        yourLoginRequest(code) {                // 无痕验证回调函数 业务服务器请求回调控制是否需要二次验证
            if (code === 800 || code === 900) {                 // 无痕验证失败，直接拦截
                this.$message.error('验证失败');
            } else if (code === 400) {                          // 无痕验证失败，触发二次验证
                this.$message.error('请滑动验证');
            }
            this.resetSlide()
        },
        handleShowSlide() {                     // 登录按钮 获取人机信息串
            if (this.loginDisabled) return
            this.loginDisabled = true
            let that = this;
            if (window.nvc.getNVCValAsync) {
                this.$nextTick(() => {
                    window.nvc.getNVCValAsync(function (nvcVal) {
                        that.nvcVal = nvcVal;
                        that.submitLogin();
                    });
                });
            } else {
                this.$message.error('登录出错，请刷新页面重试');
                this.nvcInit();
            }
        },
        submitLogin() {                         // 登录
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    const nonce = this.$app.getRandomNum(6);                                                        // 随机六位数
                    const signature = this.$app.getSignature(this.loginForm.user_psw, this.timestamp, nonce);       // 签名
                    const userName = this.loginForm.user_id;                                                        // 获取用户名
                    if (!this.timestamp) return this.$message.error({ message: '登录出错，请稍后重试' })
                    basicApi.postWebUserLogin({ signature, timestamp: this.timestamp, nonce, userName, nvcVal: this.nvcVal, sig: this.loginForm.sig, token: this.loginForm.token, sid: this.loginForm.sid }, true).then(res => {
                        if (res) {
                            if (res.code === '0') {
                                this.$message.error(res.msg);
                                this.resetSlide();
                                return
                            } else if (res.code === '1') {
                                // 登录成功，保存账号密码到cookie
                                if (this.checkedPass) {
                                    this.$app.setCookie('user_id', userName, 7);
                                    this.$app.setCookie('user_psw', window.btoa(this.loginForm.user_psw), 7);
                                } else {
                                    this.$app.getCookie('user_id'); this.$app.deleteCookie('user_psw');
                                }
                                this.$app.setLocalStorage('user_Info', JSON.stringify(res.userinfo));                   // 用户信息
                                this.$app.setLocalStorage('token', res.values.access_token);                            // 用户token
                                this.$app.setLocalStorage('logonusers', userName * 1);                                  // 登录账号
                                this.$app.setLocalStorage('userId', res.values.user_id * 1);                            // 用户的id
                                this.$app.setLocalStorage('isstore', res.values.isStore);
                                this.$router.push('/home')
                                setTimeout(() => { this.loginDisabled = false }, 3000)
                            } else {
                                this.yourLoginRequest(res.code * 1);
                            }
                        }
                    })
                }
                else { !this.loginDisabled && this.resetSlide() }
            });
        },

        getWebGetSiteConfig() {                 // 获取站点配置  判断德客或oem
            basicApi.GetDstributorConfig({ url: this.$app.getHost() }).then(res => {
                if (res) {
                    this.loginPageType = res.userType;
                    this.timestamp = res.timestamp;
                    this.logoUrl = res.sv_dc_websitelogo ? res.sv_dc_websitelogo.replace('http://', '//') : '';
                } 
                const icoUrl = this.loginPageType === 0 ? './decerp.ico' : './agent.ico';
                document.querySelector('link[rel*="icon"]').href = icoUrl;
            })
        }
    }
}

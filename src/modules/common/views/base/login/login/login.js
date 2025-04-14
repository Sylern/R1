import customConfig from '@/utils/config/customConfig.js';
import base from '@/api/base';
import { ChatClient } from '@/utils/signalrHelper';
import { basicApi, stockApi } from '@/api/index';
import { mapMutations } from 'vuex';
import { industrySelect } from '../../components/index';

export default {
    components: { industrySelect },
    data() {
        return {
            hasMounted: false,
            showIndustrySelect: false,                  // 弹出选择行业
            loginPageType: 1,                           // 0:德客商户  1:代理商未指定  2:代理商指定
            loginQRCode: false,                         // 二维码登录
            loginForm: {                                // 登录信息表单
                user_id: '',                            // 用户账号
                user_psw: '',                           // 用户密码
                sid: '',                                // 会话ID
                sig: '',                                // 签名串
                token: '',                              // 请求唯一标识
                scene: 'nvc_login',                     // 场景标识
                dec: ''                                 // 人机验证凭证
            },
            rulesLoginForm: {                           // 表单验证规则
                user_id: [{ required: true, message: '请输入您的注册手机号', trigger: ['change'] }],
                user_psw: [{ required: true, message: '请输入6-15位密码(字母大小写加数字)', trigger: ['change'] }],
            },
            checkedPass: false,                         // 记住密码
            guId: '',                                   // 登录的guid 用于生成二维码
            slideDialogVisible: false,                  // 滑动验证对话框
            capsLock: false,                            // 大写锁定
            logoUrl: '',                                // logoUrl
            bgUrl: '',                                  // bgUrl
            adUrl: '',                                  // adUrl
            timestamp: '',                              // 时间戳
            initiativeDisconnects: false,               // 自动断开长连接
            qrcode: false,                              // 二维码是否已生成
            loginDisabled: false,                       // 登录按钮禁用状态
            timesTimer: '',                             // 获取配置定时器
            nvcVal: '',                                 // 人机信息串
            aggree: true,
            showAgree: false,
            agreeSrc: "",
            agreeTitle: "",
            showAgreeConfirm: false
        }
    },
    computed: {
        verifi_code_text() {                            // 验证码倒计时
            return this.verifi_code_time < 61 ? this.verifi_code_time + 's' : '获取验证码'
        },
        tag() {                                         // 是否是编辑返回过来的数据tag=gray
            return this.$app.isNull(this.$app.getCookie('deketag')) ? '' : this.$app.getCookie('deketag');
        },
        isNewVersion() {
            let isNew = false;
            for (let i = 0; i < customConfig.newVersionList.length; i++) {
                isNew = window.location.href.indexOf(customConfig.newVersionList[i]) > -1
                if (isNew) break
            }
            return isNew
        },
        loginLogo() {
            let value = '';
            for (const item in customConfig.loginLogo) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.loginLogo[item]
                }
            }
            return this.$app.isNull(value) ? '' : (this.$store.state.base.frontImgBase + value)
        },
        loginBg() {
            let value = '/images/base/login/background.png';
            for (const item in customConfig.loginBg) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.loginBg[item]
                }
            }
            return this.$store.state.base.frontImgBase + value
        },
        picture() {
            let value = '/images/base/login/picture.png';
            for (const item in customConfig.picture) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.picture[item]
                }
            }
            return this.$store.state.base.frontImgBase + value
        },
        loginQRcode() {
            let value = '/images/base/login/APP.png';
            for (const item in customConfig.loginQRcode) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.loginQRcode[item]
                }
            }
            return this.$app.isNull(value) ? '' : (this.$store.state.base.frontImgBase + value)
        },
        IPCText() {
            let value = '粤ICP备13009346号-2';
            for (const item in customConfig.IPC) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.IPC[item]
                }
            }
            return value
        },
        loginSuccessToCashier() {
            let value = false;
            for (const item in customConfig.loginSuccessToCashier) {
                // const url = 'https://ds.decerp.cc/'
                const url = window.location.href
                if (url.indexOf(item) > -1) {
                    value = customConfig.loginSuccessToCashier[item]
                }
            }
            return value
        },
    },
    watch: {
        checkedPass: {                                  // 监听记住密码是否发生变化
            handler(newVal, oldVal) {
                if (!newVal) this.$app.deleteCookie('user_psw'), this.$app.deleteCookie('user_id');
            }
        }
    },
    created() {
        this.$app.deleteLocalStorage('user_Info');                  // 用户信息
        this.$app.deleteLocalStorage('token');                      // 用户token
        this.$app.deleteLocalStorage('logonusers');                 // 登录账号
        this.$app.deleteLocalStorage('userId');                     // 用户的id
        this.$app.deleteLocalStorage('isstore');
        this.$app.deleteLocalStorage('menuJson');                   // 菜单数据


        // window.localStorage.clear();
        document.cookie = '';
        this.getWebGetSiteConfig()                                                      // 获取站点配置 判断德客  oem
    },
    mounted() {
        if (!this.$app.isNull(this.tag)) {
            this.$app.setLocalStorage('headers', this.tag);
            this.$app.setCookieTow('deketag', this.tag, 7);
        }
        // 查询是否cookic内存在 存在就把数据填充 并设置记住密码选中
        if (!this.$app.isNull(this.$app.getCookie('user_id')))
            this.loginForm.user_id = this.$app.getCookie('user_id');
        if (!this.$app.isNull(this.$app.getCookie('user_psw')))
            this.loginForm.user_psw = window.atob(this.$app.getCookie('user_psw'));
        if (!this.$app.isNull(this.$app.getCookie('user_psw')) && !this.$app.isNull(this.$app.getCookie('user_id')))
            this.checkedPass = true;


        this.timesTimer = setInterval(() => {           // 14分钟更新一次时间戳 有效时间是15分钟
            if (this.$app.getLocalStorage('userId')) {
                return clearInterval(this.timesTimer)
            }
            this.getWebGetSiteConfig();
        }, 1000 * 60 * 14);
    },
    beforeDestroy() {
        clearInterval(this.timesTimer)
    },
    methods: {
        ...mapMutations(['decodeJurisdiction', 'update']),
        handleSetLocal(res, token) {
            this.$app.setLocalStorage('user_Info', JSON.stringify(res));                    // 用户信息
            this.$app.setLocalStorage('token', token);                                      // 用户token
            this.$app.setLocalStorage('logonusers', this.loginForm.user_id);                // 登录账号
            // this.$app.setLocalStorage('userId', res.user_id * 1);                           // 用户的id
            // this.$app.setLocalStorage('isstore', res.isStore);
            let cacheMenuObj = this.$app.isNull(this.$app.getCookie('cacheMenuObj')) ? { list: [] } : JSON.parse(this.$app.getCookie('cacheMenuObj'));
            if (cacheMenuObj.id && cacheMenuObj.id !== res.user_id) {
                this.$app.deleteCookie('cacheMenuObj')
            }

            this.decodeJurisdiction();                                                      // 解析权限
            // this.GetNoviceGuide();                                                       // 获取引导页次数
            if (res.sv_us_industrytype > 0) return this.loginSuccessJump(res);
            this.showIndustrySelect = true;
        },
        loginSuccessJump(userInfo) {
            this.$app.setLocalStorage('user_Info', JSON.stringify(userInfo));               // 用户信息
            this.$router.push({ path: '/report/reportCensus' });
        },
        nvcInit() {
            let that = this;
            AWSC.use("nvc", (state, module) => {              // 实例化nvc 对无痕验证进行初始化操作
                window.nvc = module.init({                          // 初始化 调用module.init进行初始化
                    appkey: "FFFF0N00000000009961",                 // 应用类型标识。它和使用场景标识（scene字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型
                    scene: "nvc_login",                             // 使用场景标识。它和应用类型标识（appkey字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型
                    success: function (data) {                      // 二次验证获取人机信息串，跟随业务请求一起上传至业务服务器，由业务服务器进行验签。
                        data && (that.nvcVal = data, that.handlesubmitLogin());
                    },
                    fail: function (failCode) {                     // 前端二次验证失败时触发该回调参数
                        that.$message.error(failCode);
                    },
                    error: function (errorCode) {                   // 前端二次验证加载异常时触发该回调参数。
                        that.$message.error(failCode);
                    }
                });
                this.getNVCValAsync();
            });

        },
        resetSlide() {                          // 刷新滑动验证组件
            document.getElementById('nc').innerHTML = '';
            window.nvc.getNC({ renderTo: '#nc' });                   // 唤醒二次验证（滑动验证码）
        },
        yourLoginRequest(code) {                // 无痕验证回调函数 业务服务器请求回调控制是否需要二次验证
            if (code === 800 || code === 900) {                 // 无痕验证失败，直接拦截
                this.slideDialogVisible = true;
                this.$message.error('验证错误');
                this.resetSlide()
            } else if (code === 400) {                          // 无痕验证失败，触发二次验证
                this.slideDialogVisible = true;
                this.resetSlide();
            }
        },
        handleShowSlide() {                     // 登录按钮 获取人机信息串

            this.handlesubmitLogin();

            // let that = this;
            // if (window.nvc.getNVCValAsync) {
            //     this.$nextTick(() => {
            //         window.nvc.getNVCValAsync(function (nvcVal) {
            //             that.nvcVal = nvcVal;
            //             that.handlesubmitLogin();
            //         });
            //     });
            // } else {
            //     this.$message.error('登录出错，请刷新页面重试');
            //     this.nvcInit();
            // }
        },
        getNVCValAsync() {
            if (window.nvc.getNVCValAsync)
                this.$nextTick(() => { window.nvc.getNVCValAsync(nvcVal => { this.nvcVal = nvcVal; this.handlesubmitLogin(); }); });
        },
        handlesubmitLogin() {                   // 登录
            const { aggree } = this
            if (!aggree) {
                this.showAgreeConfirm = true
                // this.$message({ type: "error", message: `请勾选并同意《用户协议》和《隐私政策》` })
                return
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    !this.slideDialogVisible && (this.loginDisabled = true, setTimeout(() => { this.loginDisabled = false }, 3000));
                    const nonce = this.$app.getRandomNum(6);                                                        // 随机六位数
                    const signature = this.$app.getSignature(this.loginForm.user_psw, this.timestamp, nonce);       // 签名
                    const userName = this.loginForm.user_id;                                                        // 获取用户名
                    if (!this.timestamp) return this.$message.error({ message: '登录出错，请刷新后再试' })
                    let queryData = {
                        signature, nonce, userName,                 // 签名 随机数 用户名 signature签名方法：md5加密的密码、服务器时间戳、6位随机数。这三个参数排序后大写再md5加密
                        timestamp: this.timestamp,                  // 服务器时间戳
                        nvcVal: this.nvcVal,                        // 人机信息串
                        sig: this.loginForm.sig,                    // 签名串
                        dec: this.loginForm.dec,
                        token: this.loginForm.token,                // 用户token
                        sid: this.loginForm.sid,                    // 会话id
                        systemName: navigator.platform || '',       // 系统名称
                        browserName: navigator.appName || '',       // 浏览器名称
                        sv_app_version: navigator.appVersion || '', // 客户端版本
                        OperatingPlatform: 'PC'                     // 登录设备类型
                    }
                    basicApi.postWebUserLogin(queryData, true).then(res => {
                        if (!res) return;
                        switch (res.code) {
                            case '0':
                                this.$message.error(res.msg);
                                break;
                            case 400:
                                this.$message.error(res.msg);
                                if (this.$app.isNull(this.nvcVal)) this.nvcInit();
                                else this.resetSlide();
                                break;
                            case 401:
                                this.$message({
                                    message: res.msg,
                                    type: 'error',
                                    showClose: true,
                                    duration: 2000,
                                    onClose: () => {
                                        window.location.reload();
                                    }
                                });
                                break;
                            case '1':
                                this.$app.setCookie('user_psw', window.btoa(this.loginForm.user_psw), 7)
                                if (this.checkedPass) {
                                    this.$app.setCookie('user_id', userName, 7)
                                } else {
                                    this.$app.deleteCookie('user_psw');
                                }
                                this.handleSetLocal(res.userinfo, res.values.access_token);
                                break;
                            default:
                                this.yourLoginRequest(res.code * 1);
                                break;
                        }
                    })
                }
                else { !this.loginDisabled && this.resetSlide() }
            });
        },

        startConnection(_client) {              // 二维码登录 加入群组
            let guid = this.$app.getGuid();
            this.qrcode = false;
            _client.start().then(res => {
                _client.SetGroup(guid);              // 设置分组id 加入群组
                this.$app.qrcode(guid);              // 生成二维码
                this.qrcode = true;
            }).catch(error => {
            });
        },
        handleChangeLoginType() {               // 扫码登录/账密登录切换
            this.loginQRCode = !this.loginQRCode;
            if (this.loginQRCode) { this.aggree = true }

            if (!this.loginQRCode || this.$refs.qrcode.children.length > 0) { return }
            let client = new ChatClient(base.clientApi);
            // signalr成功时生成guid 并 加入群组
            this.startConnection(client);
            client.getMessage(res => {                                                      // 获取token
                const token = JSON.parse(res.content).content.token;
                if (this.$app.isNull(token)) {
                    this.$message.error({ message: '扫码登录失败，请重新扫码' })
                } else {
                    this.$app.setLocalStorage('token', token);                              // 用户token
                    basicApi.islogin(token).then(data => {
                        if (data) {
                            client.setOnClose(() => {
                                this.initiativeDisconnects = true;
                            });
                            // 移动端的user_Info跟pc不一样，要做处理
                            // this.$app.isNull(data.samodel) && !this.$app.isNull(data.sp_salesclerk_privilege) && (data.samodel = { sp_grouping_privilege: data.sp_salesclerk_privilege });

                            this.handleSetLocal(data, token)
                        }
                    })
                }
            });
            // 断开连接
            client.connection.onclose(res => {
                if (!this.initiativeDisconnects) {
                    this.startConnection(client);
                }
            });
        },
        handleCapsLock(e) {                     // 大写提示
            if (!this.$app.isNull(e.getModifierState))
                this.capsLock = e.getModifierState('CapsLock'),
                    window.addEventListener('keyup', () => { this.capsLock = e.getModifierState('CapsLock') });
        },
        handlePswReset() {                      // 跳转到找回密码
            this.$router.push('/pswReset');
        },
        handleRegister() {                      // 跳转到注册页面
            this.$router.push('/register');
        },

        handleToPasswrod(e) {                    // 按tab/enter键 切换到密码输入框
            (e.keyCode === 13 || e.keyCode === 9) && this.$refs.password.focus();
        },
        getWebGetSiteConfig() {                 // 获取站点配置  判断德客或oem
            basicApi.GetDstributorConfig({ url: this.$app.getHost() }).then(res => {
                this.hasMounted = true;
                if (res) {
                    this.loginPageType = res.userType;
                    this.timestamp = res.timestamp;

                    this.logoUrl = res.sv_dc_websitelogo ? res.sv_dc_websitelogo.replace('http://', '//') : this.loginLogo;
                    this.bgUrl = res.sv_background_image ? res.sv_background_image.replace('http://', '//') : this.loginBg;

                    this.adUrl = res.sv_advertising_image ? res.sv_advertising_image.replace('http://', '//') : '';
                    this.loginForm.dec = res.dec;
                    const icoUrl = res.distributor_id === 1 ? './decerp.ico' : './agent.ico';
                    this.$app.setLocalStorage('distributor_id', res.distributor_id);
                    document.querySelector('link[rel*="icon"]').href = icoUrl;
                }
            })
        },
        GetNoviceGuide() {                      // 获取当前账号的引导页次数
            stockApi.GetNoviceGuide().then(res => {
                let obj = { id: this.$app.isNull(res.id) ? -1 : res.id, count: this.$app.isNull(res.sv_novice_count) ? 0 : res.sv_novice_count }
                this.$store.commit('updateMaskEntity', obj);
            });
        },
        xieyiClickHandle(type) {
            this.agreeTitle = type === 'xieyi' ? '用户协议' : '隐私政策'
            this.agreeSrc = type === 'xieyi' ? '//ros.decerp.cc/app/contracts/service.html' : '//ros.decerp.cc/app/contracts/privacy_pc.html'
            this.showAgree = true
        },
        agreeHandle() {
            this.showAgree = false
            this.aggree = true
        },
        unAgreeHandle() {
            this.showAgree = false
            this.aggree = false
        }
    }
}

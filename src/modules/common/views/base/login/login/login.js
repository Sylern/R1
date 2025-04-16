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
            agreeSrc: "",
            agreeTitle: "",
        }
    },
    computed: {
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
    },
    mounted() {
        // 查询是否cookic内存在 存在就把数据填充 并设置记住密码选中
        if (!this.$app.isNull(this.$app.getCookie('user_id')))
            this.loginForm.user_id = this.$app.getCookie('user_id');
        if (!this.$app.isNull(this.$app.getCookie('user_psw')))
            this.loginForm.user_psw = window.atob(this.$app.getCookie('user_psw'));
        if (!this.$app.isNull(this.$app.getCookie('user_psw')) && !this.$app.isNull(this.$app.getCookie('user_id')))
            this.checkedPass = true;
    },
    methods: {
        ...mapMutations(['decodeJurisdiction', 'update']),
        handleSetLocal(res, token) {
            this.$app.setLocalStorage('user_Info', JSON.stringify(res));                    // 用户信息
            this.$app.setLocalStorage('token', token);                                      // 用户token
            this.$app.setLocalStorage('logonusers', this.loginForm.user_id);                // 登录账号
            // this.decodeJurisdiction();                                                      // 解析权限
            this.$app.setLocalStorage('user_Info', {});               // 用户信息
            this.$router.push({ path: '/home' });
        },
        handlesubmitLogin() {                   // 登录
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$app.setCookie('user_psw', window.btoa(this.loginForm.user_psw), 7)
                    if (this.checkedPass) {
                        this.$app.setCookie('user_id', userName, 7)
                    } else {
                        this.$app.deleteCookie('user_psw');
                    }
                    this.handleSetLocal({}, {});
                    return
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

        handleCapsLock(e) {                     // 大写提示
            if (!this.$app.isNull(e.getModifierState)) {
                this.capsLock = e.getModifierState('CapsLock');
                window.addEventListener('keyup', () => { this.capsLock = e.getModifierState('CapsLock') });
            }
        },
        handleToPasswrod(e) {                    // 按tab/enter键 切换到密码输入框
            (e.keyCode === 13 || e.keyCode === 9) && this.$refs.password.focus();
        },
    }
}

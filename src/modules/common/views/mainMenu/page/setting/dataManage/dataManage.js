import { stockApi, } from "@/api/index.js";
import { noProgress } from '@/components/index';
export default {
    components: { noProgress },
    data() {
        return {
            jsonData: [],                           // 初始化数据
            activeJson: [],                         // 选中的初始数据
            isVisible: false,                       // 显示获取验证码
            entityObj: {                            // 提交实体
                sv_ul_mobile: '',                       // 手机号码
                code: '',                               // 验证码
            },

            verifi_code_time: 61,               // 再次发送验证码时间
            isVerifice: false,                  // 显示滑块
            processName: '',                    // 进度条名称
            isShowProcess: false,               // 显示进度条
        }
    },
    computed: {
        mobile() {
            return this.$app.isNull(this.entityObj.sv_ul_mobile) ? '' : this.$app.phoneNumberHiding(this.entityObj.sv_ul_mobile);
        },
        verifi_code_text() {
            return this.verifi_code_time < 61 ? this.verifi_code_time + 's' : '获取验证码'
        },
    },
    mounted() {
        this.GetInitialDataListl();
        this.defaultTime();
        
    },
    methods: {
        //#region 事件

        handleSubmit() {
            if (this.$app.isNull(this.activeJson)) return;
            this.$confirm('初始化店铺数据将无法恢复，确认初始化?', '信息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.entityObj = { code: '', sv_ul_mobile: this.$store.state.userInfo.sv_ul_mobile };
                this.isVisible = true;
            }).catch(() => { });
        },
        handleSend() {                                          // 点击发送验证码
            this.isVerifice = true;
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
                scene: 'register',
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
                    const nonce = that.$app.getRandomNum(6);                                                // 随机六位数
                    const userName = that.entityObj.sv_ul_mobile;                                           // 原手机
                    const timestamp = that.$app.getTimeStamp(10);     // 时间
                    const signature = that.$app.getSignature(userName, timestamp, nonce);              // 签名
                    let entry = { userName, sid: data.csessionid, sig: data.sig, token: nc_token, scene: "nc_register", signature, timestamp: timestamp, nonce }
                    stockApi.PostMsreg2(entry).then(res => {
                        if (res === null) {
                            that.isVerifice = false;
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
        verifyNumber(type) {                                    // 只能输入数字
            if (type === 'code') this.entityObj.code = this.$app.verifyNumber(this.entityObj.code);
        },
        handleEntity() {                                        // 手机发送验证码确定
            if (this.$app.isNull(this.entityObj.code)) return this.$message({ message: '请输入验证码', type: 'warning' });

            this.$confirm('初始化店铺数据将无法恢复，确认初始化?', '信息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.isVisible=false;
                this.isShowProcess = true;
                this.getTime();
                let obj={
                    sv_ul_mobile:this.entityObj.sv_ul_mobile,
                    code:this.entityObj.code,
                    list_id:this.activeJson,
                    user_id:this.$store.state.userInfo.user_id 
                }
                stockApi.InitializationData(obj).then(res => {
                    this.isShowProcess = false;
                    if(res===0) this.$message({ message: '初始化成功', type: 'success' });
                }).catch(()=>{
                    this.isShowProcess = false;
                });

            }).catch(() => { });
        },

        //#endregion

        //#region 获取数据

        GetInitialDataListl() {                             // 获取配置
            stockApi.GetInitialDataListl().then(res => {
                this.jsonData = this.$app.isNull(res) ? [] : res.map(item => { return { name: item.explain, value: item.sv_type } });
            });
        },
        defaultTime() {                                     // 默认是否显示倒计时
            this.verifi_code_time = parseInt(this.$app.getLocalStorage('getVerifi_code_time')) || this.verifi_code_time;
            if (this.verifi_code_time < 61) { this.handleCodeTime() }
        },
        getTime() {                                         // 进度条文字
            const setTime = (i, that) => {
                if (!that.isShowProcess) return;
                let index = i === 1 ? 2 : i === 2 ? 3 : 1;
                switch (i) {
                    case 1: this.processName = '初始化中.'; break;
                    case 2: this.processName = '初始化中..'; break;
                    case 3: this.processName = '初始化中...'; break;
                    default: break;
                }
                setTimeout(() => {
                    setTime(index, that);
                }, 1000);
            }
            setTime(1, this)
        },

        //#endregion 
    }
}
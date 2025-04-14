import { stockApi, basicApi } from "@/api/index.js";
import { ImportImg } from "@/components/index";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'authentication',
    components: { ImportImg },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        importInfo: {
            type: Object,
            default: () => {
                return {
                    sv_signature_approval_id: 0,
                    sv_status: 0,
                    sv_refusereason: '',
                }
            }
        },
    },
    data() {
        return {
            stepIndex: 1,
            showUpload: false,
            auditStatus: 0,                         // 0-未提交 1审核成功，2待审核，3审核失败，4审核中
            signatureIdentifyData: {                // 短信资料修改
                sv_company: '',
                sv_credit_code: '',
                sv_credit_username: '',
                sv_creditcode_url: '',
                sv_idcard: '',
                sv_idcard_back: '',
                sv_idcard_front: '',
                sv_legalperson: '',
                sv_phone: '',
                code: '',
                sv_signature_approval_id: null,
                user_id: ''
            },
            license: [],                            // 营业执照
            idCard: [],                             // 身份证
            idCardReverse: [],                      // 身份证反面
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'storeCenter', isCompress: true } },
            verifi_code: '',
            verifi_code_time: 61,                   // 验证码时间
            slideDialogVisible: false,              // 滑动验证对话框
        }
    },
    computed: {
        ...mapState(['queryUpdateCartting']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        isAuditing() {
            // 审核中
            return this.auditStatus === 4
        },
        isAuditFailed() {
            // 审核失败
            return this.stepIndex === 2 && this.auditStatus === 3
        },
        verifi_code_text() {
            return this.verifi_code_time < 61 ? this.verifi_code_time + 's' : '点击发送'
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.showUpload = false;
                    if (this.importInfo.sv_status === 1) {
                        // 审核成功
                        this.stepIndex = 3;
                        this.auditStatus = 3;
                    } else if (this.importInfo.sv_status === 2) {
                        // 待审核
                    } else if (this.importInfo.sv_status === 3) {
                        // 审核失败
                        this.stepIndex = 2;
                        this.auditStatus = 3;
                    } else if (this.importInfo.sv_status === 4) {
                        // 审核中
                        this.stepIndex = 2;
                        this.auditStatus = 4;
                    }
                    this.getSignatureIdentification();
                    this.verifi_code = '';
                    this.license = [];
                    this.idCard = [];
                    this.idCardReverse = [];
                    this.verifi_code_time = parseInt(window.localStorage.getItem('getVerifi_code_time')) || this.verifi_code_time;
                    this.$nextTick(() => {
                        this.$refs.authentication.focus();
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
        },
        handleShowUpload() {
            this.showUpload = true;
        },
        callbackImportImg(item) {                           // 上传图片回调事件
            let { value, type } = item;
            if (type === 1) {
                // 身份证人像 执行OCR接口识别
                this.signatureIdentifyData.sv_idcard_front = value.length > 0 ? value[0] : '';
                if (value.length === 0) return
                stockApi.idcard(this.$app.fmtImgWithHttp(value[0])).then(res => {
                    try {
                        const dataInfo = JSON.parse(res);
                        this.signatureIdentifyData.sv_credit_username = dataInfo.name;
                        this.signatureIdentifyData.sv_idcard = dataInfo.id;
                    } catch (error) {

                    }
                });
            }
            if (type === 2) {
                // 身份证国徽
                this.signatureIdentifyData.sv_idcard_back = value.length > 0 ? value[0] : '';
            }
            if (type === 3) {
                // 营业执照 执行OCR接口识别
                this.signatureIdentifyData.sv_creditcode_url = value.length > 0 ? value[0] : '';
                if (value.length === 0) return
                stockApi.businessLicense(this.$app.fmtImgWithHttp(value[0])).then(res => {
                    try {
                        const dataInfo = JSON.parse(res);
                        this.signatureIdentifyData.sv_credit_code = dataInfo.reg_num;
                        this.signatureIdentifyData.sv_company = dataInfo.enterprise_name;
                        this.signatureIdentifyData.sv_legalperson = dataInfo.legal_representative;
                    } catch (error) {

                    }
                });
            }
        },
        handleInputNumber({ target }, key) {                // 输入验证
            target.value = this.$app.verifyNumber(target.value);
            this.signatureIdentifyData[key] = target.value;
        },
        handleBtnSure() {
            const postData = {
                ...this.signatureIdentifyData,
                sv_idcard_front: this.$app.fmtImgWithHttp(this.signatureIdentifyData.sv_idcard_front),
                sv_idcard_back: this.$app.fmtImgWithHttp(this.signatureIdentifyData.sv_idcard_back),
                sv_creditcode_url: this.$app.fmtImgWithHttp(this.signatureIdentifyData.sv_creditcode_url)
            }
            let hasDataNull = false;
            Object.keys(postData).forEach(key => {
                if (this.$app.isNull(postData[key])) {
                    hasDataNull = true;
                }
            })
            if (hasDataNull) return this.$message.error('请填入必填项');
            stockApi.saveIdentification(postData).then(res => {
                this.$message.success('提交成功');
                this.closeDialog();
                this.$emit('success')
            });
        },
        getSignatureIdentification() {                      // 获取认证资料
            stockApi.getSignatureIdentification({ id: this.importInfo.sv_signature_approval_id }).then(res => {
                if (res) {
                    this.signatureIdentifyData = res;
                }
            });
        },
        handelGetVerifiCode() {                             // 获取手机验证码，弹出滑动验证
            if (this.verifi_code_time !== 61) return
            if (this.signatureIdentifyData.sv_phone.length !== 11 || !this.$app.isPhoneNumber(this.signatureIdentifyData.sv_phone)) return this.$message.warning('手机号不正确，发送失败');
            this.slideDialogVisible = true;
            this.$nextTick(() => {
                this.initNcView();
            })
        },
        initNcView() {                                      // 初始化滑动验证
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
                    const nonce = that.$app.getRandomNum(6);                                                            // 随机六位数
                    const userName = that.signatureIdentifyData.sv_phone;                                               // 获取用户名
                    const signature = that.$app.getSignature(userName, that.$app.getTimeStamp(10), nonce);              // 签名
                    let entry = {
                        userName: userName,
                        sid: data.csessionid,
                        sig: data.sig,
                        token: nc_token,
                        scene: "nc_register",
                        signature,
                        timestamp: that.$app.getTimeStamp(10),
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
        handleCodeTime() {                      // 开始验证码倒计时
            let timeout = setInterval(() => {
                if (this.verifi_code_time < 1) {
                    this.verifi_code_time = 61;
                    clearInterval(timeout);
                    this.$app.deleteLocalStorage('getVerifi_code_time');
                } else {
                    this.verifi_code_time--;
                    this.$app.setLocalStorage('getVerifi_code_time', this.verifi_code_time);
                }
            }, 1000)
        },
    }
};
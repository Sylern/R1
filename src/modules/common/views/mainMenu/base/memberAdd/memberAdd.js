import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState, mapGetters, mapMutations } from 'vuex';
import { convergePay } from '@/components/index';
import ImportImg from '@/components/common/ImportImg/ImportImg.vue';
export default {
    name: 'memberAdd',
    components: { convergePay, ImportImg },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataObj: {
            type: Object,
            default: () => {
                return {
                    newType: 'phone',
                    val: ''
                }
            }
        }
    },
    data() {
        return {
            keyWord: '',
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Member', isCompress: true } },
            verifyJson: { fileNumber: 1, photoExt: ['.jpg', '.png'], fileSize: 1024 },
            formData: {
                sv_mr_headimg: '',                          // 头像
                sv_mr_cardno: '',                           // 卡号
                sv_mr_name: '',                             // 姓名
                sv_mrr_money: '',                           // 开卡金额
                sv_mrr_present: '',                         // 赠送金额
                sv_mrr_payment: '',                         // 支付方式
                memberlevel_id: '',                         // 等级
                salesClerk: '',                             // 开卡员工
                sv_mr_nick: '',                             // 称呼
                sv_mr_mobile: '',                           // 手机
                sv_mr_remark: '',
                sv_mr_pwd: ''                               // 会员密码
            },
            checkPrint: false,                              // 是否打印
            payTypeList: [],                                // 支付方式列表
            levelList: [],                                  // 等级列表
            salesClerk: [],                                 // 开卡员工列表
            rules: {
                sv_mr_cardno: [{
                    required: true,
                    message: '请输入卡号',
                    trigger: ['blur', 'change']
                }],
                sv_mr_name: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: ['blur', 'change']
                }],
                memberlevel_id: [{
                    required: true,
                    message: '请选择会员等级',
                    trigger: ['blur']
                }]
            },
            isScanning: false,
            rechargeData: {                 // 聚合支付 充值实体
                authcode: '',                   // 付款码
                member_id: '',                  // 会员id
                recharge_id: 0,                 // 充值记录id
                sv_mrr_money: '',               // 充值金额
                sv_mrr_present: 0,              // 赠送金额
                sv_mrr_desc: '',                // 备注信息
                commissionemployePercent: '',   // 提成人员
                sv_mrr_payment: '',             // 支付方式
                user_id: this.$store.state.userInfo.user_id,    // 门店id
                sv_user_givingtype: 0,          // 赠送类型 1积分，2现金
                sv_detali_proportionalue: 0,    // 配置比例值
                sv_detail_value: 0,             // 优惠值（积分）
                sv_mrr_date: '',                // 充值时间
                issendmes: false,               // 是否发送短信
                sv_mrr_operator: '',            // 操作人ID
                sv_mrr_state: false,            // 
                sv_mrr_type: 0,                 // -1扣费退款,-2储值退款,0充值,1扣费,2订单消费,3.订单退款,4开卡充值,5储值卡余额退还，8储值卡充次,9:邀请有礼，10：计时退款，11：计时补款
                sv_mrr_amountbefore: 0,         // 充值前金额
                sv_mrr_amountafter: 0,          // 充值后金额
                is_version_flat: true,          // 实付金额是否减去赠送金额
            }
        }
    },
    computed: {
        ...mapGetters(['hasStoreCard']),
        ...mapState(['memberList', 'userInfo', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        isLinePay() {                                    // 是否线上支付 微信 支付宝 聚合支付
            return !this.$app.isNull(this.userInfo.dec_payment_config) && (this.userInfo.dec_payment_config.ConvergePay || this.userInfo.sv_enable_wechatpay || this.userInfo.sv_enable_alipay)
        },
        memberLogo() {
            let url = this.$app.isNull(this.formData.sv_mr_headimg) ? [] : [this.formData.sv_mr_headimg]
            return url
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.$nextTick(() => {
                        this.initForm();
                        if (this.$app.isNull(this.formData.sv_mr_cardno)) this.getMemberCode();
                        this.getMemeberFilters();
                        this.getPaymentList();
                        this.$refs.sv_mr_name.focus();
                    })
                }
            }
        }
    },
    mounted() {
        this.getSalesclerkInfo();
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
                    console.log('memberAdd: key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'memberAdd');
            this.$root.$emit('restaurant', 'memberAdd');
        },
        handleImgBack(e) {                                  // 图片上传组件回调
            this.formData.sv_mr_headimg = e[0];
        },
        initForm() {                                        // 初始化表格输入 
            this.formData = {
                sv_mr_headimg: '',                                                              // 头像
                sv_mr_cardno: this.dataObj.newType === 'cardNo' ? this.dataObj.val : '',        // 卡号
                sv_mr_name: this.dataObj.newType === 'name' ? this.dataObj.val : '',            // 姓名
                sv_mrr_money: '',                                                               // 开卡金额
                sv_mrr_present: '',                                                             // 赠送金额
                sv_mrr_payment: '',                                                             // 支付方式
                memberlevel_id: '',                                                             // 等级
                salesClerk: '',                                                                 // 开卡员工
                sv_mr_remark: '',
                sv_mr_nick: '',                                                                 // 称呼
                sv_mr_mobile: this.dataObj.newType === 'phone' ? this.dataObj.val : '',         // 手机
                sv_mr_pwd: ''                                                                   // 会员密码
            }
        },
        handleInputNumber({ target }) {
            target.value = this.$app.verifyNumber(target.value);
        },
        handleEnter() {                                         // 确定事件
            if (this.$app.isNull(this.formData.sv_mr_mobile)) return this.$message.error('请输入手机号码');
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.addMemberInfo();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        closeScanning() {
            this.isScanning = false;
            setTimeout(() => {
                this.closeDialog();
            }, 500)
        },
        newVipPrint() {                                         // 打印小票
            if (!this.checkPrint) return
            let memberJson = { ...this.formData };
            if (this.$app.isNull(memberJson.sv_mrr_money) || memberJson.sv_mrr_money === 0) {
                let printDataList = [
                    {
                        type: 'line',
                        text: '欢迎光临',
                        size: 17,
                        lineHeight: 30,
                        align: 1
                    },
                    {
                        type: 'line',
                        text: this.$store.state.userInfo.sv_us_name,
                        align: 1,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: `会员姓名：${memberJson.sv_mr_name}`
                    },
                    {
                        type: 'line',
                        text: `会员卡号：${memberJson.sv_mr_cardno}`
                    },
                    {
                        type: 'line',
                        text: `会员等级：${this.levelList.find(e => e.value === this.formData.memberlevel_id).label}`,
                        bottomLine: true
                    },
                    {
                        type: 'line',
                        text: '类型：新增会员',
                    },
                ]
                this.salesClerk.length > 0 && printDataList.push({
                    type: 'line',
                    text: `开卡员工：${this.salesClerk.find(e => e.value === this.formData.salesClerk).label}`,
                })
                printDataList.push({
                    type: 'line',
                    text: '备注：' + (memberJson.sv_mr_remark || ''),
                })
                this.$print.sales(printDataList);
                return
            }
            let printDataList = [
                {
                    type: 'line',
                    text: '欢迎光临',
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: this.$store.state.userInfo.sv_us_name,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: `会员姓名：${memberJson.sv_mr_name}`
                },
                {
                    type: 'line',
                    text: `会员卡号：${memberJson.sv_mr_cardno}`
                },
                {
                    type: 'line',
                    text: `会员等级：${this.levelList.find(e => e.value === this.formData.memberlevel_id).label}`,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '类型：充值',
                },
                {
                    type: 'line',
                    text: `充值金额：${this.$app.moneyFixed(memberJson.sv_mrr_money * 1)}`,
                },
            ]
            memberJson.sv_mrr_present > 0 && printDataList.push({
                type: 'line',
                text: `赠送金额：${this.$app.moneyFixed(memberJson.sv_mrr_present * 1)}`,
            })
            this.salesClerk.length > 0 && printDataList.push({
                type: 'line',
                text: `开卡员工：${this.salesClerk.find(e => e.value === this.formData.salesClerk).label}`,
            })
            let array1 = [
                {
                    type: 'line',
                    text: `付款方式：${memberJson.sv_mrr_payment}`,
                },
                {
                    type: 'line',
                    text: `充值前金额：0.00`,
                },
                {
                    type: 'line',
                    text: `充值后金额：${this.$app.moneyFixed(this.$app.addNumber(memberJson.sv_mrr_money * 1, memberJson.sv_mrr_present * 1))}`,
                },
                {
                    type: 'line',
                    text: `充值时间：${this.$app.currentTime(new Date())}`,
                },
                {
                    type: 'line',
                    text: '备注：' + (memberJson.sv_mr_remark || ''),
                },
            ]
            printDataList = printDataList.concat(array1);
            this.$print.sales(printDataList);
        },
        //#region 数据请求
        getMemberCode() {                                       // 自动创建会员卡号
            stockApi.getAutomaticallyGenerateMemberCode().then(res => {
                if (res) {
                    this.formData.sv_mr_cardno = res.values;
                }
            });
        },
        getPaymentList() {                                      // 获取支付方式
            stockApi.getPaymentList({ type: 1 }).then(res => {
                if (this.$app.isNull(this.$store.state.userInfo.dec_payment_config) || this.$store.state.userInfo.dec_payment_config.ConvergePay === false) {
                    res = res.filter(e => e.name !== '扫码支付')
                }
                this.payTypeList = this.$app.isNull(res) ? [{ label: '现金', value: '现金' }] : res.map(e => {
                    return {
                        label: e.name,
                        value: e.name
                    }
                })
            })
        },
        getMemeberFilters() {                                   // 获取会员配置相关信息
            stockApi.getMemeberFilters().then(res => {
                if (res) {
                    this.levelList = this.$app.isNull(res.values.getUserLevel) ? [] : res.values.getUserLevel.map(e => {
                        return {
                            value: e.memberlevel_id + '',
                            label: e.sv_ml_name
                        }
                    });
                    if (this.levelList.length > 0) this.formData.memberlevel_id = this.levelList[0].value;
                }
            });
        },
        getSalesclerkInfo() {                                    // 获取开卡员工列表
            stockApi.getEmployeePageListV2().then(res => {
                if (res && res.succeed && !this.$app.isNull(res.values)) {
                    this.salesClerk = res.values.map(e => {
                        return {
                            // isSelected: false,
                            // ...e
                            value: e.sv_employee_id + '',
                            label: e.sv_employee_name
                        }
                    });
                    if (this.salesClerk.length > 0) this.formData.salesClerk = this.salesClerk[0].value;
                }
            });
        },
        addMemberInfo() {                                       // 新增会员
            let token = this.$app.getLocalStorage('token');
            if (!token) return this.$message.error('令牌失效，请重新登录');
            this.formData.sv_mrr_money = this.$app.isNull(this.formData.sv_mrr_money) ? 0 : this.formData.sv_mrr_money;
            this.formData.sv_mrr_present = this.$app.isNull(this.formData.sv_mrr_present) ? 0 : this.formData.sv_mrr_present;

            const commissionemployePercent = this.$app.isNull(this.formData.salesClerk) ? [] : [{ employeeId: this.formData.salesClerk, percent: 100 }];
            let query = { ...this.formData, commissionemployePercent };

            if (query.sv_mrr_payment === '扫码支付' && this.isLinePay) {
                query.sv_mrr_money = 0;
                query.sv_mrr_present = 0;
            }
            stockApi.addMemberInfo(query, token).then(res => {
                if (res) {
                    this.getAutoMemberCode(true);
                    Object.keys(this.rechargeData).forEach(e => {
                        this.rechargeData[e] = this.formData[e] || this.rechargeData[e];
                    })
                    // this.rechargeData = { ...this.formData };
                    this.rechargeData.member_id = res;
                    this.rechargeData.commissionemployePercent = commissionemployePercent;
                    this.rechargeData.sv_mrr_amountbefore = this.formData.sv_mrr_money;

                    this.$emit('addSuccess', res);

                    this.$message({ message: '新增会员成功', type: 'success' });
                    if (this.formData.sv_mrr_payment === '扫码支付') {
                        this.isScanning = true;
                    } else {
                        setTimeout(() => {
                            this.closeDialog();
                        }, 500)
                        this.newVipPrint()
                    }
                    return
                }
                res.msg && this.$message({ message: res.msg, type: 'error' });
            });
        },

        appRecharge(authcode) {                                 // 会员充值 聚合支付
            let query = { ...this.rechargeData };
            query.authcode = authcode;
            query.sv_mrr_date = this.$app.currentTime(new Date());

            this.$app.isNull(query.sv_mrr_present) && (query.sv_mrr_present = 0)
            stockApi.appRecharge(query).then(res => {
                if (res && res.serialNumber) {
                    if (res.isConvergePay) {
                        this.convergePay(res.serialNumber)
                    } else {
                        this.$message.success('充值成功');
                        this.newVipPrint();
                        this.closeScanning();
                    }
                }
            }).catch(e => {
                !e && (this.payStep = 3, this.isScanning = false);
            })
        },
        convergePay(code) {                                     // 查询聚合支付状态
            stockApi.convergePay(code).then(res => {
                if (res) {
                    if (res.action == -1) {
                        this.closeScanning();
                        return this.$message.error(res.msg);
                    }
                    if (res.action == 1) {
                        if (res.status == 1) {
                            this.$message.success('付款成功'), this.closeScanning();
                            this.newVipPrint();
                            this.closeDialog();
                            return
                        }
                        if (res.status == -1) {
                            this.$message.success('付款失败'), this.closeScanning();
                            this.payErrPrint();
                            this.closeDialog();
                            return
                        }
                    }
                    setTimeout(() => { this.convergePay(code); }, 1000);
                }
            }).catch(err => {
                this.payErrPrint();
                this.closeDialog();
            })
        },
        getAutoMemberCode(add = false) {                        // 获取/修改 会员自动编码
            stockApi.getAutoMemberCode({ plusOne: add });
        },
        payErrPrint() {
            this.formData.sv_mrr_money = 0;
            this.formData.sv_mrr_present = 0;
            this.newVipPrint();
        }
        //#endregion
    }
};
import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            psw_table: '',                          // 退菜密码
            psw_table_text: {
                6: '退单密码',
                27: '退菜密码'
            },
            psw: '',                                // 退款密码
            updateType: '',                         // 当前是退款or退菜
            radioValue: null,
            messageDialog: false,                   // 短信弹窗
            messageCode: '',                        // 短信内容
            isSending: 0,                           // 发送短信间隔
            sv_uc_isenablepwd: false,               // 储值卡支付会员开关
            /**
             * ReceptionCashierSet 前台收银常用配置
             * Return_Vegetables_Pwd 退菜密码
             * Refund_Password_Manage 退款密码管理
             * Refund_Password_Switch 退款密码开关
             * Refund_Password_Value 退款密码
            **/
            confingList: ['ReceptionCashierSet', 'Refund_Password_Manage'],
            configData: {},
            dataObj: {
                Return_Vegetables_Pwd: {
                    enable: true,
                    value: ''
                },
                Refund_Password_Switch: {
                    enable: true
                },
                Refund_Password_Value: {
                    enable: true
                }
            },
            psw_vip: "" //会员初始密码
        }
    },
    watch: {
        messageDialog: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.messageCode = '';
                }
            }
        }
    },
    computed: {
        ...mapState(['userInfo']),
        hasReturnCateringPsw() {
            // 6-棋牌茶楼 27-餐饮行业
            const excludedIndustry = [6, 27]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        hasReturnPsw() {
            // 店主账号
            return this.userInfo.sp_salesclerkid === 0
        },
    },
    mounted() {
        this.getUserConfigInfo();
        this.getUserModuleConfigs();
    },
    methods: {
        handleRadio() {
            let query = {
                sv_uc_isenablepwd: this.sv_uc_isenablepwd,
                sv_uc_isenableohter: this.radioValue
            }
            stockApi.modifyVerModeByUid(query).then(res => {
                if (res !== false) {
                    this.$message.success('修改成功');
                }
            })
        },
        handleInput({ target }) {                           // 输入框只能输入数字
            target.value = this.$app.verifyNumber(target.value);
        },
        handlePswSwitch() {
            if (!this.dataObj.Refund_Password_Switch.enable) {
                this.updateType = 'Refund_Password_Switch';
                this.messageDialog = true;
            } else {
                this.switchControlSub('Refund_Password_Switch');
            }
        },
        handlePsw() {
            if (this.psw.length > 6) return;
            if (this.psw.length !== 6) return this.$message.warning('请输入6位密码');
            this.updateType = 'Refund_Password_Value';
            this.messageDialog = true;
        },
        handleVegetablePsw() {                              // 修改退菜密码
            if (this.psw_table.length > 6) return;
            if (this.psw_table.length !== 6) return this.$message.warning('请输入6位密码');
            // this.updateType = 'Return_Vegetables_Pwd';
            // this.messageDialog = true;
            let key = 'Return_Vegetables_Pwd';
            let currData = this.configData[key];
            let hasDetail = !this.$app.isNull(currData.childDetailList);
            let configData = [
                {
                    sv_detail_value: this.psw_table,
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: true,
                    sv_user_configdetail_name: currData.sv_user_config_name,
                    sv_remark: currData.sv_remark
                }
            ]
            this.saveConfigdetailList(key, configData);
        },
        handleVipPsw() {
            if (this.psw_vip.length > 6) return;
            if (this.psw_vip.length !== 6) return this.$message.warning('请输入6位密码');
            stockApi.UpdatememberregisterPwd({ psw: this.psw_vip }).then(() => {
                this.$message.success('修改成功');
            })
        },
        handleMessageSure() {                               // 修改退款密码
            if (this.$app.isNull(this.messageCode)) return this.$message.warning('请输入验证码');
            if (this.$app.isNull(this.updateType)) return this.$message.warning('没有找到修改项');
            stockApi.checkMessageCode(this.userInfo.sv_ul_mobile, this.messageCode).then(res => {
                if (res.succeed) {
                    if (this.updateType === 'Refund_Password_Switch') {
                        this.switchControlSub('Refund_Password_Switch');
                    } else {
                        let currData = this.configData[this.updateType];
                        let hasDetail = !this.$app.isNull(currData.childDetailList);
                        let configData = [
                            {
                                sv_detail_value: this.psw,
                                sv_user_config_id: currData.sv_user_config_id,
                                sv_user_module_id: currData.sv_user_module_id,
                                sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                                sv_detail_is_enable: true,
                                sv_user_configdetail_name: currData.sv_user_config_name,
                                sv_remark: currData.sv_remark
                            }
                        ]
                        this.saveConfigdetailList(this.updateType, configData);
                    }
                } else {
                    this.$message.error(res.values);
                }
            })
        },
        handleMessageCancel() {
            this.messageDialog = false;
            if (this.updateType === 'Refund_Password_Switch') {
                this.dataObj.Refund_Password_Switch.enable = true;
            }
        },
        sendCode() {                                    // 发送手机验证码
            if (this.isSending > 0) return;
            let time = null;
            stockApi.setMessageCode(this.userInfo.sv_ul_mobile).then(res => {
                if (res) {
                    this.isSending = 60;
                    time = setInterval(() => {
                        this.isSending--;
                        if (this.isSending < 1) clearInterval(time)
                    }, 1000)
                }
            })
        },
        getUserConfigInfo() {                           // 获取userInfo配置
            stockApi.getUserConfigInfo().then(res => {
                if (res) {
                    this.sv_uc_isenablepwd = res.sv_uc_isenablepwd;
                    this.radioValue = res.sv_uc_isenableohter;
                }
            })
        },
        handleSwitch() {                                // 支付密码开关
            let query = {
                name: 'sv_uc_isenablepwd',
                key: 'whether',
                valu: this.sv_uc_isenablepwd
            }
            stockApi.updateUserConfigInfo(query).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            })
        },
        getUserModuleConfigs() {                        // 获取配置
            stockApi.getUserModuleConfigs(this.confingList).then(res => {
                if (res) {
                    let Return_Vegetables_Pwd,
                        Refund_Password_Switch,
                        Refund_Password_Value;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'ReceptionCashierSet':
                                Return_Vegetables_Pwd = item.childInfolist.find(e => e.sv_user_config_code === 'Return_Vegetables_Pwd');
                                break;
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
                        * ReceptionCashierSet 前台收银常用配置
                        * Return_Vegetables_Pwd 退菜密码
                        * Refund_Password_Manage 退款密码管理
                        * Refund_Password_Switch 退款密码开关
                        * Refund_Password_Value 退款密码
                    **/
                    let return_VegetablesHasDetail = !this.$app.isNull(this.configData.Return_Vegetables_Pwd.childDetailList);
                    this.dataObj.Return_Vegetables_Pwd.enable = return_VegetablesHasDetail ? this.configData.Return_Vegetables_Pwd.childDetailList[0].sv_detail_is_enable : true;
                    this.dataObj.Return_Vegetables_Pwd.value = return_VegetablesHasDetail ? this.configData.Return_Vegetables_Pwd.childDetailList[0].sv_detail_value : '';

                    let refundHasDetail = !this.$app.isNull(this.configData.Refund_Password_Switch.childDetailList);
                    this.dataObj.Refund_Password_Switch.enable = refundHasDetail ? this.configData.Refund_Password_Switch.childDetailList[0].sv_detail_is_enable : true;

                    let refund_PasswordHasDetail = !this.$app.isNull(this.configData.Refund_Password_Value.childDetailList);
                    this.dataObj.Refund_Password_Value.sv_detail_value = refund_PasswordHasDetail ? this.configData.Refund_Password_Value.childDetailList[0].sv_detail_value : '';
                    // this.psw = this.userInfo.sv_uit_cache_name === 'cache_name_catering' ? this.dataObj.Return_Vegetables_Pwd.value : this.dataObj.Refund_Password_Value.sv_detail_value;
                    this.psw_table = this.dataObj.Return_Vegetables_Pwd.value;
                    this.psw = this.dataObj.Refund_Password_Value.sv_detail_value;
                }
            })
        },
        switchControlSub(_key) {
            let currData = this.configData[_key];
            let hasDetail = !this.$app.isNull(currData.childDetailList);
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.dataObj[_key].enable,
                    sv_user_configdetail_name: hasDetail ? currData.childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childDetailList[0].sv_remark : ''
                }
            ]
            this.saveConfigdetailList(_key, configData);
        },
        saveConfigdetailList(moduleCode, configData) {      // 修改调用
            stockApi.saveConfigdetailList(moduleCode, configData).then(res => {
                if (res) {
                    this.messageDialog = false;
                    this.$message.success('修改成功');
                }
            })
        }
    }
}
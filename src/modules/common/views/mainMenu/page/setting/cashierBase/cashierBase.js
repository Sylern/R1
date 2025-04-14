import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            switchStatus: '',
            radioValue: 1,
            sv_uc_serialnumberset: {
                name: 'sv_uc_serialnumberset',
                key: 'nomber',
                valu: ''
            },
            sv_store_cashmoney_enable: false,           // 是否开启备用金
            openBrandNum: false,                        // 是否开启轻餐牌号
            /**
            * EveryDaySerialNumber 每日流水号
            * MultiSpecification 是否显示多规格
            * SelectCommissionRequired 结账时是否必选导购员
            * RechargeSelectCommissionRequired 次卡购买、充值时是否必选导购员
            * ZeroInventorySales 是否允许零库存销售
            * SplitOpenACase 是否自动拆箱
            * Package_Bundle_Sales 是否开启包装组合捆绑销售
            * ReceptionCashierSet 前台收银常用配置
            * IsShowLastSettlement 前台收银是否显示拿货价
            * AutoBindCode 计时商品自动自动绑定票码
            * Current_Price_UpdateDiscount 时价商品是否允许打折
            * Multiple_Price_tips 收银多价格提示
            * Cashier_Number_Cumulation 收银商品数量是否累加
            * succession 是否启用交接班
            * CashierVoice 前台收款语音
            * OnlineOrderVoice 线上来单语音
            */
            configList: ['EveryDaySerialNumber', 'MultiSpecification', 'SelectCommissionRequired', 'RechargeSelectCommissionRequired', 'ZeroInventorySales', 'SplitOpenACase', 'Package_Bundle_Sales', 'ReceptionCashierSet', 'IsShowLastSettlement', 'Playground', 'Cashier_Number_Cumulation', 'succession', 'CashierVoice', 'OnlineOrderVoice','TokenSymbols'],
            configData: {},
            dataObj: {
                EveryDaySerialNumber: {
                    enable: true,
                    input1: '',
                    input2: '',
                    input3: '0',
                    input4: ''
                },
                MultiSpecification: {
                    enable: true
                },
                SelectCommissionRequired: {
                    enable: false
                },
                RechargeSelectCommissionRequired: {
                    enable: false
                },
                ZeroInventorySales: {
                    enable: true
                },
                SplitOpenACase: {
                    enable: true
                },
                Package_Bundle_Sales: {
                    enable: true
                },
                ReceptionCashierSet: {
                    enable: true
                },
                Current_Price_UpdateDiscount: {
                    enable: false
                },
                Multiple_Price_tips: {
                    enable: true
                },
                Cashier_Number_Cumulation: {
                    enable: true
                },
                Desk_Cashier_Is_ShowCode_Switch: {
                    enable: true
                },
                IsShowLastSettlement: {
                    enable: false
                },
                AutoBindCode: {
                    enable: false
                },
                playCode: {
                    value: ''
                },
                succession: {
                    enable: true
                },
                HandNumber: {
                    enable: false
                },
                CashierVoice: {
                    enable: false
                },
                OnlineOrderVoice: {
                    enable: false
                },
                TokenSymbols:{
                    sv_detail_value:''
                }
            },
            Service_Commission_Switch: {
                sv_config_code: "Service_Commission_Switch",
                sv_config_name: "服务商品业绩平分",
                sv_is_enable: false
            },
            unitList: [],
            unitVal: ""
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction']),
        previewNumber() {                               // 预览
            let middle = '';
            for (let index = 1; this.dataObj.EveryDaySerialNumber.input2 > index; index++) {
                middle += this.dataObj.EveryDaySerialNumber.input3
            }
            return this.dataObj.EveryDaySerialNumber.input1 + middle + '1'
        }
    },
    mounted() {
        this.getUserConfigInfo();
        this.getUserModuleConfigs();
        this.getConfigSwitchList();
        this.getTokenSymbols();
        // this.getUserModuleConfigs
    },
    methods: {
        ...mapMutations(['update', 'clearCartting']),
        getTokenSymbols() {
            stockApi.GetTokenSymbols().then(res => {
                this.unitList = res
            })
        },
        getUserConfigInfo() {                           // 获取userInfo配置
            stockApi.getUserConfigInfo().then(res => {
                this.sv_uc_serialnumberset.valu = JSON.parse(res.sv_uc_serialnumberset).nomber;
                this.sv_store_cashmoney_enable = res.sv_store_cashmoney_enable;
            })
        },
        getUserModuleConfigs() {                        // 获取配置
            stockApi.getUserModuleConfigs(this.configList).then(res => {
                if (res) {
                    this.configData = res;
                    let EveryDaySerialNumber,
                        MultiSpecification,
                        SelectCommissionRequired,
                        RechargeSelectCommissionRequired,
                        ZeroInventorySales,
                        SplitOpenACase,
                        Package_Bundle_Sales,
                        ReceptionCashierSet,
                        Current_Price_UpdateDiscount,
                        Multiple_Price_tips,
                        Cashier_Number_Cumulation,
                        Desk_Cashier_Is_ShowCode_Switch,
                        Playground,
                        playCode,
                        AutoBindCode,
                        IsShowLastSettlement,
                        succession,
                        HandNumber,
                        CashierVoice,
                        OnlineOrderVoice,
                        TokenSymbols;
                        
                    res.forEach(item => {
                        // console.log(item.sv_user_module_code)
                        switch (item.sv_user_module_code) {
                            case 'EveryDaySerialNumber':
                                EveryDaySerialNumber = item;
                                break;
                            case 'MultiSpecification':
                                MultiSpecification = item;
                                break;
                            case 'SelectCommissionRequired':
                                SelectCommissionRequired = item;
                                break;
                            case 'RechargeSelectCommissionRequired':
                                RechargeSelectCommissionRequired = item;
                                break;
                            case 'ZeroInventorySales':
                                ZeroInventorySales = item;
                                break;
                            case 'SplitOpenACase':
                                SplitOpenACase = item;
                                break;
                            case 'Package_Bundle_Sales':
                                Package_Bundle_Sales = item;
                                break;
                            case 'ReceptionCashierSet':
                                ReceptionCashierSet = item;
                                Current_Price_UpdateDiscount = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Current_Price_UpdateDiscount');
                                Multiple_Price_tips = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Multiple_Price_tips');
                                Cashier_Number_Cumulation = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Cashier_Number_Cumulation');
                                Desk_Cashier_Is_ShowCode_Switch = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Desk_Cashier_Is_ShowCode_Switch');
                                HandNumber = ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'HandNumber');
                                break;
                            case 'Playground':
                                Playground = item;
                                AutoBindCode = Playground.childInfolist.find(e => e.sv_user_config_code === 'AutoBindCode');
                                playCode = Playground.childInfolist.find(e => e.sv_user_config_code === 'Code');
                                break;
                            case 'IsShowLastSettlement':
                                IsShowLastSettlement = item;
                                break;
                            case 'succession':
                                succession = item;
                                break;
                            case 'CashierVoice':
                                CashierVoice = item;
                                break;
                            case 'OnlineOrderVoice':
                                OnlineOrderVoice = item;
                                break;
                            case 'TokenSymbols':
                                TokenSymbols = item
                            default:
                                break;
                        }
                    });
                    this.configData = {
                        EveryDaySerialNumber,
                        MultiSpecification,
                        SelectCommissionRequired,
                        RechargeSelectCommissionRequired,
                        ZeroInventorySales,
                        SplitOpenACase,
                        Package_Bundle_Sales,
                        ReceptionCashierSet,
                        Current_Price_UpdateDiscount,
                        Multiple_Price_tips,
                        Cashier_Number_Cumulation,
                        Desk_Cashier_Is_ShowCode_Switch,
                        IsShowLastSettlement,
                        playCode,
                        AutoBindCode,
                        succession,
                        HandNumber,
                        CashierVoice,
                        OnlineOrderVoice,
                        TokenSymbols
                    }
                    /**
                     * EveryDaySerialNumber 每日流水号
                     * MultiSpecification 是否显示多规格
                     * SelectCommissionRequired 结账时是否必选导购员
                     * RechargeSelectCommissionRequired 次卡购买、充值时是否必选导购员
                     * ZeroInventorySales 是否允许零库存销售
                     * SplitOpenACase 是否自动拆箱
                     * Package_Bundle_Sales 是否开启包装组合捆绑销售
                     * ReceptionCashierSet 前台收银常用配置
                     * Current_Price_UpdateDiscount 时价商品是否允许打折
                     * Multiple_Price_tips 收银多价格提示
                     * Cashier_Number_Cumulation 收银商品数量是否累加
                     * Desk_Cashier_Is_ShowCode_Switch 收银商品是否显示条码
                     * IsShowLastSettlement 前台收银是否显示拿货价
                     * playCode 票码初始号码
                     * AutoBindCode 计时商品自动自动绑定票码
                     * succession 是否启用交接班
                     * HandNumber 是否启用牌号
                     * CashierVoice 前台收款语音
                     * OnlineOrderVoice 线上来单语音
                     * TokenSymbols 货币符号设置
                    **/
                    let sv_detail = this.$app.isNull(EveryDaySerialNumber.childInfolist[0].childDetailList) ? false : EveryDaySerialNumber.childInfolist[0].childDetailList[0];
                    this.dataObj.EveryDaySerialNumber.enable = sv_detail ? sv_detail.sv_detail_is_enable : true;
                    let sv_detail_value = this.$app.isNull(sv_detail.sv_detail_value) ? '' : JSON.parse(sv_detail.sv_detail_value)
                    this.dataObj.EveryDaySerialNumber.input1 = sv_detail ? sv_detail_value.qianzhui : '';
                    this.dataObj.EveryDaySerialNumber.input2 = sv_detail ? sv_detail_value.changdu : '';
                    this.dataObj.EveryDaySerialNumber.input3 = sv_detail ? sv_detail_value.tianchong : '0';
                    this.dataObj.EveryDaySerialNumber.input4 = sv_detail ? sv_detail_value.maxLengths : '';

                    let mulHasDetail = this.$app.isNull(MultiSpecification.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.MultiSpecification.enable = mulHasDetail ? MultiSpecification.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let selectCommissionRequired = this.$app.isNull(SelectCommissionRequired.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.SelectCommissionRequired.enable = selectCommissionRequired ? SelectCommissionRequired.childInfolist[0].childDetailList[0].sv_detail_is_enable : false;

                    let rechargeSelectCommissionRequired = this.$app.isNull(RechargeSelectCommissionRequired.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.RechargeSelectCommissionRequired.enable = rechargeSelectCommissionRequired ? RechargeSelectCommissionRequired.childInfolist[0].childDetailList[0].sv_detail_is_enable : false;

                    let zeroHasDetail = this.$app.isNull(ZeroInventorySales.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.ZeroInventorySales.enable = zeroHasDetail ? ZeroInventorySales.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let splitHasDetail = this.$app.isNull(SplitOpenACase.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.SplitOpenACase.enable = splitHasDetail ? SplitOpenACase.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let packageHasDetail = this.$app.isNull(Package_Bundle_Sales.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.Package_Bundle_Sales.enable = packageHasDetail ? Package_Bundle_Sales.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let currentHasDetail = this.$app.isNull(Current_Price_UpdateDiscount.childDetailList) ? false : true;
                    this.dataObj.Current_Price_UpdateDiscount.enable = currentHasDetail ? Current_Price_UpdateDiscount.childDetailList[0].sv_detail_is_enable : false;

                    let multipleHasDetail = this.$app.isNull(Multiple_Price_tips.childDetailList) ? false : true;
                    this.dataObj.Multiple_Price_tips.enable = multipleHasDetail ? Multiple_Price_tips.childDetailList[0].sv_detail_is_enable : true;

                    let cashierHasDetail = this.$app.isNull(Cashier_Number_Cumulation.childDetailList) ? false : true;
                    this.dataObj.Cashier_Number_Cumulation.enable = cashierHasDetail ? Cashier_Number_Cumulation.childDetailList[0].sv_detail_is_enable : true;

                    if (this.$app.isNull(Desk_Cashier_Is_ShowCode_Switch)) {
                        this.dataObj.Desk_Cashier_Is_ShowCode_Switch.enable = false;
                    } else {
                        let showCodeHasDetail = this.$app.isNull(Desk_Cashier_Is_ShowCode_Switch.childDetailList) ? false : true;
                        this.dataObj.Desk_Cashier_Is_ShowCode_Switch.enable = showCodeHasDetail ? Desk_Cashier_Is_ShowCode_Switch.childDetailList[0].sv_detail_is_enable : true;
                    }

                    let IsShowLastSettlementDetail = this.$app.isNull(IsShowLastSettlement.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.IsShowLastSettlement.enable = IsShowLastSettlementDetail ? IsShowLastSettlement.childInfolist[0].childDetailList[0].sv_detail_is_enable : false;

                    let AutoBindCodeDetail = this.$app.isNull(AutoBindCode.childDetailList) ? false : true;
                    this.dataObj.AutoBindCode.enable = AutoBindCodeDetail ? AutoBindCode.childDetailList[0].sv_detail_is_enable : false;

                    let playCodeDetail = this.$app.isNull(playCode.childDetailList) ? false : true;
                    this.dataObj.playCode.value = playCodeDetail ? playCode.childDetailList[0].sv_detail_value : '10001';

                    let successionHasDetail = this.$app.isNull(succession.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.succession.enable = successionHasDetail ? succession.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let handNumbeHasDetail = this.$app.isNull(HandNumber.childDetailList) ? false : true;
                    this.dataObj.HandNumber.enable = handNumbeHasDetail ? HandNumber.childDetailList[0].sv_detail_is_enable : false;

                    let CashierVoiceHasDetail = this.$app.isNull(CashierVoice.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.CashierVoice.enable = CashierVoiceHasDetail ? CashierVoice.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;
                    let OnlineOrderVoiceHasDetail = this.$app.isNull(OnlineOrderVoice.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.OnlineOrderVoice.enable = OnlineOrderVoiceHasDetail ? OnlineOrderVoice.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    let TokenSymbolsDetail = this.$app.isNull(TokenSymbols.childInfolist[0].childDetailList) ? false : true;
                    this.dataObj.TokenSymbols.sv_detail_value = TokenSymbolsDetail ? TokenSymbols.childInfolist[0].childDetailList[0].sv_detail_value : '￥';
                }
            })
        },
        getConfigSwitchList() {                         // 获取服务商品业绩平分
            stockApi.getConfigSwitchList().then(res => {
                if (res) {
                    this.Service_Commission_Switch = res[0];
                }
            })
        },
        updateConfigSwitch() {                          // 修改服务商品业绩平分
            const query = {
                code: this.Service_Commission_Switch.sv_config_code,
                enable: this.Service_Commission_Switch.sv_is_enable
            }
            stockApi.updateUser_Module_Configdetail_Enable(query).then(res => {
                this.update({
                    key: 'commission_Switch',
                    data: this.Service_Commission_Switch.sv_is_enable
                })
            }).catch(_ => {
                this.Service_Commission_Switch.sv_is_enable = !this.Service_Commission_Switch.sv_is_enable;
                this.$message.error('修改失败，请稍候再试');
            })
        },
        handleSerialnumberChange({ target }) {
            target.value = this.$app.verifyNumber(target.value);
            this.sv_uc_serialnumberset.valu = parseInt(this.sv_uc_serialnumberset.valu);
        },
        handlePlayCodeChange({ target }) {
            target.value = this.$app.verifyNumber(target.value);
            this.dataObj.playCode.value = target.value;
        },
        handleSerialnumber() {                          // 修改初始单号
            stockApi.updateUserConfigInfo(this.sv_uc_serialnumberset).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            })
        },
        handleBrandNumSwitch() {
            this.$app.setLocalStorage('isOpenBrandNum', this.openBrandNum);
        },
        switchEveryDaySerialNumber() {                  // 每日流水号开关
            let currData = this.configData.EveryDaySerialNumber;
            let hasDetail = this.$app.isNull(currData.childInfolist[0].childDetailList) ? false : currData.childInfolist[0].childDetailList.length;
            let SerialNumberExpression = this.dataObj.EveryDaySerialNumber.input1;
            let times = parseInt(this.dataObj.EveryDaySerialNumber.input2);
            for (let index = 0; index < times; index++) {
                SerialNumberExpression += '[' + this.dataObj.EveryDaySerialNumber.input3 + ']'
            }
            let currValue = {
                datetime: '12',
                SerialNumber: parseInt(this.dataObj.EveryDaySerialNumber.input4) + 1,
                SerialNumberExpression,
                tianchong: this.dataObj.EveryDaySerialNumber.input3,
                changdu: this.dataObj.EveryDaySerialNumber.input2,
                maxLengths: this.dataObj.EveryDaySerialNumber.input4,
                qianzhui: this.dataObj.EveryDaySerialNumber.input1,
            }
            let configData = [
                {
                    sv_detail_value: JSON.stringify(currValue),
                    sv_user_config_id: currData.childInfolist[0].sv_user_config_id,
                    sv_user_module_id: currData.childInfolist[0].sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.dataObj.EveryDaySerialNumber.enable,
                    sv_user_configdetail_name: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_remark : ''
                }
            ]
            this.saveConfigdetailList('EveryDaySerialNumber', configData);
        },
        handleEveryDayInput({ target }, type, key) {
            target.value = type === 'number' ? this.$app.verifyNumber(target.value) : this.$app.verifyLetterNumberComma(target.value);
            this.dataObj.EveryDaySerialNumber[key] = target.value;
            if (parseFloat(this.dataObj.EveryDaySerialNumber.input4) < parseFloat(this.dataObj.EveryDaySerialNumber.input2)) {
                target.value = "";
                this.dataObj.EveryDaySerialNumber[key] = target.value;
                return this.$message.warning('最大长度不能小于或等于最小长度');
            }
        },
        handleEveryDaySerialNumber() {                      // 修改每日流水号
            if (!this.dataObj.EveryDaySerialNumber.enable) return;
            if (!this.dataObj.EveryDaySerialNumber.input2 || !this.dataObj.EveryDaySerialNumber.input3 || !this.dataObj.EveryDaySerialNumber.input4) return this.$message.warning('所填内容不能为空')
            this.switchEveryDaySerialNumber();
        },
        switchControl(_key, type) {
            let currData = this.configData[_key];
            let hasDetail = this.$app.isNull(currData.childInfolist[0].childDetailList) ? false : currData.childInfolist[0].childDetailList.length;
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: currData.childInfolist[0].sv_user_config_id,
                    sv_user_module_id: currData.childInfolist[0].sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.dataObj[_key].enable,
                    sv_user_configdetail_name: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_remark : ''
                }
            ]
            this.saveConfigdetailList(_key, configData, type);
        },
        switchControlSub(_key) {
            let currData = this.configData[_key];
            let hasDetail = this.$app.isNull(currData) ? false : (this.$app.isNull(currData.childDetailList) ? false : true);
            let configData = [
                {
                    sv_detail_value: this.dataObj[_key].value || '',
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
        handleSavePlayCode() {
            if (this.$app.isNull(this.dataObj.playCode.value)) return this.$message.warning('请输入初始票码')
            this.switchControlSub('playCode');
        },

        saveConfigdetailList(moduleCode, configData, type) {      // 修改调用
            stockApi.saveConfigdetailList(moduleCode, configData).then(res => {
                if (res) {
                    let storeDataObj = { ...this.cashierJurisdiction };
                    if (moduleCode === "SelectCommissionRequired") {
                        storeDataObj.SelectCommissionRequired = this.dataObj.SelectCommissionRequired.enable;
                    }
                    if (moduleCode === "RechargeSelectCommissionRequired") {
                        storeDataObj.RechargeSelectCommissionRequired = this.dataObj.RechargeSelectCommissionRequired.enable;
                    }
                    if (moduleCode === "ZeroInventorySales") {
                        storeDataObj.ZeroInventorySales = this.dataObj.ZeroInventorySales.enable;
                        this.clearCartting();
                    }
                    if (moduleCode === "succession") {
                        storeDataObj.succession = this.dataObj.succession.enable;
                    }

                    if (moduleCode === "CashierVoice") {
                        storeDataObj.CashierVoiceEnable = this.dataObj.CashierVoice.enable;
                    }

                    if (moduleCode === "OnlineOrderVoice") {
                        storeDataObj.OnlineOrderVoiceEnable = this.dataObj.OnlineOrderVoice.enable;
                    }

                    if (moduleCode === "Desk_Cashier_Is_ShowCode_Switch") {
                        storeDataObj.showCode = this.dataObj.Desk_Cashier_Is_ShowCode_Switch.enable;
                    }

                    this.update({
                        key: 'cashierJurisdiction',
                        data: storeDataObj
                    });
                    this.$message.success('修改成功');
                }
            })
        },
        setShopCashMoneyEnable() {                          // 备用金开关
            stockApi.setShopCashMoneyEnable(this.sv_store_cashmoney_enable).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            }).catch(e => {
                this.sv_store_cashmoney_enable = false;
            })
        },
        saveUnitHandle(){
            let currData = this.configData['TokenSymbols'];
            const childInfolist = currData.childInfolist[0]
            let configData = [
                {
                    sv_detail_value: this.dataObj['TokenSymbols'].sv_detail_value||'￥',
                    sv_user_config_id: childInfolist.sv_user_config_id,
                    sv_user_module_id: childInfolist.sv_user_module_id,
                    sv_user_configdetail_id:childInfolist.sv_user_configdetail_id,
                    sv_detail_is_enable: true,
                    sv_user_configdetail_name:childInfolist.sv_user_configdetail_name,
                    sv_remark: childInfolist.sv_remark
                }
            ]
            this.saveConfigdetailList('TokenSymbols', configData);
        }
    }
}
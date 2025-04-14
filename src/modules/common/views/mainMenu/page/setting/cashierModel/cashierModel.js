import { mapState, mapMutations } from "vuex";
import { stockApi } from "@/api/index.js";
export default {
    name: 'imgModel',
    data() {
        return {
            cashierType: '0',               // 0.默认模式；1.功能看板
            CashierMode: {},
            preOrderTipSwitch: true,

            PrekontRemind: {},              // 预结原数据
            remind: {                       // 预结提醒开关
                PrekontRemind: false,           // 是否自动预结提醒
                PrekontRemindTime: 0,           // 自动预结提醒提前时长
                PrekontMessage: false,          // 消息提醒
                PrekontVoice: false,            // 语音提醒
                PrekontTips: false,             // 弹窗提醒
                PrekontDelay: false,            // 预结后断电
            },
            SettlementDelay: {},            // 延时关灯原数据
            delay: {                        // 延时关灯开关
                SettlementDelay: false,
                SettlementDelayTime: 0
            },
            AutoOpenTable: {},              // 预约订单自动核销原数据
            openTable: {
                AutoOpenTable: false
            },
            BillablePause: {},              // 暂停关灯相关
            pauseInfo: {
                PauseClose: false,              // 暂停是否关灯
                PauseAccruedDuration: false,    // 暂停是否累计预结时长
            }
        }
    },
    watch: {

    },
    computed: {
        ...mapState(['cashierJurisdiction']),
    },
    beforeMount() {
        this.getUserModuleConfig();
    },
    methods: {
        ...mapMutations(['update']),
        handelType(type) {
            if (this.cashierType === type) return
            this.cashierType = type;
            this.handleSaveModel();
        },
        handlePageScrollUpdate() {
            this.$nextTick(() => {
                this.$refs.pageScroll && this.$refs.pageScroll.update();
            })
        },
        getUserModuleConfig() {                         // 获取配置
            // stockApi.getUserModuleConfig({ moduleCode: 'CashierMode' }).then(res => {
            //     if (res) {
            //         let CashierMode = this.$app.isNull(res) ? [] : res.find(e => e.sv_user_module_code === 'CashierMode');
            //         this.CashierMode = this.$app.isNull(CashierMode) ? {} : CashierMode.childInfolist.find(e => e.sv_user_config_code === 'CashierMode');
            //         let CashierMode_hasDetail = this.$app.isNull(this.CashierMode.childDetailList) ? false : true;
            //         this.cashierType = CashierMode_hasDetail ? this.CashierMode.childDetailList[0].sv_detail_value : '0';
            //     }
            // })
            stockApi.getUserModuleConfigs(['CashierMode', 'PrekontRemind', 'SettlementDelay', 'AutoOpenTable', 'BillablePause']).then(res => {
                if (res) {
                    let CashierMode = this.$app.isNull(res) ? { childInfolist: [] } : res.find(e => e.sv_user_module_code === 'CashierMode');
                    this.CashierMode = this.$app.isNull(CashierMode) ? {} : CashierMode.childInfolist.find(e => e.sv_user_config_code === 'CashierMode');
                    let CashierMode_hasDetail = this.$app.isNull(this.CashierMode.childDetailList) ? false : true;
                    this.cashierType = CashierMode_hasDetail ? this.CashierMode.childDetailList[0].sv_detail_value : '0';

                    this.PrekontRemind = this.$app.isNull(res) ? { childInfolist: [] } : res.find(e => e.sv_user_module_code === 'PrekontRemind');
                    const PrekontRemindSwitch = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontRemind') || {};
                    const PrekontRemindTime = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontRemindTime') || {};
                    const PrekontMessage = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontMessage') || {};
                    const PrekontVoice = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontVoice') || {};
                    const PrekontTips = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontTips') || {};
                    const PrekontDelay = this.PrekontRemind.childInfolist.find(e => e.sv_user_config_code === 'PrekontDelay') || {};
                    this.remind = {                       // 预结提醒开关
                        PrekontRemind: !this.$app.isNull(PrekontRemindSwitch.childDetailList) ? PrekontRemindSwitch.childDetailList[0].sv_detail_is_enable : false,
                        PrekontRemindTime: parseInt(!this.$app.isNull(PrekontRemindTime.childDetailList) ? PrekontRemindTime.childDetailList[0].sv_detail_value : 0),
                        PrekontMessage: !this.$app.isNull(PrekontMessage.childDetailList) ? PrekontMessage.childDetailList[0].sv_detail_is_enable : false,
                        PrekontVoice: !this.$app.isNull(PrekontVoice.childDetailList) ? PrekontVoice.childDetailList[0].sv_detail_is_enable : false,
                        PrekontTips: !this.$app.isNull(PrekontTips.childDetailList) ? PrekontTips.childDetailList[0].sv_detail_is_enable : false,
                        PrekontDelay: !this.$app.isNull(PrekontDelay.childDetailList) ? PrekontDelay.childDetailList[0].sv_detail_is_enable : false,
                    }

                    this.SettlementDelay = this.$app.isNull(res) ? { childInfolist: [] } : res.find(e => e.sv_user_module_code === 'SettlementDelay');
                    const SettlementDelaySwitch = this.SettlementDelay.childInfolist.find(e => e.sv_user_config_code === 'SettlementDelay') || {};
                    const SettlementDelayTime = this.SettlementDelay.childInfolist.find(e => e.sv_user_config_code === 'SettlementDelayTime') || {};
                    this.delay = {                       // 延时关灯开关
                        SettlementDelay: !this.$app.isNull(SettlementDelaySwitch.childDetailList) ? SettlementDelaySwitch.childDetailList[0].sv_detail_is_enable : false,
                        SettlementDelayTime: parseInt(!this.$app.isNull(SettlementDelayTime.childDetailList) ? SettlementDelayTime.childDetailList[0].sv_detail_value : 0),
                    }
                    this.AutoOpenTable = this.$app.isNull(res) ? { childInfolist: [] } : res.find(e => e.sv_user_module_code === 'AutoOpenTable');
                    const AutoOpenTableSwitchItem = this.AutoOpenTable.childInfolist.find(e => e.sv_user_config_code === 'AutoOpenTable') || {};
                    this.openTable.AutoOpenTable = !this.$app.isNull(AutoOpenTableSwitchItem.childDetailList) ? AutoOpenTableSwitchItem.childDetailList[0].sv_detail_is_enable : false;
                    this.BillablePause = this.$app.isNull(res) ? { childInfolist: [] } : res.find(e => e.sv_user_module_code === 'BillablePause');
                    const PauseCloseItem = this.BillablePause.childInfolist.find(e => e.sv_user_config_code === 'PauseClose') || {};
                    const PauseAccruedDurationItem = this.BillablePause.childInfolist.find(e => e.sv_user_config_code === 'PauseAccruedDuration') || {};
                    this.pauseInfo = {
                        PauseClose: !this.$app.isNull(PauseCloseItem.childDetailList) ? PauseCloseItem.childDetailList[0].sv_detail_is_enable : false,
                        PauseAccruedDuration: !this.$app.isNull(PauseAccruedDurationItem.childDetailList) ? PauseAccruedDurationItem.childDetailList[0].sv_detail_is_enable : false,
                    }
                }
            })
        },
        handleSaveModel() {                             // 保存收银模式
            let hasDetail = this.$app.isNull(this.CashierMode.childDetailList) ? false : true;
            let configData = [
                {
                    sv_detail_value: this.cashierType,
                    sv_user_config_id: this.CashierMode.sv_user_config_id,
                    sv_user_module_id: this.CashierMode.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? this.CashierMode.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: true,
                    sv_user_configdetail_name: '收银模式',
                    sv_remark: '收银模式'
                }
            ]
            stockApi.saveConfigdetailList('CashierMode', configData).then(res => {
                if (res) {
                    this.update({
                        key: 'cashierJurisdiction',
                        data: {
                            ...this.cashierJurisdiction,
                            cashierModel: this.cashierType
                        }
                    })
                    this.$message.success('修改成功');
                }
            })
        },
        handleChangeTipSwitch() {
            this.handlePageScrollUpdate();
        },
        handleChangeLightSwitch() {
            this.handlePageScrollUpdate();
        },
        handleConfigSave(commonData, pKey, itemKey) {                          // 保存提醒时间
            const childItem = this[commonData].childInfolist.find(e => e.sv_user_config_code === itemKey);
            let hasDetail = this.$app.isNull(childItem.childDetailList) ? false : true;
            const configData = [{
                sv_detail_value: typeof this[pKey][itemKey] === 'boolean' ? '' : (this[pKey][itemKey] + ''),
                sv_user_module_id: this[commonData].sv_user_module_id,
                sv_user_config_id: childItem.sv_user_config_id,
                sv_user_configdetail_id: hasDetail ? childItem.childDetailList[0].sv_user_configdetail_id : 0,
                sv_detail_is_enable: typeof this[pKey][itemKey] === 'boolean' ? this[pKey][itemKey] : true,
                sv_user_configdetail_name: childItem.sv_user_config_name,
                sv_remark: childItem.sv_remark
            }]
            stockApi.saveConfigdetailList(this[commonData].sv_user_module_code, configData).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            })
        },
    }
}
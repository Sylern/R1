import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            switchStatus: false,
            radioValue: false,
            /**
             * NotStoreStockCheck_Is_Zero 盘点库存清零
             * NotStoreStockCheck_Is_Opendisc 盘点（明盘/盲盘）
             * CargoFlowZeroStockOut_Switch 货流零库存出库
             * NotStoreStockCheck_Is_Tuneout 直调/要货商品设置
             */
            configData: ['StoreStockCheckManage','CargoFlowManage'],
            dataObj: {
                NotStoreStockCheck_Is_Zero: {
                    updateKey: 'StoreStockCheckManage',
                    data: {},
                    value: false
                },
                NotStoreStockCheck_Is_Opendisc: {
                    updateKey: 'StoreStockCheckManage',
                    data: {},
                    value: false
                },
                CargoFlowZeroStockOut_Switch: {
                    updateKey: 'CargoFlowManage',
                    data: {},
                    value: true
                },
                NotStoreStockCheck_Is_Tuneout: {
                    updateKey: 'CargoFlowManage',
                    data: {},
                    value: false
                },
            }
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['cashierJurisdiction'])
    },
    mounted() {
        this.getUserModuleConfigs();
    },
    methods: {
        ...mapMutations(['update']),
        handleRadio(key) {                                  // 修改保存
            let currData = this.dataObj[key].data;
            currData.sv_detail_is_enable = this.dataObj[key].value;
            let hasDetail = currData.childDetailList && currData.childDetailList.length;
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.dataObj[key].value,
                    sv_user_configdetail_name: hasDetail ? currData.childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childDetailList[0].sv_remark : ''
                }
            ]
            stockApi.saveConfigdetailList(this.dataObj[key].updateKey, configData).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            })
        },
        getUserModuleConfigs() {                            // 获取配置
            stockApi.getUserModuleConfigs(this.configData).then(res => {
                if (res) {
                    let NotStoreStockCheck_Is_Zero,
                        NotStoreStockCheck_Is_Opendisc,
                        CargoFlowZeroStockOut_Switch,
                        NotStoreStockCheck_Is_Tuneout;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'StoreStockCheckManage':
                                NotStoreStockCheck_Is_Zero = item.childInfolist.find(e => e.sv_user_config_code === 'NotStoreStockCheck_Is_Zero');
                                NotStoreStockCheck_Is_Opendisc = item.childInfolist.find(e => e.sv_user_config_code === 'NotStoreStockCheck_Is_Opendisc');
                                break;
                            case 'CargoFlowManage':
                                CargoFlowZeroStockOut_Switch = item.childInfolist.find(e => e.sv_user_config_code === 'CargoFlowZeroStockOut_Switch');
                                NotStoreStockCheck_Is_Tuneout = item.childInfolist.find(e => e.sv_user_config_code === 'NotStoreStockCheck_Is_Tuneout');
                                break;
                            default:
                                break;
                        }
                    });
                    if (!this.$app.isNull(NotStoreStockCheck_Is_Zero)) {
                        this.dataObj.NotStoreStockCheck_Is_Zero.data = NotStoreStockCheck_Is_Zero;
                        if (!this.$app.isNull(NotStoreStockCheck_Is_Zero.childDetailList)) {
                            this.dataObj.NotStoreStockCheck_Is_Zero.value = NotStoreStockCheck_Is_Zero.childDetailList[0].sv_detail_is_enable;
                        }
                    }
                    if (!this.$app.isNull(NotStoreStockCheck_Is_Opendisc)) {
                        this.dataObj.NotStoreStockCheck_Is_Opendisc.data = NotStoreStockCheck_Is_Opendisc;
                        if (!this.$app.isNull(NotStoreStockCheck_Is_Opendisc.childDetailList)) {
                            this.dataObj.NotStoreStockCheck_Is_Opendisc.value = NotStoreStockCheck_Is_Opendisc.childDetailList[0].sv_detail_is_enable;
                        }
                    }
                    if (!this.$app.isNull(CargoFlowZeroStockOut_Switch)) {
                        this.dataObj.CargoFlowZeroStockOut_Switch.data = CargoFlowZeroStockOut_Switch;
                        if (!this.$app.isNull(CargoFlowZeroStockOut_Switch.childDetailList)) {
                            this.dataObj.CargoFlowZeroStockOut_Switch.value = CargoFlowZeroStockOut_Switch.childDetailList[0].sv_detail_is_enable;
                        }
                    }
                    if (!this.$app.isNull(NotStoreStockCheck_Is_Tuneout)) {
                        this.dataObj.NotStoreStockCheck_Is_Tuneout.data = NotStoreStockCheck_Is_Tuneout;
                        if (!this.$app.isNull(NotStoreStockCheck_Is_Tuneout.childDetailList)) {
                            this.dataObj.NotStoreStockCheck_Is_Tuneout.value = NotStoreStockCheck_Is_Tuneout.childDetailList[0].sv_detail_is_enable;
                        }
                    }
                }
            })
        },
    }
}
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            /**
             * DouYinOpen 抖音配置
             */
            configData: ['DouYinOpen'],
            dataObj: {
                DouYinOpenAccountId: {
                    updateKey: 'DouYinOpen',
                    data: {},
                    value: ''
                },
                DouYinOpenPoiName: {
                    updateKey: 'DouYinOpen',
                    data: {},
                    value: ''
                },
                DouYinOpenPoiId: {
                    updateKey: 'DouYinOpen',
                    data: {},
                    value: ''
                },
            },
            hasBindedStore: false,
            currentStore: {},
            storeList: []
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
        handleConfigSave(key, _fn) {                                  // 修改保存
            let currData = this.dataObj[key].data;
            let hasDetail = currData.childDetailList && currData.childDetailList.length;
            let configData = [
                {
                    sv_detail_value: this.dataObj[key].value,
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.dataObj[key].sv_detail_is_enable,
                    sv_user_configdetail_name: hasDetail ? currData.childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childDetailList[0].sv_remark : ''
                }
            ]
            stockApi.saveConfigdetailList(this.dataObj[key].updateKey, configData).then(res => {
                if (res) {
                    !!_fn && _fn();
                }
            })
        },
        handleSaveAccountId(key) {
            this.handleConfigSave(key, () => {
                this.$message.success('保存成功');
                this.handleCancelSave(false);
                this.getQueryPoi();
            })
        },
        handleCancelSave(needTips) {                                    // 取消绑定门店
            this.dataObj.DouYinOpenPoiId.value = '';
            this.dataObj.DouYinOpenPoiName.value = '';
            this.storeList = [];
            this.currentStore = {};
            this.handleConfigSave('DouYinOpenPoiName');
            this.handleConfigSave('DouYinOpenPoiId', () => {
                this.hasBindedStore = false;
                if (needTips) this.$message.success('店铺取消绑定成功');
            });
        },
        handleSavePoi() {                                               // 绑定店铺- 店铺名称 店铺id
            if (this.$app.isNull(this.dataObj.DouYinOpenAccountId.value)) return this.$message.warning('请填写抖音商家id并保存');
            if (this.$app.isNull(this.currentStore.value)) return this.$message.warning('请选择抖音商家门店');
            this.dataObj.DouYinOpenPoiId.value = this.currentStore.value;
            this.dataObj.DouYinOpenPoiName.value = this.currentStore.label;
            this.handleConfigSave('DouYinOpenPoiName');
            this.handleConfigSave('DouYinOpenPoiId', () => {
                this.$message.success('店铺绑定成功');
            });
        },
        getUserModuleConfigs() {                                        // 获取配置
            stockApi.getUserModuleConfigs(this.configData).then(res => {
                if (res) {
                    let DouYinOpenAccountId, DouYinOpenPoiName, DouYinOpenPoiId;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'DouYinOpen':
                                DouYinOpenAccountId = item.childInfolist.find(e => e.sv_user_config_code === 'DouYinOpenAccountId');
                                DouYinOpenPoiName = item.childInfolist.find(e => e.sv_user_config_code === 'DouYinOpenPoiName');
                                DouYinOpenPoiId = item.childInfolist.find(e => e.sv_user_config_code === 'DouYinOpenPoiId');
                                break;
                            default:
                                break;
                        }
                    });
                    if (!this.$app.isNull(DouYinOpenAccountId)) {
                        this.dataObj.DouYinOpenAccountId.data = DouYinOpenAccountId;
                        if (!this.$app.isNull(DouYinOpenAccountId.childDetailList)) {
                            this.dataObj.DouYinOpenAccountId.value = DouYinOpenAccountId.childDetailList[0].sv_detail_value;
                        }
                    }
                    if (!this.$app.isNull(DouYinOpenPoiId)) {
                        this.dataObj.DouYinOpenPoiId.data = DouYinOpenPoiId;
                        if (!this.$app.isNull(DouYinOpenPoiId.childDetailList)) {
                            this.dataObj.DouYinOpenPoiId.value = DouYinOpenPoiId.childDetailList[0].sv_detail_value;
                        }
                    }
                    if (!this.$app.isNull(DouYinOpenPoiName)) {
                        this.dataObj.DouYinOpenPoiName.data = DouYinOpenPoiName;
                        if (!this.$app.isNull(DouYinOpenPoiName.childDetailList)) {
                            this.dataObj.DouYinOpenPoiName.value = DouYinOpenPoiName.childDetailList[0].sv_detail_value;
                        }
                    }

                    if (!this.$app.isNull(this.dataObj.DouYinOpenAccountId.value)) {
                        // 不为空表示已绑定抖音商家id
                        this.getQueryPoi();
                    }
                    if (!this.$app.isNull(this.dataObj.DouYinOpenPoiId.value)) {
                        this.hasBindedStore = true;
                        this.currentStore.value = this.dataObj.DouYinOpenPoiId.value;
                    }
                    if (!this.$app.isNull(this.dataObj.DouYinOpenPoiName.value)) {
                        this.currentStore.label = this.dataObj.DouYinOpenPoiName.value;
                    }
                }
            })
        },
        getQueryPoi() {                                                 // 查询抖音门店
            this.storeList = [];
            stockApi.getQueryPoi({ page: 1, size: 100 }).then(res => {
                if (res) {
                    this.storeList = (res.datas || []).map(e => {
                        return {
                            value: this.$app.isNull(e.poi) ? '' : e.poi.poi_id,
                            label: this.$app.isNull(e.poi) ? '' : e.poi.poi_name
                        }
                    })
                    if (this.$app.isNull(this.storeList)) {
                        this.$message.warning('未找到关联店铺')
                    }
                }
            })
        },
    }
}
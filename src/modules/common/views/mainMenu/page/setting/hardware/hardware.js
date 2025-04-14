import { stockApi } from '@/api/index';
import { goodsSetting, hotkeySetting, codeBalanceAdd } from '../../../../../components';
import { mapMutations, mapState } from 'vuex';
export default {
    components: { goodsSetting, hotkeySetting, codeBalanceAdd },
    name: 'hardware',
    data() {
        return {
            /**
             * WeighingStableAutomaticDetermine 称重稳定后是否自动确定
             * Set_Hareware_Scale 电子秤设置
             * Set_Hareware_Scale_Port 电子秤通讯端口
             * Set_Hareware_Scale_Baud 电子秤波特率
             * Set_Hareware_Scale_Type 电子秤类型
             * Set_Hareware_Scale_AutoRA 是否自动读称加入计重商品
             * Set_Hareware_Barcode 条码秤开关
            **/
            confingList: ['WeighingStableAutomaticDetermine', 'Set_Hareware_Scale'],
            IC: {
                switch: true,
                port: [
                    {
                        id: '001',
                        name: 'COM1'
                    }
                ],
                cardType: [
                    {
                        id: '001',
                        name: '接触式IC卡（442芯片）-URD'
                    }
                ],
                password: ''
            },
            scaleSwitch: false,
            pricingScale: {
                WeighingStableAutomaticDetermine: {     // 称重稳定后是否自动确定
                    sv_user_configdetail_id: 0,
                    sv_detail_value: '',
                    sv_user_config_id: 0,
                    sv_user_module_id: 0,
                    sv_detail_is_enable: false,
                    sv_user_configdetail_name: '称重稳定后是否自动确定',
                    sv_remark: '称重稳定后是否自动确定'
                },
                Set_Hareware_Scale_AutoRA: {            // 是否自动读称加入计重商品
                    sv_user_configdetail_id: 0,
                    sv_detail_value: '',
                    sv_user_config_id: 0,
                    sv_user_module_id: 0,
                    sv_detail_is_enable: false,
                    sv_user_configdetail_name: '是否自动读称加入计重商品',
                    sv_remark: '是否自动读称加入计重商品'
                },
                Set_Hareware_Scale_Type: {},            // 电子秤类型配置数据
                Set_Hareware_Scale_Port: {},            // 端口号配置数据
                Set_Hareware_Scale_Baud: {},            // 波特率配置数据
                Set_Hareware_Barcode: {                 // 电子秤开关
                    enable: false
                },
                model: [                                // 电子秤类型
                    {
                        value: '0',
                        label: '顶尖'
                    },
                    {
                        value: '1',
                        label: '大华ACS-15A-b'
                    }
                ],
                port: [],                               // 端口号
                baudRate: [                             // 波特率
                    {
                        value: '9600',
                        label: '9600'
                    }
                ]
            },
            codeBalanceList: [],                        // 条码秤列表
            goodsSettingStatus: false,                  // 已下秤商品弹窗状态
            hotkeySettingStatus: false,                 // 热键设置弹窗状态
            codeBalanceAddStatus: false,                // 新增-编辑条码秤弹窗状态
            balanceEdit: false,                         // 是否编辑条码秤
            currentBalance: {},                         // 当前选择的条码秤
            submitData: {
                ic: {
                    port: '',
                    cardType: '',
                    password: ''
                },
                pricingScale: {
                    model: '',
                    port: '',
                    baudRate: '9600',
                    weigh: ''
                }
            }
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['isCefClient', 'isOnAndroid', 'user_local_data'])
    },
    mounted() {
        this.getUserModuleConfigs();
        this.getScaleConfigList();
    },
    methods: {
        ...mapMutations(['updateUserLocalData']),
        handlepricingScaleSwitch() {
            stockApi.linkageConfigSwitch(this.pricingScale.Set_Hareware_Barcode).then(res => {
                this.updateUserLocalData({
                    ...this.user_local_data,
                    scaleSwitch: this.pricingScale.Set_Hareware_Barcode.enable
                });
                if (this.pricingScale.Set_Hareware_Barcode.enable) {
                    this.$root.$emit('handleHareware_Scale');
                } else {
                    this.$root.$emit('stopHareware_Scale');
                }
            });

            // this.$message.success(this.scaleSwitch ? '成功启用' : '已关闭');
        },
        handleScaleTest() {                                 // 计价秤点击测试
            if (!this.isCefClient) {
                return this.$message.warning('请使用客户端连接测试');
            }
            if (this.$app.isNull(this.submitData.pricingScale.port)) {
                return this.$message.warning('请选择通讯端口');
            }
            let demo_weight;
            let pricingScaleTimer = setInterval(async () => {
                try {
                    if (this.submitData.pricingScale.model == 1) {
                        //大华电子秤
                        if (this.$app.isNull(this.submitData.pricingScale.port)) {
                            clearInterval(pricingScaleTimer);
                            return this.$message.error('获取通讯端口失败');
                        }
                        demo_weight = await Cef.DHGetWeight(this.submitData.pricingScale.port.label, parseInt(this.submitData.pricingScale.baudRate));
                        if (demo_weight) {
                            //大华电子秤
                            var weightModel = demo_weight;
                            if (weightModel) {
                                weightModel = weightModel.trim();
                                var weightModelLines = weightModel.split(' ');
                                if (weightModelLines && weightModelLines.length > 0) {
                                    for (var i = 0; i < 1; i++) {
                                        var weightData = parseInt(weightModelLines[i]) / 1000;
                                        if (weightData > 0) {
                                            this.submitData.pricingScale.weigh = weightData;
                                        }

                                        if (!this.$app.verifyNumber(weightData)) {
                                            clearInterval(pricingScaleTimer);
                                            this.$message.error("大华电子秤：read=" + demo_weight);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        //顶尖电子秤
                        demo_weight = await Cef.GetWeight(this.submitData.pricingScale.port.label, parseInt(this.submitData.pricingScale.baudRate));
                        if (demo_weight) {
                            //顶尖电子秤
                            var weightModel = JSON.parse(demo_weight);
                            this.submitData.pricingScale.weigh = weightModel.Weight;
                            if (!this.$app.verifyNumber(weightModel.Weight)) {
                                clearInterval(pricingScaleTimer);
                                this.$message.error("顶尖电子秤：read=" + demo_weight);
                            }
                        }
                    }

                } catch (e) {
                    clearInterval(pricingScaleTimer);
                    this.$message.error(e.message + ',' + demo_weight);
                }
            }, 500);
        },
        async getUserModuleConfigs() {                            // 获取配置
            if (this.isCefClient) {
                this.pricingScale.port = JSON.parse(await Cef.GetComList()).map(e => {
                    return {
                        value: e,
                        label: e
                    }
                });
            }
            stockApi.getUserModuleConfigs(this.confingList).then(res => {
                if (res) {
                    let WeighingStableAutomaticDetermine,
                        Set_Hareware_Scale_Port,
                        Set_Hareware_Scale_Baud,
                        Set_Hareware_Scale_Type,
                        Set_Hareware_Scale_AutoRA,
                        Set_Hareware_Barcode;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'WeighingStableAutomaticDetermine':
                                WeighingStableAutomaticDetermine = item.childInfolist[0];
                                break;
                            case 'Set_Hareware_Scale':
                                let Set_Hareware_Scale = item;
                                Set_Hareware_Scale_Type = Set_Hareware_Scale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Type');
                                Set_Hareware_Scale_Port = Set_Hareware_Scale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Port');
                                Set_Hareware_Scale_Baud = Set_Hareware_Scale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Baud');
                                Set_Hareware_Scale_AutoRA = Set_Hareware_Scale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_AutoRA');
                                Set_Hareware_Barcode = Set_Hareware_Scale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Barcode');
                                break;
                            default:
                                break;
                        }
                    });
                    let hasWeighingSDetail = !this.$app.isNull(WeighingStableAutomaticDetermine.childDetailList);
                    this.pricingScale.WeighingStableAutomaticDetermine = {
                        sv_user_config_code: 'succession',
                        sv_user_configdetail_id: hasWeighingSDetail ? WeighingStableAutomaticDetermine.childDetailList[0].sv_user_configdetail_id : 0,
                        sv_detail_value: '',
                        sv_user_config_id: WeighingStableAutomaticDetermine.sv_user_config_id,
                        sv_user_module_id: WeighingStableAutomaticDetermine.sv_user_module_id,
                        sv_detail_is_enable: hasWeighingSDetail ? WeighingStableAutomaticDetermine.childDetailList[0].sv_detail_is_enable : false,
                        sv_user_configdetail_name: '称重稳定后是否自动确定',
                        sv_remark: '称重稳定后是否自动确定'
                    }

                    let hasScaleDetail = !this.$app.isNull(Set_Hareware_Scale_AutoRA.childDetailList);
                    this.pricingScale.Set_Hareware_Scale_AutoRA = {
                        sv_user_config_code: 'Set_Hareware_Scale_AutoRA',
                        sv_user_configdetail_id: hasScaleDetail ? Set_Hareware_Scale_AutoRA.childDetailList[0].sv_user_configdetail_id : 0,
                        sv_detail_value: '',
                        sv_user_config_id: Set_Hareware_Scale_AutoRA.sv_user_config_id,
                        sv_user_module_id: Set_Hareware_Scale_AutoRA.sv_user_module_id,
                        sv_detail_is_enable: hasScaleDetail ? Set_Hareware_Scale_AutoRA.childDetailList[0].sv_detail_is_enable : false,
                        sv_user_configdetail_name: '称重稳定后是否自动确定',
                        sv_remark: '称重稳定后是否自动确定'
                    }
                    let Set_Hareware_Scale_Type_id = this.$app.isNull(Set_Hareware_Scale_Type.childDetailList) ? 0 : (Set_Hareware_Scale_Type.childDetailList.length > 0 ? Set_Hareware_Scale_Port.childDetailList[0].sv_user_configdetail_id : 0);
                    this.pricingScale.Set_Hareware_Scale_Type = {
                        sv_config_is_enable: true,
                        sv_remark: '电子秤类型',
                        sv_user_config_id: Set_Hareware_Scale_Type.sv_user_config_id,
                        sv_user_module_id: Set_Hareware_Scale_Type.sv_user_module_id,
                        sv_user_configdetail_id: Set_Hareware_Scale_Type_id,
                        sv_detail_is_enable: true
                    };
                    let Set_Hareware_Scale_Port_id = this.$app.isNull(Set_Hareware_Scale_Port.childDetailList) ? 0 : (Set_Hareware_Scale_Port.childDetailList.length > 0 ? Set_Hareware_Scale_Port.childDetailList[0].sv_user_configdetail_id : 0);
                    this.pricingScale.Set_Hareware_Scale_Port = {
                        sv_config_is_enable: true,
                        sv_remark: '电子秤通讯端口',
                        sv_user_config_id: Set_Hareware_Scale_Port.sv_user_config_id,
                        sv_user_module_id: Set_Hareware_Scale_Port.sv_user_module_id,
                        sv_user_configdetail_id: Set_Hareware_Scale_Port_id,
                        sv_detail_is_enable: true
                    };
                    let Set_Hareware_Scale_Baud_id = this.$app.isNull(Set_Hareware_Scale_Baud.childDetailList) ? 0 : (Set_Hareware_Scale_Baud.childDetailList.length > 0 ? Set_Hareware_Scale_Baud.childDetailList[0].sv_user_configdetail_id : 0);
                    this.pricingScale.Set_Hareware_Scale_Baud = {
                        sv_config_is_enable: true,
                        sv_remark: '电子秤波特率',
                        sv_user_config_id: Set_Hareware_Scale_Baud.sv_user_config_id,
                        sv_user_module_id: Set_Hareware_Scale_Baud.sv_user_module_id,
                        sv_user_configdetail_id: Set_Hareware_Scale_Baud_id,
                        sv_detail_is_enable: true
                    };
                    this.submitData.pricingScale.model = this.$app.isNull(Set_Hareware_Scale_Type.childDetailList) ? '0' : Set_Hareware_Scale_Type.childDetailList[0].sv_detail_value;

                    let hasHarewareBarcodeDetail = !this.$app.isNull(Set_Hareware_Barcode.childDetailList);
                    this.pricingScale.Set_Hareware_Barcode = {
                        code: 'Set_Hareware_Scale',
                        enable: hasHarewareBarcodeDetail ? Set_Hareware_Barcode.childDetailList[0].sv_detail_is_enable : false,
                        operate_module: 'Set_Hareware_Barcode',
                    };
                    this.updateUserLocalData({
                        ...this.user_local_data,
                        scaleSwitch: this.pricingScale.Set_Hareware_Barcode.enable
                    });
                    if (this.isCefClient) {
                        this.submitData.pricingScale.port = this.$app.isNull(Set_Hareware_Scale_Port.childDetailList) ? '' : {
                            value: Set_Hareware_Scale_Port.childDetailList[0].sv_detail_value,
                            label: Set_Hareware_Scale_Port.childDetailList[0].sv_detail_value
                        };
                    }
                    // this.pricingScale.port = this.$app.isNull(Set_Hareware_Scale_Port.childDetailList) ? [] : Set_Hareware_Scale_Port.childDetailList[0].map(e => {
                    //     return {
                    //         label: e.sv_detail_value,
                    //         value: e.sv_user_configdetail_id
                    //     }
                    // });
                    // this.pricingScale.baudRate = this.$app.isNull(Set_Hareware_Scale_Baud.childDetailList) ? [] : Set_Hareware_Scale_Baud.childDetailList[0].map(e => {
                    //     return {
                    //         label: e.sv_detail_value,
                    //         value: e.sv_user_configdetail_id
                    //     }
                    // });
                }
            })
        },
        savePricingScale() {
            console.log(this.submitData.pricingScale.port);
            if (this.$app.isNull(this.submitData.pricingScale.port)) {
                return this.$message.warning('未选择通讯端口');
            }
            let configDataList = [
                {
                    ...this.pricingScale.Set_Hareware_Scale_Type,
                    sv_detail_value: this.submitData.pricingScale.model || null,
                },
                {
                    ...this.pricingScale.Set_Hareware_Scale_Port,
                    sv_detail_value: this.submitData.pricingScale.port.label || null,
                },
                {
                    ...this.pricingScale.Set_Hareware_Scale_Baud,
                    sv_detail_value: this.submitData.pricingScale.baudRate || null,
                }
            ];
            stockApi.saveConfigdetailList('Set_Hareware_Scale', configDataList).then(res => {
                if (res) {
                    this.$message.success('保存成功');
                } else {
                    this.$message.error('保存失败');
                }
            })
        },
        saveConfigdetailList(configData) {                  // 修改调用
            stockApi.saveConfigdetailList(configData.sv_user_config_code, [configData]).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                }
            })
        },
        editSuccessBack(isEdit) {                           // 条码秤弹窗成功回调
            this.$message.success(isEdit ? '修改成功' : '新增成功');
            this.getScaleConfigList();
        },
        showGoodsSetting(e) {                               // 打开已下秤商品
            this.currentBalance = e;
            this.goodsSettingStatus = true;
        },
        showHotkeySetting(e) {                              // 打开热键设置
            this.currentBalance = e;
            this.hotkeySettingStatus = true;
        },
        addBalance() {                                      // 添加条码秤
            this.currentBalance = {};
            this.balanceEdit = false;
            this.codeBalanceAddStatus = true;
        },
        editBalance(e) {                                    // 编辑条码秤
            this.currentBalance = e;
            this.balanceEdit = true;
            this.codeBalanceAddStatus = true;
        },
        deleteBalance(e) {                                  // 删除条码秤
            this.$confirm('此操作将删除该条码秤配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stockApi.delScaleConfig({ sv_scale_id: e.sv_scale_id }).then(res => {
                    this.$message.success('删除成功');
                    this.getScaleConfigList();
                });
            }).catch(() => {

            });
        },
        getScaleConfigList() {                              // 获取条码秤列表
            stockApi.getScaleConfigList().then(res => {
                if (res) {
                    this.codeBalanceList = res.list;
                }
            });
        },
        goodsSettingSuccess() {
            // this.goodsSettingStatus = false;
            this.getScaleConfigList();
        }
    }
}
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            switchStatus: false,
            radioValue: false,
            /**
             * Cash_Allow_Without_Discount 订单低于最低折扣是否允许结算
             * PromotionSaleProduct 促销商品总开关
             * Trade_price_Calculate_integral 批发价是否计算积分
             */
            confingList: ['ReceptionCashierSet', 'PromotionSaleProduct'],
            configData: {},
            dataObj: {
                Cash_Allow_Without_Discount: {
                    enable: true
                },
                PromotionSaleProduct: {
                    enable: true
                },
                Trade_price_Calculate_integral: {
                    enable: true
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
        this.getUserFreeZero();
        this.getUserModuleConfigs();
    },
    methods: {
        ...mapMutations(['update']),
        getUserFreeZero() {                             // 获取freeZero配置
            this.switchStatus = this.cashierJurisdiction.freeZeroSwitch;
            this.radioValue = this.cashierJurisdiction.freeZero;
        },
        handleSwitch() {                                // 抹零开关
            let query = {
                name: 'sv_uc_saletozeroset',
                key: 'whether',
                valu: this.switchStatus
            }
            stockApi.updateUserConfigInfo(query).then(res => {
                if (res) {
                    let storeDataObj = {
                        ...this.cashierJurisdiction,
                        freeZeroSwitch: this.switchStatus
                    };
                    this.update({
                        key: 'cashierJurisdiction',
                        data: storeDataObj
                    });
                    this.$message.success('修改成功');
                }
            })
        },
        handleRadio() {                                 // 修改抹零设置
            let query = {
                name: 'sv_uc_saletozeroset',
                key: 'auto',
                valu: this.radioValue
            }
            stockApi.updateUserConfigInfo(query).then(res => {
                if (res) {
                    let storeDataObj = {
                        ...this.cashierJurisdiction,
                        freeZero: this.radioValue
                    };
                    this.update({
                        key: 'cashierJurisdiction',
                        data: storeDataObj
                    });
                    this.$message.success('修改成功');
                }
            })
        },
        getUserModuleConfigs() {                        // 获取配置
            stockApi.getUserModuleConfigs(this.confingList).then(res => {
                if (res) {
                    this.configData = res;
                    let Cash_Allow_Without_Discount,
                        PromotionSaleProduct,
                        Trade_price_Calculate_integral;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'ReceptionCashierSet':
                                Cash_Allow_Without_Discount = item.childInfolist.find(e => e.sv_user_config_code === 'Cash_Allow_Without_Discount');
                                Trade_price_Calculate_integral = item.childInfolist.find(e => e.sv_user_config_code === 'Trade_price_Calculate_integral');
                                break;
                            case 'PromotionSaleProduct':
                                PromotionSaleProduct = item;
                                break;
                            default:
                                break;
                        }
                    });
                    this.configData = {
                        Cash_Allow_Without_Discount,
                        PromotionSaleProduct,
                        Trade_price_Calculate_integral
                    }
                    /**
                     * Cash_Allow_Without_Discount 订单低于最低折扣是否允许结算
                     * PromotionSaleProduct 促销商品总开关
                     * Trade_price_Calculate_integral 批发价是否计算积分
                    **/
                    let cashHasDetail = this.$app.isNull(Cash_Allow_Without_Discount.childDetailList) ? false : true;
                    this.dataObj.Cash_Allow_Without_Discount.enable = cashHasDetail ? this.configData.Cash_Allow_Without_Discount.childDetailList[0].sv_detail_is_enable : true;

                    let returnHasDetail = this.$app.isNull(PromotionSaleProduct.childInfolist) ? false : true;
                    if (returnHasDetail) {
                        if (!this.$app.isNull(PromotionSaleProduct.childInfolist[0].childDetailList)) {
                            this.dataObj.PromotionSaleProduct.enable = PromotionSaleProduct.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                        }
                    }

                    let tradeHasDetail = this.$app.isNull(this.configData.Trade_price_Calculate_integral.childDetailList) ? false : true;
                    this.dataObj.Trade_price_Calculate_integral.enable = tradeHasDetail ? this.configData.Trade_price_Calculate_integral.childDetailList[0].sv_detail_is_enable : true;
                }
            })
        },
        switchControl(_key) {
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
            this.saveConfigdetailList(_key, configData);
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
                    this.$message.success('修改成功');
                }
            })
        }
    }
}
import { mapMutations, mapState } from "vuex";
import { stockApi } from "@/api/index.js";
export default {
    name: 'imgModel',
    data() {
        return {
            imgType: '0',         // 1 大图 0 小图 2无图
            Set_Not_Image_sell: {}
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['user_local_data']),
    },
    beforeMount() {
        // this.imgType = this.user_local_data.goodsListShowType;
        this.getUserModuleConfig();
    },
    methods: {
        ...mapMutations(['updateUserLocalData']),
        handelTyoe(type) {
            this.imgType = type;
        },
        // handleSave() {
        //     this.updateUserLocalData({
        //         ...this.user_local_data,
        //         goodsListShowType: this.imgType
        //     });
        //     this.$message.success('修改成功');
        // },
        getUserModuleConfig() {                        // 获取配置
            stockApi.getUserModuleConfig({ moduleCode: 'ReceptionCashierSet' }).then(res => {
                if (res) {
                    let ReceptionCashierSet = this.$app.isNull(res) ? [] : res.find(e => e.sv_user_module_code === 'ReceptionCashierSet');
                    this.Set_Not_Image_sell = this.$app.isNull(ReceptionCashierSet) ? {} : ReceptionCashierSet.childInfolist.find(e => e.sv_user_config_code === 'Set_Not_Image_sell');
                    let Set_Not_Image_sell_hasDetail = this.$app.isNull(this.Set_Not_Image_sell.childDetailList) ? false : true;
                    this.imgType = Set_Not_Image_sell_hasDetail ? (this.Set_Not_Image_sell.childDetailList[0].sv_detail_is_enable ? '2' : this.Set_Not_Image_sell.childDetailList[0].sv_detail_value) : '0';
                }
            })
        },
        handleSave() {                                // 保存调用
            let hasDetail = this.$app.isNull(this.Set_Not_Image_sell.childDetailList) ? false : true;
            let configData = [
                {
                    sv_detail_value: this.imgType === '2' ? '0' : this.imgType,
                    sv_user_config_id: this.Set_Not_Image_sell.sv_user_config_id,
                    sv_user_module_id: this.Set_Not_Image_sell.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? this.Set_Not_Image_sell.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.imgType === '2' ? true : false,
                    sv_user_configdetail_name: '是否启用无图销售',
                    sv_remark: '是否启用无图销售'
                }
            ]
            stockApi.saveConfigdetailList('Set_Not_Image_sell', configData).then(res => {
                if (res) {
                    this.updateUserLocalData({
                        ...this.user_local_data,
                        goodsListShowType: this.imgType
                    });
                    this.$message.success('修改成功');
                }
            })
        }
    }
}
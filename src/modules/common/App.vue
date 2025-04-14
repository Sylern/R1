<template>
    <div id="app" class="cashier default_page">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
    </div>
</template>

<style lang="scss">
html,
body,
#app {
    height: 100%;
}

body {
    margin: 0;
    background: #fff;
    font-size: 14px !important;
}

.bodyScrollbar /deep/ .el-message-box__wrapper {
    z-index: 100000000 !important;
}
</style>
<script>
import { mapMutations, mapState } from "vuex";
import { stockApi } from "@/api/index.js";
export default {
    components: {  },
    data() {
        return {
            keyEventCodeList: [112, 113, 114, 115, 117, 118, 119, 120, 121, 122]            // Backspace(8)  F1-F11(F5 116保留)  
        };
    },
    computed: {
        ...mapState(['memberInfo']),
        scaleSwitch() {
            return this.user_local_data.scaleSwitch
        }
    },
    created() {
        this.preventKeyEvent();
        this.decodeJurisdiction();                  // 解析用户权限
        const icoUrl = this.$app.isOEM() ? './agent.ico' : './decerp.ico';
        document.querySelector('link[rel*="icon"]').href = icoUrl;
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'decodeJurisdiction']),
        handleShowFeedback() {
            this.isShowFeedback = true;
        },
        preventKeyEvent() {                         // 阻止浏览器部分按键事件
            document.onkeydown = (e) => {
                var evt = window.event || e;
                var code = evt.keyCode || evt.which;
                if (this.keyEventCodeList.find(e => e == code)) {
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        evt.keyCode = 0;
                        evt.returnValue = false
                    }
                }
            }
        },

        getUserModuleConfigs() {                                    // 获取配置
            if (!this.isCefClient) return;
            stockApi.getUserModuleConfigs(['Set_Hareware_Scale', 'CashierVoice', 'OnlineOrderVoice']).then(res => {
                if (res) {
                    let dataPriceScale = res.find(e => e.sv_user_module_code === 'Set_Hareware_Scale');
                    let Set_Hareware_Scale_Type = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Type');
                    let Set_Hareware_Scale_Port = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Port');
                    let Set_Hareware_Scale_Baud = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Scale_Baud');
                    let Set_Hareware_Barcode = dataPriceScale.childInfolist.find(e => e.sv_user_config_code === 'Set_Hareware_Barcode');

                    let hasHarewareBarcodeDetail = !this.$app.isNull(Set_Hareware_Barcode.childDetailList);


                    this.updateUserLocalData({
                        ...this.user_local_data,
                        scaleSwitch: hasHarewareBarcodeDetail ? Set_Hareware_Barcode.childDetailList[0].sv_detail_is_enable : false
                    });

                    let CashierVoice = res.find(e => e.sv_user_module_code === 'CashierVoice');
                    let OnlineOrderVoice = res.find(e => e.sv_user_module_code === 'OnlineOrderVoice');

                    let storeDataObj = { ...this.cashierJurisdiction };

                    let CashierVoiceHasDetail = this.$app.isNull(CashierVoice.childInfolist[0].childDetailList) ? false : true;
                    storeDataObj.CashierVoiceEnable = CashierVoiceHasDetail ? CashierVoice.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;
                    let OnlineOrderVoiceHasDetail = this.$app.isNull(OnlineOrderVoice.childInfolist[0].childDetailList) ? false : true;
                    storeDataObj.OnlineOrderVoiceEnable = OnlineOrderVoiceHasDetail ? OnlineOrderVoice.childInfolist[0].childDetailList[0].sv_detail_is_enable : true;

                    this.update({
                        key: 'cashierJurisdiction',
                        data: storeDataObj
                    });

                    this.priceScaleData = {
                        scale_Type: this.$app.isNull(Set_Hareware_Scale_Type.childDetailList) ? '' : Set_Hareware_Scale_Type.childDetailList[0].sv_detail_value,
                        scale_Port: this.$app.isNull(Set_Hareware_Scale_Port.childDetailList) ? '' : Set_Hareware_Scale_Port.childDetailList[0].sv_detail_value,
                        scale_Baud: this.$app.isNull(Set_Hareware_Scale_Baud.childDetailList) ? '' : Set_Hareware_Scale_Baud.childDetailList[0].sv_detail_value
                    }
                    if (!this.scaleSwitch) return
                    if (!this.$app.isNull(this.priceScaleData.scale_Type) && !this.$app.isNull(this.priceScaleData.scale_Port) && !this.$app.isNull(this.priceScaleData.scale_Baud)) {
                        this.priceScaleStart();
                    }
                }
            })
        },
        //#endregion
    },
};
</script>
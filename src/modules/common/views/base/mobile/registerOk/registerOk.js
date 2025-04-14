import base from '@/api/base';
export default {
    data() {
        return {
            objJson: {
                name: '',                       // oem-德客
                url: '',                        // oem-德客的下载地址
                img: '',                        // oem-德客的log图片地址
                account: '',                    // 注册的账户
            }
        }
    },
    mounted() {
        let isType = this.$route.query.type;                // deke - 德客  oem - oem
        let account = this.$route.query.account;            // 账户
        if (isType === 'deke') {
            this.objJson = { name: '德客移动收银', url: base.basicRegisterDeke, img: base.frontImgBase + '/images/applets/deke@2x.png', account };
        }
        if (isType === 'oem') {
            this.objJson = { name: '门店移动收银', url: base.basicRegisterOem, img: base.frontImgBase + '/images/applets/logoome@2x.png', account };
        }
    },
    methods: {
        handleDownload() {                                 // 跳转到下载页面
            window.location.href = this.objJson.url;
        },
    }
}

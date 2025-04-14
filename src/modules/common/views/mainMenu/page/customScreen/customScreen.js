import customConfig from '@/utils/config/customConfig.js';
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
export default {
    components: {},
    name: 'customScreen',
    data() {
        return {
            hasSetting: false,
            imgBase: base.imgUrl,
            videoBase: base.videoUrl,
            type: 0,
            userInfo: {},
            carttingData: {                                 // 展示的下单数据
                buyNumber: 0,
                couponMoney: null,
                orderChangeMoney: null,
                lastOrderCouponMoney: null,
                dealMoney: 0,
                dealNumber: 0,
                orderPromotions: [],
                givePromotions: [],
                orderCoupons: [],
                productResults: []
            },
            imgTimer: null,
            imgPos: 0,
            imgList: [],
            videoPos: 0,
            videoList: []
        }
    },
    computed: {
        vidoeSrc() {
            return this.videoList.length > 0 ? (this.videoBase + this.videoList[this.videoPos]) : ''
        },
        customBg() {
            let value = 'cashier/custom.png';
            for (const item in customConfig.customScreenImg) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.customScreenImg[item]
                }
            }
            return this.$app.isNull(value) ? '' : value
        },
    },
    watch: {

    },
    mounted() {
        this.getCustomerDisplay();
        const carttingChannel = new BroadcastChannel('cartting');
        carttingChannel.onmessage = (e) => {
            if (e.data) this.carttingData = e.data;
            if (!this.hasSetting) this.getCustomerDisplay();
        }
        const refreshChannel = new BroadcastChannel('refresh');
        refreshChannel.onmessage = (e) => {
            this.getCustomerDisplay();
        }
    },
    beforeDestroy() {
        this.clearImgTimer();
    },
    methods: {
        listenKeyup(e) {
            let code = e.keyCode;
            this.$root.$emit('keyCode', code);
        },
        getCustomerDisplay() {
            if (!this.$app.getLocalStorage('token')) return;
            this.userInfo = this.$app.getLocalStorage('user_Info');
            stockApi.getCustomerDisplay({ sv_displayed: 100 }).then(res => {
                this.hasSetting = true;
                if (this.$app.isNull(res)) return this.$message.warning('请在设置-客显分配设置打开分屏设置')
                if (!res.sv_enable) return this.$message.warning('请在设置-客显分配设置打开分屏设置')
                this.clearImgTimer();
                this.type = res.sv_type;
                this.imgList = res.sv_img_url;
                this.videoList = res.sv_video_url;
                if (this.type === 3 || this.type === 4) {
                    this.startImgSwiper();
                }
                if (this.type === 5 || this.type === 6) {
                    this.startVideo();
                }
            })
        },
        clearImgTimer() {
            clearInterval(this.imgTimer);
            this.imgTimer = null;
        },
        startImgSwiper() {
            this.imgTimer = setInterval(() => {
                this.imgPos++;
                if (this.imgPos === this.imgList.length) this.imgPos = 0;
            }, 5000)
        },
        startVideo() {
            if (this.videoList.length < 1) return
            if (this.type === 5) {
                this.$nextTick(() => {
                    document.getElementById('pageVideo1').play();
                    // this.$refs.pageVideo1.play();
                })
                return
            }
            if (this.type === 6) {
                this.$nextTick(() => {
                    document.getElementById('pageVideo2').play();
                    // this.$refs.pageVideo1.play();
                })
                return
            }
        },
        playEnd() {
            this.videoPos++;
            if (this.videoPos === this.videoList.length) this.videoPos = 0;
            if (this.type === 5) {
                this.$nextTick(() => {
                    document.getElementById('pageVideo1').play();
                })
                return
            }
            if (this.type === 6) {
                this.$nextTick(() => {
                    document.getElementById('pageVideo2').play();
                })
                return
            }
        },
    }
};
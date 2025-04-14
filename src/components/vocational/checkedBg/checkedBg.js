
import ImportImg from '@/components/common/ImportImg/ImportImg.vue'
import base from '@/api/base';
export default {
    components: { ImportImg },
    props: {
        show: { type: Boolean, default: false },
        title: { type: String, default: "" },
        //地址一定要在res.decerp.cc
        defaultImgs: {
            type: Array, default: () =>
                [
                    ...new Array(27).fill("/images/promotion/wechat/wx_card_bg").map((item, index) => { return `${item}${index + 15}.png` }),
                    ...new Array(14).fill("/images/promotion/wechat/wx_card_bg").map((item, index) => { return `${item}${index + 1}.png` })
                ]
        },
        currentBg: { type: String, defalut: "" },
        verifyJson: { type: String, defalut: { fileNumber: 1, photoExt: ['.jpg', '.png', '.jpeg'], fileSize: 1024 * 2, viewElement: 'manual' } } //自定义图片大小，格式限制
    },
    data() {
        return {
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Product', isCompress: true } },
            customImg: { isDef: false, val: "" },
            selectBg: "",

        }
    },
    computed: {
        defaultImgVal() {
            const { defaultImgs, customImg } = this
            return [customImg, ...defaultImgs.map(img => {
                return { isDef: true, val: this.replaceHost(img) }
            })]
        }
    },
    watch: {
        currentBg: {
            handler(value) {
                const val = this.replaceHost(value || "")
                this.selectBg = val
                if (val && !this.defaultImgs.find(img => img === val)) {
                    this.customImg = { isDef: false, val }
                }
            },
            immediate: true
        }
    },

    methods: {
        replaceHost(str) {
            return str.replace(/(.+decerp.cc)(.+)/, ($, $1, $2) => $2)
        },
        uploadBgHandle([bg]) {
            const val = this.replaceHost(bg || "")
            this.customImg = { isDef: false, val }
            this.selectBg = val
        },
        confirmBgHandle() {
            const { selectBg } = this
            this.$emit("confirm", { file: selectBg, fullFile: `${selectBg ? `${base.imgUrl}${selectBg}` : ''}` })
        },
        currentBgHandle({ val, isDef }) {
            const { selectBg } = this
            if (selectBg === val) { return }
            if (isDef || (!isDef && val)) { this.selectBg = val }
        }
    }
}
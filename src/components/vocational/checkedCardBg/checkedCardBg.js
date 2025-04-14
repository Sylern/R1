import { stockApi } from '@/api/index';
import base from '@/api/base';
import ImportImg from '../../common/ImportImg/ImportImg.vue';
export default {
    components: { ImportImg },
    props: {
        visible: { type: Boolean, default: true },
        title: { type: String, default: '选择会员卡背景图' }
    },
    data() {
        return {
            imgList: [],                                // 会员卡背景图集合
            typeEntity: {},                             // 上传图片类型
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    mounted() {
        this.typeEntity = { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Product', isCompress: true } };
        this.getCardPicList();
    },
    methods: {
        closeDialog() {                                 // 关闭弹窗
            this.dialogVisible = 'close';
        },
        getCardPicList() {                              // 会员卡背景图片
            stockApi.GetCardPicList().then(res => {
                this.imgList = this.$app.isNull(res) ? [] : res;
                this.$nextTick(() => { !this.$app.isNull(this.$refs.checkedCardBg_m_scrollbar) && this.$refs.checkedCardBg_m_scrollbar.update(); })
            })
        },
        handleActiveImg(url) {                          // 选择会员卡背景 - 上传背景
            this.dialogVisible = false;
            url = this.$app.fmtImg(url)
            this.$emit('callback', url);
        },
    }
}
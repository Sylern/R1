import { stockApi } from "@/api/index.js";
import ImportImg from '@/components/common/ImportImg/ImportImg.vue';
import base from '@/api/base';
export default {
    name: 'screenCustom',
    components: { ImportImg },
    data() {
        return {
            imgBase: base.imgUrl,
            videoBase: base.videoUrl,
            refreshChannel: null,
            custom: {
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
            submitData: {
                sv_enable: false,
                sv_id: '',
                sv_displayed_by: 100,
                sv_type: 0,
                sv_video_url: [],
                sv_img_url: [],
                ic:{}
            },

            imgList: [],
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'screenCustom', isCompress: false } },
            imgVerifyJson: { fileNumber: 5, photoExt: ['.jpg', '.png'], fileSize: 2000, viewElement: 'click' },       // 上传图片组件的验证条件

            videoList: [],
            videoTypeEntity: { type: 'CommonVideo', data: { userId: this.$store.state.userInfo.user_id, isCompress: false } },
            videoVerifyJson: { fileNumber: 3, photoExt: ['.mp4', '.avi', '.mov', '.rmvb', '.FVL', '.3GP'], viewElement: 'click' },       // 上传视频验证条件
        }
    },
    watch: {
    },
    computed: {

    },
    mounted() {
        try {
            this.refreshChannel = new BroadcastChannel('refresh');
        } catch (error) {
            console.log('不支持BroadcastChannel，无法使用双屏客户端');
        }
        this.getCustomerDisplay();
    },
    methods: {
        handelModelType(type) {                              // 选择分屏样式
            this.submitData.sv_type = type;
        },
        callbackImportImg(val) {                             // 上传图片组件回调函数
            this.imgList = val;
        },
        callbackImportVideo(val) {                           // 上传视频组件回调函数
            this.videoList = val;
        },
        getCustomerDisplay() {
            stockApi.getCustomerDisplay().then(res => {
                if (this.$app.isNull(res)) return
                this.submitData.sv_enable = res.sv_enable;
                this.submitData.sv_id = res.sv_id;
                this.submitData.sv_type = res.sv_type;
                this.imgList = res.sv_img_url;
                this.videoList = res.sv_video_url;
            })
        },
        handleSave() {
            if (this.submitData.sv_type < 1) return this.$message.warning('请选择分屏样式')
            this.submitData.sv_type = this.submitData.sv_type;
            this.submitData.sv_img_url = this.imgList;
            this.submitData.sv_video_url = this.videoList;
            stockApi.editCustomerDisplay(this.submitData).then(res => {
                this.submitData.sv_id = res;
                this.refreshChannel.postMessage('refresh');
                return this.$message.success('保存成功')
            })
        }
    }
}
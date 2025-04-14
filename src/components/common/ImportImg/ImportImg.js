/*
    verifyJson - 验证条件
        fileNumber  - 默认显示个数      photoExt - 允许上传的文件格式       fileSize - 允许文件上传大小 KB为单位
    dataJson - 显示图片
    disabled - 是否禁用   true - 禁用 false - 启用
    typeEntity - 请求接口的数据 type(oss - 阿里 CommonImg - 商品) - 请求接口类型  data { userId - 用户Id uploadFileType -类型 isCompress - true }
 */
import { stockApi } from '@/api/index';
import base from '@/api/base';
import takePhoto from '../../vocational/takePhoto/takePhoto.vue';
export default {
    props: {
        verifyJson: { type: Object, default: () => { return { fileNumber: 1, photoExt: ['.jpg', 'jpeg', '.png'], fileSize: 1024, viewElement: 'click' } } },
        isTakePhoto: { type: Boolean, default: false },
        uploadText: { type: String, default: '' },
        width: { type: String, default: '' },
        height: { type: String, default: '' },
        dataJson: { type: Array, default: () => { return [] } },
        disabled: { type: Boolean, default: () => { return false } },
        typeEntity: { type: Object, default: () => { return { type: 'oss', fullpath: false, data: { userId: '', uploadFileType: '', isCompress: true } } } }
    },
    components: { takePhoto },
    data() {
        return {
            uploadImage: [],
            takePhotoShow: false,
        }
    },
    watch: {
        dataJson: {                             // 监听传过来的图片数据 
            deep: true, immediate: true, handler: function (newVal, oldVal) {
                if (this.typeEntity.type === 'CommonVideo') {
                    this.uploadImage = newVal.map(e => {
                        return this.$app.fmtImg(e, base.videoUrl)
                    });
                    return
                }
                this.uploadImage = this.typeEntity.type === 'oss' || this.typeEntity.fullpath ? newVal : newVal.map(e => {
                    return this.$app.fmtImg(e)
                });
            }
        },
    },
    created() {
    },
    mounted() {
    },
    methods: {
        replaceHost(orgImgs) {
            const { typeEntity: { type } } = this
            let baseUrl = type === 'CommonVideo' ? base.videoUrl : base.imgUrl
            if (this.typeEntity.type === 'oss' || this.typeEntity.fullpath) {
                baseUrl = ''
            }
            return orgImgs.map(item => item.replace(baseUrl, ''))
        },
        handleDeleteImg(item) {                                    // 移除图片
            this.uploadImage = this.uploadImage.filter(e => e !== item);
            let json = [...this.uploadImage];
            this.$emit('callback', this.replaceHost(json));
        },
        handleShowTakePhoto() {                                    // 点击拍照
            this.takePhotoShow = true;
        },
        handleUpload() {                                           // 点击上传图片
            this.$refs['fileUpload'].click();
        },
        handleTakePhoto(e) {                                       // 拍照返回
            let json = [...this.uploadImage];
            json.push(e);
            this.$emit('callback', this.replaceHost(json));
        },
        handleFile(e) {                                            // 调用上传的接口 上传图片
            let files = e.target.files[0];
            if (!this.verifyExt(files)) { this.$refs.fileUpload.value = ""; return; }
            if (this.typeEntity.type === 'oss') {
                let fileObj = this.$app.convertObjFormData({ file: files });
                stockApi.postUploadImage(fileObj).then(res => {
                    if (res) {
                        let json = [...this.uploadImage];
                        json.push(res.fullPath); e.target.value = '';
                        this.$emit('callback', this.replaceHost(json));
                    }
                });
                return
            }

            if (this.typeEntity.type === 'CommonImg') {
                let fileObj = this.$app.convertObjFormData({ file: files, userId: this.typeEntity.data.userId, uploadFileType: this.typeEntity.data.uploadFileType, isCompress: this.typeEntity.data.isCompress });
                stockApi.UploadImgCommonImg(fileObj).then(res => {
                    if (res) {
                        let json = [...this.uploadImage];
                        json.push(res.values); e.target.value = ''; this.$emit('callback', this.replaceHost(json));
                    }
                })
                return
            }

            if (this.typeEntity.type === 'CommonVideo') {
                let fileObj = this.$app.convertObjFormData({ file: files, userId: this.typeEntity.data.userId });
                stockApi.UploadCommonVideo(fileObj).then(res => {
                    if (res) {
                        let json = [...this.uploadImage];
                        json.push(res.url); e.target.value = ''; this.$emit('callback', this.replaceHost(json));
                    }
                })
                return
            }

            if (this.typeEntity.type === 'feedback') {
                let fileObj = this.$app.convertObjFormData({ file: files, isCompress: this.typeEntity.data.isCompress });
                stockApi.UploadOrdinaryImg(fileObj).then(res => {
                    if (res) {
                        let json = [...this.uploadImage];
                        json.push(res.values); e.target.value = ''; this.$emit('callback', this.replaceHost(json));
                    }
                })
            }
        },
        verifyExt(files) {                                         // 验收上传图片的格式
            if (this.$app.isNull(files)) {
                this.$message({ message: '请选择需要导入的文件', type: 'warning' });
                return false;
            };

            let fileExt = files.name.substr(files.name.lastIndexOf(".")).toLowerCase();
            if (this.verifyJson.photoExt.findIndex(e => e === fileExt) === -1) {
                this.$message({ message: '暂只支持上传 ' + this.verifyJson.photoExt.join('、').replace(/\./g, "") + ' 格式的照片', type: 'warning' });
                return false;
            }

            let fileSize = Math.round(files.size / 1024 * 100) / 100;
            if (fileSize > this.verifyJson.fileSize) {
                this.$message({ message: '暂只支持上传 ' + this.verifyJson.fileSize + ' KB之内的的照片', type: 'warning' });
                return false;
            }
            return true;
        }
    }
}
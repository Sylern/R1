/*
    verifyJson - 验证条件
        fileNumber  - 默认显示个数      photoExt - 允许上传的文件格式       fileSize - 允许文件上传大小 M为单位
    dataJson - 上传文件
        name - 文件名称     url - 文件link
    disabled - 是否禁用   true - 禁用 false - 启用
 */

//mp4、avi、mov、rmvb、FVL、3GP
import { stockApi } from '@/api/index';
export default {
    props: {
        verifyJson: { type: Object, default: () => { return { fileNumber: 1, photoExt: ['.mp4', '.avi', '.mov', '.rmvb', '.FVL', '.3GP'], fileSize: 128 } } },
        dataJson: { type: Array, default: () => { return [] } },
        disabled: { type: Boolean, default: () => { return false } }
    },
    data() {
        return {
            fileList: [],
            tipText: '',
        }
    },
    watch: {
        dataJson: {                             // 监听传过来的文件数据
            deep: true, handler: function (newVal, oldVal) { this.fileList = newVal; }
        }
    },
    created() { this.actionUrl = stockApi.postUploadVideo(); },
    mounted() {
        this.tipText = '暂只支持上传 ' + this.verifyJson.photoExt.join('、').replace(/\./g, "") + ' 格式的文件，' + '并且文件大小不能超过' + this.verifyJson.fileSize + 'M';
    },
    methods: {
        handleBeforeUpload(files) {                                   // 上传文件之前的函数 - 验证上传文件
            if (this.fileList.length === this.verifyJson.fileNumber) {
                this.$message({ message: '只支持上传' + this.verifyJson.fileNumber + '文件，请删除文件后再进行上传文件', type: 'warning' }); return false;
            };

            if (this.$app.isNull(files)) { this.$message({ message: '请选择需要上传的文件', type: 'warning' }); return false; }
            let fileExt = files.name.substr(files.name.lastIndexOf(".")).toLowerCase();
            if (this.verifyJson.photoExt.findIndex(e => e === fileExt) === -1) {
                this.$message({ message: '暂只支持上传 ' + this.verifyJson.photoExt.join('、').replace(/\./g, "") + ' 格式的文件', type: 'warning' });
                return false;
            }

            let fileSize = Math.round(files.size * 100) / 100;
            if (fileSize > this.verifyJson.fileSize * 1024 * 1024) {
                this.$message({ message: '暂只支持上传 ' + this.verifyJson.fileSize + ' M之内的文件', type: 'warning' }); return false;
            }
            return true;
        },
        onSuccess(response, file, fileList) {                         // 上传文件成功的回调函数 - 成功
            if (response.code === 1) {
                let url = response.data.fullPath;
                let name = url.split('/')[url.split('/').length - 1];
                let fileData = [...this.fileList];
                fileData.push({ name, url });
                this.$emit('callback', fileData);
            } else {
                this.$message({ message: response.msg, type: 'error' });
            }
        },
        onError(err, file, fileList) {                                // 上传文件失败的回调函数 - 失败
            this.$message({ message: err.message, type: 'error' });
        },
        onRemove(file, fileList) {                                    // 文件列表删除文件回调 - 删除
            this.fileList = this.fileList.filter(e => e.name !== file.name);
            this.$emit('callback', [...this.fileList]);
        }
    }
}
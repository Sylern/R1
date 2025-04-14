import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: false },
    },
    data() {
        return {
            typeEntity: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'MemberCamera', isCompress: true },
            imgSrc: '',
            osCamera: null,                          //控制摄像头开关
            thisVideo: null,
            stream: null,
            thisContext: null,
            thisCancas: null,
            videoWidth: 310,
            videoHeight: 330,
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
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.imgSrc = '';
                    this.stream = null;
                    this.osCamera = null;
                    this.thisContext = null;
                    this.thisCancas = null;
                    this.getCompetence();
                } else {
                    this.thisVideo = null;
                    this.stopCamera();
                }
            }
        },
    },
    mounted() {
    },
    methods: {
        closeDialog() {                                 // 关闭弹窗
            this.dialogVisible = 'close';
        },
        getCompetence() {
            this.$nextTick(() => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    this.thisCancas = document.getElementById("canvasCamera");
                    this.thisContext = this.thisCancas.getContext("2d");
                    this.thisVideo = document.getElementById("videoCamera");

                    const constraints = {
                        audio: false,
                        video: {
                            width: this.videoWidth,
                            height: this.videoHeight,
                            transform: "scaleX(-1)",
                        },
                    };
                    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                        if ("srcObject" in this.thisVideo) {
                            this.thisVideo.srcObject = stream;
                            this.stream = stream;
                        } else {
                            this.thisVideo.src = window.URL.createObjectURL(stream);
                        }
                        this.thisVideo.onloadedmetadata = (e) => {
                            this.osCamera = true;
                            this.thisVideo.play();
                        };
                    }).catch((err) => {
                        // alert(err)
                        this.osCamera = false;
                        this.$notify({
                            title: "警告",
                            message: "没有开启摄像头权限或版本不兼容.",
                            type: "warning",
                        });
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: "您的版本不支持摄像头访问.",
                        type: "warning",
                    });
                }
            });
        },
        stopCamera() {
            if (this.stream) {
                this.stream.getTracks().forEach(track => {
                    track.stop(); // 停止所有轨道
                });
            }
        },
        //绘制图片
        async drawImage() {
            if (this.osCamera === null) return this.$message.warning('找不到摄像头')
            if (this.osCamera === false) return this.$notify({
                title: "警告",
                message: "没有开启摄像头权限或版本不兼容.",
                type: "warning",
            });
            if (!this.$app.isNull(this.imgSrc)) {
                this.imgSrc = '';
                return
            }
            this.thisContext.drawImage(
                this.thisVideo,
                0,
                0,
                this.videoWidth,
                this.videoHeight
            );
            // 获取图片base64链接
            this.imgSrc = this.thisCancas.toDataURL("image/png");
        },
        handleUpload() {
            if (this.$app.isNull(this.imgSrc)) return
            this.naImage(this.imgSrc)
        },
        naImage(src) {
            //把这个图片转换成base64
            let arr = src.split(",");
            let array = arr[0].match(/:(.*?);/);
            let mime = (array && array.length > 1 ? array[1] : type) || type;
            // 去掉url的头，并转化为byte
            let bytes = window.atob(arr[1]);
            // 处理异常,将ascii码小于0的转换为大于0
            let ab = new ArrayBuffer(bytes.length);
            // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
            let ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            const fileNameJPG = `拍照_${randomNumber}.jpg`;

            let fileObj = this.$app.convertObjFormData({ file: new File([ia], fileNameJPG, { type: mime }), userId: this.typeEntity.userId, uploadFileType: this.typeEntity.uploadFileType, isCompress: this.typeEntity.isCompress });
            stockApi.UploadImgCommonImg(fileObj).then(res => {
                if (res) {
                    this.closeDialog();
                    this.$emit('submit', res.values);
                }
            })
        },
    }
}
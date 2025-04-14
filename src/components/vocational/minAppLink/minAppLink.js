export default {
    props: {
        h5Path: {
            type: String,
            default: ""
        },
        wxPath: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            show: false,
            loading: true,
            sortLink: "",
            wxQrCode: "",
        }
    },
    watch: {
        
    },
    methods: {
        downloadHandle() {
            if (this.wxQrCode) {
                this.$app.downloadFile(`${this.name}_${this.$app.uuid(8, 16)}`, this.wxQrCode)
            } else {
                this.$message({ type: "error", message: "小程序码生成失败" })
            }
        }
    }
}
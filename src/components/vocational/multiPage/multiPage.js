export default {
    props: {
        pageWidth: {
            type: String,
            default: 'calc(100% - 110px)'
        },
        pageName: {
            type: String,
            default: ''
        },
        breadcrumb: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            helpList: [],                       // 帮助中心列表
            schoolUrl: '',                      // 学院跳转地址
            schoolVisible: false,               // 德客学院展示
            showClickContact: false,            // 展示点击联系客服
            downloadWrapStatus: false,          // 帮助中心下载弹窗
        }
    },
    watch: {
        '$route.path': {
            handler(newVal, oldVal) {
                const pageIndex = this.breadcrumb.findIndex(e => e.url === newVal);
                this.$nextTick(() => {
                    this.$refs.breadcrumbScorll && this.$refs.breadcrumbScorll.update();
                    this.$refs.breadcrumbScorll.wrap.scrollLeft = pageIndex * 140;
                })
            }
        }
    },
    mounted() {

    },
    methods: {
        handleClosePage(pos) {
            this.$emit('closePage', pos)
        },
        handleBreadcrumb(item, index) {
            if (this.$route.path === item.url) return
            if (item.url) {
                this.$router.replace(item.url)
            }
        },
    }
}
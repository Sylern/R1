import customConfig from '@/utils/config/customConfig.js';
import base from '@/api/base';
import { stockApi, basicApi } from '@/api/index';
import { mapMutations, mapState } from 'vuex';
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
        },
        DocTypeIdFilter: {
            type: Number,
            default: null
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
    computed: {
        ...mapState(['showHelp', 'kfData']),
        hasHelpWrap() {
            let value = false;
            for (const item in customConfig.hasHelpWrap) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.hasHelpWrap[item]
                }
            }
            return value
        },
    },
    mounted() {
        if (this.hasHelpWrap) {
            let storageShowHelp = this.$app.getCookie('showHelp') === 'false' ? false : true;
            this.updateShowHelp(storageShowHelp);
            this.onHideHelp();
        }
    },
    methods: {
        ...mapMutations(['updateShowHelp', 'update']),
        onShowHelp() {                          // 打开帮助中心
            this.updateShowHelp(true);
        },
        onHideHelp() {                          // 关闭帮助中心
            this.updateShowHelp(false);
        },
        handleBreadcrumb(item) {
            if (item.isBack) {
                this.$router.back()
                return
            }
            if (item.href) {
                this.$router.replace(item.href)
            }
        },
        handleHelpList(id) {                    // 点击帮助中心列表标题事件
            // this.noviceCenterPos = id;
            this.schoolUrl = stockApi.getSchoolBase() + 'docdetail?docId=' + id;
            if (typeof Cef !== 'undefined') {
                this.schoolVisible = true;
                return
            }
            window.open(this.schoolUrl);
        },
        handleNewborn() {                       // 点击帮助中心-新手专区
            this.schoolUrl = stockApi.getSchoolBase() + 'newborn';
            if (typeof Cef !== 'undefined') {
                this.schoolVisible = true;
                return
            }
            window.open(this.schoolUrl);
        },
        handleSchool() {                        // 点击帮助中心-商户学院
            this.schoolUrl = stockApi.getSchoolBase();
            if (typeof Cef !== 'undefined') {
                this.schoolVisible = true;
                return
            }
            window.open(this.schoolUrl);
        },
        handleTips() { // 
            this.$message({ message: '请扫码下载APP', type: 'warning' });
        },
        handleTypeWin() { // 
            this.$app.downloadUrl('https://www.decerp.cn/res/德客软件.exe');
        },
    }
}
import base from '@/api/base';
import { mapState } from 'vuex';
export default {
    name: 'storesCenter',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState(['storeCenterUrl'])
    },
    watch: {
        storeCenterUrl: {                                      // 监听取单弹窗弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.storesCenter.src = base.domainUrl + '/system/index.html#/' + newVal + '?' + new Date().getTime();
                }
            }
        }
    },
    mounted() {
        let url = this.storeCenterUrl ? this.storeCenterUrl : 'personalStores/storesCenter';
        this.$refs.storesCenter.src = base.domainUrl + '/system/index.html#/' + url + '?' + new Date().getTime();
    },
    methods: {
        handleJump(url) {
            this.$refs.storesCenter.src = base.domainUrl + url;
        }
    }
}
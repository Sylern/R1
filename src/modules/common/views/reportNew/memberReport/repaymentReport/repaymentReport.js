import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import reportFilter from '../../componets/reportFilter/reportFilter.vue';
export default {
    components: { reportFilter },
    data() {
        return {
            customSelect: {
                key: 'rebatetype',
                list: [
                    {
                        label: '全部返利',
                        value: -1
                    },
                    {
                        label: '消费返利',
                        value: 1
                    },
                    {
                        label: '充值返利',
                        value: 0
                    },
                ]
            },
            query: {
                page: 1,
                pageSize: 10
            },
            dataList: [],
            total: 0,
        }
    },
    watch: {
        
    },
    mounted() {
        console.log('list mounted');
    },
    activated() {
        console.log('list activated');
    },
    methods: {
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
        },
    }
}

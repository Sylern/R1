import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import reportFilter from '../../componets/reportFilter/reportFilter.vue';
export default {
    components: { reportFilter },
    data() {
        return {
            filterable: {
                datetime: {
                    start: '',
                    end: ''
                },
                store: {},
                btnCustom: true,
                export: true
            },
            query: {
                keywards: '',
                startdate: '',
                enddate: '',
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
        this.filterable.datetime.start = this.query.startdate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.filterable.datetime.end = this.query.enddate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        // this.getChangeShiftsInfo();
    },
    activated() {
        // console.log('list activated');
    },
    methods: {
        handleUpdateFilter(data) {
            if (data.type === 'datetime') {
                this.query.startdate = data.value[0];
                this.query.enddate = data.value[1];
            }
            if (data.type === 'search') {
                this.query.keywards = data.value;
            }
            this.getChangeShiftsInfo();
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
        },
        handleInfo(item) {
            console.log(item);
        },
        //#region   获取数据
        getChangeShiftsInfo() {                                 // 获取列表数据
            const params = { ...this.query }
            stockApi.getChangeShiftsInfo(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { total, dataList } = res
                    this.dataList = dataList || []
                    this.total = total;
                    this.$nextTick(() => {
                        this.$refs.myTable && this.$refs.myTable.onReset()
                    })
                }
            });
        },
        //#endregion
    }
}

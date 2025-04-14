import { stockApi } from '@/api/index';
import { memberList } from '@/modules/common/views/report/components/index'
export default {
    components: { memberList },
    data() {
        return {
            queryEntity: {                          // 查询实体
                source: 100,
                type: -1,                        // 入场类型
                sv_start_time: '',                  // 开始时间
                sv_end_time: '',                    // 结束时间
                keywards: "",                       // 搜索关键字
                pageIndex: 1,                       // 页码
                pageSize: 10,                       // 页数
            },
            total: 0,
            dataList: [],
            values: {
                total: 1,
                sv_entry_by_Total: 1,
                sv_entry_Total: 2,
                sv_out_by_Total: 0,
                sv_out_Total: 0,
                sv_people_work_Total: 1,
                sv_intelligent_Total: 0
            }
        }
    },

    mounted() {
        this.queryEntity.sv_start_time = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_time = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetGymEntryStatistics();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.sv_start_time = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_time = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.pageIndex = 1;
            this.GetGymEntryStatistics();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.GetGymEntryStatistics();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetGymEntryStatisticsExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },
        typeChangeHandle() {
            this.queryEntity.pageIndex = 1
            this.GetGymEntryStatistics()
        },
        //#endregion

        //#region   获取数据
        GetGymEntryStatistics() {                               // 获取采购报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetGymEntryStatistics(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { values, list, total } = res
                    this.dataList = list || []
                    this.total = total;
                    this.values = values || {}
                    // this.$refs.myTable.onReset()
                }
            });
        },
        //#endregion
    }
}

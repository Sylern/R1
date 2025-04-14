import { stockApi } from '@/api/index';
import { memberList } from '@/modules/common/views/report/components/index'
export default {
    components: { memberList },
    data() {
        return {
            queryEntity: {                          // 查询实体
                source:100,
                type: -1,                        // 入场类型
                sv_start_time: '',                  // 开始时间
                sv_end_time: '',                    // 结束时间
                keywards: "",                       // 搜索关键字
                pageIndex: 1,                       // 页码
                pageSize: 10,                       // 页数
            },
            total: 0,
            dataList: [],
        }
    },

    mounted() {
        this.queryEntity.sv_start_time = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_time = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetGymEntryManagement();
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
            this.GetGymEntryManagement();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.GetGymEntryManagement();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetGymEntryManagementExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },
        typeChangeHandle() {
            this.queryEntity.pageIndex = 1
            this.GetGymEntryManagement()
        },
        
        //#endregion

        //#region   获取数据
        GetGymEntryManagement() {                               // 获取采购报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetGymEntryManagement(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { list, total } = res
                    this.dataList = list || []
                    this.total = total;
                }
            });
        },
        //#endregion
    }
}

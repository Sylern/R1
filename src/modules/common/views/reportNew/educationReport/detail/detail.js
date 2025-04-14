import { stockApi } from '@/api/index';
export default {
    data() {
        return {
            salesclerk: [],
            queryEntity: {                          // 查询实体
                sv_type: -1,                        // 订单类型
                sv_start_date: '',                  // 开始时间
                sv_end_date: '',                    // 结束时间
                sv_m_id: -1,                        // 报名学员
                sv_h_d_id: -1,                      // 经办人
                keywards: "",                       // 搜索关键字
                pageIndex: 1,                       // 页码
                pageSize: 10,                       // 页数
            },
            memberListStatus: false,
            memberInfo: {},
            total: 0,
            dataList: [],
            values: {
                total_count: 0,
                total_hour_num: 0,
                total_give_hour_num: 0,
                total_hour_subtotal: 0,
                total_month_num: 0,
                total_give_month_num: 0,
                total_month_subtotal: 0,
                total_day_num: 0,
                total_give_day_num: 0,
                total_day_subtotal: 0,
                total_time_num: 0,
                total_time_subtotal: 0,
                total_subtotal: 0,
                total_return_subtotal: 0
            }
        }
    },

    mounted() {
        stockApi.getSalesclerkInfo().then(res => {
            const { list } = res
            this.salesclerk = this.$app.isNull(list) ? [] : list.map(item => {
                return {
                    label: item.sp_salesclerk_name, value: +item.sp_salesclerkid
                }
            });
        })
        this.queryEntity.sv_start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetRegisterCoursesOrderDetailReport();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.sv_start_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.pageIndex = 1;
            this.GetRegisterCoursesOrderDetailReport();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.GetRegisterCoursesOrderDetailReport();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.PostRegisterCoursesOrderDetailReportExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },
        typeChangeHandle() {
            this.queryEntity.pageIndex = 1
            this.GetRegisterCoursesOrderDetailReport()
        },
        handleMemberInfo(memberInfo) {
            if (memberInfo) {
                this.memberInfo = memberInfo
                this.queryEntity.sv_m_id = +memberInfo.member_id
            } else {
                this.memberInfo = {}
                this.queryEntity.sv_m_id = -1
            }
            this.queryEntity.pageIndex = 1
            this.GetRegisterCoursesOrderDetailReport()
        },
        //#endregion

        //#region   获取数据
        GetRegisterCoursesOrderDetailReport() {                               // 获取采购报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetRegisterCoursesOrderDetailReport(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { values, list, total } = res
                    this.dataList = list || []
                    this.total = total;
                    this.values = values || {}
                    this.$refs.myTable.onReset()
                }
            });
        },
        //#endregion
    }
}

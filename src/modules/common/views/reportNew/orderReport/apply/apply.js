import { stockApi } from '@/api/index';
export default {
    data() {
        return {
            employees: [],                          // 员工列表
            salesclerk: [],                         // 管理员列表
            queryEntity: {                          // 查询实体
                sv_start_date: '',                  // 开始时间
                sv_end_date: '',                    // 结束时间
                pageIndex: 1,                       // 页码
                pageSize: 10,                       // 页数
                keywards: "",                       // 搜索关键字
                sv_type: -1,                        // 类型
                sv_m_id: -1,                         //报名会员
                sv_h_d_id: -1,                       // 经办人
                sv_c_e_id: -1,                       // 业绩归属人
            },
            total: 0,
            memberListStatus: false,
            memberInfo: {}, //报名会员
            dataList: [],
            values: {
                total_receivable: 0, //应收汇总
                total_paid_amount: 0, //实收汇总
                total_return_amount: 0, //退货汇总
                total_count: 0 //总数
            },
            refundPassword: "",//撤销密码
            showRefundPassword: false,
        }
    },
    mounted() {
        stockApi.getEmployeePageListV2().then(res => {
            const { values } = res
            this.employees = this.$app.isNull(values) ? [] : values.map(item => { return { label: item.sv_employee_name, value: +item.sv_employee_id } });
        })

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
        this.GetRegisterCoursesOrderReport();
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
            this.GetRegisterCoursesOrderReport();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.GetRegisterCoursesOrderReport();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.PostRegisterCoursesOrderReportExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },

        typeChangeHandle() {
            this.queryEntity.pageIndex = 1
            this.GetRegisterCoursesOrderReport()
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
            this.GetRegisterCoursesOrderReport()
        },
        OrderPrintHandle(o_id) {
            stockApi.GetOrderPrint({ o_id }).then(res => {
                this.$print.salesCourse(res);
            })
        },
        ReturnHandle(order_id) {
            this.showRefundPassword = true
            this.order_id = order_id
            this.refundPassword = ''
        },

        handleRefundPassword() {
            const { order_id, refundPassword } = this
            stockApi.ReturnClassHourOrder({ order_id, sv_source: 100, refundPassword: this.$app.md5(refundPassword).toUpperCase() }).then(() => {
                this.$message({ type: "success", message: "撤销成功" })
                this.showRefundPassword = false
                this.GetRegisterCoursesOrderReport();
            })
        },
        //#endregion

        //#region   获取数据
        GetRegisterCoursesOrderReport() {                               // 获取报名订单
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetRegisterCoursesOrderReport(params).then(res => {
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

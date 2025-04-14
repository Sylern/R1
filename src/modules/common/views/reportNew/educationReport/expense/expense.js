import { stockApi } from '@/api/index';
export default {
    data() {
        return {
            queryEntity: {                          // 查询实体
                sv_start_class_date: '',            // 消课开始时间
                sv_end_class_date: '',              // 消课结束时间
                sv_start_date: '',                  // 创建开始时间
                sv_end_date: '',                    // 创建结束时间
                sv_m_id: -1,                        // 报名学员
                sv_p_ids: [],                       // 课程
                sv_calss_ids: [],                   // 班级
                sv_teacher_ids: [],                 // 上课老师
                pageIndex: 1,                       // 页码
                PageSize: 10,                       // 页数
                sv_order_code: ""
            },
            total: 0,
            memberInfo: {},
            memberListStatus: false,
            teacherStatus: false,
            courseStatus: false,
            classStatus: false,
            currentCourse: [],
            currentTeacher: [],
            currentClass: [],

            dataList: [],
            values: {
                sumAmount: 0,
                sumHour: 0,
                sumDay: 0
            }
        }
    },
    mounted() {
        this.queryEntity.sv_start_class_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_class_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.queryEntity.sv_start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetCancelClassesRecord();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.sv_start_class_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_class_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.handleSearch();
        },
        handleChangeCreateTime(date) {
            this.queryEntity.sv_start_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.pageIndex = 1;
            this.GetCancelClassesRecord();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.PageSize = index;
            this.GetCancelClassesRecord();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetCancelClassesRecordExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
        },

        handleCourseSubmit(dataEmit) {
            if (!this.$app.isNull(dataEmit)) {
                this.currentCourse = dataEmit
                this.queryEntity.sv_p_ids = dataEmit.map(item => item.id)

            } else {
                this.currentCourse = []
                this.queryEntity.sv_p_ids = []
            }
            this.handleSearch()
        },
        getGuiderSelected(dataEmit) {

            if (!this.$app.isNull(dataEmit)) {
                this.currentTeacher = dataEmit
                this.queryEntity.sv_teacher_ids = dataEmit.map(item => item.id)

            } else {
                this.currentTeacher = []
                this.queryEntity.sv_teacher_ids = []
            }
            this.handleSearch()
        },
        handleClassSubmit(dataEmit) {
            if (!this.$app.isNull(dataEmit)) {
                this.currentClass = dataEmit
                this.queryEntity.sv_calss_ids = dataEmit.map(item => item.id)

            } else {
                this.currentClass = []
                this.queryEntity.sv_calss_ids = []
            }
            this.handleSearch()
        },
        handleMemberInfo(memberInfo) {
            if (memberInfo) {
                this.memberInfo = memberInfo
                this.queryEntity.sv_m_id = +memberInfo.member_id
            } else {
                this.memberInfo = {}
                this.queryEntity.sv_m_id = -1
            }
            this.handleSearch()
        },
        //#endregion

        //#region   获取数据
        GetCancelClassesRecord() {                               // 获取采购报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetCancelClassesRecord(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { total, list, values } = res
                    this.dataList = list || []
                    this.total = total;
                    this.values = values
                    this.$refs.myTable.onReset()
                }
            });
        },
        //#endregion
    }
}

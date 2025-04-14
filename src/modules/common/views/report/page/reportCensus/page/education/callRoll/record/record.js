import { stockApi } from '@/api/index';
import { memberList, courseSelect, guiderSelect, classroomSelect } from '@/modules/common/views/report/components/index'
export default {
    components: { memberList, courseSelect, guiderSelect, classroomSelect },
    data() {
        return {
            salesclerk: [],                          //点名老师列表
            queryEntity: {                          // 查询实体
                sv_start_class_date: '',            // 上课开始时间
                sv_end_class_date: '',              // 上课结束时间
                sv_m_id: -1,                        // 报名学员
                sv_p_ids: [],                       // 授课课程
                sv_room_ids: [],                   // 上课教室
                sv_teacher_ids: [],                 // 上课老师
                sv_calss_name: "",                   //班级名称
                sv_roll_call_teachers: -1,            //点名老师
                pageIndex: 1,                       // 页码
                PageSize: 10,                       // 页数
            },
            total: 0,
            memberInfo: {},
            memberListStatus: false,
            teacherStatus: false,
            courseStatus: false,
            classroomStatus: false,
            currentCourse: [],
            currentTeacher: [],
            currentClassRoom: [],

            dataList: [],
            values: {
                sumAmount: 0,
                sumHour: 0,
                sumDay: 0
            }
        }
    },
    mounted() {
        stockApi.getSalesclerkInfo().then(res => {
            const { list = [] } = res || {}
            this.salesclerk = list.map(item => { return { label: item.sp_salesclerk_name, value: +item.sp_salesclerkid } });
        })
        this.queryEntity.sv_start_class_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_class_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetRollCallRecord();
    },
    methods: {
        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.sv_start_class_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : '';
            this.queryEntity.sv_end_class_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : '';
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.pageIndex = 1;
            this.GetRollCallRecord();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.PageSize = index;
            this.GetRollCallRecord();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetRollCallRecordExport(params).then(res => {
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
        handleClassroomSubmit(dataEmit) {
            if (!this.$app.isNull(dataEmit)) {
                this.currentClassRoom = dataEmit
                this.queryEntity.sv_room_ids = dataEmit.map(item => item.id)

            } else {
                this.currentClassRoom = []
                this.queryEntity.sv_room_ids = []
            }
            this.handleSearch()
        },
        revocationHandle(item){                          // 撤销点名
            const {sv_guid:sv_named_guid} = item
            stockApi.RevokeNamedSchedule({sv_named_guid,source:100}).then(()=>{
                this.$message({type:'success',message:"撤销成功"})
                this.handleSearch()
            })
        },
        //#endregion

        //#region   获取数据
        GetRollCallRecord() {                               // 获取点名记录报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetRollCallRecord(params).then(res => {
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

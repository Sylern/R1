import { stockApi } from '@/api/index';
import { classSelect, memberList, courseSelect, guiderSelect } from '@/modules/common/views/report/components/index'
export default {
    components: { memberList, courseSelect, guiderSelect, classSelect },
    data() {
        return {
            queryEntity: {                          // 查询实体
                sv_start_date: '',                  // 开始时间
                sv_end_date: '',                    // 结束时间
                sv_p_ids: [],                       // 课程
                sv_class_ids: [],                   // 班级
                sv_teacher_ids: [],                 // 上课老师
                pageIndex: 1,                       // 页码
                pageSize: 10,                       // 页数
                search: "",
                arrears_state:-1
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
                total_subtotal: 0,
                total_effective_class_hour_num_total: "",
                total_effective_class_hour_num: "",
                total_give_class_hour:"",
                total_surplus_class_hour:"",
                total_surplus_price:0
            }
        }
    },
    mounted() {
        this.queryEntity.sv_start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.GetMemberRegisterCoursesSummary();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {
            this.queryEntity.sv_start_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.pageIndex = 1;
            this.GetMemberRegisterCoursesSummary();
        },

        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.GetMemberRegisterCoursesSummary();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetMemberRegisterCoursesSummaryExport(params).then(res => {
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
                this.queryEntity.sv_class_ids = dataEmit.map(item => item.id)

            } else {
                this.currentClass = []
                this.queryEntity.sv_class_ids = []
            }
            this.handleSearch()
        },
        arrearsStateChangeHandle(){
            this.handleSearch()
        },
        //#endregion

        //#region   获取数据
        GetMemberRegisterCoursesSummary() {                               // 获取采购报表数据
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetMemberRegisterCoursesSummary(params).then(res => {
                // console.log(res)
                if (!this.$app.isNull(res)) {
                    const { total, list, values } = res
                    this.dataList = list || []
                    this.total = total;
                    this.values = values||{}
                    this.$refs.myTable.onReset()
                }
            });
        },
        //#endregion
    }
}

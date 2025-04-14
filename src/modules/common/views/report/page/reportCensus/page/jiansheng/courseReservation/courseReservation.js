import { mapState } from 'vuex';
export default {
    components: {},
    data() {
        return {
            tableJson: [],                      // 表格数据
            coachList: [],                      // 教练列表
            stateText: ['已取消', '已签到', '未签到'],
            query: {                            // 查询实体
                source: 100,
                keywards: '',                       // 关键词 名称、编码
                u_id: '',
                business_type: -1,                  // 类型：100-团体课 200-私教课
                state: -1,                          // 预约状态：0-已取消 1-已签到 2-未签到
                c_id: -1,                           // 教练
                start_time: '',
                end_time: '',
                pageIndex: 1,                       // 页码
                pageSize: 10                        // 页数
            },
            total: 0,                               // 总数
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dateTime() {
            return [this.query.start_time, this.query.end_time];
        },
    },
    mounted() {
        this.query.u_id = this.userInfo.user_id;
        const today = this.$app.currentTime(new Date(), 'yyyy-MM-dd')
        this.query.start_time = today + ' 00:00:00';
        this.query.end_time = today + ' 23:59:59';
        this.getMemberReservationList();
        this.getCoachList();
    },
    methods: {
        handleAdd() {
            this.$router.push('/cardManage/addCard?type=add')
        },
        handleEdit(row) {
            this.$router.push('/cardManage/addCard?type=edit&id=' + row.product_id)
        },
        handleChangeTime(date) {                         // 选择制单日期-设置起止时间
            this.query.start_time = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.end_time = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.handleReSearch();
        },
        handleReSearch() {
            this.query.pageIndex = 1;
            this.getMemberReservationList();
        },
        handleCancel(row) {                             // 取消预约
            cardManageApi.cancelReservation({ id: row.reservation_id }).then(res => {
                if (res === null) {
                    this.$message({ type: 'success', message: '取消成功' });
                    this.getMemberReservationList();
                }
            });
        },
        handleSign(row) {                               // 预约签到
            cardManageApi.signReservation({ id: row.reservation_id }).then(res => {
                if (res === null) {
                    this.$message({ type: 'success', message: '签到成功' });
                    this.getMemberReservationList();
                }
            });
        },
        handleCurrentChange(index) {                    // 页码变化
            this.query.pageIndex = index;
            this.getMemberReservationList();
        },
        handleSizeChange(size) {                        // 每页条数变化
            this.query.pageSize = size;
            this.query.pageIndex = 1;
            this.getMemberReservationList();
        },
        //#region 接口调用
        getCoachList() {
            stockApi.getEmployeelListByRoleType().then(res => {
                if (res) {
                    this.coachList = res.map(e => {
                        return {
                            label: e.coach_name,
                            value: e.coach_id
                        }
                    });
                }
            });
        },
        getMemberReservationList() {                    // 获取列表
            cardManageApi.getMemberReservationList(this.query).then(res => {
                if (res) {
                    this.tableJson = this.$app.isNull(res.list) ? [] : res.list;
                    this.total = res.total;
                }
            });
        },
    }
}
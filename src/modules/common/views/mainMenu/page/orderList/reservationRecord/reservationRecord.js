import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import { returnPsw } from '@/components/index';
export default {
    name: 'reservationRecord',
    components: { returnPsw },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            orderStateList: [
                {
                    state: -1,
                    name: '全部',
                },
                {
                    state: 0,
                    name: '待开台',
                },
                {
                    state: 1,
                    name: '使用中',
                },
                {
                    state: 2,
                    name: '已完成',
                },
                {
                    state: 3,
                    name: '已取消',
                },
                {
                    state: 4,
                    name: '已过期',
                },
                {
                    state: 5,
                    name: '待支付',
                },
            ],
            defaultArrivalDate: [],                     // 默认预抵时间
            defaultCreatedDate: [],                     // 默认创建时间
            salesclerkInfo: [],                         // 员工 - 操作员列表
            query: {                                    // 查询实体
                sv_table_id: -1,                            // 桌台id
                sv_booking_mobile: '',                      // 联系电话
                sv_created_by: -1,                          // 操作员id
                sv_order_state: -1,                         // 订单状态：-1.全部；0.待使用；1.使用中；2.已完成；3.已取消；4.已过期；5.待支付
                sv_source_type: -1,                         // 预订方式（-1.全部；0.线下；1.微信小程序；）
                pageIndex: 1,                               // 页码
                pageSize: 10,                               // 每页条数
                sv_arrival_start_date: '',                  // 预抵开始时间
                sv_arrival_end_date: '',                    // 预抵结束时间
                sv_created_start_date: '',                  // 创建开始时间
                sv_created_end_date: '',                    // 创建结束时间
            },
            checkItem: {},
            total: 0,
            dataJson: [],                               // 表格数据
        }
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction', 'JurisdictionObj']),
    },
    watch: {
        isShow: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    const now = new Date();
                    const start = new Date(new Date().toLocaleDateString()).getTime();
                    const end = new Date(this.$app.currentTime(now, 'yyyy-MM-dd') + ' 23:59:59');
                    this.defaultArrivalDate = [start, end];
                    this.defaultCreatedDate = [start, end]
                    this.query.sv_arrival_start_date = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
                    this.query.sv_arrival_end_date = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
                    this.query.sv_created_start_date = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
                    this.query.sv_created_end_date = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
                    this.query.pageIndex = 1;
                    this.getTableBookingList();
                }
            }
        }
    },
    mounted() {
        this.getSalesclerkInfo();
    },
    methods: {
        getSalesclerkInfo() {
            if (this.salesclerkInfo.length > 0) return;
            stockApi.getSalesclerkInfo().then(res => {
                this.salesclerkInfo = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                    return {
                        label: e.sp_salesclerk_name,
                        value: e.sp_salesclerkid
                    }
                })
            })
        },
        handleOrderState(state) {
            if (this.query.sv_order_state === state) return
            this.query.sv_order_state = state;
            this.handleReGetInfo();
        },
        handleExport() {
            stockApi.recharge_Excel(this.query).then(res => {
                if (res) {
                    if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleReGetInfo() {
            this.query.pageIndex = 1;
            this.getTableBookingList();
        },
        handleChangeArrivalTime(date) {                         // 选择预抵时间
            this.query.sv_arrival_start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.sv_arrival_end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.handleReGetInfo();
        },
        handleChangeCreatedTime(date) {                         // 选择创建时间
            this.query.sv_created_start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.sv_created_end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.handleReGetInfo();
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.pageIndex = page;
            this.getTableBookingList();
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getTableBookingList();
        },
        getTableBookingList() {                                 // 获取列表
            stockApi.getTableBookingList(this.query).then(res => {
                if (res) {
                    this.dataJson = this.$app.isNull(res.list) ? [] : res.list;
                    this.total = res.total;
                    this.$nextTick(() => {
                        !!this.$refs.myTable && this.$refs.myTable.onReset();
                    })
                }
            });
        },
        handleCancel(item) {                   // 取消预约
            this.$confirm('您确认要取消所选预约单' + (item.payment_state === 1 ? '并退款吗？' : '吗？'), '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.checkItem = { id: item.id, orderId: item.sv_order_list_id };
                this.$refs.returnPsw.showPswWrap();
            }).catch(() => { })
        },
        handlePswReturn(psw) {
            const postData = {
                sv_source_type: 100,
                id: this.checkItem.id,
                orderId: this.checkItem.orderId,
                refundPassword: psw,
                reason: '操作取消预约',
                remark: ''
            }
            stockApi.cancelBooking(postData).then(_ => {
                this.$message.success('取消成功!');
                this.getTableBookingList();
            })
        },
    }
};
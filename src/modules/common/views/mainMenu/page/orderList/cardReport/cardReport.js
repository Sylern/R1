import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import { returnPsw } from '@/components/index';
export default {
    name: 'cardReport',
    components: { returnPsw },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            defaultDate: [],
            storelist: [],                              // 门店列表
            query: {                                    // 查询实体
                keywards: '',                           // 关键词筛选
                user_id: '',                            // 门店id
                page: 1,                                // 页码
                pageSize: 10,                           // 每页条数
                startdate: '',                          // 开始时间
                enddate: '',                            // 结束时间
            },
            total: 0,
            totalAmount: 0,
            totalRevokeAmount: 0,
            dataJson: [],                               // 表格数据
            dialogFormVisible: false,                   // 撤销计次
            form: {
                return_num: 1,
                return_remark: '',
                return_cause: '商品质量原因，客户退货',
                return_type: 1,
                order_id: '',
                order_product_id: '',
                refundPassword: '',
                return_porduct: ''
            }
        }
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction', 'printTemplate']),
    },
    watch: {
        isShow: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.query.page = 1;
                    this.getSetmealConSerialInfo();
                }
            }
        }
    },
    beforeMount() {
        const now = new Date();
        const start = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(this.$app.currentTime(now, 'yyyy-MM-dd') + ' 23:59:59');
        this.defaultDate = [start, end];
        this.query.startdate = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
        this.query.enddate = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
    },
    mounted() {
        this.getCommonBranchStorelist();
    },
    methods: {
        getCommonBranchStorelist() {
            if (this.storelist.length > 0) return;
            stockApi.getCommonBranchStorelist().then(res => {
                this.storelist = this.$app.isNull(res) ? [] : res.map(e => {
                    return {
                        label: e.sv_us_name,
                        value: e.user_id
                    }
                })
                this.query.user_id = this.userInfo.user_id;
            })
        },
        handleExport() {
            stockApi.setmealConSerial_Excel(this.query).then(res => {
                if (res) {
                    if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleReGetRechargeInfo() {
            this.query.page = 1;
            this.getSetmealConSerialInfo(true);
        },
        handleChangeTime(date) {                                // 选择制单日期-设置起止时间
            this.query.startdate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.enddate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.page = 1;
            this.getSetmealConSerialInfo(true);
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
            this.getSetmealConSerialInfo(true);
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getSetmealConSerialInfo(true);
        },
        getSetmealConSerialInfo(load) {                          // 获取列表
            if (this.dataJson.length > 0 && this.$app.isNull(load)) return;
            stockApi.getSetmealConSerialInfo(this.query).then(res => {
                if (res) {
                    this.dataJson = this.$app.isNull(res.list) ? [] : res.list;
                    this.total = res.total;
                    this.totalAmount = res.totalAmount;
                    this.totalRevokeAmount = res.totalRevokeAmount;
                }
            });
        },
        handleUndo(row) {                                        // 撤销计次
            this.form.return_num = row.product_num;
            this.form.order_id = row.sv_order_list_id;
            this.form.order_product_id = row.id;
            this.form.return_porduct = row.product_id;
            this.dialogFormVisible = true;
        },
        cancelReturenSales() {
            this.$refs.returnPsw.showPswWrap();
        },
        handlePswReturn(val) {
            this.form.refundPassword = val;
            stockApi.cancelReturenSales(this.form).then(_ => {
                this.dialogFormVisible = false;
                this.$message.success('次卡消费撤销成功!');
                this.getSetmealConSerialInfo(true);
            })
        }
    }
};
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import { returnPsw } from '@/components/index';
export default {
    name: 'rechargeRecord',
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
            salesclerkInfo: [],                         // 员工 - 操作员列表
            paymentList: [],                            // 支付方式
            query: {                                    // 查询实体
                keywards: '',                           // 关键词筛选
                user_id: '',                            // 门店id
                salesclerkid_id: '',                    // 员工id
                payment_method: '',                     // 支付方式
                page: 1,                                // 页码
                pageSize: 10,                           // 每页条数
                startdate: '',                          // 开始时间
                enddate: '',                            // 结束时间
                select_method: '0,4'
            },
            total: 0,
            recharge_count: 0,
            recharge_total: 0,
            presenttotal_total: 0,
            currentItem: {},
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
                    this.query.page = 1;
                    this.getRechargeInfo();
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
        this.getSalesclerkInfo();
        this.getCommonBranchStorelist();
        this.getUserPayment();
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
        getUserPayment() {
            if (this.paymentList.length > 0) return;
            stockApi.getUserPayment().then(res => {
                this.paymentList = this.$app.isNull(res) ? [] : res.map(e => {
                    return {
                        label: e.payment_names,
                        value: e.payment_names
                    }
                })
            })
        },
        handleExport() {
            stockApi.recharge_Excel(this.query).then(res => {
                console.log(res);
                if (res) {
                    if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleReGetRechargeInfo() {
            this.query.page = 1;
            this.getRechargeInfo(true);
        },
        handleChangeTime(date) {                                // 选择制单日期-设置起止时间
            this.query.startdate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.enddate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.page = 1;
            this.getRechargeInfo(true);
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
            this.getRechargeInfo(true);
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getRechargeInfo(true);
        },
        getRechargeInfo(load) {                                 // 获取列表
            if (this.dataJson.length > 0 && this.$app.isNull(load)) return;
            stockApi.getRechargeInfo(this.query).then(res => {
                if (res) {
                    this.dataJson = this.$app.isNull(res.list) ? [] : res.list;
                    this.total = res.total;
                    const values = res.values
                    if (values) {
                        this.recharge_count = values.recharge_count;
                        this.recharge_total = values.recharge_total;
                        this.presenttotal_total = values.presenttotal_total;
                    }
                }
            });
        },
        handleUndo({ id, sv_wallet_id }) {                      // 撤销充值
            this.$confirm('您确认要取消该笔充值吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.currentItem = { id, sv_wallet_id };
                this.$refs.returnPsw.showPswWrap();
            }).catch(() => { })
        },
        handlePswReturn(val) {
            let params = { id: this.currentItem.id, sv_wallet_id: this.currentItem.sv_wallet_id, refundPassword: val };
            stockApi.cancelStoredValue(params).then(_ => {
                this.$message.success('撤销充值成功!');
                this.getRechargeInfo(true);
            })
        },
        handlePrint(row) {
            if (!this.cashierJurisdiction.printEnable) return this.$message.warning('请去设置—小票机设置，启用打印开关');
            const dataType = {
                0: '充值',
                1: '退款',
                4: '开卡',
                5: '扣费'
            }
            let printDataList = [
                {
                    type: 'line',
                    text: '收银对账单',
                    size: 17,
                    lineHeight: 30,
                    align: 1,
                },
                {
                    type: 'line',
                    text: this.userInfo.sv_us_name,
                    align: 1,
                    spaceLine: 1,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: `会员姓名：${row.sv_mr_name}`,
                },
                {
                    type: 'line',
                    text: `会员卡号：${row.sv_mr_cardno}`,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: `类型：${row.sv_mrr_type_name}`,
                },
                {
                    type: 'line',
                    text: `${dataType[row.sv_mrr_type]}金额：${row.sv_mrr_money}`,
                },
                {
                    type: 'line',
                    text: `赠送金额：${row.sv_mrr_present}`,
                },
                {
                    type: 'line',
                    text: `付款方式：${row.sv_mrr_payment}`,
                },
                {
                    type: 'line',
                    text: `${dataType[row.sv_mrr_type]}前金额：${this.$app.subtractNumber(row.sv_mrr_amountafter, row.sv_mrr_money)}`,
                },
                {
                    type: 'line',
                    text: `${dataType[row.sv_mrr_type]}后金额：${row.sv_mrr_amountafter}`,
                },
                {
                    type: 'line',
                    text: `${dataType[row.sv_mrr_type]}时间：${row.sv_mrr_date}`,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: `备注： ${row.sv_mrr_desc}`,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: `打印时间：${this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
                },
            ]
            this.$print.sales(printDataList);
            this.$message.success('打印成功');
        },
    }
};
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import { returnPsw } from '@/components/index';
export default {
    name: 'cardsSaleRecord',
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
            currentItem: {},
            dataJson: [],                               // 表格数据
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
                    this.getSalesCardDetailInfo();
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
            stockApi.salesCardDetail_Excel(this.query).then(res => {
                if (res) {
                    if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleReGetRechargeInfo() {
            this.query.page = 1;
            this.getSalesCardDetailInfo(true);
        },
        handleChangeTime(date) {                                // 选择制单日期-设置起止时间
            this.query.startdate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.enddate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.page = 1;
            this.getSalesCardDetailInfo(true);
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
            this.getSalesCardDetailInfo(true);
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getSalesCardDetailInfo(true);
        },
        getSalesCardDetailInfo(load) {                          // 获取列表
            if (this.dataJson.length > 0 && this.$app.isNull(load)) return;
            stockApi.getSalesCardDetailInfo(this.query).then(res => {
                if (res) {
                    this.dataJson = this.$app.isNull(res.list) ? [] : res.list;
                    this.total = res.total;
                    this.totalAmount = res.totalAmount;
                    this.totalRevokeAmount = res.totalRevokeAmount;
                }
            });
        },
        handleUndo(row) {                                        // 撤销充值
            this.$confirm('您确认要取消该次卡吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.currentItem = row;
                this.$refs.returnPsw.showPswWrap();
            }).catch(() => { })
        },
        handlePswReturn(val) {
            let params = { id: this.currentItem.id, serialnumber: this.currentItem.sv_serialnumber, refundPassword: val };
            stockApi.cancelSetmealRecharge(params).then(_ => {
                this.$message.success('撤销次卡成功!');
                this.getSalesCardDetailInfo(true);
            })
        },
        handlePrint(row) {
            if (!this.cashierJurisdiction.printEnable) return this.$message.warning('请去设置—小票机设置，启用打印开关');
  
            let printDataList = [
                {
                    type: 'line',
                    text: '欢迎光临',
                    size: 17,
                    lineHeight: 30,
                    align: 1,
                },
                {
                    type: 'line',
                    text: row.memberuserName,
                    align: 1,
                    spaceLine: 1,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: `卡号/会员姓名：${row.sv_mr_names}`,
                }
            ]
            // 合并打印数组-第一部分
            let tableData = {
                header: ['项目', '购买数量', '赠送数量'],
                list: [],
                footer: []
            }
            let buyNumber = 0, giveNumber = 0;
            tableData.list = row.setmealrechargedetail.map(e => {
                buyNumber += e.sv_purchase_count;
                giveNumber += e.sv_give_count;
                return {
                    name: e.sv_p_name,
                    number: e.sv_purchase_count +'',
                    time: e.sv_give_count +''
                }
            })
            tableData.footer = ['合计', buyNumber + '', giveNumber +''];
            // 合并打印数组-表格

            const array2 = [
                {
                    type: 'line',
                    text:  `付款金额：${row.amount}`,
                },
                {
                    type: 'line',
                    text: `付款方式：${row.sv_mcr_payment}`,
                },
                {
                    type: 'line',
                    text: `充值前可用：${row.sv_mcr_countbefore}`,
                },
                {
                    type: 'line',
                    text: `充值后可用：${row.sv_mcr_countafter}`,
                },
                {
                    type: 'line',
                    text: `购买时间：${row.sv_created_date}`,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: `备注： ${row.sv_p_remark}`,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: `打印时间：${this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
                }
            ]
            let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
            printDataList = printDataList.concat(this.$app.printMemberCardTable(tableData, isDriverType, this.printTemplate.salesData.width)).concat(array2);
            this.$print.sales(printDataList);

            this.$message.success('打印成功');
        },
    }
};
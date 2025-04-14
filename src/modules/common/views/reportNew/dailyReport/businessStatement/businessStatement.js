import { mapState } from 'vuex';
import { stockApi } from "@/api/index.js";
import gridManager from '_c/common/gridManager'
import reportFilter from '../../componets/reportFilter/reportFilter.vue';
export default {
    name: 'businessStatement',
    components: { reportFilter, gridManager },
    data() {
        return {
            filterable: {
                datetime: {
                    start: '',
                    end: ''
                },
                store: {},
                btnCustom: true,
                export: true
            },
            query: {
                user_id: '',
                startDate: '',
                endDate: '',
                page: 1,
                pageSize: 10
            },
            gridOption: {
                gridManagerName: 'businessStatement',
                skinClassName: 'gridManagerTable',
                firstLoading: false,
                supportAutoOrder: false,
                supportCheckbox: false,
                supportMenu: false,
                i18n: "zh-cn",
                disableBorder: false,
                disableLine: true,
                supportDrag: false,
                supportAdjust: false,
                maxHeight: '100%',
                height: 'auto',
                lineHeight: '54px',
                columnData: [
                    {
                        key: 'order',
                        text: '序号',
                        align: 'center',
                        template: (value, row, index) => {
                            return `<span>${(this.query.page - 1) * this.query.pageSize + index + 1}</span>`;  // 基于行索引生成序号‌:ml-citation{ref="1,2" data="citationList"}
                        }
                    },
                    { key: 'intelligent_datetime', text: '日期', align: 'center', width: '110px' },
                    {
                        key: 'total', text: '客户类型', align: 'center', children: [
                            { key: 'total_transactions', text: '总成交笔数', align: 'center' },
                            { key: 'total_return_count', text: '退货笔数', align: 'center' },
                            { key: 'member_consume_amount', text: '会员消费', align: 'center' },
                            { key: 'memnber_transactions_num', text: '会员笔数', align: 'center' },
                            { key: 'consume_amount', text: '散客消费', align: 'center' },
                            { key: 'transactions_num', text: '散客笔数', align: 'center' }
                        ]
                    },
                    {
                        key: 'salesType', text: '销售类型', align: 'center', children: [
                            { key: 'general_product_totalamount', text: '产品总额', align: 'center' },
                            { key: 'service_product_totalamount', text: '服务商品总额', align: 'center' },
                            { key: 'recharge_totalamount', text: '充值总额', align: 'center' },
                            { key: 'timescount_totalamount', text: '充次总额', align: 'center' }
                        ]
                    },
                    {
                        key: 'payment', text: '支付方式', align: 'center', children: [
                            { key: 'order_cashmoney', text: '现金', align: 'center' },
                            { key: 'order_bankcardmoney', text: '银行卡', align: 'center' },
                            { key: 'order_wechatmoney', text: '微信', align: 'center' },
                            { key: 'order_wechataccountmoney', text: '微信记账', align: 'center' },
                            { key: 'order_alipaymoney', text: '支付宝', align: 'center' },
                            { key: 'order_alipayaccountmoney', text: '支付宝记账', align: 'center' },
                            { key: 'order_cardmoney', text: '储值卡', align: 'center' },
                            { key: 'order_scanmoney', text: '扫码支付', align: 'center' },
                            { key: 'order_couponmoney', text: '优惠劵', align: 'center' },
                            { key: 'order_meituanmoney', text: '美团', align: 'center' },
                            { key: 'order_oncreditmoney', text: '赊账', align: 'center' }
                        ]
                    },
                    {
                        key: 'rechargerecord', text: '营业外收入（开卡、充值、充次）', align: 'center', children: [
                            { key: 'rechargerecord_cashmoney', text: '现金', align: 'center' },
                            { key: 'rechargerecord_bankcardmoney', text: '银行卡', align: 'center' },
                            { key: 'rechargerecord_wechatmoney', text: '微信', align: 'center' },
                            { key: 'rechargerecord_wechataccountmoney', text: '微信记账', align: 'center' },
                            { key: 'rechargerecord_alipaymoney', text: '支付宝', align: 'center' },
                            { key: 'rechargerecord_alipayaccountmoney', text: '支付宝记账', align: 'center' },
                            { key: 'rechargerecord_cardmoney', text: '储值卡', align: 'center' }
                        ]
                    },
                    {
                        key: 'deserved_amount', text: '优折赠', align: 'center'
                    },
                    {
                        key: 'return_amount', text: '退款金额', align: 'center'
                    },
                    {
                        key: 'order_receivable', text: '实收金额', align: 'center'
                    }
                ],
                ajaxData: { data: [] },
            },
            dataList: [],
            total: 0,
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.query.user_id = this.userInfo.user_id;
        this.filterable.datetime.start = this.query.startDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.filterable.datetime.end = this.query.endDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.getUserBusinessInfo();
    },
    methods: {
        //#region   事件
        handleSearch(data) {                                // 查询
            // this.gridOption.columnData = [{
            //     key: 'order',
            //     text: '序号',
            //     template: (value, row, index) => {
            //         return `<span>${index + 1}</span>`;  // 基于行索引生成序号‌:ml-citation{ref="1,2" data="citationList"}
            //     },

            // }, { key: 'intelligent_datetime', text: '日期', align: 'center', width: '110px' },]
            // this.$refs.gridmanager.update(() => {
            //     // this.$gridManager.renderGrid('businessStatement');
            //     this.$gridManager.setAjaxData('businessStatement', { data: [{ intelligent_datetime: '2020-12-11' }] })
            // })
            // const _g=  this.$gridManager
            // debugger
            this.query.startDate = data.startDate;
            this.query.endDate = data.endDate;
            this.query.user_id = data.user_id;
            this.query.page = 1;
            this.query.pageSize = 10;
            this.getUserBusinessInfo();
        },
        handleReset() {                                     // 重置
            this.query = {
                user_id: '',
                startDate: '',
                endDate: '',
                page: 1,
                pageSize: 10
            };
            this.query.user_id = this.userInfo.user_id;
            this.filterable.datetime.start = this.query.startDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
            this.filterable.datetime.end = this.query.endDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        },
        handleDownload() {                                  // 导出
            stockApi.CommissionByMonthDownload(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },
        handleCurrentChange(page) {                         // 改变页码
            this.query.page = page;
            this.getUserBusinessInfo();
        },
        handleSizeChange(pageSize) {                        // 改变条数
            this.query.pageSize = pageSize;
            this.getUserBusinessInfo();
        },
        //#endregion

        //#region   获取数据
        getUserBusinessInfo() {
            const query = {
                page: this.query.page,
                pageSize: this.query.pageSize,
                endDate: this.query.endDate,
                startDate: this.query.startDate,
                user_id: this.query.user_id
            }
            stockApi.getUserBusinessInfo(query).then(res => {
                this.total = res.total;
                this.gridOption.columnData.forEach(item => {
                    if (item.key === 'payment') {
                        const paymentCustom = (res.dataList[0] && res.dataList[0].order_custompaymentlist || []).map(item => {
                            return {
                                key: item.custompayment_name,
                                text: item.custompayment_name,
                                align: 'center'
                            }
                        })
                        item.children = item.children.concat(paymentCustom);
                    }
                    if (item.key === 'rechargerecord') {
                        const rechargeCustom = (res.dataList[0] && res.dataList[0].recharge_custompaymentlist || []).map(item => {
                            return {
                                key: 'recharge_' + item.custompayment_name,
                                text: 'recharge_' + item.custompayment_name,
                                align: 'center'
                            }
                        })
                        item.children = item.children.concat(rechargeCustom);
                    }
                });
                this.gridOption.ajaxData.data = res.dataList.map(item => {
                    item.recharge_custompaymentlist.forEach(i => {
                        item['recharge_' + i.custompayment_name] = i.custompayment_amount
                    })
                    item.order_custompaymentlist.forEach(i => {
                        item[i.custompayment_name] = i.custompayment_amount
                    })
                    return item
                })
                this.$refs.gridmanager.update(() => {
                    // this.$gridManager.renderGrid('businessStatement');
                    // this.$gridManager.cleanData('businessStatement');
                    this.$gridManager.setAjaxData('businessStatement', {
                        data: res.dataList.map(item => {
                            item.recharge_custompaymentlist.forEach(i => {
                                item['recharge_' + i.custompayment_name] = i.custompayment_amount
                            })
                            item.order_custompaymentlist.forEach(i => {
                                item[i.custompayment_name] = i.custompayment_amount
                            })
                            return item
                        })
                    });
                })
            })
        },
        //#endregion
    }
}

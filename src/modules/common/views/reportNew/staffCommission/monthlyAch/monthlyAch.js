import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    name: 'monthlyAch',
    components: { gridManager },
    data() {
        return {
            storeList: [],                          // 门店数据
            classifyOneData: [],                    // 一级分类
            queryEntity: {                          // 查询实体
                ShopIds: '',                            // 店铺id集合
                PtIdS: -1,                              // 商品一级分类
                StartDate: '',                          // 开始时间
                EndDate: '',                            // 结束时间
                PageIndex: 1,                           // 页码
                PageSize: 10                            // 页数
            },
            total: 0,
            gridOption: {
                gridManagerName: 'monthlyAch',
                skinClassName: 'gridManagerTable',
                firstLoading: false,
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
                    { key: 'employeeName', text: '月份', align: 'center', width: '110px' },
                    {
                        key: 'total', text: '合计', align: 'center', children: [
                            // { key: 'total_totalCommissionOrderMoney', text: '提成总销售额', align: 'center', remind: '提成订单的销售额总和，扣减退款部分'  },
                            { key: 'total_totalSalesPerformance', text: '总业绩', align: 'center', remind: '业绩订单的业绩总和，扣减退款部分' },
                            { key: 'total_totalCommission', text: '总提成', align: 'center', remind: '提成订单的提成总和，扣减退款部分' },
                            { key: 'total_totalOrderCount', text: '总客数', align: 'center', remind: '提成订单的数量总和，不扣减退款部分' },
                            { key: 'total_avgOrderPrice', text: '客单价', align: 'center', remind: '提成订单的单价平均值，不扣减退款部分' },
                            { key: 'total_totalAssignOrderCount', text: '指定客数', align: 'center', remind: '指定提成订单的数量总和，不扣减退款部分' },
                            { key: 'total_assignRate', text: '指定率', align: 'center', remind: '指定提成订单的数量总和占总订单的比例，不扣减退款部分' },
                        ]
                    },
                    {
                        key: 'serviceProduct', text: '服务项目', align: 'center', children: [
                            // { key: 'serviceProduct_orderMoney', text: '服务提成金额', align: 'center', remind: '服务项目的提成销售额总和，扣减退款部分' },
                            { key: 'serviceProduct_salesPerformance', text: '业绩', align: 'center', remind: '服务项目订单获得的业绩总和，扣减退款部分' },
                            { key: 'serviceProduct_commission', text: '提成', align: 'center', remind: '服务项目订单获得的提成总和，扣减退款部分' },
                            { key: 'serviceProduct_count', text: '服务个数', align: 'center', remind: '服务项目订单获得提成的数量总和，扣减退款部分' },
                        ]
                    },
                    {
                        key: 'product', text: '商品销售', align: 'center', children: [
                            // { key: 'product_orderMoney', text: '销售提成金额', align: 'center', remind: '商品销售的提成销售额总和，扣减退款部分' },
                            { key: 'product_salesPerformance', text: '业绩', align: 'center', remind: '商品销售订单获得的业绩总和，扣减退款部分' },
                            { key: 'product_commission', text: '提成', align: 'center', remind: '商品销售订单获得的提成总和，扣减退款部分' },
                            { key: 'product_count', text: '商品个数', align: 'center', remind: '商品销售订单获得提成的数量总和，扣减退款部分' },
                        ]
                    },
                    {
                        key: 'card', text: '开卡', align: 'center', children: [
                            // { key: 'card_orderMoney', text: '开卡提成金额', align: 'center' , remind: '开卡订单的提成销售额总和，扣减退款部分'},
                            { key: 'card_salesPerformance', text: '业绩', align: 'center', remind: '开卡订单订单获得的业绩总和，扣减退款部分' },
                            { key: 'card_commission', text: '提成', align: 'center', remind: '开卡订单订单获得的提成总和，扣减退款部分' },
                            { key: 'card_count', text: '开卡数', align: 'center', remind: '开卡订单订单获得提成的数量总和，扣减退款部分' },
                        ]
                    }

                ],
                ajaxData: { data: [] },
            },
            dateTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd')
        }
    },
    computed: {
        ...mapState(['userInfo']),
        queryObj() {
            let { CommissionType, EmployeeId, ShopIds, PtIdS, StartDate, EndDate, PageIndex, PageSize } = this.queryEntity;
            let obj = { CommissionType, EmployeeId, ShopIds, PtIdS, StartDate, EndDate, PageIndex, PageSize };
            if (this.$app.isNull(EmployeeId)) delete obj.EmployeeId;
            let dateYear = this.$app.currentTime(new Date(this.dateTime), 'yyyy')
            obj.StartDate = dateYear + '-01-01';
            obj.EndDate = dateYear === this.$app.currentTime(new Date(), 'yyyy') ? this.$app.currentTime(new Date(), 'yyyy-MM-dd') : dateYear + '-12-31'
            obj.ShopIds = this.$app.isNull(ShopIds) ? this.storeList.filter(e => e.value !== '').map(e => { return e.value }) : [ShopIds];
            obj.PtIdS = this.$app.isNull(PtIdS) ? [-1] : [PtIdS];
            return obj;
        }
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.getProductcategory();                      // 获取商品一级分类
    },
    methods: {
        //#region   事件
        handleSearch() {                                    // 查询
            this.queryEntity.PageIndex = 1;
            this.CommissionByMonth();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                CommissionType: 5,
                EmployeeId: '',
                ShopIds: '',
                StartDate: '',
                EndDate: '',
                PageIndex: 1,
                PageSize: 10
            };
            this.dateTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd')
        },
        handleDownload() {                                  // 导出
            stockApi.CommissionByMonthDownload(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },

        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                // this.storeList.unshift({ label: '全部', value: '' });
                this.queryEntity.ShopIds = this.userInfo.user_id ? (this.userInfo.user_id + '') : '';
                this.CommissionByMonth();
            });
        },
        getProductcategory() {                              // 获取一级分类
            stockApi.getProductcategory({ userid: this.queryEntity.ShopIds, producttype_id: -1 }).then(res => {
                if (res) {
                    this.classifyOneData = this.$app.isNull(res.list) ? [] : res.list.map(e => { return { value: e.id, label: e.sv_pc_name } });
                    this.classifyOneData.unshift({ value: -1, label: '全部' });
                }
            });
        },
        CommissionByMonth() {                               // 获取数据
            stockApi.CommissionByMonth(this.queryObj).then(res => {
                this.$gridManager.cleanData('monthlyAch');
                this.$gridManager.setAjaxData('monthlyAch', {
                    data: res.map(item => {
                        return {
                            employeeName: item.employeeName,
                            total_totalCommissionOrderMoney: item.total.totalCommissionOrderMoney,
                            total_totalSalesPerformance: item.total.totalSalesPerformance,
                            total_totalCommission: item.total.totalCommission,
                            total_totalOrderCount: item.total.totalOrderCount,
                            total_avgOrderPrice: item.total.avgOrderPrice,
                            total_totalAssignOrderCount: item.total.totalAssignOrderCount,
                            total_assignRate: item.total.assignRate,
                            serviceProduct_orderMoney: item.serviceProduct.orderMoney,
                            serviceProduct_salesPerformance: item.serviceProduct.salesPerformance,
                            serviceProduct_commission: item.serviceProduct.commission,
                            serviceProduct_count: item.serviceProduct.count,
                            product_orderMoney: item.product.orderMoney,
                            product_salesPerformance: item.product.salesPerformance,
                            product_commission: item.product.commission,
                            product_count: item.product.count,
                            card_orderMoney: item.card.orderMoney,
                            card_salesPerformance: item.card.salesPerformance,
                            card_commission: item.card.commission,
                            card_count: item.card.count
                        }
                    })
                });
            });
        },
        //#endregion
    }
}

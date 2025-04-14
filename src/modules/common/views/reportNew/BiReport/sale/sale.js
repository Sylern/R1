import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    components: { gridManager },
    data() {
        return {
            storeList: [],                          // 门店数据
            queryEntity: {                          // 查询实体
                ids: [],                            // 店铺id集合
                start_date: '',                     // 开始时间
                end_date: '',                       // 结束时间
                Page: 1,                            // 页码
                PageSize: 10,                       // 页数
            },
            total: 0,
            gridOption: {
                gridManagerName: 'biSale',
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
                    { key: 'sv_user_id', text: '门店编号', align: 'center', width: '90px' },
                    { key: 'sv_user_name', text: '门店名称', align: 'center', width: '100px' },
                    {
                        key: 'current_data', text: '【本期时间段】销售概况', align: 'center', width: "350px", children: [
                            { key: 'sv_money_d', text: '销售', align: 'center' },
                            { key: 'sv_proportion_d', text: '占比', align: 'center' },
                            { key: 'sv_num_d', text: '销量', align: 'center' },
                            { key: 'sv_profit_money_d', text: '利润', align: 'center' },
                            {
                                key: 'sv_interest_rate_d', text: '毛利率', align: 'center', template: sv_interest_rate_d => {
                                    return `<span style='background:rgba(var(--main-theme-color), 1);;color:white;border-radius:10px;padding:0 8px'>${sv_interest_rate_d}</span>`;
                                }
                            }
                        ]
                    },
                    {
                        key: 'huanbi_data', text: '【环比时间段（所选开始及结束时间各往前推一个月）】销售概况', align: 'center', children: [
                            { key: 'sv_money_m', text: '销售', align: 'center' },
                            { key: 'sv_proportion_m', text: '占比', align: 'center' },
                            { key: 'sv_num_m', text: '销量', align: 'center' },
                            { key: 'sv_profit_money_m', text: '利润', align: 'center' },
                            {
                                key: 'sv_interest_rate_m', text: '毛利率', align: 'center', template: sv_interest_rate_m => {
                                    return `<span style='background:#2DBD5D;color:white;border-radius:10px;padding:0 8px'>${sv_interest_rate_m}</span>`;
                                }
                            },
                            {
                                key: 'sv_growth_rate_m', text: '增长率', align: 'center', template: (sv_growth_rate_m, row) => {
                                    const { sv_is_rise_m } = row
                                    return sv_is_rise_m ? `<span style="color:rgba(var(--main-theme-color), 1);">${sv_growth_rate_m} ↑</span>` : `<span style="color:red">${sv_growth_rate_m} ↓</span>`
                                }
                            }
                        ]
                    },
                    {
                        key: 'tongbi_data', text: '【同比时间段所选开始及结束时间各往前推一年】销售概况', align: 'center', children: [
                            { key: 'sv_money_y', text: '销售', align: 'center' },
                            { key: 'sv_proportion_y', text: '占比', align: 'center' },
                            { key: 'sv_num_y', text: '销量', align: 'center' },
                            { key: 'sv_profit_money_y', text: '利润', align: 'center' },
                            {
                                key: 'sv_interest_rate_y', text: '毛利率', align: 'center', template: sv_interest_rate_y => {
                                    return `<span style='background:rgba(var(--main-theme-color), 1);;color:white;border-radius:10px;padding:0 8px'>${sv_interest_rate_y}</span>`;
                                }
                            },
                            {
                                key: 'sv_growth_rate_y', text: '增长率', align: 'center', template: (sv_growth_rate_y, row) => {
                                    const { sv_is_rise_y } = row
                                    return sv_is_rise_y ? `<span style="color:rgba(var(--main-theme-color), 1);">${sv_growth_rate_y} ↑</span>` : `<span style="color:red">${sv_growth_rate_y} ↓</span>`
                                }
                            }
                        ]
                    }

                ],
                ajaxData: { data: [] },
            },
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.queryEntity.start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.queryEntity.ids = [+this.userInfo.user_id]
        this.GetProduct_Sales_Summary();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.Page = 1;
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.Page = 1;
            this.GetProduct_Sales_Summary();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                ids: [],
                start_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                end_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                Page: 1,
                PageSize: 10
            };
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.Page = index;
            if (type === 'size') this.queryEntity.Page = 1, this.queryEntity.PageSize = index;
            this.GetProduct_Sales_Summary();
        },
        checkAllStoreHandle() {
            const { queryEntity, storeList } = this
            if (queryEntity.ids.length === storeList.length) {
                this.queryEntity.ids = []
            } else {
                this.queryEntity.ids = (storeList || []).map(item => +item.value)
            }
            this.queryEntity.page = 1
            this.GetProduct_Sales_Summary()
        },
        handleDownload() {                                  // 导出
            const { queryEntity, storeList } = this
            const params = { ...queryEntity }
            params.ids.length === storeList.length && (params.ids = [])
            stockApi.Product_Sales_SummaryExcel(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
            });
        },

        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = (res || []).map(e => { return { label: e.sv_us_name, value: +e.user_id, uset_type: e.user_tye } });
            });
        },
        GetProduct_Sales_Summary() {                               // 获取商品业绩数据
            const { queryEntity, storeList } = this
            const params = { ...queryEntity }
            params.ids.length === storeList.length && (params.ids = [])
            stockApi.GetProduct_Sales_Summary(params).then(res => {
                const { list, total } = res || {}
                this.$gridManager.setAjaxData('biSale', {
                    data: (list || []).map(item => {
                        let createTime = this.$app.isNull(item.createTime) ? '' : this.$app.currentTime(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss');
                        return { ...item, createTime }
                    })
                });
                this.total = total || 0;
            });
        },
        //#endregion
    }
}

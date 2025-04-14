import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            storeList: [],                          // 门店数据
            suppliers: [],                          //供应商列表
            queryEntity: {                          // 查询实体
                uids: [],                           // 店铺id集合
                suids: [],                           // 供应商集合
                start_date: '',                     // 开始时间
                end_date: '',                       // 结束时间
                Page: 1,                            // 页码
                PageSize: 10,                       // 页数
            },
            total: 0,
            dataList: []
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.queryEntity.start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.queryEntity.uids = [+this.userInfo.user_id]
        this.GetReport_Procurement_Return();
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.Page = 1;
            this.GetReport_Procurement_Return();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                uids: [],
                start_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                end_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                Page: 1,
                PageSize: 10
            };
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.Page = index;
            if (type === 'size') this.queryEntity.Page = 1, this.queryEntity.PageSize = index;
            this.GetReport_Procurement_Return();
        },
        handleDownload() {                                  // 导出
            const { queryEntity, storeList, suppliers } = this
            const params = { ...queryEntity }
            params.uids.length === storeList.length && (params.uids = [])
            params.suids.length === suppliers.length && (params.suids = [])
            stockApi.Report_Procurement_ReturnExcel(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
            });
        },
        checkAllStoreHandle() {
            const { queryEntity, storeList } = this
            if (queryEntity.uids.length === storeList.length) {
                this.queryEntity.uids = []
            } else {
                this.queryEntity.uids = (storeList||[]).map(item => +item.value)
            }
            this.queryEntity.suids = []
            this.queryEntity.page = 1
            this.GetReport_Procurement_Return()
        },

        storeChangeHandle() {
            if (this.queryEntity.uids.length === 1) {
                this.getsupplier_select(this.queryEntity.uids[0])
            }
            this.queryEntity.suids = []
            this.queryEntity.page = 1
            this.GetReport_Procurement_Return()
        },
        checkAllSupplierHandle() {
            const { queryEntity, suppliers } = this
            if (queryEntity.suids.length === suppliers.length) {
                this.queryEntity.suids = []
            } else {
                this.queryEntity.suids = suppliers.map(item => +item.value)
            }
            this.queryEntity.page = 1
            this.GetReport_Procurement_Return()
        },
        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(item => { return { label: item.sv_us_name, value: +item.user_id, uset_type: item.user_tye } });
            });
        },
        getsupplier_select(u_id) {                           // 获取供应商列表
            stockApi.getsupplier_select({ u_id }).then(res => {
                this.suppliers = (res||[]).map(item => { return { label: item.sv_suname, value: +item.id } })
            })
        },
        GetReport_Procurement_Return() {                               // 获取采购报表数据
            const { queryEntity, storeList, suppliers } = this
            const params = { ...queryEntity }
            params.uids.length === storeList.length && (params.uids = [])
            params.suids.length === suppliers.length && (params.suids = [])
            stockApi.GetReport_Procurement_Return(params).then(res => {
                if (!this.$app.isNull(res)) {
                    const { values, list } = res
                    const { total } = values || {}
                    this.dataList = list || []
                    this.total = total;
                }
            });
        },
        //#endregion
    }
}

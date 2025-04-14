import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            storeList: [],                          // 门店数据
            queryEntity: {                          // 查询实体
                user_id: "",                            // 店铺id集合
                date_start: '',                          // 开始时间
                date_end: '',                            // 结束时间
                page: 1,                           // 页码
                pagesize: 10                            // 页数
            },
            total: 0,
            dataList: [],
            currentShopIds: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.queryEntity.date_start = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.date_end = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    },
    methods: {
        //#region   事件
        changeHandle() {
            this.queryEntity.page = 1
            this.SetmealRechargeCommission()
        },
        checkAllHandle() {
            const { currentShopIds, storeList } = this
            if (currentShopIds.length === storeList.length) {
                this.currentShopIds = []
            } else {
                this.currentShopIds = storeList.map(item => `${item.value}`)
            }
            this.queryEntity.page = 1
            this.SetmealRechargeCommission()
        },
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.date_start = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.date_end = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.page = 1;
            this.SetmealRechargeCommission()
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.page = index;
            if (type === 'size') this.queryEntity.page = 1, this.queryEntity.pagesize = index;
            this.SetmealRechargeCommission();
        },
        handleDownload() {                                  // 导出
            const { queryEntity, currentShopIds } = this
            if (currentShopIds.length === 0) {
                this.$message({ message: '请至少选择一间店铺', type: 'warning' });
                return
            }
            if (!queryEntity.date_start || !queryEntity.date_end) {
                this.$message({ message: '请选择查询时间', type: 'warning' });
                return
            }
            const params = {
                user_id: queryEntity.user_id,
                date_start: queryEntity.date_start,
                date_end: queryEntity.date_end
            }
            stockApi.GetTableAnalysis_Excel(params).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },

        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.currentShopIds = [`${this.userInfo.user_id}`]
                this.SetmealRechargeCommission();
            });
        },
        SetmealRechargeCommission() {                       // 获取商品业绩数据
            const { currentShopIds, storeList } = this
            this.queryEntity.user_id = currentShopIds.length === storeList.length ? '-1' : currentShopIds.join(',')
            stockApi.GetTableAnalysis(this.queryEntity).then(res => {
                const { total, list } = res
                this.total = total
                this.dataList = list
            });
        },
        //#endregion
    }
}

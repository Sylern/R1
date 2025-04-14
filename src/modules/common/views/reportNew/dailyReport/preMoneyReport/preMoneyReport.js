import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            shopList: [],                           // 门店数据
            queryEntity: {                          // 查询实体
                shopId: '',                             // 店铺id
                filter: '',                             // 搜索输入
                startTime: '',                          // 开始时间
                endTime: '',                            // 结束时间
                pageIndex: 1,                           // 页码
                pageSize: 10                            // 页数
            },
            total: 0,
            infos: {
                totalDeductionMoney: 0,
                totalMoney: 0,
                totalRefundMoney: 0,
            },
            dataList: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.queryEntity.startTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.endTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    },
    methods: {
        //#region   事件
        handleClearQuery() {
            this.queryEntity = {                        // 查询实体
                shopId: this.userInfo.user_id,          // 店铺id
                filter: '',
                startTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                endTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                pageIndex: 1,
                pageSize: 10
            }
            this.getPrepaymentList();
        },
        handleSearch() {
            this.queryEntity.pageIndex = 1;
            this.getPrepaymentList();
        },
        handleDownload() {                                  // 导出
            const { queryEntity } = this
            if (!queryEntity.startTime || !queryEntity.endTime) {
                this.$message({ message: '请选择查询时间', type: 'warning' });
                return
            }
            const params = {
                shopId: queryEntity.shopId,
                startTime: queryEntity.startTime,
                endTime: queryEntity.endTime
            }
            stockApi.downloadPrepaymentList(params).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.startTime = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.endTime = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.pageIndex = 1;
            this.getPrepaymentList();
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            this.getPrepaymentList();
        },
        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.shopList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id } });
                this.queryEntity.shopId = this.userInfo.user_id;
                this.getPrepaymentList();
            });
        },
        getPrepaymentList() {                               // 获取预付金列表
            stockApi.getPrepaymentList(this.queryEntity).then(res => {
                const { total, datas, infos } = res;
                this.total = total;
                this.dataList = datas;
                this.infos = infos;
                this.$nextTick(() => {
                    !!this.$refs.myTable && this.$refs.myTable.onReset();
                })
            });
        },
        handleReturn(item) {                                // 预付金退款
            this.$confirm('是否操作预付金退款？').then(_ => {
                let query = {
                    id: item.id,
                    password: '',
                    remark: '预付金退款'
                }
                stockApi.preOrderReturn(query).then(res => {
                    if (res) {
                        this.getPrepaymentList();
                    }
                });
            }).catch(_ => {

            });
        },
        //#endregion
    }
}

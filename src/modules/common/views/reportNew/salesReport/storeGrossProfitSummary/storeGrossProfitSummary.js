import { stockApi } from '@/api/index';
export default {
    data() {
        return {
            dialogDownloadRepeatVisible: false,     // 重复导出申请弹窗
            repeatInfo: {                           // 重复流水单号
                code: '',
                url: ''
            },
            tableHeader: [],                            // 表头数据
            tableJson: [],                              // 表格数据
            storeList: [],                              // 门店数据
            queryEntity: {                              // 查询数据
                u_list: [],                                 // 门店id
                date: '',                                   // 时间
                date_type: 2,                               // 按年查询还是按月查询  1-年 2-月
                page: 1,
                pagesize: 10
            },
            total: 0                                    // 总数
        }
    },
    computed: {
        storeListAll() {
            if (this.queryEntity.date_type === 1) return this.storeList;
            let json = [...this.storeList];
            json.unshift({ label: '全部', value: -1 });
            return json;
        }
    },
    watch: {
        'queryEntity.date'(newVal, oldVal) {
            if (!this.$app.isNull(newVal))
                this.queryEntity.u_list = [], this.handleReset();
        },
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.handleReset();                             // 查询
    },
    methods: {
        //#region   事件
        handleDownload() {                              // 报表导出
            if (this.$app.isNull(this.tableJson)) return this.$message.warning('没有导出数据')
            this.queryEntity.page = 1;
            let { u_list, date, date_type, page, pagesize } = this.queryEntity;
            u_list = this.$app.isNull(u_list) ? [] : u_list[0] === -1 ? this.storeList.map(e => { return e.value }) : date_type === 2 ? u_list : [u_list];
            let obj = { u_list, date, date_type, page, pagesize }
            stockApi.expertStore_sales_profit_list(obj).then(res => {
                if (res) {
                    this.dialogDownloadRepeatVisible = true;
                    this.repeatInfo = JSON.parse(res);
                } else {
                    this.$message({ showClose: true, message: '导出申请成功!正在前往报表下载列表...', type: 'success' })
                    setTimeout(() => {
                        this.$router.push('/downloadReport');
                    }, 2000);
                }
            });
        },
        repeatDownloadEnter() {                                   // 点击确定下载
            this.dialogDownloadRepeatVisible = false;
            this.$app.downloadUrl(this.repeatInfo.url);
        },
        handleReset(index) {
            this.queryEntity.page = index || 1;
            let { u_list, date, date_type, page, pagesize } = this.queryEntity;
            u_list = this.$app.isNull(u_list) ? [] : u_list[0] === -1 ? this.storeList.map(e => { return e.value }) : date_type === 2 ? u_list : [u_list];
            let obj = { u_list, date, date_type, page, pagesize }
            this.GetStore_sales_profit_list(obj);
        },
        handleChangeUList(newVal) {
            if (this.queryEntity.date_type === 2) {
                let val = this.$app.isNull(newVal) ? [] : newVal[newVal.length - 1];
                this.queryEntity.u_list = val === -1 ? [-1] : newVal.filter(e => e !== -1);
            }
            this.handleReset();
        },
        handleSetType(code) {
            if (code === this.queryEntity.date_type) return;
            this.queryEntity.date_type = code;
            this.queryEntity.date = '';
        },
        handleCurrentSize(index, type) {
            if (type === 'current') this.queryEntity.page = index;
            if (type === 'size') this.queryEntity.page = 1, this.queryEntity.pagesize = index;
            this.handleReset(this.queryEntity.page);
        },

        //#endregion

        //#region   获取数据

        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                // this.storeList.unshift({ label: '全部', value: '' });
            });
        },
        GetStore_sales_profit_list(obj) {                   // 查询数据
            stockApi.GetStore_sales_profit_list(obj).then(res => {
                this.tableHeader = this.$app.isNull(res.stagetitle) ? [] : res.stagetitle;
                this.tableJson = this.$app.isNull(res.stagecontent) ? [] : res.stagecontent;
                this.total = res.total;

                this.$nextTick(() => {
                    this.$refs.myTable && this.$refs.myTable.onReset();
                })
            });
        }

        //#endregion
    }
}

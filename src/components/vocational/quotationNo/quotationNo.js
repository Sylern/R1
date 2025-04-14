import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Object, default: { id: '', code: '' } }
    },
    data() {
        return {
            typeData: [{ id: 1, label: '采购进货' }, { id: 2, label: '调货入库单' }, { id: 3, label: '仓库拨入单' }/* , { id: 4, label: '商品拨入单' } */],
            checkedType: { id: 1, label: '采购进货' },              // 选中的type类型
            dateTime: [],                                           // 日期
            keywards: '',                                           // 单据编码
            page: 1,                                                // 页数
            pagesize: 10,                                           // 页码
            total: 0,                                               // 总数
            tableData: [],                                          // 表格数据
            checkedRowId: '',                                       // 选中的单据ID
            checkedRow: {},                                         // 选中的数据
        }
    },
    computed: {
        dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } },
    },
    mounted() {
        const end = new Date();
        const start = new Date(new Date().setDate((new Date().getDate() - 6)));
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        this.dateTime = [start, end];
        this.getTable();
    },
    watch: {
        dataJson: {
            deep: true,
            handler: function (newVal, oldVal) {
                this.checkedRowId = this.$app.isNull(newVal) ? '' : newVal.id;
            }
        },
        tableData: {
            deep: true,
            handler: function (newVal, oldVal) {
                let obj = { ...this.checkedRow };
                let item = this.$app.isNull(obj) ? {} : newVal.find(e => e.id === obj.id && e.sv_pc_noid === obj.sv_pc_noid);
                if (!this.$app.isNull(item)) {
                    this.checkedRow = item;
                }
            }
        },
        checkedRowId: {
            deep: true,
            handler(newVal, oldVal) {
                this.checkedRow = this.$app.isNull(newVal) ? {} : this.tableData.find(e => e.id === newVal);
            }
        }
    },
    methods: {
        handleType(item) {                                    // 选择采购进货-调货入库-仓库拨入单-商品拨入单
            this.checkedType = item;
            this.handleReset();
        },
        handleChangeTime(date) {                              // 选择日期
            this.dateTime = date;
            this.handleReset();
        },
        getprocurement() {                                    // 获取采购进货单
            let query = this.getQuery();
            stockApi.getprocurement(query).then(res => {
                this.tableData = res.list.map(e => {
                    e.name = this.checkedType.label;
                    e.sv_pc_cdate = this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd');
                    return e;
                });
                this.total = res.total;
            });
        },
        getEnterStocklist() {                                 // 获取调货入库单
            let query = this.getQuery();
            stockApi.getEnterStocklist(query).then(res => {
                this.tableData = res.list.map(e => {
                    e.name = this.checkedType.label;
                    e.sv_pc_cdate = this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd');
                    return e;
                });
                this.total = res.total;
            });
        },
        getreturnprocurement() {                              // 获取仓库拨入单
            let query = this.getQuery();
            stockApi.getreturnprocurement(query).then(res => {
                this.tableData = res.list.map(e => {
                    e.name = this.checkedType.label;
                    e.sv_pc_cdate = this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd');
                    return e;
                });
                this.total = res.total;
            });
        },
        getTransfersRecordList() {                            // 获取商品拨入单
            let query = this.getQuery();
            stockApi.getTransfersRecordList(query).then(res => {
                this.tableData = res.list.map(e => {
                    e.name = this.checkedType.label;
                    e.sv_pc_cdate = this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd');
                    return e;
                });
                this.total = res.total;
            });
        },
        getTable() {                                          // 获取表单数据
            switch (this.checkedType.id) {
                case 1: this.getprocurement(); break;
                case 2: this.getEnterStocklist(); break;
                case 3: this.getreturnprocurement(); break;
                case 4: this.getTransfersRecordList(); break;
                default: break;
            }
        },
        getQuery() {                                          // 获取查询数据

            return {
                page: this.page,
                pagesize: this.pagesize,
                start_date: this.$app.currentTime(this.dateTime[0], 'yyyy-MM-dd HH:mm:ss'),
                end_data: this.$app.currentTime(this.dateTime[1], 'yyyy-MM-dd HH:mm:ss'),
                keywards: this.keywards
            }
        },
        handleCurrentChange(index) {                          // 分页显示
            this.page = index;
            this.getTable();
        },
        handleReset() {                                       // 重置查询
            if (this.$app.isNull(this.dateTime)) return this.$message({ message: '请选择查询日期', type: 'warning' });
            this.page = 1;
            this.getTable();
        },
        getprocUrementoDall(obj) {                            // 获取采购订单内的商品
            stockApi.getprocUrementoDall(obj).then(res => {
                if (res) {
                    this.dialogVisible = false;
                    let list = this.$app.isNull(res.list) ? [] : res.list[0].prlist;
                    this.$emit('callback', { data: obj, list: list });
                }
            });
        },
        getEnterStockinfo(obj) {                                 // 获取调货内的商品
            stockApi.getEnterStock_info(obj).then(res => {
                if (res) {
                    this.dialogVisible = false;
                    let list = this.$app.isNull(res.list) ? [] : res.list[0].prlist;
                    this.$emit('callback', { data: obj, list: list });
                }
            });
        },
        getreturnprocUrementoDall(obj) {                         // 获取仓库拨入单的商品
            stockApi.getreturnprocUrementoDall(obj).then(res => {
                if (res) {
                    this.dialogVisible = false;
                    let list = this.$app.isNull(res.list) ? [] : res.list[0].prlist;
                    this.$emit('callback', { data: obj, list: list });
                }
            });
        },
        getStoreStockRecordInfo(obj) {                           // 获取商品拨入单的商品
            stockApi.getStoreStockRecordInfo(obj).then(res => {
                if (res) {
                    this.dialogVisible = false;
                    let list = this.$app.isNull(res.list) ? [] : res.list[0].prlist;
                    this.$emit('callback', { data: obj, list: list });
                }
            });
        },
        handleSubmit() {                                      // 提交回调
            if (this.$app.isNull(this.checkedRow))
                return this.$message({ message: '请选择单据！', type: 'warning' });

            if (this.checkedRow.id !== this.dataJson.id && this.dataJson.code !== this.checkedRow.sv_pc_noid) {
                let obj = { id: this.checkedRow.id, code: this.checkedRow.sv_pc_noid };
                switch (this.checkedType.id) {
                    case 1: this.getprocUrementoDall(obj); break;
                    case 2: this.getEnterStockinfo(obj); break;
                    case 3: this.getreturnprocUrementoDall(obj); break;
                    case 4: this.getStoreStockRecordInfo(obj); break;
                    default: break;
                }
            } else {
                this.dialogVisible = false;
            }
        },
    }
}
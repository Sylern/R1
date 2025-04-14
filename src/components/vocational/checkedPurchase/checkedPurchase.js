/* 
     visible-实现弹出选择商品
     checkedJson - 设置选中的数据 以Id为主
*/
import { stockApi } from '@/api/index';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        checkedJson: { type: Object, default: () => { return { id: '' } } },
        queryInfo: {type: Object, default: () => { return { id: -1, supp_id: -1 } }}
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            supplierNameList: [],                           // 供应商信息
            warehouseNameList: [],                          // 获取仓库名称信息
            dateTime: [],                                   // 制单日期
            tableData: [],                                  // 列表数据
            total: 0,                                       // 列表总数
            firstLoad: true,
            queryEntity: {
                page: 1,                                        // 页数
                pageSize: 10,                                   // 页码
                id: -1,                                         // 仓库-门店
                supp_id: -1,                                    // 供应商Id
                keywards: '',                                   // 单据号
                start_date: '',                                 // 开始时间
                end_date: ''                                    // 结束时间
            },
            checkedRadio: '',                                // 选中的单据Id
            checkedItem: {},                                 // 选中的单据数据
        }
    },
    watch: {
        'queryEntity.supp_id': {                         // 监听供应商Id是否发生变化
            handler(newVal, oldVal) { 
                if (!this.firstLoad) {this.queryEntity.page = 1; this.getProcurement_complete(); }
            }
        },
        'queryEntity.id': {                              // 监听仓库-门店是否发生变化
            handler(newVal, oldVal) { 
                if (!this.firstLoad) {this.queryEntity.page = 1; this.getProcurement_complete(); }
            }
        },
        checkedRadio: {                                  // 监听表格内的单选框是否发生变化
            handler(newVal, oldVal) { this.checkedItem = this.$app.isNull(newVal) ? '' : this.tableData.find(e => e.id === newVal) }
        },
        checkedJson: {
            handler(newVal, oldVal) { this.checkedRadio = this.$app.isNull(newVal.id) ? this.checkedRadio : newVal.id }
        },
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.queryEntity.page = 1;
                    this.queryEntity.id = this.queryInfo.id;
                    this.queryEntity.supp_id = this.queryInfo.supp_id || -1;
                    this.getProcurement_complete(); 
                } else {
                    this.firstLoad = true;
                    this.tableData = [];
                }
            }
        }
    },
    computed: {
        dialogVisible: { get() { return this.visible; }, set(value) { 
            this.checkedRadio = '';
            this.$emit('update:visible', value);
         } },
    },
    mounted() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.dateTime = [start, end];
        this.queryEntity.start_date = this.$app.currentTime(start, 'yyyy-MM-dd') + ' 00:00';
        this.queryEntity.end_date = this.$app.currentTime(end, 'yyyy-MM-dd') + ' 23:59';
        this.getsupplier_select();                                // 获取供应商信息
        this.getWarehouse();                                      // 获取仓库-门店信息
    },
    methods: {
        handleSearch() {
            this.queryEntity.page = 1; 
            this.getProcurement_complete();
        },
        handleSubmit() {                                          // 返回选中的采购单数据
            this.dialogVisible = false;
            this.$emit('callback', { ...this.checkedItem });
        },
        handleChangeTime(date) {                                  // 选择制单日期-设置起止时间
            this.queryEntity.start_date = this.$app.currentTime(date[0], 'yyyy-MM-dd') + ' 00:00';
            this.queryEntity.end_date = this.$app.currentTime(date[1], 'yyyy-MM-dd') + ' 23:59';
            this.queryEntity.page = 1; this.getProcurement_complete();
        },
        handleCurrentChange(item) {                               // 分页更改页数
            this.queryEntity.page = item;
            this.getProcurement_complete();
        },
        getProcurement_complete() {               // 获取采购入库单列表
            stockApi.getProcurement_complete(this.queryEntity).then(res => {
                if (res) {
                    this.firstLoad = false;
                    this.tableData = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let sv_pc_cdate = this.$app.isNull(e.sv_pc_cdate) ? '' : this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd HH:mm:ss');
                        return { ...e, id: e.sv_pc_id, sv_pc_cdate }
                    });
                    this.total = res.total;
                }
            });
        },
        getsupplier_select() {                                    // 获取供应商信息
            stockApi.getsupplier_select().then(res => {
                if (res) {
                    this.supplierNameList = this.$app.isNull(res) ? [] : res.sort((a, b) => a.id - b.id).map(e => { return { label: e.sv_suname, value: e.id }; })
                }
            });
        },
        getWarehouse() {                                          // 获取仓库-门店信息
            stockApi.getWarehouse().then(res => {
                if (res) {
                    this.warehouseNameList = this.$app.isNull(res) ? [] : res.sort((a, b) => a.id - b.id).map(e => { return { label: e.sv_warehouse_name, value: e.sv_warehouse_id +'' }; })
                }
            });
        },
    }
}
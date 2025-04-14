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
        queryData: { type: Object, default: () => { return { type: '' } } }
    },
    data() {
        return {
            supplierNameList: [],                           // 供应商信息
            warehouseNameList: [],                          // 获取仓库名称信息
            tableData: [],                                  // 列表数据
            total: 0,                                       // 列表总数
            queryEntity: {
                page: 1,                                        // 页数
                pagesize: 10,                                   // 页码
                keywards: '',                                   // 单据号
                start_date: '',                                 // 开始时间
                end_date: '',                                   // 结束时间
                type: ''
            },
            checkedRadio: '',                                // 选中的单据Id
            checkedItem: {},                                 // 选中的单据数据
        }
    },
    watch: {
        'queryEntity.supp_id': {                         // 监听供应商Id是否发生变化
            handler(newVal, oldVal) { this.queryEntity.page = 1; this.getStockAllocationInOutlist(); }
        },
        'queryEntity.id': {                              // 监听仓库-门店是否发生变化
            handler(newVal, oldVal) { this.queryEntity.page = 1; this.getStockAllocationInOutlist(); }
        },
        'queryEntity.keywards': {                        // 监听单据号是否发生变化
            handler(newVal, oldVal) { this.queryEntity.page = 1; this.getStockAllocationInOutlist(); }
        },
        checkedRadio: {                                  // 监听表格内的单选框是否发生变化
            handler(newVal, oldVal) { this.checkedItem = this.$app.isNull(newVal) ? '' : this.tableData.find(e => e.id === newVal) }
        },
        checkedJson: {
            handler(newVal, oldVal) { this.checkedRadio = this.$app.isNull(newVal.id) ? this.checkedRadio : newVal.id }
        },
        queryData: {
            deep: true,
            handler: function (newVal, oldVal) {
                if (Object.keys(newVal).length === 0) return;
                if (!this.$app.isNull(oldVal)) {
                    if (this.queryEntity.type !== newVal.type && !this.$app.isNull(newVal.type)) {
                        this.queryEntity.type = newVal.type;
                        this.queryEntity.page = 1;
                        this.getStockAllocationInOutlist();
                    }
                }
            }
        },
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                this.checkedRadio = '';
                this.$emit('update:visible', value);
            }
        },

    },
    mounted() {
        // this.getStockAllocationInOutlist();                       // 获取列表
    },

    methods: {
        handleSubmit() {                                          // 返回选中的采购单数据
            this.dialogVisible = false;
            this.$emit('callback', { ...this.checkedItem });
        },
        handleChangeTime(date) {                                  // 选择制单日期-设置起止时间
            this.queryEntity.start_date = this.$app.currentTime(date[0], 'yyyy-MM-dd') + ' 00:00';
            this.queryEntity.end_date = this.$app.currentTime(date[1], 'yyyy-MM-dd') + ' 23:59';
            this.queryEntity.page = 1; this.getStockAllocationInOutlist();
        },
        handleCurrentChange(item) {                               // 分页更改页数
            this.queryEntity.page = item;
            this.getStockAllocationInOutlist();
        },
        getStockAllocationInOutlist() {                           // 获取单据列表
            stockApi.getStockAllocationInOutlist(this.queryEntity).then(res => {
                if (res) {
                    this.tableData = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let sv_pc_cdate = this.$app.isNull(e.sv_pc_cdate) ? '' : this.$app.currentTime(new Date(e.sv_pc_cdate), 'yyyy-MM-dd');
                        let { sv_suname, warehouseName } = e;
                        sv_suname = this.$app.isNull(sv_suname) ? '' : sv_suname;
                        warehouseName = this.$app.isNull(warehouseName) ? '' : warehouseName;
                        let sv_suname_warehouseName = sv_suname + warehouseName;
                        return { ...e, id: e.sv_pc_id, sv_pc_cdate, sv_suname_warehouseName }
                    });
                    this.total = res.total;
                }
            });
        }
    }
}
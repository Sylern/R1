import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: [] },
    },
    data() {
        return {
            initEntity: {                       // 页面显示数据
                tableJson: [],                      // 表格数据
                total: 0                            // 总数
            },
            checkedJson: [],                    // 选中的数据
            queryEntity: {                      // 查询实体
                producttype_id: -1,                 // 0-产品类型  1-服务产品  -1-全部
                keywards: '',                       // 模糊查询实体
                page: 1,                            // 页数
                pagesize: 10                        // 页码
            }
        }
    },
    computed: {
        // dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } },
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        tableJson() {                           // 表格显示数据
            let json = [...this.initEntity.tableJson];
            if (!this.$app.isNull(json))
                json = json.map(item => { item.rowChecked = this.checkedJson.findIndex(e => e.id === item.id) > -1 ? true : false; return item; });
            return json;
        }
    },
    watch: {
        dataJson: {                             // 监听传输过来的数据
            deep: true,
            handler: function (newVal, oldVal) {
                this.checkedJson = !this.$app.isNull(newVal) ? newVal : [];
            }
        },
    },
    mounted() {
        this.GetChargingList();                             // 获取加料列表
    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        //#region       事件
        handleSubmit() {                                    // 确定选中数据
            let obj = this.checkedJson.map(e => { return { id: e.id, name: e.name, code: e.code } });
            this.$emit('callback', obj);
            this.closeDialog();
        },
        handleCurrentChange(page) {                         // 分页更改页数
            this.queryEntity.page = page; this.GetChargingList();
        },
        handleSearchRe() {                                  // 初始化查询
            this.queryEntity.page = 1; this.queryEntity.pagesize = 10; this.GetChargingList();
        },
        handleSelect(row, data, checkedBool) {              // 表格单选
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.id === row.id) === -1)
                    this.checkedJson.push(row);
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.id !== row.id);
            }
        },
        handleSelectAll(data, checkedBool) {                // 表格全选 
            let that = this, json = [...this.checkedJson];
            if (checkedBool)
                this.tableJson.forEach(item => {
                    if (that.checkedJson.findIndex(e => e.id === item.id) === -1) json.push(item);
                });
            else
                json = json.filter(item => that.tableJson.findIndex(e => e.id === item.id) === -1);
            this.checkedJson = json;
        },
        //#endregion

        //#region       查询
        GetChargingList() {                                 // 获取加料列表
            stockApi.getProductcategory(this.queryEntity).then(res => {
                if (res) {
                    this.initEntity.total = res.total;
                    this.initEntity.tableJson = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        return { id: e.id, name: e.sv_pc_name, code: e.sv_pc_code }
                    });
                }
            });
        }

        //#endregion
    }
}

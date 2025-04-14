import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: [] }
    },
    data() {
        return {

            tableJson: [],                          // 表格数据
            classJson: [],                          // 分类数据
            checkedClass: [-1],                     // 选中的分类
            checkedJson: [],                        // 选中的原料
            total: 0,                               // 总数
            queryEntity: {                          // 原料列表查询实体
                keywards: '',                           // 模糊查询
                page: 1,                                // 页码
                pagesize: 10                            // 页数
            }

        }
    },
    computed: {
        dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } },
        tableData() {                           // 表格显示数据
            let json = [...this.tableJson];
            if (!this.$app.isNull(json))
                json = json.map(item => {
                    item.rowChecked = this.checkedJson.findIndex(e => e.id === item.id) > -1 ? true : false;
                    return item;
                });
            return json;
        }
    },
    watch: {
        dataJson: {                             // 监听传输过来的数据
            deep: true, immediate: true,
            handler: function (newVal, oldVal) {
                
                this.checkedJson = !this.$app.isNull(newVal) ? newVal : [];

            }
        },
    },
    mounted() {
        this.GetProductcategory_Material();                                 // 获取原料分类
        this.Getv_product_printing_Material();                              // 获取原料列表
    },
    methods: {


        //#region       事件

        handleClass(obj) {                                                  // 选中分类 并展开
            let { item, type } = obj;
            if (type === 'one') item.isCheck = !item.isCheck, this.checkedClass = [item.id];
            if (type === 'two') this.checkedClass = [item.parentid, item.id];
            this.handleSearchRe();
        },
        handlePagination(index, type) {                                     // 分页事件
            if (type === 'current') this.queryEntity.page = index;
            else if (type === 'size') this.queryEntity.pagesize = index;
            this.Getv_product_printing_Material();
        },
        handleSearchRe() {                                                  // 初始化查询
            this.queryEntity.page = 1; this.queryEntity.pageSize = 10; this.Getv_product_printing_Material();
        },
        handleSelect(row, data, checkedBool) {                              // 表格单选
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.id === row.id) === -1)
                    this.checkedJson.push(row);
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.id !== row.id);
            }
        },
        handleSelectAll(data, checkedBool) {                                // 表格全选 
            let that = this, json = [...this.checkedJson];
            if (checkedBool)
                this.tableJson.forEach(item => {
                    if (that.checkedJson.findIndex(e => e.id === item.id) === -1) json.push(item);
                });
            else
                json = json.filter(item => that.tableJson.findIndex(e => e.id === item.id) === -1);
            this.checkedJson = json;
        },
        handleSubmit() {                                                    // 返回选中的商品
            let obj = this.$app.isNull(this.checkedJson) ? [] : this.checkedJson.map(e => {
                return { id: e.id, name: e.name, unit: e.unit }
            });
            this.$emit('callback', obj);
            this.dialogVisible = false;
        },

        //#endregion

        //#region       获取原料分类

        GetProductcategory_Material() {                                     // 获取原料分类
            stockApi.GetProductcategory_Material().then(res => {
                if (res) {
                    this.classJson = this.$app.isNull(res) ? [] : res.map(e => {
                        let children = this.$app.isNull(e.children) ? [] : e.children.map(e => { return { id: e.id, name: e.label, parentid: e.parentid } });
                        return { id: e.id, name: e.label, isCheck: false, children }
                    });
                    this.classJson.unshift({ id: -1, name: '全部', isCheck: false, children: [] });
                }
            });
        },
        Getv_product_printing_Material() {                                  // 获取原料列表
            let obj = { ...this.queryEntity };
            if (!this.$app.isNull(this.checkedClass[0]) && this.checkedClass[0] !== -1) obj['Pc_ids'] = this.checkedClass[0];
            if (!this.$app.isNull(this.checkedClass[1])) obj['Psc_ids'] = this.checkedClass[1];
            stockApi.Getv_product_printing_Material(obj).then(res => {
                this.tableJson = this.$app.isNull(res.list) ? [] : res.list.map(e => { return { ...e, id: e.product_id, name: e.sv_p_name, unit: e.sv_p_unit } });
                this.total = res.total;
            });
        },


        //#endregion

    }
}

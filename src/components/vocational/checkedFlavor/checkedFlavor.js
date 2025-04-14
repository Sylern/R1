import { stockApi } from '@/api/index';
export default {
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: [] },
        entityObj: { type: Object, default: { sv_tastegroup_id: 0, is_enable_group_id: false } }
    },
    data() {
        return {
            initEntity: {                       // 页面显示数据
                tableJson: [],                      // 表格数据
                total: 0                            // 总数
            },
            checkedJson: [],                    // 选中的数据
            queryEntity: {                      // 查询实体
                sv_tastegroup_id: 0,                // 组id
                is_enable_group_id: false,          // 是否启用组id条件
                keywards: '',                       // 模糊查询实体
                page: 1,                            // 页数
                pageSize: 10                        // 页码
            }
        }
    },
    computed: {
        dialogVisible: { get() { 
            if (this.visible) this.GetTasterePageList();
            return this.visible;
         }, set(value) { this.$emit('update:visible', value); } },

        tableJson() {                           // 表格显示数据
            let json = [...this.initEntity.tableJson];
            if (!this.$app.isNull(json))
                json = json.map(item => { item.rowChecked = this.checkedJson.findIndex(e => e.id === item.id) > -1 ? true : false; return item; });
            return json;
        }
    },
    watch: {
        entityObj: {                             // 监听传输过来的数据
            deep: true,
            handler: function (newVal, oldVal) {
                if (!this.$app.isNull(newVal.sv_tastegroup_id)) this.queryEntity.sv_tastegroup_id = newVal.sv_tastegroup_id;
                if (!this.$app.isNull(newVal.is_enable_group_id)) this.queryEntity.is_enable_group_id = newVal.is_enable_group_id;
            }
        },
    },
    mounted() {
        // this.GetTasterePageList();                          // 获取口味列表
    },
    methods: {

        //#region       事件

        handleSubmit() {                                    // 确定选中数据
            let obj = this.checkedJson.map(e => { return { id: e.id, name: e.name, price: e.price, grouping: 0 } });
            this.$emit('callback', obj);
            this.dialogVisible = false;
        },
        handleCurrentChange(page) {                         // 分页更改页数
            this.queryEntity.page = page; this.GetTasterePageList();
        },
        handleSearchRe() {                                  // 初始化查询
            this.queryEntity.page = 1; this.queryEntity.pageSize = 10; this.GetTasterePageList();
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

        GetTasterePageList() {                              // 获取口味列表
            stockApi.GetTastereList(this.queryEntity).then(res => {
                if (res) {
                    this.initEntity.total = res.total;
                    this.initEntity.tableJson = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        return { id: e.sv_taste_id, name: e.sv_taste_name, price: e.sv_taste_price.toFixed(2), priceName: '￥' + e.sv_taste_price.toFixed(2) }
                    });
                }
            });
        },

        //#endregion
    }
}

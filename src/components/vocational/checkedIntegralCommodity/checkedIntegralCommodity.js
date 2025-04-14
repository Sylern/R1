/* 
    dataJson-选中的商品，以商品id为主， visible-实现弹出选择商品
    queryEntity-查询实体，checkedOneId-一级分类 默认 -1 全部   checkedTowId-二级分类 默认为空  keywards-商品名称-条码 默认为空 id-仓库门店id
    commodityType-商品接口类型 default-调用普通的接口  queryId-调用带仓库门店id查询接口 storeId-调用分门店的查询接口 
*/
import { stockApi } from '@/api/index';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: ()=>[] },
        isRadio: { type: Boolean, default: false },
        isOffline: { type: Boolean, default: false },                   // 营销模块传true
        commodityType: { type: Object, default: () => { return { type: 'default', id: '', price_type: '' } } },
        queryEntity: { type: Object, default: () => { return { checkedOneId: -1, checkedTowId: '', keywards: '' } } },
        checkedClass: { type: Array, default: () => { return [] } }
    },
    data() {
        return {
            keywards: '',                           // 商品名称-编码
            total: 0,                               // 商品总数
            page: 1,                                // 页数
            pagesize: 10,                           // 页码
            checkedRadio: '',                       // 所选中的单据
            checkedItem: {},                        // 单选时选中的商品
            checkedJson: [],                        // 选中的商品
            tableData: []
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                if (this.checkedJson.length !== this.dataJson.length && !value) {
                    this.checkedJson = [...this.dataJson];
                    let tableRef = this.$refs.myTable, that = this;
                    this.tableData.forEach(item => {
                        if (that.dataJson.findIndex(e => e.sv_gift_id === item.sv_gift_id) > -1) {
                            tableRef.taggleRowSelection(item.sv_gift_id, true);
                        } else {
                            tableRef.taggleRowSelection(item.sv_gift_id, false);
                        }
                    });
                    this.setTabelChecked();
                }
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    mounted() {
        this.getProductList()
    },
    watch: {
        dataJson: {
            deep: true,
            handler: function (newVal, oldVal) {
                this.checkedJson = !this.$app.isNull(newVal) ? newVal : [];
                this.setTabelChecked();
            }
        },
        checkedRadio: {                                 // 监听表格内的单选框是否发生变化
            handler(newVal, oldVal) {
                if (this.isOffline) return this.checkedItem = this.$app.isNull(newVal) ? '' : this.tableData.find(e => e.sv_integral_id === newVal);
                this.checkedItem = this.$app.isNull(newVal) ? '' : this.tableData.find(e => e.sv_gift_id === newVal);
            }
        },
        isRadio: {
            handler(newVal, oldVal) {
                this.$refs.myTable && this.$refs.myTable.onReset();
            }
        }
    },
    methods: {
        handleSelectAll(data, checkedBool) {                                // 表格全选
            let that = this, json = [...this.checkedJson];
            if (checkedBool) {
                this.tableData.forEach(item => {
                    if (this.isOffline) {
                        if (that.checkedJson.findIndex(e => e.sv_integral_id === item.sv_integral_id) === -1)
                        json.push(item);
                        return
                    }
                    if (that.checkedJson.findIndex(e => e.sv_gift_id === item.sv_gift_id) === -1)
                        json.push(item);
                });
            } else {
                if (this.isOffline) {
                    json = json.filter(item => that.tableData.findIndex(e => e.sv_integral_id === item.sv_integral_id) === -1)
                    return
                }
                json = json.filter(item => that.tableData.findIndex(e => e.sv_gift_id === item.sv_gift_id) === -1)
            }
            this.checkedJson = json;
        },
        handleSelect(row, data, checkedBool) {                              // 表格行数据选择
            if (checkedBool) {
                if (this.isOffline) {
                    if (this.checkedJson.findIndex(e => e.sv_integral_id === row.sv_integral_id) === -1)
                    this.checkedJson.push(row);
                    return
                }
                if (this.checkedJson.findIndex(e => e.sv_gift_id === row.sv_gift_id) === -1)
                    this.checkedJson.push(row);
            } else {
                if (this.isOffline) {
                    this.checkedJson = this.checkedJson.filter(e => e.sv_integral_id !== row.sv_integral_id);
                    return
                }
                this.checkedJson = this.checkedJson.filter(e => e.sv_gift_id !== row.sv_gift_id);
            }
        },
        setTabelChecked() {                                                 // 表格设置选中
            let json = [... this.tableData], that = this;
            json.map(item => {
                if (this.isOffline) {
                    item.rowChecked = that.checkedJson.findIndex(e => e.sv_integral_id === item.sv_integral_id) > -1 ? true : false;
                }else {
                    item.rowChecked = that.checkedJson.findIndex(e => e.sv_gift_id === item.sv_gift_id) > -1 ? true : false;
                }
                return { ...item };
            });
            this.tableData = json;
        },
        getProductList() {                                                  // 获取商品
            if (this.isOffline) {
                let query = {
                    page: this.page,
                    pagesize: this.pagesize,
                    // user_id: this.$app.getLocalStorage('userId'),
                    keywards: this.keywards,
                }
                stockApi.getIntegralProductInfo(query).then(res => {
                    if (res) {
                        this.tableData = this.$app.isNull(res) ? [] : res.dataList;
                        this.total = res.total;
                        this.setTabelChecked();
                    }
                });
                return
            }
            let query = {
                PageIndex: this.page,
                PageSize: this.pagesize,
                // user_id: this.$app.getLocalStorage('userId'),
                Seach: this.keywards,
            }
            stockApi.getGiftList(query).then(res => {
                if (res) {
                    this.tableData = this.$app.isNull(res) ? [] : res.list;
                    this.total = res.total;
                    this.setTabelChecked();
                }
            });
        },
        handleSizeChange(pagesize) {                                        // 改变每页条数
            this.pagesize = pagesize;
            this.getProductList();
        },
        handleCurrentChange(page) {                                         // 分页更改页数
            this.page = page;
            this.getProductList();
        },
        handleSubmit() {                                                    // 返回选中的商品
            let obj = [];
            this.dialogVisible = 'close';
            if (this.isRadio) {
                obj.push(this.checkedItem);
            } else {
                obj = [...this.checkedJson];
            }
            this.$emit('callback', obj);
        }
    }
}
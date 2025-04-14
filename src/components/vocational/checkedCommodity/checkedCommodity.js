/* 
    dataJson-选中的商品，以商品id为主， visible-实现弹出选择商品
    queryEntity-查询实体，checkedOneId-一级分类 默认 -1 全部   checkedTowId-二级分类 默认为空  keywards-商品名称-条码 默认为空 id-仓库门店id
    commodityType-商品接口类型 default-调用普通的接口  queryId-调用带仓库门店id查询接口 storeId-调用分门店的查询接口  rawMaterial-原材料
*/
import base from '@/api/base';
import { stockApi } from '@/api/index';
import dcDialog from '../../common/dcDialog/dcDialog.vue';                                                  // 弹窗
export default {
    components: { dcDialog },
    props: {
        visible: { type: Boolean, default: true },
        title: { type: String, default: '选择商品' },
        dataJson: { type: Array, default: [] },
        showStock: { type: Boolean, default: true },
        jurisdiction: { type: Boolean, default: true },
        isUnitprice: { type: Boolean, default: false },
        isScaleType: { type: Boolean, default: false },         // 条码秤类型
        isRadio: { type: Boolean, default: false },
        commodityType: { type: Object, default: () => { return { type: 'default', id: '', multiUnit: false, filtering_service: false, price_type: '' } } },
        queryEntity: { type: Object, default: () => { return { checkedOneId: -1, checkedTowId: '', keywards: '', type: '', is_verification: false } } },
        checkedClass: { type: Array, default: () => { return [] } },
        importPageSize: { type: Number, default: 0 },
        isProductAdd: { type: Boolean, default: false },
        zIndex: { type: [Number, String], default: 1001 }
        // pricingMethod:{type:String,default:''}
    },
    data() {
        return {
            checkAll: false,
            isIndeterminate: false,
            classData: [],                          // 分类数据集合
            showClassData: [],                      // 分类显示数据集合
            checkedOneId: -1,                       // 选中的一级分类ID
            checkedTowId: '',                       // 选中的二级分类ID
            keywards: '',                           // 商品名称-编码
            type: this.queryEntity.type,            // -1 可查套餐商品
            is_verification: false,                 // 是否查询服务商品  true - 是 false 否
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
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    mounted() {
        let getListType = ['default', 'queryId', 'service', 'serviceExclude', 'coupon'];
        let getProductType = ['default', 'service', 'serviceExclude'];

        if (getListType.includes(this.commodityType.type)) this.getSv_Productcategory_list();
        if (getProductType.includes(this.commodityType.type)) this.getProductList();

        // if (this.commodityType.type === 'default' || this.commodityType.type === 'queryId' || this.commodityType.type === 'service') this.getSv_Productcategory_list();
        // if (this.commodityType.type === 'default' || this.commodityType.type === 'service') this.getProductList();
    },
    watch: {
        dialogVisible: {
            handler: function (newVal, oldVal) {
                this.checkedJson = [...this.dataJson];
                if (newVal && this.tableData.length > 0) {
                    this.page = 1;
                    this.getProductList();
                }
            }
        },
        queryEntity: {
            deep: true,
            handler: function (newVal, oldVal) {
                if (Object.keys(newVal).length === 0) return;
                if (!this.$app.isNull(oldVal)) {
                    if (this.checkedOneId !== oldVal.checkedOneId || this.checkedTowId !== oldVal.checkedTowId || this.keywards !== oldVal.keywards || this.is_verification !== oldVal.is_verification) {
                        this.checkedOneId = this.$app.isNull(newVal.checkedOneId) ? -1 : newVal.checkedOneId;
                        this.checkedTowId = this.$app.isNull(newVal.checkedTowId) ? '' : newVal.checkedTowId;
                        this.keywards = this.$app.isNull(newVal.keywards) ? '' : newVal.keywards;
                        this.is_verification = this.$app.isNull(newVal.is_verification) ? false : newVal.is_verification;
                        this.page = 1, this.getProductList();
                    }
                }
            }
        },
        checkedClass: {
            deep: true,
            handler: function (newVal, oldVal) {
                if (!this.$app.isNull(newVal) && !this.$app.isNull(this.classData)) {
                    this.showClassData = this.classData.filter(e => newVal.findIndex(l => l.id === e.id) > -1);
                    this.checkedOneId = this.$app.isNull(this.showClassData) ? this.checkedOneId : this.showClassData[0].id;
                    this.getProductList();
                }
            }
        },
        commodityType: {
            deep: true,
            handler: function (newVal, oldVal) {
                if (!this.$app.isNull(newVal)) {
                    if (this.commodityType.type === 'queryId' && !this.$app.isNull(newVal.id)) this.getProductList();
                    if (this.commodityType.type === 'storeId' && !this.$app.isNull(newVal.id)) this.getSv_Productcategory_list(), this.getProductList();
                    if (this.commodityType.type === 'service' || this.commodityType.type === 'serviceExclude') this.getProductList();
                    if (this.commodityType.type === 'coupon') this.getProductList();
                    if (this.commodityType.type === 'default' && this.commodityType.type !== oldVal.type) this.getProductList();
                    if (this.commodityType.type === 'rawMaterial') { this.getSv_Productcategory_list(), this.getProductList(); }
                }
            }
        },
        checkedRadio: {                                 // 监听表格内的单选框是否发生变化
            handler(newVal, oldVal) {
                this.checkedItem = this.$app.isNull(newVal) ? '' : this.tableData.find(e => e.product_id === newVal);
            }
        },
        isRadio: {
            handler(newVal, oldVal) {
                this.$refs.myTable && this.$refs.myTable.onReset();
            }
        }
    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handleSelectAll(checkedBool) {                                       // 表格全选
            let json = [...this.checkedJson];
            this.tableData.forEach(item => {
                item.rowChecked = checkedBool;
                if (checkedBool) {
                    if (this.checkedJson.findIndex(e => e.id == (item.id || item.product_id)) === -1) json.push(item)
                } else {
                    json = json.filter(item => this.tableData.findIndex(e => e.id == (item.id || item.product_id)) === -1)
                }
            });
            this.checkedJson = json;
            this.isIndeterminate = false;
        },
        handleSelect(row) {                                                 // 表格行数据选择
            this.handleRow(row)
            this.initAllChecked();
        },
        handleRow(row) {
            const checkedBool = !row.rowChecked;
            row.rowChecked = checkedBool;
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.id == (row.id || row.product_id)) === -1) this.checkedJson.push(row);
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.id != (row.id || row.product_id));
            }
            this.initAllChecked();
        },
        initAllChecked() {                                                  // 设置全选框状态
            const checkedTableItemList = this.tableData.filter(e => e.rowChecked);
            this.isIndeterminate = checkedTableItemList.length > 0 && checkedTableItemList.length < this.tableData.length ? true : false;
            this.checkAll = checkedTableItemList.length === this.tableData.length ? true : false;
        },
        setTabelChecked() {                                                 // 表格设置选中
            this.tableData = [... this.tableData].map(item => {
                item.rowChecked = this.checkedJson.findIndex(e => (e.id || e.product_id) == (item.id || item.product_id)) > -1 ? true : false;
                return { ...item };
            });
            this.initAllChecked();
        },
        getProductList() {                                                  // 获取商品
            let query = {
                pageIndex: this.page,
                pageSize: this.importPageSize || this.pagesize,
                is_verification: this.is_verification,
                filtering_service: this.commodityType.filtering_service,
                user_id: this.$store.state.userInfo.user_id,//this.$app.getlocalStorage('userId'),
                pc_id: this.checkedOneId === -1 ? '' : this.checkedOneId,
                ps_id: this.checkedTowId,
                keywards: this.keywards,
                query_type: this.commodityType.multiUnit ? 2 : null,
                type: this.type,
            }

            let code = 'Getv_product_printing';
            if (this.commodityType.type === 'queryId') code = 'Getproduct_warehouse', query['id'] = this.commodityType.id;
            if (this.commodityType.type === 'storeId') code = 'GetStoreProduct_list', delete query.user_id, query['id'] = this.commodityType.id, query['price_type'] = this.commodityType.price_type;
            if (this.commodityType.type === 'service') code = 'GetServiceProductList', query = { category: this.checkedOneId === -1 ? '' : this.checkedOneId, erjicategory: this.checkedTowId, producttype_id: 1, page: this.page, pagesize: this.pagesize, keywards: this.keywards };
            if (this.commodityType.type === 'serviceExclude') code = 'getReservationProductList', query = { category: this.checkedOneId === -1 ? '' : this.checkedOneId, erjicategory: this.checkedTowId, producttype_id: 1, page: this.page, pagesize: this.pagesize, keywards: this.keywards };
            if (this.commodityType.type === 'coupon') code = 'coupon', query = { coupon_id: this.commodityType.id, pc_id: this.checkedOneId === -1 ? '' : this.checkedOneId, ps_id: this.checkedTowId, pageIndex: this.page, pageSize: this.pagesize, keywards: this.keywards };
            if (this.commodityType.type === 'rawMaterial') {
                code = 'rawMaterial';
                delete query.user_id;
                delete query.type;
                delete query.is_verification;
                delete query.pageIndex;
                delete query.pageSize
                query['pc_id'] = query['pc_id'] || 0
                query['ps_id'] = query['ps_id'] || 0
                query['page'] = this.page;
                query['pagesize'] = this.pagesize;
                query['id'] = !this.$app.isNull(this.commodityType.id) ? this.commodityType.id : [] //通过id数组过滤商品
            }
            stockApi.getCheckedCommodity(code, query).then(res => {
                if (res) {
                    this.tableData = this.$app.isNull(res) ? [] : (res.list || []).map((e, i) => {
                        let sv_pc_price = e.sv_last_purchaseprice > 0 ? e.sv_last_purchaseprice : e.sv_purchaseprice;
                        let sv_p_storage = e.sv_p_storage === 0 ? e.sv_p_total_weight : e.sv_p_storage;
                        let image = this.$app.isNull(e['sv_p_images']) ? [] : JSON.parse(e['sv_p_images']).map(e => { try { return e.code === '[]' ? [] : e.code; } catch (error) { return []; } });
                        image = this.$app.isNull(image) ? [] : image.filter(img => !this.$app.isNull(img));
                        let ischecked = this.isScaleType ? (e.sv_p_artno.length === 5 ? false : true) : false;

                        e.rowChecked = this.checkedJson.findIndex(item => (item.id || item.product_id) == (e.id || e.product_id)) > -1 ? true : false;
                        return { ...e, id: e.product_id_m || e.product_id, sv_pc_price, sv_p_storage, ischecked, image: this.$app.isNull(image) ? [base.frontImgBase + '/images/default.png'] : image.map(e => { return this.$app.fmtImg(e) }) }
                    });
                    this.total = res.total;
                    this.setTabelChecked();
                }
            });
        },
        getSv_Productcategory_list() {                                   // 获取分类
            let queryJson = {};
            if (this.commodityType.type === 'storeId') queryJson['id'] = this.commodityType.id;
            if (this.commodityType.type === 'service') queryJson['type'] = 1;                   // type  0-产品类型,1-服务类型,2-计时类型
            stockApi.getSv_Productcategory_list(queryJson).then(res => {
                if (res) {
                    this.classData = res.map(e => { return { ...e, isCheck: false } });
                    this.classData.unshift({ id: -1, label: '全部', isCheck: false, children: [] });
                    this.showClassData = [...this.classData];
                    this.$nextTick(() => {
                        !!this.$refs.menuLeft && this.$refs.menuLeft.update();
                    })
                }
            });
        },
        handleClass(item, type) {                                           // 选中分类 并展开
            this.showClassData = type === 'one' ? this.showClassData.map(e => { let isCheck = e.id === item.id ? !e.isCheck : false; return { ...e, isCheck } }) : this.showClassData;
            if ((this.checkedOneId === item.id && this.checkedTowId === '') || (this.checkedOneId === item.parentid && this.checkedTowId === item.id)) return;
            if (type === 'one') {
                this.page = 1;
                this.checkedOneId = item.id;
                this.checkedTowId = '';
            } else {
                this.checkedTowId = item.id;
                this.checkedOneId = item.parentid;
            }

            this.getProductList();
        },
        handleSizeChange(pagesize) {                                        // 改变每页条数
            this.pagesize = pagesize;
            this.page = 1
            this.getProductList();
        },
        handleCurrentChange(item) {                                         // 分页更改页数
            this.page = item;
            this.getProductList();
        },
        handleSearchRe() {
            this.page = 1
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
        },
        handleRoute(path) {                                                 // 跳转
            this.$router.push({ path: path })
        }
    }
}
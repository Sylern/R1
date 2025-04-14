import { stockApi } from '@/api';
import { mapState } from 'vuex';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        isContent: { type: Boolean, default: false },
        isSingleAdd: { type: Boolean, default: false },
        isSelf: { type: Boolean, default: false },
        queryData: {
            type: Object, default: () => {
                return {
                    sv_storestock_check_no: '',
                    sv_storestock_check_range: '',
                    sv_warehouse_id: ''
                }
            }
        }
    },
    data() {
        return {
            shwoClearBtn: false,                        // 展示清零按钮
            configData: ['StoreStockCheckManage'],
            queryNotStore: {                            // 未盘商品对象
                sv_storestock_check_no: '',             // 盘点批次号
                sv_storestock_check_range: '',          // 盘点类型(0:全场盘点;1:类别盘点;2:单品盘点)
                sv_warehouse_id: '',                    // 库存ID
                keywards: '',                           // 查询关键词
                page: 1,
                pageSize: 10,
            },
            notStoreList: [],                           // 未盘商品列表
            notStoreSaveList: [],                       // 已勾选的未盘商品
            queryNotStoreTotal: 0,                      // 未盘商品总数
            pswVisible: false,                          // 输入密码弹窗展示状态
            pswText: '',                                // 输入密码
        }
    },
    computed: {
        ...mapState(['JurisdictionObj', 'userInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        hasCheckedItem() {
            return this.notStoreSaveList.length > 0
        },
    },
    watch: {
        'queryData.sv_storestock_check_range': {                          // 监听是否发生变化
            handler(newVal, oldVal) { this.getNotStoreStockCheckProductInfo(); }
        }
    },
    mounted() {
        this.getUserModuleConfigs();
        this.getNotStoreStockCheckProductInfo();
    },
    methods: {
        getUserModuleConfigs() {                                    // 获取配置
            stockApi.getUserModuleConfigs(this.configData).then(res => {
                if (res) {
                    let NotStoreStockCheck_Is_Zero;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'StoreStockCheckManage':
                                NotStoreStockCheck_Is_Zero = item.childInfolist.find(e => e.sv_user_config_code === 'NotStoreStockCheck_Is_Zero');
                                break;
                            default:
                                break;
                        }
                    });
                    if (!this.$app.isNull(NotStoreStockCheck_Is_Zero)) {
                        if (!this.$app.isNull(NotStoreStockCheck_Is_Zero.childDetailList)) {
                            this.shwoClearBtn = NotStoreStockCheck_Is_Zero.childDetailList[0].sv_detail_is_enable;
                        }
                    }
                }
            })
        },
        getNotStoreStockCheckProductInfo(initPage = false) {        // 根据盘点批次号获取未盘点列表
            if (initPage) this.queryNotStore.page = 1;
            let queryNotStore = {
                sv_storestock_check_no: this.queryData.sv_storestock_check_no,                      // 盘点批次号
                sv_storestock_check_range: this.queryData.sv_storestock_check_range,                // 盘点类型(0:全场盘点;1:类别盘点;)
                keywards: this.queryNotStore.keywards,                                              // 查询关键词
                sv_warehouse_id: this.queryData.sv_warehouse_id,
                page: this.queryNotStore.page,
                pageSize: 10,
            }
            stockApi.getNotStoreStockCheckProductInfo(queryNotStore).then(res => {
                if (res) {
                    this.queryNotStoreTotal = res.total;
                    this.notStoreList = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let rowChecked = false;
                        this.notStoreSaveList.map(k => {
                            if (k.id == e.product_id) {
                                rowChecked = true;
                            }
                        })
                        return { ...e, rowChecked, id: e.product_id }
                    });
                }
            });
        },
        notStoreHandleSelectAll(item) {                             // 未盘商品全选
            if (this.$app.isNull(item)) {
                this.notStoreList.map(e => {
                    this.notStoreSaveList = this.notStoreSaveList.filter(k => k.id !== e.id);
                });
            } else {
                item.map(e => {
                    this.notStoreSaveList = this.notStoreSaveList.filter(k => k.id !== e.id);
                    this.notStoreSaveList.push(e);
                });
            }
        },
        notStoreHandleSelect(item) {                                // 未盘商品勾选
            this.notStoreList[item.index].rowChecked = !this.notStoreList[item.index].rowChecked;
            if (item.rowChecked) {
                this.notStoreSaveList.push(item);
            } else {
                this.notStoreSaveList = this.notStoreSaveList.filter(e => e.id != item.id);
            }
        },
        notStoreHandleSubmit(_type) {                               // 未盘商品底部操作按钮提交
            if (_type === 0) {
                if (!this.hasCheckedItem) return this.$message({ message: '没有勾选商品', type: 'warning' });
                if (this.isSingleAdd) {
                    this.$emit('returnCheckData', this.notStoreSaveList);
                } else {

                }
            } else if (_type === 1) {
                // 审核
                if (this.isSingleAdd) {
                    this.handleCheckSingle();
                } else {
                    this.handleCheck();
                }
            } else if (_type === 2) {
                // 审核并清空
                this.pswVisible = true;
            }
        },
        addStoreStockCheckRecordInfo(dataList, id, r_empid) {       // 保存草稿请求
            let queryData = {
                sv_storestock_check_no: this.queryData.sv_storestock_check_no,                   // 盘点批次号
                sv_storestock_check_r_no: id,                                                    // 盘点单号
                sv_storestock_check_r_empid: r_empid,                                            // 盘点人
                sv_warehouse_id: this.queryData.sv_warehouse_id,                                 // 仓库id
                sv_storestock_check_type: this.isSingleAdd ? 0 : 1,                              // 0:批号对应一个盘点单;1:批号对应多个盘点单;
                sv_storestock_checktypeid_list: [],                                              // 类别盘点-类别id
                storeStockCheckDetail: dataList,                                                 // 商品列表
            }
            stockApi.addStoreStockCheckRecordInfo(queryData).then(res => {
                if (res !== false) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.dialogVisible = 'close';
                    this.$emit('saveSuccess');
                }
            });
        },
        handleBack() {                                              // 1对1盘点 保存操作
            this.dialogVisible = 'close';
            if (!this.isSelf) this.$router.push('/business/stocktaking');
        },
        handleCheck(clearAll = false) {                             // 1对1盘点 审核操作
            // this.isSingleAdd
            let obj = {
                sv_storestock_check_no: this.queryData.sv_storestock_check_no,          // 盘点批次号
                is_zero: clearAll ? 1 : 0,                                              // 是否清零(0:不清零;1:清零;)
                sv_storestock_check_range: this.queryData.sv_storestock_check_range,    // 盘点类型(0:全场盘点;1:类别盘点;)  
                sv_storestock_check_type: 1                                             // 0:批号对应一个盘点单;1:批号对应多个盘点单;
            };
            stockApi.appStoreStockCheckBatchNum(obj).then(res => {
                if (res === null) {
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                    this.dialogVisible = 'close';
                    this.pswVisible = false;
                    if (!this.isSelf) {
                        this.$router.push('/business/stocktaking');
                    } else {
                        this.$emit('saveSuccess');
                    }
                }
            });
        },
        handleCheckSingle(clearAll = false) {                     // 1对1盘点 审核操作
            let obj = {
                sv_storestock_check_no: this.queryData.sv_storestock_check_no,          // 盘点批次号
                is_zero: clearAll ? 1 : 0,                                              // 是否清零(0:不清零;1:清零;)
                sv_warehouse_id: this.queryData.sv_warehouse_id,                        // 仓库id
                sv_storestock_check_range: this.queryData.sv_storestock_check_range,    // 盘点类型(0:全场盘点;1:类别盘点;)  
                sv_storestock_check_type: 0                                             // 盘点批号类型(0:批号对应一个盘点单;1:批号对应多个盘点单;)
            };
            stockApi.appSelectStoreStockCheckInfo(obj).then(res => {
                if (res === null) {
                    this.$message({
                        message: '审核成功！',
                        type: 'success'
                    });
                    this.dialogVisible = 'close';
                    this.pswVisible = false;
                    if (!this.isSelf) {
                        this.$router.push('/business/stocktaking');
                    } else {
                        this.$emit('saveSuccess');
                    }
                }
            });
        },
        pswSubmit() {                                             // 密码弹窗提交
            if (this.$app.isNull(this.pswText)) return this.$message({ message: '请输入密码', type: 'warning' });
            // 验证密码
            stockApi.isZeroPwdAppStoreStockCheck({ pwd: this.pswText }).then(res => {
                if (res != false) {
                    if (this.isSingleAdd) {
                        this.handleCheckSingle(true);
                    } else {
                        this.handleCheck(true);
                    }
                }
            });
        },
        notStoreHandleCurrentChange(e) {                         // 未盘商品翻页
            this.queryNotStore.page = e;
            this.getNotStoreStockCheckProductInfo();
        },
        handleNotDiskExport() {                                 // 导出未盘点商品
            // if (this.$app.isNull(this.notStoreSaveList)) return this.$message({ message: '请选择需要导出的未盘商品', type: 'warning' });
            let obj = {
                // product_ids: this.notStoreSaveList.map(item => { return item.id }).join(','),
                sv_storestock_check_range: this.queryData.sv_storestock_check_range,
                sv_storestock_check_no: this.queryData.sv_storestock_check_no
            }
            stockApi.GetNotStoreStockCheckProductInfo_Excel(obj).then(res => {
                if (this.$app.isNull(res)) return;
                if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                this.$app.downloadUrl(res);
            });
        },
    }
}
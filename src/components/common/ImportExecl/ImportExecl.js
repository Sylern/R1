/*  visible-true显示 false关闭 dataJson对象 {type-导入类型 必填、title-名称 必填、data - 门店ID集合 、user_id - 门店id 、 delivery_price_method - 价格}*/
import base from '@/api/base';
import { stockApi } from '@/api';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        dataJson: {
            type: Object, default: () => {
                return {
                    type: '',                           // 导入类型 必填
                    title: '',                          // 名称 必填
                    data: [],                           // 门店ID集合
                    user_id: '',                        // 门店id
                    delivery_price_method: '',          // 价格
                    entityObj: {}                       // 导入接口需要的参数
                }
            }
        }
    },
    data() {
        return {
            listJson: [                                 // 数据总项 根据传入的类型来调用不同模块的数据

                { type: 'supplier', name: '供应商导入', list: [{ url: base.ImportExeclUrl + '/供应商导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.supplierImportExecl_newUrl(), code: 'supplier', name: '导入列表', type: 'Import' }] },
                { type: 'purchasingGoods', name: '采购商品导入', list: [{ url: base.ImportExeclUrl + '/采购导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'purchasingGoods', name: '导入列表', type: 'Import' }] },
                { type: 'returnGoods', name: '采购退货商品导入', list: [{ url: base.ImportExeclUrl + '/退货导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'returnGoods', name: '导入列表', type: 'Import' }] },
                { type: 'stockChange', name: '库存调整导入', list: [{ url: base.ImportExeclUrl + '/库存调整模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'stockChange', name: '导入列表', type: 'Import' }] },
                { type: 'commodityPrice', name: '商品调价导入', list: [{ url: base.ImportExeclUrl + '/商品调价模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'commodityPrice', name: '导入列表', type: 'Import' }] },
                { type: 'costAdjustment', name: '成本调整导入', list: [{ url: base.ImportExeclUrl + '/成本调整模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'costAdjustment', name: '导入列表', type: 'Import' }] },
                { type: 'cargoFlowGoods', name: '货流商品导入', list: [{ url: base.ImportExeclUrl + '/货流导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'cargoFlowGoods', name: '导入列表', type: 'Import' }] },
                { type: 'memberList', name: '会员导入', list: [{ url: base.ImportExeclUrl + '/会员导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.memberImportExecl(), code: 'memberList', name: '导入列表', type: 'Import' }] },
                { type: 'addStocktaking', name: '库存盘点商品导入', list: [{ url: base.ImportExeclUrl + '/服装盘点导入.xls', name: '下载模板', type: 'download' }, { url: stockApi.inventoryProductImportExcel(), code: 'memberList', name: '导入列表', type: 'Import' }] },
                { type: 'addStocktaking', name: '库存盘点商品导入', list: [{ url: base.ImportExeclUrl + '/盘点导入.xls', name: '下载模板', type: 'download' }, { url: stockApi.inventoryProductImportExcel(), code: 'memberList', name: '导入列表', type: 'Import' }] },

                { type: 'commodityExecl', name: '商品提成方案导入', list: [{ url: base.ImportExeclUrl + '/商品提成导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.Programme_dataImportExecl(), code: 'commodityExecl', name: '导入列表', type: 'Import' }] },
                { type: 'commodityAchieExecl', name: '商品业绩方案导入', list: [{ url: base.ImportExeclUrl + '/商品业绩导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.Programme_dataImportExecl(), code: 'commodityAchieExecl', name: '导入列表', type: 'Import' }] }
            ],
            checkData: {},                              // 根据type 获取到当前需要显示的导入下载模板数据项
            ImportUrl: '',                              // 接口地址
            ImportCode: '',                             // 导入类型
            typeExecl: 'start',                         // 显示类型  start-开始 have - 进行中  end - 结束
            successInfo: {                              // 导入返回值
                Fail_Number: 0,                                 // 失败数
                Success_Number: 0,                              // 成功数
                Total: 0,                                       // 导入总数
                list: [],                                       // 导入成功数据项
                url: ''                                         // 导入失败数据下载地址
            },
            isOk: true,                                 // 是否全部导入成功

            memberJson: [],                             // 导入成功后返回的数据列表  会员导入需要
            strPath: 0,                                 // 会员导入地址
            memberType: 0                               // 导入类型  0正常导入,1覆盖会员余额,2叠加会员余额
        }
    },
    computed: {
        dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } },
        listData: function () {

            let listMore = this.listJson.map(e => {
                if (e.type === 'returnGoods' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'returnGoods', name: '服装采购退货商品导入', list: [{ url: base.ImportExeclUrl + '/服装退货导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'returnGoods', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'stockChange' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'stockChange', name: '服装库存调整导入', list: [{ url: base.ImportExeclUrl + '/服装库存调整模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'stockChange', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'commodityPrice' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'commodityPrice', name: '服装商品调价导入', list: [{ url: base.ImportExeclUrl + '/服装商品调价模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'commodityPrice', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'costAdjustment' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'costAdjustment', name: '服装成本调整导入', list: [{ url: base.ImportExeclUrl + '/服装成本调整模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'costAdjustment', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'purchasingGoods' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'purchasingGoods', name: '服装采购商品导入', list: [{ url: base.ImportExeclUrl + '/服装采购导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'purchasingGoods', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'cargoFlowGoods' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'cargoFlowGoods', name: '服装货流商品导入', list: [{ url: base.ImportExeclUrl + '/服装货流导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.purchasingGoodsImportExecl(), code: 'cargoFlowGoods', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'addStocktaking' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return { type: 'addStocktaking', name: '库存盘点商品导入', list: [{ url: base.ImportExeclUrl + '/服装盘点导入.xls', name: '下载模板', type: 'download' }, { url: stockApi.inventoryProductImportExcel(), code: 'addStocktaking', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'addStocktaking' && this.$store.state.userInfo.sv_uit_cache_name !== 'cache_name_clothing_and_shoes') {
                    return { type: 'addStocktaking', name: '库存盘点商品导入', list: [{ url: base.ImportExeclUrl + '/盘点导入.xls', name: '下载模板', type: 'download' }, { url: stockApi.inventoryProductImportExcel(), code: 'addStocktaking', name: '导入列表', type: 'Import' }] };
                }
                if (e.type === 'commodityExecl' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return  { type: 'commodityExecl', name: '商品提成方案导入', list: [{ url: base.ImportExeclUrl + '/服装商品提成导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.Programme_dataImportExecl(), code: 'commodityExecl', name: '导入列表', type: 'Import' }] }
                }
                if (e.type === 'commodityAchieExecl' && this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                    return  { type: 'commodityAchieExecl', name: '商品业绩方案导入', list: [{ url: base.ImportExeclUrl + '/服装商品业绩导入模板.xls', name: '下载模板', type: 'download' }, { url: stockApi.Programme_dataImportExecl(), code: 'commodityAchieExecl', name: '导入列表', type: 'Import' }] }
                }
                return { ...e };
            });
            return listMore;
        }
    },
    mounted() {
        if (this.listData.findIndex(e => e.type === this.dataJson.type) === -1) return this.$message({ message: '暂未存在该模块的导入模板', type: 'error' })
        this.checkData = this.listData.find(e => e.type === this.dataJson.type);
    },
    methods: {
        handleDownloadImport(item) {                    // 下载模板
            return this.$app.downloadUrl(item.url);
        },
        handleImport(item) {                            // 导入模板
            // 调起file的点击事件
            this.ImportUrl = item.url;
            this.ImportCode = item.code;
            this.$refs['fileImport'].click();
        },
        handleFile(e) {                                 // 导入文件
            let files = e.target.files[0];
            if (this.$app.isNull(files)) return this.$message({ message: '请选择需要导入的文件', type: 'warning' });
            let formObj = this.getData(files);
            this.typeExecl = 'have';
            stockApi.postUpload(this.ImportUrl, formObj).then(r => {
                e.target.value = '';
                r = typeof r === 'string' ? JSON.parse(r) : r;
                let res = r.data;
                if (res && this.$app.isNull(r.msg)) {
                    if (this.dataJson.type === 'memberList') {
                        this.memberJson = res.list;
                        this.typeExecl = 'show';
                        this.strPath = res.url;
                        this.successInfo.Success_Number = res.list.length;
                        return
                    }
                    if (this.dataJson.type === 'commodityExecl' || this.dataJson.type === 'commodityAchieExecl') {
                        this.typeExecl = 'waring';
                        return
                    }
                    this.typeExecl = 'end';
                    this.successInfo = res;
                    this.isOk = this.successInfo.Success_Number === this.successInfo.Total;
                } else {
                    this.typeExecl = 'start';
                    this.$message({ message: r.msg || r.message, type: 'warning' });
                }
            });
        },
        handleDownload() {                              // 导入失败下载失败数据
            return this.$app.downloadUrl(this.successInfo.url);
        },
        handleSubmit() {                                // 导入成功确定操作
            let json = this.$app.isNull(this.successInfo.list) ? [] : this.successInfo.list;
            this.$emit('callback', json);
            this.dialogVisible = false;
            this.typeExecl = 'start';
        },
        handlePostlist() {
            stockApi.saveMember({ StrPath: this.strPath, Type: this.memberType }).then(res => {
                if (res && res.success) {
                    this.typeExecl = 'end';
                } else {
                    this.$message.error(res.message || '保存失败')
                }
            })
        },
        getData(files) {                                // 获取导入数据
            let obj = {};
            obj['file'] = files;

            //#region  供应商导入
            if (this.ImportCode === 'supplier' || this.ImportCode === 'memberList') {
                obj['uploadFileType'] = 'excel';
                obj['user_id'] = this.$store.state.userInfo.user_id;
            }

            //#region  采购商品导入 、采购退货商品导入 、 成本调价 、商品调价
            if (this.ImportCode === 'purchasingGoods' || this.ImportCode === 'returnGoods' || this.ImportCode === 'costAdjustment' || this.ImportCode === 'commodityPrice' || this.ImportCode === 'stockChange' || this.ImportCode === 'cargoFlowGoods') {
                obj['user_list'] = JSON.stringify(this.setUserList());
            }

            //#region 新增库存盘点商品导入
            if (this.ImportCode === 'addStocktaking') {
                obj['user_list'] = JSON.stringify({
                    user_id: this.$store.state.userInfo.user_id,
                    inventory_type: this.dataJson.inventory_type,
                    id: this.dataJson.id,
                })
            }

            //#region 商品提成方案导入
            if (this.ImportCode === 'commodityExecl' || this.ImportCode === 'commodityAchieExecl') {
                obj['business_info'] = JSON.stringify({
                    sv_programme_id: this.dataJson.entityObj.sv_programme_id,
                    sv_programme_name: this.dataJson.entityObj.sv_programme_name,
                    sv_groupingids: this.dataJson.entityObj.sv_groupingids,
                    sv_code: this.dataJson.entityObj.sv_code,
                    sp_salesclerkid: this.dataJson.entityObj.sp_salesclerkid,
                    user_id: this.dataJson.entityObj.user_id
                })
            }
            return this.$app.convertObjFormData(obj);
        },
        setUserList() {                                 // 生成采购商品导入数据
            let matching_sv_p_specs = this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes' ? true : false;
            let user_list = {
                user_id: this.$store.state.userInfo.user_id + '',               // 用户id
                // user_idlist: [],                                             // 生效门店id，name
                pricetype: 4,                                                   // 价格操作类型(0商品调价，2库存调整，3成本成本调整，1货流价,4采购,退货进货价
                matching_sv_p_specs: matching_sv_p_specs,                       // 是否匹配规格
                // delivery_price_method: '',                                      // 货流管理，要货单价类型
                industry_logo: this.$store.state.userInfo.sv_uit_cache_name,    // 行业编号
                is_new_template: this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes' ? true : false
            }

            //#region 采购商品导入 、采购退货商品导入
            if (this.ImportCode === 'purchasingGoods' || this.ImportCode === 'returnGoods') {
                user_list.pricetype = 4;
            }
            if (this.ImportCode === 'costAdjustment') {
                user_list.pricetype = 3;
                user_list['user_idlist'] = this.dataJson.data;
            }
            if (this.ImportCode === 'commodityPrice') {
                user_list.pricetype = 0;
                user_list['user_idlist'] = this.dataJson.data;
            }
            if (this.ImportCode === 'stockChange') {
                user_list.pricetype = 2;
                user_list['user_idlist'] = this.dataJson.data;
            }
            if (this.ImportCode === 'cargoFlowGoods') {
                user_list.pricetype = 1;
                user_list.user_id = this.dataJson.user_id;
                user_list['user_idlist'] = this.dataJson.data;
                user_list['delivery_price_method'] = this.dataJson.sv_delivery_price_method;
            }
            return user_list;
        }

    }
}
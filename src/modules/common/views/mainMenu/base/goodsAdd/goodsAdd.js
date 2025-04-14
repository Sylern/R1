import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsAdd',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        firstCategory: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            // goodsType: 0,                                   // 商品类型
            baseCodeInfo: {},                               // 自动编码实体
            categoryId: [],                                 // 商品分类
            querySubmit: {
                p_source: 200,
                sv_p_barcode: '',                           // 商品条码
                sv_p_name: '',                              // 商品名称
                sv_p_specs: '',                             // 商品规格
                sv_p_unit: '',                              // 商品单位
                sv_p_unitprice: '',                         // 销售价格
                sv_p_storage: 0,                            // 初始库存

                producttype_id: '0',                        // 产品类型    0：普通商品  1:服务商品  2：计时商品（游乐场之类）
                productcategory_id: 0,                      // 商品一级分类
                productsubcategory_id: 0,                   // 商品二级分类
                sv_pricing_method: 0,                       // 计价方式（0 - 计件 ，1--计重）
            },
            rules: {
                sv_p_barcode: [{
                    required: true,
                    message: '请输入' + this.$store.state.userInfo.goodsCode_charact,
                    trigger: ['blur']
                }],
                sv_p_name: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: ['blur']
                }],
                sv_p_unitprice: [{
                    required: true,
                    message: '请输入销售价格',
                    trigger: ['blur']
                }]
            },

            cascader: {
                options: [],
                props: {
                    checkStrictly: true
                },
                type: "cascaderLazy"
            }
        }
    },
    computed: {
        ...mapState(['memberList']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.categoryId = [];
                    this.getFirstCategory();
                    this.getProductBarcode();
                    this.$nextTick(() => {
                        this.initForm();
                        this.$refs.sv_p_name.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update', 'touchCarttingCursor']),
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'goodsAdd');
            this.$root.$emit('restaurant', 'goodsAdd');
        },
        initForm() {                                          // 初始化表格输入 
            // this.goodsType = 0;
            this.querySubmit = {
                sv_p_barcode: '',                           // 商品条码
                sv_p_name: '',                              // 商品名称
                sv_p_specs: '',                             // 商品规格
                sv_p_unit: '',                              // 商品单位
                sv_p_unitprice: '',                         // 销售价格
                sv_p_storage: 0,                            // 初始库存

                producttype_id: 0,                          // 产品类型    0：普通商品  1:服务商品  2：计时商品（游乐场之类）
                productcategory_id: 0,                      // 商品一级分类
                productsubcategory_id: 0,                   // 商品二级分类
                sv_pricing_method: 0                        // 计价方式（0 - 计件 ，1--计重）
            }
        },
        handleStorageInput({ target }) {                      // 库存输入框限制
            // if (this.goodsType != 2) {
            //     // 计重商品
            //     target.value = this.$app.verifyNumber(target.value);
            //     return
            // }
            target.value = this.$app.verifyNumberDecimalThree(target.value);
        },
        handleStorageInputBlur({ target }) {                  // 库存输入blur
            // if (this.goodsType != 2) {
            //     // 计重商品
            //     this.querySubmit.sv_p_storage = target.value = Math.round(target.value);
            //     return
            // }
            this.querySubmit.sv_p_storage = target.value = this.$app.verifyNumberDecimalThree(target.value);
        },
        handleInputCode({ target}) {
            this.GetGoodsInfoByBarcode(target.value);
        },
        //#region 获取数据
        GetGoodsInfoByBarcode(barcode) {
            stockApi.GetGoodsInfoByBarcode({ barcode: barcode }).then(res => {
                if (!this.$app.isNull(res.probarcodelib_goods_name)) {
                    this.querySubmit.sv_p_name = res.probarcodelib_goods_name;
                }
                if (!this.$app.isNull(res.probarcodelib_price)) {
                    this.querySubmit.sv_p_unitprice = res.probarcodelib_price;
                }
                if (!this.$app.isNull(res.probarcodelib_specifications)) {
                    this.querySubmit.sv_p_specs = res.probarcodelib_specifications;
                }
            })
        },
        getFirstCategory() {                                  // 获取商品一级分类
            if (this.firstCategory.length > 0) {
                this.cascader.options = this.firstCategory.map(e => {
                    return {
                        children: [],
                        label: e.sv_pc_name,
                        producttype_id: e.producttype_id,
                        value: e.productcategory_id
                    }
                });
                return 
            }
            stockApi.getFirstCategory().then(res => {
                if (res) {
                    this.cascader.options = this.$app.isNull(res) ? [] : res.map(e => {
                        return {
                            children: [],
                            label: e.sv_pc_name,
                            producttype_id: e.producttype_id,
                            value: e.productcategory_id
                        }
                    });
                }
            });
        },
        handleExpand(obj) {                                   // 点击cascader联级选择器
            let { item, value } = obj;
            let num = item.options.findIndex(e => e.value === value);
            if (this.$app.isNull(item.options[num].children)) {
                // 获取二级分类数据
                stockApi.getSecondCategory({ cid: value }).then(res => {
                    if (res.succeed) {
                        let children = this.$app.isNull(res.values) ? [] : res.values.map(e => { return { label: e.sv_psc_name, value: e.productsubcategory_id, leaf: true } });
                        if (num > -1) {
                            item.options[num].children = children;
                        }
                    }
                });
            }
        },
        
        getProductBarcode() {                                       // 自动商品条码
            stockApi.getProductBarcode().then(res => {
                if (res) {
                    this.baseCodeInfo = res;
                    this.querySubmit.sv_p_barcode = res.sv_detail_value;
                    // let Index = this.fromData.left.findIndex(e => e.code === 'sv_p_barcode');
                    // if (Index > -1 && res.sv_detail_is_enable === true) {
                    //     let item = this.fromData.left[Index];
                    //     item.value = res.sv_detail_value;
                    //     this.$set(this.fromData.left, Index, item);
                    // }
                }
            });
        },
        postSaveConfigdetail() {                                    // 设置自动编码
            let value = this.querySubmit.sv_p_barcode.match(/(\d+|[^\d]+)/g);
            let lastValue = value[value.length - 1];
            value[value.length - 1] = this.$app.isNumber(lastValue) ? parseFloat(lastValue) + 1 : lastValue + 1;
            let baseInfo = { ...this.baseCodeInfo };
            baseInfo.sv_detail_value = value.join('');
            stockApi.postSaveConfigdetail(baseInfo).then(res => { });
        },
        handleEnter() {                                       // 确定事件 - 新增商品
            if (this.categoryId.length === 0) return this.$message({ message: '请选择商品分类', type: 'warning' });
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // goodsType: [1,2,3] = ['普通商品','服务商品','计重商品']
                    // this.querySubmit.producttype_id = this.goodsType === 1 ? '1' : '0';                             // 0：普通商品  1:服务商品  2：计时商品（游乐场之类）
                    // this.querySubmit.sv_pricing_method = this.goodsType === 2 ? '1' : '0';                          // 计价方式（0 - 计件 ，1--计重）
                    // this.querySubmit.sv_p_storage = this.goodsType === 1 ? 0 : this.querySubmit.sv_p_storage;       // 服务商品库存为0

                    this.querySubmit.productcategory_id = this.categoryId[0];                                       // 一级分类id
                    this.querySubmit.productsubcategory_id = this.categoryId.length > 1 ? this.categoryId[1] : 0;   // 二级分类id

                    stockApi.productAdd(this.querySubmit).then(res => {
                        if (res.succeed) {
                            this.$root.$emit('refreshGoodsList');
                            this.$message({ message: '新增商品成功', type: 'success' });
                            this.postSaveConfigdetail();
                            this.closeDialog();
                            this.touchCarttingCursor();
                        } else {
                            return this.$message({ message: res.errmsg, type: 'warning' });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
};
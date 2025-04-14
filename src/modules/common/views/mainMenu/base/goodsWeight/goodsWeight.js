import base from "@/api/base";
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsWeigh',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataItem: {
            type: Object,
            default: () => {
                return {
                    isEdit: false,
                    id: 0,
                    number: 1,
                    remark: ''
                }
            }
        }
    },
    data() {
        return {
            weightSwitchStatus: false,
            inputNumber: '0',
            calculatorList: [
                {
                    key: '7'
                },
                {
                    key: '8'
                },
                {
                    key: '9'
                },
                {
                    key: '4'
                },
                {
                    key: '5'
                },
                {
                    key: '6'
                },
                {
                    key: '1'
                },
                {
                    key: '2'
                },
                {
                    key: '3'
                },
                {
                    key: '.'
                },
                {
                    key: '0'
                },
                {
                    key: 'C'
                }
            ],
            isShowMutiPrice: false,             // 是否展示多价格
            goodsAttrPos: 1,                    // 商品属性选择
            goodsAttr: [
                {
                    keyName: '单价',
                    value: '',
                    unit: '元 '
                },
                {
                    keyName: '重量',
                    value: '1.00'
                },
                {
                    keyName: '折扣',
                    value: '10',
                    unit: '折'
                },
            ],
            goodsInfo: {
                goodsName: '',                  // 商品名称
                goodsImg: '',                   // 商品图片
                categoryName: '',               // 分类名称
                barcode: '',                    // 商品条码
                unitprice: '',                  // 零售价
                sv_p_unit: '',                  // 单位
                specs: '',                      // 默认规格
                storage: ''                     // 库存
            },
            priceList: [],                      // 价格列表
            multiPricePos: 0,                   // 多价格下标
            remark: '',                         // 备注
        }
    },
    computed: {
        ...mapState(['carttingData', 'pricingScaleData']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        priceTotal() {                          // 总价
            let total = 1;
            this.goodsAttr.forEach(e => {
                total = this.$app.multiplyNumber(total, e.value)
            });
            return total > 0 ? this.$app.divideNumber(total, 10) : 0
        },
        hasCalculator() {
            return 1
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInit();
                    this.getMoreSpec();
                    this.$nextTick(() => {
                        this.$refs.goodsWeigh.focus();
                    })
                }
            }
        },
        pricingScaleData: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.goodsAttr.find(e => e.keyName === '重量').value = this.pricingScaleData.weight;
                }
            }
        },
        'pricingScaleData.isStabilize': {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (this.weightSwitchStatus) {
                        this.handleEnter();
                    }
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                case 8:                                       // back
                    this.deleteInput();
                    return;
                case 38:                                      // keydown
                    this.handleAttrPos(this.goodsAttrPos - 1);
                    return;
                case 40:                                      // keyup
                    this.handleAttrPos(this.goodsAttrPos + 1);
                    return;
                case 46:                                      // delete
                    this.deleteInput();
                    return;
                case 48:                                      // 0
                    this.calculateInput('0');
                    return;
                case 96:                                      // 0
                    this.calculateInput('0');
                    return;
                case 49:                                      // 1
                    this.calculateInput('1');
                    return;
                case 97:                                      // 1
                    this.calculateInput('1');
                    return;
                case 50:                                      // 2
                    this.calculateInput('2');
                    return;
                case 98:                                      // 2
                    this.calculateInput('2');
                    return;
                case 51:                                      // 3
                    this.calculateInput('3');
                    return;
                case 99:                                      // 3
                    this.calculateInput('3');
                    return;
                case 52:                                      // 4
                    this.calculateInput('4');
                    return;
                case 100:                                     // 4
                    this.calculateInput('4');
                    return;
                case 53:                                      // 5
                    this.calculateInput('5');
                    return;
                case 101:                                     // 5
                    this.calculateInput('5');
                    return;
                case 54:                                      // 6
                    this.calculateInput('6');
                    return;
                case 102:                                     // 6
                    this.calculateInput('6');
                    return;
                case 55:                                      // 7
                    this.calculateInput('7');
                    return;
                case 103:                                     // 7
                    this.calculateInput('7');
                    return;
                case 56:                                      // 8
                    this.calculateInput('8');
                    return;
                case 104:                                     // 8
                    this.calculateInput('8');
                    return;
                case 57:                                      // 9
                    this.calculateInput('9');
                    return;
                case 105:                                     // 9
                    this.calculateInput('9');
                    return;
                case 190:                                     // .
                    this.calculateInput('.');
                    return;
                case 110:                                     // .
                    this.calculateInput('.');
                    return;
                case 67:                                      // C
                    this.calculateInput('C');
                    return;
                default:
                    console.log('goodsWeight key ' + code + ' is click');
                    return;
            }
        },
        dataInit() {                                                // 初始化数据
            this.priceList = [];
            this.inputNumber = '0';
            this.remark = this.dataItem.remark;
            this.goodsAttr.find(e => e.keyName === '单价').value = this.$app.moneyFixed(this.dataItem.sv_p_unitprice);
            this.goodsAttr.find(e => e.keyName === '重量').value = parseFloat(this.pricingScaleData.weight) > 0 ? this.pricingScaleData.weight : '1.00';
            this.goodsAttr.find(e => e.keyName === '折扣').value = '10';
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'goodsWeight');
            this.$root.$emit('restaurant', 'goodsWeight');
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '0';
            this.goodsAttr[this.goodsAttrPos].value = this.inputNumber;
        },
        handleAttrPos(pos) {                                        // 修改选中的商品属性
            if (this.goodsAttrPos === pos || pos < 0 || pos > 2) return;
            this.goodsAttrPos = pos;
            this.inputNumber = '0';
        },
        handleMultiPriceItem(index, item) {                         // 改变多价格下标
            this.multiPricePos = index;
        },
        handleMultiPriceBack() {
            this.isShowMutiPrice = false;
        },
        //#region 计算器内容
        calculateInput(_str) {                                      // 计算输入框的值
            // 输入文字存在小数点，再输入小数点直接return
            if (this.inputNumber.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
            if (_str == 'C') return this.clearInputNumber();
            if (_str != '0' && _str != '.') {
                if (parseFloat(this.inputNumber) > 0 || this.inputNumber.length > 1) {
                    // example   1:'1.'   2:'0.'
                    this.inputNumber = this.inputNumber + _str;
                } else {
                    this.inputNumber = _str;
                }
            } else {
                if (_str == '0') {
                    this.inputNumber = this.inputNumber === '0' ? '0' : this.inputNumber + _str;
                } else {
                    this.inputNumber = this.inputNumber + _str;
                }
            }
            this.inputNumber = this.$app.verifyNumberDecimalThree(this.inputNumber);
            if (parseFloat(this.inputNumber) >= 10 && this.goodsAttrPos === 2) {
                this.$message.warning('折扣不能超过10');
                this.inputNumber = '10';
            }
            this.goodsAttr[this.goodsAttrPos].value = this.inputNumber;
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputNumber == '0' || this.inputNumber.length == 1) {
                this.inputNumber = '0';
                this.goodsAttr[this.goodsAttrPos].value = this.inputNumber;
                return
            }
            this.inputNumber = this.inputNumber.substring(0, this.inputNumber.length - 1);
            this.goodsAttr[this.goodsAttrPos].value = this.inputNumber;
        },
        //#endregion
        handleEnter() {                                             // 确定按钮点击事件
            let weightValue = this.goodsAttr.find(e => e.keyName === '重量').value;
            let dealPrice = this.$app.multiplyNumber(this.goodsAttr.find(e => e.keyName === '单价').value, this.$app.divideNumber(this.goodsAttr.find(e => e.keyName === '折扣').value, 10));
            let dataFilter = this.carttingData.productResults.filter(e => e.productId == this.dataItem.id);
            let pNumber;
            if (this.dataItem.isEdit) {
                pNumber = parseFloat(weightValue);
            } else {
                pNumber = dataFilter.length > 0 ? parseFloat(dataFilter[0].number) + parseFloat(weightValue) : weightValue;
            }
            if (parseFloat(pNumber) == 0) return this.$message.warning('重量不能为0');
            dealPrice = parseFloat(this.$app.moneyFixed(dealPrice, 2))
            let addItem = {
                product_id: this.dataItem.id,
                sv_p_name: this.goodsInfo.goodsName,
                sv_p_barcode: this.goodsInfo.barcode,
                number: pNumber,
                sv_p_unit: this.goodsInfo.sv_p_unit,
                price: dealPrice,
                remark: this.remark,
                tastes: [],
                chargings: [],
                specs: [],
                dealPrice: dealPrice,
                currentDealPrice: dealPrice,
                productChangePrice: this.goodsInfo.unitprice != dealPrice ? dealPrice : null,
                couponMoney: 0,
                isPricingMethod: true,
                sv_is_current_price: this.goodsInfo.sv_is_current_price,
                dealMoney: this.priceTotal
            }
            this.$emit('handleSure', addItem)
            this.closeDialog();
            this.$root.$emit('showCatting');
        },
        getMoreSpec() {                                             // 获取商品详情
            if (this.dataItem.id === 0) return;
            let query = {
                id: this.dataItem.id,
                is_mp: false,
                readlabelfiled: false
            }
            stockApi.getMorespecSubProductList(query).then(res => {
                if (res) {
                    let goodsData = res.values;
                    let goodsImg = '';
                    if (!this.$app.isNull(goodsData.sv_p_imagesList)) {
                        if (goodsData.sv_p_imagesList.length > 0) {
                            if (!this.$app.isNull(goodsData.sv_p_imagesList[0].code)) {
                                goodsImg = this.$app.fmtImg(goodsData.sv_p_imagesList[0].code,stockApi.imgBase())
                            }
                        }
                    }
                    let storage = goodsData.sv_pricing_method === 1 ? goodsData.sv_p_total_weight : goodsData.sv_p_storage;
                    this.goodsInfo = {
                        goodsName: goodsData.sv_p_name,                   // 商品名称
                        goodsImg: goodsImg,                               // 商品图片
                        categoryName: goodsData.sv_pc_name,               // 分类名称
                        barcode: goodsData.sv_p_barcode,                  // 商品条码
                        unitprice: goodsData.sv_p_unitprice,              // 零售价
                        sv_p_unit: goodsData.sv_unit_name,                // 单位
                        specs: goodsData.sv_p_specs,                      // 默认规格
                        sv_is_current_price: goodsData.sv_is_current_price,
                        storage                                           // 库存
                    }
                    this.goodsAttr.find(e => e.keyName === '重量').value = this.dataItem.number;
                    this.goodsAttr.find(e => e.keyName === '单价').value = this.goodsInfo.unitprice;
                    this.goodsAttr.find(e => e.keyName === '单价').unit = '元 ' + (this.$app.isNull(goodsData.sv_p_unit) ? '' : ('/ ' + goodsData.sv_p_unit));
                }
            })
        },
    }
};
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import numberChange from '../numberChange/numberChange.vue';
export default {
    name: 'goodsMoreInfo',
    components: { numberChange },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        goodsId: {
            type: Number,
            default: 0
        },
        infoType: {
            // 0-多规格 1-多单位 2-多价格 3-多规格、多价格 4-多单位、多价格
            type: Number,
            default: 3
        },
        isMultiPrice: {
            type: Boolean,
            default: false
        },
        isCurrent: {
            // 不进行演算，本地加购物车
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            inputNumber: '1',
            inputPriceHandler: 0,                           // 输入金额控制，小于 1 时覆盖，否则累加
            Cashier_Number_Cumulation_enable: true,         // 加入购物车是否叠加
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
            isShowMultiSpec: false,             // 是否展示多规格
            pricePos: -1,                       // 当前多价格序号
            goodsImg: '',                       // 商品图片
            defaultGoodsImg: '',                // 默认商品图
            goodsInfo: {
                goodsName: '',                  // 商品名称
                producttype_id: 0,
                categoryName: '',               // 分类名称
                barcode: '',                    // 商品条码
                unitprice: 0,                   // 零售价
                sv_is_current_price: false,     // 是否时价
                specs: '',                      // 默认规格
                storage: 0                      // 库存
            },
            priceList: [],                      // 价格列表
            validList: [                        // 属性列表
                {
                    dataList: []
                }
            ],
            specGoodsList: [],                  // 规格商品列表
            goodsValidSelected: {
                valid: [],
                specs: []
            },
            batchUpdateNum: 0,                  // 批量修改数量
            multiPricePos: 0,                   // 多价格下标
            currentPriceStatus: false,
            currentPriceArray: []
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        hasMultiSpec() {
            return this.infoType === 0 || this.infoType === 3
        },
        hasMultiUnit() {
            return this.infoType === 1 || this.infoType === 4
        },
        hasCalculator() {
            return this.infoType === 1 || this.infoType === 2 || this.infoType === 4
        },
        hasMultiPrice() {
            return this.isMultiPrice
        },
        onlyValit() {                               // 只有一个属性
            return this.validList[0].dataList.length === 0
        },
        currentPrice() {
            if (this.priceList.length === 0) {
                return {
                    name: '',
                    value: ''
                }
            }
            return this.priceList[this.multiPricePos]
        },
        goodsTotal() {
            let number = 0;
            this.specGoodsList.forEach(e => {
                if (e.isShow) {
                    number = number + parseFloat(e.num || 0);
                }
            })
            return number
        },
        priceTotal() {
            if (this.hasCalculator) {
                return this.$app.moneyFixed(parseInt(this.inputNumber) * this.currentPrice.value, 2)
            }
            let price = 0;
            this.specGoodsList.forEach(e => {
                if (e.isShow) {
                    price = price + (this.multiPricePos === 0 ? e.sv_p_unitprice : this.currentPrice.value) * parseFloat(e.num || 0);
                }
            })
            return this.$app.moneyFixed(price)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataInit();
                    this.getMoreSpec();
                    this.$nextTick(() => {
                        this.$refs.goodsMoreInfo.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['batchAddToCartting']),
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
                    console.log('goodsMoreInfo key ' + code + ' is click');
                    return;
            }
        },
        dataInit() {                                                // 初始化数据
            this.inputNumber = '1';
            this.multiPricePos = 0;
            this.batchUpdateNum = 0;
            this.priceList = [];
            this.goodsValidSelected = {
                valid: [],
                specs: []
            }
            this.Cashier_Number_Cumulation_enable = this.cashierJurisdiction.Cashier_Number_Cumulation_enable;
            // this.getUserModuleConfigs();
        },
        getUserModuleConfigs() {                            // 获取商品购物车是否叠加配置
            stockApi.getUserModuleConfigs(['ReceptionCashierSet']).then(res => {
                if (res) {
                    let data = res.find(e => e.sv_user_module_code === 'ReceptionCashierSet');
                    let Cashier_Number_Cumulation = data.childInfolist.find(e => e.sv_user_config_code === 'Cashier_Number_Cumulation');
                    let cashierHasDetail = this.$app.isNull(Cashier_Number_Cumulation.childDetailList) ? false : true;
                    this.Cashier_Number_Cumulation_enable = cashierHasDetail ? Cashier_Number_Cumulation.childDetailList[0].sv_detail_is_enable : true;
                }
            })
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'goodsMoreInfo');
            this.$root.$emit('restaurant', 'goodsMoreInfo');
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '0';
        },
        statusInit() {                                              // 初始化状态
            this.multiPricePos = 0;
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        calculateInput(value) {                                     // 计算输入框的值
            if (value.indexOf('.') > -1) return;
            if (value == 'C') {
                this.clearInputNumber();
                return;
            }
            if (this.inputPriceHandler < 1) {
                this.inputNumber = '';
                this.inputPriceHandler = 5;
            }
            clearTimeout(this.inputPriceTimer);
            this.inputPriceTimer = setTimeout(() => {
                this.inputPriceHandler = 0;
                this.inputPriceTimer = null;
                clearTimeout(this.inputPriceTimer);
            }, 5000);
            if (value != '0') {
                if (this.inputNumber == '0' && value != '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + value;
            } else {
                if (parseFloat(this.inputNumber) > 0 || this.inputNumber === '0.') {
                    this.inputNumber = this.inputNumber + value;
                }
            }
            this.inputNumber = this.$app.verifyNumberDecimal(this.inputNumber);
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputNumber == '0') return;
            if (this.inputNumber.length == 1) return this.inputNumber = '0';
            this.inputNumber = this.inputNumber.substring(0, this.inputNumber.length - 1);
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件
            let goodsArray = [], carttingData = JSON.parse(JSON.stringify(this.carttingData.productResults));
			if(this.$route.path === '/cashier/cardRecharge' && this.hasMultiSpec) {
				this.specGoodsList.forEach((goodsItem, index) => {
                    let number = parseFloat(goodsItem.num);
                    if (goodsItem.isShow && number > 0) {
                        let dataArray = null, pNumber = number, dealPrice = goodsItem.sv_p_unitprice;
                        let product_Number_Cumulation_enable = true;
                        // 商品类型是否支持叠加
                        if (this.userInfo.sv_us_industrytype === 1 || this.userInfo.sv_us_industrytype === 6) {
                            product_Number_Cumulation_enable = this.goodsInfo.producttype_id !== 0 ? false : true;
                        }
                        if (this.Cashier_Number_Cumulation_enable && product_Number_Cumulation_enable) {
                            dataArray = carttingData.filter(e => e.productId === goodsItem.product_id) || [];
                            carttingData = carttingData.filter(e => e.productId !== goodsItem.product_id);
                            dataArray.forEach(e => {
                                pNumber += e.number
                            })
                            if (dataArray.length > 0) dealPrice = dataArray[0].dealPrice
                        }

                        let addItem = {
                            productId: goodsItem.product_id,
                            producttype_id: goodsItem.producttype_id,
                            project_time: goodsItem.project_time,
                            productName: goodsItem.sv_p_name + ' ' + goodsItem.sv_p_specs,
                            barCode: goodsItem.sv_p_barcode,
                            number: pNumber,
                            unitName: goodsItem.sv_p_unit,
                            price: this.sv_p_unitprice,
                            tradePrice: this.currentPrice.priceType === 0 ? null : this.currentPrice.priceType,
                            dealPrice: dealPrice,
                            couponMoney: 0,
                            tastes: [],
                            chargings: [],
                            specs: [],
                            dealMoney: goodsItem.sv_p_unitprice * pNumber
                        }
                        goodsArray.push(addItem);
                    }
                });

                if (goodsArray.length < 1) return this.$message.warning('请选择商品');
                this.$root.$emit('batchAddToCardRecharge', goodsArray);
				this.closeDialog();
				return
			}
            if (this.hasMultiSpec) {
                this.specGoodsList.forEach((goodsItem, index) => {
                    let number = parseFloat(goodsItem.num);
                    if (goodsItem.isShow && number > 0) {
                        let dataArray = null, pNumber = number, dealPrice = goodsItem.sv_p_unitprice;
                        let product_Number_Cumulation_enable = true;
                        // 商品类型是否支持叠加
                        if (this.userInfo.sv_us_industrytype === 1 || this.userInfo.sv_us_industrytype === 6) {
                            product_Number_Cumulation_enable = this.goodsInfo.producttype_id !== 0 ? false : true;
                        }
                        if (this.Cashier_Number_Cumulation_enable && product_Number_Cumulation_enable) {
                            dataArray = carttingData.filter(e => e.productId === goodsItem.product_id) || [];
                            carttingData = carttingData.filter(e => e.productId !== goodsItem.product_id);
                            dataArray.forEach(e => {
                                pNumber += e.number
                            })
                            if (dataArray.length > 0) dealPrice = dataArray[0].dealPrice
                        }

                        let addItem = {
                            productId: goodsItem.product_id,
                            producttype_id: goodsItem.producttype_id,
                            project_time: goodsItem.project_time,
                            productName: goodsItem.sv_p_name + ' ' + goodsItem.sv_p_specs,
                            barCode: goodsItem.sv_p_barcode,
                            number: pNumber,
                            unitName: goodsItem.sv_p_unit,
                            price: this.sv_p_unitprice,
                            tradePrice: this.currentPrice.priceType === 0 ? null : this.currentPrice.priceType,
                            dealPrice: dealPrice,
                            couponMoney: 0,
                            tastes: [],
                            chargings: [],
                            specs: [],
                            dealMoney: goodsItem.sv_p_unitprice * pNumber
                        }
                        goodsArray.push(addItem);
                    }
                });

                if (goodsArray.length < 1) return this.$message.warning('请选择商品');
            } else {
                let dataArray = null, pNumber = parseFloat(this.inputNumber);
                if (pNumber < 1) return this.$message.warning('请输入数量');
                let product_Number_Cumulation_enable = true;
                // 商品类型是否支持叠加
                if (this.userInfo.sv_us_industrytype === 1 || this.userInfo.sv_us_industrytype === 6) {
                    product_Number_Cumulation_enable = this.goodsInfo.producttype_id !== 0 ? false : true;
                }
                if (this.Cashier_Number_Cumulation_enable && product_Number_Cumulation_enable) {
                    dataArray = carttingData.filter(e => e.productId === this.goodsId) || [];
                    carttingData = carttingData.filter(e => e.productId !== this.goodsId);
                    dataArray.forEach(e => {
                        pNumber += e.number
                    })
                }
                let addItem = {
                    productId: this.goodsId,
                    number: pNumber,
                    price: this.currentPrice,
                    tradePrice: this.currentPrice.priceType === 0 ? null : this.currentPrice.priceType,
                    dealPrice: this.currentPrice,
                    dealMoney: this.currentPrice * parseFloat(this.inputNumber)
                }
                goodsArray.push(addItem);
            }
            if (this.goodsInfo.sv_is_current_price) {
                this.currentPriceArray = goodsArray;
                return this.currentPriceStatus = true
            }
            if (!this.isCurrent) {
                const includedIndustry = [1, 6]        // 1-丽人美业 6-棋牌茶楼
                if (includedIndustry.includes(this.$store.state.userInfo.sv_us_industrytype)) {
                    this.batchAddToCartting(carttingData.concat(goodsArray));
                } else {
                    this.batchAddToCartting(goodsArray.concat(carttingData));
                }
            } else {
                this.$root.$emit('batchAddToList', goodsArray);
            }
            this.$root.$emit('showCatting');
            this.closeDialog();
        },
        moneyEdit(val) {
            this.currentPriceArray = this.currentPriceArray.map(e => {
                return {
                    ...e,
                    productChangePrice: parseFloat(val)
                }
            })
            let carttingData = JSON.parse(JSON.stringify(this.carttingData.productResults));
            carttingData = carttingData.filter(e => e.productId !== this.goodsId);
            if (!this.isCurrent) this.batchAddToCartting(this.currentPriceArray.concat(carttingData));
            else this.$root.$emit('batchAddToList', this.currentPriceArray);
            this.closeDialog();
        },
        handleSpecItem(index, pos) {                                // 选择多规格项
            this.isShowMutiPrice = false;
            this.validList[index].dataList[pos].selected = !this.validList[index].dataList[pos].selected;
            if (this.validList[index].dataList[pos].selected) {
                if (!this.$app.isNull(this.validList[index].dataList[pos].img)) this.goodsImg = this.validList[index].dataList[pos].img;
            } else {
                // 取消颜色选择时，从已选中的颜色中找出一张图片赋值给商品图
                const selectedArray = this.validList[index].dataList.filter(e => e.selected && !this.$app.isNull(e.img))
                if (selectedArray.length > 0) {
                    this.goodsImg = selectedArray[0].img;
                } else {
                    this.goodsImg = this.defaultGoodsImg;
                }
            }
            let specKeywords = [];
            this.validList[index].dataList.forEach(e => {
                if (e.selected) {
                    specKeywords.push(e.name);
                }
            });
            index === 0 ? this.goodsValidSelected.valid = specKeywords : this.goodsValidSelected.specs = specKeywords;

            this.specGoodsList.forEach(e => { e.isShow = this.goodsValidSelected.valid.length === 0 && this.goodsValidSelected.specs.length === 0 ? true : false });
            let specwordlist = [];
            if (this.goodsValidSelected.valid.length > 0) {
                this.goodsValidSelected.valid.forEach(e => {
                    if (this.goodsValidSelected.specs.length > 0) {
                        this.goodsValidSelected.specs.forEach(k => {
                            specwordlist.push(e + ',' + k);
                        });
                    } else {
                        specwordlist.push(e);
                    }
                })
            } else {
                this.goodsValidSelected.specs.forEach(k => {
                    specwordlist.push(k);
                });
            }
            this.specGoodsList.forEach(e => {
                let array = e.sv_p_specs.split(',');
                specwordlist.forEach(k => {
                    let hasKey = array.filter(p => k === p).length;
                    if (k === e.sv_p_specs || hasKey > 0) {
                        e.isShow = true;
                    }
                });
            });
            this.$nextTick(() => {
                if (!!this.$refs.listWrap) {
                    this.$refs.listWrap.wrap.scrollTop = 0;
                    this.$refs.listWrap.update();
                }
            })
        },
        handleBatchInput({ target }) {                              // 输入批量改数量
            target.value = this.$app.verifyNumberDecimalThree(target.value);
            this.batchUpdateNum = target.value;
            this.batchNumber(this.batchUpdateNum);
        },
        batchSubtract() {                                           // 批量减数量
            if (this.batchUpdateNum < 1) return;
            this.batchUpdateNum--;
            this.batchNumber(this.batchUpdateNum);
        },
        batchAdd() {                                                // 批量加数量
            this.batchUpdateNum++;
            this.batchNumber(this.batchUpdateNum);
        },
        batchNumber(number) {                                       // 批量修改数量
            this.specGoodsList.forEach(e => {
                if (e.isShow) {
                    // e.selectedValue = 0;
                    e.num = number;
                    if (e.num > e.sv_p_storage && !this.cashierJurisdiction.ZeroInventorySales) e.num = e.sv_p_storage > 0 ? e.sv_p_storage : 0;
                    // e.selectedValue = e.selectedValue + k.num;
                }
            });
        },
        handleItemInput({ target }) {                               // 输入改数量
            if (target.value === '') target.value = 0;
            target.value = this.$app.verifyNumberDecimalThree(target.value);
        },
        handleSubtract(item) {                                      // 减数量
            if (item.num < 1) return;
            item.num--;
            this.batchUpdateNum = 0;
        },
        handleAdd(item) {                                           // 加数量
            // if (item.num > item.sv_p_storage - 1 && !this.cashierJurisdiction.ZeroInventorySales) return this.$message.warning('库存不足');
            item.num++;
            this.batchUpdateNum = 0;
        },
        handleMultiPriceItem(index, item) {                          // 改变多价格下标
            this.multiPricePos = index;
            this.handleMultiPriceBack();
        },
        handleMultiPriceBack() {
            this.isShowMutiPrice = false;
        },
        getMoreSpec() {                                             // 获取商品详情
            if (this.goodsId === 0) return;
            let query = {
                id: this.goodsId,
                is_mp: false,
                is_size_sort: true,
                readlabelfiled: false
            }
            stockApi.getMorespecSubProductList(query).then(res => {
                if (res) {
                    let goodsData = res.values;
                    if (!this.$app.isNull(goodsData.sv_p_imagesList)) {
                        if (goodsData.sv_p_imagesList.length > 0) {
                            if (!this.$app.isNull(goodsData.sv_p_imagesList[0].code)) {
                                const img = this.$app.fmtImg(goodsData.sv_p_imagesList[0].code);
                                console.log(img)
                                this.goodsImg =  img
                                this.defaultGoodsImg = img
                            }
                        }
                    }
                    this.goodsInfo = {
                        goodsName: goodsData.sv_p_name,                   // 商品名称
                        producttype_id: goodsData.producttype_id,
                        categoryName: goodsData.sv_pc_name,               // 分类名称
                        barcode: goodsData.sv_p_barcode,                  // 商品条码
                        unitprice: goodsData.sv_p_unitprice,              // 零售价
                        specs: goodsData.sv_p_specs,                      // 默认规格
                        storage: goodsData.sv_p_storage,                  // 库存
                        sv_is_current_price: goodsData.sv_is_current_price
                    }
                    let priceArray = [
                        {
                            name: '零售价',
                            priceType: 0,
                            value: goodsData.sv_p_unitprice
                        },
                        // {
                        //     name: '会员价',
                        //     value: goodsData.sv_p_memberprice
                        // },
                        // {
                        //     name: '会员价1',
                        //     value: goodsData.sv_p_memberprice1
                        // },
                        // {
                        //     name: '会员价2',
                        //     value: goodsData.sv_p_memberprice2
                        // },
                        // {
                        //     name: '会员价3',
                        //     value: goodsData.sv_p_memberprice3
                        // },
                        // {
                        //     name: '会员价4',
                        //     value: goodsData.sv_p_memberprice4
                        // },
                        // {
                        //     name: '会员价5',
                        //     value: goodsData.sv_p_memberprice5
                        // },
                        {
                            name: '批发价1',
                            priceType: 1,
                            value: goodsData.sv_p_tradeprice1
                        },
                        {
                            name: '批发价2',
                            priceType: 2,
                            value: goodsData.sv_p_tradeprice2
                        },
                        {
                            name: '批发价3',
                            priceType: 3,
                            value: goodsData.sv_p_tradeprice3
                        },
                        {
                            name: '批发价4',
                            priceType: 4,
                            value: goodsData.sv_p_tradeprice4
                        },
                        {
                            name: '批发价5',
                            priceType: 5,
                            value: goodsData.sv_p_tradeprice5
                        }
                    ]
                    priceArray.forEach(item => {
                        if (item.value > 0) {
                            this.priceList.push(item)
                        }
                    });
                    this.validList = this.$app.isNull(goodsData.sv_master_validspec) ? [] : goodsData.sv_master_validspec.map(e => {
                        let dataList = e.attrilist.filter(k => k.attri_name !== '');
                        return {
                            spec_id: e.spec_id,
                            spec_name: e.spec_name,
                            dataList: dataList ? dataList.map(item => {
                                return {
                                    id: item.spec_id,
                                    name: item.attri_name,
                                    img:this.$app.fmtImg(item.images_info),
                                    selected: false
                                }
                            }) : []
                        }
                    });
                    this.specGoodsList = this.$app.isNull(goodsData.productCustomdDetailList) ? [] : goodsData.productCustomdDetailList.map(e => {
                        return {
                            product_id: e.product_id,
                            sv_p_name: e.sv_p_name,
                            sv_p_barcode: e.sv_p_barcode,
                            sv_p_artno: e.sv_p_artno,
                            sv_p_specs: e.sv_p_specs,
                            sv_p_unit: e.sv_p_unit,
                            sv_p_unitprice: e.sv_p_unitprice,
                            sv_p_storage: e.sv_p_storage,
                            project_time: e.project_time,
                            num: 0,
                            isShow: true
                        }
                    })

                    this.$nextTick(() => {
                        !!this.$refs.multiSpecWrap && this.$refs.multiSpecWrap.update();
                        !!this.$refs.listWrap && this.$refs.listWrap.update();
                    })
                }
            })
        },

    }
};
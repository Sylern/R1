import base from "@/api/base";
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import goodsItem from '../goodsItem/goodsItem.vue';
import numberChange from '../numberChange/numberChange.vue';
import priceChange from '../priceChange/priceChange.vue';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import utils from '@/utils/utils';
const { debounce, throttle } = utils;

export default {
    name: 'goodsReturn',
    components: { goodsItem, numberChange, priceChange, payTypeList },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: Number,
            default: null
        },
        payTypeName: {
            type: String,
            default: ''
        },
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            s: null,                            // 加入购物车计时器
            ballAnimation: '',
            animationImg: '',
            isSubmitting: false,
            checkPrint: false,
            checkedJson: [],
            orderList: [],
            imgType: 3,
            carttingData: [],
            totalCarttingInfo: {
                num: 0,
                totalMoney: 0
            },
            categoryList: [
                {
                    sv_pc_name: '全部分类',
                    productcategory_id: -1
                }
            ],
            remark: '',
            searchKeywords: '',
            queryGoods: {
                category: -1,
                erjicategory: -1,
                isn: '',
                name: '',
                pageSize: 20,
                pageIndex: 1,
                read_morespec: true
            },
            goodsTotal: 0,                                          // 数据页码
            goodsList: [],
            popExchangeStuts: false,                                // 换货下一步弹窗
            isSubmitting: false,                                    // 正在结算
            payInfo: {
                queryId: '',
                businessType: 1,
                svOrderListId: null,
                receivableMoney: null,                              // 应收金额
                money: null                                         // 扫码支付金额
            },
            successOrderId: null,
            goodsNumberChangeStatus: false,
            currentExchangeItem: {
                product_num: 0,
            },
            carttingGoodsNumberChangeStatus: false,                 // 购物车修改数量
            currentCarrtingItem: {                                  // 购物车当前替换商品
                number: 0
            },
            priceChangeStatus: false,                               // 购物车改价
        }
    },
    computed: {
        ...mapState(['userInfo', 'user_local_data', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        checkedTotalInfo() {
            let num = 0, totalMoney = 0;
            this.checkedJson.forEach(e => {
                num = this.$app.addNumber(num, e.currentNumber);
                let currentMoney = this.$app.multiplyNumber(e.currentNumber, e.product_unitprice);
                totalMoney = this.$app.addNumber(totalMoney, currentMoney);
            })
            return {
                num,
                totalMoney,
                payMoney: this.$app.subtractNumber(this.totalCarttingInfo.totalMoney, totalMoney)
            }
        },
        imgModelType() {                                    // 展示不同商品图片的模式
            return this.user_local_data.goodsListShowType
        },

    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.popExchangeStuts = false;
                    this.checkedJson = [];
                    this.orderList = this.dataList.map(e => {
                        return {
                            ...e,
                            currentNumber: 0
                        }
                    });
                    this.goodsList = [];
                    this.queryGoods = {
                        category: -1,
                        erjicategory: -1,
                        isn: '',
                        name: '',
                        pageSize: 20,
                        pageIndex: 1,
                        read_morespec: true
                    }
                    this.remark = '';
                    this.successOrderId = null;
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.getFirstCategory()
                    this.getGoodsList();
                }
            }
        },
        orderList: {
            deep: true,
            handler(newVal, oldVal) {
                if (this.dialogVisible) this.checkedJson = this.orderList.filter(e => e.currentNumber > 0);
            }
        },
        carttingData: {
            deep: true,
            handler(newVal, oldVal) {
                let num = 0, totalMoney = 0;
                newVal.forEach(e => {
                    num = this.$app.addNumber(num, e.number);
                    totalMoney = this.$app.addNumber(totalMoney, e.dealMoney);
                })
                this.totalCarttingInfo = {
                    num,
                    totalMoney
                }
                this.$nextTick(() => {
                    !!this.$refs.goodsList && this.$refs.goodsList.update();
                })
            }
        },
        popExchangeStuts: {
            handler(newVal, oldVal) {
                if (newVal) {

                }
            }
        },
    },
    mounted() {
        this.$root.$on('batchAddToList', (dataArray) => {
            let list = JSON.parse(JSON.stringify(this.carttingData));
            dataArray.forEach(e => {
                list = list.filter(item => item.productId !== e.product_id);
            })
            this.carttingData = list.concat(dataArray);
        })
    },
    methods: {
        ...mapMutations(['update']),
        calcTaste(item) {                                           // 计算口味加料
            let dataArray = item.product_taste_money_detail ? JSON.parse(item.product_taste_money_detail) : [];
            let totalMoney = 0, dataInfo = '';
            dataArray.forEach(e => {
                if (e.price > 0) {
                    totalMoney += e.price;
                    dataInfo += e.name + ':' + e.price + '元 '
                }
            })
            return `<label>` + dataInfo + `</label>`
        },
        handleGoodsNumberSubtract(item, index) {
            if (item.currentNumber < 1) {
                if (item.sv_pricing_method === 1) {
                    item.currentNumber = 0;
                    this.orderList[index].currentNumber = 0;
                }
                return
            };
            item.currentNumber = this.$app.subtractNumber(item.currentNumber, 1);
            this.orderList[index].currentNumber = this.$app.subtractNumber(this.orderList[index].currentNumber, 1);
        },
        handleGoodsNumberAdd(item, index) {
            if (item.sv_is_package_detailed) return this.$message.warning('套餐商品请使用整单退货')
            if (item.currentNumber > item.product_num - 1) {
                if (item.sv_pricing_method === 1) {
                    item.currentNumber = item.product_num;
                    this.orderList[index].currentNumber = item.product_num;
                }
                return
            };
            item.currentNumber = this.$app.addNumber(item.currentNumber, 1);
            this.orderList[index].currentNumber = this.$app.addNumber(this.orderList[index].currentNumber, 1);
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        searchGoodsList() {
            this.queryGoods.pageIndex = 1;
            this.queryGoods.name = this.searchKeywords;
            if (this.userInfo.sv_us_industrytype === 15 && this.searchKeywords.length === 13 && (parseInt(this.searchKeywords) + '').length === 13) {
                this.queryGoods.isn = this.searchKeywords.substring(2, 7)
            } else {
                this.queryGoods.isn = this.searchKeywords;
            }
            this.queryGoods.category = -1;
            this.getGoodsList();
        },
        goodsImg(item) {
            let imgObj = JSON.parse(item.sv_p_images);
            return !this.$app.isNull(imgObj) ?this.$app.fmtImg(imgObj[0].code) : ''
        },
        handleCategory(item) {
            this.queryGoods = {
                category: item.value,
                erjicategory: -1,
                isn: '',
                name: '',
                pageSize: 20,
                pageIndex: 1,
                read_morespec: true
            }
            this.getGoodsList();
        },

        handleDel(index) {
            this.carttingData.removeByIndex(index);
        },
        handleGoodsToCart(addGoods) {                              // 添加商品数据到购物车
            let goodsItem = {
                ...addGoods,
                dealPrice: addGoods.currentDealPrice,
                dealMoney: this.$app.moneyFixed(addGoods.currentDealPrice, 2)
            }

            let specs = this.$app.isNull(goodsItem.specIds) ? [] : goodsItem.specIds;
            let tastes = this.$app.isNull(goodsItem.tasteIds) ? [] : goodsItem.tasteIds;
            let chargings = this.$app.isNull(goodsItem.chargingIds) ? [] : goodsItem.chargingIds;
            let isSame = goodsItem.product_id + specs + tastes + chargings;
            let dataFilter = this.carttingData.filter(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) === isSame);
            let goodsNumber = goodsItem.number || 1;
            let pNumber = dataFilter.length > 0 ? parseInt(dataFilter[0].number) + goodsNumber : goodsNumber;
            let addItem = {
                productId: goodsItem.product_id,
                productName: goodsItem.sv_p_name,
                barCode: goodsItem.sv_p_barcode,
                number: pNumber || 1,
                unitName: goodsItem.sv_p_unit,
                tastes: tastes,
                chargings: chargings,
                specs: specs,
                price: goodsItem.sv_p_unitprice,
                dealPrice: goodsItem.dealPrice,
                couponMoney: 0,
                remark: goodsItem.remark,
                isPricingMethod: goodsItem.isPricingMethod || false,
                dealMoney: this.$app.multiplyNumber(goodsItem.dealPrice, pNumber)
            }

            let dataArray = [];
            dataArray.push(addItem);
            dataArray = dataArray.concat(this.carttingData.filter(e => (e.productId + [...e.specs.map(k => k.id)] + [...e.tastes.map(k => k.id)] + [...e.chargings.map(k => k.id)]) !== isSame));
            this.carttingData = dataArray;
        },
        addCart(e, goodsItem) {                                     // 添加购物车
            this.handleGoodsToCart(goodsItem);
            if (this.$app.isNull(e)) return;
            // 加入购物车动画
            clearTimeout(this.s);
            let self = this,
                speed = 1000, //速度
                //点击的起点
                startY = e.clientY - 50,
                startX = e.clientX,
                //购物车坐标
                endX = 400,
                endY = 250;
            // 获取当前点击的商品图片
            self.animationImg = goodsItem.img;
            //计算不同位置的动画执行时间
            let m = Math.sqrt((Math.abs(startX - endX) ** 2) + (Math.abs(startY - endY) ** 2));
            let animationTime = (m * speed) / 4000;
            //给小球起点位置
            self.ballAnimation = `top:${startY}px;left:${startX}px;transition:all 0s;display:block;transform: scale(1);`
            setTimeout(() => {
                self.ballAnimation = `top:${endY}px;left:${endX}px;transition:all ${animationTime}ms ease-in,left ${animationTime}ms linear;display:block;transform: scale(0.4);`;
                //给小球终点坐标，并执行动画
                this.s = setTimeout(() => {
                    //动画完成之后，重置
                    self.animationImg = '';
                    self.ballAnimation = `left:0;right:0;transition:all 0s;display:none;transform: scale(1);`;
                    clearTimeout(this.s);
                }, animationTime);
            }, 50)
        },
        pageLast() {
            if (this.queryGoods.pageIndex === 1) return;
            this.queryGoods.pageIndex--;
            this.pageChange();
        },
        pageNext() {
            if (this.queryGoods.pageIndex === this.goodsTotal) return;
            this.queryGoods.pageIndex++;
            // this.getGoodsList();
            this.pageChange();
        },
        pageChange: debounce('getGoodsList', 200),
        //#region 
        handleCheck() {
            if (this.$app.isNull(this.orderId)) return this.$message.error('找不到订单')
            if (this.$app.isNull(this.orderId)) return this.$message.warning('请选择支付方式')
            if (this.$app.isNull(this.checkedJson)) return this.$message.warning('请确认要换货的商品');
            const paymentList = this.$refs.payTypeList.getPayTypeInfo() || [];
            if (this.$app.isNull(paymentList)) return this.$message.warning('请选择支付方式');
            let filter = paymentList.filter(e => e.name === '扫码支付');
            if (filter.length > 0) {
                if (!this.userInfo.dec_payment_config.ConvergePay) return this.$message.warning('您尚未开通扫码支付，请联系客服')
                if (this.checkedTotalInfo.payMoney <= 0) {
                    return this.$message.warning('不需要收款，支付方式不支持扫码支付')
                }
            }
            let buySteps = this.carttingData.map((e, i) => {
                let serviceName = e.productId === 0 ? e.productName : null;
                let packageGroups = [];
                if (!this.$app.isNull(e.packageGroups)) {
                    e.packageGroups.forEach(p => {
                        packageGroups.push({
                            groupId: p.id,
                            products: p.products.map(k => {
                                return {
                                    productId: k.productId,
                                    specIds: this.$app.isNull(k.specs) ? [] : [...k.specs.map(eki => eki.id)],
                                    chargingIds: this.$app.isNull(k.chargings) ? [] : [...k.chargings.map(eki => eki.id)],
                                    tasteIds: this.$app.isNull(k.tastes) ? [] : [...k.tastes.map(eki => eki.id)],
                                }
                            })
                        })
                    })
                }
                let promotionId = this.$app.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 15 ? e.buyStepPromotion.promotionId : null);
                return {
                    index: i + 1,
                    productId: e.productId,
                    number: e.number,
                    tradePrice: e.tradePrice,
                    serviceName: serviceName,
                    setmealId: promotionId,
                    tasteIds: [...(e.tastes || []).map(e => { return e.id })],
                    chargingIds: [...(e.chargings || []).map(e => { return e.id })],
                    specIds: [...(e.specs || []).map(e => { return e.id })],
                    productChangePrice: e.dealPrice,                            // 售价改价
                    productChangeMoney: null,                                   // 小计改价
                    packageGroups: packageGroups,
                    // commissions: [this.userInfo.user_id]
                }
            });
            const postData = {
                originSvOrderListId: this.orderId,
                reason: this.remark,
                payment: paymentList[0].name,
                refundPassword: "E10ADC3949BA59ABBE56E057F20F883E",
                exchanges: this.checkedJson.map(e => {
                    return {
                        orderProductId: e.id,
                        number: parseFloat(e.currentNumber)
                    }
                }),
                buySteps,
                isSettle: true
            }
            this.isSubmitting = true;
            stockApi.orderExchange(postData).then(res => {
                if (res) {
                    this.isSubmitting = false;
                    this.successOrderId = res.orderRunningId;
                    if (this.$refs.payTypeList.isScanPay()) {
                        this.payInfo = {
                            queryId: res.queryId,
                            svOrderListId: res.svOrderListId,
                            receivableMoney: res.payMoney,
                            money: paymentList.find(p => p.name === '扫码支付').money
                        }
                        this.$refs.payTypeList.handleScan();
                    } else {
                        this.submitSuccess();
                    }
                } else {
                    this.isSubmitting = false;
                }
            }).catch(_ => {
                this.isSubmitting = false;
            });
        },
        submitSuccess() {                                           // 结算成功回调
            if (this.checkPrint) {
                this.handlePrint()
            }
            this.$emit('handleBack');
        },
        handlePrint() {
            let printDataList = [
                {
                    type: 'line',
                    text: this.userInfo.sv_us_name,
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: '换货单',
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '单号：' + this.successOrderId
                },
                {
                    type: 'line',
                    text: '操作员：' + this.userInfo.sv_ul_name
                },
                {
                    type: 'line',
                    text: '商品信息',
                    spaceTopLine: true
                },
            ]
            let tableData = {
                header: ['商品/编码', '数量', '单价', '小计'],
                list: [],
                totalNumber: 0,
                totalMoney: 0,
                footer: []
            }
            tableData.list = this.checkedJson.concat(this.carttingData).map(e => {
                let currentItem = {}
                if (e.currentNumber) {
                    let productName = e.product_name + (this.$app.isNull(e.taste_data) ? '' : '[' + e.taste_data + ']');
                    if (!this.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                    let showList = this.$app.isNull(e.combination_list) ? [] : e.combination_list;
                    let printList = this.$app.isNull(e.combinationPrint) ? [] : e.combinationPrint;
                    let packageGroupsList = [];
                    if (showList.length > 0) {
                        packageGroupsList = showList.map(k => {
                            let subProductName = k.product_name + (this.$app.isNull(k.taste_data) ? '' : '[' + k.taste_data + ']');
                            return {
                                name: subProductName,
                                barCode: k.sv_p_barcode,
                                number: k.product_num + '',
                                price: this.$app.moneyFixed(k.product_price),
                                couponMoney: 0,
                                total: ''
                            }
                        });
                    } else if (printList.length > 0) {
                        packageGroupsList = printList.map(k => {
                            let subProductName = k.sv_p_name + (this.$app.isNull(k.taste_data) ? '' : '[' + k.taste_data + ']');
                            return {
                                name: subProductName,
                                barCode: k.sv_p_barcode,
                                number: k.product_number + '',
                                price: this.$app.moneyFixed(k.sv_price),
                                couponMoney: 0,
                                total: ''
                            }
                        });
                    }
                    let packageGroups = [{
                        name: '',
                        products: packageGroupsList
                    }]
                    const itemNum = -1 * e.currentNumber;
                    let sv_preferential_data = this.$app.isNull(e.sv_preferential_data) ? [] : JSON.parse(e.sv_preferential_data);
                    currentItem = {
                        name: packageGroupsList.length > 0 ? '套-' + productName : productName,
                        code: e.sv_p_barcode || '',
                        number: itemNum + '',
                        specs: [],
                        tastes: [],
                        chargings: [],
                        packageGroups: packageGroupsList.length > 0 ? packageGroups : null,
                        price: this.$app.moneyFixed(e.product_price),
                        couponMoney: sv_preferential_data.length > 0 ? this.$app.moneyFixed(sv_preferential_data[0].m, 2) : 0,
                        total: this.$app.moneyFixed(this.$app.multiplyNumber(itemNum, e.product_unitprice), 2)
                    }
                } else {
                    let specs = '', tastes = '', chargings = '';
                    e.specs && e.specs.forEach(e => {
                        specs += '[' + e.name + e.price + '元]'
                    })
                    e.tastes && e.tastes.forEach(e => {
                        tastes += '[' + e.name + e.price + '元]'
                    })
                    e.chargings && e.chargings.forEach(e => {
                        chargings += '[' + e.name + e.price + '元]'
                    })
                    let cartProductName = e.productName + specs + tastes + chargings;
                    if (e.isNewSpec) cartProductName += '[' + e.sepcs + ']';
                    let goodsCode = e.barCode;
                    let goodsArtCode = e.artNo;
                    let code = goodsCode || goodsArtCode;
                    if (this.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
                        code = goodsArtCode || goodsCode;
                    }
                    currentItem = {
                        name: e.isPackage ? '套-' + cartProductName : cartProductName,
                        code: code,
                        number: e.number + '',
                        showUnit: false,
                        unitName: e.unitName,
                        couponMoney: e.productCouponMoney,
                        price: this.$app.moneyFixed(e.dealPrice, 2),
                        dealPrice: e.dealPrice,
                        total: this.$app.moneyFixed(e.dealMoney, 2),
                        packageGroups: e.isPackage ? e.packageGroups : ''
                    }
                }
                return { ...currentItem }
            });
            tableData.footer = ['合计', '', '', this.$app.moneyFixed(this.checkedTotalInfo.payMoney, 2)];
            let isDriverType = this.$store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
            let tableArray = this.$app.printTableDate(tableData, isDriverType, this.$store.state.printTemplate.salesData.width);
            printDataList = printDataList.concat(tableArray);
            // printDataList.push({
            //     type: 'line',
            //     text: '换货信息',
            //     spaceTopLine: true
            // })

            // let tableData2 = {
            //     header: [],
            //     list: [],
            //     footer: []
            // }
            // tableData2.header.push('商品');
            // tableData2.header.push('数量');
            // tableData2.header.push('单价');
            // tableData2.header.push('小计');
            // let goodsTotal = 0;
            // tableData2.list = this.carttingData.map(e => {
            //     let specs = '', tastes = '', chargings = '';
            //     e.specs && e.specs.forEach(e => {
            //         specs += '[' + e.name + e.price + '元]'
            //     })
            //     e.tastes && e.tastes.forEach(e => {
            //         tastes += '[' + e.name + e.price + '元]'
            //     })
            //     e.chargings && e.chargings.forEach(e => {
            //         chargings += '[' + e.name + e.price + '元]'
            //     })
            //     let productName = e.productName + specs + tastes + chargings;
            //     if (e.isNewSpec) productName += '[' + e.sepcs + ']';
            //     goodsTotal = this.$app.addNumber(goodsTotal, e.number);

            //     let goodsCode = e.barCode ;
            //     let goodsArtCode = e.artNo;
            //     let code = goodsCode || goodsArtCode;
            //     if (this.userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
            //         code = goodsArtCode || goodsCode;
            //     }
            //     return {
            //         name: e.isPackage ? '套-' + productName : productName,
            //         code: code,
            //         number: e.number + '',
            //         showUnit: false,
            //         unitName: e.unitName,
            //         couponMoney: e.productCouponMoney,
            //         price: this.$app.moneyFixed(e.dealPrice),
            //         dealPrice: e.dealPrice,
            //         total: this.$app.moneyFixed(e.dealMoney),
            //         packageGroups: e.isPackage ? e.packageGroups : ''
            //     }
            // });
            // tableData2.footer = ['合计', goodsTotal + '', '', this.$app.moneyFixed(this.totalCarttingInfo.totalMoney) + ''];

            // let tableArray2 = this.$app.printTableDate(tableData2, isDriverType, this.$store.state.printTemplate.salesData.width);
            // if (this.userInfo.sv_us_industrytype === 27) {
            //     // 餐饮行业
            //     tableArray2 = this.$app.printTableDateCater(tableData2, isDriverType, this.$store.state.printTemplate.salesData.width);
            // }
            // // 合并打印数组-表格
            // printDataList = printDataList.concat(tableArray2);

            let bottomArray = [
                {
                    type: 'line',
                    text: (this.checkedTotalInfo.payMoney > 0 ? '应补金额：' : '可退金额：') + this.$app.moneyFixed(Math.abs(this.checkedTotalInfo.payMoney), 2),
                    spaceTopLine: true
                },
                {
                    type: 'line',
                    text: '支付方式：' + this.$refs.payTypeList.getPayTypeInfo()[0].name,
                },
                {
                    type: 'line',
                    text: '打印时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    spaceLine: 3
                }
            ]
            printDataList = printDataList.concat(bottomArray);
            this.$print.sales(printDataList);
        },
        handleCloseScan() {

        },
        getFirstCategory() {                                        // 获取商品一级分类
            if (this.categoryList.length > 1) return
            stockApi.getFirstCategory({ is_cashier: true }).then(res => {
                if (res) {
                    this.categoryList = [...this.categoryList, ...(res || [])].map(e => {
                        return {
                            value: e.productcategory_id,
                            label: e.sv_pc_name
                        }
                    });
                }
            });
        },
        getGoodsList(initSearch) {                                  // 获取商品数据
            if (initSearch) {
                this.queryGoods.pageIndex = 1;
                this.queryGoods.name = '';
                this.queryGoods.isn = '';
            }
            stockApi.getProductCashierList(this.queryGoods).then(res => {
                if (res) {
                    this.goodsList = this.$app.isNull(res.list) ? [] : res.list;
                    this.goodsTotal = res.total;
                    this.$nextTick(() => {
                        !!this.$refs.goodsListScroll && this.$refs.goodsListScroll.update();
                    })
                    if (this.queryGoods.name != '' && this.queryGoods.pageIndex == 1 && this.goodsList.length == 1) {
                        let searchCode = this.queryGoods.name;
                        let is_artno = this.goodsList[0].sv_p_artno === searchCode.substring(2, 7);
                        if (this.userInfo.sv_us_industrytype === 15 && searchCode.length === 13 && is_artno) {
                            let weightNumber = searchCode.substring(7, 12) / 100 / this.goodsList[0].sv_p_unitprice;
                            let goodsItem = {
                                ...this.goodsList[0],
                                number: parseFloat(weightNumber).toFixed(3)
                            }
                            this.handleGoodsToCart(goodsItem);
                        } else {
                            this.$nextTick(() => {
                                this.$refs.goodsItem[0].handleGoodsItem()
                            })
                        }
                    } else {
                        // this.touchCarttingCursor();
                    }
                }
            });
        },
        showNumberChange(item) {                                    // 展示修改数量弹窗   
            this.goodsNumberChangeStatus = true;
            this.currentExchangeItem = item;
        },
        handleNumberChange(val) {
            this.orderList[this.currentExchangeItem.index].currentNumber = val;
        },
        handleExchangeNext() {                                      // 选择换货下一步
            if (this.payTypeName === '微信支付' || this.payTypeName === '支付宝') {
                this.$confirm('订单换货，原订单支付方式：'+ this.payTypeName +'，不支持原路退，是否确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.popExchangeStuts = true;
                    this.carttingData = [];
                })
            } else {
                this.popExchangeStuts = true;
                this.carttingData = [];
            }
        },
        handleGoodsNumber(item) {
            this.carttingGoodsNumberChangeStatus = true;
            this.currentCarrtingItem = item;
        },
        handleGoodsPrice(item) {
            this.priceChangeStatus = true;
            this.currentCarrtingItem = item;
        },
        handleCarttingNumberChange(val) {
            this.currentCarrtingItem.number = val;
            this.currentCarrtingItem.dealMoney = this.$app.multiplyNumber(this.currentCarrtingItem.dealPrice, val)
        },
        handleCarttingPriceChange(val) {
            this.currentCarrtingItem.dealPrice = val;
            this.currentCarrtingItem.dealMoney = this.$app.multiplyNumber(this.currentCarrtingItem.number, val)
        },
        handleEnter() {
            this.$emit('handleBack', dataObj);
            this.closeDialog();
        },
        handleInput(target) {

        }
    }
};
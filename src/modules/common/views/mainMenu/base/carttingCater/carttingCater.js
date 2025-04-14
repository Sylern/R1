import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
import goodsPackage from '../goodsPackage/goodsPackage.vue';
import priceChange from '../priceChange/priceChange.vue';
import numberChange from '../numberChange/numberChange.vue';
export default {
    name: 'carttingCater',
    components: { cateringMore, goodsWeight, goodsPackage, priceChange, numberChange },
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: null
                }
            }
        },
        popOrderData: {
            type: Object,
            default: () => {
                return {
                    productResults: []
                }
            }
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        waittingStatus: {
            type: Boolean,
            default: false
        },
        listPos: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            timer: null,
            currentPos: -1,
            priceChangeMenuPos: 0,                          // 改价弹窗菜单 0 改价 1 改折
            numberChangeStatus: false,                      // 退菜数量弹窗
            priceChangeStatus: false,
            currentPriceStatus: false,                      // 改时价弹窗

            clickGoodsId: null,
            clickGoodsNumber: null,
            cateringInfo: {
                id: null,
                number: null,
                remark: '',
                waittingStatus: false
            },
            cateringData: {                                 // 规格 口味 加料
                specs: [],
                tastes: [],
                chargings: []
            },
            orderItemHandleStatus: false,                   // 已下单菜品点击弹窗
            cateringMoreStatus: false,                      // 菜品更多编辑
            goodsWeightStatus: false,                       // 称重商品编辑
            goodsWeightItem: {
                isEdit: true,
                id: null,
                number: null,
                remark: ''
            },
            goodsPackageStatus: false,                      // 套餐编辑
            goodsPackageItem: {
                id: null
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'memberInfo']),
        ...mapState('permission', ['CashierManage']),
        // currentPos: {
        //     // 餐饮等叫 0 等叫 1 需要起菜
        //     get() { return this.popOrderData }, set(value) {
        //         this.$emit('update:popOrderData', value);
        //     }
        // },
        orderData: {
            get() { return this.popOrderData; }, set(value) {
                this.$emit('update:popOrderData', JSON.parse(JSON.stringify(value)));
            }
        },
        improtMoney() {
            if (this.currentPos < 0) return '0'
            if (this.isOrderList) {
                if (this.$app.isNull(this.popOrderData.productResults)) return '0'
                return this.popOrderData.productResults[this.currentPos].price
            }
            if (this.$app.isNull(this.carttingData.productResults)) return '0'
            return this.carttingData.productResults[this.currentPos].price
        },
        dataLength() {
            let length = 0;
            if (this.$app.isNull(this.popOrderData.productResults)) return length;
            this.orderData.productResults.forEach(e => {
                length = this.$app.addNumber(length, e.number)
            })
            return length
        },
        isCatering() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype === 27
        },
    },
    watch: {
        isOrderList: {
            immediate: true,
            handler(newVal, oldVal) {
                this.currentPos = -1;
                if (newVal) this.takeASingle()
            }
        },
        waittingStatus: {
            handler(newVal, oldVal) {
                this.carttingData.productResults = this.carttingData.productResults.map(e => {
                    return {
                        ...e,
                        waittingStatus: newVal
                    }
                })
            }
        },
        'orderData.productResults': {
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    !!this.$refs.scrollList && this.$refs.scrollList.update();
                })
                if (this.isOrderList && newVal.length === 0) {
                    this.currentPos = -1;
                }
            }
        },
        'carttingData.productResults': {
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    !!this.$refs.scrollList && this.$refs.scrollList.update();
                })
                if (!this.isOrderList && newVal.length === 0) {
                    this.currentPos = -1;
                }
            }
        },
    },
    mounted() {
        // console.log('orderData, this.orderData);
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'syncCarttingData']),
        ...mapActions(['updateCartting', 'requsetMemberInfo']),
        getOrderListPos() {                                     // 获取订单列表选中状态
            return this.isOrderList ? this.currentPos : -1
        },
        orderItemHandleEvent(pos) {                             // 已下单菜单列表，弹窗点击事件
            this.orderItemHandleStatus = false;
            let goodsList = JSON.parse(JSON.stringify(this.orderData.productResults));
            switch (pos) {
                case 1:             // 赠菜
                    goodsList[this.currentPos].productChangePrice = 0;
                    this.takeASingleUpdateCatering(goodsList, this.isCatering ? '赠菜成功' : '赠送成功');
                    return;
                case 2:             // 移菜
                    this.$emit('caterCallback', 1)
                    return;
                case 3:             // 改价
                    this.handlePriceChange(goodsList[this.currentPos], this.currentPos)
                    return;
                case 4:             // 起菜
                    this.$emit('caterCallback', 2)
                    return;
                case 5:             // 退菜
                    this.$emit('caterCallback', 3)
                    return;
                default:
                    return;
            }
        },
        takeASingle() {                                         // 取单
            let query = {
                tableId: this.tableInfo.sv_table_id
            }
            stockApi.takeASingle(query).then(res => {
                if (res) {
                    this.$emit('returnWithout_list_id', res.sv_without_list_id);
                    if (this.tableInfo.sv_table_using_state === 4) {
                        // 待接单
                        this.syncCarttingData(res);
                    } else {
                        this.orderData = res;
                        this.update({
                            key: 'takeASingleCale3',
                            data: {
                                sv_isbeforehand: res.sv_isbeforehand,
                                tableId: this.tableInfo.sv_table_id,
                                member_id: res.member_id,
                                sv_integral: res.sv_integral,
                                sv_coupon_record_ids: res.sv_coupon_record_ids,
                                sv_employee_ids: res.sv_employee_ids,
                                sv_order_receivable: res.sv_order_receivable,
                                sv_order_actual_money: res.sv_order_actual_money
                            }
                        });
                        if (!this.$app.isNull(res.member_id)) this.requsetMemberInfo(res.member_id);
                    }
                }
            });
        },
        handleItemSelected(item, index) {                       // 点击商品
            this.currentPos = index;
            if (item.isPricingMethod) {
                // 称重商品
                this.goodsWeightItem = {
                    isEdit: true,
                    id: item.productId,
                    number: item.number,
                    remark: item.remark
                };
                this.goodsWeightStatus = true;
                return
            }
            if (item.isPackage) {
                this.goodsPackageItem = {
                    id: item.productId
                };
                this.goodsPackageStatus = true;
                return
            };
            this.cateringInfo = {
                id: item.productId,
                number: item.number,
                remark: item.remark,
                waittingStatus: item.waittingStatus
            }
            this.clickGoodsId = item.productId;
            this.clickGoodsNumber = item.number;
            this.cateringData = {
                specs: item.specs,
                tastes: item.tastes,
                chargings: item.chargings
            }
            this.cateringMoreStatus = true;
        },
        returnGoodsInfo(dataInfo) {                             // 编辑口味回调
            let data = JSON.parse(JSON.stringify(this.carttingData));
            data.productResults[this.currentPos].waittingStatus = dataInfo.waittingStatus;
            data.productResults[this.currentPos].number = dataInfo.number;
            data.productResults[this.currentPos].remark = dataInfo.remark;
            data.productResults[this.currentPos].specs = dataInfo.specs.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.currentPos].chargings = dataInfo.chargings.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.currentPos].tastes = dataInfo.tastes.map(e => {
                return {
                    id: e
                }
            });
            this.updateCartting(data);
        },
        returnGoodsPackage(goodsInfo) {
            let data = JSON.parse(JSON.stringify(this.carttingData));
            data.productResults[this.currentPos].packageGroups = goodsInfo.packageGroups;
            this.updateCartting(data);
        },
        handleNumberChange(index) {                             // 改数量弹窗
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$root.$emit('keyCode', 106);
        },
        handleSubtract(item, index) {                           // 数量 减1
            if (item.number <= 1) return this.handleDel(index);
            item.number = this.$app.subtractNumber(item.number, 1);
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                this.updateCartting();
            }, 500);
        },
        handleAdd(item) {                                       // 数量 加1
            let addNumber = this.$app.addNumber(item.number, 1);
            if (item.appraiseNumber && addNumber > item.appraiseNumber) {
                this.$confirm((this.isCatering ? '此菜品' : '此商品') + '已估清，最多只能点' + item.appraiseNumber, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                }).then(() => {

                }).catch(() => {

                });
                return
            }
            item.number = addNumber;
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                this.updateCartting();
            }, 500);
        },
        handleDel(dataPos) {                                    // 删除
            let selectedIndex = this.currentPos;
            if (this.currentPos === this.carttingData.productResults.length - 1) {
                selectedIndex = selectedIndex - 1;
            } else if (this.currentPos === 0 && this.carttingData.productResults.length === 1) {
                selectedIndex = -1;
            }
            this.update({
                key: 'carttingSelectedPos',
                data: selectedIndex
            });
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
        handleOrderItemSelected(index) {                        // 改变选中的商品
            // if (this.currentPos === index) return this.currentPos = -1;
            this.currentPos = index;
            // 全部退菜品 不弹出退菜
            if (this.orderData.productResults[this.currentPos].sv_return_status === 2) return
            this.orderItemHandleStatus = true;
        },
        closeOrderItemHandle() {
            this.orderItemHandleStatus = false;
        },
        moneyEdit(val) {                                        // 弹窗修改金额返回
            if (this.currentPos < 0) return;
            if (this.isOrderList) {
                let goodsList = JSON.parse(JSON.stringify(this.orderData.productResults));
                goodsList[this.currentPos].productChangePrice = parseFloat(val);
                this.takeASingleUpdateCatering(goodsList, '修改成功');
            } else {
                let carttingData = JSON.parse(JSON.stringify(this.carttingData));
                carttingData.productResults[this.currentPos].productChangePrice = parseFloat(val);
                this.updateCartting(carttingData);
            }
        },
        handlePriceChange(item, index) {                        // 改价弹窗
            if (index < 0) return;
            this.currentPos = index;
            if (item.isCurrentPrice) {
                this.currentPriceStatus = true
            } else {
                this.priceChangeStatus = true;
            }
        },
        takeASingleUpdateCatering(dataList, tips) {             // 修改挂单 
            if (dataList.length < 1) return;
            let prlist = dataList.map(e => {
                const productChangePrice = this.$app.isNull(e.productChangePrice) ? e.price : e.productChangePrice;
                return {
                    product_id: e.productId,
                    sv_without_product_id: e.sv_without_product_id,
                    product_price: productChangePrice,
                    product_name: e.productName,
                    tasteIds: this.$app.isNull(e.tastes) ? [] : [...e.tastes.map(e => { return e.id })],
                    chargingIds: this.$app.isNull(e.chargings) ? [] : [...e.chargings.map(e => { return e.id })],
                    specIds: this.$app.isNull(e.specs) ? [] : [...e.specs.map(e => { return e.id })],
                    sv_is_rouse: e.sv_is_rouse,
                    sv_return_status: e.sv_return_status || 0,
                    product_num: e.number,
                    product_unitprice: productChangePrice,
                    sv_product_is_change: this.$app.isNull(e.productChangePrice) ? false : true,
                    sv_product_is_package: this.$app.isNull(e.packageGroups) ? false : true,
                    combination_new: this.$app.isNull(e.packageGroups) ? '' : JSON.stringify(e.packageGroups),
                    product_total: this.$app.multiplyNumber(e.number, productChangePrice)
                }
            });

            let query = {
                sv_order_source: 0,
                continueToAddFood: true,
                prlist: prlist,
                sv_order_actual_money: this.carttingData.dealMoney,
                sv_order_receivable: this.carttingData.dealMoney,
                sv_person_num: this.tableInfo.sv_person_num,
                sv_remark: this.tableInfo.sv_remark,
                sv_table_id: this.tableInfo.sv_table_id,
                user_id: this.userInfo.user_id,
                member_id: this.memberInfo.member_id,
                sv_table_is_together: false,                        // 是否拼桌
                sv_order_data_type: 0
            }
            stockApi.takeASingleUpdateCatering(query).then(res => {
                if (res) {
                    this.isOrderList = true;
                    this.clearCartting();
                    this.update({
                        key: 'carttingSelectedPos',
                        data: -1
                    });
                    this.update({
                        key: 'takeASingleCale3',
                        data: {
                            sv_isbeforehand: res.sv_isbeforehand,
                            tableId: this.tableInfo.sv_table_id,
                            member_id: res.member_id,
                            sv_integral: res.sv_integral,
                            sv_coupon_record_ids: res.sv_coupon_record_ids,
                            sv_employee_ids: res.sv_employee_ids,
                            sv_order_receivable: res.sv_order_receivable,
                            sv_order_actual_money: res.sv_order_actual_money
                        }
                    });
                    this.orderData = res;
                    return this.$message.success(tips)
                }
            });
        },
        handleCartering(item) {                                 // 购物车点击商品名字
            let catering = '';
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.substring(0, catering.length - 1) + `</span>`
            }
            return ''
        },
        handleCarteringSub(item) {
            let catering = '';
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering += e.name + '、'
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.substring(0, catering.length - 1) + `</span>`
            }
            return ''
        },
        handleProductCouponDesc(item) {                         // 计算商品优惠描述
            let productCouponDesc = '';
            if (!this.$app.isNull(item.buyStepPromotion)) {
                productCouponDesc = item.buyStepPromotion.promotionDescription.s;
            }
            if (!this.$app.isNull(item.orderPromotions)) {
                let orderPromotions = item.orderPromotions.filter(e => e.type === 6);
                orderPromotions.length > 0 && (productCouponDesc += ' ' + orderPromotions[0].promotionDescription.s);
            }
            let temp = '';
            if (!this.$app.isNull(productCouponDesc)) {
                temp = `<div class="vipFlag">${item.isCurrentPrice ? '时' : '促'}</div>
                    <span>` + productCouponDesc + `</span>`
            }
            return temp
        },
        handleProductCouponMoney(item) {                        // 计算商品优惠金额
            let productCouponMoney = 0;
            if (!this.$app.isNull(item.buyStepPromotion)) {
                productCouponMoney = this.$app.moneyFixed(item.buyStepPromotion.promotionDescription.m);
            }
            if (!this.$app.isNull(item.orderPromotions)) {
                let orderPromotions = item.orderPromotions.filter(e => e.type === 6);
                orderPromotions.length > 0 && (productCouponMoney = this.$app.moneyFixed(orderPromotions[0].promotionDescription.m));
            }
            if (parseFloat(productCouponMoney) <= 0) return ''
            let temp = '';
            if (!this.$app.isNull(item.buyStepPromotion)) {
                temp = `<div class="discount">
                    <span>原：` + this.$app.moneyFixed(item.totalMoney) + `</span>
                    <span class="pl-10">惠：</span>
                    <span class="highlight">`+ productCouponMoney + `</span>
                    <span class="highlight"></span>
                </div>`
            }
            return temp
        },
        handleDel(dataPos) {                                    // 删除
            let selectedIndex = this.carttingSelectedPos;
            if (this.carttingSelectedPos === this.carttingData.productResults.length - 1) {
                selectedIndex = selectedIndex - 1;
            } else if (this.carttingSelectedPos === 0 && this.carttingData.productResults.length === 1) {
                selectedIndex = -1;
            }
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
    }
}
import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi, basicApi } from "@/api/index.js";
import numberChange from '../numberChange/numberChange.vue';
import priceChange from '../priceChange/priceChange.vue';
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
export default {
    name: 'cartting',
    components: { numberChange, priceChange, cateringMore, goodsWeight },
    props: {
        isAddToCart: {
            type: Boolean,
            default: false
        },
        waittingStatus: {
            type: Boolean,
            default: false
        },
        orderDataList: {
            type: Array,
            default: () => {
                return []
            }
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
            timer: null,
            numberChangeStatus: false,                      // 修改数量弹窗
            priceChangeStatus: false,                       // 修改价格弹窗
            priceChangeMenuPos: 0,
            carttingSelectedPos: -1,
            clickGoodsId: null,
            clickGoodsNumber: null,
            cateringInfo: {
                id: null,
                number: null,
                remark: ''
            },
            cateringData: {                                 // 规格 口味 加料
                specs: [],
                tastes: [],
                chargings: []
            },
            cateringMoreStatus: false,                      // 菜品更多编辑
            goodsWeightStatus: false,                       // 称重商品编辑
            goodsWeightItem: {
                isEdit: true,
                id: null,
                number: null,
                remark: ''
            },
            remarks: '',                                    // 购物车下单备注
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'selectedInfo']),
        isCommon() {
            // 27 餐饮 
            return this.userInfo.sv_us_industrytype != 27
        }
    },
    watch: {
        remarks: {
            handler(newVal, oldVal) {
                if (newVal !== '') {
                    this.$emit('getRemark', newVal)
                }
            }
        },
        'selectedInfo.sv_remark': {
            handler(newVal, oldVal) {
                this.remarks = newVal;
            }
        },
        dataList: {
            handler(newVal, oldVal) {
                if (newVal.length === 0) {
                    this.carttingSelectedPos = -1;
                }
            }
        }
    },
    mounted() {
        this.remarks = this.selectedInfo.sv_remark || '';
    },
    methods: {
        ...mapMutations(['update']),
        handleCartering(item) {
            let catering = [];
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.join('、') + `</span>`
            }
            return ''
        },
        handleProductCouponDesc(item) {                     // 计算商品优惠描述
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
                temp = `<div class="vipFlag">促</div>
                    <span>` + productCouponDesc + `</span>`
            }
            return temp || ''
        },
        handleProductCouponMoney(item) {                    // 计算商品优惠金额
            let productCouponMoney = 0;
            if (!this.$app.isNull(item.buyStepPromotion)) {
                productCouponMoney = this.$app.moneyFixed(item.buyStepPromotion.promotionDescription.m);
            }
            if (!this.$app.isNull(item.orderPromotions)) {
                let orderPromotions = item.orderPromotions.filter(e => e.type === 6);
                orderPromotions.length > 0 && (productCouponMoney = this.$app.moneyFixed(orderPromotions[0].promotionDescription.m));
            }
            let temp = '';
            if (!this.$app.isNull(item.buyStepPromotion)) {
                temp = `<div class="discount">
                        <span>总：` + this.$app.moneyFixed(item.totalMoney) + `</span>
                        <span class="pl-10">惠：</span>
                        <span class="highlight">`+ productCouponMoney + `</span>
                        <span class="highlight"></span>
                    </div>`
            }
            return temp || ''
        },
        handleCartering(item) {
            let catering = [];
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    if (e.name) catering.push(e.name + (e.price > 0 ? '(' + e.price + '元)' : ''))
                });
            }
            if (!this.$app.isNull(catering)) {
                return `<span class="vipFlag">` + catering.join('、') + `</span>`
            }
            return ''
        },
        returnGoodsInfo(dataInfo) {                         // 编辑口味回调
            this.dataList[this.carttingSelectedPos].number = dataInfo.number;
            this.dataList[this.carttingSelectedPos].remark = dataInfo.remark;
            this.dataList[this.carttingSelectedPos].dealPrice = dataInfo.currentDealPrice;
            this.dataList[this.carttingSelectedPos].dealMoney = this.$app.multiplyNumber(dataInfo.currentDealPrice, dataInfo.number);
            this.dataList[this.carttingSelectedPos].specs = dataInfo.specIds;
            this.dataList[this.carttingSelectedPos].chargings = dataInfo.chargingIds;
            this.dataList[this.carttingSelectedPos].tastes = dataInfo.tasteIds;
        },
        handleItemSelected(item, index) {                   // 点击商品
            this.carttingSelectedPos = index;
            if (item.isPricingMethod) {
                // 称重商品
                this.goodsWeightStatus = true;
                this.goodsWeightItem = {
                    isEdit: true,
                    id: item.productId,
                    number: item.number,
                    remark: item.remark
                };
                return
            }
            if (!this.isCommon) {
                this.cateringMoreStatus = true;
                this.cateringInfo = {
                    id: item.productId,
                    number: item.number,
                    remark: item.remark
                }
                this.clickGoodsId = item.productId;
                this.clickGoodsNumber = item.number;
                this.cateringData = {
                    specs: item.specs,
                    tastes: item.tastes,
                    chargings: item.chargings
                }
            }
        },
        clickNumberChange(index) {                          // 改数量弹窗
            this.carttingSelectedPos = index;
            this.numberChangeStatus = true;
        },
        handleNumberChange(val) {                           // 修改数量回调
            let item = this.dataList[this.carttingSelectedPos];
            item.number = parseFloat(val);
            item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
        },
        handlePriceChange(index) {                          // 改价弹窗
            if (this.isCommon && !this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限')
            if (!this.isCommon && !this.JurisdictionObj.key_change_price_catering) return this.$message.warning('没有改价权限')
            this.carttingSelectedPos = index;
            this.priceChangeStatus = true;
        },
        handlePriceChangeBack(val) {                        // 修改价格回调
            let item = this.dataList[this.carttingSelectedPos];
            item.dealPrice = parseFloat(val);
            item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
        },
        handleOrderSubtract(item, index) {                  // 已选订单 数量 减1
            if (item.currentNumber <= 1) return this.handleOrderDel(index);
            this.orderDataList[index].currentNumber = this.$app.subtractNumber(this.orderDataList[index].currentNumber, 1);
            item.dealMoney = this.$app.multiplyNumber(item.currentNumber, item.dealPrice);
        },
        handleOrderAdd(item, index) {                       // 已选订单 数量 加1
            if (item.sv_is_package_detailed) return this.$message.warning('套餐商品请使用整单退货')
            if (item.currentNumber > item.number - 1) {
                if (item.sv_pricing_method === 1) {
                    item.currentNumber = item.number;
                    this.orderDataList[index].currentNumber = item.number;
                }
            } else {
                this.orderDataList[index].currentNumber = this.$app.addNumber(this.orderDataList[index].currentNumber, 1);
            }
            item.dealMoney = this.$app.multiplyNumber(item.currentNumber, item.dealPrice);
        },
        handleOrderDel(dataPos) {                           // 已选订单删除商品
            this.orderDataList.removeByIndex(dataPos);
        },
        handleSubtract(item, index) {                       // 数量 减1
            if (item.number <= 1) return this.handleDel(index);
            item.number = this.$app.subtractNumber(item.number, 1);
            item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
        },
        handleAdd(item) {                                   // 数量 加1
            item.number = this.$app.addNumber(item.number, 1);
            item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
        },
        handleDel(dataPos) {                                // 删除
            let selectedIndex = this.carttingSelectedPos;
            if (this.carttingSelectedPos === this.dataList.length - 1) {
                selectedIndex = selectedIndex - 1;
            } else if (this.carttingSelectedPos === 0 && this.dataList.length === 1) {
                selectedIndex = -1;
            }
            this.carttingSelectedPos = selectedIndex;
            this.dataList.removeByIndex(dataPos);
        },
        clearCarttingList() {                               // 清除购物车 F1
            this.$emit('clearCartting');
        },
    }
}
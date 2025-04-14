import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
import priceChange from '../priceChange/priceChange.vue';
import goodsPackage from '../goodsPackage/goodsPackage.vue';
import numberChange from '../numberChange/numberChange.vue';
export default {
    name: 'carttingOrder',
    components: { cateringMore, goodsWeight, priceChange, goodsPackage, numberChange },
    props: {
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
            currentPriceStatus: false,

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
            goodsPackageStatus: false,                      // 套餐编辑
            goodsWeightItem: {
                isEdit: true,
                id: null,
                number: null,
                remark: ''
            },
            goodsPackageItem: {
                id: null
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData']),
        ...mapState('permission', ['CashierManage']),
        orderData: {
            get() { return this.popOrderData; }, set(value) {
                this.$emit('update:popOrderData', JSON.parse(JSON.stringify(value)));
            }
        },
        isCatting() {
            return this.userInfo.sv_us_industrytype === 27
        },
        improtMoney() {
            if (this.currentPos < 0) return '0'
            if (this.$app.isNull(this.carttingData.productResults)) return '0'
            return this.carttingData.productResults[this.currentPos].price
        },
        dataLength() {
            let length = 0;
            if (this.$app.isNull(this.popOrderData.productResults)) return length;
            this.orderData.productResults.forEach(e => {
                length += e.number
            })
            return length
        },
    },
    watch: {
        'carttingData.productResults': {
            handler(newVal, oldVal) {
                if (newVal.length === 0) {
                    this.currentPos = -1;
                }
            }
        },
    },
    mounted() {
		this.update({
			key: 'isInCartting',
			data: true
		});
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'syncCarttingData']),
        ...mapActions(['updateCartting']),
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
                remark: item.remark
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
        returnGoodsInfo(dataInfo) {                         // 编辑口味回调
            let data = JSON.parse(JSON.stringify(this.carttingData));
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
            item.number = this.$app.addNumber(item.number, 1);
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
            this.update({
                key: 'carttingSelectedPos',
                data: -1
            });
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
        moneyEdit(val) {                                        // 弹窗修改金额返回
            if (this.currentPos < 0) return;
            let goodsList = this.carttingData.productResults;
            goodsList[this.currentPos].productChangePrice = parseFloat(val);
            this.updateCartting();
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
        handleCartering(item) {                                 // 购物车点击商品名字
            let catering = '';
            if (!this.$app.isNull(item.specs)) {
                item.specs.forEach(e => {
                    catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.tastes)) {
                item.tastes.forEach(e => {
                    catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
                });
            }
            if (!this.$app.isNull(item.chargings)) {
                item.chargings.forEach(e => {
                    catering += e.name + (e.price > 0 ? '(' + e.price + '元)' : '') + '、'
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
            this.update({
                key: 'carttingSelectedPos',
                data: selectedIndex
            });
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
    }
}
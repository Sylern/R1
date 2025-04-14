import { mapState, mapMutations, mapActions } from 'vuex';
import priceChange from '../priceChange/priceChange.vue';
import numberChange from '../numberChange/numberChange.vue';
export default {
    name: 'carttingOrder',
    components: { priceChange, numberChange },
    props: {
        orderData: {
            type: Object,
            default: () => {
                return {
                    productResults: []
                }
            }
        },
        listPos: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            timer: null,
            priceChangeMenuPos: 0,                          // 改价弹窗菜单 0 改价 1 改折
            numberChangeStatus: false,                      // 退菜数量弹窗
            priceChangeStatus: false
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData']),
        currentPos: {
            // 餐饮等叫 0 等叫 1 需要起菜
            get() { return this.listPos }, set(value) {
                this.$emit('update:listPos', value);
            }
        },
        improtMoney() {
            if (this.currentPos < 0) return '0'
            return this.orderData.productResults[this.currentPos].price
        },
        dataLength() {
            let length = 0;
            if (this.$app.isNull(this.orderData.productResults)) return length;
            this.orderData.productResults.forEach(e => {
                length += e.number
            })
            return length
        },
    },
    watch: {
        
    },
    mounted() {
        // console.log('orderData, this.orderData);
    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['updateCartting']),
        handleItemSelected(index) {                         //  改变选中的商品
            if (this.currentPos === index) return this.currentPos = -1;
            this.currentPos = index;
        },
        moneyEdit(val) {
            if (this.currentPos < 0) return;
            let goodsList = JSON.parse(JSON.stringify(this.orderData.productResults));
            goodsList[this.currentPos].productChangePrice = parseFloat(val);
            goodsList[this.currentPos].totalMoney = this.$app.multiplyNumber(goodsList[this.currentPos].productChangePrice, goodsList[this.currentPos].number)
            this.$emit('editGoodsItem', goodsList);
        },
        handlePriceChange(index) {                          // 改价弹窗
            if (!this.JurisdictionObj.key_change_price_catering) return this.$message.warning('没有改价权限')
            if (index < 0) return;
            this.currentPos = index;
            this.priceChangeStatus = true;
        },
        handleCartering(item) {
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
                return `<span>` + catering.substring(0, catering.length - 1) + `</span>`
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
            return temp
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
                    <span>原：` + this.$app.moneyFixed(item.totalMoney) + `</span>
                    <span class="pl-10">惠：</span>
                    <span class="highlight">`+ productCouponMoney + `</span>
                    <span class="highlight"></span>
                </div>`
            }
            return temp
        },
        handleBtnControl(type) {                            // 底部按钮
            if (type === 2) {
                // 催菜
                if (this.currentPos === -1) return this.$emit('control', type, this.orderData.productResults);;
                let data = [];
                data.push(this.orderData.productResults[this.currentPos]);
                this.$emit('control', type, data);
            }
            if (type === 3) {
                // 退菜
                if (this.currentPos === -1) return this.$message.warning('请选择要退的菜品')
                if (this.orderData.productResults[this.currentPos].sv_return_status === 2) return this.$message.warning('选择菜品已退')
                let dataList = JSON.parse(JSON.stringify(this.orderData.productResults));
                let item = dataList[this.currentPos];
                if (item.number > 1) {
                    this.return_num = item.number;
                    this.numberChangeStatus = true;
                } else {
                    item.totalMoney = 0;
                    item.sv_return_status = 2;
                    let array = [];
                    array.push(item);
                    this.$emit('control', type, dataList, array);
                }
                return
            }
            this.$emit('control', type);
        },
        handleDel(dataPos) {                                // 删除
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
            // 删除到大于第一页，当前页无数据，向前翻页
            if (this.currentData.length < 1 && this.carttingCurrentPage > 1) {
                this.update({
                    key: 'carttingCurrentPage',
                    data: this.carttingCurrentPage - 1
                });
            }
        },
    }
}
import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import numberChange from '../numberChange/numberChange.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
export default {
    name: 'cartting',
    components: { numberChange, goodsWeight },
    props: {
        isAddToCart: {
            type: Boolean,
            default: false
        },
        waittingStatus: {
            type: Boolean,
            default: false
        },
        noRemark: {
            type: Boolean,
            default: false
        },
        // 是否轻餐
        isLightMeal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            timer: null,
            settlementProductPrices: [],                    // 会员上一次商品购买价格
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
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'memberInfo', 'isUserArtNo', 'carttingCurrentPage', 'carttingSelectedPos', 'selectedInfo']),
        ...mapState('permission', ['CashierManage']),
        currentData() {
            let size = 8;
            let current = this.carttingCurrentPage;
            let dataList = this.$app.isNull(this.carttingData.productResults) ? [] : this.carttingData.productResults.slice((current - 1) * size, (current - 1) * size + size);
            return dataList
        },
        totalPage() {
            let totalPage = this.$app.isNull(this.carttingData.productResults) ? 0 : Math.ceil(this.carttingData.productResults.length / 8)
            return totalPage
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
        currentData: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        !!this.$refs.scrollList && this.$refs.scrollList.update()
                    })
                }
            }
        },
        'memberInfo.member_id': {
            handler(newVal, oldVal) {
                if (this.$app.isNull(newVal)) {
                    this.settlementProductPrices = [];
                } else {
                    this.getSettlementProductPrices();
                }
            }
        },
        'selectedInfo.sv_remark': {
            handler(newVal, oldVal) {
                this.remarks = newVal;
            }
        },
        'carttingData.productResults': {
            handler(newVal, oldVal) {
                if (newVal.length !== oldVal.length) {
                    this.getSettlementProductPrices();
                }
                this.$nextTick(() => {
                    !!this.$refs.scrollList && this.$refs.scrollList.update();
                })
            }
        },
    },
    mounted() {
        this.remarks = this.selectedInfo.sv_remark || '';
        this.getSettlementProductPrices();
		this.update({
			key: 'isInCartting',
			data: true
		});
    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['updateCartting']),
        getSettlementProductPrices() {
            let product_id_list = this.carttingData.productResults.map(e => e.productId);
            let query = {
                member_id: this.memberInfo.member_id,
                product_id: [...new Set(product_id_list)]        // 数组去重
            }
            if (query.product_id.length < 1 || this.$app.isNull(this.memberInfo.member_id)) return
            stockApi.getSettlementProductPrices(query).then(res => {
                if (res) {
                    this.settlementProductPrices = res || [];
                }
            })
        },
        handleSettlementProductPrice(item) {
            let productPrice = '';
            if (this.settlementProductPrices.length === 0) return productPrice;
            let filterData = this.settlementProductPrices.find(e => e.product_id === item.productId)
            let temp = '';
            if (!this.$app.isNull(filterData)) {
                temp = `<span>上次购买价：` + filterData.price + `</span>`
            }
            return temp || ''
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
                temp = `<div class="vipFlag">${item.isCurrentPrice ? '时' : '促'}</div>
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
            if (parseFloat(productCouponMoney) <= 0) return ''
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
        handleClearTable() {                                // 点击清房台
            this.$emit('handleClearTable');
        },
        returnGoodsInfo(dataInfo) {                         // 编辑口味回调
            let data = JSON.parse(JSON.stringify(this.carttingData));
            data.productResults[this.carttingSelectedPos].number = dataInfo.number;
            data.productResults[this.carttingSelectedPos].remark = dataInfo.remark;
            data.productResults[this.carttingSelectedPos].specs = dataInfo.specs.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.carttingSelectedPos].chargings = dataInfo.chargings.map(e => {
                return {
                    id: e
                }
            });
            data.productResults[this.carttingSelectedPos].tastes = dataInfo.tastes.map(e => {
                return {
                    id: e
                }
            });
            this.updateCartting(data);
        },
        handleItemSelected(item, index) {                   // 点击商品
            let dataPos = (this.carttingCurrentPage - 1) * 8 + index;
            this.update({
                key: 'carttingSelectedPos',
                data: dataPos
            });
            if (item.isPricingMethod) {
                // 称重商品
                // this.goodsWeightItem = {
                //     isEdit: true,
                //     id: item.productId,
                //     number: item.number,
                //     remark: item.remark
                // };
                // this.goodsWeightStatus = true;
                return
            }
        },
        handleNumberChange(index) {                         // 改数量弹窗
            let dataPos = (this.carttingCurrentPage - 1) * 8 + index;
            this.update({
                key: 'carttingSelectedPos',
                data: dataPos
            });
            this.$root.$emit('keyCode', 106);
        },
        handlePriceChange(index) {                          // 改价弹窗
            let dataPos = (this.carttingCurrentPage - 1) * 8 + index;
            this.update({
                key: 'carttingSelectedPos',
                data: dataPos
            });
            this.$root.$emit('keyCode', 71);
        },
        handleMoneyChange(index) {                          // 改合计弹窗
            let dataPos = (this.carttingCurrentPage - 1) * 8 + index;
            this.update({
                key: 'carttingSelectedPos',
                data: dataPos
            });
            this.$root.$emit('keyCode', 73);
        },
        handleSubtract(item, index) {                       // 数量 减1
            if (item.number <= 1) return this.handleDel(index);
            item.number = this.$app.subtractNumber(item.number, 1);
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                item.productChangeMoney = null;
                this.updateCartting();
            }, 500);
        },
        handleAdd(item) {                                   // 数量 加1
            item.number = this.$app.addNumber(item.number, 1);
            if (this.timer) {
                clearTimeout(this.timer);
            };
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                item.productChangeMoney = null;
                this.updateCartting();
            }, 500);
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
        clearCarttingList() {                               // 清除购物车 F1
            this.$root.$emit('keyCode', 112);
        },
        handlePosLast() {
            if (this.carttingSelectedPos === 0) {
                return
            }
            if (this.carttingSelectedPos % 8 === 0 && this.carttingCurrentPage > 1) {
                this.handlePageLast();
                return
            }
            this.update({
                key: 'carttingSelectedPos',
                data: this.carttingSelectedPos - 1
            });
        },
        handlePosNext() {
            if (this.carttingSelectedPos === this.carttingData.productResults.length - 1) {
                return
            }
            if ((this.carttingSelectedPos + 1) % 8 === 0 && this.carttingCurrentPage < this.totalPage) {
                this.handlePageNext();
                return
            }
            this.update({
                key: 'carttingSelectedPos',
                data: this.carttingSelectedPos + 1
            });
        },
        handlePageLast() {
            if (this.carttingCurrentPage < 2) return;
            this.update({
                key: 'carttingCurrentPage',
                data: this.carttingCurrentPage - 1
            });
            this.update({
                key: 'carttingSelectedPos',
                data: this.carttingCurrentPage * 8 - 1
            });
        },
        handlePageNext() {
            if (this.carttingCurrentPage > this.totalPage - 1) return;
            this.update({
                key: 'carttingCurrentPage',
                data: this.carttingCurrentPage + 1
            });
            this.update({
                key: 'carttingSelectedPos',
                data: (this.carttingCurrentPage - 1) * 8
            });
        },
    }
}
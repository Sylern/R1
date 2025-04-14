import { mapState, mapMutations } from 'vuex';
import { stockApi } from "@/api/index.js";
export default {
    name: 'carttingCater',
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: null
                }
            }
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        mergeCateringList: {
            type: Array,
            default: () => {
                return []
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
    },
    data() {
        return {
            showContent: false,
            dataList: [],
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'memberInfo']),
        ...mapState('permission', ['CashierManage']),
        dialogVisible: {
            get() {
                setTimeout(() => {
                    this.showContent = this.visible;
                }, 10)
                return this.visible;
            },
            set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        carttingList() {
            return this.popOrderData.productResults
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
    },
    watch: {
        mergeCateringList: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    this.dataList = newVal.map((e, i) => {
                        return {
                            ...e,
                            isShowInfo: i === 0,
                            productList: this.carttingList.filter(item => item.sv_table_id_old === e.sv_table_id) || []
                        }
                    })
                }
            }
        },
        carttingList: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    this.dataList = this.mergeCateringList.map((e, i) => {
                        return {
                            ...e,
                            isShowInfo: i === 0,
                            productList: newVal.filter(item => item.sv_table_id_old === e.sv_table_id) || []
                        }
                    })
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
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
        cancelMergeCateringTable(item) {
            let query = {
                sv_source_type: 100,
                sv_table_id: this.tableInfo.sv_table_id,
                sv_without_list_id: this.tableInfo.sv_without_list_id,
                sv_table_id_old: item.sv_table_id,
                sv_without_list_id_old: item.sv_without_list_id
            }
            stockApi.cancelMergeCateringTable(query).then(res => {
                if (res) {
                    this.$emit('refreshTable')
                }
            });
        },
    }
}
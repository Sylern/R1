import base from "@/api/base";
import goodsMoreInfo from '../goodsMoreInfo/goodsMoreInfo.vue';
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsPackage from '../goodsPackage/goodsPackage.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'goodsItem',
    components: { goodsMoreInfo, cateringMore, goodsPackage, goodsWeight },
    props: {
        index: {
            type: Number,
            default: 0
        },
        goodsItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isCurrent: {                 // 不进行演算，本地加购物车
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingData', 'cashierJurisdiction', 'user_local_data', 'isLightMeal', 'pricingScaleData']),
        goodsImg() {
            let imgObj = JSON.parse(this.goodsItem.sv_p_images);
            const imgUrl = !this.$app.isNull(imgObj) ?this.$app.fmtImg(imgObj[0].code) : ''
            return this.$app.fmtImg(imgUrl)
        },
        isAppraiseClear() {
            let cartNumber = 0;
            this.carttingData.productResults.forEach(item => {
                if (item.productId === this.goodsItem.product_id) {
                    cartNumber += item.number
                }
            });
            let condition = this.goodsItem.sv_p_storage === 0 || cartNumber >= this.goodsItem.sv_p_storage
            return this.goodsItem.is_sell_clear && condition && !this.isLightMeal
        },
        imgModelType() {                                    // 展示不同商品图片的模式
            return this.user_local_data.goodsListShowType
        },
        showStorage() {                                     // 是否展示库存
            return this.user_local_data.showStorage && this.userInfo.sv_uit_cache_name !== 'cache_name_catering' && this.goodsItem.producttype_id === 0
        },
        isMultiSpec() {                                     // 商品是否多规格
            return this.goodsItem.sv_is_newspec
        },
        isMultiUnit() {                                     // 商品是否多单位
            return this.goodsItem.sv_is_multiunit
        },
        isMultiPrice() {                                    // 商品是否多价格
            return this.goodsItem.sv_is_multitradeprice
        },
        isGoodsWeight() {                                   // 商品是否称重
            return this.goodsItem.sv_pricing_method === 1
        },
        isGoodsPackage() {                                  // 商品是否套餐
            return this.goodsItem.is_package
        }
    },
    data() {
        return {
            goodsMoreInfoStatus: false,                     // 多规格、多单位商品弹窗
            cateringMoreStatus: false,                      // 餐饮更多弹窗
            goodsPackageStatus: false,                      // 套餐商品
            goodsMoreInfoType: 0,                           // 0:多规格 1:多单位
            goodsWeighStatus: false,                        // 称重商品弹窗
            cateringInfo: {
                id: 0,
                number: 1,
                remark: null
            },
            goodsWeigtItem: {
                isEdit: true,
                id: null,
                number: null,
                remark: ''
            },
        }
    },
    watch: {

    },
    activated() {

    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        appraiseClearShow() {
            this.$confirm('此菜品已估清，最多只能点' + this.goodsItem.sv_p_storage, '提示', {
                confirmButtonText: '确定',
                showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
        },
        handleGoodsItem(event) {                            // 点击商品
            // if (!this.isCurrent && this.goodsItem.sv_p_storage <= 0 && !this.cashierJurisdiction.ZeroInventorySales && this.userInfo.sv_uit_cache_name !== 'cache_name_catering') return this.$message.warning('库存不足')
            this.goodsItem.currentDealPrice = this.goodsItem.sv_p_unitprice;
            if (this.isGoodsWeight) {
                if (this.pricingScaleData.isStabilize && this.pricingScaleData.weight > 0 && this.user_local_data.scaleSwitch) {
                    this.goodsItem.number = this.pricingScaleData.weight;
                    this.update({
                        key: 'pricingScaleData',
                        data: {
                            tare: this.pricingScaleData.tare,
                            weight: this.pricingScaleData.weight,
                            unit_price: this.goodsItem.sv_p_unitprice,
                            total_price: this.$app.moneyFixed(this.$app.multiplyNumber(this.pricingScaleData.weight, this.goodsItem.sv_p_unitprice), 3),
                            isStabilize: true
                        }
                    })
                } else {
                    this.goodsWeigtItem = {
                        isEdit: true,
                        id: this.goodsItem.product_id,
                        number: 1,
                        remark: ''
                    }
                    return this.showGoodsWeight();
                }
            }
            if (this.isGoodsPackage) {
                this.goodsPackageStatus = true;
                return
            }
            // 6-棋牌茶楼 24-烘培行业 27-餐饮
            const excludedIndustry = [6, 24, 27]
            if (!excludedIndustry.includes(this.userInfo.sv_us_industrytype)) {
                // 非餐饮
                if (this.goodsItem.is_add_to) {
                    // 不需要弹多规格，直接加购物车
                    this.goodsItem.img = this.goodsImg;

                    // this.$emit('addCart', event, this.goodsItem);
                    this.handleAddCart(event, this.goodsItem);
                    this.$root.$emit('showCatting');
                    return
                }
                if (this.isMultiSpec) {
                    this.goodsMoreInfoType = 0;
                    this.goodsMoreInfoStatus = true;
                    return
                }
                if (this.isMultiPrice) {
                    // 多价格
                    this.goodsMoreInfoType = 2;
                    this.goodsMoreInfoStatus = true;
                    return
                }
                if (this.isMultiUnit) {
                    this.goodsMoreInfoType = 1;
                    this.goodsMoreInfoStatus = true;
                    return
                }
                // this.$emit('addCart', event, this.goodsItem);
                this.handleAddCart(event, this.goodsItem);
                this.$root.$emit('showCatting');
                return
            }

            if (this.goodsItem.is_open) {
                this.cateringInfo.id = this.goodsItem.product_id;
                return this.showCateringMore();
            }
            if (this.isMultiSpec) {
                this.goodsMoreInfoType = 0;
                this.goodsMoreInfoStatus = true;
                return
            }
            if (this.isMultiUnit) {
                this.goodsMoreInfoType = 1;
                this.goodsMoreInfoStatus = true;
                return
            }
            this.goodsItem.img = this.goodsImg;
            this.goodsItem.appraiseNumber = this.goodsItem.is_sell_clear ? this.goodsItem.sv_p_storage : null;
            // this.$emit('addCart', event, this.goodsItem);
            this.handleAddCart(event, this.goodsItem);
            this.$root.$emit('showCatting');
        },
        returnGoodsCatering(goodsInfo) {
            if (goodsInfo.number > this.goodsItem.sv_p_storage && this.goodsItem.is_sell_clear && !this.isLightMeal) {
                this.$confirm('此菜品已估清，最多只能点' + this.goodsItem.sv_p_storage, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                }).then(() => {

                }).catch(() => {

                });
                return
            }
            // this.$emit('addCart', null, { ...goodsInfo, sv_is_current_price: this.goodsItem.sv_is_current_price });
            this.handleAddCart(null, { ...goodsInfo, sv_is_current_price: this.goodsItem.sv_is_current_price });
        },
        handleAddCart(event, goodsItem) {
            this.$emit('addCart', event, goodsItem);
        },
        returnGoodsPackage(goodsInfo) {
            if (goodsInfo.number > this.goodsItem.sv_p_storage && this.goodsItem.is_sell_clear) {
                this.$confirm('此菜品已估清，最多只能点' + this.goodsItem.sv_p_storage, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                }).then(() => {

                }).catch(() => {

                });
                return
            }
            // this.$emit('addCart', null, goodsInfo);
            this.handleAddCart(null, goodsInfo);
        },
        returnGoodsWeightInfo(goodsInfo) {
            if (goodsInfo.number > this.goodsItem.sv_p_storage && this.goodsItem.is_sell_clear) {
                this.$confirm('此菜品已估清，最多只能点' + this.goodsItem.sv_p_storage, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false
                }).then(() => {

                }).catch(() => {

                });
                return
            }
            // this.$emit('addCart', null, goodsInfo);
            this.handleAddCart(null, goodsInfo);
        },
        showGoodsWeight() {                                 // 打开计重商品弹窗
            this.goodsWeighStatus = true;
        },
        showCateringMore() {                                // 打开餐饮更多
            if (this.isGoodsPackage) {
                this.goodsPackageStatus = true;
                return
            };
            if (this.isGoodsWeight) {
                this.goodsWeigtItem = {
                    isEdit: true,
                    id: this.goodsItem.product_id,
                    number: 1,
                    remark: ''
                }
                this.showGoodsWeight();
                return
            }
            this.cateringInfo.id = this.goodsItem.product_id;
            this.cateringMoreStatus = true;
        },
    }
};
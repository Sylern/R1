import base from '@/api/base';
import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import cateringMore from '../cateringMore/cateringMore.vue';
import goodsWeight from '../goodsWeight/goodsWeight.vue';
import goodsPackage from '../goodsPackage/goodsPackage.vue';
import priceChange from '../priceChange/priceChange.vue';
import numberChange from '../numberChange/numberChange.vue';
import servicerSetting from '../servicerSetting/servicerSetting.vue';
import servicerWorkstation from '../servicerWorkstation/servicerWorkstation.vue';
export default {
    name: 'carttingMeiye',
    components: { cateringMore, goodsWeight, goodsPackage, priceChange, servicerSetting, servicerWorkstation, numberChange },
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: null
                }
            }
        },
    },

    data() {
        return {
            frontImgBase: base.frontImgBase,
            imgBase: stockApi.imgBase(),
            timer: null,
            currentPos: -1,
            priceChangeMenuPos: 0,                          // 改价弹窗菜单 0 改价 1 改折
            isServicerSingle: false,                        // 是否单选员工，普通商品时
            workerTextList: ['一', '二', '三', '四'],        // 
            servicerSettingStatus: false,                   // 设置服务人员弹窗
            servicerWorkstationStatus: false,               // 设置多工位工位
            priceChangeStatus: false,

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
        improtMoney() {
            if (this.currentPos < 0 || this.$app.isNull(this.carttingData.productResults)) return '0'
            return this.carttingData.productResults[this.currentPos].price
        },
    },
    watch: {
        'carttingData.productResults': {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.length !== oldVal.length) {
                    this.currentPos = -1;
                }
                this.$nextTick(() => {
                    if (!!this.$refs.scrollList) {
                        let height = newVal[0].productId === 0 && newVal[0].productId !== oldVal[0].productId ? 0 : this.$refs.scrollList.wrap.scrollHeight;
                        this.$refs.scrollList.update();
                        if (newVal.length > oldVal.length) this.$refs.scrollList.wrap.scrollTop = height
                    }
                })
            }
        },
    },
    mounted() {
        
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'setGoodsMultCommissions']),
        ...mapActions(['updateCartting']),
        handleServiceShow(index, goodsType) {                   // 打开员工选择
            this.currentPos = index;
            this.isServicerSingle = goodsType === 0 ? true : false;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.servicerSettingStatus = true;
        },
        handleWorkstationShow(index) {                          // 打开多工位选择
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.servicerWorkstationStatus = true;
        },
        handleWorkstation(list) {                               // 选择 多工位员工
            
        },
        handleServicerSetting(list) {                           // 选择员工回调
            this.setGoodsMultCommissions({
                index: this.currentPos,
                list: [list]
            })
        },
        handleServiceDelete(item, emIndex) {                    // 普通商品移除所选员工
            let currentList = item.multCommissions[0];
            currentList.removeByIndex(emIndex);
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
        },
        showkouciFlag(item) {                                   // 是否是扣次
            return this.$app.isNull(item.buyStepPromotion) ? false : item.buyStepPromotion.type === 15
        },
        handleClearKouci(index) {                               // 移除扣次
            let localData = JSON.parse(JSON.stringify(this.carttingData));
            let currentItem = localData.productResults[index];
            let promotionId = currentItem.buyStepPromotion.promotionId;
            currentItem.buyStepPromotion = null;
            if (!this.$app.isNull(promotionId)) {
                this.memberInfo.cardPackageList.forEach(e => {
                    let item = e.list.find(l => l.userecord_id == promotionId);
                    if (item) {
                        item.sv_mcc_leftcount += currentItem.number;
                    }
                })
            }
            this.updateCartting(localData);
        },
        handleNumberChange(index) {                             // 改数量弹窗
            if (this.carttingData.productResults[index].productType === 1 || this.carttingData.productResults[index].productId === 0) return;
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$root.$emit('keyCode', 106);
        },
        handlePriceChange(index) {                              // 改价弹窗
            if (!this.JurisdictionObj.key_change_price_catering) return this.$message.warning('没有改价权限')
            this.currentPos = index;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$root.$emit('keyCode', 71);
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
            this.currentPos = -1
            this.update({
                key: 'carttingSelectedPos',
                data: -1
            });
            let currentItem = this.carttingData.productResults[dataPos];
            let promotionId = this.$app.isNull(currentItem.buyStepPromotion) ? null : (currentItem.buyStepPromotion.type === 15 ? currentItem.buyStepPromotion.promotionId : null);
            if (!this.$app.isNull(promotionId)) {
                this.memberInfo.cardPackageList.forEach(e => {
                    let item = e.list.find(l => l.userecord_id == promotionId);
                    if (item) {
                        item.sv_mcc_leftcount += currentItem.number;
                    }
                })
            }
            this.carttingData.productResults.removeByIndex(dataPos);
            this.updateCartting();
        },
        moneyEdit(val) {                                        // 弹窗修改金额返回
            if (this.currentPos < 0) return;
            let goodsList = this.carttingData.productResults;
            goodsList[this.currentPos].productChangePrice = parseFloat(val);
            this.updateCartting();
        },
        handlePriceChange(index) {                              // 改价弹窗
            if (!this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限')
            if (index < 0) return;
            this.currentPos = index;
            this.priceChangeStatus = true;
        },
        handleCartering(item) {                                 // 商品口味、加料信息
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
                // 排除次卡抵扣
                productCouponDesc = item.buyStepPromotion.type === 15 ? '' : item.buyStepPromotion.promotionDescription.s;
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
    }
}
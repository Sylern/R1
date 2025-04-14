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
        ...mapState(['userInfo', 'JurisdictionObj', 'carttingData', 'goodsEmployeeList', 'memberInfo']),
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
                        let height = this.$refs.scrollList.wrap.scrollHeight;
                        this.$refs.scrollList.update();
                        if (newVal.length > oldVal.length) this.$refs.scrollList.wrap.scrollTop = height
                    }
                })
            }
        },
        goodsEmployeeList: {
            deep: true,
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    !!this.$refs.scrollList && this.$refs.scrollList.update();
                })
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'syncCarttingData']),
        ...mapActions(['updateCartting']),
        currentEmployeeList(index, item) {
            return this.goodsEmployeeList.find(e => e.flagProductId === index + '' + item.productId) || [];
        },
        handleEmployeeIndex($event, item, parentIndex) {
            if (item.inputLocked) return;
            item.percent = parseInt($event.offsetX * 100 / $event.target.clientWidth);
            item.isLocked = true;
            if (item.percent > item.max) item.percent = item.max;
            this.handleSetPercent(parentIndex);
        },
        handleSliderChange(item, parentIndex) {
            item.isLocked = true;
            if (item.percent > item.max) item.percent = item.max;
            this.handleSetPercent(parentIndex);
        },
        handlePercentInput(item, parentIndex) {
            if (item.inputLocked) return item.percent = item.percent > 100 ? 100 : item.percent;
            item.isLocked = true;
            if (item.percent > item.max) item.percent = item.max;
            // const dataValue = this.$app.isNull(value) ? 0 : value
            this.handleSetPercent(parentIndex);
        },
        handlePercentValueChange(event, item, subItem, parentIndex) {
            let value = this.$app.verifyNumberDecimal(event);
            subItem.percentValue = parseFloat(value) > item.dealMoney ? item.dealMoney : event;
            subItem.isLocked = true;
            this.handleSetPercentValue(item.dealMoney, parentIndex);
        },
        handleSetPercent(parentIndex) {
            this.$nextTick(() => {
                let unLockedList = this.goodsEmployeeList[parentIndex].employeeList.filter(e => !e.isLocked);
                let lockedValue = 0;
                this.goodsEmployeeList[parentIndex].employeeList.forEach(item => {
                    item.isLocked && (lockedValue += item.percent)
                });
                let unLockedValue = 100 - lockedValue;
                let lastUnlockedValue = 100 - lockedValue;
                let lastUnlockedId = null;
                const surplusEvery = parseInt((100 - lockedValue) / unLockedList.length);
                unLockedList.forEach((item, index) => {
                    if (index !== unLockedList.length - 1 && unLockedList.length > 1) {
                        lastUnlockedId = item.sv_employee_id;
                        lastUnlockedValue = lastUnlockedValue - surplusEvery;
                    }
                })
                this.goodsEmployeeList[parentIndex].employeeList = this.goodsEmployeeList[parentIndex].employeeList.map(e => {
                    const dealMoney = this.carttingData.productResults[parentIndex].dealMoney;
                    const max = e.isLocked ? (unLockedValue + e.percent) : unLockedValue;
                    const percent = e.isLocked ? e.percent : (lastUnlockedId === e.sv_employee_id ? lastUnlockedValue : surplusEvery);
                    return {
                        ...e,
                        max,
                        percentValue: this.$app.moneyFixed((percent * dealMoney) / 100),
                        percent,
                    }
                })
            })
        },
        handleSetPercentValue(dealMoney, parentIndex) {
            this.$nextTick(() => {
                let unLockedList = this.goodsEmployeeList[parentIndex].employeeList.filter(e => !e.isLocked);
                let lockedValue = 0, lockedPercent = 0;
                this.goodsEmployeeList[parentIndex].employeeList.forEach(item => {
                    item.isLocked && (lockedValue += parseFloat(item.percentValue))
                });
                let unLockedValue, lastUnlockedValue;
                unLockedValue = lastUnlockedValue = dealMoney - lockedValue;
                let unLockedPercent, lastUnlockedPercent;
                lockedPercent = parseInt(100 * lockedValue / dealMoney);
                unLockedPercent = lastUnlockedPercent = 100 - lockedPercent;
                let lastUnlockedId = null;
                const surplusEveryValue = parseFloat(unLockedValue / unLockedList.length);
                const surplusEveryPercent = parseInt((100 - lockedPercent) / unLockedList.length);
                unLockedList.forEach((item, index) => {
                    if (index !== unLockedList.length - 1 && unLockedList.length > 1) {
                        lastUnlockedId = item.sv_employee_id;
                        lastUnlockedValue = lastUnlockedValue - surplusEveryValue;
                        lastUnlockedPercent = lastUnlockedPercent - surplusEveryPercent;
                    }
                })
                this.goodsEmployeeList[parentIndex].employeeList = this.goodsEmployeeList[parentIndex].employeeList.map((e, i) => {
                    const max = e.isLocked ? (unLockedValue + e.percent) : unLockedValue;
                    const percentValue = e.isLocked ? e.percentValue : (lastUnlockedId === e.sv_employee_id ? lastUnlockedValue : surplusEveryValue);
                    const percent = e.isLocked ? parseInt(100 * percentValue / dealMoney) : (lastUnlockedId === e.sv_employee_id ? lastUnlockedPercent : surplusEveryPercent);
                    return {
                        ...e,
                        max,
                        percentValue,
                        percent,
                    }
                })
            })
        },
        commissionSwitchValue(item) {                           // 计算当前状态下独享业绩值
            if (item.type === 0) return ''
            let value = '';
            if (this.$app.isNull(this.memberInfo.member_id)) {
                value = item.isAppoint ? item.sv_flow_guest_set_value : item.sv_flow_guest_unfixed_set_value
            } else {
                value = item.isAppoint ? item.sv_member_set_value : item.sv_member_unfixed_set_value
            }
            return value + (item.type === 1 ? '%' : '元')
        },
        handleEmployeeAppoint(_currentPos, item, index) {       // 改变指定/非指定
            this.currentPos = _currentPos;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.$set(this.goodsEmployeeList[this.currentPos].employeeList, index, item);
        },
        handleServiceShow(index, goodsType) {                   // 打开员工选择
            this.currentPos = index;
            this.isServicerSingle = goodsType === 0 ? true : false;
            this.update({
                key: 'carttingSelectedPos',
                data: this.currentPos
            });
            this.servicerSettingStatus = true;
        },
        handleServicerSetting(list) {                           // 选择员工回调
            if (!this.commission_Switch) {
                const goodsEmployeeList = list.map((e, i) => {
                    return {
                        ...e,
                        percentValue: this.$app.moneyFixed((e.percent * this.carttingData.productResults[this.currentPos].dealMoney) / 100)
                    }
                })
                this.update({
                    key: 'goodsEmployeeList',
                    data: goodsEmployeeList
                });
                this.servicerSettingStatus = false;
            } else {
                if (list.length < 1) return
                const postData = [{
                    product_id: this.carttingData.productResults[this.currentPos].productId,
                    employee: list[this.currentPos].employeeList.map(e => e.sv_employee_id)
                }]
                stockApi.getEmployeeProductCommissions(postData).then(res => {
                    if (res) {
                        res.map((e, i) => {
                            let dataItem = {
                                flagProductId: this.goodsEmployeeList[this.currentPos].flagProductId,
                                goodsProductId: e.product_id,
                                employeeList: e.employee.map((em, ei) => {
                                    return {
                                        ...em,
                                        percent: 100,
                                        isAppoint: false,
                                        ...list[this.currentPos].employeeList[ei]
                                    }
                                })
                            }
                            this.$set(this.goodsEmployeeList, this.currentPos, dataItem);
                        })
                    }
                });
            }
        },
        handleServiceDelete(index, item, emIndex) {             // 移除所选员工
            let currentList = this.currentEmployeeList(index, item).employeeList;
            currentList.removeByIndex(emIndex);
            if (this.commission_Switch) return
            currentList = currentList.map((e, i) => {
                const itemPercent = currentList.length === 1 ? 100 : parseInt(100 / currentList.length)
                const percent = this.commission_Switch ? 100 : index !== currentList.length - 1 ? itemPercent : (100 - itemPercent * (currentList.length - 1))
                return {
                    ...e,
                    percent,
                    percentValue: this.$app.moneyFixed((percent * this.carttingData.productResults[this.currentPos].dealMoney) / 100)
                }
            })
            let goodsEmployeeList = this.goodsEmployeeList;
            goodsEmployeeList[index].employeeList = currentList;
            this.update({
                key: 'goodsEmployeeList',
                data: goodsEmployeeList
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
            this.goodsEmployeeList.splice(dataPos, 1);
            const hasQuickCollect = this.carttingData.productResults[0].productId === 0;
            let currentArray = this.goodsEmployeeList.map((e, i) => {
                return {
                    ...e,
                    flagProductId: (hasQuickCollect ? i + 1 : i) + '' + e.goodsProductId,
                }
            })
            this.update({
                key: 'goodsEmployeeList',
                data: currentArray
            })
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
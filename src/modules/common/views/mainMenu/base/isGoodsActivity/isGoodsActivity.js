import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    name: 'isGoodsActivity',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            selectedPos: -1,
            promotionTypeText: ['特价', '折扣', '满减', '满送', '加价购'],
            dataList: [],
            selectedMain: [],
            goodsList: []
        }
    },
    computed: {
        ...mapState(['carttingData']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        currentCanSelectedInfo() {
            let number = 0, text = '';
            if (this.selectedPos > -1) {
                let current = this.dataList[this.selectedPos];
                let hasSelectedSameType = this.selectedMain.findIndex(e => e.promotionType === current.promotionType) > -1 && !current.isChecked;
                if (!hasSelectedSameType) {
                    number = current.isLadder ? current.totalGiveCount : current.giveCount;
                    text = '（' + (current.promotionType === 4 ? '加价购：加' + current.addMoney + '元' : '') + '可选' + number + '件）';
                }
            }
            return {
                number,
                text
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.selectedPos = -1;
                    this.selectedMain = [];
                    this.$nextTick(() => {
                        this.dataList = JSON.parse(JSON.stringify(this.carttingData.givePromotions)).map(e => {
                            return {
                                ...e,
                                isChecked: false,
                                subList: []
                            }
                        })
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['updateCarttingGiveData']),
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handlePromotion(id, index) {
            this.selectedPos = index;
            if (!this.$app.isNull(this.dataList[index].subList)) return;
            stockApi.pomotionalGiveInfoV2({ promotionId: id }).then(res => {
                if (res) {
                    // 加价购赠送商品判断 sv_mpd_increase_ptype === 1 满送赠送商品判断sv_mpd_fullgive_ptype === 1
                    let dataList = this.$app.isNull(res.detailList) ? [] : (this.dataList[index].promotionType === 4 ? res.detailList.filter(item => item.sv_mpd_increase_ptype == 1) : res.detailList.filter(item => item.sv_mpd_fullgive_ptype == 1))
                    this.dataList[index].subList = dataList.map(e => {
                        return {
                            ...e,
                            isChecked: false,
                            number: 0
                        }
                    });
                }
            });
        },
        handleMainCheck(id, index) {
            this.selectedPos = index;
            if (this.$app.isNull(this.dataList[index].subList)) {
                this.handlePromotion(id, index)
            }
            if (this.dataList[index].isChecked) {
                if (this.selectedMain.find(e => e.promotionType === this.dataList[index].promotionType)) {
                    this.$nextTick(() => {
                        this.dataList[index].isChecked = false;
                    })
                    return this.$message.warning('同类型促销只能参加一个')
                }
                this.selectedMain.push({
                    promotionId: this.dataList[index].promotionId,
                    promotionType: this.dataList[index].promotionType
                })
                this.dataList.forEach((e, i) => {
                    if (i !== index && e.promotionType === this.dataList[index].promotionType) {
                        e.isChecked = false;
                        e.subList = e.subList.map(k => {
                            return {
                                ...k,
                                isChecked: false
                            }
                        })
                    }
                })
            } else {
                this.selectedMain = this.selectedMain.filter(e => e.promotionType !== this.dataList[index].promotionType);
                this.dataList[index].subList = this.dataList[index].subList.map(e => {
                    return {
                        ...e,
                        isChecked: false
                    }
                })
            }
        },
        handleSubCheck(item) {
            if (item.isChecked) {
                if (this.currentCanSelectedInfo.number < 1) {
                    this.$nextTick(() => {
                        item.isChecked = false;
                    })
                    return this.$message.warning('已选择同类型促销商品')
                }
                let hasSelectedNumber = 0;
                this.dataList[this.selectedPos].subList.forEach(e => {
                    if (e.isChecked) {
                        hasSelectedNumber = hasSelectedNumber + e.number;
                    }
                })
                if (hasSelectedNumber >= this.currentCanSelectedInfo.number) {
                    this.$nextTick(() => {
                        item.isChecked = false;
                    })
                    return this.$message.warning('已超过可选数量限制')
                }
                if (item.number === 0) item.number = 1;
                this.dataList[this.selectedPos].isChecked = true;
                this.selectedMain.push({
                    promotionId: this.dataList[this.selectedPos].promotionId,
                    promotionType: this.dataList[this.selectedPos].promotionType
                })
            }
        },
        handleSure() {
            let main = this.dataList.filter(e => e.isChecked);
            let selectedList = [];
            main.forEach(e => {
                let item = {
                    promotionId: e.promotionId,
                    giveProducts: []
                }
                e.subList.forEach(k => {
                    if (k.isChecked) {
                        item.giveProducts.push({
                            productId: k.sv_product_id,
                            number: k.number
                        })
                    }
                })
                if (item.giveProducts.length > 0) {
                    selectedList.push(item);
                }
            });
            if (selectedList.length > 0) {
                this.updateCarttingGiveData(selectedList);
            }
            this.$emit('handleSure');
        },
        handleSubtract(item) {
            if (!item.isChecked) return this.$message.warning('请勾选商品')
            if (item.number > 0) {
                item.number--
                if (item.number === 0) item.isChecked = false;
            };
        },
        handleAdd(item) {
            let hasSelectedNumber = 0;
            this.dataList[this.selectedPos].subList.forEach(e => {
                if (e.isChecked) {
                    hasSelectedNumber = hasSelectedNumber + e.number;
                }
            })
            if (hasSelectedNumber === this.currentCanSelectedInfo.number) return this.$message.warning('已超过可选数量限制')
            if (!item.isChecked) {
                item.isChecked = true;
                return this.handleSubCheck(item);
            }
            item.number++;
        }
    }
};
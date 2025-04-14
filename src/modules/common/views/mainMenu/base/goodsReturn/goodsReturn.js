import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
import numberChange from '../numberChange/numberChange.vue';
import { returnPsw } from '@/components/index';
export default {
    name: 'goodsReturn',
    components: { numberChange, returnPsw },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderState: {
            type: Number,
            default: 0
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
            checkedJson: [],
            orderList: [],
            isAllOrderReturn: false,
            remarks: '',
            goodsNumberChangeStatus: false,
            currentReturnItem: {
                product_num: 0,
            }
        }
    },
    computed: {
        ...mapState(['memberInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.remarks = '';
                    this.checkedJson = [];
                    this.orderList = this.dataList.map(e => {
                        return {
                            ...e,
                            currentNumber: 0
                        }
                    })
                }
            }
        },
        orderList: {
            deep: true,
            handler(newVal, oldVal) {
                if (this.dialogVisible) this.checkedJson = this.orderList.filter(e => e.currentNumber > 0);
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        calcTaste(item) {                                           // 计算口味加料
            let dataArray = item.product_taste_money_detail ? JSON.parse(item.product_taste_money_detail) : [];
            let totalMoney = 0, dataInfo = '';
            dataArray.forEach(e => {
                if (e.price > 0) {
                    totalMoney += e.price;
                    dataInfo += e.name + ':' + e.price + '元 '
                }
            })
            return `<label>` + dataInfo + `</label>`
        },
        handleGoodsNumberSubtract(item, index) {
            if (item.currentNumber < 1) {
                if (item.sv_pricing_method === 1) {
                    item.currentNumber = 0;
                    this.orderList[index].currentNumber = 0;
                }
                return
            };
            item.currentNumber = this.$app.subtractNumber(item.currentNumber, 1);
            this.orderList[index].currentNumber = this.$app.subtractNumber(this.orderList[index].currentNumber, 1);
        },
        handleGoodsNumberAdd(item, index) {
            if (item.sv_is_package_detailed) return this.$message.warning('套餐商品请使用整单退货')
            if (item.currentNumber > item.product_num - 1) {
                if (item.sv_pricing_method === 1) {
                    item.currentNumber = item.product_num;
                    this.orderList[index].currentNumber = item.product_num;
                }
                return
            };
            item.currentNumber = this.$app.addNumber(item.currentNumber, 1);
            this.orderList[index].currentNumber = this.$app.addNumber(this.orderList[index].currentNumber, 1);
        },
        closeDialog() {
            this.dialogVisible = 'close';       
        },
        showNumberChange(item) {                                    // 展示修改数量弹窗   
            this.goodsNumberChangeStatus = true;
            this.currentReturnItem = item;
        },
        handleNumberChange(val) {
            this.orderList[this.currentReturnItem.index].currentNumber = val;
        },
        showPswWrap(type) {
            if (type === 1) {
                this.$confirm('您将进行整单退货，退款金额将原路退回，是否确定？', '提示', {
                    confirmButtonText: '确定',
                    cancleButtonText: '取消',
                    callback: action => {
                        if (action === 'confirm') {
                            this.isAllOrderReturn = true;
                            this.$refs.returnPsw.showPswWrap();
                        }
                    }
                });
                return
            }
            if (this.checkedJson.length < 1 && type === 2) return;
            if ( type === 2) {
                this.$confirm('您将进行退货，退款金额将原路退回，是否确定？', '提示', {
                    confirmButtonText: '确定',
                    cancleButtonText: '取消',
                    callback: action => {
                        if (action === 'confirm') {
                            this.$refs.returnPsw.showPswWrap();
                        }
                    }
                });
                return
            }
        },
        handlePswReturn(val) {
            let dataObj = {
                psw: val,
                isAllOrderReturn: this.isAllOrderReturn,
                remarks: this.remarks,
                goodsList: this.isAllOrderReturn ? null : this.checkedJson
            }
            this.$emit('handleBack', dataObj);
            this.closeDialog();
        },
    }
};
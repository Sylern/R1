import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            goodsTotal: 0,
            needTotal: 0,
            goodsList: []
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.goodsTotal = 0;
                    this.needTotal = 0
                    this.getCashierInfo();
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        focusNext(data) {
            if (this.$app.isNull(data.value)) return
            this.$refs['input_' + data.refPos][0].blur();
            if (!!this.$refs['input_' + (data.refPos + 1)]) {
                this.$refs['input_' + (data.refPos + 1)][0].focus();
            }
        },
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                        // Enter
                    this.handleEnter();
                    return;
                case 27:                                        // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('discount key ' + code + ' is click');
                    return;
            }
        },
        getCashierInfo() {
            let query = {
                id: this.orderId,
                u_id: this.userInfo.user_id,
                type: 1
            }
            this.goodsList = [];
            stockApi.getCashierInfo(query).then(res => {
                if (res) {
                    let inputRefPos = 0;
                    (res.list || []).forEach(e => {
                        if (e.producttype_id === 2 && this.$app.isNull(e.combination_list)) {
                            this.goodsTotal += e.product_num;
                            let codeList = [];
                            if (this.$app.isNull(e.sv_bar_code)) {
                                for (let index = 0; index < e.product_num; index++) {
                                    inputRefPos = inputRefPos + 1;
                                    codeList.push({
                                        isDisabled: false,
                                        refPos: inputRefPos,
                                        value: null
                                    })
                                }
                            } else {
                                codeList = e.sv_bar_code.split(';').map(arrayItem => {
                                    if (this.$app.isNull(arrayItem)) inputRefPos = inputRefPos + 1;
                                    return {
                                        isDisabled: this.$app.isNull(arrayItem) ? false : true,
                                        refPos: this.$app.isNull(arrayItem) ? inputRefPos : null,
                                        value: arrayItem
                                    }
                                });
                            }
                            this.needTotal += codeList.filter(e => this.$app.isNull(e.value)).length;
                            this.goodsList.push(
                                {
                                    orderProductId: e.id,
                                    productName: e.product_name,
                                    number: e.product_num,
                                    codeList: codeList
                                }
                            )
                        }
                        if (!this.$app.isNull(e.combination_list)) {
                            // 有套餐内商品是计时商品
                            e.combination_list.forEach(pGoodsItem => {
                                if (pGoodsItem.producttype_id === 2) {
                                    this.goodsTotal += pGoodsItem.product_num;
                                    let codeList = [];
                                    if (this.$app.isNull(pGoodsItem.sv_bar_code)) {
                                        for (let index = 0; index < pGoodsItem.product_num; index++) {
                                            inputRefPos = inputRefPos + 1;
                                            codeList.push({
                                                isDisabled: false,
                                                refPos: inputRefPos,
                                                value: null
                                            })
                                        }
                                    } else {
                                        codeList = pGoodsItem.sv_bar_code.split(';').map(arrayItem => {
                                            if (this.$app.isNull(arrayItem)) inputRefPos = inputRefPos + 1;
                                            return {
                                                isDisabled: this.$app.isNull(arrayItem) ? false : true,
                                                refPos: this.$app.isNull(arrayItem) ? inputRefPos : null,
                                                value: arrayItem
                                            }
                                        });
                                    }
                                    this.needTotal += codeList.filter(e => this.$app.isNull(e.value)).length;
                                    this.goodsList.push({
                                        orderProductId: pGoodsItem.id,
                                        productName: pGoodsItem.product_name,
                                        number: pGoodsItem.product_num,
                                        codeList: codeList
                                    })
                                }
                            })
                        }
                    })
                    this.$nextTick(() => {
                        !!this.$refs['input_1'] && this.$refs['input_1'][0].focus();
                    })
                }
            });
        },
        handleSubmitBindCode() {                                // 提交绑定票码
            let totalCode = 0, needCode = 0;
            this.goodsList.forEach(item => {
                item.codeList.forEach(e => {
                    totalCode++;
                    if (e.value) {
                        needCode++;
                    }
                })
            });
            if (needCode === 0) return this.closeDialog();
            if (totalCode !== needCode) return this.$message.warning('输入票数跟需要绑定票数数量不一致，请检查')
            if (this.needTotal < 1) return this.closeDialog();
            const query = {
                userId: this.userInfo.user_id,
                orderId: this.orderId,
                bindCodes: this.goodsList.map(e => {
                    return {
                        orderProductId: e.orderProductId,
                        productName: e.productName,
                        barCodes: e.codeList.map(item => item.value)
                    }
                })
            }
            stockApi.bindCode2Order(query).then(_ => {
                this.$message.success('票码绑定成功');
                this.$emit('success');
                this.closeDialog();
            });
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.$emit('close');
        },
        handleEnter() {
            this.handleSubmitBindCode();
        }
    }
};
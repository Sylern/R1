import { mapState, mapMutations, mapActions } from 'vuex';
import customDiscount from '../customDiscount/customDiscount.vue';
export default {
    name: 'priceChange',
    components: { customDiscount },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isCheckIn: {
            type: Boolean,
            default: false
        },
        extendInfo: {
            type: Object,
            default: () => { return {} }
        },
        showGive: {                                     // 赠送按钮
            type: Boolean,
            default: false
        },
        improtMoney: {                                  // 总金额
            type: String,
            default: '0'
        },
        discountMoney: {                                // 可优惠金额
            type: String,
            default: ''
        },
        menuPos: {                                      // 0 改价  1改折
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            inputTimer: null,
            updateInterval: false,                      // 修改内容是否间隔,false直接替换
            canDiscountMoney: 0,                        // 可优惠金额
            inputMoney: '',                             // 输入的金额
            inputDiscount: '10',                        // 输入的折扣
            currentMenuPos: 0,
            customDiscountStatus: false,                // 自定义折扣弹窗状态
            calculatorList: [
                {
                    key: '7'
                },
                {
                    key: '8'
                },
                {
                    key: '9'
                },
                {
                    key: '4'
                },
                {
                    key: '5'
                },
                {
                    key: '6'
                },
                {
                    key: '1'
                },
                {
                    key: '2'
                },
                {
                    key: '3'
                },
                {
                    key: '.'
                },
                {
                    key: '0'
                },
                {
                    key: 'C'
                }
            ]
        }
    },
    computed: {
        ...mapState(['carttingData', 'discountList', 'carttingCurrentPage', 'carttingSelectedPos']),
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
                    this.currentMenuPos = this.menuPos;
                    this.inputMoney = this.improtMoney;
                    this.inputDiscount = '10';
                    this.canDiscountMoney = this.$app.isNull(this.discountMoney) ? this.improtMoney : this.discountMoney;  // 可优惠金额

                    const discountList = this.$app.getLocalStorage('sv_uc_saleprediscount');
                    if (discountList) {
                        this.update({
                            key: 'discountList',
                            data: discountList
                        });
                    }

                    this.$nextTick(() => {
                        if (this.currentMenuPos == 0) {
                            this.$refs.inputMoney.select();
                        } else {
                            this.$refs.inputDiscount.select();
                        }
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                case 8:                                       // back
                    this.deleteInput();
                    return;
                case 46:                                      // delete
                    this.deleteInput();
                    return;
                case 48:                                      // 0
                    this.calculateInput('0');
                    return;
                case 96:                                      // 0
                    this.calculateInput('0');
                    return;
                case 49:                                      // 1
                    this.calculateInput('1');
                    return;
                case 97:                                      // 1
                    this.calculateInput('1');
                    return;
                case 50:                                      // 2
                    this.calculateInput('2');
                    return;
                case 98:                                      // 2
                    this.calculateInput('2');
                    return;
                case 51:                                      // 3
                    this.calculateInput('3');
                    return;
                case 99:                                      // 3
                    this.calculateInput('3');
                    return;
                case 52:                                      // 4
                    this.calculateInput('4');
                    return;
                case 100:                                     // 4
                    this.calculateInput('4');
                    return;
                case 53:                                      // 5
                    this.calculateInput('5');
                    return;
                case 101:                                     // 5
                    this.calculateInput('5');
                    return;
                case 54:                                      // 6
                    this.calculateInput('6');
                    return;
                case 102:                                     // 6
                    this.calculateInput('6');
                    return;
                case 55:                                      // 7
                    this.calculateInput('7');
                    return;
                case 103:                                     // 7
                    this.calculateInput('7');
                    return;
                case 56:                                      // 8
                    this.calculateInput('8');
                    return;
                case 104:                                     // 8
                    this.calculateInput('8');
                    return;
                case 57:                                      // 9
                    this.calculateInput('9');
                    return;
                case 105:                                     // 9
                    this.calculateInput('9');
                    return;
                case 190:                                     // .
                    this.calculateInput('.');
                    return;
                case 110:                                     // .
                    this.calculateInput('.');
                    return;
                case 67:                                      // C
                    this.calculateInput('C');
                    return;
                default:
                    console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            if (!this.isCheckIn) {
                this.$root.$emit('keyCode', 'priceChange');
                this.$root.$emit('restaurant', 'priceChange');
            }
        },
        clearInput() {                                              // 清除输入内容
            if (this.currentMenuPos === 0) {
                this.inputMoney = '';
            } else {
                this.inputDiscount = '';
            }
        },
        handlePrevent(e) {                                          // 输入框事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        changeMenu(pos) {                                           // 改变菜单
            this.currentMenuPos = pos;
            this.$nextTick(() => {
                if (this.currentMenuPos === 0) {
                    this.$refs.inputMoney.select();
                } else {
                    this.$refs.inputDiscount.select();
                }
            })
        },
        handleDiscount(item) {                                      // 选择折扣
            if (item.value === 0) {
                // 点击 自定义 折扣
                this.showCustomDiscount();
            } else {
                this.inputDiscount = item.value;
            }
        },
        calculateInput(_str) {                                      // 计算输入框的值
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(() => {
                this.updateInterval = false;
            }, 3000)
            if (this.currentMenuPos == 0) {
                // 改价
                if (this.inputMoney.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
                if (_str == 'C') {
                    this.clearInput();
                    return;
                }
                if (!this.updateInterval) {
                    this.inputMoney = _str;
                } else {
                    if (_str != '0') {
                        if (this.inputMoney == '0' && _str != '.') {
                            this.inputMoney = '';
                        }
                        this.inputMoney = this.inputMoney + _str;
                    } else {
                        if (parseFloat(this.inputMoney) <= 0 && this.inputMoney.indexOf('.') < 0) {
                            return
                        }
                        this.inputMoney = this.inputMoney + _str;
                    }
                    this.inputMoney = this.$app.verifyNumberDecimalThree(this.inputMoney);
                }
            } else {
                // 改折
                if (_str == 'C') {
                    this.clearInput();
                    return;
                }
                if (!this.updateInterval) {
                    this.inputDiscount = _str;
                } else {
                    if (_str != '0') {
                        if (this.inputDiscount == '0' && _str != '.') {
                            this.inputDiscount = '';
                        }
                        this.inputDiscount = this.inputDiscount + _str;
                    } else {
                        if (parseFloat(this.inputDiscount) <= 0 && this.inputDiscount.indexOf('.') < 0) {
                            return
                        }
                        this.inputDiscount = this.inputDiscount + _str;
                    }
                    this.inputDiscount = this.$app.verifyNumberDecimal(this.inputDiscount);
                }
            }
            this.updateInterval = true;
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.currentMenuPos === 0) {
                if (this.inputMoney == '0') return;
                if (this.inputMoney.length == 1) return this.inputMoney = '0';
                this.inputMoney = this.inputMoney.substring(0, this.inputMoney.length - 1);
            } else {
                if (this.inputDiscount == '0') return;
                if (this.inputDiscount.length == 1) return this.inputDiscount = '';
                this.inputDiscount = this.inputDiscount.substring(0, this.inputDiscount.length - 1);
            }
        },
        handleFocus({ target }) {                                   // 输入框focus执行
            target.value = target.value == '0' ? '' : target.value;
        },
        handleInput({ target }) {                                   // 输入框输入内容执行
            // target.value = this.currentMenuPos === 0 ? this.$app.verifyNumberDecimalThree(target.value) : this.$app.verifyNumberDecimal(target.value);
            target.value = this.$app.verifyNumberDecimal(target.value);
            this.currentMenuPos === 0 ? this.inputMoney = target.value : this.inputDiscount = target.value;
        },
        handleInputBlur({ target }) {                               // 输入框blur执行
            if (target.value.length == 0 || target.value == 0) target.value = this.currentMenuPos === 0 ? '0' : '10';
            // target.value = this.currentMenuPos === 0 ? this.$app.verifyNumberDecimalThree(target.value) : this.$app.verifyNumberDecimal(target.value);
            target.value = this.$app.verifyNumberDecimal(target.value);
            if (this.currentMenuPos === 0) {
                this.inputMoney = target.value;
            } else {
                if (target.value > 10) {
                    target.value = 10;
                    this.$message.warning('商品折扣不能超过10');
                }
                this.inputDiscount = target.value;
            }
        },
        showCustomDiscount() {                                      // 显示自定义折扣弹窗
            this.customDiscountStatus = true;
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleGive() {                                              // 赠送按钮点击事件
            this.$emit('submitMoney', 0);
            this.closeDialog();
        },
        handleSure() {                                              // 确定按钮点击事件
            if (this.$app.isNull(this.inputMoney)) return this.$message.warning('请输入金额')
            this.inputDiscount = this.$app.isNull(this.inputDiscount) ? 10 : this.inputDiscount;
            let submitMoney = 0;
            if (parseFloat(this.inputMoney) > 999999) return this.$message.warning('输入金额不能大于999999')
            if (parseFloat(this.inputDiscount) > 10) return this.$message.warning('输入折扣不能大于10')
            if (this.currentMenuPos === 0) {
                submitMoney = parseFloat(this.inputMoney)
            } else {
                let discoutNumer = this.$app.subtractNumber(1, this.$app.multiplyNumber(this.inputDiscount, 0.1));
                submitMoney = this.$app.subtractNumber(this.improtMoney, this.$app.multiplyNumber(parseFloat(this.canDiscountMoney), discoutNumer));
            }
            if (submitMoney < this.$app.subtractNumber(this.improtMoney, this.canDiscountMoney)) {
                return this.$message.warning('输入金额小于最低金额：' + this.$app.subtractNumber(this.improtMoney, this.discountMoney));
            }
            if (this.extendInfo.type) {
                this.$emit('submitMoney', { ...this.extendInfo, value: this.$app.moneyFixed(submitMoney, 2) });
            } else {
                this.$emit('submitMoney', this.$app.moneyFixed(submitMoney, 2));
            }
            this.closeDialog();
        }
    }
};
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: 'quickCollect',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            inputMoney: '',
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
        ...mapState(['carttingData']),
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
                    this.$nextTick(() => {
                        this.inputMoney = '';
                        this.$refs.inputMoney.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['addToCartting']),
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
                    this.saleNumber = code;
                    return;
            }
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'quickCollect');
            this.$root.$emit('restaurant', 'quickCollect');
        },
        clearInputMoney() {                                         // 清除输入内容
            this.inputMoney = '0';
        },
        calculateInput(_str) {                                      // 计算输入框的值
            if (this.inputMoney.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
            if (_str == 'C') {
                this.clearInputMoney();
                return;
            }
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
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputMoney == '0') return;
            if (this.inputMoney.length == 1) return this.inputMoney = '0';
            this.inputMoney = this.inputMoney.substring(0, this.inputMoney.length - 1);
        },
        handleFocus({ target }) {
            target.value = target.value == '0' ? '' : target.value;
        },
        handleInput(e) {
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        handleInputBlur({ target }) {
            if (target.value.length == 0 || target.value == 0) target.value = 0;
            target.value = this.$app.verifyNumberDecimalThree(target.value);
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件                        
            // let dataIndex = this.carttingData.productResults.findIndex(e => e.productId == 0 && e.price == this.inputMoney);
            // let dataNumber = dataIndex > -1 ? this.carttingData.productResults[dataIndex].number + 1 : 1;
            // if (dataIndex > -1) this.carttingData.productResults.removeByIndex(dataIndex);
            if (parseFloat(this.inputMoney) <= 0) return this.$message.warning('无码收银金额需要大于0');
            this.$root.$emit('showCatting');

            let addItem = {
                productId: 0,
                productName: '无码收银',
                barCode: '',
                // number: dataNumber,
                number: 1,
                unitName: '',
                price: parseFloat(this.inputMoney),
                productChangePrice: parseFloat(this.inputMoney),
                couponMoney: 0,
                dealMoney: parseFloat(this.inputMoney),
            }
            let dataArray = [];
            dataArray.push(addItem);
            this.closeDialog();
            this.addToCartting(dataArray);
        }
    }
};
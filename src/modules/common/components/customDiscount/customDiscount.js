import { mapMutations, mapState } from 'vuex';
export default {
    name: 'customDiscount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        improtMoney: {                                  // 总价改价
            type: String,
            default: '0'
        },
        menuPos: {                                      // 0 改价  1改折
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            inputMoney: '',                             // 输入的金额
            inputDiscount: '10',                        // 输入的折扣
            inputWrapPos: '',                           // 选中的输入框id
            currentDiscountList: [],                    // 当前页面折扣数据
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
        ...mapState(['discountList']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        goodsItem() {
            return this.carttingList[(this.carttingCurrentPage - 1) * 10 + this.carttingSelectedPos]
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.currentDiscountList = Object.assign(this.discountList);
                    this.$nextTick(() => {
                        this.$refs.customDiscount.focus();
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
        },
        clearInput() {                                              // 清除输入内容回调

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
        },
        handleDiscount(item) {                                      // 选择折扣
            if (item.value === 0) {
                // 点击 自定义 折扣
            } else {
                // this.discountId = this.discountId == item.id ? '' : item.id;
                this.inputDiscount = item.value;
            }
        },
        calculateInput(_str) {                                      // 计算输入框的值
            if (this.inputWrapPos === '') return;
            let item = this.currentDiscountList[this.inputWrapPos];
            if (item.value.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
            if (_str == 'C') {
                this.clearInput();
                return;
            }
            if (_str != '0') {
                if (item.value == '0' && _str != '.') {
                    item.value = '';
                }
                item.value = item.value + _str;
            } else {
                if (parseFloat(item.value) > 0) {
                    item.value = item.value + _str;
                }
            }
            item.value = this.$app.verifyNumberDecimal(item.value);
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
        handleFocus(e, pos) {                                      // 输入框focus执行
            e.target.value = e.target.value == '0' ? '' : e.target.value;
            this.inputWrapPos = pos;
        },
        handleInput({ target }) {                                   // 输入框输入内容执行
            target.value = target.value > 10 ? 10 : this.$app.verifyNumberDecimal(target.value);
        },
        handleInputBlur({ target }) {                               // 输入框blur执行
            if (target.value.length == 0 || target.value == 0) return target.value = '10';
            target.value = this.$app.verifyNumberDecimal(target.value);
            target.value = target.value > 10 ? 10 : target.value;
            this.currentDiscountList[this.inputWrapPos].value = target.value;
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件
            this.currentDiscountList.map(e => {
                if(this.$app.isNull(e.value)){
                    e.value = 10;
                }
            });
            this.update({
                key: 'discountList',
                data: this.currentDiscountList
            });
            this.closeDialog();
        }
    }
};
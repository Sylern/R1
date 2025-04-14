export default {
    name: 'numberChange',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '修改数量'
        },
        noLimited: {                    // 无提交数据限制
            type: Boolean,
            default: false
        },
        autoClose: {                    // 点击确定后自动关闭
            type: Boolean,
            default: true
        },
        couldZero: {
            type: Boolean,
            default: false
        },
        onlyNumber: {
            type: Boolean,
            default: true
        },
        compare: {
            type: Boolean,
            default: false
        },
        defaultNumber: {
            type: String,
            default: '1'
        }
    },
    data() {
        return {
            inputTimer: null,
            updateInterval: false,                      // 修改内容是否间隔,false直接替换
            inputNumber: '',
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
                    this.inputNumber = this.defaultNumber;
                    this.$nextTick(() => {
                        // this.inputNumber = this.currentSelectItem.number + '';
                        this.$refs.inputNumber.select();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
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
                    console.log('numberChange key ' + code + ' is click');
                    return;
            }
        },
        handleBtnClose() {
            this.dialogVisible = 'close';
            this.$emit('close');
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'numberChange');
            this.$root.$emit('restaurant', 'numberChange');
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '';
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleEnter();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        calculateInput(_str) {                                      // 计算输入框的值
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(() => {
                this.updateInterval = false;
            }, 3000)
            if (!this.updateInterval) {
                if (_str == 'C') return this.clearInputNumber();
                this.inputNumber = _str;
            } else {
                if (this.inputNumber.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
                if (_str == 'C') return this.clearInputNumber();
                if (_str != '0' && _str != '.') {
                    if (parseFloat(this.inputNumber) > 0 || this.inputNumber.length > 1) {
                        // example   1:'1.'   2:'0.'
                        this.inputNumber = this.inputNumber + _str;
                    } else {
                        this.inputNumber = _str;
                    }
                } else {
                    if (_str == '0') {
                        this.inputNumber = this.inputNumber === '0' ? '0' : this.inputNumber + _str;
                    } else {
                        if (!this.onlyNumber) this.inputNumber = this.inputNumber + _str;
                    }
                }
                this.inputNumber = this.$app.verifyNumberDecimalThree(this.inputNumber);
            }
            this.updateInterval = true;
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputNumber == '') return;
            if (this.inputNumber.length == 1) return this.inputNumber = '';
            this.inputNumber = this.inputNumber.substring(0, this.inputNumber.length - 1);
        },
        handleFocus({ target }) {
            target.value = this.$app.isNull(target.value) ? '' : target.value;
        },
        handleInput({ target }) {
            target.value = this.onlyNumber ? this.$app.verifyNumber(target.value) : this.$app.verifyNumberDecimalThree(target.value);
            this.inputNumber = target.value;
        },
        handleInputBlur({ target }) {
            if (target.value.length == 0 || target.value == 0) target.value = '';
            target.value = this.onlyNumber ? this.$app.verifyNumber(target.value) : this.$app.verifyNumberDecimalThree(target.value);
            this.inputNumber = target.value;
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleSure();
        },
        handleSure() {                                              // 确定按钮点击事件
            if (this.inputNumber > 999999 && !this.noLimited) return this.$message.warning('输入不能超过999999');
            if (!this.couldZero && (this.$app.isNull(this.inputNumber) || this.inputNumber <= 0)) return this.$message.warning('请输入值大于 0');
            if (this.compare && parseFloat(this.inputNumber) > parseFloat(this.defaultNumber)) {
                this.inputNumber = this.defaultNumber;
                return this.$message.warning('最多只能输入：' + this.defaultNumber)
            }
            if(this.autoClose) this.closeDialog();
            this.$emit('handleNumberChange', this.inputNumber);
        }
    }
};
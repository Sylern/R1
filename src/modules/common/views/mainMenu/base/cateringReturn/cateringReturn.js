import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'cateringReturn',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        cateringReturnInfo: {
            type: Object,
            default: () => {
                return {
                    title: '退菜',
                    money: 0,
                    number: 1
                }
            }
        },
        isSingle: {
            type: Boolean,
            default: false
        },
        singleNumber: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            dataReason: '',
            dataRemark: '',
            returnNumber: 1,
            hasReturnPsw: false,
            returnPsw: ''
        }
    },
    computed: {
        ...mapState(['memberInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        returnMoney() {
            let number = this.$app.isNumber(this.returnNumber) ? this.returnNumber : 0;
            return this.$app.moneyFixed(this.$app.multiplyNumber(this.cateringReturnInfo.money, number))
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.getUserModuleConfigs();
                    this.returnPsw = '';
                    this.returnNumber = this.cateringReturnInfo.number;
                    this.dataRemark = '';
                    this.$nextTick(() => {
                        this.$refs.cateringReturn.focus();
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
                default:
                    console.log('cateringReturn key ' + code + ' is click');
                    return;
            }
        },

        getUserModuleConfigs() {                        // 获取配置
            stockApi.getUserModuleConfig({ moduleCode: 'ReceptionCashierSet' }).then(res => {
                if (res) {
                    let return_Vegetables = this.$app.isNull(res) ? {} : res[0].childInfolist.find(e => e.sv_user_config_code === 'Return_Vegetables_Pwd');
                    let return_VegetablesHasDetail = return_Vegetables.childDetailList ? true : false;
                    let enable = true, value = '';
                    if (return_VegetablesHasDetail) {
                        enable = return_Vegetables.childDetailList.length > 0 ? return_Vegetables.childDetailList[0].sv_detail_is_enable : true;
                        value = return_Vegetables.childDetailList.length > 0 ? return_Vegetables.childDetailList[0].sv_detail_value : '';
                    }
                    this.hasReturnPsw = enable && !this.$app.isNull(value) ? true : false;
                }
            })
        },
        handleInput({ target }) {
            target.value = this.$app.verifyNumberDecimalThree(target.value);
            this.returnNumber = target.value;
            if (target.value > this.cateringReturnInfo.number) return this.returnNumber = this.cateringReturnInfo.number, this.$message.warning('退货数量不能超过购买数量')
        },
        changePayType(index) {
            this.payTypePos = index;
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handlePrevent() {                                           // 事件阻止
            return false;
        },
        handleEnter() {
            if (parseFloat(this.returnNumber) <= 0 || this.$app.isNull(this.returnNumber)) return this.$message.warning('请输入退菜数量');
            if (this.hasReturnPsw && this.returnPsw.length !== 6) return this.$message.warning('请输入6位数退菜密码');
            let dataReturn = {
                number: this.returnNumber,
                remark: this.dataRemark
            }
            if (this.hasReturnPsw) {
                dataReturn.psw = this.$app.md5(this.returnPsw).toUpperCase()
            }
            this.$emit('handleReturnNumber', dataReturn);
        },

        handlePswEnter() {
            if (this.returnPsw.length !== 6) return this.$message.warning('请输入6位数退菜密码');
            let dataReturn = {
                number: this.returnNumber,
                remark: this.dataRemark,
                psw: this.$app.md5(this.returnPsw).toUpperCase(),
            }
            this.$emit('handleReturnNumber', dataReturn);
            this.closeDialog();
        },
    }
};
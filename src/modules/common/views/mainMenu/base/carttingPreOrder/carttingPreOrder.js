import { mapState, mapMutations, mapActions } from 'vuex';
import { stockApi } from "@/api/index.js";
import { returnPsw } from '@/components/index';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
export default {
    name: 'carttingPreOrder',
    components: { payTypeList, returnPsw },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    sv_table_id: null
                }
            }
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        mergeCateringList: {
            type: Array,
            default: () => {
                return []
            }
        },
        popOrderData: {
            type: Object,
            default: () => {
                return {
                    productResults: []
                }
            }
        },
    },
    data() {
        return {
            showContent: false,
            dataList: [],
            isSubmitting: false,
            addPreOrderStatus: false,
            returnPreOrderStatus: false,
            returnData: {
                money: '',
                remark: '',
                psw: ''
            },
            Forbid: '',
            remark: '',
            dataType: {
                1: '预付',
                2: '退款'
            },
            payInfo: {
                queryId: '',
                businessType: 22,
                subject: 'PC房台预付金',
                svOrderListId: null,
                receivableMoney: null,                          // 应收金额
                money: null                                     // 扫码支付金额
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'memberInfo']),
        ...mapState('permission', ['CashierManage']),
        dialogVisible: {
            get() {
                setTimeout(() => {
                    this.showContent = this.visible;
                }, 10)
                return this.visible;
            },
            set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.addPreOrderStatus = false;
                    this.returnPreOrderStatus = false;
                    this.getPreOrderList();
                }
            }
        },
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update', 'clearMember']),
        ...mapActions(['requsetMemberInfo']),
        handleBack() {
            this.dialogVisible = 'close';
        },
        handShowAdd() {
            this.addPreOrderStatus = true;
            this.payInfo = {
                money: '',
                remark: '',
                psw: ''
            }
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
        },
        handleInput({ target }) {
            target.value = this.$app.verifyNumberDecimal(target.value);
        },
        handleClearMember() {                               // 清除选中会员
            this.clearMember();
        },
        showMemberList() {                                          // 显示会员弹窗
            let permissionItem = this.CashierManage.Select_Members || { enabled: true };
            if (!permissionItem.enabled) return this.$message.warning(permissionItem.tips || '无权限')
            this.$root.$emit('keyCode', 117);
        },
        preOrderSubmit() {
            if (this.$app.isNull(this.payInfo.money)) return this.$message.warning('请输入预付金额')
            if (!this.$refs.prepayTypeList) return this.$message.warning('找不到支付方式')
            const paymentList = this.$refs.prepayTypeList.getPayTypeInfo()
            if (paymentList.length < 1) return this.$message.warning('请选择支付方式')
            const isStoreCard = !this.$app.isNull(this.memberInfo.member_id) && paymentList[0].name === '储值卡'
            if (isStoreCard && this.memberInfo.sv_mw_availableamount < this.payInfo.money) return this.$message.warning('储值卡余额不足')
            let query = {
                tableId: this.tableInfo.sv_table_id,
                money: parseFloat(this.payInfo.money),
                payment: paymentList[0].name,
                memberId: isStoreCard ? this.memberInfo.member_id : null,
                paymentDataId: isStoreCard ? this.memberInfo.sv_wallet_id : null,
                sourceType: 100,
                remark: this.remark
            }
            stockApi.preOrderAdd(query, this.Forbid).then(res => {
                if (res) {
                    if (this.$refs.prepayTypeList.isScanPay()) {
                        this.payInfo = {
                            queryId: res.queryId,
                            businessType: 22,
                            subject: 'PC房台预付金',
                            svOrderListId: res.svOrderListId,
                            receivableMoney: this.receivableMoney,             // 应收金额
                            money: this.payInfo.money                          // 扫码支付金额
                        }
                        this.$refs.prepayTypeList.handleScan();
                    } else {
                        if (paymentList[0].name === '储值卡') {
                            this.requsetMemberInfo(this.memberInfo.member_id);
                        }
                        this.submitSuccess();
                    }
                }
            });
        },
        handShowReturn(item) {
            if (this.tableInfo.is_online_order) return this.$message.warning('客户开台预付金，不支持操作退款')
            this.returnPreOrderStatus = true;
            this.returnData = {
                id: item.id,
                money: item.money,
                psw: '',
                remark: ''
            }
        },
        preOrderReturn() {
            this.$refs.returnPsw.showPswWrap();
        },
        handlePswReturn(val) {
            let query = {
                id: this.returnData.id,
                password: val,
                // money: this.returnData.money,
                remark: this.returnData.remark
            }
            stockApi.preOrderReturn(query).then(res => {
                if (res) {
                    this.returnPreOrderStatus = false;
                    this.$emit('change');
                    if (this.memberInfo.member_id) {
                        this.requsetMemberInfo(this.memberInfo.member_id);
                    }
                    this.getPreOrderList();
                }
            });
        },
        getPreOrderList() {
            let query = {
                tableId: this.tableInfo.sv_table_id,
            }
            stockApi.getPreOrderList(query).then(res => {
                if (res) {
                    this.dataList = res
                }
            });
        },
        handleCloseScan() {
            this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
            this.isSubmitting = false;
        },
        submitSuccess() {                       // 结算成功回调
            this.addPreOrderStatus = false;
            this.$emit('change');
            if (this.memberSelected) this.$emit('updateCatering')
            this.getPreOrderList();
        },
    }
}
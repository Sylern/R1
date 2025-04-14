import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        couponSelected: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            coupon_is_superposition: true,                  // 优惠券可叠加使用总开关
            keyWord: '',
            selectedCouponId: '',
            selectedCouponIdList: [],
            selectedPos: -1,
            showInputResult: false,
            ticketResult: {

            },
        }
    },
    computed: {
        ...mapState(['memberInfo', 'queryUpdateCartting']),
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
                    // this.initSelected();
                    this.keyWord = '';
                    this.coupon_is_superposition = true;
                    this.selectedCouponIdList = [];
                    this.memberInfo.couponCountList.forEach(item => {
                        if (this.couponSelected.includes(item.sv_record_id+'')) {
                            this.selectedCouponIdList.push(item)
                        }
                    });
                    this.showInputResult = false;
                    this.$nextTick(() => {
                        this.$refs.discount.focus();
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
                    console.log('discount key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handlePrevent() {                                           // 事件阻止
            return false;
        },
        clearKeyWord() {                                            // 
            this.showInputResult = false;
        },
        handleInputEnter() {                                        // 查询优惠券
            stockApi.respCouponRecord({
                couponCode: this.keyWord
            }).then(res => {
                if (res) {
                    this.showInputResult = true;
                    this.ticketResult = res;
                    this.selectedCouponIdList.push(res);
                    // this.selectedCouponId = this.ticketResult.sv_record_id;
                }
            })
        },
        initSelected() {
            this.selectedPos = this.memberInfo.couponCountList.findIndex(e => e.sv_record_id === this.queryUpdateCartting.couponRecordId);
        },
        handleItemClick(item) {
            if (!this.coupon_is_superposition && this.selectedCouponIdList.findIndex(e => e.sv_record_id === item.sv_record_id) === -1) return this.$message.warning('优惠券不支持叠加使用')
            let findIndex = this.selectedCouponIdList.findIndex(e => e.sv_record_id === item.sv_record_id);
            if (findIndex > -1) {
                this.coupon_is_superposition = true;
                this.selectedCouponIdList.removeByIndex(findIndex);
                return
            };
            if (this.selectedCouponIdList.length > 0) {
                if (this.selectedCouponIdList[0].sv_coupon_type === 1) return this.$message.warning('已使用折扣券，不支持同时使用其他券')
                if (item.sv_coupon_type !== 0) {
                    return this.$message.warning('已选择代金券，不支持同时使用折扣券')
                }
                if (item.sv_coupon_type === 0 && !item.sv_coupon_is_superposition) {
                    return this.$message.warning('当前代金券不支持叠加使用')
                }
            }
            // 已选优惠券可以叠加
            this.coupon_is_superposition = item.sv_coupon_is_superposition;
            this.selectedCouponIdList.push(item);
            // this.selectedPos = index;
            // this.selectedCouponId = this.memberInfo.couponCountList[this.selectedPos].sv_record_id;
        },
        handleEnter() {
            if (this.$app.isNull(this.selectedCouponIdList)) return this.$message.warning('请选择优惠券');
            this.$emit('returnCouponRecordIdList', this.selectedCouponIdList);
            this.closeDialog();
        }
    }
};
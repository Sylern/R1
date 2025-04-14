import { stockApi } from "@/api/index.js";
import { mapMutations } from 'vuex';
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        memberList: {
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            query: {                        // 优惠券列表查询
                userId: '',                     // 店铺Id
                seachStr: '',                   // 查询内容
                type: 1,                        // 1.全部；2.优惠券发放TOP5；3.优惠券领取TOP5；4.优惠券使用TOP5
                sv_coupon_check_user_id: '',    // 核销门店
                sv_coupon_opt_empid: '',        // 优惠券指定操作员（包含管理员操作记录）
                opt_empid: '',                  // 优惠券指定操作员
                startDate: '',                  // 创建开始时间
                endDate: '',                    // 创建结束时间
                state: -1,                      // 优惠券状态:-1.全部；0.未过期；1.已过期
                couponState: -1,                // 根据核销状态进行查询 -1 - 全部 0-待发放 1-已发放
                enable: true,
                pageIndex: 1,                   // 页码
                pageSize: 999,                   // 分页大小
            },
            couponCountList: [],        // 优惠券列表

            // 发放优惠券
            sendEntity: {               // 发放优惠券实体
                sv_coupon_id: '',           // 优惠券id
                generateCouponType: 0,      // 0.按选择部分会员生成优惠券;1.按会员等级生成优惠券;2.按会员分组生成优惠券;3.GenerateCouponMemberAll;4.按数量生成优惠券;5.按会员最后消费天数;6.按会员近期消费笔数;7.按会员储值余额;8.按会员生日;9.按会员近期消费金额;10.按会员过期时间;11.按次卡剩余次数;12.按次卡过期时间
                conCopies: 1,               // 每人发1张
                generateUseIds: [],         // 选择的会员
            },

            selectedPos: -1             // 选择的优惠券下标
        }
    },
    computed: {
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
                    this.initSelected();
                    this.$nextTick(() => {
                        this.$refs.discount.focus();
                    })
                }
            }
        }
    },
    mounted() {
        this.getCouponList();           // 获取优惠券列表
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
            this.query.keywords = '';
            this.query.pageIndex = 1;
            this.getCouponList();
        },
        initSelected() {
            this.selectedPos = this.couponCountList.findIndex(e => e.sv_coupon_id === this.couponRecordId);
        },
        handleItemClick(index) {                                     // 点击优惠券事件
            this.selectedPos = index;
        },
        handleEnter() {                                             // 发放优惠券事件
            if (this.selectedPos === -1) return
            this.sendEntity.sv_coupon_id = this.couponCountList[this.selectedPos].sv_coupon_id
            this.sendEntity.generateUseIds = this.$app.isNull(this.memberList) ? [] : this.memberList.map(e => ({
                useIds: e.member_id,
                sv_mr_mobile: e.sv_mr_mobile,
                sv_mr_name: e.sv_mr_name,
                sv_mr_nick: e.sv_mr_nick,
            }))
            this.postCouponRecode();
        },
        handleToCoupon() {
            this.$router.push('/member/couponManage')
        },
        getCouponList() {                                           // 获取优惠券列表
            stockApi.GetCouponPageList(this.query).then(res => {
                if (!this.$app.isNull(res)) {
                    this.couponCountList = this.$app.isNull(res.dataList) ? [] : res.dataList;
                }
            });
        },
        postCouponRecode() {                                        // 优惠券发放接口
            stockApi.postCouponRecode(this.sendEntity).then(res => {
                if (res.succeed) {
                    this.$message.success('发放成功');
                    this.closeDialog();
                } else {
                    this.$message.error(res.errmsg)
                }
            })
        }
    }
};
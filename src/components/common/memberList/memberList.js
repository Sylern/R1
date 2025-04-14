import utils from '@/utils/utils';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
const { debounce, throttle } = utils;
export default {
    name: 'memberList',
    props: {
        visible: { type: Boolean, default: false },
        queryEntity: { type: Object, default: () => { return { sectkey: '' } } },
    },
    data() {
        return {
            selectedId: '',
            memberListStatus: true,                             // 用户列表弹窗
            memberRecordsStatus: false,                         // 用户消费记录弹窗
            recordsContentStatus: false,                        // 用户消费详情弹窗

            queryMembers: {
                sectkey: '',
                PageIndex: 1,
                PageSize: 20
            },
            memberList: [],
            listTotalPage: 0,

            memberRecordsTotal: '',                             // 用户消费长度
            totalAmount: '',                                    // 累计消费
            memberRecords: [],                                  // 用户消费记录列表
            queryMemberRecords: {                               // 用户消费记录查询实体
                MemberId: '',
                Date: '',
                Date2: '',
                Page: 1,
                PageSize: 9999
            },
            selectedRecordId: '',                               // 选中的记录id
            recordsContent: [],
            memberInfo: {
                memberId: ''
            },
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
                    this.$nextTick(() => {
                        window.addEventListener('scroll', this.pageNextThrottle, true);
                        this.$refs.inputKeyWord.focus();
                        this.queryMembers.sectkey = this.$app.isNull(this.queryEntity.sectkey) ? '' : this.queryEntity.sectkey;
                        this.queryMembers.PageIndex = 1;
                        this.memberList = [];
                        this.getMemberList();
                    })
                } else {
                    window.removeEventListener('scroll', this.pageNextThrottle, true);
                }
            }
        },
        queryEntity: {
            deep: true,
            handler: function (newVal, oldVal) {
                if (Object.keys(newVal).length === 0) return;
                if (!this.$app.isNull(oldVal)) {
                    this.queryMembers.sectkey = this.$app.isNull(newVal.sectkey) ? '' : newVal.sectkey;
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                            // Enter
                    this.queryMembers.PageIndex = 1;
                    this.memberList = [];
                    this.getMemberList();
                    return;
                default:
                    return;
            }
        },
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                            // Enter
                    return;
                case 27:                                            // Esc
                    this.closeDialog();
                    return;
                default:
                    this.saleNumber = code;
                    return;
            }
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.memberListStatus = true;
            this.memberRecordsStatus = false;
            this.recordsContentStatus = false;
        },
        initQueryData() {                                           // 初始化请求数据
            this.queryMembers.sectkey = '';
            this.queryMembers.PageIndex = 1;
            this.memberList = [];
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && this.queryMembers.PageIndex < this.listTotalPage) {
                this.queryMembers.PageIndex++;
                this.getMemberList();
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getMemberList() {                                           // 查询会员列表
            stockApi.getMemberList(this.queryMembers).then(res => {
                if (res) {
                    let dataList = this.$app.isNull(res.datas) ? [] : res.datas;
                    this.memberList = this.memberList.concat(dataList);
                    this.listTotalPage = res.total;
                }
            });
        },
        getOrderInfo() {                                            // 查询会员订单信息
            this.queryMemberRecords.MemberId = this.selectedId;
            stockApi.getOrderInfo(this.queryMemberRecords).then(res => {
                if (res) {
                    this.memberRecordsTotal = res.rowCount;
                    this.totalAmount = this.$app.moneyFixed(res.totalAmount, 2);
                    this.memberRecords = this.$app.isNull(res.orderList) ? [] : res.orderList.map((e, index) => {
                        let item = this.setItem(e, index);
                        let children = this.$app.isNull(e.productlist) ? [] : e.prlist.map(k => { return this.setChildren(k, e.order_running_id); });
                        return { ...item, ...children }
                    });
                }
            });
        },
        setItem(e, index) {
            let order_datetime = this.$app.isNull(e.order_datetime) ? '' : this.$app.currentTime(new Date(e.order_datetime));
            return {
                index,
                order_serial_number: e.order_serial_number,             // 流水号
                order_running_id: e.order_running_id,                   // 订单号
                order_payment: e.order_payment,                         // 支付方式
                order_money: this.$app.moneyFixed(e.order_money, 2),                // 订单金额
                sv_coupon_amount: this.$app.moneyFixed(e.sv_coupon_amount, 2),      // 优惠金额
                order_aintegral: this.$app.moneyFixed(e.order_aintegral, 2),        // 使用积分
                order_aintegral: this.$app.moneyFixed(e.order_aintegral, 2),       // 抹零金额
                order_receivable: this.$app.moneyFixed(e.order_receivable, 2),      // 订单应收-实付金额
                order_datetime,                                         // 消费时间
                remark: e.remark                                        // 备注
            }
        },
        setChildren(e, parentId) {
            return {
                parentId,
                ...e
            }
        },
        closeMemberRecords() {                                      // 会员消费记录关闭
            this.memberRecordsStatus = false;
            this.memberListStatus = true;
        },
        closeRecordsContent() {                                     // 会员消费记录详情关闭
            this.recordsContentStatus = false;
            this.memberRecordsStatus = true;
        },
        clearKeyWord() {                                            // 清楚关键词按钮调用
            this.initQueryData();
            this.getMemberList();
        },
        handleMember(item) {                                          // 选择会员
            if (item.isOverdue) { this.$message.error('此会员卡已过期'); return }
            if (item.sv_mr_status == 1) { this.$message.error('此会员卡已挂失'); return }
            this.selectedId = item.member_id;
            this.memberInfo = item;
            this.memberInfo.memberId = item.member_id;
            this.$emit('changeMemberInfo', this.memberInfo)
            this.closeDialog();
        },
        handleMemberInfo(id) {                                      // 点击右箭头查看会员详情
            this.selectedId = id;
            this.requsetMemberInfo(id);
            this.memberListStatus = false;
            this.memberRecordsStatus = true;
            this.getOrderInfo();
        },
        handleChangeTime(date) {                                    // 选择制单日期-设置起止时间
            this.queryMemberRecords.Date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd') + ' 00:00';
            this.queryMemberRecords.Date2 = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd') + ' 23:59';
            this.queryMemberRecords.Page = 1;
            // this.getProductModifyPriceList();
        },
        handleJump(scope) {                                         // 打开消费记录详情
            this.selectedRecordId = scope.sv_number;
            this.recordsContentStatus = true;
            this.memberRecordsStatus = false;
        },
        handleImgUrl(val) {                                         // 拼接url
            return val && val.indexOf('http') === -1 ? '//res.decerp.cc/' + val : val;
        }
    }
};
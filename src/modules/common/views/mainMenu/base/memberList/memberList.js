import utils from '@/utils/utils';
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import { delay } from '@/components/index';
import headScan from '../headScan/headScan.vue';
import numberChange from '../numberChange/numberChange.vue';
const { debounce, throttle } = utils;
export default {
    name: 'memberList',
    components: { delay, headScan, numberChange },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        syncSelectedClose: {
            type: Boolean,
            default: true
        },
        useType: {
            type: String,
            default: 'common'
        },
        title: {
            type: String,
            default: '选择会员',
        },
        showCardWrap: {
            type: Boolean,
            default: false
        },
        syncStore: {
            type: Boolean,
            default: true
        },
        keyword: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedId: '',
            limitedTimer: null,
            isLoadingList: false,
            memberListStatus: true,                             // 用户列表弹窗
            memberCardStatus: false,                            // 会员次卡
            headScanMemberInfo: {
                sv_mr_name: '',
                sv_ml_name: '',
                sv_mr_mobile: '',
                sv_mr_birthday: '',
                sv_mw_availableamount: '',
                sv_mw_availablepoint: '',
            },
            memberCardSelectedPos: -1,                          // 选中次卡
            cardListContentList: [],
            memberRecordsStatus: false,                         // 用户消费记录弹窗
            recordsContentStatus: false,                        // 用户消费详情弹窗
            memberAddTipsStatus: false,                         // 新增会员弹窗提示
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
                    key: 'Del'
                },
                {
                    key: '0'
                },
                {
                    key: 'C'
                }
            ],
            showMemberList: false,                              // 展示会员列表
            queryMembers: {
                // allstore: 0,
                sectkey: '',
                Page: 1,
                PageSize: 20
            },
            memberList: [],
            listTotalPage: 0,
            delayStatus: false,                                 // 延期弹窗状态
            currentDelayItem: {
                validity_date: ''
            },

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
            recordsContent: {
                prList: []
            },
            numberChangeStatus: false,                          // 弹窗修改次数
            currentChangeNumberObj: {
                index: -1,
                pos: -1,
                currentNumber: 1
            },
            currentId: '',                                      // 当前钱包id
            updateRemarkVisible: false,                         // 修改备注
            currentStoreCardInfo: {},                           // 当前储值卡
            updateRemark: ''
        }
    },
    computed: {
        ...mapState(['memberInfo', 'userInfo', 'memberSetting']),
        ...mapState('permission', ['CashierManage']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        imgBase() {
            return stockApi.imgBase()
        },
        default_logo() {
            return base.frontImgBase + '/images/cashier/default_user_logo.png'
        },
        is_education() {
            let industrytypeIncludes = [11, 32]         // 11-艺培 32-健身房
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype)
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.memberListStatus = true;
                    this.memberCardStatus = false;
                    this.cardListContentList = [];
                    this.$nextTick(() => {
                        window.addEventListener('scroll', this.pageNextThrottle, true);
                        !!this.$refs.inputKeyWord && this.$refs.inputKeyWord.focus();
                        this.initQueryData();
                        if (this.keyword) {
                            this.queryMembers.sectkey = this.keyword;
                            this.getMemberList();
                        }
                    })
                } else {
                    this.memberCardStatus = false;
                    window.removeEventListener('scroll', this.pageNextThrottle, true);
                }
            }
        },
        'queryMembers.sectkey': {
            handler(newVal, oldVal) {
                if (this.$app.isNull(newVal)) {
                    this.showMemberList = false;
                }
            }
        },
        'memberInfo.afterMemberCard': {
            handler(newVal, oldVal) {
                if (newVal && this.showCardWrap) {
                    this.handleShowCardWrap();
                }
            }
        },
        'memberInfo.cardPackageList': {
            deep: true,
            handler(newVal, oldVal) {
                this.cardListContentList = [];
                if (!this.$app.isNull(newVal)) {
                    if (this.memberCardSelectedPos === -1) {
                        this.memberInfo.cardPackageList.forEach(item => {
                            this.cardListContentList = this.cardListContentList.concat(item.list);
                        });
                    } else {
                        this.cardListContentList = this.memberInfo.cardPackageList[this.memberCardSelectedPos].list;
                    }
                    this.$nextTick(() => {
                        !!this.$refs.scroll_cardList && this.$refs.scroll_cardList.update();
                    });
                }
            }
        },
        'cardListContentList': {
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    !!this.$refs.scroll_listWrap && this.$refs.scroll_listWrap.update();
                });
            }
        },
    },
    mounted() {

    },
    onUnmounted() {

    },
    methods: {
        ...mapMutations(['update']),
        ...mapActions(['requsetMemberInfo']),
        handleHeadScanShow() {
            this.memberListStatus = false;
        },
        handleHeadScanCanel() {
            this.memberListStatus = true;
        },
        handleShowCardWrap() {
            this.memberListStatus = false;
            this.memberCardStatus = true;
            this.memberCardSelectedPos = -1;
            this.currentId = this.memberInfo.sv_wallet_id;
        },
        handleHeadScanSure(headScanMemberInfo) {
            if (this.syncStore) {
                this.requsetMemberInfo(headScanMemberInfo.member_id);
                if (!this.showCardWrap) {
                    this.$emit('handleCloseMember');
                }
                return
            }
            if (this.syncSelectedClose) {
                this.dialogVisible = 'close';
                this.memberListStatus = true;
                this.memberRecordsStatus = false;
                this.recordsContentStatus = false;
            }
            this.$emit('selectMember', { ...headScanMemberInfo });
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                            // Enter
                    this.queryMembers.Page = 1;
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
                case 13:                                      // Enter
                    this.handleSure();
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
                    // this.calculateInput('.');
                    return;
                case 110:                                     // .
                    this.calculateInput('.');
                    return;
                case 67:                                      // C
                    this.calculateInput('C');
                    return;
                default:
                    console.log('memberList key ' + code + ' is click');
                    return;
            }
        },
        handleItemClick(item) {
            this.currentId = item.sv_wallet_id;
        },

        handleValidity(item, val) {
            item.showValidity = val;
            this.$nextTick(() => {
                this.$refs.cardList && this.$refs.cardList.update();
            })
        },
        clearInputNumber() {                                        // 清除输入内容
            this.queryMembers.sectkey = '';
        },
        calculateInput(_str) {                                      // 计算输入框的值
            if (this.memberSetting.keyCardInitial) return
            if (_str == 'Del') return this.deleteInput();
            if (_str == 'C') return this.clearInputNumber();
            this.queryMembers.sectkey = this.queryMembers.sectkey + _str;
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.queryMembers.sectkey.length == 1) return this.queryMembers.sectkey = '';
            this.queryMembers.sectkey = this.queryMembers.sectkey.substring(0, this.queryMembers.sectkey.length - 1);
        },
        handleInput({ target }) {
            target.value = this.onlyNumber ? this.$app.verifyNumber(parseFloat(target.value)) : this.$app.verifyNumberDecimalThree(target.value);
            this.queryMembers.sectkey = target.value;
        },
        handleInputBlur({ target }) {
            if (target.value.length == 0 || target.value == 0) target.value = 0;
            target.value = this.onlyNumber ? this.$app.verifyNumber(parseFloat(target.value)) : this.$app.verifyNumberDecimalThree(target.value);
            this.queryMembers.sectkey = target.value;
        },
        handleSure() {                                              // 确定按钮点击事件
            this.getMemberList();
        },
        handleInputLimited() {
            if (this.memberSetting.keyCardInitial) {
                clearTimeout(this.limitedTimer);
                this.limitedTimer = setTimeout(e => {
                    this.queryMembers.sectkey = ''
                }, 100)
            }
        },
        handleInputEnter() {
            this.queryMembers.Page = 1;
            this.getMemberList();
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.memberListStatus = true;
            this.memberCardStatus = false;
            this.memberRecordsStatus = false;
            this.recordsContentStatus = false;
            this.memberAddTipsStatus = false;
            if (this.syncStore) {
                this.$root.$emit('keyCode', 'memberList');
                this.$root.$emit('restaurant', 'memberList');
            } else {
                this.$emit('close')
            }
        },
        handleCloseSync() {
            this.dialogVisible = 'close';
            this.memberListStatus = true;
            this.memberCardStatus = false;
            this.memberRecordsStatus = false;
            this.recordsContentStatus = false;
            this.$emit('close');
        },
        initQueryData() {                                           // 初始化请求数据
            this.showMemberList = false;
            this.queryMembers.sectkey = '';
            this.queryMembers.Page = 1;
            this.memberList = [];
        },
        handleSelectAll() {
            this.initQueryData();
            this.memberCardStatus = false;
            this.getMemberList(false);
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            if (!this.$refs.scrollContent) return;
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && this.queryMembers.Page < this.listTotalPage) {
                this.queryMembers.Page++;
                this.getMemberList(false);
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getMemberList(needKey = true) {                             // 查询会员列表
            if (this.memberCardStatus || this.isLoadingList) return;
            if (needKey && this.$app.isNull(this.queryMembers.sectkey)) return this.$message.warning('请输入' + this.$store.getters.memberText + '卡号或手机号')
            this.isLoadingList = true;
            stockApi.getMemberList(this.queryMembers).then(res => {
                this.isLoadingList = false;
                if (res) {
                    this.memberRecordsStatus = false;
                    this.memberListStatus = true;
                    if (this.queryMembers.Page === 1) {
                        this.memberList = [];
                    }
                    if (!this.$app.isNull(res.list)) {
                        this.memberList = this.memberList.concat(res.list);
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                        })
                    }
                    this.listTotalPage = res.total;
                    if (this.memberList.length === 0) {
                        this.memberAddTipsStatus = true;
                        // if (this.$app.isPhoneNumber(this.queryMembers.sectkey)) {
                        //     this.memberAddTipsStatus = true;
                        //     return
                        // }
                        // return this.$message.warning('未查到相关' + this.$store.getters.memberText)
                    }
                    if (this.memberList.length === 1) {
                        this.handleMember(this.memberList[0]);
                        return
                    }
                    if (this.memberList.length > 1) {
                        this.showMemberList = true;
                        return
                    }
                }
            }).catch(_ => {
                this.isLoadingList = false;
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
                numcount: e.numcount,
                sv_coupon_discount: this.$app.moneyFixed(e.sv_coupon_discount, 2),
                prlist: e.prlist,                                       // 商品列表
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
        closeMemberCard() {                                         // 关闭会员次卡
            this.closeDialog();
        },
        closeMemberRecords() {                                      // 会员消费记录关闭
            this.memberRecordsStatus = false;
            this.memberListStatus = true;
        },
        closeRecordsContent() {                                     // 会员消费记录详情关闭
            this.recordsContentStatus = false;
            this.memberRecordsStatus = true;
        },
        clearKeyWord() {                                            // 清除关键词按钮调用
            this.initQueryData();
            this.getMemberList();
        },
        handleDelay(item) {
            this.delayStatus = true;
            this.currentDelayItem = JSON.parse(JSON.stringify(item));
        },
        handleDelayBack(date) {                                     // 延期操作回调
            let query = {
                member_id: this.currentDelayItem.member_id,
                product_id: this.currentDelayItem.product_id,
                user_id: this.userInfo.user_id,
                userecord_id: this.currentDelayItem.userecord_id,
                validity_date: date
            }
            stockApi.delayedRechargeTime(query).then(res => {
                this.$message.success('延期成功')
                this.memberCardSelectedPos = -1;
                this.requsetMemberInfo(this.currentDelayItem.member_id);
            })
        },
        handleRemarkUpdate(item) {                                  // 修改储值卡备注
            this.currentStoreCardInfo = item;
            this.updateRemark = item.sv_remark;
            this.updateRemarkVisible = true;
        },
        handleSubmitInfo() {
            const postData = {
                sv_wallet_id: this.currentStoreCardInfo.sv_wallet_id,
                type: 3,
                value: this.updateRemark
            }
            stockApi.updateMemberNewWallet(postData).then((res) => {
                if (res) {
                    this.$message.success('修改成功');
                    this.updateRemarkVisible = false;
                    this.currentStoreCardInfo.sv_remark = postData.value;
                }
            })
        },
        handleMemberCardItem(index) {
            if (this.memberCardSelectedPos === index) this.memberCardSelectedPos = -1;
            else this.memberCardSelectedPos = index;
            this.cardListContentList = [];
            if (this.memberCardSelectedPos === -1) {
                this.memberInfo.cardPackageList.forEach(item => {
                    this.cardListContentList = this.cardListContentList.concat(item.list);
                });
            } else {
                this.cardListContentList = this.memberInfo.cardPackageList[this.memberCardSelectedPos].list;
            }
        },
        handleMember(item) {                                        // 选择会员
            if (!item.allow_Consumption && this.useType === 'allow_Consumption') return this.$message.warning('不支持跨店' + this.$store.getters.memberText + '消费');
            if (!item.allow_Recharge && this.useType === 'allow_Recharge') return this.$message.warning('不支持跨店' + this.$store.getters.memberText + '充值');
            if (!item.allow_integral && this.useType === 'allow_integral') return this.$message.warning('不支持跨店' + this.$store.getters.memberText + '积分操作');
            if (item.sv_mr_status == 1) return this.$message.warning('该' + this.$store.getters.memberText + '已挂失');
            if (item.isOverdue) return this.$message.warning('该' + this.$store.getters.memberText + '已过期');
            if (this.syncStore) {
                this.requsetMemberInfo(item.member_id);
                this.$root.$emit('tableUpdateMember', item);
                if (!this.showCardWrap) {
                    this.$emit('handleCloseMember');
                }
                return
            }
            if (this.syncSelectedClose) {
                this.dialogVisible = 'close';
                this.memberListStatus = true;
                this.memberRecordsStatus = false;
                this.recordsContentStatus = false;
            }
            this.$emit('selectMember', item);
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
            this.getOrderInfo();
        },
        handleJump(scope) {                                         // 打开消费记录详情
            this.recordsContent = scope;
            this.recordsContentStatus = true;
            this.memberRecordsStatus = false;
        },


        handleSubtract(item, data) {
            if (data.number === 0) return;
            item.currTimes = item.currTimes - 1;
            data.number = data.number - 1;
        },
        handleAdd(item, data) {
            if (item.sv_package_type === 1 && item.currTimes >= item.available_usage) return this.$message.warning('次卡可用次数上限');
            if (data.number >= data.sv_mcc_leftcount) return;
            item.currTimes = item.currTimes + 1;
            data.number = data.number + 1;
        },
        handleShowNumberChange(data, index, pos) {
            if (data.sv_mcc_leftcount < 1) return;
            this.numberChangeStatus = true;
            this.currentChangeNumberObj = {
                index: index,
                pos: pos,
                currentNumber: data.number || 1
            }
        },
        handleNumberChange(e) {                                  // 修改商品数量点击确定回调
            const { index, pos } = this.currentChangeNumberObj;
            const item = this.memberInfo.cardPackageList[index];
            const subItem = item.list[pos];
            if (item.sv_package_type === 1 && item.currTimes >= item.available_usage) return this.$message.warning('次卡可用次数上限');
            if (parseInt(e) > subItem.sv_mcc_leftcount) {
                subItem.number = subItem.sv_mcc_leftcount
                this.$message.warning('超过次数上限');
            } else {
                subItem.number = parseInt(e);
                item.currTimes = item.currTimes + subItem.number;
            }
        },
        handleMemberCardSure() {                                    // 次卡确定
            // let dataList = this.cardListContentList.filter(e => e.number > 0);
            let dataList = [];
            this.cardListContentList.forEach(e => {
                if (e.number > 0) {
                    e.sv_mcc_leftcount = e.sv_mcc_leftcount - e.number;
                    dataList.push(e)
                }
            })
            this.memberListStatus = false;
            this.memberCardStatus = false;
            this.update({
                key: 'memberInfo',
                data: {
                    ...this.memberInfo,
                    sv_wallet_id: this.currentId
                }
            });
            this.$root.$emit('setStoreCard');
            if (dataList.length > 0 && this.$route.path === '/cashier/cashierRoom') {
                this.$root.$emit('showCatting');
            }
            this.$emit('handleCloseMember', dataList);
        },
        handleAddType() {
            const dataText = {
                phone: '手机号',
                name: '会员姓名',
                cardNo: '会员卡号',
            }
            let newType = this.$app.isPhoneNumber(this.queryMembers.sectkey) ? 'phone' : this.$app.containsChinese(this.queryMembers.sectkey) ? 'name' : 'cardNo';
            return {
                newType: newType,
                text: dataText[newType]
            }
        },
        handleMemberAddTipsSure() {                                 // 新增会员跳转
            this.closeDialog();
            this.$emit('handleLeavePage');
            let newType = this.handleAddType().newType;
            if (this.$route.path.indexOf('/cashier') > -1) {
                let permissionItem = this.CashierManage.Add_Members || { enabled: true };
                if (!permissionItem.enabled) return this.$message.warning(permissionItem.tips || '无权限')
                this.$root.$emit('showMemberAdd', { newType, val: this.queryMembers.sectkey });
            } else {
                this.$router.push((this.is_education ? '/student/studentAdd?type=new&newType=' + newType + 'val=' : '/memberCenter/memberEntryAdd?newType=' + newType + '&val=') + this.queryMembers.sectkey)
            }
        },
    }
};
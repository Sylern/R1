import utils from '@/utils/utils';
import { stockApi } from '@/api/index.js';
import { mapMutations, mapState } from 'vuex';
import { delay } from '@/components/index';
import headScan from '../../base/headScan/headScan.vue';
import guiderSelect from '../../base/guiderSelect/guiderSelect.vue';
import numberChange from '../../base/numberChange/numberChange.vue';
const { debounce, throttle } = utils;
export default {
    name: 'cardConsumption',
    components: { delay, headScan, guiderSelect, numberChange },
    data() {
        return {
            isSubmitting: false,                                // 正在提交
            selectedId: '',
            memberListStatus: true,                             // 用户列表弹窗
            memberRecordsStatus: false,                         // 用户消费记录弹窗
            recordsContentStatus: false,                        // 用户消费详情弹窗
            numberChangeStatus: false,                          // 弹窗修改次数
            currentChangeNumberObj: {
                index: -1,
                pos: -1,
                currentNumber: 1
            },
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
                allstore: -1,
                sectkey: '',
                ShopId: -1,
                Page: 1,
                PageSize: 20
            },
            memberList: [],
            listTotalPage: 0,
            selectedMemberInfo: {
                member_id: ''
            },
            checkPrint: true,
            delayStatus: false,                                 // 延期弹窗状态
            guiderSelectStatus: false,                          // 销售员弹窗状态
            guiderList: [],
            currentDelayItem: {
                validity_date: ''
            },
            isValidity: 0,                                      // 0:未过期;1:已过期;-1全部
            packageInfo: [],
            showResultList: false,                              // 扣次记录列表打开
            total: 0,
            query: {
                page: 1,
                pageSize: 20,                                   // 每页条数
            },
            resultList: []
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction', 'printTemplate']),
    },
    mounted() {
        this.$refs.inputNumber.focus();
        window.addEventListener('scroll', this.pageNextThrottle, true);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.pageNextThrottle, true);
    },
    methods: {
        ...mapMutations(['update']),
        handleHeadScanShow() {
            this.memberListStatus = false;
        },
        handleHeadScanCanel() {
            this.memberListStatus = true;
        },
        handleHeadScanSure(headScanMemberInfo) {
            this.getCardSetmealProductInfo(headScanMemberInfo);
            this.guiderList = [];
        },
        clearInputNumber() {                                        // 清除输入内容
            this.queryMembers.sectkey = '';
        },
        handleSelectAll() {
            // this.initQueryData();
            this.getMemberList(false);
        },
        calculateInput(_str) {                                      // 计算输入框的值
            if (_str == 'Del') return this.deleteInput();
            if (_str == 'C') return this.clearInputNumber();
            this.queryMembers.sectkey = this.queryMembers.sectkey + _str;
            this.queryMembers.sectkey = this.$app.verifyNumber(this.queryMembers.sectkey);
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
        getUserHeadImgUrl(item) {
            return item.sv_mr_headimg.indexOf('http') > -1 ? item.sv_mr_headimg : stockApi.imgBase() + item.sv_mr_headimg
        },
        handleMember(item) {                                        // 当前选择会员
            this.isValidity = 0;
            this.getCardSetmealProductInfo(item);
            this.guiderList = [];
        },
        handleBack() {
            this.showResultList = false;
            this.selectedMemberInfo = {
                member_id: ''
            }
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            if (!this.showMemberList) return;
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && this.queryMembers.Page < this.listTotalPage) {
                this.queryMembers.Page++;
                this.getMemberList(false);
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getMemberList(needKey = true) {                             // 查询会员列表
            if (needKey && this.$app.isNull(this.queryMembers.sectkey)) return this.$message.warning('请输入会员卡号或手机号')
            stockApi.getMemberList(this.queryMembers).then(res => {
                if (res) {
                    if (this.queryMembers.Page === 1) {
                        this.memberList = [];
                    }
                    if (!this.$app.isNull(res.list)) {
                        this.memberList = this.memberList.concat(res.list);
                        this.$nextTick(e => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                        })
                    }
                    this.listTotalPage = res.total;
                    if (this.memberList.length === 0) {
                        return this.$message.warning('未查到相关会员')
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
            });
        },
        handleDelay(item) {
            this.delayStatus = true;
            this.currentDelayItem = JSON.parse(JSON.stringify(item));
        },
        handleDelayBack(date) {
            let query = {
                member_id: this.currentDelayItem.member_id,
                product_id: this.currentDelayItem.product_id,
                user_id: this.userInfo.user_id,
                userecord_id: this.currentDelayItem.userecord_id,
                validity_date: date
            }
            stockApi.delayedRechargeTime(query).then(res => {
                this.$message.success('延期成功')
                this.getCardSetmealProductInfo({ member_id: this.currentDelayItem.member_id });
            })
        },
        handleValidity(item, val) {
            item.showValidity = val;
            this.$nextTick(() => {
                this.$refs.cardList && this.$refs.cardList.update();
            })
        },
        getGuiderSelected(array) {
            this.guiderList = array;
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
            const item = this.packageInfo[index];
            const subItem = item.list[pos];
            if (item.sv_package_type === 1 && item.currTimes >= item.available_usage) return this.$message.warning('次卡可用次数上限');
            if (parseInt(e) > subItem.sv_mcc_leftcount){
                subItem.number = subItem.sv_mcc_leftcount
                this.$message.warning('超过次数上限');
            } else {
                subItem.number = parseInt(e);
                item.currTimes = item.currTimes + subItem.number;
            }
        },
        handleSubmit() {
            if (this.isSubmitting) return;
            if (this.cashierJurisdiction.SelectCommissionRequired && this.guiderList.length < 1) {
                this.$nextTick(() => {
                    this.guiderSelectStatus = true;
                })
                return
            }
            let cardList = [], totalNumber = 0;
            let commissions = [];
            this.guiderList.forEach((e, i) => {
                const itemPercent = this.guiderList.length === 1 ? 100 : parseInt(100 / this.guiderList.length)
                commissions.push({
                    employeeId: e.id,
                    assign: false,
                    percent: i !== this.guiderList.length - 1 ? itemPercent : (100 - itemPercent * (this.guiderList.length - 1)),
                    sex: 0
                })
            })
            this.packageInfo.forEach(e => {
                e.list.forEach(k => {
                    if (k.number > 0) {
                        let item = {
                            userecord_id: k.userecord_id,
                            product_id: k.product_id,
                            sv_p_name: k.sv_p_name,
                            sv_mcc_leftcount: k.sv_mcc_leftcount,
                            sv_charge_type: k.sv_charge_type,           // 套餐或者单次扣 0单次  1套餐
                            sv_serialnumber: k.sv_serialnumber,         // 次卡套餐流水
                            product_num: k.number,
                            commissions,                                // 开单人 提成人id
                            validity_date: k.validity_date
                            // type: true
                        };
                        totalNumber = totalNumber + k.number;
                        cardList.push(item)
                    }
                })
            });
            if (totalNumber < 1) return;
            let query = {
                order_payment: '计次卡',
                order_payment2: '待收',
                sv_source_type: 100,
                prlist: cardList,
                user_cardno: this.selectedMemberInfo.member_id
            }
            this.isSubmitting = true;
            stockApi.memberCardOrder(query).then(res => {
                this.isSubmitting = false;
                if (res) {
                    var json = this.$app.isJson(res) && JSON.parse(res);
                    this.$message.success('扣次成功');
                    this.clearInputNumber();
                    let printData = {
                        shopName: this.userInfo.sv_us_name,
                        orderId: json.order_id,
                        orderTime: this.$app.currentTime(new Date(json.order_datetime), 'yyyy-MM-dd HH:mm:ss'),
                        operator_name: this.guiderList.map(e => e.name).join('、'),
                        dataList: cardList,
                        memberInfo: this.selectedMemberInfo,
                        shopPhone: this.userInfo.sv_us_phone,
                        shopAddress: this.userInfo.sv_us_address
                    }
                    this.handleBack();
                    if (this.checkPrint) this.handlePrint(printData);
                } else {
                    this.$message.success('扣次失败：' + res.msg);
                }
            }).catch(err => {
                this.isSubmitting = false;
            });
        },
        handlePrint(printData) {
            let printDataList = [];
            let dataArray1 = [
                {
                    type: 'line',
                    text: printData.shopName,
                    size: 17,
                    lineHeight: 30,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '扣次结账单',
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '单号：' + printData.orderId
                },
                {
                    type: 'line',
                    text: '时间：' + printData.orderTime
                },
                {
                    type: 'line',
                    text: '操作员：' + printData.operator_name,
                    bottomLine: false
                }
            ]
            // 合并打印数组-第一部分
            printDataList = printDataList.concat(dataArray1);
            let tableData = {
                header: ['项目', '次数/剩', '有效期'],
                list: [],
                footer: []
            }
            let buyNumber = 0;
            tableData.list = printData.dataList.map(e => {
                buyNumber += e.product_num;
                let leftcount = e.sv_mcc_leftcount - e.product_num
                return {
                    name: e.sv_p_name,
                    number: e.product_num + '/' + leftcount,
                    time: e.validity_date
                }
            })
            tableData.footer = ['合计', buyNumber + '', ''];
            // 合并打印数组-表格

            let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
            printDataList = printDataList.concat(this.$app.printMemberCardTable(tableData, isDriverType, this.printTemplate.salesData.width));

            printDataList.push(
                {
                    type: 'line',
                    text: '支付方式：会员次卡',
                    bottomLine: true
                }
            )

            let mobileText = printData.memberInfo.sv_mr_mobile.length === 11 ? this.$app.phoneNumberHiding(printData.memberInfo.sv_mr_mobile) : printData.memberInfo.sv_mr_mobile;
            let memberInfo = [
                {
                    type: 'line',
                    text: '会员卡号：' + printData.memberInfo.sv_mr_cardno
                },
                {
                    type: 'line',
                    text: '会员名称：' + printData.memberInfo.sv_mr_name
                },
                {
                    type: 'line',
                    text: '会员电话：' + mobileText
                },
                {
                    type: 'line',
                    text: '储值余额：' + this.$app.moneyFixed(printData.memberInfo.sv_mw_availableamount)
                }
            ]
            printDataList = printDataList.concat(memberInfo);

            let shopInfo = [
                {
                    type: 'line',
                    text: '电话：' + printData.shopPhone
                },
                {
                    type: 'line',
                    text: '地址：' + printData.shopAddress,
                    bottomLine: true
                },
                {
                    type: 'line',
                    text: '',
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '谢谢惠顾，欢迎下次光临！',
                    align: 1,
                    spaceLine: 1
                }
            ]
            printDataList = printDataList.concat(shopInfo);
            // console.log(printDataList);
            // debugger
            this.$print.sales(printDataList);
        },
        showOrderList() {
            this.showResultList = true;
            this.getMemberCardOrderList();
        },
        getMemberCardOrderList() {                              // 获取会员次卡消费记录
            stockApi.getMemberCardOrderList({ id: this.selectedMemberInfo.member_id, ...this.query }).then(res => {
                if (res) {
                    this.total = res.total;
                    this.resultList = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let p_name = this.$app.isNull(e.sv_p_setmeal_name) ? e.sv_p_name : (e.sv_p_name + '(' + e.sv_p_setmeal_name + ')')
                        return {
                            id: e.id,
                            order_running_id: e.order_running_id,
                            sv_order_list_id: e.sv_order_list_id,
                            sv_p_name: p_name,
                            product_num: e.product_num,
                            order_datetime: e.order_datetime
                        }
                    })
                }
            });
        },
        handleCurrentChange(page) {                             // 改变页码
            this.query.page = page;
            this.getMemberCardOrderList();
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.getMemberCardOrderList();
        },
        handleMenu(type) {
            if (this.isValidity === type) return
            this.isValidity = type;
            this.getCardSetmealProductInfo(this.selectedMemberInfo);
        },
        getCardSetmealProductInfo(item) {                       // 获取会员次卡列表
            stockApi.getCardSetmealProductInfo({ MemberId: item.member_id, isValidity: this.isValidity }).then(res => {
                if (res) {
                    this.packageInfo = this.$app.isNull(res) ? [] : res.map(e => {
                        let list = JSON.parse(e.combination_new).map(k => {
                            let number = k.sv_mcc_leftcount > 0 ? 0 : (k.sv_package_type === 1 ? 0 : null);          // 可选套餐默认0
                            return {
                                ...k,
                                sv_mcc_leftcount: k.sv_package_detailed_type === 1 ? e.available_usage : k.sv_mcc_leftcount,
                                number: number
                            }
                        })
                        return {
                            ...e,
                            list: list.filter(e => !e.getvalidity),
                            validityList: list.filter(e => e.getvalidity),
                            currTimes: 0,
                            showValidity: false,
                            validity_date: this.$app.currentTime(new Date(e.setmeal_validity_date), 'yyyy-MM-dd')
                        }
                    })
                    if (this.packageInfo.length === 0 && this.isValidity === 0) return this.$message.warning('该会员没有可用次卡');
                    this.checkPrint = this.cashierJurisdiction.printEnable;
                    this.selectedMemberInfo = item;
                    this.showMemberList = false;
                }
            });
        },
    }
}
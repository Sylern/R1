import utils from '@/utils/utils';
import { stockApi } from '@/api/index.js';
import { mapMutations, mapState } from 'vuex';
import numberChange from '../../base/numberChange/numberChange.vue';
const { debounce, throttle } = utils;
export default {
    name: 'deposit',
    components: { numberChange },
    data() {
        return {
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
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            isSubmitting: false,                                // 正在提交
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
            packageInfo: [],
            memberListStatus: true,                             // 用户列表弹窗
            depositOrderStatus: false,                          // 三天内订单弹窗
            currentOrderInfo: {                                 // 当前订单信息
                order_id: '',
                user_id: ''
            },
            currentOrderStatus: true,                           // 当前订单是否是跨店寄存商品
            queryOrder: {
                member_id: '',
                keywards: '',
                startdate: '',
                enddate: '',
                page: 1,
                pagesize: 10
            },
            orderTotal: 0,                                      // 订单总数
            orderList: [],                                      // 订单列表
            checkDepositAll: false,                             // 勾选全部寄存
            isOnDeposit: false,                                 // 是否在操作寄存
            queryDepositGoods: {                                // 查询寄存商品条件
                member_id: '',
                keywards: '',
                page: 1,
                pagesize: 10
            },
            numberChangeStatus: false,                          // 修改寄存商品数量
            numberChangeValue: '',                              // 传入修改数量
            currentItem: {
                sv_pricing_method: 0,
                depositNumber: 1,
            },
            depositGoodsTotal: 0,                               // 寄存商品总数
            depositGoodsList: [],                               // 寄存商品列表
            depositOrderList: [],                               // 待寄存订单商品列表
            showDepositRecord: false,                           // 寄存记录列表打开
            queryRecord: {                                      // 查询寄存记录条件
                member_id: '',
                keywards: '',
                page: 1,
                pagesize: 20
            },
            depositRecordTotal: 0,                              // 寄存记录条数
            depositRecordList: [],                              // 寄存记录列表
        }
    },
    watch: {
        checkDepositAll: {
            handler(newVal, oldVal) {
                this.depositOrderList = this.depositOrderList.map(e => {
                    return {
                        ...e,
                        depositNumber: newVal ? e.surplus_deposit_num : 0
                    }
                })
            }
        }
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction', 'printTemplate']),
        dateTime() {
            return [this.queryOrder.startdate, this.queryOrder.enddate]
        }
    },
    mounted() {
        const memberInfo = this.$app.getLocalStorage("memberInfo")
        if (memberInfo) {
            this.selectedMemberInfo = memberInfo
            this.getDepositOutPartsInfo();
            
        } else {
            this.$refs.inputNumber.focus();
        }
        window.addEventListener('scroll', this.pageNextThrottle, true);
    },
    beforeDestroy() {
        this.$app.deleteLocalStorage("memberInfo")
        window.removeEventListener('scroll', this.pageNextThrottle, true);
    },
    methods: {
        ...mapMutations(['update']),
        clearInputNumber() {                                    // 清除输入内容
            this.queryMembers.sectkey = '';
        },
        handleSelectAll() {                                     // 会员点击全部
            this.handleBack();
            this.queryMembers.Page = 1;
            this.queryMembers.PageSize = 20;
            this.memberList = [];
            this.getMemberList();
        },
        handleInputeearch() {
            this.queryMembers.Page = 1;
            this.queryMembers.PageSize = 20;
            this.memberList = [];
            this.getMemberList();
        },
        calculateInput(_str) {                                  // 计算输入框的值
            if (_str == 'Del') return this.deleteInput();
            if (_str == 'C') return this.clearInputNumber();
            if (_str != '0' && _str != '.') {
                if (parseFloat(this.queryMembers.sectkey) > 0 || this.queryMembers.sectkey.length > 1) {
                    // example   1:'1.'   2:'0.'
                    this.queryMembers.sectkey = this.queryMembers.sectkey + _str;
                } else {
                    this.queryMembers.sectkey = _str;
                }
            } else {
                if (_str == '0') {
                    this.queryMembers.sectkey = this.queryMembers.sectkey === '0' ? '0' : this.queryMembers.sectkey + _str;
                } else {
                    if (!this.onlyNumber) this.queryMembers.sectkey = this.queryMembers.sectkey + _str;
                }
            }
            this.queryMembers.sectkey = this.$app.verifyNumber(this.queryMembers.sectkey);
        },
        deleteInput() {                                         // 输入框从后删除一格
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
        handleSure() {                                          // 确定按钮点击事件
            this.getMemberList();
        },
        getUserHeadImgUrl(item) {
            return item.sv_mr_headimg.indexOf('http') > -1 || item.sv_mr_headimg.indexOf("//") == 0 ? item.sv_mr_headimg : stockApi.imgBase() + item.sv_mr_headimg
        },
        handleMember(item) {                                    // 当前选择会员
            this.queryMembers.sectkey = '';
            this.selectedMemberInfo = item;
            this.isOnDeposit = false;
            this.getDepositOutPartsInfo();
        },
        handleBack() {
            this.showDepositRecord = false;
            this.checkPrint = true;
            this.showMemberList = false;
            this.memberList = [];
            this.selectedMemberInfo = {
                member_id: ''
            }
        },
        handleScroll() {                                        // 定点列表滚动监听事件
            if (!this.showMemberList) return;
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && this.queryMembers.Page < this.listTotalPage) {
                this.queryMembers.Page++;
                this.getMemberList();
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),        // 节流翻页
        getMemberList() {                                       // 查询会员列表
            // if (this.$app.isNull(this.queryMembers.sectkey)) return this.$message.warning('请输入会员卡号或手机号')
            stockApi.getMemberList(this.queryMembers).then(res => {
                if (res) {
                    if (this.queryMembers.Page === 1) {
                        this.memberList = [];
                    }
                    if (!this.$app.isNull(res.list)) {
                        this.memberList = this.memberList.concat(res.list);
                        !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                    }
                    this.listTotalPage = res.total;
                    if (this.memberList.length === 0) {
                        return this.$message.warning('未查到相关会员')
                    }
                    if (this.memberList.length === 1) {
                        this.handleMember(this.memberList[0]);
                        return
                    } else {
                        this.showMemberList = true;
                        this.selectedMemberInfo = {
                            member_id: ''
                        }
                    }
                    if (this.memberList.length > 1) {
                        this.showMemberList = true;
                        return
                    }
                }
            });
        },
        handleNumberChange(val) {
            this.currentItem.depositNumber = parseFloat(val);
            if (this.isOnDeposit) {
                // 取件列表
                let index = this.depositOrderList.findIndex(e => e.order_product_id === this.currentItem.order_product_id);
                index > -1 && this.$set(this.depositOrderList, index, this.currentItem);
            } else {
                // 寄件列表
                let index = this.depositGoodsList.findIndex(e => e.deposit_id === this.currentItem.deposit_id);
                index > -1 && this.$set(this.depositGoodsList, index, this.currentItem)
            }
        },
        onDepositNum(item) {
            this.numberChangeStatus = true;
            this.numberChangeValue = item.depositNumber;
            this.currentItem = item;
        },
        onDepositSubtract(item, index) {                        // 可寄存数量-减
            if (item.depositNumber < 1) {
                if (item.sv_pricing_method === 1) {
                    item.depositNumber = 0;
                    this.orderList[index].depositNumber = 0;
                }
                return
            };
            item.depositNumber = this.$app.subtractNumber(item.depositNumber, 1);
            // this.depositOrderList[index].depositNumber = this.$app.subtractNumber(this.depositOrderList[index].depositNumber, 1);
            this.depositOrderList[index].depositNumber = item.depositNumber;
        },
        onDepositAdd(item, index) {                             // 可寄存数量-加
            if (item.depositNumber > item.surplus_deposit_num - 1) {
                if (item.sv_pricing_method === 1) {
                    item.depositNumber = item.surplus_deposit_num;
                    this.depositOrderList[index].depositNumber = item.surplus_deposit_num;
                } else {
                    return this.$message.warning('可寄存数量不足')
                }
                return
            };
            item.depositNumber = this.$app.addNumber(item.depositNumber, 1);
            // this.depositOrderList[index].depositNumber = this.$app.addNumber(this.depositOrderList[index].depositNumber, 1);
            this.depositOrderList[index].depositNumber = item.depositNumber;
        },
        onDepositDate(item) {
            item.validityDate = this.$app.currentTime(item.validityDate, 'yyyy-MM-dd') + ' 23:59:59'
            this.$set(this.depositOrderList, item.index, item)
        },
        hasDepositNumber(item) {
            if (item.sv_is_cross_store_order) return this.$message.warning('跨店寄存，不支持取件');
            this.numberChangeStatus = true;
            this.numberChangeValue = item.depositNumber;
            this.currentItem = item;
        },
        hasDepositSubtract(item, index) {                       // 待取件数量-减
            if (this.depositGoodsList[index].depositNumber === 0) return
            if (item.depositNumber < 1 && item.sv_pricing_method === 1) {
                item.depositNumber = 0;
                this.orderList[index].depositNumber = 0;
            } else {
                item.depositNumber = this.$app.subtractNumber(item.depositNumber, 1);
                // this.depositGoodsList[index].depositNumber = this.$app.subtractNumber(this.depositGoodsList[index].depositNumber, 1);
                this.depositGoodsList[index].depositNumber = item.depositNumber;
            }
            this.depositGoodsList[index].rowChecked = item.depositNumber === 0 ? false : true;
        },
        hasDepositAdd(item, index) {                            // 待取件数量-加
            if (item.sv_is_cross_store_order) return this.$message.warning('跨店寄存，不支持取件');
            if (item.deposit_state !== 1) return this.$message.warning('已过期，不允许取件');
            if (item.depositNumber > item.deposit_surplus_amounts - 1) {
                if (item.sv_pricing_method === 1) {
                    item.depositNumber = item.deposit_surplus_amounts;
                    this.depositGoodsList[index].depositNumber = item.deposit_surplus_amounts;
                }
                return
            };
            item.depositNumber = this.$app.addNumber(item.depositNumber, 1);
            this.depositGoodsList[index].depositNumber = item.depositNumber;
            this.depositGoodsList[index].rowChecked = item.depositNumber === 0 ? false : true;
        },
        orderCurrentChange(page) {                              // 订单列表改变页码
            this.queryOrder.page = page;
            this.getDepositOrderInfo();
        },
        orderSizeChange(pageSize) {                             // 订单列表改变条数
            this.queryOrder.pageSize = pageSize;
            this.getDepositOrderInfo();
        },
        recordCurrentChange(page) {                             // 寄存记录列表改变页码
            this.queryRecord.page = page;
            this.getDepositRecordInfo();
        },
        recordSizeChange(pageSize) {                            // 寄存记录列表改变条数
            this.queryRecord.pageSize = pageSize;
            this.getDepositRecordInfo();
        },
        depositGoodsCurrentChange(page) {                       // 寄存商品列表改变页码
            this.queryDepositGoods.page = page;
            this.getDepositOutPartsInfo();
        },
        depositGoodsSizeChange(pageSize) {                      // 寄存商品列表改变条数
            this.queryDepositGoods.pageSize = pageSize;
            this.getDepositOutPartsInfo();
        },
        handleOrderItem(item) {                                 // 选择订单
            if (item.sv_is_cross_store_order) return this.$message.warning('跨店订单不支持寄存')
            let query = {
                sv_order_list_id: item.order_id,
                user_id: item.user_id,
                member_id: this.selectedMemberInfo.member_id
            }
            stockApi.getDepositInfo(query).then(res => {
                if (res) {
                    this.isOnDeposit = true;
                    this.depositOrderStatus = false;
                    this.checkDepositAll = false;
                    this.currentOrderInfo = {
                        order_id: item.order_id,
                        user_id: item.user_id
                    }
                    this.depositOrderList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                        let now = new Date();
                        let year = now.getFullYear() + 10;
                        now.setFullYear(year);
                        // let validity_date = this.$app.currentTime(new Date(now.getTime() + 3600 * 24 * 7 * 1000), 'yyyy-MM-dd');
                        let validity_date = this.$app.currentTime(new Date(now), 'yyyy-MM-dd HH:mm:ss')
                        return {
                            ...e,
                            depositNumber: 0,
                            validityDate: e.surplus_deposit_num > 0 ? validity_date : '',
                            remark: ''
                        }
                    });
                    this.$nextTick(() => {
                        this.$refs.onDepositTable.onReset()
                    })
                }
            });
        },
        handleRemark(index, text) {
            this.$prompt('请输入备注', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: text || '',
                inputErrorMessage: '请输入备注'
            }).then(({ value }) => {
                this.depositOrderList[index].remark = value;
            }).catch(e => {

            });
        },
        showDepositOrder() {                                    // 寄存/取件
            if (this.isOnDeposit) {
                this.isOnDeposit = false;
                this.$nextTick(() => {
                    this.$refs.hasDepositTable.onReset();
                })
            } else {
                this.depositOrderStatus = true;
                let now = new Date();
                this.queryOrder = {
                    member_id: '',
                    keywards: '',
                    startdate: new Date(now.getTime() - 7 * 24 * 3600 * 1000),
                    enddate: now,
                    page: 1,
                    pagesize: 10
                }
                this.getDepositOrderInfo();
            }
        },
        showReocodeList() {                                     // 打开寄存记录
            this.showDepositRecord = true;
            this.getDepositRecordInfo();
        },
        searchRecordInfo() {                                    // 查询寄存记录条件
            this.queryRecord.page = 1;
            this.queryRecord.pagesize = 10;
            this.getDepositRecordInfo();
        },
        handleTimeDelay(item) {                                 // 寄存商品延期
            if (item.validity_date === item.showValidity_date) return this.$refs['delayPop_' + item.index].doClose();
            if (this.$app.isNull(item.validity_date)) return this.$message.warning('请选择日期')
            let query = {
                sv_delay_date: this.$app.currentTime(item.validity_date, 'yyyy-MM-dd HH:mm:ss'),
                deposit_id: item.deposit_id,

                deposit_order_id: item.deposit_order_id,
                member_id: item.member_id,
                product_id: item.product_id,
                user_id: item.user_id,
                sv_order_list_id: item.sv_order_list_id,
                sv_source: 400
            }
            stockApi.delayDepositProduct(query).then(res => {
                this.getDepositOutPartsInfo();
                this.$message.success('操作成功');
                this.$refs['delayPop_' + item.index].doClose();
            });
        },
        getDepositRecordInfo() {                                // 获取会员寄存记录
            this.queryRecord.member_id = this.selectedMemberInfo.member_id;
            stockApi.getDepositRecordInfo(this.queryRecord).then(res => {
                if (res) {
                    this.depositRecordTotal = res.total;
                    this.depositRecordList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                        let sv_creation_date = this.$app.currentTime(new Date(e.sv_creation_date), 'yyyy-MM-dd HH:mm:ss')
                        return {
                            ...e,
                            sv_creation_date,
                            // id: e.id,
                            // order_running_id: e.order_running_id,
                            // sv_order_list_id: e.sv_order_list_id,
                            // sv_p_name: p_name,
                            // product_num: e.product_num,
                            // order_datetime: e.order_datetime
                        }
                    })
                }
            });
        },
        getDepositOutPartsInfo() {                              // 获取会员寄存商品
            this.queryDepositGoods.member_id = this.selectedMemberInfo.member_id;
            stockApi.getDepositOutPartsInfo(this.queryDepositGoods).then(res => {
                if (res) {
                    this.showMemberList = false;
                    this.depositGoodsTotal = res.total;
                    this.currentOrderStatus = res.values;
                    this.depositGoodsList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                        return {
                            ...e,
                            id: e.deposit_id,
                            rowChecked: false,
                            depositNumber: 0,
                            showValidity_date: this.$app.currentTime(new Date(e.validity_date), 'yyyy-MM-dd HH:mm:ss'),
                            validity_date: this.$app.currentTime(new Date(e.validity_date), 'yyyy-MM-dd HH:mm:ss')
                        }
                    })
                    this.$nextTick(() => {
                        this.$refs.hasDepositTable.onReset();
                    })
                }
            });
        },
        handleChangeTime(date) {
            this.queryOrder.startdate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryOrder.enddate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.handleSearchOrder();
        },
        handleSearchOrder() {                                   // 订单搜索
            this.queryOrder.page = 1;
            this.queryOrder.pagesize = 10;
            this.getDepositOrderInfo();
        },
        getDepositOrderInfo() {                                 // 获取会员订单
            this.queryOrder.member_id = this.selectedMemberInfo.member_id;
            stockApi.getDepositOrderInfo(this.queryOrder).then(res => {
                if (res) {
                    this.orderTotal = res.total;
                    this.orderList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                        return {
                            ...e,
                            order_datetime: this.$app.currentTime(new Date(e.order_datetime), 'yyyy-MM-dd HH:mm:ss')
                        }
                    });
                }
            });
        },
        selectDepositAll() {
            this.depositOrderList = this.depositOrderList.map(e => {
                return {
                    ...e,
                    depositNumber: e.surplus_deposit_num
                }
            })
        },
        handleDeposit() {                                       // 提交寄存
            // let res = {"deposit_shop_name":"餐饮演示系统","deposit_receipt_name":"寄存小票","sv_mr_name":"KODI","sv_mr_cardno":"128801647","sv_mr_mobile":"133****9110","total_deposit_t_num":1.0,"total_deposit_surplus_num":1.0,"operationName":"LIN","printdate":"2022-02-28T14:12:14.0493137+08:00","deposit_shop_address":"富力广场","receipt_detail":[{"sv_p_name":"百香果多多","sv_p_barcode":"102","deposit_t_num":1.0,"deposit_surplus_num":1.0,"deposit_num":1.0,"sv_remark":"123百香果多多备注123百香果多多备注123百香果多多备注"}]}
            // let printData = {
            //     shopName: res.deposit_shop_name,
            //     shopAddress: res.deposit_shop_address,
            //     shopName: res.deposit_shop_name,
            //     title: res.deposit_receipt_name,
            //     submitTime: this.$app.currentTime(new Date(res.printdate), 'yyyy-MM-dd HH:mm:ss'),
            //     operator_name: res.operationName,
            //     totalNumber: res.total_deposit_t_num,
            //     dataList: res.receipt_detail,
            //     sv_mr_cardno: res.sv_mr_cardno,
            //     sv_mr_name: res.sv_mr_name,
            //     sv_mr_mobile: res.sv_mr_mobile,
            // }
            // this.handlePrint(printData, 1);
            // return
            let dataList = this.depositOrderList.filter(e => e.depositNumber > 0).map(k => {
                return {
                    deposit_id: k.deposit_id,
                    order_product_id: k.order_product_id,
                    deposit_order_id: k.deposit_order_id,
                    product_id: k.product_id,
                    deposit_num: k.depositNumber,
                    deposit_validity_date: k.validityDate,
                    sv_remark: k.remark
                }
            })
            if (dataList.length < 1) return this.$message.warning('请确认你要寄存的商品及寄存数量')
            let query = {
                sv_order_list_id: this.currentOrderInfo.order_id,
                user_id: this.currentOrderInfo.user_id,
                member_id: this.selectedMemberInfo.member_id,
                list: dataList
            }
            stockApi.addOrUpdateDeposit(query).then(res => {
                if (res) {
                    this.$message.success('寄存成功');
                    this.isOnDeposit = false;
                    this.getDepositOutPartsInfo();
                    if (this.checkPrint) {
                        let printData = {
                            shopName: res.deposit_shop_name,
                            shopAddress: res.deposit_shop_address,
                            shopName: res.deposit_shop_name,
                            title: res.deposit_receipt_name,
                            submitTime: this.$app.currentTime(new Date(res.printdate), 'yyyy-MM-dd HH:mm:ss'),
                            operator_name: res.operationName,
                            totalNumber: res.total_deposit_t_num,
                            dataList: res.receipt_detail,
                            sv_mr_cardno: res.sv_mr_cardno,
                            sv_mr_name: res.sv_mr_name,
                            sv_mr_mobile: res.sv_mr_mobile,
                        }
                        this.handlePrint(printData, 1);
                    }
                }
            });
        },
        handleDepositGoodsAll(data, checkedBool) {
            this.depositGoodsList = this.depositGoodsList.map(e => {
                return {
                    ...e,
                    rowChecked: checkedBool ? true : false,
                    depositNumber: checkedBool ? e.deposit_surplus_amounts : 0
                }
            })
        },
        handleDepositGoods(row, data, checkedBool) {
            let item = this.depositGoodsList.find(e => e.id === row.id);
            if (item.id) {
                item.rowChecked = checkedBool ? true : false,
                    item.depositNumber = checkedBool ? item.deposit_surplus_amounts : 0;
            }
        },
        handleTakeDeposit() {                                   // 提交取件
            let dataList = this.depositGoodsList.filter(e => e.depositNumber > 0).map(k => {
                return {
                    deposit_order_id: k.deposit_order_id,
                    sv_order_list_id: k.sv_order_list_id,
                    deposit_id: k.deposit_id,
                    order_product_id: k.order_product_id,
                    product_id: k.product_id,
                    user_id: k.user_id,
                    deposit_num: k.depositNumber
                }
            })
            if (dataList.length < 1) return this.$message.warning('请确认你要取件的商品及寄存数量')
            let query = {
                member_id: this.selectedMemberInfo.member_id,
                list: dataList
            }
            stockApi.takeDepositInfo(query).then(res => {
                if (res) {
                    this.$message.success('取件成功');
                    this.getDepositOutPartsInfo();
                    if (this.checkPrint) {
                        let printData = {
                            shopName: res.deposit_shop_name,
                            shopAddress: res.deposit_shop_address,
                            shopName: res.deposit_shop_name,
                            title: res.deposit_receipt_name,
                            submitTime: this.$app.currentTime(new Date(res.printdate), 'yyyy-MM-dd HH:mm:ss'),
                            operator_name: res.operationName,
                            totalNumber: res.total_deposit_t_num,
                            dataList: res.receipt_detail,
                            sv_mr_cardno: res.sv_mr_cardno,
                            sv_mr_name: res.sv_mr_name,
                            sv_mr_mobile: res.sv_mr_mobile,
                        }
                        this.handlePrint(printData, 2);
                    }
                }
            });
        },
        handlePrint(printData, type = 1) {
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
                    text: printData.title,
                    align: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '时间：' + printData.submitTime
                },
                {
                    type: 'line',
                    text: '操作员：' + printData.operator_name,
                    bottomLine: true
                }
            ]
            // 合并打印数组-第一部分
            printDataList = printDataList.concat(dataArray1);
            let tableData = {
                header: ['商品', '编码', '数量'],
                list: [],
                footer: []
            }
            tableData.list = printData.dataList.map(e => {
                return {
                    name: e.sv_p_name,
                    number: e.deposit_t_num + '',
                    code: e.sv_p_barcode,
                    remark: e.sv_remark
                }
            })
            tableData.footer = ['合计', '', printData.totalNumber + ''];
            // 合并打印数组-表格
            let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
            printDataList = printDataList.concat(this.$app.printDepositTable(tableData, isDriverType, this.printTemplate.salesData.width));
            let memberInfo = [
                {
                    type: 'line',
                    text: '会员卡号：' + printData.sv_mr_cardno
                },
                {
                    type: 'line',
                    text: '会员名称：' + printData.sv_mr_name
                },
                {
                    type: 'line',
                    text: '会员电话：' + printData.sv_mr_mobile
                }
            ]
            printDataList = printDataList.concat(memberInfo);

            let shopInfo = [
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
            // debugger
            this.$print.sales(printDataList);
        },
    }
}
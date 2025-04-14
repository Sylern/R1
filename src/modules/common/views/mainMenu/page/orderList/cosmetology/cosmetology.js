
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState, mapActions } from 'vuex';
import orderWorkstation from '../../../base/orderWorkstation/orderWorkstation.vue';
import goodsReturn from '../../../base/goodsReturn/goodsReturn.vue';
export default {
    name: 'cosmetology',
    components: { orderWorkstation, goodsReturn },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            frontImgBase: base.frontImgBase,
            defaultDate: [],
            salesclerkInfo: [],                         // 员工 - 操作员列表
            paymentList: [],                            // 支付方式
            query: {                                    // 查询实体
                salesclerkid_id: '',                    // 员工id
                payment_method: '',                     // 支付方式
                user_ids: [],                           // 店铺id
                pays: [],                               // 支付方式
                operators: [],                          // 操作员id
                state: -1,                              // 状态 0正常订单 1部分退订单 -1全部
                producttype: -1,                        // 销售类型 0产品 1服务 -1全部
                verify_type: -1,                        // 对账类型 1是 2否 -1全部
                start_time: '',                         // 开始时间
                end_time: '',                           // 结束时间
                keywards: '',                           // 关键词筛选
                pageIndex: 1,                           // 页码
                pageSize: 10,                           // 每页条数
            },
            total: 0,                                   // 订单笔数
            return_num: 0,                              // 换货笔数
            exchange_num: 0,                            // 退货笔数
            order_num: 0,                            // 订单数
            order_money: 0,                             // 销售额
            verifies_money: 0,                          // 对账金额
            producttype: ['商品类型', '服务类型', '计时类型'],
            orderText: ['正常', '部分退货', '整单退', '待付款'],                // 订单状态，0正常，1部分退货，2全退货，3--待付款
            dataJson: [],                               // 表格数据
            currentOrderId: null,                       // 当前订单id
            currentProductId: null,                     // 当前商品id
            currentProductKeyId: null,                  // 当前商品主键id
            currentGroupId: null,                           // 待退货订单group_id
            goodsReturnType: null,                      // 待退货订单sv_sales_return_type
            goodsReturnOrderStatus: null,               // 待退货订单状态
            goodsReturntList: [],                       // 待退货商品列表
            goodsReturnStatus: false,                   // 退货弹窗状态 
            workstationStatus: false,
            workerTextList: ['一', '二', '三', '四'],        // 
            emList: [],
            contentInfo: {
                detail_list: []
            },
            contentInfoVisible: false,
            contentList: []
        }
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction']),
        contentInfoHeadImg() {
            const userImg = this.$app.isNull(this.contentInfo.sv_mr_headimg) ? '' : this.contentInfo.sv_mr_headimg.indexOf('http') > -1 ? this.contentInfo.sv_mr_headimg : (stockApi.imgBase() + this.contentInfo.sv_mr_headimg)
            return this.$app.isNull(this.contentInfo.sv_mr_headimg) ? this.frontImgBase + '/images/cashier/default_user_logo.png' : userImg
        },
        order_discount() {
            if (this.contentInfo.order_discount > 0 && this.contentInfo.order_discount < 1) {
                return this.contentInfo.order_discount
            }
            return false
        },
        member_discount() {
            if (this.contentInfo.sv_member_discount > 0 && this.contentInfo.sv_member_discount < 1) {
                return this.contentInfo.sv_member_discount
            }
            return false
        },
        coupon_discount() {
            if (this.contentInfo.sv_coupon_discount > 0 && this.contentInfo.sv_coupon_discount < 1) {
                return this.contentInfo.sv_coupon_discount
            }
            return false
        },
    },
    watch: {
        isShow: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.query.page = 1;
                    this.postBeautyIndustryBillList();
                }
            }
        }
    },
    beforeMount() {
        const now = new Date();
        const start = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(this.$app.currentTime(now, 'yyyy-MM-dd') + ' 23:59:59');
        this.defaultDate = [start, end];
        this.query.start_time = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
        this.query.end_time = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
    },
    mounted() {
        this.getUserPayment();
        this.getSalesclerkInfo();
        this.getUiGroupingEmployeeList();
    },
    methods: {
        ...mapActions(['getUiGroupingEmployeeList']),
        getSalesclerkInfo() {
            if (this.salesclerkInfo.length > 0) return;
            stockApi.getSalesclerkInfo().then(res => {
                this.salesclerkInfo = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                    return {
                        label: e.sp_salesclerk_name,
                        value: e.sp_salesclerkid
                    }
                })
            })
        },
        getUserPayment() {
            if (this.paymentList.length > 0) return;
            stockApi.getUserPayment().then(res => {
                this.paymentList = this.$app.isNull(res) ? [] : res.map(e => {
                    return {
                        label: e.payment_names,
                        value: e.payment_names
                    }
                })
            })
        },
        handleExport() {
            stockApi.recharge_Excel(this.query).then(res => {
                if (res) {
                    if (!this.$app.isUrl(res)) return this.$message({ message: '无效的url路径', type: 'error' });
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleReGetRechargeInfo() {
            this.query.pageIndex = 1;
            this.postBeautyIndustryBillList(true);
        },
        handleChangeTime(date) {                                // 选择制单日期-设置起止时间
            this.query.start_time = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.end_time = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.pageIndex = 1;
            this.postBeautyIndustryBillList(true);
        },
        handleCurrentChange(pageIndex) {                        // 改变页码
            this.query.pageIndex = pageIndex;
            this.postBeautyIndustryBillList(true);
        },
        handleSizeChange(pageSize) {                            // 改变条数
            this.query.pageSize = pageSize;
            this.postBeautyIndustryBillList(true);
        },
        postBeautyIndustryBillList(load) {                      // 获取列表
            if (this.dataJson.length > 0 && this.$app.isNull(load)) return;
            stockApi.postBeautyIndustryBillList(this.query).then(res => {
                if (res) {
                    this.dataJson = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        return {
                            ...e,
                            mrName: e.sv_mr_cardno ? (e.sv_mr_cardno + '/' + e.sv_mr_name) : '散客',
                            product_total: e.order_money,
                            children: e.detail_list.map(item => {
                                let sv_preferential_data = this.$app.isNull(item.sv_preferential_data) ? [] : JSON.parse(item.sv_preferential_data);
                                return {
                                    ...item,
                                    orderId: e.id,
                                    sv_preferential_data,
                                    sv_preferential_data_text: sv_preferential_data.length > 0 ? sv_preferential_data[0].s : '',
                                    productName: item.product_name + ' x' + item.product_num,
                                    list: (item.list || []).map(em => {
                                        return em.map((emChild, emIndex) => { return { ...emChild, selectedType: 'type' + (emIndex + 1) } })
                                    })
                                }
                            })
                        }
                    });
                    this.total = res.total;
                    this.return_num = res.return_num;
                    this.exchange_num = res.exchange_num;
                    this.order_num = res.order_num;
                    this.order_money = res.order_money;
                    this.verifies_money = res.verifies_money;

                    this.$nextTick(() => {
                        this.$refs.myTable && this.$refs.myTable.onReset();
                    })
                }
            });
        },
        handleVerify(item) {                                    // 开启对账
            const query = {
                user_id: this.userInfo.user_id,
                id: item.id,
                source: 100
            }
            stockApi.orderVerify(query).then(res => {
                this.$message.success('操作对账成功')
                this.postBeautyIndustryBillList(true);
                if (this.contentInfoVisible) this.getDataDetail(item.sv_sales_return_type);
            }).catch(e => {
                item.is_verify = !item.is_verify;
            });
        },
        goodsReturnAction(dataObj) {                            // 订单退货
            let refunds = [];
            if (!dataObj.isAllOrderReturn) {
                refunds = dataObj.goodsList.map(e => {
                    return {
                        orderProductId: e.id,
                        refundNum: e.currentNumber
                    }
                })
            } else {
                dataObj.goodsList = JSON.parse(JSON.stringify(this.goodsReturntList));
            }
            let queryReturn = {
                orderId: this.currentOrderId,
                refundPassword: dataObj.psw,
                notRefund: false,
                remark: dataObj.remarks,
                refunds: dataObj.isAllOrderReturn ? null : refunds      // 整单退货不需要传退货内容
            }
            stockApi.returenSalesNew(queryReturn).then(res => {
                let printList = dataObj.goodsList.map(e => {
                    return {
                        ...e,
                        product_num_bak: -1 * (e.currentNumber || e.product_num),
                        product_total: -1 * (e.currentNumber ? this.$app.multiplyNumber(e.currentNumber, e.product_unitprice) : e.product_total)
                    }
                })
                if (res.refundAction === 1) {
                    // 需要退款
                    this.getReturnRefund(res.refundQueryId, () => {
                        this.$message.success('退货成功');
                        this.handlePrintReturn(printList, '退货单', dataObj.remarks);
                    });
                    // this.query.page = 1;
                }
                if (res.refundAction === 2) {
                    // 不需要退款
                    this.$message.success('退货成功');
                    this.handlePrintReturn(printList, '退货单', dataObj.remarks);
                    this.query.enddate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
                    setTimeout(() => {
                        this.postBeautyIndustryBillList(true);
                        if (this.contentInfoVisible) this.getDataDetail();
                    }, 100)
                }
            });
        },
        getReturnRefund(queryId, callback) {                    // 查询需要退款的订单
            stockApi.getReturnRefund(queryId).then(res => {
                if (res.action === 1) {
                    !!callback && callback();
                    this.query.enddate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
                    setTimeout(() => {
                        this.postBeautyIndustryBillList(true);
                    }, 100)
                }
                if (res.action === 2) {
                    // 继续轮询
                    setTimeout(() => {
                        this.getReturnRefund(queryId, callback);
                    }, 1000)
                    return
                }
                if (res.action === -1) {
                    return this.$message.error('退货失败');
                }
            });
        },
        returenSales(item) {                                    // 整单退货
            this.currentItem = item;
            this.currentOrderId = item.id;
            this.currentGroupId = item.group_id;
            this.goodsReturnType = item.sv_sales_return_type;
            this.goodsReturnOrderStatus = item.order_state;
            this.goodsReturntList = item.detail_list;
            this.goodsReturnStatus = true;
        },
        handleEdit(item) {                                      // 编辑账单
            this.currentOrderId = item.id;
            this.currentGroupId = item.group_id;
            this.getDataDetail(item.sv_sales_return_type);
        },
        getDataDetail(returnType) {
            if (this.$app.isNull(this.currentGroupId)) return
            const query = {
                u_id: this.userInfo.user_id,
                id: this.currentOrderId,
                group_id: this.currentGroupId,
                type: returnType || this.contentInfo.sv_sales_return_type,
            }
            stockApi.getBillDetails(query).then(res => {
                if (res) {
                    this.contentInfo = {
                        ...res,
                        detail_list: this.$app.isNull(res.detail_list) ? [] : res.detail_list.map(e => {
                            return {
                                ...e,
                                orderId: res.id,
                                list: (e.list || []).map(em => {
                                    return em.map((emChild, emIndex) => { return { ...emChild, selectedType: 'type' + (emIndex + 1) } })
                                })
                            }
                        })
                    };
                    this.contentInfoVisible = true;
                    this.$nextTick(() => {
                        this.$refs.myTableContent && this.$refs.myTableContent.onReset();
                    })
                }
            });
        },
        handleRemark(item) {                                    // 备注
            this.$prompt('请输入备注内容', '备注', {
                inputPlaceholder: '请输入备注内容，限100个字',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{0,100}$/,
                inputValue: item.sv_remarks || '',
                inputErrorMessage: '请输入备注内容，限100个字'
            }).then(({ value }) => {
                const query = {
                    u_id: this.userInfo.user_id,
                    id: item.id,
                    group_id: item.group_id,
                    type: item.sv_sales_return_type,
                    remark: value,
                    source: 100,
                }
                stockApi.updateSalesRemark(query).then(res => {
                    this.$message.success('修改备注成功');
                    this.postBeautyIndustryBillList(true);
                    if (this.contentInfoVisible) this.getDataDetail(item.sv_sales_return_type);
                });
            }).catch(e => {

            });
        },
        handleWorkstationShow(item) {                           // 打开多工位选择
            this.currentOrderId = item.orderId;
            this.currentProductId = item.product_id;
            this.currentProductKeyId = item.id;
            this.emList = item.list;
            this.dealMoney = item.product_total;
            this.workstationStatus = true;
        },
        handleWorkstation(list) {                               // 选择 多工位员工
            const query = {
                source: 100,
                user_id: this.userInfo.user_id,
                order_id: this.currentOrderId,
                list: [{
                    id: this.currentProductKeyId,
                    product_id: this.currentProductId,
                    buySetupCommissions: list.map(eList => {
                        return eList.map(em => {
                            return {
                                sex: em.sex,
                                employeeId: em.sv_employee_id,
                                assign: em.assign,
                                percent: em.percent
                            }
                        })
                    })
                }]
            }
            stockApi.updateOrderProductCommission(query).then(res => {
                this.$message.success('修改工位/业绩成功')
                this.postBeautyIndustryBillList(true);
                if (this.contentInfoVisible) this.getDataDetail();
            });
        },
        handlePrintReturn(dataList, title, remark) {
            if (!this.cashierJurisdiction.printEnable) return this.$app.isNull(title) ? this.$message.warning('请去设置—小票机设置，启用打印开关') : '';
            let that = this;
            if (!this.$app.isNull(dataList)) {
                let dataObj = {
                    ...this.currentItem,
                    order_state: 2,
                    list: dataList.map(e => {
                        return {
                            ...e
                        }
                    })
                }
                prePrint(dataObj, remark);
                return
            }
            let query = {
                source: 100,
                id: this.currentOrderId,
                u_id: this.userInfo.user_id,
                group_id: this.currentGroupId,
                type: this.goodsReturnType,
                is_print: true
            }
            stockApi.getCashierInfo(query).then(res => {
                if (res) {
                    if (!this.cashierJurisdiction.printEnable) {
                        if (title === "退货单") {
                            const returnText = res.order_payment !== '储值卡' && res.order_payment2 !== '储值卡' ? '退款成功' : '退款成功，退款金额已原路退回会员卡'
                            this.$message.success(returnText);
                        }
                        return this.$message.warning('请去设置—小票机设置，启用打印开关');
                    } else {
                        prePrint(res, remark);
                    }
                }
            });
            function prePrint(_res, remark) {
                let printGetData = _res;
                let returnTitle = !that.$app.isNull(title) ? title : (printGetData.sv_sales_return_type === 2 ? '退货单' : '补打单');
                let printDataList = [];
                let dataArray1 = [
                    {
                        type: 'line',
                        text: that.userInfo.sv_us_name,
                        size: 17,
                        lineHeight: 30,
                        align: 1,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: returnTitle,
                        align: 1,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: '单号：' + printGetData.order_running_id
                    }
                ]
                if (!that.$app.isNull(printGetData.sv_catering_grade)) {
                    dataArray1.push({
                        type: 'line',
                        text: '房台：' + printGetData.sv_catering_grade
                    })
                }
                const orderPrintTime = that.$app.currentTime(returnTitle === '退货单' ? new Date() : new Date(printGetData.order_datetime), 'yyyy-MM-dd HH:mm:ss');
                let array = [
                    {
                        type: 'line',
                        text: (returnTitle === '退货单' ? '退货时间：' : '销售时间：') + orderPrintTime
                    },
                    {
                        type: 'line',
                        text: '操作员：' + (printGetData.consumeusername || '')
                    }
                ]
                if (printGetData.salesperson) {
                    array.push(
                        {
                            type: 'line',
                            text: '导购员：' + printGetData.salesperson,
                            bottomLine: true
                        }
                    )
                }
                dataArray1 = dataArray1.concat(array);
                // 合并打印数组-第一部分
                printDataList = printDataList.concat(dataArray1);
                let tableData = {
                    header: ['商品/编码', '数量', '单价', '小计'],
                    list: [],
                    totalNumber: 0,
                    totalMoney: 0,
                    footer: []
                }
                tableData.list = printGetData.list.map(e => {
                    let productName = e.product_name + (that.$app.isNull(e.taste_data) ? '' : '[' + e.taste_data + ']');
                    if (!that.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                    let printList = that.$app.isNull(e.combinationPrint) ? [] : e.combinationPrint;
                    let packageGroupsList = [];
                    if (printList.length > 0) {
                        packageGroupsList = printList.map(k => {
                            let subProductName = k.sv_p_name + (that.$app.isNull(k.taste_data) ? '' : '[' + k.taste_data + ']');
                            return {
                                name: subProductName,
                                barCode: k.sv_p_barcode,
                                number: k.product_number + '',
                                price: that.$app.moneyFixed(k.sv_price),
                                couponMoney: 0,
                                total: ''
                            }
                        });
                    }
                    let packageGroups = [{
                        name: '',
                        products: packageGroupsList
                    }]
                    tableData.totalNumber = that.$app.addNumber(tableData.totalNumber, e.record_type === 2 ? e.returned_num : e.product_num_bak);
                    tableData.totalMoney = that.$app.addNumber(tableData.totalMoney, e.product_total);
                    let sv_preferential_data = that.$app.isNull(e.sv_preferential_data) ? [] : e.sv_preferential_data;
                    return {
                        name: packageGroupsList.length > 0 ? '※' + productName : productName,
                        code: e.sv_p_barcode || '',
                        number: (e.record_type === 2 ? e.returned_num : e.product_num_bak) + '',
                        specs: [],
                        tastes: [],
                        chargings: [],
                        packageGroups: packageGroupsList.length > 0 ? packageGroups : null,
                        price: that.$app.moneyFixed(e.product_price),
                        couponMoney: sv_preferential_data.length > 0 ? that.$app.moneyFixed(sv_preferential_data[0].m) : 0,
                        total: that.$app.moneyFixed(e.product_total)
                    }
                })
                tableData.footer = ['合计', tableData.totalNumber + '', '', that.$app.moneyFixed(tableData.totalMoney)];
                let isDriverType = that.$store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
                let tableArray = that.$app.printTableDate(tableData, isDriverType, that.$store.state.printTemplate.salesData.width);
                // 合并打印数组-表格
                printDataList = printDataList.concat(tableArray);
                let payInfo = [];
                if (returnTitle === "退货单") {
                    payInfo = [
                        {
                            type: 'line',
                            text: '退货金额：' + that.$app.moneyFixed(tableData.totalMoney, 2)
                        }
                    ]
                } else {
                    payInfo = [
                        {
                            type: 'line',
                            text: '应收：' + that.$app.moneyFixed(printGetData.sv_order_total_money),
                            spaceTopLine: true
                        },
                        {
                            type: 'line',
                            text: '实收：' + that.$app.moneyFixed(that.$app.addNumber(printGetData.order_money, printGetData.order_money2)),
                        }
                    ]
                    if (!that.$app.isZero(printGetData.order_money2)) {
                        // 支付方式2是否大于0
                        payInfo.push({
                            type: 'line',
                            text: '支付方式：' + printGetData.order_payment,
                        })
                    } else {
                        let order_payment = printGetData.order_payment + '：' + that.$app.moneyFixed(printGetData.order_money) + '   ';
                        order_payment += printGetData.order_payment2 + '：' + that.$app.moneyFixed(printGetData.order_money2);
                        payInfo.push({
                            type: 'line',
                            text: order_payment
                        })
                    }
                }
                printDataList = printDataList.concat(payInfo);

                if (!that.$app.isNull(printGetData.member_id)) {
                    let mobileText = printGetData.sv_mr_mobile.length === 11 ? that.$app.phoneNumberHiding(printGetData.sv_mr_mobile) : printGetData.sv_mr_mobile;
                    let memberInfo = [
                        {
                            type: 'line',
                            text: '会员姓名：' + printGetData.sv_mr_name,
                            topLine: true
                        },
                        {
                            type: 'line',
                            text: '会员卡号：' + printGetData.sv_mr_cardno,
                        },
                        {
                            type: 'line',
                            text: '会员电话：' + mobileText,
                            bottomLine: true
                        }
                    ]
                    printDataList = printDataList.concat(memberInfo);
                }

                let shopInfo = [
                    // {
                    //     type: 'line',
                    //     text: '电话：' + that.userInfo.sv_us_phone
                    // },
                    // {
                    //     type: 'line',
                    //     text: '地址：' + that.userInfo.sv_us_address
                    // },
                    {
                        type: 'line',
                        text: '打印时间：' + that.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
                    },
                    {
                        type: 'line',
                        text: '备注：' + (remark || printGetData.sv_remarks)
                    }
                ]
                printDataList = printDataList.concat(shopInfo);
                that.$print.sales(printDataList);

                if (title === "退货单") {
                    const returnText = printGetData.order_payment !== '储值卡' && printGetData.order_payment2 !== '储值卡' ? '退款成功' : '退款成功，退款金额已原路退回会员卡'
                    that.$message.success(returnText);
                } else {
                    that.$message.success('打印成功');
                }
            };
        },
        handlePrintCustom(item) {
            if (!this.cashierJurisdiction.printEnable) return this.$message.warning('请去设置—小票机设置，启用打印开关');
            if (item.sv_sales_return_type === 2) {
                this.currentOrderId = item.id;
                this.currentGroupId = item.group_id;
                this.goodsReturnType = item.sv_sales_return_type;
                this.handlePrintReturn()
                return
            }
            stockApi.getMemberOrderIntegral({ id: item.id }).then(orderData => {
                let qrCodeList = [];
                let tableList = orderData.plist.map(e => {
                    const packageList = this.$app.isNull(e.combinationGroupPrint) ? [] : e.combinationGroupPrint;
                    let packageGroups = packageList.map(packageItem => {
                        return {
                            id: packageItem.groupId,
                            name: packageItem.groupName,
                            products: packageItem.combinationPrint.map(groupListItem => {
                                let groupProductName = groupListItem.sv_p_name + (this.$app.isNull(groupListItem.taste_data) ? '' : '[' + groupListItem.taste_data + ']');
                                if (!this.$app.isNull(groupListItem.sv_p_specs)) groupProductName += '[' + groupListItem.sv_p_specs + ']';
                                return {
                                    cateringText: groupListItem.taste_data,
                                    productId: groupListItem.product_list_id,
                                    name: groupProductName,
                                    product_name: groupListItem.sv_p_name,
                                    barCode: groupListItem.sv_p_barcode,
                                    number: groupListItem.product_number,
                                    unitName: '',
                                    dealPrice: groupListItem.product_total
                                }
                            })
                        }
                    })
                    let productName = e.product_name + (this.$app.isNull(e.taste_data) ? '' : '[' + e.taste_data + ']');
                    if (!this.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                    return {
                        isPackage: packageList.length > 0,
                        id: e.id,
                        productId: e.product_id,
                        product_name: e.product_name,
                        productName: productName,
                        barCode: e.sv_p_barcode,
                        unitName: e.sv_p_unit,
                        number: e.product_num_bak,
                        price: e.product_price,
                        dealMoney: e.product_total,
                        cateringText: e.taste_data,
                        productCouponMoney: this.$app.multiplyNumber(this.$app.subtractNumber(e.product_price, e.product_unitprice), e.product_num_bak),
                        packageGroups,
                    }
                });
                let printArray = [];
                tableList.forEach(e => {
                    // 合并同商品id且同成交价
                    let filterItem = printArray.find(k => k.id === e.id);
                    if (filterItem && !e.isPackage) {
                        filterItem.number = this.$app.addNumber(filterItem.number, e.number);
                        filterItem.dealMoney = this.$app.addNumber(filterItem.dealMoney, e.dealMoney);
                        filterItem.productCouponMoney = this.$app.addNumber(filterItem.productCouponMoney, e.productCouponMoney);
                        filterItem.orderCouponMoney = this.$app.addNumber(filterItem.orderCouponMoney, e.orderCouponMoney);
                    } else {
                        printArray.push(e)
                    }
                })
                const payTypeList = [
                    {
                        name: orderData.order_payment,
                        money: orderData.order_money
                    }
                ]
                if (orderData.order_money2 > 0) {
                    payTypeList.push({
                        name: orderData.order_payment2,
                        money: orderData.order_money2
                    })
                }
                let printData = {
                    customTitle: '补打单',
                    isRepeat: true,                                 // 是否是补打
                    /*打印类型*/
                    printType: 1,                                   // 1 ? '销售小票' : '预打/预结小票',
                    /*打印份数*/
                    printSum: this.cashierJurisdiction.printSum,
                    /*店铺logo*/
                    shopLogo: orderData.sv_store_logo,
                    /*店铺名称*/
                    shopName: orderData.sv_us_shortname,
                    /*电话*/
                    shopTel: orderData.sv_us_phone,
                    /*地址*/
                    shopAddress: orderData.sv_us_address,
                    /*每日流水号-取餐号*/
                    dailySerialNumber: this.userInfo.sv_us_industrytype === 27 ? orderData.everyday_serialnumber || '' : '',
                    /*订单号*/
                    orderNumber: orderData.order_running_id,
                    /*销售时间*/
                    salePrintTime: orderData.order_datetime,
                    /*操作员*/
                    controlName: orderData.consumeusername,
                    /*销售人员*/
                    salesName: orderData.salesperson,
                    /*次卡抵扣表格*/
                    cardList: [],
                    /*商品表格*/
                    tableList: printArray,
                    /*票码数据 */
                    qrCodeList,
                    /*合计总数量*/
                    totalNumber: orderData.numcount,
                    /*合计总金额*/
                    dealTotalMoney: this.$app.moneyFixed(orderData.order_receivable),
                    /*原价金额*/
                    totalMoney: this.$app.moneyFixed(orderData.sv_order_total_money),
                    /*优惠金额*/
                    discountMoney: this.$app.moneyFixed(orderData.order_coupon_money),
                    /*应收*/
                    receivableMoney: this.$app.moneyFixed(orderData.order_receivable),
                    /*实收*/
                    collectionsMoney: this.$app.moneyFixed(this.$app.addNumber(orderData.order_money, orderData.order_money2)),
                    /*找零*/
                    exchangeMoney: this.$app.moneyFixed(orderData.order_change),
                    /*抹零*/
                    freeZeroMoney: orderData.free_change,
                    /*支付方式*/
                    payTypeList,
                    /*支付单号*/
                    payOrderNumber: orderData.order_running_id,
                    /*会员信息*/
                    memberInfo: {
                        member_id: orderData.member_id === '0' ? null : orderData.member_id,
                        sv_mr_name: orderData.member_id === '0' ? null : orderData.sv_mr_name,
                        sv_mr_cardno: orderData.member_id === '0' ? null : orderData.sv_mr_cardno,
                        sv_mr_mobile: orderData.member_id === '0' ? null : orderData.sv_mr_mobile,
                        availableamount: orderData.member_id === '0' ? null : orderData.effective_amount,
                        integral: orderData.member_id === '0' ? null : (orderData.order_integral + '/' + orderData.effective_integral),
                        effective_integral: orderData.member_id === '0' ? null : orderData.effective_integral
                    },
                    /*备注*/
                    remark: orderData.sv_remarks,
                    printTime: this.$app.currentTime(new Date()),
                    /*房台号*/
                    sv_catering_grade: orderData.sv_catering_grade,
                    /*房台ID*/
                    sv_table_id: orderData.sv_table_id,
                    /*就餐人数*/
                    sv_person_num: orderData.sv_person_num,
                }
                this.$print.customSales(printData);
                this.$message.success('打印成功');
            })
        },
    }
};
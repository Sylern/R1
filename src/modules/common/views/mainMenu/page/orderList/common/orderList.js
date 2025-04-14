import base from '@/api/base';
import utils from '@/utils/utils';
import { mapActions, mapMutations, mapState } from 'vuex';
import { stockApi } from "@/api/index.js";
import { kitchenPrintMain } from '@/utils/kitchenPrint.js';
import { returnPsw } from '@/components/index';
import bindCode from '../../../base/bindCode/bindCode.vue';
import reOrder from '../../../base/reOrder/reOrder.vue';
import goodsReturn from '../../../base/goodsReturn/goodsReturn.vue';
import goodsExchange from '../../../base/goodsExchange/goodsExchange.vue';
const { debounce, throttle } = utils;
export default {
    components: { returnPsw, bindCode, reOrder, goodsReturn, goodsExchange },
    name: 'orderList',
    data() {
        return {
            printKitchenSwitch: false,
            searchType: 0,
            searctText: '',
            searchPlaceholder: ['扫单号或输入订单号', '会员姓名/卡号/手机号', '请输入交易单号'],
            listNullText: '暂无数据',
            defaultDate: [],
            orderText: ['正常', '部分退货', '整单退', '待付款'],                // 订单状态，0正常，1部分退货，2全退货，3--待付款
            query: {
                user_id: '',
                keywards: '',
                memberquery: '',
                queryPayOrderId: '',
                startdate: '',
                enddate: '',
                page: 1,
                pagesize: 20
            },
            permission: {},
            order_num: 0,                                           // 销售笔数
            order_money: 0,                                         // 营业额
            return_num: 0,                                          // 退货笔数
            return_order_num: 0,                                    // 退货订单数数
            isDataLast: false,                                      // 数据到底
            preMoneyRecord: [],
            orderList: [],                                          // 订单列表
            dataContent: {},                                        // 订单详情数据
            bindCodeStatus: false,                                  // 绑票码弹窗
            selectData: {                                           // 当前选中订单
                id: null,
                type: 1
            },
            reOrderTitle: '',                                       // 反结账标题
            reOrderStatus: false,                                   // 反结账弹窗状态
            reOrderGoodsInfo: {},
            reOrderInfo: {                                          // 反结账弹窗相关信息
                title: '',
                money: '',
                number: 1
            },

            isReturnLoading: false,
            goodsReturnStatus: false,                               // 退货弹窗状态 
            goodsExchangeStatus: false,                             // 换货弹窗状态

            returnMoneyPop: false,
        }
    },
    computed: {
        ...mapState(['userInfo', 'cashierJurisdiction', 'JurisdictionObj']),
        orderContentList() {
            return this.$app.isNull(this.dataContent.list) ? [] : this.dataContent.list.map(e => {
                // let product_price = this.$app.addNumber(e.product_price, e.product_taste_total_money);
                let sv_preferential_data = this.$app.isNull(e.sv_preferential_data) ? [] : JSON.parse(e.sv_preferential_data);
                // let discountLocal = sv_preferential_data.length > 0 ? '优惠' + this.$app.moneyFixed(sv_preferential_data[0].m) + '元' : '无折扣';
                let discountLocal = sv_preferential_data.length > 0 ? '' : '无折扣';
                let image = this.$app.isNull(e['sv_p_images']) ? [] : JSON.parse(e['sv_p_images']).map(e => { try { return e.code === '[]' ? [] : e.code; } catch (error) { return []; } });
                image = this.$app.isNull(image) ? [] : image.filter(img => !this.$app.isNull(img));
                const children = this.$app.isNull(e.combination_list) ? [] : e.combination_list.map(child => {
                    return {
                        ...child,
                        product_total: '',
                        image: [base.frontImgBase + '/images/default.png'],
                        discountLocal: ''
                    }
                })
                return {
                    ...e,
                    isPackage: !this.$app.isNull(e.combination_list),
                    product_num: e.record_type === 2 ? (-1 * e.product_num) : e.product_num,
                    product_total: e.record_type === 2 ? (-1 * e.product_total) : e.product_total,
                    image: this.$app.isNull(image) ? [base.frontImgBase + '/images/default.png'] : image.map(e => { return this.$app.fmtImg(e) }),
                    product_price: e.product_price,
                    discountLocal: discountLocal,
                    sv_preferential_data,
                    sv_preferential_data_text: sv_preferential_data.length > 0 ? sv_preferential_data[0].s : '',
                    sv_combination_new: this.$app.isNull(e.sv_combination_new) ? [] : JSON.parse(e.sv_combination_new),
                    children
                }
            })
        },
        order_discount() {
            if (this.dataContent.order_discount > 0 && this.dataContent.order_discount < 1) {
                return this.dataContent.order_discount
            }
            return false
        },
        member_discount() {
            if (this.dataContent.sv_member_discount > 0 && this.dataContent.sv_member_discount < 1) {
                return this.dataContent.sv_member_discount
            }
            return false
        },
        coupon_discount() {
            if (this.dataContent.sv_coupon_discount > 0 && this.dataContent.sv_coupon_discount < 1) {
                return this.dataContent.sv_coupon_discount
            }
            return false
        },
        isShowKitchPrint() {
            return this.dataContent.order_state === 0 && this.userInfo.sv_us_industrytype === 27
        },
    },
    watch: {

    },
    beforeMount() {
        const now = new Date();
        const start = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(this.$app.currentTime(now, 'yyyy-MM-dd') + ' 23:59:59');
        this.query.startdate = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
        this.query.enddate = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
        this.defaultDate = [this.query.startdate, this.query.enddate];
    },
    mounted() {
        this.query.page = 1;
        this.getPermissions_Client();
        window.addEventListener('scroll', this.pageNextThrottle, true);
        this.$nextTick(() => {
            this.$refs.inputSearch.focus();
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.pageNextThrottle, true);
    },
    methods: {
        ...mapMutations(['update', 'clearGoodsEmployee', 'setGoodsEmployeeReOrder']),
        ...mapActions(['reOrderAction']),
        handleChangeTime(date) {                                    // 修改筛选时间
            this.query.startdate = this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.enddate = this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.page = 1;
            this.query.keywards = '';
            this.query.memberquery = '';
            this.query.queryPayOrderId = '';
            this.getCashierBillList(true);
        },
        handleInput() {
            this.query.page = 1;
            this.getCashierBillList(true);
        },
        handleOrder(item) {
            // this.dataContent = item;
            this.selectData = {
                id: item.id,
                group_id: item.group_id,
                type: item.sv_sales_return_type
            }
            this.getCashierInfo();
        },
        handleGetPremoneyRecord() {
            if (this.preMoneyRecord.length > 0) return
            stockApi.getPreOrderList4Order({ orderListId: this.dataContent.id, pageIndex: 1, pageSize: 999 }).then(res => {
                if (res) {
                    this.preMoneyRecord = res.datas || [];
                    this.$nextTick(() => {
                        this.$refs.preMoneyTitle && this.$refs.preMoneyTitle.onReset();
                    })
                }
            });
        },
        updategoodsList(e) {                                        // 修改添加的商品
            this.goodsList = e;
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && !this.isDataLast) {
                this.query.page++;
                this.getCashierBillList();
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getCashierBillList(initList = false) {
            let SalesReport = this.$app.isNull(this.permission.SalesReport) ? { enabled: true } : this.permission.SalesReport;
            if (!SalesReport.enabled) return this.$message.warning(SalesReport.name + SalesReport.tips);
            let Sales_Data = this.$app.isNull(this.permission.Sales_Data) ? { enabled: true } : this.permission.Sales_Data;
            if (initList) this.query.page = 1;
            this.query.keywards = this.searchType === 0 ? this.searctText : '';
            this.query.memberquery = this.searchType === 1 ? this.searctText : '';
            this.query.queryPayOrderId = this.searchType === 2 ? this.searctText : '';
            let salesclerkid_id = Sales_Data.enabled ? 0 : this.userInfo.sp_salesclerkid;
            stockApi.getCashierBillList({ ...this.query, salesclerkid_id }).then(res => {
                if (res) {
                    let orderTemp = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let order_datetime = this.$app.isNull(e.order_datetime) ? '' : this.$app.currentTime(new Date(e.order_datetime), 'yyyy-MM-dd HH:mm:ss');
                        return {
                            ...e,
                            order_datetime
                        }
                    });
                    if (initList) {
                        // 需要初始化滚动条及数据
                        this.orderList = [];
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                            this.orderList = this.orderList.concat(orderTemp);
                            this.$nextTick(() => {
                                !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                            })
                        })
                    } else {
                        this.orderList = this.orderList.concat(orderTemp);
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                        })
                    }
                    if (this.$app.isNull(this.dataContent.order_id) && this.orderList.length > 0) {
                        // this.dataContent = this.orderList[0];
                        // this.$refs.myTable && this.$refs.myTable.onReset();
                    } else {
                        this.dataContent = {};
                    }
                    this.isDataLast = this.orderList.length < res.total ? false : true;
                    this.order_num = res.order_num;
                    this.order_money = this.$app.moneyFixed(res.order_money)
                    this.return_num = res.return_num;
                    this.return_order_num = res.return_order_num || 0;
                    this.listNullText = this.orderList.length > 0 ? '' : this.searctText.length > 0 ? `未查到 ${this.searctText} 相关订单` : '暂无订单';
                }
            });
        },
        getPermissions_Client() {                                   // 获取账单权限
            let menuJson = this.$app.getLocalStorage('menuJson');
            let permissionItem = menuJson ? menuJson.find(e => e.menu_code === 'SalesReport') : null;
            if (this.$app.isNull(permissionItem)) return
            let query = {
                module_code: permissionItem.menu_code,
                sp_grouping_id: this.userInfo.sp_grouping_id
            }
            stockApi.getPermissions_Client(query).then(res => {
                if (res) {
                    this.permission = res;
                    this.getCashierBillList();
                    return
                }
                console.log('未获取到权限');
            });
        },
        getCashierInfo() {
            let query = {
                source: 100,
                id: this.selectData.id,
                u_id: this.userInfo.user_id,
                group_id: this.selectData.group_id,
                type: this.selectData.type
            }
            stockApi.getCashierInfo(query).then(res => {
                if (res) {
                    this.dataContent = res;
                    this.preMoneyRecord = [];
                    this.$nextTick(() => {
                        this.$refs.myTable && this.$refs.myTable.onReset();
                    })
                }
            });
        },

        handlePrintReturn(dataList, title, remark) {
            if (!this.cashierJurisdiction.printEnable) return this.$app.isNull(title) ? this.$message.warning('请去设置—小票机设置，启用打印开关') : '';
            let that = this;
            if (!this.$app.isNull(dataList)) {
                let dataObj = {
                    ...this.dataContent,
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
                id: this.selectData.id,
                u_id: this.userInfo.user_id,
                group_id: this.selectData.group_id,
                type: this.selectData.type,
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
                        text: '操作员：' + printGetData.consumeusername
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

        handlePrintCustom() {
            if (!this.cashierJurisdiction.printEnable) return this.$message.warning('请去设置—小票机设置，启用打印开关');
            if (this.selectData.type === 2 || this.selectData.type === 3) {
                this.handlePrintReturn(null, this.selectData.type === 2 ? '退货单' : '换货单')
                return
            }
            stockApi.getMemberOrderIntegral({ id: this.selectData.id }).then(orderData => {
                let currentBillabletimePos = 1;
                let billabletimeArray = [{ id: orderData.sv_table_id, value: currentBillabletimePos }];
                const tempPrintProduct = orderData.plist.filter(e => e.sv_return_status === 0).map((e, i) => {
                    const isBillableProduct = (e.sv_p_barcode || '').indexOf('Billabletime-') > -1;
                    const billabletimeItem = billabletimeArray.find(item => item.id === e.sv_table_id_old);
                    let tablePos = 0;
                    if (billabletimeItem) {
                        tablePos = billabletimeItem.value * 100 + (isBillableProduct ? 0 : (i + 1));
                    } else {
                        currentBillabletimePos++;
                        billabletimeArray.push({ id: orderData.sv_table_id_old, value: currentBillabletimePos })
                        tablePos = currentBillabletimePos * 100 + (isBillableProduct ? 0 : (i + 1));
                    }
                    return {
                        ...e,
                        tablePos
                    }
                }).sort((a, b) => a.tablePos - b.tablePos);
                let tableList = tempPrintProduct.map(e => {
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
                    if (!this.$app.isNull(e.sv_skill_name)) productName = e.sv_skill_name;
                    if (!this.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                    return {
                        isPackage: packageList.length > 0,
                        id: e.id,
                        tableName: (e.sv_p_barcode || '').indexOf('Billabletime-') > -1 ? e.sv_table_name_old : '',
                        duration: e.duration,
                        productId: e.product_id,
                        productName,
                        barCode: e.sv_p_barcode,
                        unitName: e.sv_p_unit,
                        number: e.product_num_bak,
                        price: e.product_price,
                        dealMoney: e.product_total,
                        productCouponMoney: this.$app.multiplyNumber(this.$app.subtractNumber(e.product_price, e.product_unitprice), e.product_num_bak),
                        packageGroups,
                    }
                });
                if (this.dataContent.order_state === 0 && this.printKitchenSwitch) this.getKitchenPrinter(tableList);
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
                    controlName: orderData.order_operator_name,
                    /*销售人员*/
                    salesName: orderData.salesperson,
                    /*次卡抵扣表格*/
                    cardList: [],
                    /*商品表格*/
                    tableList: printArray,
                    /*票码数据-补打不打票码 */
                    qrCodeList: null,
                    /*合计总数量*/
                    totalNumber: orderData.numcount,
                    /*合计总金额*/
                    dealTotalMoney: this.$app.moneyFixed(orderData.order_receivable),
                    /*原价金额*/
                    totalMoney: this.$app.moneyFixed(orderData.sv_order_total_money),
                    /*优惠金额*/
                    discountMoney: this.$app.moneyFixed(orderData.order_coupon_money),
                    /*应收*/
                    receivableMoney: this.$app.moneyFixed(orderData.sv_order_total_money),
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
                        effective_integral: orderData.member_id === '0' ? null : orderData.effective_integral,
                        sv_mr_platenumber: orderData.member_id === '0' ? null : orderData.sv_mr_platenumber
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
        getKitchenPrinter(tableList) {                                  // 获取厨打方案并打印
            let ids = [];
            tableList.forEach(e => {
                if (e.isPackage) {
                    e.packageGroups.forEach(p => {
                        p.products.forEach(k => {
                            // 主键id 套餐id  分组id  商品id
                            ids.push({ sv_without_product_id: e.id, packageproduct_id: e.productId, packagegroup_id: p.id, product_id: k.productId })
                        })
                    })
                } else {
                    ids.push({ sv_without_product_id: e.id, product_id: e.productId, packageproduct_id: 0, packagegroup_id: 0 })
                }
            })
            stockApi.getKitchenPrinter(ids).then(res => {
                if (res) {
                    // 厨打 type-厨打类型 add-加菜单 return-退菜单 online-厨打单 change-换台 and-并台
                    const extendInfo = {
                        tableName: this.dataContent.sv_catering_grade,
                        everyday_serialnumber: this.dataContent.order_serial_number,
                        remark: this.dataContent.sv_remarks_list.length > 0 ? this.dataContent.sv_remarks_list.join() : this.dataContent.sv_remarks,
                    }
                    kitchenPrintMain(res, tableList, 'checkin', extendInfo);
                }
            });
        },
        calcTaste(item) {                                               // 计算口味加料
            let dataArray = item.product_taste_money_detail ? JSON.parse(item.product_taste_money_detail) : [];
            let totalMoney = 0, dataInfo = '';
            dataArray.forEach(e => {
                if (e.price > 0) {
                    totalMoney += e.price;
                    dataInfo += e.name + ':' + e.price + '元 '
                }
            })
            return `<label>` + dataInfo + `</label>`
        },
        returnOrder() {                                                 // 反结账
            if (this.dataContent.order_state !== 0) return;
            let query = {
                u_id: this.userInfo.user_id,
                id: this.selectData.id
            }
            // 查询反结账需要的数据
            stockApi.getReverseknot_data(query).then(res => {
                this.reOrderGoodsInfo = res;
                if (this.$app.isNull(this.reOrderGoodsInfo.buyStepDtos)) return this.$message.warning('获取反结账数据失败，请稍候再试')
                this.reOrderInfo = {
                    title: '反结账',
                    money: this.$app.addNumber(this.dataContent.order_money, this.dataContent.order_money2)
                }
                this.reOrderStatus = true;
            });
        },
        reOrderHandleBack(dataObj) {                                    // 反结账弹窗返回
            this.$confirm('您将进行反结账，该操作会将订单金额将原路退回，是否确定？', '提示', {
                confirmButtonText: '确定',
                cancleButtonText: '取消',
                callback: action => {
                    if (action === 'confirm') {
                        let queryReturn = {
                            orderId: this.dataContent.id,
                            refundPassword: dataObj.psw,
                            notRefund: false,
                            remark: dataObj.remark
                        }
                        // this.orderReturnTocart(dataObj.remark);
                        // return
                        stockApi.returenSalesNew(queryReturn).then(res => {
                            if (res.refundAction === 1) {
                                // 需要退款
                                this.getReturnRefund(res.refundQueryId, () => {
                                    this.orderReturnTocart(dataObj.remark);
                                });
                                // this.query.page = 1;
                            }
                            if (res.refundAction === 2) {
                                // 不需要退款
                                this.orderReturnTocart(dataObj.remark);
                            }
                        });
                    }
                }
            });
        },
        async orderReturnTocart(val) {                                        // 反结账成功，跳转购物车
            this.$message.warning('原订单已退，正在进行反结账');
            this.handlePrintReturn(null, '反结单', val);
            this.clearGoodsEmployee();
            let goodsEmployeeList = [];
            let buySteps = this.reOrderGoodsInfo.buyStepDtos.map((e, i) => {
                goodsEmployeeList.push({
                    goodsProductId: e.productId,
                    flagProductId: i + '' + e.productId,
                    employeeList: this.$app.isNull(e.commissions) ? [] : [e.commissions.map(com => {
                        let item = this.reOrderGoodsInfo.provider.find(pro => pro.e_id === com.employeeId);
                        return {
                            sv_employee_id: item.e_id,
                            sv_employee_name: item.e_name,
                            sv_employee_photo: item.e_photo,
                            grouping_name: item.g_name,
                            sv_employee_number: item.e_number,
                            isAppoint: com.assign ? true : false,
                            percent: item.percent || 100,
                            sex: item.sv_sex || 0,
                            status: 0,
                            start_time: '',
                            end_time: ''
                        }
                    })]
                })
                return {
                    ...e,
                    multCommissions: null
                }
            })
            let dataInfo = {
                memberId: this.reOrderGoodsInfo.member_id || null,
                buySteps: buySteps,
                goodsEmployeeList
            }
            await this.reOrderAction(dataInfo);
            this.update({
                key: 'selectedInfo',
                data: {
                    preOrderMoney: 0,
                    sv_order_list_id: this.reOrderGoodsInfo.sv_order_list_id,
                    sv_without_list_id: this.reOrderGoodsInfo.sv_without_list_id,
                    sv_remark: val,
                    // payType: this.reOrderGoodsInfo.order_payment
                }
            });
            if (this.userInfo.sv_us_industrytype === 1) {
                this.update({
                    key: 'selectedEmployee',
                    data: {
                        sv_employee_id: this.reOrderGoodsInfo.sv_bizemployee_id,
                        sv_employee_name: this.reOrderGoodsInfo.sv_bizemployee_name,
                        sv_employee_photo: this.reOrderGoodsInfo.sv_bizemployee_photo,
                        wt_datetime: new Date(),
                        sv_sex: this.reOrderGoodsInfo.sv_sex
                    }
                });
            }
            this.$router.push({
                path: '/cashier/home',
                query: {
                    isOrderBack: true
                }
            });
        },
        goodsReturnAction(dataObj) {                                    // 订单退货
            let refunds = [];
            if (!dataObj.isAllOrderReturn) {
                refunds = dataObj.goodsList.map(e => {
                    return {
                        orderProductId: e.id,
                        refundNum: e.currentNumber
                    }
                })
            } else {
                dataObj.goodsList = JSON.parse(JSON.stringify(this.dataContent.list));
            }
            let queryReturn = {
                orderId: this.dataContent.id,
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
                        this.getCashierBillList(true);
                    }, 100)
                    this.getCashierInfo();
                }
            });
        },
        getReturnRefund(queryId, callback) {                            // 查询需要退款的订单
            stockApi.getReturnRefund(queryId).then(res => {
                if (res.action === 1) {
                    !!callback && callback();
                    this.query.enddate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
                    setTimeout(() => {
                        this.getCashierBillList(true);
                    }, 100)
                    this.getCashierInfo();
                    // this.query.page = 1;
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
        returenSales() {                                                // 整单退货
            if (this.dataContent.order_state === 2) return
            this.goodsReturnStatus = true;
        },
        handleReturnMoney() {                                           // 继续退款
            if (!this.dataContent.status || this.dataContent.status === 1 || this.isReturnLoading) return
            this.returnMoneyPop = true;
        },
        handleReturnMoneySure() {
            this.returnMoneyPop = false;
            this.$refs.returnMoneyPsw.showPswWrap();
        },
        handlePswReturn(val) {
            this.isReturnLoading = true;
            stockApi.retryReturn({ returnBatchNumber: this.dataContent.group_id, refundPassword: val }).then(res => {
                this.$message.success('退款成功');
                setTimeout(() => {
                    this.getCashierBillList(true);
                }, 100)
                this.getCashierInfo();
            }).then(() => {
                this.isReturnLoading = false;
            }).catch(() => {
                this.isReturnLoading = false;
            });
        },
        handleExchangeBack() {                                          // 换行成功回调
            this.goodsExchangeStatus = false;
            this.$message.success('换货成功')
            setTimeout(() => {
                this.getCashierBillList(true);
            }, 100)
            this.getCashierInfo();
        },
        exchangeSales() {
            if (this.dataContent.order_state === 2) return
            this.goodsExchangeStatus = true;
        },
    }
};
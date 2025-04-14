import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    components: {},
    name: 'storeReconciliation',
    data() {
        return {
            shopData: [],
            infoMain: {
                user_turnover: 0,                           // 营业额
                user_turnover_receivable: 0,                // 营业额（应收）
                summary_mone_Wx_Zfb: 0,                     // 扫码付汇总
                storeExpenses: 0,                           // 门店支出
                working_Time: null,                         // 交接开始时间
                handover_Time: null,                        // 交接结束时间
                working_hours: null,                        // 上班时长
                customer_volume: '0单',                     // 客单单量
                member: '0单',                              // 会员单量
                deposit_volume: 0,                          // 押金笔数
                deposit_Return_volume: 0,                   // 已退押金笔数
                deposit_Refundable_volume: 0,               // 未退押金笔数
                individual: '0单',                          // 散客单量
                comprehensive_summary: {                    // 综合汇总
                    summary_name: '综合汇总',
                    summary_money: 0,
                    detailed: []
                },
            },
            subInfo: {
                individual_Consume_summary: {
                    summary_name: '散客消费汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_Consume_summary: {
                    summary_name: '会员消费汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_recharge_summary: {
                    summary_name: '充值汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_fill_times_summary: {
                    summary_name: '充次汇总',
                    summary_money: 0,
                    detailed: []
                },
                discount_summary: {
                    summary_name: '优惠汇总',
                    summary_money: 0,
                    detailed: []
                },
                returnGoods_summary: {
                    summary_name: '退货汇总',
                    summary_money: 0,
                    detailed: []
                },
                collectDownpayment_summary: {
                    summary_name: '实收定金汇总',
                    summary_money: 0,
                    detailed: []
                },
                returnDownpayment_summary: {
                    summary_name: '退款定金汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_Repayment_summary: {
                    summary_name: '会员还款汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_ReturnGoods_summary: {
                    summary_name: '会员退款汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_activity_summary: {
                    summary_name: '活动报名汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_recharge_deposit_summary: {
                    summary_name: '押金汇总',
                    summary_money: 0,
                    detailed: []
                },
                member_recharge_deposit_return_summary: {
                    summary_name: '押金已退汇总',
                    summary_money: 0,
                    detailed: []
                },
            },
            query: {
                user_id: '',
                startDate: '',
                endDate: '',
            },
            printSwitchStatus: false,
            showList: false,
            saleTotal: {
                current_total_num: 0,                       // 销售数量(不含退货数）
                current_total_money: 0,                     // 销售合计(不含退货金额）
            },
            saleList: [],
            returnTotal: {
                current_total_num: 0,                       // 销售数量(不含退货数）
                current_total_money: 0                      // 销售合计(含退货金额）
            },
            returnList: []
        }
    },
    computed: {
        ...mapState(['JurisdictionObj', 'userInfo', 'cashierJurisdiction', 'printTemplate']),
        store_logo() {
            let url = this.$app.isNull(this.userInfo.sv_store_logo) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : this.userInfo.sv_store_logo
            return this.$app.fmtImg(url)
        },
        hasSaleData() {
            let saleValue = 0;
            for (const key in this.subInfo) {
                saleValue = this.$app.addNumber(saleValue, this.subInfo[key].summary_money);
            }
            return saleValue > 0
        },
        orderContentList() {
            return ''
        },
    },
    mounted() {
        this.query.startDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.query.endDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.getChangeShiftsAllStores();
        this.getCommonBranchStorelist();
    },
    activated() {

    },
    methods: {
        handleChangeTime(date) { // 选择日期
            this.query.startDate = this.$app.currentTime(new Date(date[0]), 'yyyy-MM-dd HH:mm:ss');
            this.query.endDate = this.$app.currentTime(new Date(date[1]), 'yyyy-MM-dd HH:mm:ss');
            this.getChangeShiftsAllStores();
        },
        listenKeyup(e) {
            let code = e.keyCode;
            this.$root.$emit('keyCode', code);
        },

        getCommonBranchStorelist() {                            // 获取门店数据
            stockApi.getCommonBranchStorelist({ self: true }).then(res => {
                if (res) {
                    this.shopData = res === true ? [] : res.map(e => { return { value: e.user_id, label: e.sv_us_name } });
                    this.$app.isNull(this.shopData) && this.shopData.unshift({ value: this.$store.state.userInfo.user_id + '', label: this.$store.state.userInfo.sv_us_name });
                }
            });
        },
        getChangeShiftsAllStores() {                            // 获取交接班信息
            stockApi.getChangeShiftsAllStores(this.query).then(res => {
                if (res !== false) {
                    for (const key in this.infoMain) {
                        if (Object.hasOwnProperty.call(res, key)) {
                            this.infoMain[key] = res[key]
                        }
                    }
                    for (const key in this.subInfo) {
                        if (Object.hasOwnProperty.call(res, key)) {
                            this.subInfo[key] = res[key]
                        }
                    }

                    this.$nextTick(() => {
                        !!this.$refs.infoItemScroll && this.$refs.infoItemScroll.update();
                        !!this.$refs.scrollbar && this.$refs.scrollbar.update();
                        !!this.$refs.scrollbarRight && this.$refs.scrollbarRight.update();
                    })
                }
            });
        },
        handleSaleList(printDataList) { // 打开商品销售列表
            this.showList = printDataList.length ? false : true;
            stockApi.getSaleDetails(this.query).then(res => {
                if (res !== false) {
                    this.saleTotal = {
                        current_total_num: res.sale_info.total_num, // 销售数量(不含退货数）
                        current_total_money: res.sale_info.total_money, // 销售合计(不含退货金额）
                    };
                    this.saleList = this.$app.isNull(res.sale_info.sale_list) ? [] : res.sale_info.sale_list;

                    this.returnTotal = {
                        current_total_num: res.return_info.total_num,
                        current_total_money: res.return_info.total_money
                    };
                    this.returnList = this.$app.isNull(res.return_info.return_list) ? [] : res.return_info.return_list;
                    if (!this.showList) {
                        this.printDetail(printDataList);
                    }
                }
            });
        },
        handleSubmit() {                                // 打印
            if (!this.JurisdictionObj.PrintTheBill) return this.$message.warning('无权限')
            this.handelPrint();
            return
            stockApi.handleHandover(this.query).then(res => {
                if (res !== false) {
                    this.handelPrint();
                    setTimeout(() => {
                        window.location.href = window.location.origin;
                    }, 300)
                }
            });
        },
        printDetail(printDataList) {                    // 打印销售明细
            let array = printDataList.length ? printDataList : [];
            array.push({
                type: 'line',
                text: '【销售汇总】',
                size: 16,
                lineHeight: 40,
                align: 1,
                spaceLine: 2
            });
            let tableData = {
                header: ['名称', '数量', '小计'],
                list: [],
                footer: []
            }
            tableData.multiList = this.saleList.filter(e => e.current_sale_num > 0).map(e => {
                return {
                    name: e.isNewSpec ? e.product_name + '[' + e.sepcs + ']' : e.product_name,
                    number: e.current_sale_num + '',
                    price: this.$app.moneyFixed(e.current_sale_total)
                }
            })
            this.saleList.forEach(category => {
                category.list = category.list.filter(e => e.current_sale_num > 0)
                if (category.list.length > 0) {
                    tableData.list.push({
                        type: 'line',
                        text: '【' + category.sv_pc_name + '】 ￥' + this.$app.moneyFixed(category.current_sale_total)
                    })
                    tableData.list = tableData.list.concat(category.list.map(e => {
                        return {
                            name: e.isNewSpec ? e.product_name + '[' + e.sepcs + ']' : e.product_name,
                            number: e.current_sale_num + '',
                            price: this.$app.moneyFixed(e.current_sale_total)
                        }
                    }))
                }
            })
            tableData.footer = ['合计', this.saleTotal.current_total_num + '', this.$app.moneyFixed(this.saleTotal.current_total_money + '')];
            let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
            let tableArray = this.$app.printNameColoum(tableData, isDriverType, this.printTemplate.salesData.width);
            // 合并打印数组-表格
            array = array.concat(tableArray);

            if (this.returnList.length > 0) {
                array.push({
                    type: 'line',
                    text: '【退货汇总】',
                    size: 16,
                    lineHeight: 40,
                    align: 1,
                    spaceLine: 2
                });
                let returnData = {
                    header: ['名称', '数量', '小计'],
                    list: [],
                    footer: []
                }
                returnData.multiList = this.returnList.filter(e => e.current_sale_num > 0).map(e => {
                    return {
                        name: e.isNewSpec ? e.product_name + '[' + e.sepcs + ']' : e.product_name,
                        number: e.current_sale_num + '',
                        price: this.$app.moneyFixed(e.current_sale_total)
                    }
                })
                this.returnList.forEach(category => {
                    category.list = category.list.filter(e => e.return_num > 0)
                    if (category.list.length > 0) {
                        returnData.list.push({
                            type: 'line',
                            text: '【' + category.sv_pc_name + '】 ￥' + this.$app.moneyFixed(category.return_total)
                        })
                        returnData.list = returnData.list.concat(category.list.map(e => {
                            return {
                                name: e.isNewSpec ? e.product_name + '[' + e.sepcs + ']' : e.product_name,
                                number: e.return_num + '',
                                price: this.$app.moneyFixed(e.return_total)
                            }
                        }))
                    }
                })
                returnData.footer = ['合计', this.returnTotal.current_total_num + '', this.$app.moneyFixed(this.returnTotal.current_total_money + '')];
                let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
                let returnTableArray = this.$app.printNameColoum(returnData, isDriverType, this.printTemplate.salesData.width);
                // 合并打印数组-表格
                array = array.concat(returnTableArray);
            }
            let footArray = [
                {
                    type: 'line',
                    text: '打印时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '签名区：',
                    spaceLine: 8
                }]
            array = array.concat(footArray);
            this.$print.sales(array);
        },
        handelPrint() {
            let printDataList = [
                {
                    type: 'line',
                    text: '营业账单',
                    size: 16,
                    lineHeight: 40,
                    align: 1,
                    spaceTopLine: 1,
                    spaceLine: 1
                },
                {
                    type: 'line',
                    text: '开始时间：' + this.query.startDate
                },
                {
                    type: 'line',
                    text: '结束时间：' + this.query.endDate,
                    lineHeight: 20
                },
                {
                    type: 'line',
                    text: '收银员：' + this.userInfo.sv_ul_name,
                    bottomLine: true
                }];
            let isDriverType = this.cashierJurisdiction.printName === '免驱动' ? false : true;
            let pageWidth = this.$app.getPrintPageWidth(this.printTemplate.salesData.width, isDriverType)

            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '营业额（应收）'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 14 - this.$app.moneyFixed(this.infoMain.user_turnover_receivable).length)
                    },
                    {
                        text: this.$app.moneyFixed(this.infoMain.user_turnover_receivable)
                    }
                ]
            });
            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '营业额（实收）'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 14 - this.$app.moneyFixed(this.infoMain.user_turnover).length)
                    },
                    {
                        text: this.$app.moneyFixed(this.infoMain.user_turnover)
                    }
                ],
            });
            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '扫码付汇总'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 10 - this.$app.moneyFixed(this.infoMain.summary_mone_Wx_Zfb).length)
                    },
                    {
                        text: this.$app.moneyFixed(this.infoMain.summary_mone_Wx_Zfb)
                    }
                ]
            });
            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '门店支出'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 10 - this.$app.moneyFixed(this.infoMain.storeExpenses).length)
                    },
                    {
                        text: this.$app.moneyFixed(this.infoMain.storeExpenses)
                    }
                ],
                spaceLine: 1
            });
            printDataList.push({
                type: 'line',
                text: '【客单单量】' + this.infoMain.customer_volume,
                align: 1,
                bottomLine: true
            });
            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '会员'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 5 - this.infoMain.member.length)
                    },
                    {
                        text: this.infoMain.member
                    }],
                bottomLine: false
            });
            printDataList.push({
                type: 'tableCalc',
                list: [
                    {
                        text: '散客'
                    },
                    {
                        text: this.$app.addSpaceChar(pageWidth - 5 - this.infoMain.individual.length)
                    },
                    {
                        text: this.infoMain.individual
                    }],
                spaceLine: 1
            });

            if (this.infoMain.deposit_Return_volume) {
                printDataList.push({
                    type: 'line',
                    text: '【押金笔数】' + this.infoMain.deposit_volume + '笔',
                    align: 1,
                    bottomLine: true
                });
                printDataList.push({
                    type: 'tableCalc',
                    list: [
                        {
                            text: '已退押金笔数'
                        },
                        {
                            text: this.$app.addSpaceChar(pageWidth - 14 - this.infoMain.deposit_Return_volume.length)
                        },
                        {
                            text: this.infoMain.deposit_Return_volume + '笔'
                        }],
                    bottomLine: false
                });
                printDataList.push({
                    type: 'tableCalc',
                    list: [
                        {
                            text: '未退押金笔数'
                        },
                        {
                            text: this.$app.addSpaceChar(pageWidth - 14 - this.infoMain.deposit_Refundable_volume.length)
                        },
                        {
                            text: this.infoMain.deposit_Refundable_volume + '笔'
                        }],
                    spaceLine: 1
                });
            }

            printDataList.push({
                type: 'line',
                text: '【综合汇总】￥' + this.$app.moneyFixed(this.infoMain.comprehensive_summary.summary_money),
                align: 1,
                bottomLine: true
            });

            this.infoMain.comprehensive_summary.detailed.forEach((e, i) => {
                printDataList.push({
                    type: 'tableCalc',
                    list: [
                        {
                            text: e.type_name
                        },
                        {
                            text: this.$app.addSpaceChar(pageWidth - this.$app.getLength(e.type_name) - this.$app.moneyFixed(e.type_money).length)
                        },
                        {
                            text: this.$app.moneyFixed(e.type_money)
                        }],
                    spaceLine: this.infoMain.comprehensive_summary.detailed.length === i + 1 ? 1 : 0
                });
            })

            for (const key in this.subInfo) {
                if (this.subInfo[key].summary_money > 0) {
                    let array = [{
                        type: 'line',
                        text: '【' + this.subInfo[key].summary_name + '】￥' + this.$app.moneyFixed(this.subInfo[key].summary_money),
                        align: 1,
                        bottomLine: true
                    }];
                    this.subInfo[key].detailed.forEach((item, index) => {
                        array.push({
                            type: 'tableCalc',
                            list: [
                                {
                                    text: item.type_name
                                },
                                {
                                    text: this.$app.addSpaceChar(pageWidth - this.$app.getLength(item.type_name) - this.$app.moneyFixed(item.type_money).length)
                                },
                                {
                                    text: this.$app.moneyFixed(item.type_money)
                                }],
                            spaceLine: index === this.subInfo[key].detailed.length - 1 ? 1 : 0
                        })
                    });
                    printDataList = printDataList.concat(array);
                }
            }

            if (this.printSwitchStatus) {
                this.handleSaleList(printDataList);
            } else {
                let footArray = [
                    {
                        type: 'line',
                        text: '打印时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: '签名区：',
                        spaceLine: 8
                    }]
                printDataList = printDataList.concat(footArray);
                // console.log(JSON.stringify(printDataList));
                this.$print.sales(printDataList);
            }
        }
    }
};
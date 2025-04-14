import { mapState } from 'vuex';
import { stockApi } from '@/api/index';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import { returnPsw } from '@/components/index';
export default {
    name: 'orderWipedDouyin',
    components: { guiderSelect, returnPsw },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataItem: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            checkedSuccess: false,
            searchCode: '',
            tableList: [],
            checkedJson: [],
            resultList: [],
            resultCurrent: {},
            AutoBindCode: {
                enable: false
            },
        }
    },
    computed: {
        ...mapState(['userInfo', 'carttingList', 'carttingSelectedPos', 'cashierJurisdiction']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        checkedLength() {
            let length = 0;
            this.tableList.forEach(e => {
                if (e.rowChecked) length = this.$app.addNumber(length, e.currentNum)
            })
            return length
        },
        resultTotalMoney() {
            let totalMoney = 0;
            this.resultList.filter(k => k.result === 0 && !k.isCancel).forEach(e => {
                const original_amount = e.verify_amount_info ? e.verify_amount_info.times_card_serial_amount.amount.original_amount : e.original_amount;
                totalMoney = this.$app.addNumber(totalMoney, original_amount)
            })
            return totalMoney
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkedSuccess = false;
                    this.tableList = [];
                    this.tableList.unshift(this.dataItem);
                    this.checkedJson = this.tableList.filter(e => e.rowChecked);
                    this.$nextTick(() => {
                        !!this.$refs.searchCode && this.$refs.searchCode.focus();
                    })
                }
            }
        },
        tableList: {
            handler() {
                this.$nextTick(() => {
                    !!this.$refs.myTable && this.$refs.myTable.onReset();
                })
            }
        },
        checkedJson: {
            handler(newVal) {
                this.tableList = this.tableList.map(e => {
                    return {
                        ...e,
                        rowChecked: newVal.findIndex(checkItem => checkItem.order_id === e.order_id) > -1
                    }
                })
            }
        }
    },
    mounted() {
        this.getUserModuleConfigs();
    },
    methods: {
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handleSearchRe() {

        },
        handleGetCheckInfoPrice(item) {
            let price = 0;
            if (item.time_card) {
                const times_used = item.time_card.times_used;
                const times_item = item.time_card.serial_amount_list.find(e => e.serial_numb === parseInt(times_used + 1))
                price = this.$app.isNull(times_item) ? 0 : times_item.amount.original_amount
            } else {
                price = item.original_amount
            }
            return this.$app.moneyFixed(this.$app.divideNumber(price, 100))
        },
        handleGetCheckInfoNumber(item) {
            let listNumber = item.time_card ? this.$app.subtractNumber(item.time_card.times_count, item.time_card.times_used) : item.codeList.length;
            return listNumber
        },
        getUserModuleConfigs() {
            const configList = ['Playground'];
            stockApi.getUserModuleConfigs(configList).then(res => {
                if (res) {
                    let AutoBindCode;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'Playground':
                                AutoBindCode = item.childInfolist.find(e => e.sv_user_config_code === 'AutoBindCode');
                                return
                        }
                    });
                    let AutoBindCodeDetail = this.$app.isNull(AutoBindCode.childDetailList) ? false : true;
                    this.AutoBindCode.enable = AutoBindCodeDetail ? AutoBindCode.childDetailList[0].sv_detail_is_enable : false;
                }
            })
        },
        handleSelectAll(data, checkedBool) {                    // 表格全选 
            let json = [...this.checkedJson];
            if (checkedBool) {
                this.tableList.forEach(item => {
                    if (this.checkedJson.findIndex(e => e.order_id === item.order_id) === -1) json.push(item);
                });
            } else {
                json = json.filter(item => this.tableList.findIndex(e => e.order_id === item.order_id) === -1)
            }
            this.checkedJson = json;
        },
        handleSellect(row, data, checkedBool) {                     // 表格单选
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.order_id === row.order_id) === -1) {
                    this.checkedJson.push(row);
                }
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.order_id !== row.order_id);
            }
        },
        handleSubtract(item) {                                      // 数量 减1
            if (item.currentNum <= 1) return;
            item.currentNum = this.$app.subtractNumber(item.currentNum, 1);
            this.$set(this.tableList, item.index, item);
        },
        handleAdd(item) {                                           // 数量 加1
            let currentTotalNum = this.handleGetCheckInfoNumber(item);
            if (item.currentNum >= currentTotalNum) return;
            item.currentNum = this.$app.addNumber(item.currentNum, 1);
            this.$set(this.tableList, item.index, item);
        },
        handleDelete(index) {
            this.tableList.removeByIndex(index);
        },
        handleSure() {
            let controlList = this.tableList.filter(e => this.checkedJson.findIndex(checkItem => checkItem.order_id === e.order_id) > -1);
            this.resultList = [];
            controlList.forEach(e => {
                if (e.currentNum > 0) {
                    let codesArray = [];
                    if (e.time_card) {
                        for (let index = 0; index < e.currentNum; index++) {
                            codesArray.push(e.encrypted_code)
                        }
                    } else {
                        codesArray = e.codeList.splice(0, e.currentNum)
                    }
                    const postData = {
                        verify_token: e.verify_token,
                        encrypted_codes: codesArray
                    }
                    stockApi.douyinVerifyCode(postData).then(res => {
                        if (res) {
                            let dataArray = (res.verify_results || []).map(result => {
                                return {
                                    ...result,
                                    isCancel: false,
                                    title: e.sku.title,
                                    original_amount: e.coupon_pay_amount
                                }
                            });
                            this.resultList = this.resultList.concat(dataArray);
                            if (this.resultList.length > 0) {
                                this.checkedSuccess = true;
                                this.handlePrint(res.verify_results[0].orderListId, dataArray);
                            }
                        }
                    }).finally(() => {
                        this.$nextTick(() => {
                            !!this.$refs.myTableResult && this.$refs.myTableResult.onReset();
                        })
                    })
                }
            })
        },
        handlePswReturn(val) {
            let queryReturn = {
                orderId: this.resultCurrent.orderListId,
                refundPassword: val ? val : null,
                notRefund: false,
                remark: '抖音核销撤销',
                refunds: [
                    {
                        orderProductId: this.resultCurrent.orderProductId,
                        refundNum: 1
                    }
                ]
            }
            stockApi.returenSalesNew(queryReturn).then(res => {
                this.resultList[this.resultCurrent.index].isCancel = true;
                this.$message.success('撤销核销成功');
                this.$nextTick(() => {
                    !!this.$refs.myTableResult && this.$refs.myTableResult.onReset();
                })
            });
        },
        handleCancelVerify(item) {                                  // 点击撤销核销
            this.resultCurrent = item;
            this.$refs.returnPsw.showPswWrap();
        },
        prepare4ShortUrl() {                                        // 获取抖音订单数据
            if (this.$app.isNull(this.searchCode)) return
            stockApi.prepare4ShortUrl({ encrypted_data: this.searchCode }).then(res => {
                if (res) {
                    this.searchCode = '';
                    if (res.time_card) {
                        if (this.tableList.find(e => e.order_id === res.order_id) && res.time_card.times_count === res.time_card.times_used) return this.$message.warning('核销码已添加')
                    } else {
                        if (this.tableList.find(e => e.order_id === res.order_id)) return this.$message.warning('核销码已添加')
                    }
                    let newItem = {};
                    res.certificates.forEach(item => {
                        if (newItem.sku_id === item.sku.sku_id && newItem.account_id === item.sku.account_id && newItem.sold_start_time === item.sku.sold_start_time) {
                            newItem.codeList.push(item.encrypted_code);
                        } else {
                            newItem = { ...item };
                            Object.keys(item.sku).forEach((key) => {
                                newItem[key] = item.sku[key]
                            })
                            Object.keys(item.amount).forEach((key) => {
                                newItem[key] = item.amount[key]
                            })
                            newItem.rowChecked = true;
                            newItem.order_id = res.order_id;
                            newItem.verify_token = res.verify_token;
                            newItem.expire_time = item.expire_time;
                            newItem.codeList = [];
                            newItem.codeList.push(item.encrypted_code);
                        }
                    });
                    newItem.currentNum = newItem.codeList.length;
                    this.tableList.unshift(newItem);
                    this.checkedJson = this.tableList.filter(e => e.rowChecked);
                } else {
                    this.$message.error('未查到当前的核销信息')
                }
            })
            // .finally(() => {
            //     this.searchCode = ''
            // })
        },

        handlePrint(orderListId, ticketList) {
            if (!this.cashierJurisdiction.printEnable) return this.$message.warning('请去设置—小票机设置，启用打印开关');
            let that = this;
            let query = {
                id: orderListId,
                u_id: this.userInfo.user_id,
                type: 1,
                is_print: true
            }
            stockApi.getCashierInfo(query).then(res => {
                if (res) {
                    prePrint(res);
                }
            });
            function prePrint(_res) {
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
                        text: '抖音核销单',
                        align: 1,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: '单号：' + _res.order_running_id
                    }
                ]
                let array = [
                    {
                        type: 'line',
                        text: '核销时间：' + that.$app.currentTime(new Date(_res.order_datetime), 'yyyy-MM-dd HH:mm:ss')
                    },
                    {
                        type: 'line',
                        text: '操作员：' + _res.consumeusername
                    }
                ]
                if (_res.salesperson) {
                    array.push(
                        {
                            type: 'line',
                            text: '导购员：' + _res.salesperson,
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
                tableData.list = _res.list.map(e => {
                    let productName = e.product_name + (that.$app.isNull(e.taste_data) ? '' : '[' + e.taste_data + ']');
                    if (!that.$app.isNull(e.sv_p_specs)) productName += '[' + e.sv_p_specs + ']';
                    tableData.totalNumber = that.$app.addNumber(tableData.totalNumber, e.record_type === 2 ? e.returned_num : e.product_num_bak);
                    tableData.totalMoney = that.$app.addNumber(tableData.totalMoney, e.product_total);
                    let sv_preferential_data = that.$app.isNull(e.sv_preferential_data) ? [] : JSON.parse(e.sv_preferential_data);
                    return {
                        id: e.id,
                        sv_bar_code: e.sv_bar_code,
                        name: productName,
                        code: e.sv_p_barcode || '',
                        number: e.product_num_bak,
                        specs: [],
                        tastes: [],
                        chargings: [],
                        packageGroups: null,
                        price: that.$app.moneyFixed(e.product_price),
                        couponMoney: sv_preferential_data.length > 0 ? that.$app.moneyFixed(sv_preferential_data[0].m) : 0,
                        total: that.$app.moneyFixed(e.product_total)
                    }
                })
                tableData.footer = ['合计', tableData.totalNumber + '', '', that.$app.moneyFixed(tableData.totalMoney)];
                let isDriverType = that.cashierJurisdiction.printName.indexOf('免驱动') < 0;
                let tableArray = that.$app.printTableDate(tableData, isDriverType, that.$store.state.printTemplate.salesData.width);
                // 合并打印数组-表格
                printDataList = printDataList.concat(tableArray);
                let payInfo = [
                    {
                        type: 'line',
                        text: '应收：' + that.$app.moneyFixed(_res.order_receivable_bak_new),
                        spaceTopLine: true
                    },
                    {
                        type: 'line',
                        text: '实收：' + that.$app.moneyFixed(that.$app.addNumber(_res.order_money, _res.order_money2)),
                    }
                ]
                let order_payment = _res.order_payment + '：' + that.$app.moneyFixed(_res.order_money) + '   ';
                if (_res.order_payment2 > 0) {
                    order_payment += _res.order_payment2 + '：' + that.$app.moneyFixed(_res.order_money2);
                    payInfo.push({
                        type: 'line',
                        text: order_payment
                    })
                }
                printDataList = printDataList.concat(payInfo);

                const printTime = that.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
                let shopInfo = [
                    {
                        type: 'line',
                        text: '打印时间：' + printTime,
                        spaceLine: 1,
                        bottomLine: true
                    }
                ]
                printDataList = printDataList.concat(shopInfo);
                that.$print.sales(printDataList);

                if (!that.AutoBindCode.enable) return
                tableData.list.forEach(e => {
                    let list = [
                        {
                            type: 'line',
                            text: '单号：' + _res.order_running_id,
                            align: 1,
                            spaceLine: 1
                        },
                        {
                            type: 'photo',
                            // url: that.$app.urlToQrcodeUrl(e.sv_bar_code),
                            url: stockApi.imgQr() + '?content=' + e.sv_bar_code + '&key=' + localStorage.getItem('token'),
                            spaceTopLine: true,
                        },
                        {
                            type: 'line',
                            text: e.sv_bar_code,
                            align: 1,
                            spaceLine: 1
                        },
                        {
                            type: 'line',
                            text: e.name + 'x' + e.number + '   ' + e.price,
                            align: 1,
                            spaceLine: 1
                        },
                        {
                            type: 'line',
                            text: '打印时间：' + printTime,
                            align: 1,
                            spaceLine: 1,
                            bottomLine: true
                        },
                    ]
                    that.$print.sales(list);
                    // ticketInfo = ticketInfo.concat(list);
                })
                // printDataList = printDataList.concat(ticketInfo);
            };
        },
    }
};
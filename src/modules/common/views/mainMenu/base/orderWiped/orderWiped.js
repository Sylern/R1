import base from '@/api/base';
import { mapState } from 'vuex';
import { stockApi } from '@/api/index';
import orderWipedDouyin from '../orderWipedDouyin/orderWipedDouyin.vue';
import guiderSelect from '../guiderSelect/guiderSelect.vue';
import headScan from '../headScan/headScan.vue';
export default {
    name: 'orderWiped',
    components: { orderWipedDouyin, guiderSelect, headScan },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        // 1-丽人美业9-景区乐园 32-瑜伽健身
        const hasDouyinIndustry = [1, 9, 32];
        let menuList = [
            {
                sn: 0,
                name: '订单核销',
                plaText: '请输入核销码',
                isShow: true
            },
            {
                sn: 2,
                name: '美团核销',
                plaText: '请输入核销码',
                isShow: false
            }
        ];
        // if (hasDouyinIndustry.includes(this.$store.state.userInfo.sv_us_industrytype)) {
        menuList.unshift(
            {
                sn: 1,
                name: '抖音核销',
                plaText: '请输入核销码',
                // isShow: hasDouyinIndustry.includes(this.$store.state.userInfo.sv_us_industrytype)
                isShow: true
            }
        )
        // }
        return {
            menuPos: menuList[0].sn,
            menuList: menuList,
            douyinStatus: false,
            dowyinSwitch: true,
            douyinDataItem: {},
            orderWipedStatus: true,
            steps: 1,
            inputNumber: '',                        // 输入的单号
            memberInfo: {
                sv_mr_name: '',
                sv_mr_mobile: '',
                sv_mr_headimg: '',
                sv_ml_name: '',
                sv_mw_availableamount: 0,
                sv_mw_availablepoint: 0
            },
            orderList: [],
            orderInfo: {
                userName: '',
                telephone: '',
                orderNumber: '',
                orderTime: '',
                remark: '',
                verifycode: '',
                verifyuserText: '',
                sv_without_list_id: '',
                sv_order_list_id: '',
                productList: []
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
                    key: '.'
                },
                {
                    key: '0'
                },
                {
                    key: 'C'
                }
            ],

            guiderSelectStatus: false,              // 选择核销人员
            verifyQueryDate: {                      // 核销实体
                code: '',
                sv_without_list_id: '',
                verifyremark: '',
                verifyuser: ''
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
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.initData();
                    this.orderWipedStatus = true;
                    this.$nextTick(() => {
                        this.$refs.inputNumber && this.$refs.inputNumber.focus();
                    })
                }
            }
        },
        douyinStatus: {
            handler(newVal, oldVal) {
                if (newVal === false) {
                    if (this.dowyinSwitch) {
                        this.closeDialog();
                    } else {
                        this.orderWipedStatus = true;
                    }
                }
            }
        }
    },
    mounted() {
        this.$root.$on('closeOrderWiped', () => {
            this.closeDialog();
        })
    },
    methods: {
        doPrint() {
            const dataList = [
                {
                    code: '1234',
                    number: 1,
                    name: '跑马车',
                    price: '9.0'
                },
                {
                    code: 'abcd',
                    number: 1,
                    name: '跑马车',
                    price: '9.0'
                }
            ]

            dataList.forEach(e => {
                let list = [
                    {
                        type: 'line',
                        text: '单号：' + e.code,
                        align: 1,
                        spaceTopLine: true,
                        spaceLine: 1
                    },
                    {
                        type: 'photo',
                        url: stockApi.imgQr() + '?content=' + e.code + '&key=' + localStorage.getItem('token'),
                        spaceTopLine: true,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: e.name + ' x' + e.number + '   ' + e.price,
                        align: 1,
                        spaceLine: 1
                    },
                    {
                        type: 'line',
                        text: '打印时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        spaceLine: 1,
                        bottomLine: true
                    },
                ]
                this.$print.sales(list);
            })
        },
        handleMenu(index) {
            if (this.menuPos === index) return
            this.menuPos = index;
            this.$nextTick(() => {
                this.$refs.inputNumber.focus();
            })
        },
        handleHeadScanShow() {
            this.orderWipedStatus = false;
        },
        handleHeadScanCanel() {
            this.orderWipedStatus = true;
        },
        handleHeadScanSure(headScanMemberInfo) {
            this.getVerifyOrderByCode(headScanMemberInfo.member_id);
        },
        handlePrev() {                                              // 上一步 
            if (this.orderList === 1) {
                this.steps = 1;
                this.$refs.pageCard.setActiveItem(0);

            } else {
                this.steps--;
                this.$refs.pageCard.prev();
            }
            if (this.steps === 1) {
                this.initData();
                this.$nextTick(() => {
                    this.$refs.inputNumber.focus();
                })
            }
        },
        initData() {                                                // 初始化数据
            this.inputNumber = '';
            this.steps = 1;
            this.orderInfo = {
                userName: '',
                telephone: '',
                orderNumber: '',
                orderTime: '',
                remark: '',
                verifycode: '',
                verifyuserText: '',
                sv_without_list_id: '',
                sv_order_list_id: '',
                productList: []
            }
            this.verifyQueryDate = {                                // 核销实体
                code: '',
                sv_without_list_id: '',
                verifyremark: '',
                verifyuser: ''
            }
        },
        handleCheckNumber() {                                       // 查询核销码
            if (this.menuPos === 0) {
                this.getVerifyOrderByCode(this.inputNumber);
                return
            }
            if (this.menuPos === 1) {
                if (this.$app.isNull(this.inputNumber)) return
                stockApi.prepare4ShortUrl({ encrypted_data: this.inputNumber }).then(res => {
                    if (res) {
                        this.inputNumber = '';
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
                                newItem.expire_time = item.expire_time;
                                newItem.codeList = [item.encrypted_code];
                            }
                        });
                        this.douyinDataItem = {
                            ...res,
                            ...newItem,
                            rowChecked: true,
                            currentNum: newItem.codeList.length
                        };
                        this.douyinStatus = true;
                        this.$nextTick(() => {
                            this.douyinDataItem = {}
                        })
                    } else {
                        this.$message.error('未查到当前的核销信息')
                    }
                })
            }
        },
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
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
                    this.calculateInput('.');
                    return;
                case 110:                                     // .
                    this.calculateInput('.');
                    return;
                case 67:                                      // C
                    this.calculateInput('C');
                    return;
                default:
                    console.log('numberChange key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'orderWiped');
        },
        clearInputNumber() {                                        // 清除输入内容
            this.inputNumber = '';
        },
        handlePrevent(e) {                                          // 事件阻止
            let code = parseInt(e.keyCode);
            if (code == 13) {
                this.handleCheckNumber();
            } else if (code == 27) {
                this.closeDialog();
            } else {
                return false;
            }
        },
        calculateInput(_str) {                                      // 计算输入框的值
            if (this.inputNumber.indexOf('.') > -1 && _str.indexOf('.') > -1) return;
            if (_str == 'C') {
                this.clearInputNumber();
                return;
            }
            if (_str != '0') {
                if (this.inputNumber == '0' && _str != '.') {
                    this.inputNumber = '';
                }
                this.inputNumber = this.inputNumber + _str;
            } else {
                if (parseFloat(this.inputNumber) > 0) {
                    this.inputNumber = this.inputNumber + _str;
                }
            }
            this.inputNumber = this.$app.verifyLetterNumber(this.inputNumber);
        },
        deleteInput() {                                             // 输入框从后删除一格
            if (this.inputNumber == '0') return;
            if (this.inputNumber.length == 1) return this.inputNumber = '0';
            this.inputNumber = this.inputNumber.substring(0, this.inputNumber.length - 1);
        },
        handleFocus({ target }) {
            target.value = target.value == '0' ? '' : target.value;
        },
        handleInputBlur({ target }) {
            if (target.value.length == 0 || target.value == 0) target.value = '';
            target.value = this.$app.verifySinogram(target.value);
        },
        handleEnter() {                                             // 键盘Enter触发事件
            this.handleCheckNumber();
        },
        handleOrderItem(item) {
            this.steps = 3;
            this.$refs.pageCard.next();
            const productList = this.$app.isNull(item.order_product_json_str) ? [] : JSON.parse(item.order_product_json_str);
            this.orderInfo = {
                userName: item.sv_receipt_name,
                telephone: item.sv_receipt_phone,
                orderNumber: item.wt_nober,
                orderTime: item.wt_datetime,
                verifycode: item.verifycode,
                remark: '',
                sv_without_list_id: item.sv_without_list_id,
                sv_order_list_id: item.sv_order_list_id,
                productList: productList
            }
        },
        getGuiderSelected(value) {
            this.orderInfo.verifyuserText = value.map(e => e.name).join();
            this.verifyQueryDate.verifyuser = value.map(e => e.id).join();
        },
        getVerifyOrderByCode(_number) {                             // 获取订单核销的订单列表
            stockApi.GetVerifyOrderListByCode({ code: _number }).then(res => {
                if (res) {
                    let logoUrl = this.$app.isNull(res.sv_mr_headimg) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : res.sv_mr_headimg;
                    this.memberInfo = {
                        sv_mr_name: res.sv_mr_name,
                        sv_mr_mobile: res.sv_mr_mobile,
                        sv_mr_headimg: this.$app.fmtImg(logoUrl),
                        sv_ml_name: res.sv_ml_name,
                        sv_mw_availableamount: res.sv_mw_availableamount,
                        sv_mw_availablepoint: res.sv_mw_availablepoint
                    }
                    if (!this.$app.isNull(res.list)) {
                        this.orderList = this.$app.isNull(res.list) ? [] : res.list;
                        this.steps = this.orderList.length > 1 ? 2 : 3;
                        this.$refs.pageCard.setActiveItem(this.orderList.length > 1 ? 1 : 2);
                        if (this.orderList.length === 1) {
                            const productList = this.$app.isNull(this.orderList[0].order_product_json_str) ? [] : JSON.parse(this.orderList[0].order_product_json_str);
                            this.orderInfo = {
                                userName: this.orderList[0].sv_receipt_name,
                                telephone: this.orderList[0].sv_receipt_phone,
                                orderNumber: this.orderList[0].wt_nober,
                                orderTime: this.orderList[0].wt_datetime,
                                verifycode: this.orderList[0].verifycode,
                                remark: '',
                                sv_without_list_id: this.orderList[0].sv_without_list_id,
                                sv_order_list_id: this.orderList[0].sv_order_list_id,
                                productList: productList
                            }
                        }
                    } else {
                        this.$message.error('未查到当前的核销信息')
                    }
                } else {
                    this.$message.error('未查到当前的核销信息')
                }
            })
        },
        verifyOrderByCode() {                                       // 订单核销
            this.verifyQueryDate.code = this.orderInfo.verifycode;
            this.verifyQueryDate.sv_without_list_id = this.orderInfo.sv_without_list_id;
            stockApi.verifyOrderByCode(this.verifyQueryDate).then(res => {
                if (res.succeed) {
                    if (res.values == 1) {
                        this.$message.success('核销成功');
                        this.handlePrint(this.orderInfo.sv_order_list_id);
                    } else if (res.values == 0) {
                        this.$message.error('该核销码已核销');
                    } else {
                        this.$message.error('当前核销码不允许核销');
                    }
                    this.initData();
                    this.closeDialog();
                } else {
                    this.$message.error(res.errmsg);
                }
            })
        },

        handlePrint(orderListId) {
            if (this.$app.isNull(orderListId) || orderListId == 0) return
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
                    },
                    {
                        type: 'line',
                        text: '核销单',
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
                        text: '下单时间：' + that.$app.currentTime(new Date(_res.order_datetime), 'yyyy-MM-dd HH:mm:ss')
                    },
                    {
                        type: 'line',
                        text: '操作员：' + _res.current_operator
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
                let memberInfo = [
                    {
                        type: 'line',
                        text: '会员卡号：' + _res.sv_mr_cardno,
                        topLine: true
                    },
                    {
                        type: 'line',
                        text: '会员姓名：' + _res.sv_mr_name,
                        bottomLine: true
                    }
                ]
                if (_res.sv_mr_cardno) printDataList = printDataList.concat(memberInfo);
                let payInfo = [
                    {
                        type: 'line',
                        text: '应收：' + that.$app.moneyFixed(_res.order_receivable_bak_new)
                    },
                    {
                        type: 'line',
                        text: '实收：' + that.$app.moneyFixed(that.$app.addNumber(_res.order_money, _res.order_money2)),
                    },
                    {
                        type: 'line',
                        text: '支付方式：' + _res.order_payment,
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
                        bottomLine: true
                    },
                    {
                        type: 'line',
                        align: 1,
                        text: '谢谢惠顾，欢迎下次光临！',
                        spaceLine: 1,
                    }
                ]
                printDataList = printDataList.concat(shopInfo);
                that.$print.sales(printDataList);
            };
        },
    }
};
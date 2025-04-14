import { stockApi } from '@/api/index';
import { mapMutations, mapState } from "vuex";
import html2canvas from 'html2canvas';
export default {
    name: 'imgModel',
    data() {
        return {
            confingList: ['Print', 'PrintSeting', 'PrintingComplexFont', 'PrintSet_guestorderprint'],
            configData: {
                PrintReceipts: {},
                PrintSet_default: {},
                PrintSet_default_device: {},
                PrintSet_cash_opencashbox: {},
                PrintingComplexFont: {},
                PrintSet_guestorderprint: {}
            },
            handlePrintSumTimer: null,
            printSumTick: false,
            printDevice: [],            // 打印机列表
            printCloudList: [],         // 云打印机列表数据
            printData: {
                isSwitch: false,
                printName: '',
                cloundPrintId: 0,
                printCloudType: 0,
                printSum: 1,
                isComplexFont: false,
                PrintSet_guestorderprint: true,
                opencashbox: true
            },
            test: {
                imgUrl: 'http://ds.decerp.cc/images/system/qrcodeVip.png',
                imgUrl2: 'http://ds.decerp.cc/images/system/qrcodeCard.png'
            }
        }
    },
    watch: {
        printSumTick: {
            handler(newVal, oldVal) {
                if (newVal) {
                    clearTimeout(this.handlePrintSumTimer);
                    this.printSumTick = false;
                    let key = 'PrintSet_default';
                    let currData = this.configData[key];
                    let hasDetail = !this.$app.isNull(currData.childDetailList);
                    let configData = [
                        {
                            sv_detail_value: this.printData.printSum,
                            sv_user_config_id: currData.sv_user_config_id,
                            sv_user_module_id: currData.sv_user_module_id,
                            sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                            sv_detail_is_enable: true,
                            sv_user_configdetail_name: hasDetail ? currData.childDetailList[0].sv_user_configdetail_name : '',
                            sv_remark: '打印机设置'
                        }
                    ]
                    this.saveConfigdetailList('SetTardware', configData);
                }
            }
        }
    },
    computed: {
        ...mapState(['userInfo', 'memberInfo', 'user_local_data', 'cashierJurisdiction']),
        hasGuestPrint() {
            // 1-丽人美业 6-棋牌茶楼 27-餐饮行业
            const excludedIndustry = [1, 6, 27]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
    },
    beforeMount() {
        this.imgType = this.user_local_data.goodsListShowType;
    },
    mounted() {
        this.getUserModuleConfigs();
    },
    methods: {
        ...mapMutations(['update']),
        getPrinterNameList() {                              // 获取云打印机-小票机
            stockApi.getPrinterNameList().then(res => {
                this.printDevice = this.$app.isNull(res) ? [] : res.map(e => e.name);
                this.printCloudList = this.$app.isNull(res) ? [] : res;
                setTimeout(() => {
                    if (typeof LODOP !== 'undefined') {
                        const PRINTER_COUNT = LODOP.GET_PRINTER_COUNT();
                        for (var i = 0; i < PRINTER_COUNT; i++) {
                            const PRINTER_Name = LODOP.GET_PRINTER_NAME(i);
                            this.printDevice.push(PRINTER_Name);
                        }
                        // this.printDevice.push('免驱动方式打印')
                        return
                    }
                    if (typeof Cef !== 'undefined') {
                        if (typeof Cef.GetLocalPrinters !== 'undefined') {
                            var printDevice = Cef.GetLocalPrinters()
                            printDevice = JSON.parse(Cef.GetLocalPrinters());
                            printDevice.push('免驱动方式打印')
                            this.printDevice = this.printDevice.concat(printDevice)
                        }
                    }
                }, typeof LODOP !== 'undefined' ? 100 : 3000)
            });
        },
        getUserModuleConfigs() {                            // 获取配置
            stockApi.getUserModuleConfigs(this.confingList).then(res => {
                if (res) {
                    let PrintReceipts,
                        PrintSet_default,
                        PrintSet_default_device,
                        PrintSet_cash_opencashbox,
                        PrintingComplexFont,
                        PrintSet_guestorderprint;
                    res.forEach(item => {
                        switch (item.sv_user_module_code) {
                            case 'Print':
                                PrintReceipts = item;
                                this.printData.isSwitch = this.$app.isNull(PrintReceipts.childInfolist[0].childDetailList) ? false : PrintReceipts.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                                break;
                            case 'PrintSeting':
                                PrintSet_default = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_default');
                                this.printData.printSum = this.$app.isNull(PrintSet_default.childDetailList) ? 1 : PrintSet_default.childDetailList[0].sv_detail_value;

                                PrintSet_default_device = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_default_device');
                                this.printData.printName = this.$app.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].sv_detail_value;
                                this.printData.cloundPrintId = this.$app.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].cloundprint_id
                                this.printData.printCloudType = this.$app.isNull(PrintSet_default_device.childDetailList) ? '' : PrintSet_default_device.childDetailList[0].iscloundprint;
                                PrintSet_cash_opencashbox = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_cash_opencashbox');
                                this.printData.opencashbox = this.$app.isNull(PrintSet_cash_opencashbox.childDetailList) ? true : PrintSet_cash_opencashbox.childDetailList[0].sv_detail_value;

                                PrintSet_guestorderprint = item.childInfolist.find(e => e.sv_user_config_code === 'PrintSet_guestorderprint');
                                this.printData.PrintSet_guestorderprint = this.$app.isNull(PrintSet_guestorderprint.childDetailList) ? true : PrintSet_guestorderprint.childDetailList[0].sv_detail_is_enable;
                                break;
                            case 'PrintingComplexFont':
                                PrintingComplexFont = item;
                                this.printData.isComplexFont = this.$app.isNull(PrintingComplexFont.childInfolist[0].childDetailList) ? false : PrintingComplexFont.childInfolist[0].childDetailList[0].sv_detail_is_enable;
                                break;
                            default:
                                break;
                        }
                    });
                    this.configData.PrintReceipts = PrintReceipts;
                    this.configData.PrintSet_default = PrintSet_default;
                    this.configData.PrintSet_default_device = PrintSet_default_device;
                    this.configData.PrintSet_cash_opencashbox = PrintSet_cash_opencashbox;
                    this.configData.PrintingComplexFont = PrintingComplexFont;
                    this.configData.PrintSet_guestorderprint = PrintSet_guestorderprint;
                    this.getPrinterNameList();
                }
            })
        },
        // getPrintDevice() {                                    // 获取打印机数据

        //     if (typeof Cef !== 'undefined') {
        //         if (typeof Cef.GetLocalPrinters !== 'undefined') {
        //             var printDevice = Cef.GetLocalPrinters()
        //             this.printDevice = JSON.parse(printDevice)
        //             this.printDevice.push('免驱动方式打印')
        //         }
        //     }
        // },
        changePrint() {                                      // 修改打印机
            let key = 'PrintSet_default_device';
            let currData = this.configData[key];
            let hasDetail = !this.$app.isNull(currData.childDetailList);
            this.printData.cloundPrintId = 0;
            this.printData.printCloudType = 0;
            let item = this.printCloudList.find(e => e.name === this.printData.printName);
            if (!this.$app.isNull(item)) {
                this.printData.cloundPrintId = item.id;
                this.printData.printCloudType = 1;
            }
            let configData = [
                {
                    sv_detail_value: this.printData.printName,
                    cloundprint_id: this.printData.cloundPrintId,
                    iscloundprint: this.printData.printCloudType,
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: true,
                    sv_user_configdetail_name: '前台打印机设备选择',
                    sv_remark: '打印机设置'
                }
            ]
            this.saveConfigdetailList('SetTardware', configData);
        },
        handlePrintSum(type) {                              // 修改打印份数
            if (type === 0 && this.printData.printSum > 1) {
                this.printData.printSum--;
                if (!this.printSumTick) {
                    clearTimeout(this.handlePrintSumTimer);
                    this.handlePrintSumTimer = setTimeout(() => {
                        this.printSumTick = true;
                    }, 300)
                }
                return
            }
            if (type === 1 && this.printData.printSum < 4) {
                this.printData.printSum++;
                if (!this.printSumTick) {
                    clearTimeout(this.handlePrintSumTimer);
                    this.handlePrintSumTimer = setTimeout(() => {
                        this.printSumTick = true;
                    }, 300)
                }
                return
            }
            return this.$message.warning('打印打印小票范围：1-4')
        },
        handleChange(_key) {
            let currData = this.configData[_key];
            let hasDetail = !this.$app.isNull(currData.childInfolist[0].childDetailList);
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: currData.childInfolist[0].sv_user_config_id,
                    sv_user_module_id: currData.childInfolist[0].sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.printData.isSwitch,
                    sv_user_configdetail_name: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childInfolist[0].childDetailList[0].sv_remark : ''
                }
            ]
            this.saveConfigdetailList(_key, configData);
        },
        handleChangeSub(_key, value) {
            let currData = this.configData[_key];
            let hasDetail = !this.$app.isNull(currData.childDetailList);
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: currData.sv_user_config_id,
                    sv_user_module_id: currData.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? currData.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: value,
                    sv_user_configdetail_name: hasDetail ? currData.childDetailList[0].sv_user_configdetail_name : '',
                    sv_remark: hasDetail ? currData.childDetailList[0].sv_remark : ''
                }
            ]
            this.saveConfigdetailList(_key, configData);
        },
        handleTestPrint() {                                 // 测试打印
            if (this.printData.printCloudType === 1) {
                let query = {
                    id: this.printData.cloundPrintId,
                    type: 0,
                    brand_id: 0,
                    info: [
                        {
                            type: 'line',
                            text: '打印测试',
                            size: 17,
                            lineHeight: 30,
                            align: 1
                        },
                        {
                            type: 'line',
                            text: '打印机：' + this.printData.printName + '连接正常',
                            align: 1,
                            spaceLine: 1
                        }
                    ],
                    print_times: 1,
                }
                stockApi.postCloudPrint(query).then(res => {
                    if (res.success) {
                        this.$message.success('正在执行云打印测试')
                    }
                })
                return
            }
            if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return this.$message.info('请使用客户端体验此功能')
            let printDataList = [
                {
                    type: 'line',
                    text: '打印测试',
                    size: 17,
                    lineHeight: 30,
                    align: 1
                },
                {
                    type: 'line',
                    text: '打印机：' + this.printData.printName + '连接正常',
                    align: 1,
                    spaceLine: 1
                },
                // 切纸测试
                // {
                //     type: 'line',
                //     text: '第一行切纸测试',
                //     align: 0,
                //     spaceLine: 1
                // },
                // {
                //     type: 'line',
                //     text: '正在切纸',
                //     align: 1,
                //     CutPaper: 1
                // },
                // {
                //     type: 'line',
                //     text: '第二行切纸测试',
                //     align: 0,
                //     spaceLine: 1
                // },
                // {
                //     type: 'line',
                //     text: '正在切纸',
                //     align: 1,
                //     CutPaper: true
                // },
                // {
                //     type: 'line',
                //     text: '打印结束',
                //     align: 1,
                //     OpenMoneyBox: true
                // },
            ]
            this.$print.sales(printDataList);
        },
        handleTestPrint2() {                                // 测试打印 给安德玛做的固定模版
            if (typeof Cef === 'undefined' && typeof LODOP === 'undefined') return this.$message.info('请使用客户端体验此功能')
            // 合并同商品id且同成交价
            const printTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
            let printArray = [
                {
                    isPackage: false,
                    productName: '1257468-001-SMM UA HG ARMOUR SS',
                    barCode: '0001',
                    number: 2,
                    unitName: '个',
                    productCouponMoney: 0,
                    price: 59,
                    dealMoney: 118,
                    total: 118
                }
            ];
            let salesNameList = ['员工1'];
            const printType = 1;
            let printData = {
                customTitle: '销售',
                /*打印类型*/
                printType: printType,                           // 1 ? '销售小票' : '预打/预结小票',
                printTitleSymbol: '预打',                       // 预打 or 预结        
                /*打印份数*/
                printSum: 1,
                /*店铺logo*/
                shopLogo: this.userInfo.sv_store_logo,
                /*店铺名称*/
                shopName: this.userInfo.sv_us_shortname,
                /*电话*/
                shopTel: this.userInfo.sv_us_phone,
                /*地址*/
                shopAddress: this.userInfo.sv_us_address,
                dailySerialNumber: 'A70235864',
                /*订单号*/
                orderNumber: '702358644309895190',
                /*销售时间*/
                salePrintTime: printType === 1 ? printTime : null,
                /*打印时间*/
                printTime: printTime,
                /*操作员*/
                controlName: this.userInfo.sv_ul_name,
                /*销售人员*/
                salesName: salesNameList.join('|'),
                /*次卡抵扣表格*/
                cardList: [],
                /*商品表格*/
                tableList: printArray,
                /*合计总数量*/
                totalNumber: 1,
                /*合计总金额*/
                dealTotalMoney: '118.00',
                /*原价金额*/
                totalMoney: '118.00',
                /*优惠金额*/
                discountMoney: '0',
                /*应收*/
                receivableMoney: '118.00',
                /*实收*/
                collectionsMoney: '118.00',
                /*抹零*/
                freeZeroMoney: '0',
                /*找零*/
                exchangeMoney: '0',
                /*支付方式*/
                payTypeList: [
                    {
                        name: 'COD',
                        money: '118.00'
                    }
                ],
                /*支付单号*/
                // payOrderNumber: printType === 1 && !this.$app.isNull(this.queryPay.queryId) ? this.queryPay.queryId : '',
                payOrderNumber: '66668888',
                /*会员信息*/
                memberInfo: {
                    member_id: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.member_id,
                    sv_mr_name: this.memberInfo.sv_mr_name || '龚良朋',
                    sv_mr_cardno: this.memberInfo.sv_mr_cardno || '',
                    sv_mr_mobile: this.memberInfo.sv_mr_mobile || '13942835166',
                    availableamount: this.memberInfo.sv_mw_availableamount || '',
                    effective_integral: '652'
                },
                /*备注*/
                remark: '打印测试',
                /*房台号*/
                sv_catering_grade: '',
                /*房台ID*/
                sv_table_id: '',
                /*就餐人数*/
                sv_person_num: '',
            }
            this.$print.fixedSales(printData);
        },
        saveConfigdetailList(moduleCode, configData) {      // 修改调用
            stockApi.saveConfigdetailList(moduleCode, configData).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    let storeDataObj = {
                        ...this.cashierJurisdiction,
                        printEnable: this.printData.isSwitch,                                   // 小票机开关
                        printSum: this.printData.printSum,                                      // 打印份数
                        printName: this.printData.printName,                                    // 打印机配置名称
                        cloundPrintId: this.printData.cloundPrintId,                            // 云打印机id 非云打印为0
                        printCloudType: this.printData.printCloudType,                          // 云打印机类型1 非云打印为0
                        opencashbox: this.printData.opencashbox,                                // 结算后开钱箱
                        isComplexFont: this.printData.isComplexFont,                            // 是否繁体字
                        PrintSet_guestorderprint: this.printData.PrintSet_guestorderprint       // 餐饮宾客单打印开关
                    };
                    this.update({
                        key: 'cashierJurisdiction',
                        data: storeDataObj
                    });
                }
            })
        },

        handleDownloadImg() {                               // 下载二维码
            // html2canvas(this.$refs.downloadImg).then(canvas => {
            //     let imgUrl = canvas.toDataURL('image.png');
            //     this.$app.downloadFile('qcode', imgUrl)
            // });
            html2canvas(document.querySelector("#capture")).then(canvas => {
                document.body.appendChild(canvas)
                let imgUrl = canvas.toDataURL('image.png');
                this.$app.downloadFile('qcode', imgUrl)
            })
        },
    }
}
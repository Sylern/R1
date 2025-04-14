import { stockApi } from '@/api/index';
import { checkedCommodity, labelTemplate } from '@/components/index';
import { mapState, mapActions } from 'vuex';
import { priceTagList } from '@/utils/config/config.js';
import { printLabel } from '@/utils/prin';
export default {
    name: 'restaurantPrint',
    components: { checkedCommodity, labelTemplate },
    data() {
        return {
            confingList: ['Print', 'PrintSeting', 'PrintingComplexFont'],
            configData: {
                PrintReceipts: {},
                PrintSet_default: {},
                PrintSet_default_device: {},
                PrintSet_cash_opencashbox: {},
                PrintingComplexFont: {}
            },
            isCheckedCommodity: false,                          // 关联菜品
            checkedCommodity: [],                               // 选择商品列表
            showPrintAddStatus: false,                          // 弹出打印机状态
            showLabelAddStatus: false,                          // 弹出打印机状态 - 标签
            dataList: [],                                       // 打印方案列表
            labelDataList: [],                                  // 标签打印方案列表
            printTypeText: ['驱动打印', '网口打印', '蓝牙打印'],
            addPrintList: [                                     // 打印票据列表
                {
                    code: "KitchenPlaySingle",
                    name: '厨打总单',
                    state: false
                },
                {
                    code: "KitchenPlaySingle2",
                    name: '厨打分单',
                    state: false
                },
                {
                    code: "KitchenSonSingleTotalSingle",
                    name: '分单总单',
                    state: false
                },
                {
                    code: "ChangeChannels",
                    name: '加菜单',
                    state: false
                },
                {
                    code: "RouseFood",
                    name: '催菜单',
                    state: false
                },
                {
                    code: "FoodBack",
                    name: '退菜单',
                    state: false
                },
                {
                    code: "PushFood",
                    name: '起菜单',
                    state: false
                },
                {
                    code: "AddFood",
                    name: '换台单',
                    state: false
                },
                {
                    code: "AndChannels",
                    name: '并台单',
                    state: false
                }
            ],
            // labelPrintList: [                                     // 打印标签列表
            //     {
            //         code: "LabelFk2",
            //         name: '奶茶标签',
            //         state: false
            //     },
            //     {
            //         code: "LabelFk1",
            //         name: '商品标签',
            //         state: false
            //     },
            //     {
            //         code: "CommodityLabel2",
            //         name: '餐饮标签',
            //         state: false
            //     }
            // ],
            labelTemplateList: [],                               // 标签模板
            isEdit: false,                                      // 是否编辑打印
            isSaved: false,                                     // 是否编辑打印
            formData: {                                         // 打印及数据
                sv_printer_id: 0,
                sv_printer_name: '',                            // 名称
                sv_print_type: 1,                               // 打印类型 0：驱动打印，1：网口打印，2：蓝牙打印
                sv_printer_ip: '',                              // IP
                sv_printer_port: '9100',                        // 端口号
                sv_enabled: true,                               // 是否启用
                sv_is_print_unitprice: false,                   // 后厨小计
                sv_labelprint_width: '80',                      // 打印规格
                sv_remark: ''                                   // 备注
            },
            labelFormData: {                                    // 打印及数据
                sv_printer_id: 0,
                sv_printer_name: '',                            // 名称
                sv_printer_ip: '',                              // IP
                sv_printer_port: '',                            // 端口号
                sv_enabled: true,                               // 是否启用
                sv_print_type: 0,                               // 打印类型 0：驱动打印，1：网口打印，2：蓝牙打印
                // sv_labelprint_width: '80',                      // 打印规格
                sv_print_count: '1',                            // 打印份数
                sv_labeltemplate_id: '',                        // 模板id
                sv_remark: ''                                   // 备注
            },
            rules: {
                sv_printer_name: [{
                    required: true,
                    message: '请输入方案名称',
                    trigger: ['blur', 'change']
                }],
                sv_printer_ip: [{
                    required: true,
                    message: '请输入IP',
                    trigger: ['blur', 'change']
                }],
                sv_printer_port: [{
                    required: true,
                    message: '请输入端口号',
                    trigger: ['blur', 'change']
                }]
            },
            labelRules: {
                sv_printer_name: [{
                    required: true,
                    message: '请输入方案名称',
                    trigger: ['blur', 'change']
                }],
                sv_print_count: [{
                    required: true,
                    message: '请输入打印份数',
                    trigger: ['blur', 'change']
                }],
                sv_printer_ip: [{
                    required: true,
                    message: '请选择打印机',
                    trigger: ['blur', 'change']
                }],
                sv_printer_port: [{
                    required: true,
                    message: '请输入端口号',
                    trigger: ['blur', 'change']
                }],
            },
            handlePrintSumTimer: null,
            printDevice: [],         // 打印机列表

            printProgrammeId: '',                               // 打印方案id
            printData: {
                isSwitch: false,
                printName: '',
                printSum: 1,
                isComplexFont: false,
                opencashbox: true
            },
            productQuery: {                                     // 商品查询实体
                user_id: '',
                pc_id: '',
                ps_id: '',
                keywards: '',
                pageIndex: 0,
                pageSize: 0,
            },
            productForm: [],                                    // 厨打商品
            queryEntity: { checkedOneId: -1, checkedTowId: '', keywards: '', type: -1 }
        }
    },
    computed: {
        ...mapState(['user_local_data', 'userInfo']),
    },
    beforeMount() {
        this.imgType = this.user_local_data.goodsListShowType;
    },
    mounted() {
        this.productQuery.user_id = this.userInfo.user_id;
        this.getKitchenPrinterList();
        this.getTemplateByUser();
        this.getPrintDevice();
    },
    methods: {
        ...mapActions(['getPrintTotalList']),
        handleLabelType() {                                     // 打印机类型change事件
            this.$refs['labelForm'].clearValidate()
            if (this.labelFormData.sv_print_type === 0) {
                this.labelRules.sv_printer_ip[0].message = '请选择打印机';

                !this.$app.isNull(this.labelRules.sv_printer_port) &&
                    delete this.labelRules.sv_printer_port;
                return
            }
            this.labelRules.sv_printer_ip[0].message = '请输入IP';

            if (this.$app.isNull(this.labelRules.sv_printer_port))
                this.labelRules.sv_printer_port = [{
                    required: true,
                    message: '请输入端口号',
                    trigger: ['blur', 'change']
                }]
        },
        initEditAndAddPrintInfo(item = false) {                 // 编辑弹框数据格式化
            // this.isEdit
            if (item) {
                !this.$app.isNull(item.sv_template_josn) ? item.sv_template_josn.forEach(e => {
                    this.addPrintList.forEach(data => {
                        if (data.code === e.code) {
                            data.state = e.state;
                        }
                    })
                }) : item.sv_template_list.forEach(e => {
                    this.addPrintList.forEach(data => {
                        if (data.code === e.code) {
                            data.state = e.state;
                        }
                    })
                })
                this.formData = {
                    sv_printer_id: item.sv_printer_id,
                    sv_printer_name: item.sv_printer_name,
                    sv_print_type: item.sv_print_type,
                    sv_printer_ip: item.sv_printer_ip,
                    sv_printer_port: item.sv_printer_port,
                    sv_is_print_unitprice: item.sv_is_print_unitprice,
                    sv_enabled: item.sv_enabled,
                    sv_labelprint_width: item.sv_labelprint_width,
                    sv_remark: item.sv_remark
                };
            } else {
                this.addPrintList.forEach(e => {
                    e.state = false;
                });
                this.formData = {
                    sv_printer_id: 0,
                    sv_printer_name: '',
                    sv_print_type: 1,
                    sv_printer_ip: '',
                    sv_printer_port: '9100',
                    sv_is_print_unitprice: false,
                    sv_enabled: true,
                    sv_labelprint_width: '80',
                    sv_remark: ''
                };
            }
        },
        initEditAndAddLabelInfo(item = false) {                 // 编辑弹框数据格式化
            if (item) {
                // 标签模板开关开启
                if (!this.$app.isNull(item.sv_labeltemplate_id)) {
                    let label = this.$app.isNull(this.labelTemplateList) ? '' : this.labelTemplateList.find(e => e.templateId == item.sv_labeltemplate_id);
                    !this.$app.isNull(label) && (label.state = true)
                }

                this.labelFormData = {
                    sv_printer_id: item.sv_printer_id,
                    sv_printer_name: item.sv_printer_name,
                    sv_print_type: item.sv_print_type,
                    sv_printer_ip: item.sv_printer_ip,
                    sv_printer_port: item.sv_printer_port,
                    sv_enabled: item.sv_enabled,
                    sv_print_count: item.sv_print_count,
                    sv_labeltemplate_id: item.sv_labeltemplate_id,
                    sv_remark: item.sv_remark
                };
            } else {
                this.labelTemplateList.forEach(e => {
                    e.state = false;
                });
                this.labelFormData = {
                    sv_printer_id: 0,
                    sv_printer_name: '',
                    sv_print_type: 0,
                    sv_printer_ip: '',
                    sv_printer_port: '9100',
                    sv_enabled: true,
                    sv_print_count: '1',
                    sv_labeltemplate_id: '',
                    sv_remark: ''
                };
            }
        },
        addPrint() {                                            // 新增按钮点击事件
            this.showPrintAddStatus = true;
            this.initEditAndAddPrintInfo();
        },
        addLabelPrint() {                                       // 新增按钮点击事件
            this.showLabelAddStatus = true;
            this.initEditAndAddLabelInfo();
        },
        closeDialog() {                                         // 编辑弹框 关闭按钮
            this.showPrintAddStatus = false;
        },
        closeLabelDialog() {                                    // 编辑弹框 关闭按钮
            this.showLabelAddStatus = false;
            this.labelTemplateList.forEach(e => {
                e.state = false;
            });
        },
        handleEnter() {                                         // 编辑弹框 确定按钮 点击
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let sv_template_list = this.addPrintList.map(e => {
                        return {
                            code: e.code,
                            state: e.state
                        }
                    })
                    stockApi.editKitchenPrint({ ...this.formData, sv_template_list }).then(res => {
                        if (res || res === null) {
                            this.closeDialog();
                            this.getKitchenPrinterList();
                            this.getPrintTotalList();           // 更新总单打印机
                            return this.formData.sv_printer_id > 0 ? this.$message.success('编辑成功') : this.$message.success('新增成功')
                        }
                    })
                }
            });
        },
        handleLabelEnter() {                                    // 编辑弹框 确定按钮 点击 标签
            this.$refs['labelForm'].validate((valid) => {
                this.isSaved = true;
                if (valid) {
                    stockApi.editLabelPrinter({ ...this.labelFormData }).then(res => {
                        if (res || res === null) {
                            this.closeLabelDialog();
                            this.getKitchenPrinterList();
                            return this.labelFormData.sv_printer_id > 0 ? this.$message.success('编辑成功') : this.$message.success('新增成功')
                        }
                    })
                }
            });
        },
        handleChangeState(item) {                               // 开关改变事件
            if (item.state) {   // 关闭其他模板开关
                this.labelTemplateList.forEach(e => {
                    e.templateId !== item.templateId && (e.state = false);
                })
                this.labelFormData.sv_labeltemplate_id = item.templateId;
                return
            }

            this.labelFormData.sv_labeltemplate_id = '';
        },
        showFoodSetting(row) {                            // 弹出关联菜品
            this.printProgrammeId = row.sv_printer_id;
            this.gtecateringKitchenPrinterProcut();
        },
        getCheckedCommodity(obj) {                              // 选择商品组件回调
            this.productForm = this.$app.isNull(obj) ? [] : obj.map(e => {
                let obj = {
                    sv_kitchen_printer_id: e.sv_kitchen_printer_id || '',                  // 关联id
                    sv_printer_id: this.printProgrammeId,       // 厨房打印方案主键id
                    sv_procut_id: e.id,                         // 商品id
                    productcategory_id: e.productcategory_id,   // 分类id
                }
                // 关联过的商品 给该商品sv_kitchen_printer_id赋值
                const item = this.checkedCommodity.find(item => item.id == e.product_id);
                !this.$app.isNull(item) && (obj.sv_kitchen_printer_id = item.sv_kitchen_printer_id)
                // 没有关联id的删除关联id参数 不然会报错
                this.$app.isNull(obj.sv_kitchen_printer_id) && delete obj.sv_kitchen_printer_id
                return obj
            });
            this.editKitchenProduct();
        },
        getKitchenPrinterList() {                               // 获取打印机列表
            stockApi.getKitchenPrinterList().then(res => {
                if (this.$app.isNull(res)) return;
                this.dataList = this.$app.isNull(res.kitchen_list) ? [] : res.kitchen_list.map(e => {
                    e.sv_modification_date = this.$app.currentTime(new Date(e.sv_modification_date || e.sv_creation_date));
                    return {
                        ...e,
                        showPop: false,
                        sv_template_josn: JSON.parse(e.sv_template_josn)
                    }
                });
                this.labelDataList = this.$app.isNull(res.label_list) ? [] : res.label_list.map(e => {
                    e.sv_modification_date = this.$app.currentTime(new Date(e.sv_modification_date || e.sv_creation_date));
                    return {
                        ...e,
                        showPop: false,
                        sv_template_josn: JSON.parse(e.sv_template_josn)
                    }
                });
            })
        },
        async editPrint(item) {                                 // 编辑打印机事件
            this.printProgrammeId = item.sv_printer_id;
            // this.initEditAndAddPrintInfo(item);
            await this.gtecateringKitchenPrinter();                 // 编辑前需请求详情接口获取到对应打印的票据类型 -by 春波
            this.showPrintAddStatus = true;
            this.isEdit = true;
            item.showPop = false;
        },
        async editLabelPrint(item) {                            // 编辑标签打印机事件
            this.printProgrammeId = item.sv_printer_id;
            await this.gtecateringKitchenPrinter(true);                 // 编辑前需请求详情接口获取到对应打印的票据类型 -by 春波
            this.showLabelAddStatus = true;
            this.isEdit = true;
            item.showPop = false;
        },
        testPrint(item) {                                       // 测试打印
            if (typeof Cef !== 'undefined' && typeof Cef.NetworkPrint !== 'undefined') {
                var printData = {           // 测试打印数据
                    HeaderList: [
                        { Content: '测试打印机', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 1, TextFont: 0, Width: 0, TextFontSize: 2 }
                    ],
                    BodyList: [], TitleList: [], FooterList: [], LogoData: {}, QRCodeData: null, Action: 1, PageType: 0, PagePadding: 0
                    // BodyList
                    // { Content: '测试打印,1', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 0, TextFont: 0, Width: 0, PrinterIp: '192.168.1.150', PrinterPort: '9100', TextFontSize: 2 }
                    // TitleList
                    // { Content: '测试', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 1, TextFont: 0, Width: 20, TextFontSize: 2 },
                    // { Content: '测试', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 2, TextFont: 0, Width: 10, TextFontSize: 2 }
                    // FooterList
                    // { Content: '————————————————————————', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 0, TextFont: 0, Width: 0 },
                    // { Content: '合计1', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 0, TextFont: 0, Width: 0 },
                    // { Content: '', Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 0, TextFont: 0, Width: 0 }
                    // LogoData
                    // Align: 1, Width: 50, Height: 50, ImageString: 'http://res.decerp.cc/UPIMG/USER/20170224141329873.jpg'
                }
                Cef.NetworkPrint(JSON.stringify(printData), item.sv_printer_ip, item.sv_printer_port, "1");
            } else {
                this.$confirm('请使用客户端体验此功能', '提示', { confirmButtonText: '点击下载', cancelButtonText: '关闭' }).then(() => {
                    this.handleTypeWin();
                }).catch(() => { });
            }
        },
        testPrintLabel(item) {                                  // 测试打印
            if (typeof Cef === 'undefined') return;
            if (typeof Cef.PrintSupMarkLabel === 'undefined') return;
            const temJson = JSON.parse(JSON.stringify(this.labelTemplateList.find(e => e.templateId === item.sv_labeltemplate_id)))
            const prData = {
                order_id: '',
                sv_p_name: temJson.pricesTagItems.find(e => e.name === '商品名称').title,
                sv_production_date: new Date(),
                tastes: '少糖 多冰',
                sv_without_list_id: '',
                sv_p_unitprice: '',
                sv_us_name: this.userInfo.sv_us_name,
                sv_productionplace: '广州市增城区永和镇永和广场123号',
                sv_us_phone: '',
                everyday_serialnumber: 'A1',
                sv_catering_grade: '1/1',
            }
            printLabel({
                data: [prData],
                tem: temJson,
                printName: item.sv_printer_ip,
                dir: '0',
                columnNum: 1,
                userInfo: this.userInfo
            })
        },
        handleTypeWin() {                                       // 下载德客软件
            if (this.userInfo.distributor_id === 1) {
                this.$app.downloadUrl('https://www.decerp.cn/res/德客软件.exe');
                return
            }
            this.$app.downloadUrl('https://school.mispos.cc/门店管理系统.zip');
        },
        deletePrint(item) {                                     // 打印机 删除按钮
            this.$confirm('确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                item.showPop = false;
                this.deleteKitchenPrinter(item.sv_printer_id);
            }).catch(() => {

            });
        },
        getProductsId() {                                       // 获取商品列表
            stockApi.getProductPrint(this.productQuery).then(res => {
                this.productForm = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                    let obj = {
                        sv_printer_id: this.printProgrammeId,       // 厨房打印方案主键id
                        sv_procut_id: e.product_id,                 // 商品id
                        productcategory_id: e.productcategory_id,   // 分类id
                    }
                    // 关联过的商品 给该商品sv_kitchen_printer_id赋值
                    const item = this.checkedCommodity.find(item => item.id == e.product_id);
                    !this.$app.isNull(item) && (obj.sv_kitchen_printer_id = item.sv_kitchen_printer_id)
                    return obj
                });
                this.editKitchenProduct();
            })
        },
        gtecateringKitchenPrinter(islabel = false) {            // 查询后厨详情
            stockApi.gtecateringKitchenPrinter({ sv_printer_id: this.printProgrammeId }).then(res => {
                res.sv_template_josn = this.$app.isNull(res.sv_template_josn) ? [] : JSON.parse(res.sv_template_josn);
                islabel ? this.initEditAndAddLabelInfo(res) : this.initEditAndAddPrintInfo(res);
            })
        },
        gtecateringKitchenPrinterProcut() {                     // 获取已关联商品
            stockApi.gtecateringKitchenPrinterProcut({ sv_printer_id: this.printProgrammeId }).then(res => {
                this.checkedCommodity = this.$app.isNull(res) ? [] : res.map(e => { e.rowChecked = true; e.id = e.sv_procut_id; return e });
                this.isCheckedCommodity = true;
            })
        },
        editKitchenProduct() {                                  // 后厨打印商品关联
            stockApi.editKitchenProduct({ list: this.productForm, printerId: this.printProgrammeId }).then(res => {
                if (res !== undefined) {
                    this.$message.success('关联商品成功');
                    this.getKitchenPrinterList();
                }
            })
        },
        deleteKitchenPrinter(id) {                              // 删除打印机
            stockApi.deleteKitchenPrinter({ sv_printer_id: id }).then(res => {
                if (res !== undefined) {
                    this.$message.success('删除成功');
                    this.getKitchenPrinterList();
                }
            })
        },
        handleInput({ target }) {
            target.value = this.$app.verifyNumber(target.value);
        },
        getTemplateByUser() {                                   // 获取店铺的模板与系统默认模板
            this.labelTemplateList = JSON.parse(JSON.stringify(priceTagList)).map(e => {
                // 默认全部开关关闭
                e.state = false;

                e.pricesTagItems = this.$app.isNull(e.pricesTagItems) ? [] : e.pricesTagItems.map(e => {
                    // 造些数据让页面好看
                    switch (e.name) {
                        case '零售价': e.title += '18'; break
                        case '牌号': e.title += '1/1'; break
                        case '单号': e.title += '0123'; break
                        case '取餐号': e.title += 'A01'; break
                        case '电话': e.title += '0220-65802542'; break
                    }

                    switch (e.fontStyle) {
                        case 0: e.b = false; e.u = false; break
                        case 1: e.b = true; e.u = false; break
                        case 4: e.u = true; e.b = false; break
                        case 5: e.b = true; e.u = true; break
                    }
                    return { ...e, itemType: e.priceTagItemType, barCodeWidth: e.barCodeWidth === 2 ? 212 : e.barCodeWidth === 1 ? 141 : e.barCodeWidth }
                });
                return { ...e, createTime: this.$app.currentTime(new Date(e.createTime), 'yyyy-MM-dd HH:mm') }
            });
        },
        getPrintDevice() {                                      // 获取打印机数据
            // var printDevice = Cef.GetLocalPrinters()
            // this.printDevice = JSON.parse(printDevice);

            if (typeof LODOP !== 'undefined') {
                const PRINTER_COUNT = LODOP.GET_PRINTER_COUNT();
                for(var i = 0; i < PRINTER_COUNT; i++) {
                    const PRINTER_Name = LODOP.GET_PRINTER_NAME(i);
                    this.printDevice.push(PRINTER_Name);
                }
                return
            }
            if (typeof Cef !== 'undefined') {
                if (typeof Cef.GetLocalPrinters !== 'undefined') {
                    this.printDevice = JSON.parse(Cef.GetLocalPrinters());
                }
            }
        }
    }
}
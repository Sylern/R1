import { checkedCommodity, labelTemplate } from '@/components/index';
import { stockApi } from '@/api/index.js';
export default {
    name: 'restaurantPrint',
    components: { checkedCommodity, labelTemplate },
    data() {
        return {
            storeData: [],                      // 门店数据
            brandData: [],                      // 品牌数据
            typeData: [],                       // 设备类型数据
            PrintList: [],                      // 后厨票据打印类型
            tabelJson: [],                      // 打印机列表

            isAddEdit: false,                   // 显示-隐藏添加编辑打印机
            entityObj: {                        // 添加-编辑打印机实体
                id: '',                             // 主键id
                name: '',                           // 打印机名称
                sn: '',                             // 设备终端号
                belong_userid: '',                  // 设备门店
                brand: '',                          // 设备品牌
                type: '',                           // 设备类型
                state: true,                        // 是否启用
                print_key: ''                       // key
            },
            rulesEntityObj: {
                data1: [{ required: true, message: '请输入打印机名称', trigger: ['blur', 'change'] }],
            },
            entityPrint: {                      // 打印实体
                brand_id: '',                       // 打印机ID
                userid: '',                         // 门店id
                print_type: 0,                      // 打印类型 0 小票 1后厨
                info: []                            // 打印数据
            },

            isCheckedCommodity: false,          // 关联菜品显示
            queryEntity: {                      // 默认查询条件
                checkedOneId: -1,
                checkedTowId: '',
                keywards: '',
                type: -1
            },
            sv_printer_id: '',                  // 选择的打印机Id
            checkedCommodity: [],               // 打印机已关联的菜品
        }
    },
    computed: {
        isEdit() {                                      // 是否详情
            return this.$app.isNull(this.entityObj.id) ? false : true;
        },

    },
    mounted() {
        this.getStoreData();                    // 获取门店数据
        this.getBrandData();                    // 获取设备品牌
        this.getTypeData();                     // 获取设备类型
        this.getPrintList();                    // 获取后厨打印票据类型
        this.getPageData(0);                    // 获取打印机列表
    },
    methods: {
        //#region 事件

        handleSubmit() {                        // 添加-编辑打印机 保存
            let obj = { ...this.entityObj };
            obj['sv_template_list'] = JSON.stringify(this.PrintList.map(item => { return { code: item.code, state: item.state } }));
            obj.state = obj.state ? 0 : 1;
            if (!this.isEdit) {
                delete obj.id;
                stockApi.AddPrinter(obj).then(res => {
                    if (res === null) { this.$message.success('添加成功'); this.isAddEdit = false; this.getPageData(); }
                });
            } else {
                delete obj.sn, obj.print_key;
                stockApi.ModifyPrinter(obj).then(res => {
                    if (res === null) { this.$message.success('修改成功'); this.isAddEdit = false; this.getPageData(); }
                })
            }

        },
        handleAdd() {                           // 显示添加打印机
            this.isAddEdit = true;
            this.entityObj = { name: '', sn: '', belong_userid: '', brand: '', type: '', state: true, print_key: '' }
        },
        handleDelete(item) {                    // 删除打印机
            this.$confirm('是否确定删除此打印机?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                stockApi.DeletePrinter({ id: item.id, userid: item.belong_userid }).then(res => {
                    if (res === null) this.tabelJson = this.tabelJson.filter(e => e.id !== item.id);
                })
            })
        },
        handleEdit(item) {                      // 编辑
            this.getPrintList(item.type);
            this.$refs.cpt_popver[0].doClose();
            this.isAddEdit = true;
            this.entityObj = {
                id: item.id,
                name: item.name,
                belong_userid: item.belong_userid,
                brand: parseInt(item.brand),
                type: item.type,
                state: item.state === '0' ? true : false,
                sn: '',
                print_key: ''
            }

            if (!this.$app.isNull(item.sv_template_list)) {
                let sv_template_list = JSON.parse(item.sv_template_list);
                this.PrintList = this.PrintList.map(e => {
                    e.state = sv_template_list.find(k => k.code === e.code).state;
                    return { ...e };
                })
            }

        },
        handlePrint(item) {                     // 打印
            this.entityPrint.brand_id = item.id;
            this.entityPrint.userid = item.belong_userid;
            switch (item.type) {
                case '0':                       // 小票模拟测打数据
                    this.entityPrint.print_type = 0;
                    this.entityPrint.info = this.getSalesEntity(); break;
                case '1':
                    this.entityPrint.print_type = 1;
                    this.entityPrint.info = this.getRestaurant(); break;
                default: break;
            }
            this.PrintTest();
        },
        getSalesEntity() {                      // 测试小票模拟打印数据
            return [
                { type: 'logo', size: 1, align: 1, spaceLine: 1, url: 'http://res.decerp.cc/UploadImg/95476538/ShopLogo/20210701113006221.png' },
                { type: 'line', text: '测试店', size: 12, lineHeight: 25, align: 1 },
                { type: 'line', text: '', align: 1, spaceLine: 1 },
                { type: 'barcode', text: '', align: 1, spaceLine: 1 },
                { type: 'line', text: '预结时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss') },
                { type: 'line', text: '操作员：店长' },
                {
                    type: 'tableCalcHeader', bottomLine: true, list: [
                        { text: '商品     ', length: 7 },
                        { text: ' 数量 ', length: 4 },
                        { text: '  单价 ', length: 5 },
                        { text: '    小计', length: 6 }
                    ]
                },
                { type: 'line', text: '测试商品', lineHeight: 18, bottomLine: false },
                {
                    type: 'tableCalc', bottomLine: true, list: [
                        { text: '         ', length: 9 },
                        { text: '   1  ', length: 6 },
                        { text: ' 12.00 ', length: 7 },
                        { text: '  12.00', length: 7 }],
                },
                {
                    type: 'tableCalc', bottomLine: true, list: [
                        { text: '合计     ', length: 7 },
                        { text: '   1  ', length: 6 },
                        { text: '       ', length: 7 },
                        { text: '  12.00', length: 7 }
                    ]
                },
                { type: 'line', text: '应收：12.00' },
                { type: 'line', text: '实收：0' },
                { type: 'line', text: '电话：131******92' },
                { type: 'line', text: '地址：测试广场' },
                { type: 'line', text: '打印时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss') },
                { type: 'line', text: '备注：', spaceLine: 1 },
                { type: 'line', text: '谢谢惠顾，欢迎下次光临', align: 1 }
            ]
        },
        getRestaurant() {                       // 测试厨打模拟打印数据
            return [
                { type: 'line', text: '测试厨打单', size: 2, align: 1, spaceLine: 1 },
                { type: 'line', text: '房台：A01', size: 2 },
                { type: 'line', text: '收银：11', size: 1 },
                { type: 'line', text: '时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'), size: 1, bottomLine: true },
                { type: 'line', text: '菜品                               数量', size: 1, bottomLine: true },
                { type: 'title', text: '菜品', align: 1, size: 2, width: 18 },
                { type: 'title', text: '数量', align: 2, size: 2, width: 6 },
                { type: 'tableCalc', text: '优益C,1', cateringItem: null, remarkItem: null, size: 2, bottomLine: true },
                { type: 'foot', text: '合计：1', size: 1, width: 23 }
            ]
        },
        getOnlineOrder() {                      // 测试线上订单模拟打印数据
            return {
                LogoData: null,
                DataList: [],
                QRCodeData: null,
                Action: 1,
                PageType: 0,
                FontSize: 9,
                PrintVersion: 1,
                PagePadding: 0,
                LineHeight: 20,
                pageWidthV3: 80,
                PageWidth: 80,
                PageRealWidth: 180,
                pageRealWidthV3: 80,
                Gtype: 0,
                HeaderList: [
                    { Content: '线上订单', Columns: 1, RowNum: 1, Align: 1, FontStyleType: 1, Width: 0, TextFontSize: 9 },
                    { Content: '测试店铺', Columns: 1, RowNum: 1, Align: 1, FontStyleType: 1, Width: 0, TextFontSize: 10 },
                    { Content: '单号：001', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 8, FontStyleType: 0 },
                    { Content: '销售时间：' + this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'), Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 8, FontStyleType: 0 },
                    { Content: '-------------------------------------', Columns: 1, RowNum: 1, Align: 0, FontStyleType: 1, Width: 0, TextFontSize: 9 }
                ],
                BodyList: [
                    { Content: '商品,数量,单价,小计', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '㊣五花肉（2斤）,0,0.0,0.0', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 }
                ],
                TitleList: [
                    { Content: '商品', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 8, TextFontSize: 9, RowMaxLength: 10 },
                    { Content: '数量', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 5, TextFontSize: 9, RowMaxLength: 10 },
                    { Content: '单价', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 5, TextFontSize: 9, RowMaxLength: 10 },
                    { Content: '小计', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 6, TextFontSize: 9, RowMaxLength: 10 }
                ],
                FooterList: [
                    { Content: '-------------------------------------', Columns: 1, RowNum: 1, Align: 0, FontStyleType: 1, Width: 0, TextFontSize: 9 },
                    { Content: '合计：           ￥0.00', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '-------------------------------------', Columns: 1, RowNum: 1, Align: 0, FontStyleType: 1, Width: 0, TextFontSize: 9 },
                    { Content: '应收金额：       ￥0.00', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '在线付款：       ￥0.00', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '-------------------------------------', Columns: 1, RowNum: 1, Align: 0, FontStyleType: 1, Width: 0, TextFontSize: 9 },
                    { Content: '打印时间：2022-04-25 13:24:12', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '店铺号码：15968188766', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '收货人：某某先生', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '联系方式：137****8587', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '收货地址：广州市*****镇', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '163737房放门口即可 ', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '二横路往左****米转右（', Columns: 1, RowNum: 1, Align: 0, TextFont: 0, Width: 0, TextFontSize: 9, FontStyleType: 0 },
                    { Content: '-------------------------------------', Columns: 1, RowNum: 1, Align: 0, FontStyleType: 1, Width: 0, TextFontSize: 9 },
                    { Columns: 1, RowNum: 1, RowMaxLength: 10, Align: 0, TextFont: 0, FontSize: 9, Width: 0, Content: '768', type: 'barcode', hideText: true }
                ]
            }
        },
        PrintTest() {                           // 打印接口
            stockApi.PrintTest(this.entityPrint).then(res => {
                if (res.success) this.$message.success('调用测打成功！');
            });
        },
        handleFoodSetting(item) {               // 关联菜品
            this.sv_printer_id = item.id;
            stockApi.gtecateringKitchenPrinterProcut({ sv_printer_id: item.id }).then(res => {
                this.checkedCommodity = this.$app.isNull(res) ? [] : res.map(e => { e.rowChecked = true; e.id = e.sv_procut_id; return e });
                this.isCheckedCommodity = true;
            })
        },
        callbackCommodity(obj) {                // 关联菜品回调
            this.productForm = this.$app.isNull(obj) ? [] : obj.map(e => {
                let obj = {
                    sv_kitchen_printer_id: e.sv_kitchen_printer_id || '',                  // 关联id
                    sv_printer_id: this.sv_printer_id,                                     // 厨房打印方案主键id
                    sv_procut_id: e.id,                                                    // 商品id
                    productcategory_id: e.productcategory_id,                              // 分类id
                }
                // 关联过的商品 给该商品sv_kitchen_printer_id赋值
                const item = this.checkedCommodity.find(item => item.id == e.product_id);
                !this.$app.isNull(item) && (obj.sv_kitchen_printer_id = item.sv_kitchen_printer_id)
                // 没有关联id的删除关联id参数 不然会报错
                this.$app.isNull(obj.sv_kitchen_printer_id) && delete obj.sv_kitchen_printer_id
                return obj
            });
            stockApi.editKitchenProduct({ list: this.productForm, printerId: this.sv_printer_id, isCloudPrint: 1 }).then(res => {
                if (res !== undefined) { this.$message.success('关联商品成功'); }
            })
        },

        //#endregion

        //#region 获取数据

        getStoreData() {                        // 获取门店数据
            stockApi.getCommonBranchStorelist({ self: true }).then(res => {
                if (res) {
                    this.storeData = this.$app.isNull(res) ? [] : res.map(e => { return { value: e.user_id, label: e.sv_us_name } });
                }
            });
        },
        getBrandData() {                        // 获取设备品牌
            stockApi.GetPrinterBrand().then(res => {
                if (res) {
                    this.brandData = this.$app.isNull(res) ? [] : res.map(e => { return { value: e.brand_id, label: e.brand + e.name } })
                }
            });
        },
        getTypeData() {                         // 获取设备类型
            this.typeData = [
                { label: '前台小票', value: '0' }
            ]
            // 6-棋牌茶楼 27-餐饮行业
            const excludedIndustry = [6, 27]
            if (excludedIndustry.includes(this.$store.state.userInfo.sv_us_industrytype)) {
                this.typeData.push({ label: '后厨小票', value: '1' })
            }
        },
        getPrintList(type) {                    // 获取后厨打印票据类型

            switch (type) {
                case '0':
                    this.PrintList = [
                        { code: 'Cashier', name: '收银小票', state: false },
                        { code: 'OnlineOrder', name: '线上订单小票', state: false }
                    ];
                    break;
                case '1':
                    this.PrintList = [
                        { code: 'KitchenPlaySingle', name: '厨打总单', state: false },
                        { code: 'KitchenPlaySingle2', name: '厨打分单', state: false },
                        { code: 'KitchenSonSingleTotalSingle', name: '分单总单', state: false },
                        { code: 'ChangeChannels', name: '加菜单', state: false },
                        { code: 'RouseFood', name: '催菜单', state: false },
                        { code: 'FoodBack', name: '退菜单', state: false },
                        { code: 'PushFood', name: '起菜单', state: false },
                        { code: 'AddFood', name: '换台单', state: false }
                    ];
                    break;
                default: break;
            }

        },
        getPageData(id) {                       // 获取列表
            stockApi.GetPrinter({ id: id, userid: this.$store.state.userInfo.user_id }).then(res => {
                this.tabelJson = this.$app.isNull(res) ? [] : res.map(item => {
                    item.modify_time = this.$app.isNull(item.modify_time) ? '' : this.$app.currentTime(new Date(item.modify_time), 'yyyy-MM-dd HH:mm:ss');
                    let typeName = this.typeData.find(e => e.value === item.type).label;
                    return { ...item, typeName };
                });
            })
        },

        //#endregion 
    }
}
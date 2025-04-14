
// import { printBath } from '../../utils'
// import { labelTemplateList, checkedProducts, quotationNo, labelTemplate } from "../../components/index";
// import * as Api from '@/api/newApi/productApi';

import { stockApi } from '@/api/index';
import { printLabel } from '@/utils/prin';
import { labelTemplateList, labelTemplate, checkedCommodity, quotationNo } from '@/components/index'
export default {
    components: { labelTemplateList, labelTemplate, checkedCommodity, quotationNo },
    name: 'labelPrint',
    data() {
        return {
            printDevice: [],                 // 打印机数据集合
            isLabelTemplateList: false,      // 显示选择模板
            printData: {
                checkedLabelTemplate: '',        // 选中的模板
                labelColumn: 1,                  // 每行标签数
                printName: '',                   // 选择的打印机名称
                paperType: '1'                   // 纸张类型
            },

            isCheckPrintNumber: true,        // 打印份数（默认可售库存数）
            isCheckedProducts: false,        // 显示选择商品
            tableJson: [],                   // 商品列表
            scanProduct: '',                 // 扫描商品
            printNumber: 1,                  // 批量打印数
            query: {
                page: 1,                         // 页数
                pageSize: 10,                    // 页码

            },
            // total: 10,                       // 总数

            isQuotationNo: false,            // 选择单号
            quotationNoJson: {},             // 选中的单号
            checkedJson: []                  // 选中的商品
        }
    },
    computed: {
        showData: function () {             // 显示的table数据
            let stat = (this.query.page - 1) * this.query.pageSize;
            let end = this.query.page * this.query.pageSize;
            return this.$app.isNull(this.tableJson) ? [] : this.tableJson.slice(stat, end);
        },
        total: function () {
            return this.$app.isNull(this.tableJson) ? 0 : this.tableJson.length;
        },
        labelPring: function () {                                                     // ID
            return this.$app.isNull(this.$route.query.type) ? '' : this.$route.query.type;
        }
    },
    watch: {
        printNumber: function (newVal, oldVal) {    // 监听批量打印数值-改变的时候统一改变打印份数
            this.isCheckPrintNumber = false;
            this.tableJson = this.tableJson.map(e => {
                return { ...e, num: newVal };
            });
        },
        checkedJson: {                                               // 监听传输过来的数据
            deep: true,
            handler: function (newVal, oldVal) {
                if (!this.$app.isNull(newVal)) {
                    this.tableJson = this.$app.isNull(this.tableJson) ? [] : this.tableJson.map(e => {
                        let rowChecked = newVal.findIndex(k => k.product_id === e.product_id) > -1 ? true : false;
                        return { ...e, rowChecked };
                    });
                }
            }
        }
    },
    mounted() {
        this.getPrintDevice();                      // 获取打印机数据
    },
    methods: {
        handleEmpty() {                                         // 清空商品
            this.tableJson = [];
            this.checkedJson = [];
        },
        hanldeDelete() {                                        // 批量移除
            if (this.$app.isNull(this.checkedJson)) return;
            let that = this;
            this.tableJson = this.tableJson.filter(e => that.checkedJson.findIndex(k => k.product_id === e.product_id) === -1);
            this.checkedJson = [];
            this.$refs.labelPrintEntry && this.$refs.labelPrintEntry.onReset();
        },
        handleSelectAll(data, checkedBool) {                    // 表格全选 
            let that = this, json = [...this.checkedJson];
            if (checkedBool) {
                this.showData.forEach(item => {
                    if (that.checkedJson.findIndex(e => e.id === item.id) === -1) json.push(item);
                });
            } else {
                json = json.filter(item => that.showData.findIndex(e => e.id === item.id) === -1)
            }
            this.checkedJson = json;
        },
        handleSellect(row, data, checkedBool) {                 // 表格单选
            if (checkedBool) {
                if (this.checkedJson.findIndex(e => e.id === row.id) === -1)
                    this.checkedJson.push(row);
            } else {
                this.checkedJson = this.checkedJson.filter(e => e.id !== row.id);
            }
        },
        handleCallbackLabelTemplateList(item) {                 // 选中的模板
            this.printData.checkedLabelTemplate = item;
        },
        handleOpenPage() {                                      // 新建模板
            window.parent.location.href = '/System/comsetpage_N3?url=/vueview/priceTag/priceTag.html?addtem=yes'
        },
        getPrintDevice() {                                      // 获取打印机数据
            if (typeof Cef !== 'undefined') {
                if (typeof Cef.GetLocalPrinters !== 'undefined') {
                    var printDevice = Cef.GetLocalPrinters()
                    this.printDevice = JSON.parse(printDevice)
                }
            }
        },
        handleAddProd(e) {                                      // 扫描添加商品
            if (e.keyCode === 13) {
                e.preventDefault();
                let query = { page: 1, pagesize: 1, user_id: this.$store.state.userInfo.user_id, category: '', erjicategory: '', keywards: this.scanProduct }
                stockApi.getProductList(query).then(res => {
                    if (!this.$app.isNull(res.list)) {
                        // let obj = res.list[0];
                        // let json = this.tableJson.filter(e => e.product_id !== obj.product_id);
                        // obj.num = this.isCheckPrintNumber ? obj.sv_p_storage < 0 ? 0 : obj.sv_p_storage : this.printNumber;
                        // json.unshift(obj);
                        // this.tableJson = json;
                        res.list.map(item => {
                            this.tableJson.filter(e => e.product_id !== item.product_id);
                            item.num = this.isCheckPrintNumber ? item.sv_p_storage < 0 ? 0 : item.sv_p_storage : this.printNumber;
                            this.tableJson.unshift(item);
                        })
                    }
                });
            }
        },
        handleCallbackCheckedProducts(json) {       // 选中的商品
            // let idJson = this.tableJson.map(e => { return e.product_id });
            let item = this.tableJson.filter(e => this.$app.isNull(e.sv_pc_noid) === false);
            json.forEach(e => {
                let obj = { ...e };
                obj.num = this.isCheckPrintNumber ? e.sv_p_storage < 0 ? 0 : e.sv_p_storage : this.printNumber;
                item.push(obj);
            });
            this.tableJson = item;
            this.$refs.labelPrintEntry && this.$refs.labelPrintEntry.onReset();
        },
        handleChange() {                            // 设置打印份数
            this.tableJson = this.isCheckPrintNumber ? this.tableJson.map(e => { return { ...e, num: e.sv_p_storage }; }) : this.tableJson.map(e => { return { ...e, num: this.printNumber }; })
        },
        handleDelete(row) {                         // 移除数据
            this.tableJson = this.tableJson.filter(e => e.product_id !== row.product_id);
            this.checkedJson = this.checkedJson.filter(e => e.product_id !== row.product_id);
        },
        handleQuotationNo(item) {                   // 选择单据回调
            if (item.data.id !== this.quotationNoJson.id && item.data.code !== this.quotationNoJson.code) {
                this.quotationNoJson = item.data;
                //#region 查询单据内的商品出来
                let json = this.tableJson.filter(e => this.$app.isNull(e.sv_pc_noid) === true);
                item.list.forEach(e => {
                    let obj = { ...e };
                    obj.num = this.isCheckPrintNumber ? e.sv_p_storage < 0 ? 0 : e.sv_p_storage : this.printNumber;
                    obj.product_id = e.sv_pc_id + e.sv_pc_noid;
                    obj.sv_pc_noid = e.sv_pc_noid;
                    obj.id = e.product_id;
                    json.push(obj);
                });
                this.tableJson = json;
                this.$refs.labelPrintEntry && this.$refs.labelPrintEntry.onReset();
            }
        },
        handleSizeChange(item) {                    // 分页更改页码
            this.query.pageSize = item;
        },
        handleCurrentChange(item) {                 // 分页更改页数
            this.query.page = item;
        },
        handlePrint() {                             // 确定打印
            if (this.$app.isNull(this.printData.checkedLabelTemplate)) { return this.$message({ type: 'warning', message: '请选择打印模板' }) }
            if (this.$app.isNull(this.printData.printName)) { return this.$message({ type: 'warning', message: '请选择打印机' }) }
            if (this.$app.isNull(this.tableJson)) { return this.$message({ type: 'warning', message: '请添加需要打印的商品' }) }
            printLabel({
                data: this.tableJson,
                tem: this.printData.checkedLabelTemplate,
                printName: this.printData.printName,
                dir: '0',
                columnNum: this.printData.labelColumn,
                userInfo: this.$store.state.userInfo
            });
        },
        setLabelData() {
            let item = [];
            let list = this.$store.getters.getLabelData;
            list.forEach(e => {
                let obj = { ...e };
                obj.num = this.isCheckPrintNumber ? e.sv_p_storage < 0 ? 0 : e.sv_p_storage : this.printNumber;
                obj['product_id'] = e.id;
                item.push(obj);
            });
            this.tableJson = item;
            this.$refs.labelPrintEntry && this.$refs.labelPrintEntry.onReset();
        },
    }
}

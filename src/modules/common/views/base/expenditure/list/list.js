import { basicApi, stockApi } from "@/api/index.js";
import notImg from '@/assets/images/default.png';
import { ImgPopover } from '@/components/index';
import { ImportImg } from "@/components/index";
import { mapState } from "vuex";
export default {
    components: { ImgPopover, ImportImg },
    name: 'expendList',
    data() {
        return {
            activeName: '/expendList',                  // 当前选中的菜单name
            paramData: [],                              // 传递到时间组件的默认时间
            query: {
                user_id: '',                            // 门店id
                EcategoryId: '-1',
                second_category_id: 0,                  // 二级分类
                PageIndex: 1,                           // 页码
                PageSize: 10,                           // 每页条数
                BeginDate: '',
                EndDate: ''
            },
            categorySelected: {
                list: []
            },
            storeList: [],                              // 门店数据
            category: [],                               // 分类数据（一级+二级）
            total: 0,                                   // 数据总长度
            totalMoney: 0,                              // 数据总金额
            dataJson: [],                               // 表格数据
            updateData: {                               // 详情
                e_expenditure_money: '',                    // 总支出
                e_expendituredate: '',                      // 日期
                e_expenditure_node: '',                     // 备注
                imgList: [],
            },
            imgList: [],                                 // 图片上传组件 图片列表
            updateWindowStatus: false,                  // 修改支出弹窗状态
            updateDataChange: false,                    // 待修改数据是否修改
            secondVisible: false,                       // 添加二级分类弹窗状态
            categoryInput: '',                          // 添加二级分类输入框
            updateCategorySelected: {                   // 修改后的分类
                label: '',
                value: ''
            },
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Product', isCompress: true } },       // 上传图片组件的初始参数
            verifyJson: { fileNumber: 3, photoExt: ['.jpg', '.png'], fileSize: 1024, viewElement: 'click' },       // 上传图片组件的验证条件
        }
    },
    computed: {
        ...mapState(['JurisdictionObj']),
        secondCategoryJson() {
            let categoryItem = this.category.find(item => item.value === this.query.EcategoryId);
            let json = this.$app.isNull(categoryItem) ? [] : this.$app.isNull(categoryItem.chilren) ? [] : categoryItem.chilren;
            json.unshift({ label: '全部', value: 0 });
            return json;
        }
    },
    watch: {
        'query.EcategoryId': {                          // 监听分类id是否发生变化
            handler(newVal, oldVal) {
                this.query.PageIndex = 1;
                this.query.second_category_id = 0;
                this.getDataList();
            }
        },
        'query.user_id': {                              // 监听门店id是否发生变化
            handler(newVal, oldVal) {
                this.query.PageIndex = 1;
                this.query.EcategoryId = '-1';
                this.query.Pagsecond_category_ideIndex = 0;
                this.getDataList();
                this.getCategory();
            }
        },
        'query.second_category_id': {                   // 监听二级分类是否发生变化
            handler(newVal, oldVal) {
                this.query.PageIndex = 1;
                this.getDataList();
            }
        },
        updateWindowStatus: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.updateDataChange = false;
                }
            }
        },
        secondVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.categoryInput = '';
                }
            }
        },
        updateData: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal && oldVal.e_expenditureid) {
                    this.updateDataChange = true;
                }
            }
        }
    },
    mounted() {
        if (!this.JurisdictionObj.ExpAdd || !this.JurisdictionObj.ExpInfo) return this.$message.warning('无权限查看')
        this.getCategory();                             // 获取分类
        this.getDataList();                             // 获取表格数据
        this.getstore_list();                           // 获取门店数据
        this.$nextTick(() => {
            this.query.user_id = this.$app.isNull(this.query.user_id) ? this.$store.state.userInfo.user_id + '' : this.query.user_id;
        })
    },
    methods: {
        callbackImportImg(val) {                        // 上传图片组件回调函数
            this.imgList = val;
            this.updateData.imgList = val;
            this.updateDataChange = true;
        },
        handleClick(val) {
            this.$router.push(val.name);
            // setTimeout(() => {
            // }, 200)
        },
        handleExport() {                                // 导出
            if (!this.JurisdictionObj.ExpExport) return this.$message.warning('无权限导出')
            basicApi.PostExportData(this.query).then(res => {
                if (res !== false) {
                    this.$app.downloadUrl(res);
                }
            });
        },
        handleChangeTime(date) {                        // 选择制单日期-设置起止时间
            this.query.BeginDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd') + ' 00:00:00';
            this.query.EndDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd') + ' 23:59:59';
            this.query.PageIndex = 1;
            this.getDataList();
        },
        updateRow(index) {                              // 表格行修改
            if (!this.JurisdictionObj.ExpUpdate) return this.$message.warning('无权限修改')
            this.updateWindowStatus = true;
            this.updateData = JSON.parse(JSON.stringify(this.dataJson[index]));
            this.updateCategorySelected = this.category.find(e => e.value === this.dataJson[index].parentid);
            this.updateCategorySelected.chilren = this.updateCategorySelected.chilren.map(e => {
                return {
                    ...e,
                    isSelected: e.value === this.updateData.e_expenditureclass
                }
            });
        },
        deleteRow(index) {                              // 表格行删除
            if (!this.JurisdictionObj.ExpDelete) return this.$message.warning('无权限删除')
            this.$confirm('确认要删除这条支出吗？').then(_ => {
                basicApi.deleteExpenditureNo({ id: this.dataJson[index].id }).then(res => {
                    if (res !== false) {
                        this.$message({ message: '删除成功', type: 'success' });
                        this.query.PageIndex = 1;
                        this.getDataList();
                    }
                });
            }).catch(_ => {

            });
        },
        handleClose() {
        },
        handleCurrentChange(page) {                     // 改变页码
            this.query.PageIndex = page;
            this.getDataList();
        },
        handleSizeChange(pageSize) {                    // 改变条数
            this.query.PageSize = pageSize;
            this.getDataList();
        },
        getCategory(afterAdd = false) {                 // 获取分类
            basicApi.GetCategory_list({ u_id: this.query.user_id }).then(res => {
                let json = this.$app.isNull(res) ? [] : res.map(e => { return { value: e.ecategoryid, label: e.ecategoryname, pvalue: e.superiorecategoryid } });
                this.category = this.$app.isNull(json) ? [] : this.$app.toTree('pvalue', 'value', json);
                if (afterAdd) {
                    this.updateCategorySelected = this.category.find(e => e.value === this.updateCategorySelected.value);
                    this.updateCategorySelected.chilren = this.updateCategorySelected.chilren.map(e => {
                        return {
                            ...e,
                            isSelected: e.value === this.updateData.e_expenditureclass
                        }
                    });
                }
            });
        },
        getDataList() {                                 // 获取支出记录
            basicApi.PostExpenditureList(this.query).then(res => {
                this.total = res.values.total;
                this.totalMoney = res.values.sv_expenditure_amount;
                this.dataJson = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                    e.e_expendituredate = this.$app.currentTime(new Date(e.e_expendituredate), 'yyyy-MM-dd HH:mm:ss');
                    e.imgList = this.$app.isNull(e.e_expenditurepic) ? [] : JSON.parse(e.e_expenditurepic);
                    e.e_expenditurepic = e.imgList.map(e => (this.$app.getImgUrl(e)));
                    return { ...e, id: e.e_expenditureid, }
                });
                this.$nextTick(() => { this.$refs.myTable && this.$refs.myTable.onReset(); })
            });
        },
        getstore_list() {                               // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
            });
        },
        changeCategory() {
            this.updateCategorySelected.chilren && this.updateCategorySelected.chilren.map(e => {
                e.isSelected = false;
            })
        },
        addSecond() {                                   // 添加二级分类
            let queryData = {
                ecategoryname: this.categoryInput,
                superiorecategoryid: this.updateCategorySelected.value
            }
            basicApi.addCategory(queryData).then(res => {
                if (this.$app.isNull(res)) return;
                this.$message({ message: '添加成功', type: 'success' });
                this.secondVisible = false;
                this.getCategory(true);
            });
        },
        handleSecondItem(index) {
            this.updateCategorySelected.chilren = this.updateCategorySelected.chilren.map((e, i) => {
                e.isSelected = false;
                if (index === i) {
                    e.isSelected = true;
                    this.updateData.e_expenditureclass = e.value;
                    this.updateData.e_expenditureclassname = e.label;
                }
                return {
                    ...e
                }
            });
        },
        submitUpdate() {                                // 提交修改
            if (this.$app.isNull(this.updateCategorySelected.value)) return this.$message({ message: '请选择分类', type: 'warning' });
            if (this.$app.isNull(this.updateData.e_expenditure_money)) return this.$message({ message: '请输入金额', type: 'warning' });
            if (this.updateCategorySelected.chilren.length < 1 || !this.updateCategorySelected.chilren.find(e => e.isSelected === true)) {
                return this.$message({ message: '请选择分类', type: 'warning' })
            }
            if (!this.updateDataChange) {
                // 数据未更改
                this.updateWindowStatus = false;
                return
            }
            this.updateData.e_expenditurename = this.updateCategorySelected.label + '-' + this.updateData.e_expenditureclassname;
            this.updateData.e_expenditurepic = JSON.stringify(this.updateData.imgList);
            this.updateData.parentid = this.updateCategorySelected.value;
            delete this.updateData.imgList
            basicApi.addExpenditure(this.updateData).then(res => {
                if (this.$app.isNull(res)) return;
                this.getDataList();
                this.updateWindowStatus = false;
                res ? this.$message({ message: '修改成功', type: 'success' }) : this.$message.error('修改失败');
            });
        }
    }
};
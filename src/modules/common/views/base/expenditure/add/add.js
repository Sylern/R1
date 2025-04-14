import base from '@/api/base';
// import echarts from 'echarts';
import { basicApi } from "@/api/index.js";
import { ImportImg } from "@/components/index";
import { mapState } from 'vuex';
export default {
    components: { ImportImg },
    name: 'expendAdd',
    data() {
        return {
            activeName: '/expendAdd',                               // 当前选中的订单
            categoryPopVisiable: false,                             // 分类设置展示
            popFirstSelected: {                                     // 弹窗分类设置一级菜单选中
                index: 0
            },
            firstVisible: false,                                    // 添加一级分类弹窗状态
            secondVisible: false,                                   // 添加二级分类弹窗状态
            categoryInput: '',                                      // 新增分类输入框
            updateVisible: false,                                   // 修改分类弹窗状态
            waitingUpdate: {                                        // 待修改的分类
                label: '',
                value: '',
                isSecond: false
            },
            categorySelected: {                                     // 已选中一级分类
                index: 0,
                list: []
            },
            secondSelected: {},                                     // 已选中二级分类
            category: [],                                           // 分类数据（一级+二级）
            dateMenuPos: 0,
            dateList: [
                {
                    text: '今日',
                    value: '1'
                },
                {
                    text: '本周',
                    value: '7'
                },
                {
                    text: '本月',
                    value: '30'
                },
                {
                    text: '今年',
                    value: '365'
                }
            ],
            totalMoney: 0,                                          // 图表总金额
            color: ['#506FEF', '#3992F9', '#FCD866', '#F79C2C', '#01FE99', '#34CBFF', '#107DFE', '#AB5BFA'],
            dataEcharts: [],
            // dataEcharts: [{ "value": "100.00", "name": "现金" }, { "value": "150.00", "name": "银行卡" }],
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            submitData: {                                           // 添加支出
                inputMoney: '',
                dateTime: this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                imgList: [],
                remark: ''
            },
            expenditureList: [],                                    // 支出记录
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Product', isCompress: true } },       // 上传图片组件的初始参数
            verifyJson: { fileNumber: 3, photoExt: ['.jpg', '.png'], fileSize: 1024, viewElement: 'click' },       // 上传图片组件的验证条件
        }
    },
    computed: {
        ...mapState(['JurisdictionObj'])
    },
    watch: {
        firstVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.categoryInput = '';
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
        updateVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.categoryInput = this.waitingUpdate.label;
                }
            }
        },
        dateMenuPos: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.getCategoryCartogram();
                }
            }
        },
    },
    mounted() {
        if (!this.JurisdictionObj.ExpAdd || !this.JurisdictionObj.ExpAnalysis) return this.$message.warning('无权限查看')
        this.getCategory();                             // 获取分类
        this.getCategoryCartogram();                    // 获取图表数据
        this.getexpenditureList();                      // 获取支出记录
    },
    activated() {

    },
    methods: {
        handleClick(val) {                              // 切换菜单
            this.$router.push(val.name);
        },
        handleCategorySetting() {                       // 打开分类设置
            this.categoryPopVisiable = true;
            if (this.category.length) this.popFirstSelected = this.categorySelected;
        },
        handleCategoryPopItem(item) {                   // 分类设置切换选中一级分类
            this.popFirstSelected = item;
        },
        changeCategory() {
            this.categorySelected.list.forEach(e => {
                e.isSelected = false;
            })
            this.secondSelected = {};
        },
        handleDateChange(index) {                       // 修改中间展示图标时间
            if (this.dateMenuPos = index) return;
            this.dateMenuPos = index;
        },
        handleSecondItem(index) {
            this.categorySelected.list.forEach((e, i) => {
                e.isSelected = false;
                if (index === i) {
                    e.isSelected = true;
                    this.secondSelected = e;
                };
            });
        },
        handleInputMoney({ target }) {
            target.value = this.$app.verifyDecimal(target.value, 5);
            this.submitData.inputMoney = this.submitData.inputMoney * 1 > 99999999.99 ? 99999999.99 : this.submitData.inputMoney;
        },
        handleFirstAdd() {
            if (!this.JurisdictionObj.AddExpCategory) return this.$message.warning('无权限新增大类')
            this.firstVisible = true
        },
        callbackImportImg(val) {                        // 上传图片组件回调函数
            this.submitData.imgList = val;
        },
        dataExpend() {
            var charts = echarts.init(this.$refs.dataExpend); charts.clear();
            charts.setOption({
                color: this.color,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '20',
                    left: 'center'
                },
                title: {
                    text: this.totalMoney + "元",
                    left: "center",
                    top: "center",
                    textStyle: {
                        color: "#333333",
                        fontSize: 24,
                        align: "center",
                        fontWeight: 700
                    },
                    subtext: '总金额',
                    subtextStyle: {
                        color: "#999999",
                        fontSize: 18,
                        align: "center",
                        fontWeight: 700
                    },
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.dataEcharts
                    }
                ]
            })
        },
        addCategory(categoryId = '') {                  // 添加分类
            let queryData = {
                ecategoryname: this.categoryInput
            }
            if (!this.$app.isNull(categoryId)) {
                // 二级分类新增
                queryData.superiorecategoryid = categoryId;
            }
            basicApi.addCategory(queryData).then(res => {
                if (this.$app.isNull(res)) return;
                this.firstVisible = false;
                this.secondVisible = false;
                this.$message({ message: '添加成功', type: 'success' });
                this.getCategory(categoryId);
            });
        },
        getCategory(afterSecond = false) {              // 获取分类
            basicApi.getCategory().then(res => {
                this.category = [];
                if (this.$app.isNull(res)) return;
                let categroyPos = -1;
                res.forEach((e, i) => {
                    // 父级分类id为0 表示一级分类
                    if (e.superiorecategoryid == 0) {
                        categroyPos++;
                        let item = {
                            index: categroyPos,
                            value: e.ecategoryid,
                            label: e.ecategoryname,
                            list: []
                        }
                        this.category.push(item)
                    } else {
                        let categoryItem = this.category.find(val => val.value === e.superiorecategoryid);
                        if (categoryItem) {
                            let item = {
                                value: e.ecategoryid,
                                label: e.ecategoryname,
                                isSelected: false
                            }
                            categoryItem.list.push(item);
                        };
                    }
                });
                let categoryPos = this.categorySelected.index;
                let popFirstPos = this.popFirstSelected.index;
                if (this.category.length > 0) {
                    if (this.categoryPopVisiable) {
                        if (!afterSecond) {
                            popFirstPos = 0
                        };
                        this.popFirstSelected = this.category[popFirstPos];
                    }
                    this.categorySelected = this.category[categoryPos];
                } else {
                    this.categorySelected = {
                        index: 0,
                        list: []
                    }
                    this.secondSelected = {};
                    this.popFirstSelected = {
                        index: 0,
                        list: []
                    };
                }
            });
        },
        handelUpdateFirst(item) {                       // 打开修改一级分类
            this.updateVisible = true;
            this.waitingUpdate.isSecond = false;
            this.waitingUpdate.label = item.label;
            this.waitingUpdate.value = item.value;
        },
        handelUpdateSecond(item) {                      // 打开修改二级分类
            this.updateVisible = true;
            this.waitingUpdate.isSecond = true;
            this.waitingUpdate.label = item.label;
            this.waitingUpdate.value = item.value;
        },
        submitUpdate() {                                // 提交修改分类
            let queryData = {
                ecategoryid: this.waitingUpdate.value,
                ecategoryname: this.categoryInput
            }
            basicApi.addCategory(queryData).then(res => {
                if (this.$app.isNull(res)) return;
                this.updateVisible = false;
                this.$message({ message: '修改成功', type: 'success' });
                this.getCategory(this.categoryInput);
                this.getexpenditureList();
            });
        },
        deleteCategory(item, isSecond) {                // 删除分类
            let queryData = {
                id: item.value,
            }
            this.$confirm('确认要删除"' + item.label + '"分类吗？').then(_ => {
                basicApi.isCategory(queryData).then(res => {
                    if (res === true) return this.$message({ message: '该分类正在使用中，不能删除!', type: 'warning' });
                    basicApi.deleteCategory(queryData).then(res => {
                        if (this.$app.isNull(res)) return;
                        this.$message({ message: '删除成功', type: 'success' });
                        this.getCategory(isSecond);
                    });
                });
            }).catch(_ => {

            });
        },
        addExpenditure() {                              // 新增支出
            if (this.category.length < 1) return this.$message({ message: '还未添加分类，请点击分类设置，去添加分类', type: 'warning' });
            if (this.$app.isNull(this.secondSelected.value)) return this.$message({ message: '请选择分类', type: 'warning' });
            if (this.$app.isNull(this.submitData.inputMoney)) return this.$message({ message: '请输入金额', type: 'warning' });
            if (this.$app.isNull(this.submitData.dateTime)) return this.$message({ message: '请选择时间', type: 'warning' });
            let queryData = {
                e_expendituredate: this.$app.currentTime(new Date(this.submitData.dateTime), 'yyyy-MM-dd HH:mm:ss'),           // 支出时间
                e_expenditurename: this.categorySelected.label + '-' + this.secondSelected.label,
                e_expenditure_money: this.submitData.inputMoney,                // 支出金额
                e_expenditure_node: this.submitData.remark,                     // 支出备注
                e_expenditureclass: this.secondSelected.value,                  // 支出二级id
                e_expenditurepic: this.$app.isNull(this.submitData.imgList) ? '' : JSON.stringify(this.submitData.imgList)     // 支出图片
            }
            basicApi.addExpenditure(queryData).then(res => {
                if (this.$app.isNull(res)) return;
                this.getexpenditureList();
                this.submitData.inputMoney = "";
                this.submitData.remark = "";
                this.submitData.dateTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.$message({ message: '添加成功', type: 'success' });
                this.getCategoryCartogram();
            });
        },
        getCategoryCartogram() {                        // 获取图表数据
            let timeframe = this.$app.currentTimeFrame(this.dateMenuPos);
            let queryData = {
                BeginDate: timeframe[0],
                EndDate: timeframe[1]
            }
            this.dataEcharts = [];
            basicApi.getCategoryCartogram(queryData).then(res => {
                if (this.$app.isNull(res)) return;
                this.totalMoney = 0;
                this.dataEcharts = res.map(e => {
                    this.totalMoney = this.$app.addNumber(this.totalMoney, e.e_expenditure_money);
                    return {
                        name: e.ecategoryname,
                        value: this.$app.moneyFixed(e.e_expenditure_money, 2)
                    }
                });
                this.dataExpend();
            });
        },
        getexpenditureList() {                          // 获取支出记录（近期5笔）
            basicApi.getexpenditureList({ PageSize: 5 }).then(res => {
                if (res !== false) {
                    this.expenditureList = res.map(e => {
                        let categroyText = e.e_expenditurename.indexOf('-') > -1 ? e.e_expenditurename.split('-')[0] : '';
                        return {
                            ...e,
                            categroyText,
                            e_expendituredate: this.$app.currentTime(new Date(e.e_expendituredate), 'yyyy-MM-dd HH:mm:ss')
                        }
                    })
                }
            });
        }
    }
};
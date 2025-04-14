import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    components: { gridManager },
    data() {
        return {
            storeList: [],                          // 门店数据
            classifyOneData: [],                    // 一级分类
            staffList: [],                          // 员工数据
            paymentList: [],                        // 支付方式
            staffEntity: {                          // 员工数据查询实体
                user_id: '',                                // 店铺查询
                user_type: 0,                               // 店铺类别 0 - 当前店铺  1 - 二级门店 2 - 三级门店
                type: '-2',                                 // 店铺类型 -2 -全部  0 - 直营 1 - 加盟 //3 - 联谊 4 - 租贷
                sv_grouping_list: [],                       // 岗位
                date_type: 0,                               // 入职时间类型 0 - 默认  1 - 星期 2 - 半个月 3 - 一个月 4 - 开始
                start_date: '',                             // 开始时间
                end_date: '',                               // 结束时间
                state_list: [],                             // 状态 0 - 默认 1 - 在职 2 - 离职 3 - 调店 4 - 兼职
                keywards: '',                               // 工号 - 名称 - 电话查询
                page: 1,                                    // 页码
                pagesize: 999                               // 页数
            },
            queryEntity: {                          // 查询实体
                CommissionType: 2,                      // 2-商品业绩
                EmployeeId: '',                         // 员工id
                IsRefund: null,                         // 订单状态 null-全部 true-是退款 false-正常订单
                ShopIds: '',                            // 店铺id集合
                PtIdS: -1,                              // 商品一级分类
                ProductFilter: '',                      // 筛选条件
                StartDate: '',                          // 开始时间
                EndDate: '',                            // 结束时间
                PaymentFilter: '',                      // 支付方式
                PageIndex: 1,                           // 页码
                PageSize: 10,                           // 页数
            },
            summaryData: {},                            // 汇总数据
            total: 0,
            gridOption: {
                gridManagerName: 'commodityAch',
                skinClassName: 'gridManagerTable',
                firstLoading: false,
                supportCheckbox: false,
                supportMenu: false,
                i18n: "zh-cn",
                disableBorder: true,
                disableLine: true,
                supportDrag: false,
                supportAdjust: false,
                maxHeight: '100%',
                height: 'auto',
                lineHeight: '54px',
                columnData: [
                    { key: 'employeeName', text: '员工', align: 'center', width: '110px' },
                    { key: 'orderRunningId', text: '流水单号', align: 'center', width: '150px', template: (cell) => { return `<el-tooltip class="item" effect="dark" content="${cell}" placement="right"><span class="tooltip">${cell}</span></el-tooltip>` } },
                    { key: 'operateType', text: '操作类型', align: 'center', width: '150px', template: (cell) => { return `<el-tooltip class="item" effect="dark" content="${cell}" placement="right"><span class="tooltip">${cell}</span></el-tooltip>` } },
                    { key: 'productName', text: '商品名称', align: 'center', width: '150px', template: (cell) => { return `<el-tooltip class="item" effect="dark" content="${cell}" placement="right"><span class="tooltip">${cell}</span></el-tooltip>` } },
                    { key: 'productNumber', text: '数量', align: 'center' },
                    { key: 'isAssign', text: '是否指定', align: 'center' },
                    { key: 'memberType', text: '客户类型', align: 'center' },
                    { key: 'payment', text: '付款方式', align: 'center' },
                    { key: 'originMoney', text: '原订单金额', align: 'center' },
                    { key: 'money', text: '销售金额', align: 'center', template: (cell, row, index, key) => { return row.isRefund ? '-' + cell : cell } },
                    { key: 'refundMoney', text: '退款业绩', align: 'center' },
                    { key: 'showCalcMoney', text: '业绩', align: 'center' },
                    { key: 'createTime', text: '时间', align: 'center', width: '180px' }
                ],
                ajaxData: { data: [] },
            }
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dateTime() {                                    // 默认当前日期
            return [this.queryEntity.StartDate, this.queryEntity.EndDate]
        },
        queryObj() {
            let { CommissionType, EmployeeId, IsRefund, PaymentFilter, ShopIds, PtIdS, ProductFilter, StartDate, EndDate, PageIndex, PageSize } = this.queryEntity;
            let obj = { CommissionType, EmployeeId, IsRefund, PaymentFilter, ShopIds, PtIdS, ProductFilter, StartDate, EndDate, PageIndex, PageSize };
            if (this.$app.isNull(IsRefund)) delete obj.IsRefund;
            if (this.$app.isNull(EmployeeId)) delete obj.EmployeeId;
            obj.ShopIds = this.$app.isNull(ShopIds) ? this.storeList.filter(e => e.value !== '').map(e => { return e.value }) : [ShopIds];
            obj.PtIdS = this.$app.isNull(PtIdS) ? [-1] : [PtIdS];
            return obj;
        },
    },
    watch: {
        'queryEntity.ShopIds': {
            deep: true, immediate: true, handler(newVal, oldVal) {
                this.queryEntity.EmployeeId = '';
                if (newVal === -1) this.staffList = [{ label: '全部', value: '' }];
                else this.staffEntity.user_id = newVal, this.GetUserEmployeeOperatorList();
            }
        }
    },
    mounted() {
        if (this.userInfo.sv_us_industrytype !== 1) {
            setTimeout(() => {
                this.$gridManager.hideTh('commodityAch', 'isAssign');
            }, 100)
        }
        this.getstore_list();                           // 获取门店信息
        this.getUserPayment();                          // 获取支付方式
        this.getProductcategory();                      // 获取商品一级分类
        this.queryEntity.StartDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.EndDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    },
    methods: {
        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.StartDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.EndDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.PageIndex = 1;
            this.handleSearch();
        },
        handleSearch() {                                    // 查询
            this.queryEntity.PageIndex = 1;
            this.ProductCommission();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                CommissionType: 2,
                EmployeeId: '',
                ShopIds: '',
                PtIdS: -1,
                StartDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                EndDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                PageIndex: 1,
                PageSize: 10
            };
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.PageIndex = index;
            if (type === 'size') this.queryEntity.PageIndex = 1, this.queryEntity.PageSize = index;
            this.ProductCommission();
        },
        handleDownload() {                                  // 导出
            stockApi.ProductCommissionDownload(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },
        //#endregion

        //#region   获取数据
        getProductcategory() {                              // 获取一级分类
            stockApi.getProductcategory({ userid: this.queryEntity.ShopIds, producttype_id: -1 }).then(res => {
                if (res) {
                    this.classifyOneData = this.$app.isNull(res.list) ? [] : res.list.map(e => { return { value: e.id, label: e.sv_pc_name } });
                    this.classifyOneData.unshift({ value: -1, label: '全部' });
                }
            });
        },
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.storeList.unshift({ label: '全部', value: '' });
                this.queryEntity.ShopIds = this.userInfo.user_id + '';
                this.ProductCommission();
            });
        },
        ProductCommission() {                               // 获取商品业绩数据
            stockApi.ProductCommission(this.queryObj).then(res => {
                this.$gridManager.setAjaxData('commodityAch', {
                    data: res.datas.map(item => {

                        let createTime = this.$app.isNull(item.createTime) ? '' : this.$app.currentTime(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss');
                        return { ...item, createTime }
                    })
                });
                let { totalMoney, totalRefundMoney, totalCalcMoney } = res.infos;
                this.summaryData = {
                    totalMoney: this.$app.isNull(totalMoney) ? '' : totalMoney,
                    totalRefundMoney: this.$app.isNull(totalRefundMoney) ? '' : totalRefundMoney,
                    totalCalcMoney: this.$app.isNull(totalCalcMoney) ? '' : totalCalcMoney
                };
                this.total = res.total;
            });
        },
        GetUserEmployeeOperatorList() {                      // 获取员工列表
            stockApi.GetUserEmployeeOperatorList(this.staffEntity).then(res => {
                let item = res.list.find(item => item.user_id === this.staffEntity.user_id);
                this.staffList = this.$app.isNull(item) ? [] : this.$app.isNull(item.list) ? [] : item.list.map(e => { return { label: e.sv_employee_name, value: e.sv_employee_id } });
                this.staffList.unshift({ label: '全部', value: '' });
            });
        },
        getUserPayment() {
            if (this.paymentList.length > 0) return;
            stockApi.getUserPayment().then(res => {
                this.paymentList = this.$app.isNull(res) ? [] : res.map(e => {
                    return {
                        label: e.payment_names,
                        value: e.payment_names
                    }
                })
                this.paymentList.unshift({ label: '全部', value: '' });
            })
        },
        //#endregion
    }
}

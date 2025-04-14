import base from '@/api/base';
import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    name: 'staffAch',
    components: { gridManager },
    data() {
        return {
            imgBase: base.imgUrl,
            frontImgBase: base.frontImgBase,
            storeList: [],                          // 门店数据
            classifyOneData: [],                    // 一级分类
            staffList: [],                          // 员工数据
            queryEntity: {                          // 查询实体
                CommissionType: 5,                      // 6 - 售卡业绩明细
                EmployeeId: '',                         // 员工id
                ShopIds: '',                            // 店铺id集合
                PtIdS: -1,                              // 商品一级分类
                StartDate: '',                          // 开始时间
                EndDate: '',                            // 结束时间
                PageIndex: 1,                           // 页码
                PageSize: 10                            // 页数
            },
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
            total: 0,
            gridOption: {
                gridManagerName: 'staffAch',
                skinClassName: 'gridManagerTable',
                firstLoading: false,
                supportCheckbox: false,
                supportMenu: false,
                i18n: "zh-cn",
                disableBorder: false,
                disableLine: true,
                supportDrag: false,
                supportAdjust: false,
                maxHeight: '100%',
                height: 'auto',
                lineHeight: '54px',
                columnData: [
                    {
                        key: 'employeeName', text: '员工', align: 'center', width: '140px', template() {
                            return '<span>{{row.employeeName}}</span><span v-if="row.employeeId !== 0" class="controlBtn" @click="handleTrial(row)">试算</span>';
                        }
                    },
                    {
                        key: 'total', text: '合计', align: 'center', children: [
                            // { key: 'totalOrderMoney', text: '提成总销售额', align: 'center', remind: '提成订单的销售额总和，扣减退款部分' },
                            { key: 'totalSalesPerformance', text: '总业绩', align: 'center', remind: '业绩订单的业绩总和，扣减退款部分' },
                            { key: 'totalCommission', text: '总提成', align: 'center', remind: '提成订单的提成总和，扣减退款部分' },
                            { key: 'totalOrderCount', text: '总客数', align: 'center', remind: '提成订单的数量总和，不扣减退款部分' },
                            { key: 'avgOrderPrice', text: '客单价', align: 'center', remind: '提成订单的单价平均值，不扣减退款部分' },
                            { key: 'totalAssignOrderCount', text: '指定客数', align: 'center', remind: '指定提成订单的数量总和，不扣减退款部分' },
                            { key: 'assignRate', text: '指定率', align: 'center', remind: '指定提成订单的数量总和占总订单的比例，不扣减退款部分' },
                        ]
                    },
                    {
                        key: 'serviceProduct', text: '服务项目', align: 'center', children: [
                            // { key: 'serviceProduct_orderMoney', text: '服务提成金额', align: 'center', remind: '服务项目的提成销售额总和，扣减退款部分' },
                            { key: 'serviceProduct_salesPerformance', text: '业绩', align: 'center', remind: '服务项目订单获得的业绩总和，扣减退款部分' },
                            { key: 'serviceProduct_commission', text: '提成', align: 'center', remind: '服务项目订单获得的提成总和，扣减退款部分' },
                            { key: 'serviceProduct_count', text: '服务个数', align: 'center', remind: '服务项目订单获得提成的数量总和，扣减退款部分' },
                        ]
                    },
                    {
                        key: 'product', text: '商品销售', align: 'center', children: [
                            // { key: 'product_orderMoney', text: '销售提成金额', align: 'center', remind: '商品销售的提成销售额总和，扣减退款部分' },
                            { key: 'product_salesPerformance', text: '业绩', align: 'center', remind: '商品销售订单获得的业绩总和，扣减退款部分' },
                            { key: 'product_commission', text: '提成', align: 'center', remind: '商品销售订单获得的提成总和，扣减退款部分' },
                            { key: 'product_count', text: '商品个数', align: 'center', remind: '商品销售订单获得提成的数量总和，扣减退款部分' },
                        ]
                    },
                    {
                        key: 'card', text: '充值售卡', align: 'center', children: [
                            // { key: 'card_orderMoney', text: '开卡提成金额', align: 'center', remind: '开卡订单的提成销售额总和，扣减退款部分' },
                            { key: 'card_salesPerformance', text: '业绩', align: 'center', remind: '开卡订单订单获得的业绩总和，扣减退款部分' },
                            { key: 'card_commission', text: '提成', align: 'center', remind: '开卡订单订单获得的提成总和，扣减退款部分' },
                            // { key: 'card_count', text: '开卡数', align: 'center', remind: '开卡订单订单获得提成的数量总和，扣减退款部分' },
                        ]
                    },
                ],
                ajaxData: { data: [] },
            },
            dialogVisible: false,
            currentTrial: {}
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dateTime() {                                    // 默认当前日期
            return [this.queryEntity.StartDate, this.queryEntity.EndDate]
        },
        queryObj() {
            let { CommissionType, EmployeeId, ShopIds, PtIdS, StartDate, EndDate, PageIndex, PageSize } = this.queryEntity;
            let obj = { CommissionType, EmployeeId, ShopIds, PtIdS, StartDate, EndDate, PageIndex, PageSize };
            if (this.$app.isNull(EmployeeId)) delete obj.EmployeeId;
            obj.ShopIds = this.$app.isNull(ShopIds) ? this.storeList.filter(e => e.value !== '').map(e => { return e.value }) : [ShopIds];
            obj.PtIdS = this.$app.isNull(PtIdS) ? [-1] : [PtIdS];
            return obj;
        }
    },
    watch: {
        'queryEntity.ShopIds': {
            deep: true, immediate: true, handler(newVal, oldVal) {
                if (newVal === -1) this.staffList = [{ label: '全部', value: '' }];
                else this.staffEntity.user_id = newVal, this.GetUserEmployeeOperatorList();
            }
        }
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
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
        },
        handleSearch() {                                    // 查询
            this.queryEntity.PageIndex = 1;
            this.CommissionByEmployee();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                CommissionType: 5,
                EmployeeId: '',
                ShopIds: '',
                PtIdS: -1,
                StartDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                EndDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                PageIndex: 1,
                PageSize: 10
            };
        },
        handleTrial(row) {                                  // 点击提成试算
            stockApi.GetCommissionWithCurrentMonthByEmployee({ ...this.queryObj, employeeId: row.employeeId }).then(res => {
                this.currentTrial = res.find(e => e.employeeId === row.employeeId);
                if (this.currentTrial) {
                    this.dialogVisible = true;
                }
            })
        },
        handleCurrentSize() {                               // 页码 - 页数
            if (type === 'current') this.queryEntity.PageIndex = index;
            if (type === 'size') this.queryEntity.PageIndex = 1, this.queryEntity.PageSize = index;
            this.CommissionByEmployee();
        },
        handleDownload() {                                  // 导出
            stockApi.CommissionByEmployeeDownload(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },

        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.storeList.unshift({ label: '全部', value: '' });
                this.queryEntity.ShopIds = this.userInfo.user_id + '';
                this.CommissionByEmployee();
            });
        },
        getProductcategory() {                              // 获取一级分类
            stockApi.getProductcategory({ userid: this.queryEntity.ShopIds, producttype_id: -1 }).then(res => {
                if (res) {
                    this.classifyOneData = this.$app.isNull(res.list) ? [] : res.list.map(e => { return { value: e.id, label: e.sv_pc_name } });
                    this.classifyOneData.unshift({ value: -1, label: '全部' });
                }
            });
        },
        CommissionByEmployee() {                            // 获取数据
            stockApi.CommissionByEmployee(this.queryObj).then(res => {
                this.$gridManager.cleanData('staffAch')
                this.$gridManager.setAjaxData('staffAch', {
                    data: res.map(item => {
                        return {
                            employeeId: item.employeeId,
                            employeeName: item.employeeName,
                            totalCommission: item.total.totalCommission,
                            totalOrderMoney: item.total.totalCommissionOrderMoney,
                            totalSalesPerformance: item.total.totalSalesPerformance,
                            totalOrderCount: item.total.totalOrderCount,
                            avgOrderPrice: item.total.avgOrderPrice,
                            totalAssignOrderCount: item.total.totalAssignOrderCount,
                            assignRate: item.total.assignRate,
                            serviceProduct_orderMoney: item.serviceProduct.orderMoney,
                            serviceProduct_salesPerformance: item.serviceProduct.salesPerformance,
                            serviceProduct_commission: item.serviceProduct.commission,
                            serviceProduct_count: item.serviceProduct.count,
                            product_orderMoney: item.product.orderMoney,
                            product_salesPerformance: item.product.salesPerformance,
                            product_commission: item.product.commission,
                            product_count: item.product.count,
                            card_orderMoney: item.card.orderMoney,
                            card_salesPerformance: item.card.salesPerformance,
                            card_commission: item.card.commission,
                            card_count: item.card.count
                        }
                    })
                });
            });
        },
        GetUserEmployeeOperatorList() {                     // 获取员工列表
            stockApi.GetUserEmployeeOperatorList(this.staffEntity).then(res => {
                let item = res.list.find(item => item.user_id === this.staffEntity.user_id);
                this.staffList = this.$app.isNull(item) ? [] : (item.list || []).map(e => { return { label: e.sv_employee_name, value: e.sv_employee_id } });
                this.staffList.unshift({ label: '全部', value: '' });
            });
        },

        //#endregion
    }
}

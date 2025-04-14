import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    components: { gridManager },
    data() {
        return {
            storeList: [],                          // 门店数据
            staffList: [],                          // 员工数据
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
                keywards: '',                           // 关键词
                // ShopIds: '',                            // 店铺id集合
                // StartDate: '',                          // 开始时间
                // EndDate: '',                            // 结束时间
                Page: 1,                                // 页码
                PageSize: 10,                           // 页数
            },
            total: 0,
            dataList: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dateTime() {                                    // 默认当前日期
            return [this.queryEntity.StartDate, this.queryEntity.EndDate]
        },
        queryObj() {
            let { CommissionType, EmployeeId, ShopIds, StartDate, EndDate, Page, PageSize } = this.queryEntity;
            let obj = { CommissionType, EmployeeId, ShopIds, StartDate, EndDate, Page, PageSize };
            if (this.$app.isNull(EmployeeId)) delete obj.EmployeeId;
            obj.ShopIds = this.$app.isNull(ShopIds) ? this.storeList.filter(e => e.value !== '').map(e => { return e.value }) : [ShopIds];
            return obj;
        },
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
        // this.getstore_list();                           // 获取门店信息
        this.queryEntity.StartDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.EndDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.get_download_list();
    },
    methods: {
        //#region   事件

        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.StartDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.EndDate = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.Page = 1;
        },
        handleSearch() {                                    // 查询
            this.queryEntity.Page = 1;
            this.get_download_list();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                CommissionType: 2,
                EmployeeId: '',
                ShopIds: '',
                StartDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                EndDate: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                Page: 1,
                PageSize: 10
            };
        },
        handleSizeChange(pagesize) {                        // 改变页码
            this.queryEntity.Page = 1;
             this.queryEntity.PageSize = pagesize;
            this.get_download_list();
        },
        handlePageChange(page){                             // 改变页数
            this.queryEntity.Page = page;
            this.get_download_list();
        },
        handleDownload(index) {                             // 点击下载
            this.$app.downloadUrl(this.dataList[index].sv_excel_name)
        },
        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.storeList.unshift({ label: '全部', value: '' });
                this.queryEntity.ShopIds = this.userInfo.user_id + '';
            });
        },
        get_download_list() {                               // 获取下载列表数据
            stockApi.get_Report_Recordmodels_list(this.queryEntity).then(res => {
                this.dataList = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                    return {
                        ...e,
                        sv_created_date: this.$app.isNull(e.sv_created_date) ? '' : this.$app.currentTime(new Date(e.sv_created_date), 'yyyy-MM-dd HH:mm:ss')
                    }
                })
                this.total = res.total;
            });
        },
        GetUserEmployeeOperatorList() {                      // 获取员工列表
            stockApi.GetUserEmployeeOperatorList(this.staffEntity).then(res => {
                let item = res.list.find(item => item.user_id === this.staffEntity.user_id);
                this.staffList = this.$app.isNull(item) ? [] : item.list.map(e => { return { label: e.sv_employee_name, value: e.sv_employee_id } });
                this.staffList.unshift({ label: '全部', value: '' });
            });
        },

        //#endregion
    }
}

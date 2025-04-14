import gridManager from '_c/common/gridManager'
import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    components: { gridManager },
    data() {
        return {
            storeList: [],                          // 门店数据
            queryEntity: {                          // 查询实体
                user_id: -1,                            //店铺id集合
                start_date: '',                         // 开始时间
                end_date: '',                           // 结束时间
                page: 1,                                // 页码
                pagesize: 10,                           // 页数
            },
            total: 0,
            gridOption: {
                gridManagerName: 'cateringReturnRecord',
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
                    { key: 'operate_type', text: '单据类型', align: 'center', width: '200px' },
                    { key: 'product_name', text: '商品名称', align: 'center', width: '300px', template: (cell) => { return `<el-tooltip class="item" effect="dark" content="${cell}" placement="right"><span class="tooltip">${cell}</span></el-tooltip>` } },
                    { key: 'sv_catering_grade', text: '房台', align: 'center'},
                    { key: 'product_price', text: '金额', align: 'center'},
                    { key: 'sv_remark', text: '备注', align: 'center', template: (cell) => { return `<el-tooltip class="item" effect="dark" content="${cell}" placement="right"><span class="tooltip">${cell}</span></el-tooltip>` } },
                    { key: 'sv_creation_name', text: '操作员', align: 'center'},
                    { key: 'sv_creation_date', text: '操作时间', align: 'center', width: '180px' }
                ],
                ajaxData: { data: [] },
            }
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dateTime() {                                    // 默认当前日期
            return [this.queryEntity.start_date, this.queryEntity.end_date]
        },
        queryObj() {
            let { user_id, start_date, end_date, page, pagesize } = this.queryEntity;
            let obj = { user_id, start_date, end_date, page, pagesize };
            return obj;
        },
    },
    watch: {
        'queryEntity.user_id': {
            deep: true, handler(newVal, oldVal) {
                this.getCaterReturnList();
            }
        }
    },
    mounted() {
        this.getstore_list();                               // 获取门店信息
        this.queryEntity.start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    },
    methods: {

        //#region   事件

        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.page = 1;
        },
        handleSearch() {                                    // 查询
            this.queryEntity.page = 1;
            this.getCaterReturnList();
        },
        handleEmpty() {                                     // 重置
            this.queryEntity = {
                user_id: -1,
                start_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
                end_date: this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
                page: 1,
                pagesize: 10
            };
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.page = index;
            if (type === 'size') this.queryEntity.page = 1, this.queryEntity.pagesize = index;
            this.getCaterReturnList();
        },
        handleDownload() {                                  // 导出
            stockApi.returnList_Excel(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },

        //#endregion

        //#region   获取数据

        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.storeList.unshift({ label: '全部', value: -1 });
                this.queryEntity.user_id = this.userInfo.user_id + '';
            });
        },
        getCaterReturnList() {                              // 获取退菜列表
            stockApi.getCaterReturnList(this.queryObj).then(res => {
                this.$gridManager.setAjaxData('cateringReturnRecord', { data: res.dataList.map(item => { return { ...item, product_price: this.$app.moneyFixed(item.product_price) ,sv_creation_date: this.$app.isNull(item.sv_creation_date) ? '' : this.$app.currentTime(new Date(item.sv_creation_date), 'yyyy-MM-dd HH:mm:ss') } }) });
                this.total = res.total;
            });
        },

        //#endregion
    }
}

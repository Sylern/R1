import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            storeList: [],                          // 门店数据
            queryEntity: {                          // 查询实体
                ent_id: '',                           // 调入门店
                out_id: '',                           // 调出门店
                Page: 1,                             // 页面
                PageSize: 10,                        // 页数
                start_date: '',                      // 开始时间
                end_date: '',                        // 介绍时间
            },
            total: 0,
            dataList: [],
            // checkedJson: [],                       // 选中的单据
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getstore_list();                           // 获取门店信息
        this.queryEntity.start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    },
    methods: {

        //#region   事件
        handleChangeTime(date) {                            // 选择时间
            this.queryEntity.start_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.end_date = this.$app.isNull(date) ? '' : this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.queryEntity.Page = 1;
            this.getReportHandle();
        },
        getReportHandle() {                                    // 查询
            this.queryEntity.Page = 1;
            this.GetReport_Cargoflow_OutEnters();
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.Page = index;
            if (type === 'size') this.queryEntity.Page = 1, this.queryEntity.PageSize = index;
            this.GetReport_Cargoflow_OutEnters();
        },
        handleDownload() {                                  // 导出
            stockApi.ProductCommissionDownload(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
            });
        },
        exportHandle() {
            stockApi.Report_Cargoflow_OutEntersExcel(this.queryObj).then(res => {
                if (res) this.$app.downloadUrl(res);
            })
        },
        // handleSelectAll(data, checkedBool) {                      // 表格全选 
        //     let that = this, json = [...this.checkedJson];
        //     if (checkedBool) {
        //         this.tableJson.forEach(item => {
        //             if (that.checkedJson.findIndex(e => e.id === item.id) === -1) json.push(item);
        //         });
        //     } else {
        //         json = json.filter(item => that.tableJson.findIndex(e => e.id === item.id) === -1)
        //     }
        //     this.checkedJson = json;
        // },
        // handleSellect(row, data, checkedBool) {                   // 表格单选
        //     if (checkedBool) {
        //         if (this.checkedJson.findIndex(e => e.id === row.id) === -1)
        //             this.checkedJson.push(row);
        //     } else {
        //         this.checkedJson = this.checkedJson.filter(e => e.id !== row.id);
        //     }
        // },

        //#endregion

        //#region   获取数据

        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: e.user_id, uset_type: e.user_tye } });
                this.storeList.unshift({ label: '全部', value: '-1' });
                this.queryEntity.ent_id = '-1'// this.userInfo.user_id + ''
                this.queryEntity.out_id = '-1' //this.userInfo.user_id + ''
                this.GetReport_Cargoflow_OutEnters();
            });
        },
        GetReport_Cargoflow_OutEnters() {                               // 获取商品业绩数据
            stockApi.GetReport_Cargoflow_OutEnters(this.queryEntity).then(res => {
                let { total, list } = res
                this.dataList = list
                this.total = total
            });
        },

        //#endregion
    }
}

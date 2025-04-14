import base from "@/api/base.js";
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataObj: {
            type: Object,
            default: () => {
                return {
                    title: '选择房台',
                    tableName: '',
                    tableId: null,
                    dataType: 0
                }
            }
        }
    },
    data() {
        return {
            seachStr: '',
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            menuList: [],                               // 房台区域
            dataList: [],                               // 房台列表数据
            queryEntity: {                              // 查询条件
                pageSize: 999999,                           // 页码
                pageIndex: 1,                               // 页数
                changeTableId: -1,
                userId: '',                                 // 店铺id
                regionId: -1,                               // 区域id
                queryTableCount: true,                      // 是否查询房台信息统计
                using_state: -1                             // 房台状态 0 空闲 2使用中
            },
        }
    },
    computed: {
        ...mapState(['memberInfo', 'queryUpdateCartting']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        searchResult() {
            return (this.dataList || []).filter(e => e.sv_table_name.indexOf(this.seachStr) > -1)
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataList = [];
                    this.queryEntity = {                            // 查询条件
                        changeTableId: this.dataObj.tableId,
                        pageSize: 999999,                           // 页码
                        pageIndex: 1,                               // 页数
                        userId: '',                                 // 店铺id
                        regionId: -1,                               // 区域id
                        using_state: this.dataObj.dataType === 0 ? 0 : 2
                    };
                    this.getCateringRegionList();
                    this.$nextTick(() => {
                        this.$refs.popTableList.focus();
                    })
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['update']),
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'popTableList');
            this.$root.$emit('restaurant', 'popTableList');
        },
        handleMenu(item) {
            if (this.queryEntity.regionId === item.id) return;
            this.queryEntity.regionId = item.id;
            this.GetCashierRegionTableInfo();
        },
        handleListTable(item) {                             // 点击房台
            if (this.dataObj.dataType === 0) {
                // 换台
                this.$confirm('确定换去 ' + item.sv_table_name + ' 台吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('updateTable', { id: item.sv_table_id, type: this.dataObj.dataType, name: item.sv_table_name })
                }).catch(() => {

                });
            } 
            if(this.dataObj.dataType === 1) {
                // 并台
                this.$confirm('确定要和 ' + item.sv_table_name + ' 并台吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('updateTable', { id: item.sv_table_id, type: this.dataObj.dataType, name: item.sv_table_name })
                }).catch(() => {

                });
            }
            if(this.dataObj.dataType === 2) {
                // 移菜
                this.$confirm('确定要移菜到 ' + item.sv_table_name + ' 吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('updateTable', { id: item.sv_table_id, sv_without_list_id: item.sv_without_list_id, type: this.dataObj.dataType, name: item.sv_table_name })
                }).catch(() => {

                });
            }
        },
        getCateringRegionList() {                           // 获取房台区域
            stockApi.getCateringRegionList({ seachStr: '', pageIndex: 1, pageSize: 10, }).then(res => {
                if (res) {
                    this.menuList = this.$app.isNull(res) ? [] : res.dataList.map(e => {
                        return { name: e.sv_region_name, id: e.sv_region_id }
                    });
                    this.menuList.unshift({ name: '全部', id: -1 });
                    // setTimeout(() => { this.$refs.scrollbarmLeft.update(); }, 10)
                    // this.queryEntity.regionId = this.$app.isNull(this.menuList) ? -1 : this.menuList[0].id;
                    this.GetCashierRegionTableInfo();                   // 获取房台列表
                }
            })
        },
        GetCashierRegionTableInfo() {                       // 获取房台列表
            if (this.dataObj.dataType === 0) {
                // 换台
                stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                    if (res) {
                        this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.filter(e => e.sv_table_id !== this.dataObj.tableId).map((e, index) => {
                            // let sv_table_using_state = index > 4 ? 0 : index;
                            // let stateName = this.setStateName(sv_table_using_state);
                            // let time = this.$app.friendlyTime(new Date('2021-10-21 09:51:00'))
                            let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.friendlyTime(new Date(e.sv_table_opendate));
                            return { ...e, time }
                        });
                        this.sumCout = this.$app.isNull(res) || this.$app.isNull(res.cateringTableCount) ? this.sumCout : res.cateringTableCount;

                        this.$nextTick(() => {
                            this.$refs.menuList.update();
                            this.$refs.scrollbar.update();
                        })
                    }
                    if (this.refreshBool) this.refreshBool = false, this.$message({ message: '刷新成功', type: 'success' });
                })
            } else {
                // 并台 移菜
                stockApi.GetCashierRegionTableInfo_AndTable(this.queryEntity).then(res => {
                    if (res) {
                        this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.filter(e => e.sv_table_id !== this.dataObj.tableId).map((e, index) => {
                            // let sv_table_using_state = index > 4 ? 0 : index;
                            // let stateName = this.setStateName(sv_table_using_state);
                            // let time = this.$app.friendlyTime(new Date('2021-10-21 09:51:00'))
                            let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.friendlyTime(new Date(e.sv_table_opendate));
                            return { ...e, time }
                        });
                        this.sumCout = this.$app.isNull(res) || this.$app.isNull(res.cateringTableCount) ? this.sumCout : res.cateringTableCount;

                        this.$nextTick(() => {
                            this.$refs.menuList.update();
                            this.$refs.scrollbar.update();
                        })
                    }
                    if (this.refreshBool) this.refreshBool = false, this.$message({ message: '刷新成功', type: 'success' });
                })
            }

        },
        initSelected() {
            this.selectedPos = this.memberInfo.couponCountList.findIndex(e => e.sv_record_id === this.queryUpdateCartting.couponRecordId);
        },
        handleItemClick(index) {
            this.selectedPos = index;
        }
    }
};
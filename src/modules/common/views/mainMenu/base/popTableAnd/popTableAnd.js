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
        },
        mergeCateringTableIds: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            seachStr: '',
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            menuList: [],                               // 房台区域
            dataList: [],                               // 房台列表数据
            checkList: [],                              // 
            queryEntity: {                              // 查询条件
                pageSize: 999999,                           // 页码
                pageIndex: 1,                               // 页数
                userId: '',                                 // 店铺id
                regionId: -1,                               // 区域id
                queryTableCount: true,                      // 是否查询房台信息统计
                using_state: -1                             // 房台状态 0 空闲 2使用中
            },
        }
    },
    computed: {
        ...mapState(['queryUpdateCartting']),
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
                    this.checkList = [];
                    this.queryEntity = {                            // 查询条件
                        pageSize: 999999,                           // 页码
                        pageIndex: 1,                               // 页数
                        userId: '',                                 // 店铺id
                        regionId: -1,                               // 区域id
                        using_state: this.dataObj.dataType === 0 ? 0 : 2
                    };
                    this.getCateringRegionList();
                    this.$nextTick(() => {
                        this.$refs.popTableAnd.focus();
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
            this.getCashierRegionTableInfo();
        },
        handleListTable(item) {                             // 点击房台
            if (this.dataObj.dataType === 1) {
                // 并台
                // this.$confirm('确定要和 ' + item.sv_table_name + ' 并台吗?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     this.$emit('updateTable', { id: item.sv_table_id, type: this.dataObj.dataType, name: item.sv_table_name })
                // }).catch(() => {

                // });
                if (this.checkList.map(e => e.sv_table_id).includes(item.sv_table_id)) {
                    this.checkList = this.checkList.filter(e => e.sv_table_id !== item.sv_table_id)
                } else {
                    this.checkList.push({
                        sv_table_id: item.sv_table_id,
                        sv_without_list_id: item.sv_without_list_id
                    })
                }
            }
        },
        handleBtnSure() {
            if (this.checkList.length < 1) return
            this.$emit('updateTable', { type: this.dataObj.dataType, list: this.checkList })
        },
        getCateringRegionList() {                           // 获取房台区域
            stockApi.getCateringRegionList({ seachStr: '', pageIndex: 1, pageSize: 10, }).then(res => {
                if (res) {
                    this.menuList = this.$app.isNull(res) ? [] : res.dataList.map(e => {
                        return { name: e.sv_region_name, id: e.sv_region_id }
                    });
                    this.menuList.unshift({ name: '全部', id: -1 });
                    this.getCashierRegionTableInfo();                   // 获取房台列表
                }
            })
        },
        getCashierRegionTableInfo() {                       // 获取房台列表
            stockApi.GetCashierRegionTableInfo_AndTable({ ...this.queryEntity, mergeCateringTableIds: this.mergeCateringTableIds }).then(res => {
                if (res) {
                    this.dataList = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.filter(e => e.sv_table_id !== this.dataObj.tableId).map((e, index) => {
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
        },
        handleItemClick(index) {
            this.selectedPos = index;
        }
    }
};
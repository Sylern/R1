import base from "@/api/base.js";
import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'privateRoomTips',
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
            notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
            tableData: [],                                  // 房台列表数据
            queryEntity: {                                  // 查询条件
                pageSize: 999999,                               // 页码
                pageIndex: 1,                                   // 页数
                userId: '',                                     // 店铺id
                regionId: -1,                                   // 区域id
                queryTableCount: true,                          // 是否查询房台信息统计
                using_state: 9                                  // 房台状态 9待预结
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
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableData = [];
                    this.queryEntity = {                            // 查询条件
                        pageSize: 99999,                            // 页码
                        pageIndex: 1,                               // 页数
                        userId: '',                                 // 店铺id
                        regionId: -1,                               // 区域id
                        using_state: 9
                    };
                    this.$nextTick(() => {
                        !!this.$refs.privateRoomTips && this.$refs.privateRoomTips.focus();
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
        },
        show() {
            this.GetCashierRegionTableInfo();
        },
        GetCashierRegionTableInfo() {                       // 获取房台列表
            stockApi.GetCashierRegionTableInfo(this.queryEntity).then(res => {
                if (res) {
                    this.tableData = this.$app.isNull(res) || this.$app.isNull(res.cateringTablePageList) ? [] : res.cateringTablePageList.filter(e => e.sv_table_id !== this.dataObj.tableId).map((e, index) => {
                        let time = this.$app.isNull(e.sv_table_opendate) ? '' : this.$app.friendlyTime(new Date(e.sv_table_opendate));
                        return { ...e, time }
                    });
                    this.$nextTick(() => {
                        this.$refs.myTable && this.$refs.myTable.onReset();
                    })
                }
            })
        },
    }
};
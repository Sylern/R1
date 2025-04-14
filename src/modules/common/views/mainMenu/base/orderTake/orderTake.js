import { stockApi } from "@/api/index.js";
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
    name: 'orderTake',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            keywards: '',
            orderList: [],                                      // 订单列表
            svWithoutListId: '',                                // 选中的挂单id
            orderId: -1,                                        // 当前选中id
            member_id: '',                                      // 当前选中会员id
            dataJson: [],                                       // 订单商品数据
        }
    },
    computed: {
        ...mapState(['selectedInfo', 'carttingSearchCursor']),
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
                    this.keywards = '';
                    this.getguandanTwo();
                    this.$nextTick(() => {
                        this.$refs.orderTake.focus();
                    })
                } else {
                    this.orderId = -1;
                    this.dataJson = []
                }
            }
        }
    },
    mounted() {

    },
    activated() {
        // this.init();
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'syncCarttingData', 'touchCarttingCursor']),
        ...mapActions(['requsetMemberInfo']),
        closeDialog() {                                       // 关闭弹窗
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'orderTake');
            this.$root.$emit('restaurant', 'orderTake');
        },
        handleSearch() {                                      // 修改筛选时间
            this.getguandanTwo();
        },
        handleClearInput() {

        },
        handleOrder(item) {
            if (this.orderId === item.id) return;
            this.orderId = item.id;
            this.getGuandanmModelByTableId();
        },
        getOrderProduct() {
            this.clearCartting();
            this.requsetMemberInfo(this.member_id);

            let query = {
                orderId: this.orderId
            }
            stockApi.fast_takeASingle(query).then(res => {
                if (res) {
                    this.closeDialog();
                    this.update({
                        key: 'selectedInfo',
                        data: {
                            ...this.selectedInfo,
                            sv_remark: res.sv_remark,
                            sv_without_list_id: this.svWithoutListId
                        }
                    });
                    this.syncCarttingData(res);
                    this.touchCarttingCursor();
                    this.carttingSearchCursor = true;
                }
            });

        },
        //#region 数据请求
        getguandanTwo() {
            let query = {
                isAntiSettlement: false,
                tableId: 0,
                pageSize: 100,
                page: 1,
                keywards: this.keywards,
                selectType: 4    // 查询订单类型( -1 全部   0 待结单 1已接单 2已打印 3 已取消 4 已挂单，未取单)
            }
            stockApi.getguandanTwo(query).then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.orderList = this.$app.isNull(res.values.dataList) ? [] : res.values.dataList.map(e => {
                        let wt_datetime = this.$app.currentTime(new Date(e.wt_datetime), 'yyyy-MM-dd HH:mm:ss')
                        return {
                            ...e,
                            id: e.sv_without_list_id,
                            wt_datetime
                        }
                    });
                    this.$nextTick(() => {
                        !!this.$refs.orderListSrcoll && this.$refs.orderListSrcoll.update()
                    })
                }
            });
        },
        getGuandanmModelByTableId() {
            let query = {
                is_mp: true,
                withoutListId: this.orderId,
                tableId: 0,
                queryType: 0
            }
            stockApi.getGuandanmModelByTableId(query).then(res => {
                if (res.succeed && !this.$app.isNull(res.values)) {
                    this.member_id = res.values.member_id || '';
                    this.svWithoutListId = res.values.sv_without_list_id;
                    this.dataJson = this.$app.isNull(res.values.prlist) ? [] : res.values.prlist.map(e => {
                        return {
                            ...e,
                            product_num: e.sv_pricing_method === 0 ? e.product_num : e.sv_p_weight
                        }
                    });
                }
            });
        },
        deleteWithOrderList() {
            this.$confirm('是否删除挂单明细?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stockApi.deleteWithOrderList({ withListId: this.orderId }).then(res => {
                    if (res.succeed) {
                        this.$message({ message: '删除成功', type: 'success' });
                        this.orderId = -1;
                        this.getguandanTwo();
                    }
                });
            }).catch(() => {
                console.log('已取消');
            });
        },
        //#endregion
    }
};
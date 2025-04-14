/* 
     visible-是否显示智能补货
*/
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: () => { return [] } }
    },
    data() {
        return {
            max_min_type: 1,                               // 批量补货至商品 1 库存上限 2 库存下限 
            batch_value: 0,                                // 批量补货数量
            average_sales: 0,                              // 近多少天平均销量
            sales_volume: 0                                // 补货多少天销量
        }
    },
    watch: {
        max_min_type: {
            handler(newVal, oldVal) {
                this.average_sales = newVal !== 3 ? 0 : this.average_sales;
                this.sales_volume = newVal !== 3 ? 0 : this.sales_volume;
            }
        },
        batch_value: {                                  // 监听批量补货数量是否发生变化 - 只能输入数字
            handler(newVal, oldVal) { this.batch_value = this.$app.verifyNumber(newVal); }
        },
        average_sales: {                                // 监听近多少天平均销量是否发生变化 - 只能输入数字 并且不能大于30
            handler(newVal, oldVal) { this.average_sales = this.$app.verifyGreaterValue(newVal, 30); }
        },
        sales_volume: {                                 // 监听近补货多少天销量是否发生变化 - 只能输入数字
            handler(newVal, oldVal) { this.sales_volume = this.$app.verifyNumber(newVal); }
        },
    },
    computed: {
        dialogVisible: { get() { this.max_min_type = 1; return this.visible; }, set(value) { this.$emit('update:visible', value); } },
    },
    methods: {
        handlePurchase() {                                 // 跳转至采购
            this.handleSetReplenishmentInfo();
            this.$router.push({ path: '/purchasePackage/addPurchase', query: { isReplenishment: true } });
        },
        // handleGoodsAllocation() {
        //     this.handleSetReplenishmentInfo();
        //     this.$router.push({ path: '/allocationManagement/addGoodsAllocation', query: { isReplenishment: true } });
        // },
        handleSetReplenishmentInfo() {
            if (this.$app.isNull(this.dataJson)) return this.$message({ message: '补货商品数量为0,请返回重新选择需要补货的商品', type: 'warning' });
            let params = {
                max_min_type: this.max_min_type,
                batch_value: this.batch_value,
                average_sales: this.average_sales,
                sales_volume: this.max_min_type,
                p_list_id: this.dataJson
            }
            this.$app.setSession('replenishment_info', params);
        }
    }
}
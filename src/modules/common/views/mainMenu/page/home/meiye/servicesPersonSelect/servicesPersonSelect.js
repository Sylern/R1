import utils from '@/utils/utils';
import { stockApi } from "@/api/index.js";
import { mapActions, mapState } from 'vuex';
const { debounce, throttle } = utils;
export default {
    components: {},
    name: 'servicesPersonSelect',
    data() {
        return {
            orderSelected: {},                                      // 当前选中的订单
            menuPos: 0,
            imgBase: stockApi.imgBase(),
        }
    },
    computed: {
        ...mapState(['storeEmployeeList']),
    },
    watch: {

    },
    mounted() {
        
    },
    methods: {
        ...mapActions(['getUiGroupingEmployeeList']),
        handleBack() {
            this.$emit('handleBack');
        },
        handleChangeMenu(pos) {
            this.menuPos = pos;
        },
        handleItem(item) {
            this.$emit('handleCashier', item);
        },
        listenKeyup(e) {
            let code = e.keyCode;
            this.$root.$emit('keyCode', code);
        },
        handleOrder(item) {
            this.orderSelected = item;
        },
        updategoodsList(e) {                                        // 修改添加的商品
            this.goodsList = e;
        },
    }
};
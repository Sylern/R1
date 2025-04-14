import utils from '@/utils/utils';
import { stockApi } from "@/api/index.js";
const { debounce, throttle } = utils;
export default {
    components: {},
    name: 'servicesPersonSelect',
    data() {
        return {
            orderSelected: {},                                      // 当前选中的订单
            menuPos: 0,
            dataList: [
                {
                    title: '发型师',
                    list: [
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        }
                    ]
                },
                {
                    title: '技师',
                    list: [
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        },
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        },
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        },
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        }
                    ]
                },
                {
                    title: '服务中',
                    list: [
                        {
                            id: 1,
                            name: 'Vanessa',
                            number: '001'
                        },
                        {
                            id: 2,
                            name: '2Vanessa',
                            number: '002'
                        },
                        {
                            id: 3,
                            name: '3Vanessa',
                            number: '003'
                        },
                        {
                            id: 4,
                            name: '4Vanessa',
                            number: '004'
                        }
                    ]
                }
            ],
        }
    },
    computed: {
        orderContentList() {
            return this.$app.isNull(this.orderSelected) || this.$app.isNull(this.orderSelected.prlist) ? [] : this.orderSelected.prlist.map(e => {
                return {
                    ...e,
                    product_unitprice: e.product_unitprice.toFixed(2),
                    product_total: e.product_total.toFixed(2)
                }
            })
        },
    },
    watch: {

    },
    mounted() {

    },
    activated() {

    },
    methods: {
        handleBack() {
            this.$router.back();
        },
        handleChangeMenu(pos) {
            this.menuPos = pos;
        },
        handleItem(item) {
            this.$router.push('/')
        },
        listenKeyup(e) {
            let code = e.keyCode;
            this.$root.$emit('keyCode', code);
        },
        handleChangeTime(date) {                                    // 修改筛选时间
            this.query.startdate = this.$app.currentTime(date[0], 'yyyy-MM-dd') + ' 00:00';
            this.query.enddate = this.$app.currentTime(date[1], 'yyyy-MM-dd') + ' 23:59';
            this.query.page = 1;
            this.query.order_running_id = '';
            this.getSaleStreamInfo(true);
        },
        handleInput() {
            this.query.startdate = '';
            this.query.enddate = '';
            this.query.page = 1;
            this.getSaleStreamInfo(true);
        },
        handleOrder(item) {
            this.orderSelected = item;
        },
        updategoodsList(e) {                                        // 修改添加的商品
            this.goodsList = e;
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && !this.isDataLast) {
                this.query.page++;
                this.getSaleStreamInfo();
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getSaleStreamInfo(initList = false) {
            stockApi.getSaleStreamInfo(this.query).then(res => {
                if (res !== false) {
                    let orderTemp = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let order_datetime = this.$app.isNull(e.order_datetime) ? '' : this.$app.currentTime(new Date(e.order_datetime), 'yyyy-MM-dd HH:mm:ss');
                        return {
                            ...e,
                            id: e.order_running_id,
                            order_datetime
                        }
                    });
                    if (initList) this.orderList = [];
                    this.orderList = this.orderList.concat(orderTemp);
                    if (this.$app.isNull(this.orderSelected.order_id) && this.orderList.length > 0) {
                        this.orderSelected = this.orderList[0];
                    }

                    this.isDataLast = this.orderList.length < res.total ? false : true;
                    this.rowCount = res.rowCount;
                    this.totalAmount_bak = this.$app.isNull(res.totalAmount_bak) ? '' : res.totalAmount_bak.toFixed(2);
                    this.return_count = res.return_count;


                    // productCount累积商品数

                    // productCount_bak	number($double)
                    // return_count	number($double)
                    // 退货笔数

                    // rowCount	number($double)
                    // 累积笔数

                    // saleAmount_bak	number($double)
                    // 销售金额

                    // totalAmount	number($double)
                    // 合计金额

                    // totalAmount_bak	number($double)
                    // 合计金额

                    // totareturn_money	number($double)
                    // 退款金额
                }
            });
        }
    }
};
import utils from '@/utils/utils';
import { stockApi } from "@/api/index.js";
const { debounce, throttle } = utils;
export default {
    components: {},
    name: 'services',
    data() {
        return {
            orderSelected: {},                                      // 当前选中的订单
            defaultDate: [],
            orderText: ['正常', '有退货', '整单退', '待付款'],           // 订单状态，0正常，1有退货，2全退货，3--待付款
            query: {
                memberkeywards: '',
                order_running_id: '',
                productkeywards: '',
                member_type: '',
                payment_name: '',
                orderSource: '',
                startdate: '',
                enddate: '',
                page: 1,
                pagesize: 10
            },
            rowCount: 0,                                            // 销售笔数
            totalAmount_bak: 0,                                     // 销售总额
            return_count: 0,                                        // 退货笔数
            isDataLast: false,                                      // 数据到底
            orderList: [],                                          // 订单列表
            dataJson: [],                                           // 订单商品数据
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
        this.bottomWorkerScroll();
    },
    activated() {

    },
    methods: {
        handleOrderStart (){
            this.$router.push('servicesPersonSelect');
        },
        bottomWorkerScroll() {
            let tableScroll = this.$refs.workerListWrap;
            let tableBox = this.$refs.workerView;

            let tableScrollWidth = tableScroll.style.width;  //滚动可见宽度
            let tableBoxWidth = tableBox.style.width;  //内容宽度

            //鼠标按下的时候
            tableBox.onmousedown = function (ev) {

                let oEvent = ev || event;  //ev 成立时 oEvent = event，否则 oEvent = ev , 事件对象 兼容处理
                let mousePlace = oEvent.screenX  //点击时当前鼠标的位置
                //鼠标移动的时候
                document.onmousemove = function (ev) {
                    let oEvent = ev || event;  //当前的事件对象  oDiv2

                    let distance = oEvent.clientX;  //oEvent.clientX 表示 oDiv2相对于页面左侧的距离，l表示现在的大小
                    let actual = mousePlace - distance;  //拖动的距离
                    let scrollNum = tableScroll.scrollLeft;  //当前滚动条的位置

                    scrollNum = scrollNum + actual;  //当前滚动条的位置
                    tableScroll.scrollLeft = scrollNum
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
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
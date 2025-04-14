import base from '@/api/base';
import utils from '@/utils/utils';
import { mapState } from 'vuex';
import { stockApi } from "@/api/index.js";
const { debounce, throttle } = utils;
export default {
    components: {},
    name: 'selectOrder',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            printKitchenSwitch: false,
            searchType: 0,
            searctText: '',
            searchPlaceholder: ['扫单号或输入订单号', '会员姓名/卡号/手机号'],
            dataContent: {},                                      // 当前选中的订单
            defaultDate: [],
            orderText: ['正常', '部分退货', '整单退', '待付款'],                // 订单状态，0正常，1部分退货，2全退货，3--待付款
            query: {
                user_id: '',
                keywards: '',
                memberquery: '',
                startdate: '',
                enddate: '',
                page: 1,
                pagesize: 20
            },
            permission: {},
            order_num: 0,                                           // 销售笔数
            order_money: 0,                                         // 营业额
            return_num: 0,                                          // 退货笔数
            return_order_num: 0,                                    // 退货订单数数
            isDataLast: false,                                      // 数据到底
            orderList: [],                                          // 订单列表
            dataContent: {},                                        // 订单详情数据
            bindCodeStatus: false,                                  // 绑票码弹窗
            selectData: {                                           // 当前选中订单
                id: null,
                type: 1
            },
        }
    },
    computed: {
        ...mapState(['userInfo']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        orderContentList() {
            return this.$app.isNull(this.dataContent.list) ? [] : this.dataContent.list.map(e => {
                // let product_price = this.$app.addNumber(e.product_price, e.product_taste_total_money);
                let sv_preferential_data = this.$app.isNull(e.sv_preferential_data) ? [] : JSON.parse(e.sv_preferential_data);
                // let discountLocal = sv_preferential_data.length > 0 ? '优惠' + this.$app.moneyFixed(sv_preferential_data[0].m) + '元' : '无折扣';
                let discountLocal = sv_preferential_data.length > 0 ? '' : '无折扣';
                let image = this.$app.isNull(e['sv_p_images']) ? [] : JSON.parse(e['sv_p_images']).map(e => { try { return e.code === '[]' ? [] : e.code; } catch (error) { return []; } });
                image = this.$app.isNull(image) ? [] : image.filter(img => !this.$app.isNull(img));
                return {
                    ...e,
                    product_num: e.record_type === 2 ? (-1 * e.product_num) : e.product_num,
                    product_total: e.record_type === 2 ? (-1 * e.product_total) : e.product_total,
                    image: this.$app.isNull(image) ? [base.frontImgBase + '/images/default.png'] : image.map(e => { return this.$app.fmtImg(e) }),
                    product_price: e.product_price,
                    discountLocal: discountLocal,
                    sv_preferential_data,
                    sv_preferential_data_text: sv_preferential_data.length > 0 ? sv_preferential_data[0].s : '',
                    sv_combination_new: this.$app.isNull(e.sv_combination_new) ? [] : JSON.parse(e.sv_combination_new)
                }
            })
        },
        order_discount() {
            if (this.dataContent.order_discount > 0 && this.dataContent.order_discount < 1) {
                return this.dataContent.order_discount
            }
            return false
        },
        member_discount() {
            if (this.dataContent.sv_member_discount > 0 && this.dataContent.sv_member_discount < 1) {
                return this.dataContent.sv_member_discount
            }
            return false
        },
        coupon_discount() {
            if (this.dataContent.sv_coupon_discount > 0 && this.dataContent.sv_coupon_discount < 1) {
                return this.dataContent.sv_coupon_discount
            }
            return false
        },
        isShowKitchPrint() {
            return this.dataContent.order_state === 0 && this.userInfo.sv_us_industrytype === 27
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.query.page = 1;
                    this.getCashierBillList(true);
                    window.addEventListener('scroll', this.pageNextThrottle, true);
                } else {
                    window.removeEventListener('scroll', this.pageNextThrottle, true);
                }
            }
        }
    },
    beforeMount() {
        const now = new Date();
        const start = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(this.$app.currentTime(now, 'yyyy-MM-dd') + ' 23:59:59');
        this.query.startdate = this.$app.currentTime(new Date(start), 'yyyy-MM-dd HH:mm:ss');
        this.query.enddate = this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss');
        this.defaultDate = [this.query.startdate, this.query.enddate];
    },
    mounted() {
        // this.query.page = 1;
        // window.addEventListener('scroll', this.pageNextThrottle, true);
        // this.$nextTick(() => {
        //     this.$refs.inputSearch.focus();
        // })
    },
    methods: {
        closeDialog() {                                             // 关闭弹窗
            this.dialogVisible = 'close';
        },
        handleChangeTime(date) {                                    // 修改筛选时间
            this.query.startdate = this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss');
            this.query.enddate = this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss');
            this.query.page = 1;
            this.query.keywards = '';
            this.query.memberquery = '';
            this.getCashierBillList(true);
        },
        handleInput() {
            this.query.page = 1;
            this.getCashierBillList(true);
        },
        handleOrder(item) {
            this.selectData = {
                id: item.id,
                group_id: item.group_id,
                type: item.sv_sales_return_type
            }
            this.getCashierInfo();
        },
        updategoodsList(e) {                                        // 修改添加的商品
            this.goodsList = e;
        },
        handleScroll() {                                            // 定点列表滚动监听事件
            let scrollTop = this.$refs.scrollContent.wrap.scrollTop + this.$refs.scrollContent.wrap.offsetHeight + 200;
            if (scrollTop > this.$refs.listWrap.offsetHeight && !this.isDataLast) {
                this.query.page++;
                this.getCashierBillList();
            }
        },
        pageNextThrottle: throttle('handleScroll', 200),            // 节流翻页
        getCashierBillList(initList = false) {
            let SalesReport = this.$app.isNull(this.permission.SalesReport) ? { enabled: true } : this.permission.SalesReport;
            if (!SalesReport.enabled) return this.$message.warning(SalesReport.name + SalesReport.tips);
            let Sales_Data = this.$app.isNull(this.permission.Sales_Data) ? { enabled: true } : this.permission.Sales_Data;
            if (initList) this.query.page = 1;
            this.query.keywards = this.searchType === 0 ? this.searctText : '';
            this.query.memberquery = this.searchType === 1 ? this.searctText : '';
            let salesclerkid_id = Sales_Data.enabled ? 0 : this.userInfo.sp_salesclerkid;
            stockApi.getCashierBillList({ ...this.query, salesclerkid_id }).then(res => {
                if (res) {
                    let orderTemp = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        let order_datetime = this.$app.isNull(e.order_datetime) ? '' : this.$app.currentTime(new Date(e.order_datetime), 'yyyy-MM-dd HH:mm:ss');
                        return {
                            ...e,
                            order_datetime
                        }
                    });
                    if (initList) {
                        // 需要初始化滚动条及数据
                        this.orderList = [];
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                            this.orderList = this.orderList.concat(orderTemp);
                            this.$nextTick(() => {
                                !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                            })
                        })
                    } else {
                        this.orderList = this.orderList.concat(orderTemp);
                        this.$nextTick(() => {
                            !!this.$refs.scrollContent && this.$refs.scrollContent.update();
                        })
                    }
                    if (this.$app.isNull(this.dataContent.order_id) && this.orderList.length > 0) {
                        // this.dataContent = this.orderList[0];
                        // this.$refs.myTable && this.$refs.myTable.onReset();
                    } else {
                        this.dataContent = {};
                    }
                    this.isDataLast = this.orderList.length < res.total ? false : true;
                    this.order_num = res.order_num;
                    this.order_money = this.$app.moneyFixed(res.order_money)
                    this.return_num = res.return_num;
                    this.return_order_num = res.return_order_num || 0;
                }
            });
        },
        getCashierInfo() {
            let query = {
                source: 100,
                id: this.selectData.id,
                u_id: this.userInfo.user_id,
                group_id: this.selectData.group_id,
                type: this.selectData.type
            }
            stockApi.getCashierInfo(query).then(res => {
                if (res) {
                    this.dataContent = res;
                    this.$nextTick(() => {
                        this.$refs.myTable && this.$refs.myTable.onReset();
                    })
                }
            });
        },

        calcTaste(item) {                                               // 计算口味加料
            let dataArray = item.product_taste_money_detail ? JSON.parse(item.product_taste_money_detail) : [];
            let totalMoney = 0, dataInfo = '';
            dataArray.forEach(e => {
                if (e.price > 0) {
                    totalMoney += e.price;
                    dataInfo += e.name + ':' + e.price + '元 '
                }
            })
            return `<label>` + dataInfo + `</label>`
        },
        handleSelect() {                                                // 选择订单
            if (this.dataContent.order_state === 2) return
            this.closeDialog();
            this.$emit('submit', this.dataContent)
        },
    }
};
import base from '@/api/base';
// import echarts from 'echarts';
import { stockApi } from "@/api/index.js";
export default {
    data() {
        const vm = this;
        return {
            showLoginoutStatus: false,                                      // 退出登录
            isCourseLoading: false,
            subStatus: false,                                               // 头部头像区域弹出
            activeIndex: 0,                                                 // 菜单当前索引
            calendarStatus: false,                                          // 选择日历状态
            minDate: '',                                                    // 最小日期       
            maxDate: '',                                                    // 最大日期
            menuList: [                                                     // 头部菜单
                { menuPos: 0, ref: 'homeWrap', name: '门店概况' },
                { menuPos: 1, ref: 'dailyWrap', name: '每日对账单' }
            ],
            swiperHeight: 450,                                              // 轮播页模块默认高度
            swiperOptions: {                                                // 轮播页模块实体
                pagination: {
                    el: '.swiper-pagination'
                },
                on: {
                    slideChange() {
                        vm.activeIndex = this.activeIndex;
                        vm.setSwiperHeight();
                    }
                },
            },
            shopSelectStatus: false,                                        // 选择店铺状态
            timeSelectStatus: false,                                        // 选择时间状态
            user_id: '-1',                                                    // 当前店铺id
            shopSelectText: '',                                             // 当前店铺名
            timeSelectText: '今日',                                         // 当前时间名
            startDate: '',                                                  // 开始时间
            endDate: '',                                                    // 结束时间
            days: 1,                                                        // 天数
            dataShopList: [],                                               // 店铺列表
            dataShopObj: {
                dataList: []
            },
            maxTurnover: 1,                                                 // 门店最大营业额
            dataPayment: {                                                  // 支付构成数据
                // dataList: []
            },
            dataMemberObj: {                                                // 会员数统计

            },
            dataMemberActive: {                                             // 会员活跃分布数据
                // dataList: []
            },
            maxMemberNumber: 1,                                             // 门店最多会员数
            dataMemberNumber: [                                             // 各门店会员数数据

            ],
            dataRanking: [                                                  // 

            ],
            memberType: -1,                                                 // 支付消费统计类型
            memberTypeTotal: 0,                                             // 支付消费统计总数
            dataDailyBill: {                                                // 每日对账单
                totalData: [],                                               // 综合总收入
                memberConsumeData: {},                                       // 会员
                individualConsumeData: {},                                   // 散客
                livemodel: {},                                               // 新增会员统计
                membeRechargeData: {},                                       // 会员充值金额
                membeChargeSubData: {},                                      // 会员充次金额
                subcardsalescarddata: {},                                    // 次卡销售统计
                refundData: {},                                              // 退货金额
            }
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.$swiper
        },
        memberConsumList() {
            let array = this.memberType == 0 ? this.dataDailyBill.memberConsumeData.consumeData : this.dataDailyBill.individualConsumeData.consumeData;
            let total = this.memberType == 0 ? this.dataDailyBill.memberConsumeData.amount : this.dataDailyBill.individualConsumeData.amount;
            this.memberTypeTotal = this.$app.isNull(total) ? 0 : this.$app.moneyFixed(total, 2)
            return this.$app.isNull(array) ? [] : array.map(e => {
                return {
                    name: e.payment,
                    value: this.$app.moneyFixed(e.amount, 2)
                }
            })
        },
    },
    watch: {
        memberType: {                                               // 监听店铺id变化
            handler(newVal, oldVal) {
                this.$nextTick(e => {
                    this.memberConsum();
                })
            }
        }
    },
    created() {
        this.user_id = localStorage.getItem('userId');
        this.startDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.endDate = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        this.getShopList();
        this.init();
        window.addEventListener('scroll', this.handleScroll, true);
    },
    mounted() {
        // this.swiper.slideTo(3, 1000, false)
    },
    methods: {
        handleLoginout() {                                      // 退出登录
            window.localStorage.clear();
            this.$router.push('/');
        },
        dataPayType(data) {                                     // 支付构成饼状图
            var charts = echarts.init(this.$refs.dataPayType); charts.clear();
            if (this.$app.isNull(data)) return;
            var color = ['#54E58B', '#3992F9', '#FCD866', '#F79C2C', '#01FE99', '#34CBFF', '#107DFE', '#AB5BFA'];
            let json = [];
            let sumCount = this.$app.addJson(data, 'value');
            let diffCount = sumCount;
            let sort = [...data].sort((a, b) => { return b.value - a.value }).filter(e => e.value > 0);
            sort.forEach((e, index) => {
                if (index < 5)
                    diffCount = diffCount - e.value,
                        json.push({ name: e.name, value: e.value, diff: this.$app.toFixed(e.value * 100 / sumCount, 100) });
            });
            if (data.length > 5) json.push({ name: '其他', diff: this.$app.toFixed(100 - this.$app.addJson(json, 'diff'), 100), value: diffCount });
            data = [...json].filter(e => e.diff > 0);;
            let legendData = data.map(e => { return e.name });
            charts.setOption({
                color: color,
                legend: {
                    orient: 'vertical', icon: 'square', top: "center", right: "1%", itemGap: 12, data: legendData,
                    formatter: function (name) {
                        let item = data.find(e => e.name === name);
                        return '{a|' + name + '}{b|' + item.value + '元}'
                    },
                    textStyle: {
                        rich: {
                            a: { align: 'left', fontSize: 12, width: 40, color: '#333333', padding: [0, 10, 0, -10] },
                            b: { align: 'left', fontSize: 12, color: '#333333', padding: [0, 0, 0, 0] }
                        }
                    }
                },

                title: {
                    text: this.dataPayment.totalMoney + "元",
                    left: "12%",
                    top: "50%",
                    textStyle: {
                        color: "#333333",
                        fontSize: 16,
                        align: "center",
                        fontWeight: 700
                    }
                },
                graphic: {
                    type: "text",
                    left: "20%",
                    top: "42%",
                    style: {
                        text: "总金额",
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 12
                    }
                },
                tooltip: { trigger: 'item', formatter: '{b} : {c}元' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['25%', '50%'],
                    label: { show: false, fontSize: 12 },
                    labelLine: { show: false },
                    data: data
                },
                {
                    //rgba(62,109,255,0.07) 
                    itemStyle: { normal: { color: '#ffffff' } },
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['55%', '15%'],
                    center: ["25%", "50%"],
                    label: { normal: { show: false } },
                    data: [{ value: 1, }], z: -1
                }
                ]
            });
        },
        memberActive(data) {                                    // 会员活跃分布饼状图
            var charts = echarts.init(this.$refs.memberActive); charts.clear();
            if (this.$app.isNull(data)) return;
            var color = ['#3992F9', '#54E58B', '#F79C2C', '#FCD866', '#01FE99', '#34CBFF', '#107DFE', '#AB5BFA'];
            let json = [];
            let sumCount = this.$app.addJson(data, 'value');
            let diffCount = sumCount;
            let sort = [...data].sort((a, b) => { return b.value - a.value }).filter(e => e.value > 0);
            sort.forEach((e, index) => {
                if (index < 5)
                    diffCount = diffCount - e.value,
                        json.push({ name: e.name, value: e.value, diff: this.$app.toFixed(e.value * 100 / sumCount, 100) });
            });
            if (data.length > 5) json.push({ name: '其他', diff: this.$app.toFixed(100 - this.$app.addJson(json, 'diff'), 100), value: diffCount });
            data = [...json].filter(e => e.diff > 0);;
            let legendData = data.map(e => { return e.name });
            charts.setOption({
                color: color,
                legend: {
                    orient: 'vertical', icon: 'square', top: "center", right: "1%", itemGap: 12, data: legendData,
                    formatter: function (name) {
                        let item = data.find(e => e.name === name);
                        return '{a|' + name + '}{b|' + item.diff + ' %}'
                    },
                    textStyle: {
                        rich: {
                            a: { align: 'left', fontSize: 12, width: 60, color: '#333333', padding: [0, 10, 0, -10] },
                            b: { align: 'left', fontSize: 12, color: '#333333', padding: [0, 0, 0, 10] }
                        }
                    }
                },
                title: {
                    text: this.dataMemberActive.totalCount + "人",
                    left: "20%",
                    top: "50%",
                    textStyle: {
                        color: "#333333",
                        fontSize: 16,
                        align: "center",
                        fontWeight: 700
                    }
                },
                graphic: {
                    type: "text",
                    left: "18%",
                    top: "42%",
                    style: {
                        text: "活跃人数",
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 12
                    }
                },
                tooltip: { trigger: 'item', formatter: '{b} : {c}人' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['25%', '50%'],
                    label: { show: false, fontSize: 12 },
                    labelLine: { show: false },
                    data: data
                },
                {
                    //rgba(62,109,255,0.07) 
                    itemStyle: { normal: { color: '#ffffff' } },
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['55%', '15%'],
                    center: ["25%", "50%"],
                    label: { normal: { show: false } },
                    data: [{ value: 1, }],
                    z: -1
                }]
            });
        },
        memberConsum() {                                        // 支付消费统计饼状图
            let data = this.memberConsumList;
            var charts = echarts.init(this.$refs.memberConsum); charts.clear();
            if (this.$app.isNull(data)) return;
            var color = ['#54E58B', '#3992F9', '#FCD866', '#F79C2C', '#01FE99', '#34CBFF', '#107DFE', '#AB5BFA'];
            let json = [];
            let sumCount = this.$app.addJson(data, 'value');
            let diffCount = sumCount;
            let sort = [...data].sort((a, b) => { return b.value - a.value }).filter(e => e.value > 0);
            sort.forEach((e, index) => {
                if (index < 5)
                    diffCount = diffCount - e.value,
                        json.push({ name: e.name, value: e.value, diff: this.$app.toFixed(e.value * 100 / sumCount, 100) });
            });
            // if (data.length > 5) json.push({ name: '其他', diff: this.$app.toFixed(100 - this.$app.addJson(json, 'diff'), 100), value: diffCount });
            data = [...json].filter(e => e.diff > 0);;
            let legendData = data.map(e => { return e.name });
            charts.setOption({
                color: color,
                legend: {
                    orient: 'vertical', icon: 'square', top: "center", right: "1%", itemGap: 12, data: legendData,
                    formatter: function (name) {
                        let item = data.find(e => e.name === name);
                        return '{a|' + name + '}{b|' + item.value + '元}'
                    },
                    textStyle: {
                        rich: {
                            a: { align: 'left', fontSize: 12, width: 40, color: '#333333', padding: [0, 0, 0, -10] },
                            b: { align: 'left', fontSize: 12, color: '#333333', padding: [0, 0, 0, 10] }
                        }
                    }
                },

                title: {
                    text: this.memberTypeTotal + "元",
                    left: "12%",
                    top: "50%",
                    textStyle: {
                        color: "#333333",
                        fontSize: 16,
                        align: "center",
                        fontWeight: 700
                    }
                },
                graphic: {
                    type: "text",
                    left: "20%",
                    top: "42%",
                    style: {
                        text: "总金额",
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 12
                    }
                },
                tooltip: { trigger: 'item', formatter: '{b} : {c}元' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['25%', '50%'],
                    label: { show: false, fontSize: 12 },
                    labelLine: { show: false },
                    data: data
                },
                {
                    //rgba(62,109,255,0.07) 
                    itemStyle: { normal: { color: '#ffffff' } },
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['55%', '15%'],
                    center: ["25%", "50%"],
                    label: { normal: { show: false } },
                    data: [{ value: 1, }], z: -1
                }
                ]
            });
        },
        newMembers(data) {
            var charts = echarts.init(this.$refs.newMembers); charts.clear();

            if (this.$app.isNull(data)) return;
            var color = ['#3992F9', '#54E58B', '#F79C2C', '#FCD866', '#01FE99', '#34CBFF', '#107DFE', '#AB5BFA'];
            let json = [];
            let sumCount = this.$app.addJson(data, 'value');
            let diffCount = sumCount;
            let sort = [...data].sort((a, b) => { return b.value - a.value }).filter(e => e.value > 0);
            sort.forEach((e, index) => {
                if (index < 5)
                    diffCount = diffCount - e.value,
                        json.push({ name: e.name, value: e.value, diff: this.$app.toFixed(e.value * 100 / sumCount, 100) });
            });
            if (data.length > 5) json.push({ name: '其他', diff: this.$app.toFixed(100 - this.$app.addJson(json, 'diff'), 100), value: diffCount });
            data = [...json].filter(e => e.diff > 0);;
            let legendData = data.map(e => { return e.name });
            charts.setOption({
                color: color,
                legend: {
                    orient: 'vertical', icon: 'square', top: "center", right: "1%", itemGap: 12, data: legendData,
                    formatter: function (name) {
                        let item = data.find(e => e.name === name);
                        return '{a|' + name + '}{b|' + item.value + ' 人}'
                    },
                    textStyle: {
                        rich: {
                            a: { align: 'left', fontSize: 12, width: 60, color: '#333333', padding: [0, 10, 0, -10] },
                            b: { align: 'left', fontSize: 12, color: '#333333', padding: [0, 0, 0, 10] }
                        }
                    }
                },
                title: {
                    text: this.dataDailyBill.livemodel.liveCount + "人",
                    left: "20%",
                    top: "50%",
                    textStyle: {
                        color: "#333333",
                        fontSize: 16,
                        align: "center",
                        fontWeight: 700
                    }
                },
                graphic: {
                    type: "text",
                    left: "18%",
                    top: "42%",
                    style: {
                        text: "新增会员",
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 12
                    }
                },

                tooltip: { trigger: 'item', formatter: '{b} : {c}人' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['25%', '50%'],
                    label: { show: false, fontSize: 12 },
                    labelLine: { show: false },
                    data: data
                },
                {
                    //rgba(62,109,255,0.07) 
                    itemStyle: { normal: { color: '#ffffff' } },
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['55%', '15%'],
                    center: ["25%", "50%"],
                    label: { normal: { show: false } },
                    data: [{ value: 1, }], z: -1
                }]
            });
        },
        changeTime(days) {
            const end = new Date();
            const start = new Date();
            if (days == 1) {
                this.timeSelectText = '今日';
            } else if (days == 7) {
                this.timeSelectText = '近一周';
            } else if (days == 30) {
                this.timeSelectText = '近一月';
            }
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (days - 1));
            this.startDate = this.$app.currentTime(start, 'yyyy-MM-dd') + ' 00:00:00';
            this.endDate = this.$app.currentTime(end, 'yyyy-MM-dd') + ' 23:59:59';
            this.timeSelectStatus = false;
            this.days = days;
            this.init();
        },
        calendarChange(date) {
            let dateChange = date.map((item) => item.format('YYYY-MM-DD'));
            if (dateChange.length === 2) {
                this.startDate = this.$app.currentTime(new Date(dateChange[0]), 'yyyy-MM-dd') + ' 00:00:00';
                this.endDate = this.$app.currentTime(new Date(dateChange[1]), 'yyyy-MM-dd') + ' 23:59:59';
                this.timeSelectStatus = false;
                let dateSpan = Date.parse(this.endDate) - Date.parse(this.startDate);
                this.days = Math.floor(dateSpan / (24 * 3600 * 1000)) + 1;
                this.timeSelectText = '自定义';
                this.init();
                setTimeout(() => {
                    this.calendarStatus = false;
                }, 300)
            }
        },
        init() {                                            // 初始化数据
            let now = new Date()
            this.maxDate = now;
            this.minDate = new Date(now.getTime() - 3600 * 1000 * 24 * 90);
            this.getProductAnalysisByShop();
            this.getPaymentAmountInfo();
            this.getMemberSalesAnalysis();
            this.getStoreMemberSaleCountInfo();
            this.getStoreMemberCountInfo();
            this.getProductSalesTop10();
            this.getDailyBill();
        },
        handleScroll() {                                    // 页面滚动监听事件
            // let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            // if (this.swiperHeight < scrollTop + 600) {
            //     if (this.activeIndex === 0 && this.homeHasNext && !this.isCourseLoading) {
            //         this.homePageIndex++;
            //     } else if (this.activeIndex === 1 && this.videoHasNext && !this.isVideoLoading) {
            //         this.videoPageIndex++;
            //     }
            // }
        },
        setSwiperHeight() {                                 // 改变swiper的实际高度
            this.$nextTick(() => {
                if (this.$refs[this.menuList[this.activeIndex].ref]) {
                    this.swiperHeight = this.$refs[this.menuList[this.activeIndex].ref].offsetHeight;
                }
            })
        },
        changeMenu(_menuPos) {                              // 主菜单点击事件
            // if (_menuPos == this.activeIndex) return;
            this.activeIndex = _menuPos;
            this.changeSwiper(this.activeIndex);
            this.setSwiperHeight();
        },
        changeSwiper(_index) {
            this.swiper.slideTo(_index, 600, false);        // 切换swiper
            this.setSwiperHeight();
        },
        changeLocalShop(item) {                             // 切换店铺
            if (this.user_id === item.user_id || this.user_id === item) { return };
            this.user_id = this.$app.isNull(item) ? -1 : item.user_id;
            this.shopSelectStatus = false;
            // this.shopSelectText = this.$app.isNull(item) ? '总店' : item.sv_us_name;
            this.shopSelectText = this.$app.isNull(item) ? '所有店铺' : item.sv_us_name;
            this.init();
        },
        dataDailyBillFormat(data) {                         // 每日对账单数据序列化
            this.dataDailyBill.totalData = this.$app.isNull(data.values.totalData) ? [] : data.values.totalData;

            this.dataDailyBill.memberConsumeData = this.$app.isNull(data.values.memberConsumeData) ? {} : data.values.memberConsumeData;
            this.dataDailyBill.individualConsumeData = this.$app.isNull(data.values.individualConsumeData) ? {} : data.values.individualConsumeData;
            this.memberType = this.memberType == -1 ? 0 : this.memberType;
            // 绘制支付消费统计
            this.memberConsum();

            this.dataDailyBill.livemodel = this.$app.isNull(data.values.livemodel) ? {} : data.values.livemodel;
            this.dataDailyBill.livemodel.list = [];
            if (!this.$app.isNull(this.dataDailyBill.livemodel.livemodel)) {
                this.dataDailyBill.livemodel.livemodel.forEach(e => {
                    if (e.count != 0) {
                        this.dataDailyBill.livemodel.list.push(e)
                    }
                });
                this.dataDailyBill.livemodel.list = this.dataDailyBill.livemodel.list.map(e => {
                    return {
                        name: e.name,
                        value: e.count
                    }
                });
                if (this.dataDailyBill.livemodel.list.length > 0) this.newMembers(this.dataDailyBill.livemodel.list);
            }
            this.dataDailyBill.membeRechargeData = this.$app.isNull(data.values.membeRechargeData) ? {} : data.values.membeRechargeData;
            this.dataDailyBill.membeChargeSubData = this.$app.isNull(data.values.membeChargeSubData) ? {} : data.values.membeChargeSubData;
            this.dataDailyBill.subcardsalescarddata = this.$app.isNull(data.values.subcardsalescarddata) ? {} : data.values.subcardsalescarddata;
            this.dataDailyBill.refundData = this.$app.isNull(data.values.refundData) ? {} : data.values.refundData;

            this.setSwiperHeight();
        },
        //#region 数据请求
        getShopList() {                                     // 获取店铺列表
            stockApi.getShopList().then(res => {
                if (res) {
                    this.dataShopList = this.$app.isNull(res.values.list) ? [] : res.values.list;
                    let item = this.dataShopList.find(e => e.user_id === this.user_id);
                    if (this.$app.isNull(item)) {
                        this.shopSelectText = '所有店铺';
                        return
                    }
                    this.shopSelectText = item.sv_us_name;
                }
            });
        },
        getProductAnalysisByShop() {                        // 获取门店营业额统计
            let query = {
                startdate: this.startDate,
                enddate: this.endDate,
                user_id: this.user_id,
                page: 1,
                pagesize: 500
            }
            stockApi.getProductAnalysisByShop(query).then(res => {
                if (res) {
                    this.dataShopObj = res;
                    let totalCount = 0;
                    this.dataShopObj.dataList = this.$app.isNull(res.dataList) ? [] : res.dataList.map(e => {
                        totalCount = totalCount + e.orderciunt;
                        return {
                            ...e,
                            order_receivables: this.$app.moneyFixed(e.order_receivables, 2)
                        }
                    });
                    let temp = Math.max(...this.dataShopObj.dataList.map(e => { return e.order_receivables }));
                    this.maxTurnover = temp > 0 ? temp : 1;
                    this.dataShopObj.totalCount = totalCount;
                    this.dataShopObj.order_total_receivables = this.$app.moneyFixed(res.order_total_receivables, 2);
                    this.dataShopObj.order_total_pdgfee = this.$app.moneyFixed(res.order_total_pdgfee, 2);
                    this.setSwiperHeight();
                }
            });
        },
        getPaymentAmountInfo() {                            // 获取支付数据
            let query = {
                date_start: this.startDate,
                date_end: this.endDate,
                user_id: this.user_id
            }
            stockApi.getPaymentAmountInfo(query).then(res => {
                if (res) {
                    this.dataPayment = res;
                    this.dataPayment.dataList = [];
                    if (!this.$app.isNull(res.values.dataList)) {
                        res.values.dataList.forEach(e => {
                            if (e.payment_amount !== 0) {
                                this.dataPayment.dataList.push(e)
                            }
                        });
                        this.dataPayment.dataList = this.$app.isNull(this.dataPayment.dataList) ? [] : this.dataPayment.dataList.map(e => {
                            return {
                                value: this.$app.moneyFixed(e.payment_amount, 2),
                                name: e.payment_method
                            }
                        });
                    } else {
                        this.dataPayment.dataList = [];
                    }
                    this.dataPayment.totalMoney = this.$app.moneyFixed(res.values.totalMoney, 2);
                    if (this.dataPayment.dataList.length > 0) this.dataPayType(this.dataPayment.dataList);
                    this.setSwiperHeight();
                }
            });
        },
        getMemberSalesAnalysis() {                          // 获取会员数统计
            let query = {
                start: this.startDate,
                end: this.endDate,
                user_id: this.user_id
            }
            stockApi.getMemberSalesAnalysis(query).then(res => {
                if (res) {
                    this.dataMemberObj = res.values;
                    this.setSwiperHeight();
                }
            });
        },
        getStoreMemberSaleCountInfo() {                     // 获取会员活跃分布
            let query = {
                start: this.startDate,
                end: this.endDate,
                user_id: this.user_id
            }
            stockApi.getStoreMemberSaleCountInfo(query).then(res => {
                if (res) {
                    this.dataMemberActive = res;
                    let totalCount = 0;
                    this.dataMemberActive.dataList = [];
                    if (!this.$app.isNull(res.values)) {
                        res.values.forEach(e => {
                            if (e.count > 0) {
                                totalCount = totalCount + e.count;
                                this.dataMemberActive.dataList.push(e)
                            }
                        });
                        this.dataMemberActive.dataList = this.$app.isNull(this.dataMemberActive.dataList) ? [] : this.dataMemberActive.dataList.map(e => {
                            return {
                                value: e.count,
                                name: e.remark
                            }
                        });
                    } else {
                        this.dataMemberActive.dataList = [];
                    }
                    this.dataMemberActive.totalCount = totalCount;
                    if (this.dataMemberActive.dataList.length > 0) this.memberActive(this.dataMemberActive.dataList);
                    this.setSwiperHeight();
                }
            });
        },
        getStoreMemberCountInfo() {                         // 获取各门店会员数
            stockApi.getStoreMemberCountInfo().then(res => {
                if (res) {
                    this.dataMemberNumber = this.$app.isNull(res.values) ? [] : res.values.map(e => {
                        return {
                            value: e.count,
                            name: e.storename
                        }
                    });
                    let temp = Math.max(...this.dataMemberNumber.map(e => { return e.value }));
                    this.maxMemberNumber = temp > 0 ? temp : 1;
                }
                this.setSwiperHeight();
            });
        },
        getProductSalesTop10() {                            // 商品销售排行
            let query = {
                start: this.startDate,
                end: this.endDate,
                user_id: this.user_id
            }
            stockApi.getProductSalesTop10(query).then(res => {
                if (res) {
                    this.dataRanking = this.$app.isNull(res.values) ? [] : res.values.map(e => {
                        return {
                            ...e,
                            sv_p_unitprice: this.$app.moneyFixed(e.sv_p_unitprice, 2),
                            sv_p_priceTotal: this.$app.moneyFixed(e.sv_p_unitprice * e.product_num, 2)
                        }
                    });
                    this.setSwiperHeight();
                }
            });
        },
        getDailyBill() {                                    // 每日对账单数据
            let query = {
                day: this.days,
                beginDate: this.startDate,
                endDate: this.endDate,
                user_id: this.user_id
            }
            stockApi.getDailyBill(query).then(res => {
                if (res) {
                    this.dataDailyBillFormat(res);
                }
            });
        },
    }
};
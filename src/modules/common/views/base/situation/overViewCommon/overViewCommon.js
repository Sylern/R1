import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { commonCharts, commonFunction } from '../../components/index';
import { mapState } from 'vuex';

export default {
    components: { commonCharts, commonFunction },
    data() {
        // const isNewVersion = window.location.href.indexOf('soft.') > -1 || window.location.href.indexOf(':8080') > -1;
        const isNewVersion = window.location.href.indexOf('ds.') > -1 || window.location.href.indexOf('soft.') > -1 || window.location.href.indexOf('8080') > -1;   // 判断是否新版框架
        const cache_industry = this.$store.state.userInfo.sv_uit_cache_name;                // 门店行业
        const newMemberIndustry = [             // 使用新版会员的行业
            'cache_name_detergent_industry'         // 洗洁行业
        ]
        const newCommodityIndustry = [          // 使用新版商品的行业
            'cache_name_clothing_and_shoes',        // 服装鞋帽
            'cachae_name_supermarket',              // 商超零售
            'cache_name_maternal_supplies',         // 母婴行业
            'cache_name_detergent_industry',        // 洗洁行业
            'cache_name_tobacco_tea',               // 烟酒茶行
        ]
        return {
            monthTrendType: '1',                // 趋势图数据类型 1-营业实收 2-订单笔数 3-新增会员
            //#region 右侧

            selectChartWrap: false,             // 选择图表弹框
            commonFunction: false,              // 常用功能弹框
            checked: [],                        // 选择的图表列表

            otherCharts: [],                    // 图表配置列表 enable:是否启用 type: B-销售分析 C1-店铺业绩 C2-支付方式 C3-员工销售排行 C4-支出分析 E-会员构成 F-会员消费排行榜 G-热销商品排行榜
            otherChartsDate: [],                // 图表日期
            otherChartsId: {                    // 生成图表的id 代理
                B: 'saleChart',                     // 销售分析
                C1: 'storePerformanceChart',        // 店铺业绩
                C2: 'paymentChart',                 // 支付方式
                C3: 'staffChart',                   // 员工销售排行
                C4: 'payChart',                     // 支出分析
                E: 'memberChart',                   // 会员构成
                F: 'memberConsumptionChart',        // 会员消费排行榜
                G: 'commodityChart'                 // 热销商品排行
            },
            modelDataAgent: {                   // 模块对应data的参数名 代理
                A: 'businessData',                  // 营业概况参数名
                B: 'saleData',                      // 销售分析
                C1: 'storePerformanceData',         // 店铺业绩
                C2: 'paymentData',                  // 支付方式
                C3: 'staffData',                    // 员工销售排行
                C4: 'payData',                      // 支出分析
                E: 'memberData',                    // 会员构成
                F: 'memberConsumptionData',         // 会员消费排行榜
                G: 'commodityData'                  // 热销商品排行
            },
            monthTrendForm: {                   // 近30天趋势 查询实体
                userId: '',
                startTime: this.$app.currentTimeFrame(5)[0],
                endTime: this.$app.currentTimeFrame(5)[1],
                type: '1'                           // 1默认查询当前店铺,0查询连锁店数据(大数据要)
            },
            monthTrendJson: {                   // 近30天趋势数据
                amountList: [],                     // 营业实收
                newMemberList: [],                  // 订单笔数
                orderList: []                       // 新增会员
            },
            monthTrendData: [],                 // 近30天趋势图表数据
            saleData: [],                       // 销售分析数据
            storePerformanceData: [],           // 店铺业绩数据
            paymentData: [],                    // 支付方式数据
            staffData: [],                      // 员工销售排行数据
            payData: [],                        // 支出分析数据
            memberData: [],                     // 会员构成数据
            memberConsumptionData: [],          // 会员消费排行榜数据
            commodityData: [],                  // 热销商品排行数据

            businessDate: '',                   // 营业概况时间选择器绑定的值
            businessDateType: '1',              // 营业概况时间 1-今日 2-昨日 3-近7天 4-近30天 5-自定义
            businessData: {                     // 营业概况数据
                amount_all: 0,                      // 总营业额
                count_order: 0,                     // 订单数
                expense_member: 0,                  // 会员消费金额
                count_newmember: 0,                 // 新增会员
                refund: 0,                          // 退款
                free: 0                             // 优折赠金额
            },
            commonFuncList: [                   // 常用功能
                {
                    name: '新增会员',
                    jurisdiction: 'AddMember',
                    needIndustry: [],
                    href: isNewVersion ? '/memberCenter/memberEntryAdd' : (newMemberIndustry.indexOf(cache_industry) > -1 ? '/Home/iframenestificat_N3?url=/vueview/vip/index.html#/memberCenter/memberEntryAdd' : '/member/memberList_N3'),
                    icon: base.frontImgBase + '/images/system/2.png'
                },
                {
                    name: cache_industry === 'cache_name_catering' ? '新增菜品' : '新增商品',
                    jurisdiction: 'AddCommodity',
                    needIndustry: [],
                    href: isNewVersion ? '/product/productEntryAdd' : '/Home/iframenestificat_N3?url=/vueview/commodity/index.html?activeName=productEntryAdd',
                    icon: base.frontImgBase + '/images/system/' + (cache_industry === 'cache_name_catering' ? '2.png' : '3.png')
                },
                // {
                //     name: '创建优惠券',
                //     jurisdiction: 'CouponAdd',
                //     needIndustry: [],
                //     href: isNewVersion ? '' : '/Coupon/CouponManage_N3',
                //     icon: base.frontImgBase + '/images/system/4.png'
                // },
                {
                    name: '销售流水报表',
                    jurisdiction: 'SalesReport',
                    needIndustry: [],
                    href: isNewVersion ? '/reportCensus?activeName=salesFlow' : (newCommodityIndustry.indexOf(cache_industry) > -1 ? '/Home/iframenestificat_N3?url=/vueview/rustructure/salesReport.html' : '/intelligent/Sellingwater_N3'),
                    icon: base.frontImgBase + '/images/system/5.png'
                },
                {
                    name: '要货管理',
                    jurisdiction: '',
                    needIndustry: [],
                    href: isNewVersion ? '/cargoFlow/demandList' : (newCommodityIndustry.indexOf(cache_industry) > -1 ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html#/cargoFlow/demandList' : '/Cargoflow/RequireGoods_N3'),
                    otherStatus: () => { return this.userInfo.sv_branchrelation == 1 },
                    icon: base.frontImgBase + '/images/system/6.png'
                },
                // {
                //     name: '短信营销',
                //     jurisdiction: 'SMSMarketing',
                //     needIndustry: [],
                //     href: isNewVersion ? '/promotion/index.html#/member/sendSms' : '/sms/sendsms_N3',
                //     icon: base.frontImgBase + '/images/system/7.png'
                // },
                // {
                //     name: '小程序装修',
                //     jurisdiction: '',
                //     needIndustry: [],
                //     href: isNewVersion ? '' : '/MobileStore/defTemplate_N3',
                //     icon: base.frontImgBase + '/images/system/8.png'
                // },
                // {
                //     name: '充值营销短信',
                //     jurisdiction: 'SMSMarketing',
                //     needIndustry: [],
                //     href: isNewVersion ? '/promotion/index.html#/member/couponManage' : '/Home/iframenestificat_N3?url=http://51.decerp.cc?user_id=' + this.$store.state.userInfo.user_id,
                //     icon: base.frontImgBase + '/images/system/9.png'
                // },
                {
                    name: cache_industry === 'cachae_name_supermarket' ? '捆绑商品列表' : '新增商品套餐',
                    jurisdiction: 'AddCommodity',
                    needIndustry: ['cachae_name_supermarket', 'cache_name_clothing_and_shoes'],
                    href: isNewVersion ? ('/commodity/setMeal' + (cache_industry === 'cachae_name_supermarket' ? '/tying' : '/addSetMeal')) : ('/Home/iframenestificat_N3?url=/vueview/commodity/index.html#/setMeal/tying/setMeal' + (this.cache_industry === 'cachae_name_supermarket' ? '/commodity/setMeal/tying' : '/commodity/setMeal/addSetMeal')),
                    otherStatus: () => { return newCommodityIndustry.indexOf(cache_industry) > -1 },
                    icon: base.frontImgBase + '/images/system/10.png'
                },
                // {
                //     name: '查询预约服务',
                //     jurisdiction: 'Reservationlist',
                //     needIndustry: ['cache_name_cosmetology'],
                //     href: isNewVersion ? '' : '/ProductReservation/Reservations2_N3',
                //     icon: base.frontImgBase + '/images/system/11.png'
                // },
                {
                    name: '采购进货',
                    jurisdiction: 'CommodityPurchase',
                    needIndustry: [],
                    href: isNewVersion ? '/purchasePackage/purchase' : (newCommodityIndustry.indexOf(cache_industry) > -1 ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=purchase' : '/repertory/Procurement_N3'),
                    icon: base.frontImgBase + '/images/system/12.png'
                },
            ],

            query: {                            // 查询实体
                // moduleName: '',                      // 模块名称 A-营业概况
                userId: '',                             // 门店ID
                startTime: '',                          // 开始时间
                endTime: '',                            // 结束时间
                type: ''                                // 1-默认查询当前店铺 0-查询连锁店数据(大数据要)
            },

            pickerOptions: {                    // 禁用日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            promotionList: [],                  // 促销工具
            hasProgram: false,                  // 是否开通小程序
        }
    },
    computed: {
        ...mapState(['userInfo', 'JurisdictionObj']),
        isNewModel() {               // 是否使用新版报表
            let list = [
                'cache_name_clothing_and_shoes',
                'cachae_name_supermarket',
                'cache_name_maternal_supplies',
                'cache_name_detergent_industry',
                'cache_name_tobacco_tea',
            ]
            let isInNew = list.indexOf(this.cache_industry) > -1;
            return isInNew
        },
        chartsList() {              // 页面启用的图表列表
            return this.otherCharts.filter(e => e.enable)
        },
        hasBigData() {              // 蓝色统计页面  一堆echarts图标的蓝蓝页面
            return this.userInfo.distributor_id == 147 || this.userInfo.distributor_id == 120 || (this.userInfo.distributor_id == 1 && (this.userInfo.user_id == '28173191' || this.userInfo.user_id == '36064549' || this.userInfo.user_id == '20434763' || this.userInfo.user_id == '63758474'))
        },
        cache_industry() {
            return this.userInfo.sv_uit_cache_name
        },
        isNewVersion() {
            return window.location.href.indexOf('soft.') > -1 || window.location.href.indexOf('ds.') > -1 || window.location.href.indexOf('webstore.') > -1 || window.location.href.indexOf('8080') > -1
        },
        shwoRechargeBtn() {
            let hasSendsms = this.userInfo.sv_menupermissions.find(e => e.code === 'sendsms')
            return this.$app.isNull(hasSendsms) ? false : hasSendsms.enable
        },
    },
    watch: {
        'saleData': {
            deep: true,
            handler: function (newVal, oldVal) {
                newVal && this.saleChart();
            }
        },
        'monthTrendType': {
            deep: true,
            handler: function (newVal, oldVal) {
                newVal === '1' && (this.monthTrendData = this.monthTrendJson.amountList);
                newVal === '2' && (this.monthTrendData = this.monthTrendJson.orderList);
                newVal === '3' && (this.monthTrendData = this.monthTrendJson.newMemberList);
                this.monthTrend();
            }
        }
    },
    mounted() {
        this.query.userId = this.userInfo.user_id;
        this.pickerOptions.disabledDate = (time) => {
            return time.getTime() > (new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1);
        }
        if (this.userInfo.distributor_id !== 1) {
            this.commonFuncList = this.commonFuncList.filter(e => e.name !== '充值营销短信')        // 供应商不用充值营销短信
        }

        this.$root.$on('overViewCommonRefresh', this.init);
    },
    beforeDestroy() {
        this.$root.$off('overViewCommonRefresh', this.init);
    },
    methods: {
        init() {                                                // 初始化数据
            this.handleBusinessDate('1');                           // 获取营业概况
            this.getHomePageLine();                                 // 获取30天趋势
            setTimeout(() => {
                this.getShopHomeChartConfig();                          // 获取图表列表
                this.getMarketingPlatform();                            // 获取常用功能权限
            }, 3000)
        },
        updata(e, option) {                                     // 组件回调 更改组件显示状态
            this[option] = e;
        },

        commonFuncIsShow(item) {                                // 常用功能-判断按钮是否展示(行业+权限+条件判断)
            let industry = true, jurisdiction = true, otherStatus = true;
            if (item.needIndustry.length > 0 && !item.needIndustry.find(e => e === this.cache_industry)) {
                industry = false;
            }
            if (!this.$app.isNull(item.jurisdiction)) {
                jurisdiction = this.JurisdictionObj[item.jurisdiction] ? true : false;
            }
            if (!this.$app.isNull(item.otherStatus)) {
                otherStatus = item.otherStatus() ? true : false;
            }
            return industry && jurisdiction && otherStatus
        },

        //#region echart 图表
        monthTrend() {                                          // echarts 最近30天趋势
            if (this.$app.isNull(document.getElementById('monthTrendEchart'))) return;
            var charts = echarts.init(document.getElementById('monthTrendEchart')); charts.clear();
            if (this.$app.isNull(this.monthTrendData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: {
                            backgroundColor: '#6a7985'
                        },
                        lineStyle: {
                            type: 'dashed',
                            color: '#ccc'
                        }
                    }
                },
                dataset: {
                    source: this.monthTrendData
                },
                grid: {
                    left: '0',
                    right: '4%',
                    bottom: '40px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,             // 两边留白
                    axisTick: {
                        show: false
                    },
                    axisLabel: { interval: 0 },
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    show: false
                },
                series: {
                    type: 'line',
                    encode: { x: 'date', y: 'amountSales' },
                    smooth: 0.5,                   // 是否平滑曲线显示
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: false,
                    itemStyle: {
                        color: '#506FEE',
                        borderColor: '#fff',
                        borderWidth: 3,
                        borderColor: '#fff',
                        shadowBlur: 8,
                        shadowColor: 'rgba(12, 21, 48, 0.4)',
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(23, 117, 252, 0.09)'
                        }, {
                            offset: 1,
                            color: 'rgba(225, 225, 225, 0.09)'
                        }])
                    },
                    emphasis: {
                        scale: true,
                        focus: 'self'
                    },
                }
            });
        },
        saleChart() {                                           // echarts 销售分析
            if (this.$app.isNull(document.getElementById('saleChart'))) return;
            var charts = echarts.init(document.getElementById('saleChart')); charts.clear();
            if (this.$app.isNull(this.saleData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: {
                            backgroundColor: '#6a7985'
                        },
                        lineStyle: {
                            type: 'dashed',
                            color: '#ccc'
                        }
                    }
                },
                dataset: {
                    source: this.saleData
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,             // 两边留白
                    axisTick: {
                        show: false
                    },
                    axisLabel: { interval: 0 },
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    show: false
                },
                series: {
                    type: 'line',
                    encode: { x: 'date', y: 'amountSales' },
                    smooth: 0.5,                   // 是否平滑曲线显示
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: false,
                    itemStyle: {
                        color: '#506FEE',
                        borderColor: '#fff',
                        borderWidth: 3,
                        borderColor: '#fff',
                        shadowBlur: 8,
                        shadowColor: 'rgba(12, 21, 48, 0.4)',
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(23, 117, 252, 0.09)'
                        }, {
                            offset: 1,
                            color: 'rgba(225, 225, 225, 0.09)'
                        }])
                    },
                    emphasis: {
                        scale: true,
                        focus: 'self'
                    },
                },
                grid: {
                    left: '0',
                    right: '4%',
                    bottom: '40px',
                    containLabel: true
                }
            });
        },
        memberChart() {                                         // echarts 会员构成
            if (this.$app.isNull(document.getElementById('memberChart'))) return;
            var charts = echarts.init(document.getElementById('memberChart')); charts.clear();
            if (this.$app.isNull(this.memberData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            let memberNum = this.memberData.reduce((total, e) => { return total + e.value }, 0);
            charts.setOption({
                backgroundColor: '#fff',
                color: [
                    '#4BB07F', '#4596DD', '#676FD7', '#D56350', '#EFA842', '#6BB34A',
                    '#CCE19C', '#ADD59B', '#8BC999', '#87CCC8', '#82CFF2', '#8AACD8',
                    '#8D97C9', '#8F83BB', '#AA89BC', '#C390BE', '#F09EC2', '#F09CA0',
                    '#EA6647', '#EF8F51', '#F6B45A', '#FFF368', '#B4D46B', '#81C26D',
                    '#38B16F', '#23B5B0', '#00B8EC', '#478AC7', '#5670B2', '#5F529E',
                    '#88579F', '#AC5C9F', '#E867A2', '#FFF368', '#B4D46B', '#E95F1C',
                    '#F19714', '#FFF000', '#91C432', '#2CAC40', '#009A48', '#009F96'
                ],
                title: {
                    subtext: memberNum,
                    text: '会员数',
                    x: 'center',
                    y: 'center',
                    subtextStyle: {
                        fontSize: '14'
                    },
                    textStyle: {
                        fontSize: '24',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {          // 鼠标移上去 黑色背景的提示内容
                    trigger: 'item',
                    formatter: '{a}<br />{b}{c}人({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    right: '20%',
                    height: 260,
                    itemGap: 20,
                },
                series: [
                    {
                        name: '会员构成',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            length: 30
                        },
                        emphasis: {
                            label: {          // 鼠标移上去 带引导线提示内容
                                show: true,
                                fontSize: '24',
                                fontWeight: 'bold',
                                formatter: '{b}{c}人'
                            }
                        },
                        data: this.memberData
                    }
                ]
            });
        },
        storePerformanceChart() {                               // echarts 店铺业绩
            if (this.$app.isNull(document.getElementById('storePerformanceChart'))) return;
            var charts = echarts.init(document.getElementById('storePerformanceChart')); charts.clear();
            if (this.$app.isNull(this.storePerformanceData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            let money = this.storePerformanceData.reduce((total, e) => { return total + e.value }, 0);
            charts.setOption({
                backgroundColor: '#fff',
                color: [
                    '#4BB07F', '#4596DD', '#676FD7', '#D56350', '#EFA842', '#6BB34A',
                    '#CCE19C', '#ADD59B', '#8BC999', '#87CCC8', '#82CFF2', '#8AACD8',
                    '#8D97C9', '#8F83BB', '#AA89BC', '#C390BE', '#F09EC2', '#F09CA0',
                    '#EA6647', '#EF8F51', '#F6B45A', '#FFF368', '#B4D46B', '#81C26D',
                    '#38B16F', '#23B5B0', '#00B8EC', '#478AC7', '#5670B2', '#5F529E',
                    '#88579F', '#AC5C9F', '#E867A2', '#FFF368', '#B4D46B', '#E95F1C',
                    '#F19714', '#FFF000', '#91C432', '#2CAC40', '#009A48', '#009F96'
                ],
                title: {
                    subtext: '总消费',
                    text: '￥' + money.toFixed(2),
                    x: 'center',
                    y: 'center',
                    subtextStyle: {
                        fontSize: '14'
                    },
                    textStyle: {
                        fontSize: '24',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {          // 鼠标移上去 黑色背景的提示内容
                    trigger: 'item',
                    formatter: '{a}<br />{b}{c}元({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    right: '20%',
                    height: 260,
                    itemGap: 20,
                },
                series: [
                    {
                        name: '业绩来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            length: 30
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '35',
                                fontWeight: 'bold',
                                formatter: '{b}{c}元'
                            }
                        },
                        data: this.storePerformanceData
                    }
                ]
            });
        },
        paymentChart() {                                        // echarts 支付方式
            if (this.$app.isNull(document.getElementById('paymentChart'))) return;
            var charts = echarts.init(document.getElementById('paymentChart')); charts.clear();
            if (this.$app.isNull(this.paymentData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            let money = this.paymentData.reduce((total, e) => { return total + e.value }, 0);
            charts.setOption({
                backgroundColor: '#fff',
                color: [
                    '#4BB07F', '#4596DD', '#676FD7', '#D56350', '#EFA842', '#6BB34A',
                    '#CCE19C', '#ADD59B', '#8BC999', '#87CCC8', '#82CFF2', '#8AACD8',
                    '#8D97C9', '#8F83BB', '#AA89BC', '#C390BE', '#F09EC2', '#F09CA0',
                    '#EA6647', '#EF8F51', '#F6B45A', '#FFF368', '#B4D46B', '#81C26D',
                    '#38B16F', '#23B5B0', '#00B8EC', '#478AC7', '#5670B2', '#5F529E',
                    '#88579F', '#AC5C9F', '#E867A2', '#FFF368', '#B4D46B', '#E95F1C',
                    '#F19714', '#FFF000', '#91C432', '#2CAC40', '#009A48', '#009F96'
                ],
                title: {
                    subtext: '总消费',
                    text: '￥' + money.toFixed(2),
                    x: 'center',
                    y: 'center',
                    subtextStyle: {
                        fontSize: '14'
                    },
                    textStyle: {
                        fontSize: '24',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a}<br />{b}{c}元({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    right: '20%',
                    height: 260,
                    itemGap: 20,
                },
                series: [
                    {
                        name: '支付方式',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            length: 30
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '35',
                                fontWeight: 'bold',
                                formatter: '{b}{c}元'
                            }
                        },
                        data: this.paymentData
                    }
                ]
            });
        },
        staffChart() {                                          // echarts 员工销售排行
            if (this.$app.isNull(document.getElementById('staffChart'))) return;
            var charts = echarts.init(document.getElementById('staffChart')); charts.clear();
            if (this.$app.isNull(this.staffData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                dataset: {
                    source: this.staffData
                },
                xAxis: {
                    type: 'category',
                    axisLabel: { interval: 0 },
                },
                yAxis: {},
                series: {
                    type: 'bar',
                    encode: { x: 'key', y: 'value' },
                    itemStyle: { color: '#4596DD' }
                }
            });
        },
        payChart() {                                            // echarts 支出分析
            if (this.$app.isNull(document.getElementById('payChart'))) return;
            var charts = echarts.init(document.getElementById('payChart')); charts.clear();
            if (this.$app.isNull(this.payData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: {
                            backgroundColor: '#6a7985'
                        },
                        lineStyle: {
                            type: 'dashed',
                            color: '#ccc'
                        }
                    }
                },
                dataset: {
                    source: this.payData
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,             // 两边留白
                    axisTick: {
                        show: false
                    },
                    axisLabel: { interval: 0 },
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    show: false
                },
                series: {
                    type: 'line',
                    encode: { x: 'key', y: 'value' },
                    smooth: 0.5,                   // 是否平滑曲线显示
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: false,
                    itemStyle: {
                        color: '#506FEE',
                        borderColor: '#fff',
                        borderWidth: 3,
                        borderColor: '#fff',
                        shadowBlur: 8,
                        shadowColor: 'rgba(12, 21, 48, 0.4)',
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(23, 117, 252, 0.09)'
                        }, {
                            offset: 1,
                            color: 'rgba(225, 225, 225, 0.09)'
                        }])
                    },
                    emphasis: {
                        scale: true,
                        focus: 'self'
                    },
                },
                grid: {
                    left: '0',
                    right: '4%',
                    bottom: '40px',
                    containLabel: true
                }
            });
        },
        memberConsumptionChart() {                              // echarts 会员消费排行榜
            if (this.$app.isNull(document.getElementById('memberConsumptionChart'))) return;
            var charts = echarts.init(document.getElementById('memberConsumptionChart')); charts.clear();
            if (this.$app.isNull(this.memberConsumptionData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                dataset: {
                    source: this.memberConsumptionData
                },
                xAxis: {
                    type: 'category',
                    axisLabel: { interval: 0 },
                },
                yAxis: {},
                series: {
                    type: 'bar',
                    encode: { x: 'sv_mr_name', y: 'order_receivable' },
                    itemStyle: { color: '#4596DD' }
                    // 定义了每个维度的名称。这个名称会被显示到默认的 tooltip 中。
                    // dimensions: ['name', 'age', 'profession', 'score', 'date']
                }
            });
        },
        commodityChart() {                                      // echarts 热销商品排行
            if (this.$app.isNull(document.getElementById('commodityChart'))) return;
            var charts = echarts.init(document.getElementById('commodityChart')); charts.clear();
            if (this.$app.isNull(this.commodityData)) {
                charts.setOption({ title: { text: '暂无数据', left: 'center', top: '70%', textStyle: { fontWeight: 'normal', color: '#c6c6c6' } } });
                return
            };
            charts.setOption({
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                dataset: {
                    source: this.commodityData
                },
                xAxis: {
                    type: 'category',
                    axisLabel: { interval: 0 },
                },
                yAxis: {},
                series: {
                    type: 'bar',
                    encode: { x: 'product_name', y: 'product_num_out' },
                    itemStyle: { color: '#4596DD' }
                }
            });
        },
        //#endregion

        //#region 跳转 下载
        handleRenewUrl() {                                      // 拼接续费页面地址
            if (this.isNewVersion) {
                this.$router.push({
                    path: '/renew/renewChooseEntry',
                    query: {
                        singleType: this.userInfo.buyshopnumber ? 'many' : 'odd'
                    }
                })
                return
            }
            window.top.location.href = '/Home/iframenestificat_N3?url=/vueview/promotion/index.html'
        },
        handleCommonFunc(item) {
            if (this.$app.isNull(item.href)) return;
            if (this.isNewVersion) {
                this.$router.push({
                    path: item.href
                })
            } else {
                window.parent.location.href = item.href;
            }
        },
        handleToOtherModel(name, expired = true) {              // 常用功能跳转     expired-是否开通
            // 新增商品地址
            const addProduct = this.userInfo.sv_uit_cache_name === 'cache_name_catering' ? '/Product/addCateringProduct_N3' : this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/commodity/index.html?activeName=productEntryAdd' : ' /Product/Index_N3';         // /Product/Index_N3 /Product/addCateringProduct_N3
            let hrefs = {           // 跳转地址代理
                店铺中心: '/System/comsetpage_N3?url=/vueview/system/index.html#/personalStores/storesCenter',
                数据信息: '/Home/common_N3',                     // 大屏数据分析页面
                //#region 常用功能
                // 前台收银: '/Home/Index2_N3',
                新增会员: this.isNewVersion ? '/memberCenter/memberEntryAdd' : '/member/memberList_N3',
                会员列表: this.isNewVersion ? '/memberCenter/memberEntry' : '/member/memberList_N3',
                新增商品: addProduct,
                新增菜品: '/Product/addCateringProduct_N3',
                创建优惠券: '/Coupon/CouponManage_N3',
                销售流水报表: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/rustructure/salesReport.html' : '/intelligent/Sellingwater_N3',
                要货管理: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html#/purchasePackage/purchase' : '/Cargoflow/RequireGoods_N3',
                短信营销: '/sms/sendsms_N3',
                小程序装修: '/MobileStore/defTemplate_N3',
                充值营销短信: '/Home/iframenestificat_N3?url=http://51.decerp.cc?user_id=' + this.userInfo.user_id,
                捆绑商品列表: this.isNewModel ? '/commodity/setMeal/tying' : '/Home/iframenestificat_N3?url=/vueview/commodity/index.html#/setMeal/tying',
                新增商品套餐: '/Home/iframenestificat_N3?url=/vueview/commodity/index.html#/setMeal/addSetMeal',
                查询预约服务: '/ProductReservation/Reservations2_N3',
                采购进货: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=purchase' : '/repertory/Procurement_N3',
                //#endregion
                //#region 更多服务                
                特价: '/Promotional/Promotional_SpecialPrice_List_N3',
                拼团: '/UserModuleConfig/assemblelist_N3',
                满减: '/Promotional/Promotional_Reduction_List_N3',
                折扣: '/Promotional/Promotional_Discount_List_N3',
                秒杀: '/UserModuleConfig/seckilllist_N3',
                满送: '/Promotional/Promotional_Give_List_N3',
                邀请有礼: '/UserModuleConfig/Invitingconfiguration_N3',
                //#endregion
                //#region 待办事项
                待入库: this.isNewVersion ? '/cargoFlow/demandList' : '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=demandList',
                库存预警: this.isNewVersion ? '/purchasePackage/purchase' : '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=purchase',
                商品列表: this.isNewVersion ? '/product/productEntry' : '/Home/iframenestificat_N3?url=/vueview/commodity/index.html?activeName=productEntry',
                待核销: this.isNewVersion ? '' : '/Home/iframenestificat_N3?url=/vueview/onlineOrder/index.html',
                待服务: '/ProductReservation/Reservations2_N3',
                //#endregion
                立即开通: '/system/PaymentApplication_N3',
            }
            if (!expired) { return this.handleMarketingTool({ sv_is_opened: false }) };         // 没开通跳转购买页面或弹出代理商电话
            name && hrefs[name] && (this.isNewVersion ? this.$router.push({ path: hrefs[name] }) : window.top.location.href = hrefs[name]);
        },
        handlePayment() {

        },
        //#endregion

        handleDate(e) {                                         // 设置搜索实体的开始时间和结束时间
            let now = new Date();
            let nowMonth = now.getMonth();              // 未加1的本月
            let year = now.getFullYear();
            let month = nowMonth + 1 < 10 ? '0' + (nowMonth + 1) : nowMonth + 1;
            let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();            // 当天日期
            let preMonth = parseInt(month);             // 前面的月份
            const dayFormat = this.$app.currentTime(now, "yyyy-MM-dd HH:mm:ss");
            switch (e) {
                case '1':       // 今天
                    if (this.$app.isNull(this.$app.currentTimeFrame(0))) return
                    this.query.startTime = this.$app.currentTimeFrame(0)[0];
                    this.query.endTime = this.$app.currentTimeFrame(0)[1];
                    break;
                case '2':       // 昨日
                    this.query.startTime = this.$app.currentTime(new Date(new Date(year, nowMonth, day) - 24 * 60 * 60 * 1000), "yyyy-MM-dd HH:mm:ss");
                    this.query.endTime = this.$app.currentTime(new Date(new Date().setHours(0, 0, 0, 0) - 1 * 1000), "yyyy-MM-dd HH:mm:ss");
                    break;
                case '3':       // 7天内
                    if (this.$app.isNull(this.$app.currentTimeFrame(4))) return
                    this.query.startTime = this.$app.currentTimeFrame(4)[0];
                    this.query.endTime = this.$app.currentTimeFrame(4)[1];
                    break;
                case '4':       // 一个月内
                    if (this.$app.isNull(this.$app.currentTimeFrame(5))) return
                    this.query.startTime = this.$app.currentTimeFrame(5)[0];
                    this.query.endTime = this.$app.currentTimeFrame(5)[1];
                    break;
                case '5':       // 三个月内
                    preMonth = preMonth - 3 === 0 ? 12 : preMonth - 3;
                    var preSize = new Date(year, parseInt(month) - 3, 0).getDate();    // 上3个月总天数
                    this.query.startTime = (preMonth === 12 ? year - 1 : year) + '-' + (preMonth < 10 ? '0' + preMonth : preMonth) + '-' + (preSize < parseInt(day) ? preSize : day) + ' 00:00:00';
                    this.query.endTime = dayFormat;
                    break;
                case '6':       // 本周
                    if (this.$app.isNull(this.$app.currentTimeFrame(1))) return
                    this.query.startTime = this.$app.currentTimeFrame(1)[0];
                    this.query.endTime = this.$app.currentTimeFrame(1)[1];
                    break;
                case '7':       // 本月
                    if (this.$app.isNull(this.$app.currentTimeFrame(2))) return
                    this.query.startTime = this.$app.currentTimeFrame(2)[0];
                    this.query.endTime = this.$app.currentTimeFrame(2)[1];
                    break;
            }
        },
        handleBusinessDate(e) {                                 // 营业概况 时间筛选
            this.businessDateType = e;
            this.handleDate(e);
            this.getHomepageModuleTwoA('A');                        // 获取营业概况
        },
        handleChangeTime(e) {                                   // 时间选择器回调
            let time = e.map(element => {
                return element = this.$app.currentTime(element, "yyyy-MM-dd HH:mm:ss");
            });
            [this.query.startTime, this.query.endTime] = time;
            this.businessDateType = '5';
            this.getHomepageModuleTwoA();
        },
        handleDatePick() {                                      // 销售分析 点击时间选择器
            document.querySelector('.date_picker').click();
        },
        handleItemName(type) {                                  // 设置图表标题
            let obj = {
                B: '销售分析',
                C1: '店铺业绩',
                C2: '支付方式',
                C3: '员工销售排行',
                C4: '支出分析',
                E: '会员构成',
                F: '会员消费排行榜',
                G: '热销商品排行'
            }
            return obj[type]
        },
        handleJurisdiction(type) {
            let obj = {
                B: this.JurisdictionObj.Sales_Analysis,
                C1: this.JurisdictionObj.Store_Performance,
                C2: this.JurisdictionObj.Payment_Method_Sales,
                C3: this.JurisdictionObj.Staff_Sales_Ranking,
                C4: this.JurisdictionObj.Expenditure_Analysis,
                E: this.JurisdictionObj.Member_Analysis,
                F: this.JurisdictionObj.Member_Consume_Ranking,
                G: this.JurisdictionObj.Product_Sales_Ranking
            }
            return obj[type]
        },
        handleChartId(type) {                                   // 设置生成echarts图表所需的id
            return this.otherChartsId[type]
        },
        haveData(type) {                                        // 设置生成echarts图表所需的id
            return !this.$app.isNull(this[this.modelDataAgent[type]])
        },
        handleChartsDate(type, i, chartName) {                     // 图表时间改变事件
            if (this.otherChartsDate[i] === type) return
            this.otherChartsDate.splice(i, 1, type);
            this.handleDate(type);
            this['getHomepageModuleTwo' + (chartName.length > 1 ? 'C' : chartName)](chartName.length > 1 ? chartName : '');
        },
        hideExpire() {
            this.$router.push({ path: '/' })
        },
        winTopDialog() {
            if (this.isNewVersion) return;
            let div = document.createElement('div');
            let dom = this.userInfo.distributor_id == 1 ?
                `<div>您的店铺服务已过期。现在订购可获得多种行业解决方案。立即订购</div><div onclick="(function(){window.location.href='${this.handleRenewUrl()}'})()" style="display:inline-block;margin-top:60px;width: 150px;text-align:center;line-height:35px;background:#506FEE;color: #fff;border-radius: 3px;cursor: pointer;">立即续费</div>`
                : `<div>您的店铺服务已过期。现在订购可获得多种行业解决方案。请及时联系：</div><div style="margin:20px 0 40px;color:#2b82fd;">${this.userInfo.sv_d_phone || ''}</div>`

            div.style = 'position:fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0,0,0,.4);z-index: 9999;';
            div.innerHTML =
                `<div style="position:absolute;top: 50%;left: 50%;transform:translate(-50%,-50%);width: 400px;padding:20px 20px;text-align: center;background:#fff;border-radius:10px;">
                    <div style="margin-bottom:60px">到期提醒</div>
                    ${dom}
                    <div class="renew_close" onclick="(function(){window.location.href='/Login'})()">
                        <span class="lf"></span>
                        <span class="rt"></span>
                    </div>
                    <style>
                        .renew_close{
                            position: absolute;
                            right: 0px;
                            top: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 28px;
                            height: 28px;
                            transform: translate(33px, 5px);
                            cursor: pointer;
                        }
                        .renew_close .lf{
                            position: absolute;
                            display: inline-block;
                            width: 25px;
                            height: 2px;
                            border-radius: 2px;
                            background:#fff;
                            transform: rotate(45deg);
                        }
                        .renew_close .rt{
                            position: absolute;
                            display: inline-block;
                            width: 25px;
                            height: 2px;
                            border-radius: 2px;
                            background:#fff;
                            transform: rotate(-45deg);
                        }
                    </style>
                </div>`;
            let dialogDiv = document.createElement('div');
            dialogDiv.style = 'position:absolute;top: 50%;left: 50%;transfrom:translate(-50%,-50%);';

            div.appendChild(dialogDiv)
            window.top.document.body.appendChild(div);
        },

        getHomePageLine() {                                     // 近30天趋势
            this.monthTrendForm.userId = this.userInfo.user_id;
            basicApi.getHomePageLine(this.monthTrendForm).then(res => {
                if (res) {
                    this.monthTrendJson.amountList = res.amountList.map(e => { e.date = e.date.substr(5); return e });
                    this.monthTrendJson.newMemberList = res.newMemberList.map(e => { e.date = e.date.substr(5); return e });
                    this.monthTrendJson.orderList = res.orderList.map(e => { e.date = e.date.substr(5); return e });
                    this.monthTrendType = '1';
                    this.monthTrendData = this.monthTrendJson.amountList
                    this.monthTrend();
                }
            });
        },
        getKfConfig() {                                         // 获取客服信息
            basicApi.getKfConfig().then(res => {
                if (res) {
                    let kfInfo = this.$app.isNull(res.sv_agent_custom_config) ? '' : res.sv_agent_custom_config.find(e => e.type == 4);
                    this.kfData.kfWehcatImg = this.$app.isNull(res.sv_agent_custom_config) ? '' : res.sv_agent_custom_config.find(e => e.type == 5).img;
                    this.kfData.headImg = this.$app.isNull(kfInfo) ? '' : kfInfo.img;
                    if (this.$app.isNull(res.sv_d_user_name) && !this.$app.isNull(kfInfo) && !this.$app.isNull(kfInfo.data)) {
                        this.kfData.name = kfInfo.data[0].data;
                        this.kfData.mobile = kfInfo.data[1].data;
                    } else {
                        this.kfData.name = res.sv_d_user_name;
                        this.kfData.mobile = res.sv_d_user_mobile;
                    }
                }
            });
        },
        getHomepageModuleTwoA() {                               // 获取店铺概况数据
            basicApi.getHomepageModuleTwoA(this.query).then(res => {
                if (res) {
                    this.businessData = res;
                }
            });
        },
        getHomepageModuleTwoB(name) {                           // 获取销售分析数据
            basicApi.getHomepageModuleTwoB({ ...this.query }).then(res => {
                if (res) {
                    let arr = res.map(e => {
                        e.date = e.date.substring(5);
                        return { ...e }
                    });
                    this.saleData.forEach(e => {
                        arr.find(f => f.date === e.date) && (e.amount_sales = arr.find(f => f.date === e.date).amount_sales)
                    })
                    this.saleData = arr;
                } else {
                    this.saleData = [];
                }
                this.saleChart();
            });
        },
        getHomepageModuleTwoC(type = '') {                      // 如果传了type只更新单个数据 获取C1-店铺业绩 C2-支付方式 C3-员工销售排行 C4-支出分析 数据
            basicApi.getHomepageModuleTwoC({ ...this.query }).then(res => {
                if (res) {
                    this.storePerformanceData = res.filter(e => e.subname === 'C1').map(e => {          // 店铺业绩
                        let value = e.value;
                        let name = e.key === 'expense_other' ? '散客消费' : e.key === 'expense_member' ? '会员消费' : '';
                        return { value, name }
                    });
                    this.paymentData = res.filter(e => e.subname === 'C2').map(e => {                   // 支付方式
                        let value = e.value;
                        let name = e.key;
                        return { value, name }
                    });
                    this.staffData = res.filter(e => e.subname === 'C3');                               // 员工销售排行
                    let c4Arr = res.filter(e => e.subname === 'C4').map(e => {                       // 支出分析
                        e.key = e.key.substring(5);
                        return { ...e }
                    });
                    let arr = [];
                    c4Arr.forEach(e => {
                        arr.find(f => f.key === e.key) ? arr.find(f => f.key === e.key).value += e.value : arr.push(e);
                    })
                    this.payData = arr;
                }
                if (type === '') {      // 进入页面全部更新
                    this.JurisdictionObj.Store_Performance && this.storePerformanceChart()     // 店铺业绩
                    this.JurisdictionObj.Payment_Method_Sales && this.paymentChart()           // 支付方式
                    this.JurisdictionObj.Staff_Sales_Ranking && this.staffChart()              // 员工销售排行
                    this.JurisdictionObj.Expenditure_Analysis && this.payChart()               // 支出分析
                    return
                }
                // 更改哪个echart时间就更新哪个echart
                type === 'C1' && this.JurisdictionObj.Store_Performance && this.storePerformanceChart()     // 店铺业绩
                type === 'C2' && this.JurisdictionObj.Payment_Method_Sales && this.paymentChart()           // 支付方式
                type === 'C3' && this.JurisdictionObj.Staff_Sales_Ranking && this.staffChart()              // 员工销售排行
                type === 'C4' && this.JurisdictionObj.Expenditure_Analysis && this.payChart()               // 支出分析
            });
        },
        getHomepageModuleTwoE(name) {                           // 获取会员构成数据
            basicApi.getHomepageModuleTwoE({ ...this.query }).then(res => {
                this.memberData = res ? res.map(e => {
                    const value = e.count;
                    const name = e.sv_ml_name;
                    return { value, name }
                }) : [];
                this.memberChart();
            });
        },
        getHomepageModuleTwoF(name) {                           // 获取会员消费排行榜数据
            basicApi.getHomepageModuleTwoF({ ...this.query }).then(res => {
                this.memberConsumptionData = res || [];
                this.memberConsumptionChart();
            });
        },
        getHomepageModuleTwoG(name) {                           // 获取热销商品排行榜数据
            basicApi.getHomepageModuleTwoG({ ...this.query }).then(res => {
                this.commodityData = res || [];
                this.commodityChart();
            });
        },
        getShopHomeChartConfig() {                              // 获取图表配置、列表
            basicApi.getShopHomeChartConfig().then(res => {
                if (res) {
                    const response = res;
                    this.otherCharts = [];
                    this.JurisdictionObj.Sales_Analysis && this.otherCharts.push(...response.filter(e => e.type == 'B'));
                    this.JurisdictionObj.Store_Performance && this.otherCharts.push(...response.filter(e => e.type == 'C1'));
                    this.JurisdictionObj.Payment_Method_Sales && this.otherCharts.push(...response.filter(e => e.type == 'C2'));
                    this.JurisdictionObj.Staff_Sales_Ranking && this.otherCharts.push(...response.filter(e => e.type == 'C3'));
                    this.JurisdictionObj.Expenditure_Analysis && this.otherCharts.push(...response.filter(e => e.type == 'C4'));
                    this.JurisdictionObj.Member_Analysis && this.otherCharts.push(...response.filter(e => e.type == 'E'));
                    this.JurisdictionObj.Member_Consume_Ranking && this.otherCharts.push(...response.filter(e => e.type == 'F'));
                    this.JurisdictionObj.Product_Sales_Ranking && this.otherCharts.push(...response.filter(e => e.type == 'G'));
                    this.otherChartsDate = response.map(() => { return '6'; });     // 本周active
                    this.$nextTick(() => {
                        let isGetCModel = false;
                        this.otherCharts.forEach(e => {
                            if (e.enable && e.type !== 'A') {
                                const optionName = 'getHomepageModuleTwo' + (e.type.length > 1 ? 'C' : e.type);

                                // 设置默认展示的数据时间段  1-今天 2-昨天 3-本周 4-本月
                                this.handleDate('6');
                                // C1 C2 C3 C4四个表在一个接口一起返回 只请求一次
                                if (e.type.length === 2) {          // 如果是 C1 C2 C3 C4 
                                    if (!isGetCModel)               // 判断有没有请求过C模块  因为C模块接口包含C1 C2 C3 C4 所以只请求一次
                                        this[optionName](), isGetCModel = true;
                                    return
                                }
                                this[optionName]()
                            }
                        })
                        this.$emit('refreshSrcoll')
                    })
                }
            })
        },
        getMarketingPlatform() {                                // 获取常用功能权限 is_promotion_permissio
            basicApi.getMarketingPlatform().then(res => {
                if (res && res.list) {
                    this.hasProgram = res.is_small_program_permissio;
                    let rplist = ['特价', '拼团', '满减', '折扣', '秒杀', '满送', '邀请有礼'];
                    // 各分类主ID
                    const promotionId = res.list.find(e => e.sv_func_name === '促销工具') && res.list.find(e => e.sv_func_name === '促销工具').sv_func_id,
                        marketingToolsId = res.list.find(e => e.sv_func_name === '营销工具') && res.list.find(e => e.sv_func_name === '营销工具').sv_func_id,
                        precisionMarketingId = res.list.find(e => e.sv_func_name === '精准营销') && res.list.find(e => e.sv_func_name === '精准营销').sv_func_id,
                        hotId = res.list.find(e => e.sv_func_name === '热门推荐') && res.list.find(e => e.sv_func_name === '热门推荐').sv_func_id,
                        marketingActivitiesId = res.list.find(e => e.sv_func_name === '营销活动') && res.list.find(e => e.sv_func_name === '营销活动').sv_func_id,
                        marketingId = res.list.find(e => e.sv_func_name === '营销') && res.list.find(e => e.sv_func_name === '营销').sv_func_id;
                    // 各分类列表
                    let promotionList = [], marketingToolsList = [], precisionMarketingList = [], hotList = [], marketingActivitiesList = [], marketingList = [];
                    res.list.forEach(e => {
                        e.sv_func_code === 'ValueAddedServices_Recommend_MINI' && (e.expired = res.is_small_program_permissio)
                        e.sv_func_code === 'Integral_mall' && (e.expired = res.is_integral_permissio)

                        e.sv_func_parentid === promotionId && (e.expired = res.is_promotion_permissio, promotionList.push(e));

                        e.sv_func_parentid === marketingToolsId && marketingToolsList.push(e);

                        e.sv_func_parentid === precisionMarketingId && precisionMarketingList.push(e);

                        e.sv_func_parentid === hotId && hotList.push(e);

                        e.sv_func_parentid === marketingActivitiesId && marketingActivitiesList.push(e);

                        e.sv_func_parentid === marketingId && marketingList.push(e);
                    })

                    this.promotionList = res.list.filter(e => rplist.indexOf(e.sv_func_name) > -1).map(e => {
                        e.title = [];
                        if (e.sv_func_name.length > 2) {
                            e.title.push(e.sv_func_name[0]), e.title.push(e.sv_func_name[3]);
                        } else {
                            e.title.push(e.sv_func_name[0]), e.title.push(e.sv_func_name[1]);
                        }
                        return e
                    });
                }
            });
        },
        handleOpen(url) {                                       // 打开新窗口
            window.open(url)
        },
        handleShowFeedback() {
            this.$root.$emit('feedbackMessage');
        },
        handleRoute(code) {
            switch (code) {
                case 'sendSms': this.$router.push({ path: '/member/sendSms' }); break;
                case 'renewChooseEntry':
                    this.$router.push({ path: '/renew/renewChooseEntry', query: { singleType: this.$store.state.userInfo.buyshopnumber ? 'many' : 'odd' } })
                    break;
                default: break;
            }
        },

    }
}

import base from '@/api/base';
import { basicApi, stockApi } from "@/api";
import { mapState } from 'vuex';


export default {
    data() {
        const userInfo = this.$store.state.userInfo;
        return {
            storeList: [],                         //学校
            fnListData: [
                {
                    icon: base.frontImgBase + '/images/base/education/01.png',
                    name: '学员资料',
                    url: '/student/studentEntry'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/02.png',
                    name: '报名/续费',
                    url: '/cashier/home'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/03.png',
                    name: '我的课表',
                    url: '/education/courseSetManagement'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/04.png',
                    name: '报名订单',
                    url: '/apply'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/05.png',
                    name: '快速扣课时',
                    url: userInfo.sv_us_industrytype === 32 ? '/fitness_shortcuts' : '/shortcuts'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/06.png',
                    name: '批量扣课时',
                    url: userInfo.sv_us_industrytype === 32 ? '/fitness_multiple' : '/multiple'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/07.png',
                    name: '班级管理',
                    url: '/education/classManagement'
                },
                {
                    icon: base.frontImgBase + '/images/base/education/08.png',
                    name: '试听管理',
                    url: '/student/auditions'
                }
            ],

            queryEntity: {
                sv_start_date: "",
                sv_end_date: ""
            },

            memberReportEntity: {   //学员来源查询实体
                user_list: [],
                start_date: "",
                end_date: ""
            },
            sourceDayTxt: "本月",
            sourceRes: {},
            memberReportRes: {},


            classReportEntity: {
                user_list: [],
                start_date: "",
                end_date: ""
            },
            classDayTxt: "本月",
            classReportRes: {},
            arrearsCount: 0, //欠费笔数
            notNamedCount: 0, //超时未点名数

            memberCourseDailySummaryRes: {}
            
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },

    mounted() {
        this.getstore_list()
        // basicApi.GetOverviewSummary().then(res => {
        //     this.arrearsCount = res.arrearsCount || 0 //欠费笔数
        //     this.notNamedCount = res.notNamedCount || 0 //超时未点名数
        // })
        this.memberReportEntity.user_list = [+this.userInfo.user_id]
        this.GetMemberAnalyseSource()
        this.GetMemberAnalyse()

        this.classReportEntity.user_list = [+this.userInfo.user_id]
        this.GetMemberClassAnalyse()

        basicApi.GetMemberCourseDailySummary().then(res => {
            this.memberCourseDailySummaryRes = res
            this.drawMemberCourseDailySummary()
        })


        window.onresize = () => {
            this.inEchart && this.inEchart.resize()
            this.saleEchart && this.saleEchart.resize()
            this.cutEchart && this.cutEchart.resize()
            this.addEchart && this.addEchart.resize()
            this.sourceEchart && this.sourceEchart.resize()
            this.timesEchart && this.timesEchart.resize()
        }
    },
    methods: {
        //#region  方法
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(item => { return { label: item.sv_us_name, value: +item.user_id, uset_type: item.user_tye } });
            });
        },
        GetMemberAnalyseSource() {
            basicApi.GetMemberAnalyseSource(this.memberReportEntity).then(res => {
                this.sourceRes = res
                this.drawSource()
            })
        },

        GetMemberAnalyse() {
            basicApi.GetMemberAnalyse(this.memberReportEntity).then(res => {
                this.memberReportRes = res
            })
        },

        GetMemberClassAnalyse() {
            basicApi.GetMemberClassAnalyse(this.classReportEntity).then(res => {
                this.classReportRes = res
                this.drawTimes()
            })
        },


        //#endregion

        //#region  画图
        drawSource() {
            this.$nextTick(() => {
                const { list } = this.sourceRes
                const sourceRes = list || []
                !this.sourceEchart && (this.sourceEchart = echarts.init(document.getElementById("source")))
                const sourceOption = {
                    // title:"来源渠道",
                    title: {
                        text: '来源渠道', // 标题文本  
                        // postion: 'center', // 标题位置，可设置为 'left'、'right'、'center'  
                        textStyle: { // 标题样式  
                            color: '#aaa', // 标题文本颜色
                            fontSize: 14,
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none' // 'shadow' as default; can also be 'line' or 'shadow'
                        },
                        backgroundColor: 'rgba(255,255,255,0.8)', // 将背景色设置为透明
                        textStyle: {
                            color: 'black',
                        },
                        extraCssText: 'box-shadow: 0 2px 12px 0 #999;',  // 添加阴影效果
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#eee' // 设置辅助线颜色
                            }
                        },
                        axisLabel: {
                            color: "#aaa"
                        }
                    },
                    yAxis: {
                        type: 'category',
                        // data: ['线上', '线下', '其它'],
                        // data: ['线上', '线下'],
                        data: sourceRes.map(item => item.sv_ms_name),
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#eee' // 设置辅助线颜色
                            }
                        },
                        axisLabel: {
                            color: "#aaa"
                        }
                    },
                    series: [
                        {
                            name: '注册学员',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            // data: [320, 301],
                            data: sourceRes.map(item => item.registered_count),
                            itemStyle: {
                                color: 'rgb(124,39,255)', // 自定义系列颜色  
                            },
                            // barWidth: 25, // 自定义柱状条形图的宽度 
                            barMaxWidth: 30, // 自定义柱状条形图的最大宽
                        },
                        {
                            name: '消费学员',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            // data: [120, 132],
                            data: sourceRes.map(item => item.consume_count),
                            itemStyle: {
                                color: 'rgb(49,81,227)', // 自定义系列颜色  
                            },
                        },
                        {
                            name: '上课学员',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            // data: [220, 182],
                            data: sourceRes.map(item => item.class_count),
                            itemStyle: {
                                color: 'rgb(0,162,255)', // 自定义系列颜色  
                            },
                        },

                    ]
                }
                this.sourceEchart.setOption(sourceOption)
                this.$emit('refreshSrcoll')
            })
        },
        drawTimes() {
            const { classReportRes } = this
            const { member_count_1 = 0, member_count_2 = 0, member_count_3 = 0, member_count_4 = 0, member_count_5 = 0 } = classReportRes
            !this.timesEchart && (this.timesEchart = echarts.init(document.getElementById("times")))
            const timesOption = {
                legend: {
                    orient: 'vertical', // legend 布局方向，默认为垂直布局  
                    right: '38%',
                    top: "25%",
                    itemGap: 30, // legend 每行数据项之间的间隔
                    label: {
                        rotate: 90,  // 旋转标签  
                        align: 'right',  // 对齐方式，'left' 或 'right'  
                        verticalAlign: 'middle',  // 标签的垂直对齐方式，'top' 或 'bottom' 或 'middle'  
                    },
                    textStyle: {
                        color: "#aaa"
                    },
                    itemWidth: 10, // 设置图例色块的宽度
                    itemHeight: 10, // 设置图例色块的高度

                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        left: "-40%",
                        radius: ['40%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                            textStyle: {

                            },
                            formatter: function (params) {
                                return [
                                    `{count|${params.value}}{grap|}{unit|人}`,
                                    `{grap|}`,
                                    `{name|${params.name}}`
                                ].join("\n")
                            },
                            rich: {
                                count: {
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: 40
                                },
                                unit: {
                                    color: "#000",
                                    fontSize: 16,
                                },
                                name: {
                                    color: "#aaa",
                                    fontSize: 14,
                                },
                                grap: {
                                    width: 5,
                                    height: 10
                                }
                            },
                        },

                        emphasis: {
                            label: {
                                show: true,
                            }
                        },
                        data: [
                            { value: member_count_1, name: '1~3次', itemStyle: { color: "rgb(49,81,227)" } },
                            { value: member_count_2, name: '4~5次', itemStyle: { color: "rgb(124,39,255)" } },
                            { value: member_count_3, name: '6~10次', itemStyle: { color: "rgb(0,162,255)" } },
                            { value: member_count_4, name: '11~15次', itemStyle: { color: "rgb(0,208,240)" } },
                            { value: member_count_5, name: '16+次', itemStyle: { color: "rgb(255,230,119)" } }
                        ]
                    }
                ]
            }
            this.timesEchart.setOption(timesOption)
        },
        //#endregion
        drawMemberCourseDailySummary() {
            const { memberCourseDailySummaryRes } = this
            const {
                course_count_sell_percent,
                course_count_sell_buy,
                course_count_sell_renewal,
                expense_list,
                member_list
            } = memberCourseDailySummaryRes
            const expenseList = expense_list || []
            const memberList = member_list || []

            !this.inEchart && (this.inEchart = echarts.init(document.getElementById("map_in")))
            const inOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgb(49,81,227)',
                    textStyle: {
                        color: 'white',
                    },
                    axisPointer: {
                        type: 'none' // 设置辅助线类型为无，即不显示辅助线  
                    },
                    formatter: '{b}：￥{c}'
                },
                xAxis: {
                    show: false,
                    data:new Array(30).fill(0).map((_,index)=>index+1)
                },
                yAxis: {
                    show: false,
                },
                series: [
                    {
                        // data:new Array(30).fill(0),
                        data:[],
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            color: "rgb(49,81,227)",
                            shadowColor: 'rgba(49,81,227, 0.5)', // 设置阴影颜色为黑色半透明  
                            shadowBlur: 5 // 设置阴影模糊级别
                        },
                        itemStyle: {
                            color: 'rgb(49,81,227)', // 设置断点颜色
                        }
                    }
                ]
            }
            this.inEchart.setOption(inOption)



            !this.saleEchart && (this.saleEchart = echarts.init(document.getElementById("sale")))
            const saleOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgb(255,108,27)',
                    textStyle: {
                        color: 'white',
                    },
                    axisPointer: {
                        type: 'none' // 设置辅助线类型为无，即不显示辅助线  
                    },
                    formatter: function (params) {
                        return `续课课时占比${course_count_sell_percent || 0}%`
                    }
                },


                xAxis: {
                    type: 'value',
                    show: false,
                },
                yAxis: {
                    type: 'category',
                    data: ['售课'],
                    show: false,
                },
                series: [
                    {
                        barWidth: 25, // 自定义柱状条形图的宽度 
                        barMaxWidth: 25, // 自定义柱状条形图的最大宽
                        name: '续费课时',
                        type: 'bar',
                        stack: 'total',
                        left: "15%",
                        label: {
                            show: false
                        },
                        data: [course_count_sell_renewal || 0],

                        itemStyle: {
                            color: "rgb(255,108,27)"
                        }
                    },
                    {
                        name: '新售课时',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: false
                        },
                        data: [course_count_sell_buy || 0],
                        itemStyle: {
                            normal: {  // 设置没有hover时的颜色  
                                color: "rgb(242,243,248)"
                            },
                            emphasis: {  // 设置hover时的颜色和效果等  
                                color: "rgb(246,247,252)"  // hover时的颜色，这里可以设置为你想要的颜色  
                            }
                        },
                    },
                ]
            }
            this.saleEchart.setOption(saleOption)

            !this.cutEchart && (this.cutEchart = echarts.init(document.getElementById("map_cut")))
            const cutOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgb(255,108,27)',
                    textStyle: {
                        color: 'white',
                    },
                    axisPointer: {
                        type: 'none' // 设置辅助线类型为无，即不显示辅助线  
                    },
                    formatter: '{b}：{c}次'
                },
                xAxis: {
                    show: false,
                    data: expenseList.map(item => { return this.$app.currentTime(new Date(item.date), "MM-dd") })
                    // data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
                },
                yAxis: {
                    show: false,
                },
                series: [
                    {
                        // data: [820, 100000, 901, 10005, 1290, 1330, 1320, 820, 100000, 901, 10005, 1290, 1330, 1320, 820, 820, 100000, 901, 10005, 1290, 1330, 1320, 820, 100000, 901, 10005, 1290, 1330, 1320, 820],
                        data: expenseList.map(item => item.count),
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            color: "rgb(255,108,27)",
                            shadowColor: 'rgba(255,108,27, 0.5)', // 设置阴影颜色为黑色半透明  
                            shadowBlur: 5 // 设置阴影模糊级别
                        },
                        itemStyle: {
                            color: 'rgb(255,108,27)', // 设置断点颜色
                        }
                    }
                ]
            }
            this.cutEchart.setOption(cutOption)

            !this.addEchart && (this.addEchart = echarts.init(document.getElementById("map_add")))
            const addOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgb(49,81,227)',
                    textStyle: {
                        color: 'white',
                    },
                    axisPointer: {
                        type: 'none' // 设置辅助线类型为无，即不显示辅助线  
                    },
                    formatter: '{b}：{c}人'
                },
                xAxis: {
                    show: false,
                    data: memberList.map(item => { return this.$app.currentTime(new Date(item.date), "MM-dd") })
                    // data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
                },
                yAxis: {
                    show: false,
                },
                series: [
                    {
                        // data: [820, 100000, 901, 10005, 1290, 1330, 1320, 820, 100000, 901, 10005, 1290, 1330, 1320, 820, 820, 100000, 901, 10005, 1290, 1330, 1320, 820, 100000, 901, 10005, 1290, 1330, 1320, 820],
                        data: memberList.map(item => item.count),
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            color: "rgb(49,81,227)",
                            shadowColor: 'rgba(49,81,227, 0.5)', // 设置阴影颜色为黑色半透明  
                            shadowBlur: 5 // 设置阴影模糊级别
                        },
                        itemStyle: {
                            color: 'rgb(49,81,227)', // 设置断点颜色
                        },

                    }
                ]
            }
            this.addEchart.setOption(addOption)
        },

        //#region  事件
        handleFn(item) {
            !this.$app.isNull(item.url) && this.$router.push(item.url)
        },

        sourceChangeTimeHandle(e) {
            const [start, end, txt] = e || []
            this.memberReportEntity.start_date = start ? this.$app.currentTime(start, 'yyyy-MM-dd HH:mm:ss') : "";
            this.memberReportEntity.end_date = end ? this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss') : "";
            let sourceDayTxt = '本月'
            if (start && end) {
                // sourceDayTxt = txt
                // txt === '最近一周' && (sourceDayTxt = '7天')
                // txt === '最近一个月' && (sourceDayTxt = '30天')
                // txt === '最近三个月' && (sourceDayTxt = '90天')
                // !txt && (sourceDayTxt = `${Math.round((end.getTime() - start.getTime()) / 86400000)}天`)
                sourceDayTxt = `${Math.round((end.getTime() - start.getTime()) / 86400000)}天`
            }
            this.sourceDayTxt = sourceDayTxt
            this.GetMemberAnalyseSource()
            this.GetMemberAnalyse()
        },
        classChangeTimeHandle(e) {
            const [start, end, txt] = e || []
            this.classReportEntity.start_date = start ? this.$app.currentTime(start, 'yyyy-MM-dd HH:mm:ss') : "";
            this.classReportEntity.end_date = end ? this.$app.currentTime(end, 'yyyy-MM-dd HH:mm:ss') : "";
            let classDayTxt = '本月'
            if (start && end) {
                // classDayTxt = txt
                // txt === '最近一周' && (classDayTxt = '7天')
                // txt === '最近一个月' && (classDayTxt = '30天')
                // txt === '最近三个月' && (classDayTxt = '90天')
                // !txt && (classDayTxt = `${Math.round((end.getTime() - start.getTime()) / 86400000)}天`)
                classDayTxt = `${Math.round((end.getTime() - start.getTime()) / 86400000)}天`
            }
            this.classDayTxt = classDayTxt
            this.GetMemberClassAnalyse()
        },
        classChangeHandle(type) {
            if (type === 'member') {
                this.GetMemberAnalyseSource()
                this.GetMemberAnalyse()
            } else {
                this.GetMemberClassAnalyse()
            }
        }
        //#endregion

    }
}

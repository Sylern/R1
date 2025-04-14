import { mapState } from 'vuex'
import { stockApi } from '@/api/index'
export default {
    data() {
        return {
            storeList: [],                         //门店
            queryEntity: {                         // 查询实体
                u_id: "",                          // 门店id
                sv_start_date: '',                 // 开始时间
                sv_end_date: '',                   // 结束时间
                sv_type: -1,                       // 类型
                keywards: "",                      // 搜索关键字
                sort_type: 1,                      // top10类型
                pageIndex: 1,                      // 页码
                pageSize: 10,                      // 页数
            },
            total: 0,
            dataList: [],
            top10Info: [],                         //前10数据
            courseStructInfo: [],                  //课程结构数据
            membertotal: 0,
        }
    },
    computed: {
        ...mapState(['userInfo']),
        courseValue() {
            const { courseStructInfo } = this
            const one = courseStructInfo.find(item => item.name == '一对一') || {}
            const more = courseStructInfo.find(item => item.name == '一对多') || {}
            return [one.value || 0, more.value || 0]
        }
    },
    async mounted() {
        this.getstore_list()
        this.queryEntity.u_id = +this.userInfo.user_id
        this.queryEntity.sv_start_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.queryEntity.sv_end_date = this.$app.currentTime(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        await this.GetOrderProduct()
        this.draw()
        window.onresize = () => {
            this.top10Chart.resize()
            this.courseStructChart.resize()
        }
    },

    methods: {
        GetOrderProduct() {
            return stockApi.GetOrderProduct(this.queryEntity).then(res => {
                const { total, p_member_list = [], o_p_t_info: { one_for_one = 0, one_to_many = 0, membertotal } = {}, o_p_s_list = [] } = res
                this.total = total || 0
                this.dataList = o_p_s_list
                this.top10Info = p_member_list
                this.membertotal = membertotal || 0
                if (one_for_one > 0 || one_to_many > 0) {
                    this.courseStructInfo = [
                        { value: +one_for_one, name: "一对一", itemStyle: { color: '#506FEE' } },
                        { value: +one_to_many, name: "一对多", itemStyle: { color: '#e75235' } },
                        { value: (+one_for_one) + (one_to_many), name: '合计', itemStyle: { color: 'transparent' } }
                    ].filter(item => item.value > 0)
                } else {
                    this.courseStructInfo = []
                }
            })
        },
        drawTop10() {
            this.$nextTick(() => {
                const e = document.getElementById('left_map')
                e.removeAttribute('_echarts_instance_')
                !this.top10Chart && (this.top10Chart = echarts.init(e))
                //绘制top10
                const top10Info = (this.top10Info || []).sort((a, b) => a.value - b.value);
                const topOption = {
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.8)', // 将背景色设置为透明
                        textStyle: {
                            color: 'black',
                        },
                        extraCssText: 'box-shadow: 0 2px 12px 0 #999;',  // 添加阴影效果
                    },
                    yAxis: {
                        data: top10Info.map(item => item.name),
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
                            color: "black"
                        }
                    },
                    xAxis: {
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
                            color: "black"
                        }
                    },
                    series: [{
                        // name: '销量',
                        type: 'bar',
                        data: top10Info.map(item => +item.value),
                        itemStyle: {
                            color: '#506FEE',
                            barBorderWidth: 10,
                            emphasis: {
                                color: '#9cacf4'
                            }
                        },
                        barMaxWidth:40
                    }]
                };
                this.top10Chart.setOption(topOption, true);
            })
        },


        draw() {
            this.drawTop10()
            this.$nextTick(() => {
                const e = document.getElementById('right_map')
                e.removeAttribute('_echarts_instance_')
                !this.courseStructChart && (this.courseStructChart = echarts.init(e))
                // !this.courseStructChart && (this.courseStructChart = echarts.init(document.getElementById('right_map')))
                //绘制课程比例
                const courseStructOption = {
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(255,255,255,0.8)', // 将背景色设置为透明
                        textStyle: {
                            color: 'black',
                        },
                        extraCssText: 'box-shadow: 0 2px 12px 0 #999;',  // 添加阴影效果
                    },
                    series: [
                        {
                            name: '课程报读结构',
                            type: 'pie',
                            radius: ['40%', '93%'],
                            startAngle: 180, // 起始角度为180度，使得图表从下方开始绘制  
                            endAngle: 360, // 结束角度为360度，绘制一个完整的半圆

                            label: {
                                show: true,
                                formatter: (params) => {
                                    const courseStructInfo = this.courseStructInfo
                                    const total = courseStructInfo[courseStructInfo.length - 1]
                                    const index = courseStructInfo.findIndex(item => item.name === params.name)
                                    return params.name + "：" + Math.round(courseStructInfo[index].value / total.value * 100) + "%"
                                },
                                position: 'inside'
                            },
                            labelLine: {
                                show: false
                            },
                            data: this.courseStructInfo
                        },

                    ]
                }
                this.courseStructChart.setOption(courseStructOption, true);
            })
        },
        //#region   事件
        async storeChangeHandle() {
            this.queryEntity.pageIndex = 1
            await this.GetOrderProduct()
            this.draw()
        },
        async handleSearch() {
            this.queryEntity.pageIndex = 1
            await this.GetOrderProduct()
            this.draw()
        },
        async handleChangeTime(date) {
            this.queryEntity.sv_start_date = date ? this.$app.currentTime(date[0], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.sv_end_date = date ? this.$app.currentTime(date[1], 'yyyy-MM-dd HH:mm:ss') : "";
            this.queryEntity.pageIndex = 1
            await this.GetOrderProduct()
            this.draw()
        },
        async handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.pageIndex = index;
            if (type === 'size') this.queryEntity.pageIndex = 1, this.queryEntity.pageSize = index;
            await this.GetOrderProduct()
            this.draw()
        },
        handleDownload() {
            const { queryEntity } = this
            const params = { ...queryEntity }
            stockApi.GetOrderProductExport(params).then(res => {
                if (res) this.$app.downloadUrl(JSON.parse(res));
                if (!res) {
                    this.$message.success('报表生成成功');
                    this.$router.push('/downloadReport')
                }
            });
         },
        async top10ChangeHandle() {
            await this.GetOrderProduct()
            this.drawTop10()
        },
        //#endregion
        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(item => { return { label: item.sv_us_name, value: +item.user_id, uset_type: item.user_tye } });
            });
        },
        //#endregion
    }


}
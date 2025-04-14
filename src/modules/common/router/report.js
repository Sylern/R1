const report = [
    //#region 智能报表
    // {
    //     path: "/",                                      // 门店概况 H5 页面
    //     component: () => import( /* webpackChunkName: "reportRouter" */ "./views/h5/index.vue"),
    //     children: [
    //         {
    //             path: "/",
    //             meta: {
    //                 name: '门店概况',
    //                 isH5: true,
    //                 keepAlive: false                      // 判断是否缓存
    //             },
    //             component: () => import( /* webpackChunkName: "reportRouter" */ "./views/h5/login/login.vue")
    //         },
    //         {
    //             path: "/home",
    //             meta: {
    //                 name: '门店概况',
    //                 isH5: true,
    //                 keepAlive: false
    //             },
    //             component: () => import( /* webpackChunkName: "reportRouter" */ "./views/h5/home/home.vue")
    //         },
    //     ]
    // },

    {
        path: '/reportCensus',
        component: () => import( /* webpackChunkName: "vipRouter" */ "@/modules/common/views/report/page/reportCensus/index/index.vue"),
        meta: {
            menuMatch: 'report',
            name: '智能分析'
        },
        children: [
            {
                path: "/cateringReturnRecord",
                meta: { name: '异常退菜报表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/cateringReturnRecord/cateringReturnRecord.vue")
            },
            {
                path: "/commodityAch",
                meta: { name: '商品业绩明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/commodityAch/commodityAch.vue")
            },
            {
                path: "/commodityPer",
                meta: { name: '商品提成明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/commodityPer/commodityPer.vue")
            },
            {
                path: "/projectAch",
                meta: { name: '项目业绩明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/projectAch/projectAch.vue")
            },
            {
                path: "/projectPer",
                meta: { name: '项目提成明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/projectPer/projectPer.vue")
            },
            {
                path: "/sellingCardsAch",
                meta: { name: '售卡业绩明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/sellingCardsAch/sellingCardsAch.vue")
            },
            {
                path: "/sellingCardsPer",
                meta: { name: '售卡提成明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/sellingCardsPer/sellingCardsPer.vue")
            },
            {
                path: "/staffAch",
                meta: { name: '员工业绩汇总', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/staffAch/staffAch.vue")
            },
            {
                path: "/monthlyAch",
                meta: { name: '月提成报表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/monthlyAch/monthlyAch.vue")
            },
            {
                path: "/downloadReport",
                meta: { name: '报表下载列表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/downloadReport/downloadReport.vue")
            },
            {
                path: "/storeGrossProfitSummary",
                meta: { name: '毛利汇总', authorityCode: 'Sales_Profit_Summary' },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/storeGrossProfitSummary/storeGrossProfitSummary.vue")
            },
            {
                path: "/tableReport",
                meta: { name: '餐台报表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/tableReport/tableReport.vue")
            },
            {
                path: "/BiProcurement",
                meta: { name: '采购汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/BiReport/procurement/procurement.vue")
            },
            {
                path: "/BiSale",
                meta: { name: '销售汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/BiReport/sale/sale.vue")
            },
            {
                path: "/BiInventory",
                meta: { name: '库存查询BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/BiReport/inventory/inventory.vue")
            },
            {
                path: "/BiAllot",
                meta: { name: '直调汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/BiReport/allot/allot.vue")
            },
            {
                path: "/rfmReport",
                // meta: { name: '会员RFM分析', isDebug: false },
                meta: { name: '会员RFM分析' },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/memberManage/rfmReport/rfmReport.vue")
            },
            {
                path: "/apply",
                meta: { name: '报名订单', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/apply/apply.vue")
            },
            {
                path: "/detail",
                meta: { name: '订单明细', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/detail/detail.vue")
            },
            {
                path: "/expense",
                meta: { name: '消课记录', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/expense/expense.vue")
            },
            {
                path: "/summary",
                meta: { name: '课程汇总', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/summary/summary.vue")
            },
            {
                path: "/callRoll",
                meta: { name: '点名记录', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/callRoll/callRoll.vue")
            },
            {
                path: "/course",
                meta: { name: '学员课程', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/education/course/course.vue")
            },

            {
                path: "/jianshengApply",
                meta: { name: '报名订单', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/apply/apply.vue")
            },
            {
                path: "/jianshengDetail",
                meta: { name: '订单明细', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/detail/detail.vue")
            },
            {
                path: "/jianshengExpense",
                meta: { name: '消课记录', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/expense/expense.vue")
            },
            {
                path: "/jianshengSummary",
                meta: { name: '课程汇总', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/summary/summary.vue")
            },
            {
                path: "/jianshengCallRoll",
                meta: { name: '点名记录', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/callRoll/callRoll.vue")
            },
            {
                path: "/jianshengCourse",
                meta: { name: '学员课程', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/course/course.vue")
            },
            {
                path: "/courseReservation",
                meta: { name: '预约列表', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/courseReservation/courseReservation.vue")
            },
            {
                path: "/entryCard",
                meta: { name: '已售入场卡', isDebug: false, },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/entryCard/entryCard.vue")
            },
            {
                path: "/entryCardDetail",
                meta: { name: "已售入场卡详情", isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/entryCardDetail/entryCardDetail.vue")
            },
            {
                path: "/courseCard",
                meta: { name: '已售课程卡', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/courseCard/courseCard.vue")
            },
            {
                path: "/personCourseCard",
                meta: { name: '已售私教课', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/personCourseCard/personCourseCard.vue")
            },
            {
                path: "/biManage",
                meta: { name: '入场管理明细', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/biManage/biManage.vue")
            },
            {
                path: "/biCount",
                meta: { name: '会员入场统计', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/jiansheng/biCount/biCount.vue")
            },
            {
                path: "/preMoneyReport",
                meta: { name: '餐台报表', isDebug: false },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/reportCensus/page/preMoneyReport/preMoneyReport.vue")
            }
        ]
    },
    //#endregion 

    //#region 日常报表
    {
        path: '/dailStatement',                         // 日常报表
        component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/report/page/dailyStatement/dailyStatement.vue"),
        meta: {
            menuMatch: 'report',
            name: '每日对账单'
        }
    }
    //#endregion
];
export default report;
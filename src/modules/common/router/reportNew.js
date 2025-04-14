const reportNew = [
    //#region report
    {
        path: '/report',
        name: 'report',
        meta: {
            menuMatch: 'reportNew',
        },
        component: () => import( /* webpackChunkName: "testRouter" */ '@/modules/common/views/reportNew/home.vue'),
        children: [
            {
                path: "reportCensus",
                name: "reportCensus",
                meta: {
                    isDebug: true,
                    pageName: '智能分析',
                },
                component: () => import( /* webpackChunkName: "testRouter" */ '@/modules/common/views/reportNew/reportCensus/reportCensus.vue')
            },
            {
                path: "testList",
                name: "testList",
                meta: {
                    isDebug: true,
                    pageName: '列表',
                },
                component: () => import( /* webpackChunkName: "testRouter" */ '@/modules/common/views/reportNew/page/list/list.vue')
            },
            {
                path: "testList1",
                name: "testList1",
                meta: {
                    isDebug: true,
                    pageName: '列表1',
                },
                component: () => import( /* webpackChunkName: "testRouter" */ '@/modules/common/views/reportNew/page/list1/list1.vue')
            },
            // #region 日常报表
            {
                path: "storeReconciliation",
                name: "storeReconciliation",
                meta: { isDebug: true, pageName: '营业日报', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/storeReconciliation/storeReconciliation.vue")
            },
            {
                path: "handoverRecord",
                name: "handoverRecord",
                meta: { isDebug: true, pageName: '交接班记录', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/handoverRecord/handoverRecord.vue")
            },
            {
                path: "storeOverview",
                name: "storeOverview",
                meta: { isDebug: true, pageName: '门店概况', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/storeOverview/storeOverview.vue")
            },
            {
                path: "businessStatement",
                name: "businessStatement",
                meta: { isDebug: true, pageName: '营业报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/businessStatement/businessStatement.vue")
            },
            {
                path: "cashierAchievement",
                name: "cashierAchievement",
                meta: { isDebug: true, pageName: '收银员业绩统计', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/cashierAchievement/cashierAchievement.vue")
            },
            {
                path: "storeSales",
                name: "storeSales",
                meta: { isDebug: true, pageName: '门店销售统计', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/storeSales/storeSales.vue")
            },
            {
                path: "ledgerAccount",
                name: "ledgerAccount",
                meta: { isDebug: true, pageName: '分账明细表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/ledgerAccount/ledgerAccount.vue")
            },
            {
                path: "managementLedgerAccount",
                name: "managementLedgerAccount",
                meta: { isDebug: true, pageName: '分账汇总表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/managementLedgerAccount/managementLedgerAccount.vue")
            },
            {
                path: "collectionDetails",
                name: "collectionDetails",
                meta: { isDebug: true, pageName: '支付收款明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/dailyReport/collectionDetails/collectionDetails.vue")
            },
            {
                path: "preMoneyReport",
                name: "preMoneyReport",
                meta: { isDebug: true, pageName: '预付金记录表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/dailyReport/preMoneyReport/preMoneyReport.vue")
            },
            // #endregion
            // #region 销售报表
            {
                path: "salesFlow",
                name: "salesFlow",
                meta: { isDebug: true, pageName: '销售流水报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/salesFlow/salesFlow.vue")
            },
            {
                path: "returnReport",
                name: "returnReport",
                meta: { isDebug: true, pageName: '退货报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/returnReport/returnReport.vue")
            },
            {
                path: "antiCheckout",
                name: "antiCheckout",
                meta: { isDebug: true, pageName: '反结账', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/antiCheckout/antiCheckout.vue")
            },
            {
                path: "itemPresentationReport",
                name: "itemPresentationReport",
                meta: { isDebug: true, pageName: '品项赠送报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/itemPresentationReport/itemPresentationReport.vue")
            },
            {
                path: "itemDiscountReport",
                name: "itemDiscountReport",
                meta: { isDebug: true, pageName: '品项折扣报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/itemDiscountReport/itemDiscountReport.vue")
            },
            {
                path: "commoditySalesAnalysis",
                name: "commoditySalesAnalysis",
                meta: { isDebug: true, pageName: '销售毛利分析', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/commoditySalesAnalysis/commoditySalesAnalysis.vue")
            },
            {
                path: "commoditySalesStatistics",
                name: "commoditySalesStatistics",
                meta: { isDebug: true, pageName: '商品销售统计', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/commoditySalesStatistics/commoditySalesStatistics.vue")
            },
            {
                path: "orderStageAnalysis",
                name: "orderStageAnalysis",
                meta: { isDebug: true, pageName: '价格段分析', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/orderStageAnalysis/orderStageAnalysis.vue")
            },
            {
                path: "depositDetailReport",
                name: "depositDetailReport",
                meta: { isDebug: true, pageName: '寄存明细报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/depositDetailReport/depositDetailReport.vue")
            },
            {
                path: "consignmentSummaryReport",
                name: "consignmentSummaryReport",
                meta: { isDebug: true, pageName: '寄存汇总报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/consignmentSummaryReport/consignmentSummaryReport.vue")
            },
            {
                path: "storeGrossProfitSummary",
                name: "storeGrossProfitSummary",
                meta: { isDebug: true, pageName: '毛利汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/storeGrossProfitSummary/storeGrossProfitSummary.vue")
            },
            {
                path: "tableReport",
                name: "tableReport",
                meta: { isDebug: true, pageName: '餐台报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/salesReport/tableReport/tableReport.vue")
            },
            // #endregion
            // #region 会员报表
            {
                path: "rechargeReport",
                name: "rechargeReport",
                meta: { isDebug: true, pageName: '充值明细报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/rechargeReport/rechargeReport.vue")
            },
            {
                path: "depositReport",
                name: "depositReport",
                meta: { isDebug: true, pageName: '押金报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/depositReport/depositReport.vue")
            },
            {
                path: "storedRefund",
                name: "storedRefund",
                meta: { isDebug: true, pageName: '会员卡退款明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/storedRefund/storedRefund.vue")
            },
            {
                path: "storedDaily",
                name: "storedDaily",
                meta: { isDebug: true, pageName: '会员储值日报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/storedDaily/storedDaily.vue")
            },
            {
                path: "storedSummary",
                name: "storedSummary",
                meta: { isDebug: true, pageName: '门店储值汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/storedSummary/storedSummary.vue")
            },
            {
                path: "memberCardSummary",
                name: "memberCardSummary",
                meta: { isDebug: true, pageName: '门店会员卡汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/memberCardSummary/memberCardSummary.vue")
            },
            {
                path: "memberAnalysis",
                name: "memberAnalysis",
                meta: { isDebug: true, pageName: '会员分析', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/memberAnalysis/memberAnalysis.vue")
            },
            {
                path: "memberCrossStoreDetails",
                name: "memberCrossStoreDetails",
                meta: { isDebug: true, pageName: '会员跨店明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/memberCrossStoreDetails/memberCrossStoreDetails.vue")
            },
            {
                path: "memberCrossStoreDetailsTable",
                name: "memberCrossStoreDetailsTable",
                meta: { isDebug: true, pageName: '会员跨店汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/memberCrossStoreDetailsTable/memberCrossStoreDetailsTable.vue")
            },
            {
                path: "arrearsManagement",
                name: "arrearsManagement",
                meta: { isDebug: true, pageName: '欠款管理', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/arrearsManagement/arrearsManagement.vue")
            },
            {
                path: "repaymentReport",
                name: "repaymentReport",
                meta: { isDebug: true, pageName: '还款流水报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/repaymentReport/repaymentReport.vue")
            },
            {
                path: "pointsDetails",
                name: "pointsDetails",
                meta: { isDebug: true, pageName: '积分明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/pointsDetails/pointsDetails.vue")
            },
            {
                path: "balanceChangeReport",
                name: "balanceChangeReport",
                meta: { isDebug: true, pageName: '会员余额变动', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/balanceChangeReport/balanceChangeReport.vue")
            },
            {
                path: "rfmReport",
                name: "rfmReport",
                meta: { isDebug: true, pageName: '会员RFM分析', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/memberReport/rfmReport/rfmReport.vue")
            },
            // #endregion
            // #region 次卡报表
            {
                path: "consumption",
                name: "consumption",
                meta: { isDebug: true, pageName: '次卡消费流水', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/secondaryCardReport/consumption/consumption.vue")
            },
            {
                path: "summaryTableOfRemainingTimes",
                name: "summaryTableOfRemainingTimes",
                meta: { isDebug: true, pageName: '剩余次数汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/secondaryCardReport/summaryTableOfRemainingTimes/summaryTableOfRemainingTimes.vue")
            },
            {
                path: "cardSalesSchedule",
                name: "cardSalesSchedule",
                meta: { isDebug: true, pageName: '售卡明细表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/secondaryCardReport/cardSalesSchedule/cardSalesSchedule.vue")
            },
            {
                path: "cardSalesSummary",
                name: "cardSalesSummary",
                meta: { isDebug: true, pageName: '售卡汇总表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/secondaryCardReport/cardSalesSummary/cardSalesSummary.vue")
            },
            // #endregion
            // #region 库存报表
            {
                path: "accessInventoryDetails",
                name: "accessInventoryDetails",
                meta: { isDebug: true, pageName: '出入库明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/accessInventoryDetails/accessInventoryDetails.vue")
            },
            {
                path: "inboundAndOutboundSummary",
                name: "inboundAndOutboundSummary",
                meta: { isDebug: true, pageName: '出入库汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/inboundAndOutboundSummary/inboundAndOutboundSummary.vue")
            },
            {
                path: "invoicingReport",
                name: "invoicingReport",
                meta: { isDebug: true, pageName: '进销存报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/invoicingReport/invoicingReport.vue")
            },
            {
                path: "inventoryList",
                name: "inventoryList",
                meta: { isDebug: true, pageName: '盘点明细表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/inventoryList/inventoryList.vue")
            },
            {
                path: "inventoryDifferenceTable",
                name: "inventoryDifferenceTable",
                meta: { isDebug: true, pageName: '盘点差异表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/inventoryDifferenceTable/inventoryDifferenceTable.vue")
            },
            {
                path: "purchaseAmount",
                name: "purchaseAmount",
                meta: { isDebug: true, pageName: '进货额排行', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/purchaseAmount/purchaseAmount.vue")
            },
            {
                path: "commodityPurchasingStatistics",
                name: "commodityPurchasingStatistics",
                meta: { isDebug: true, pageName: '商品采购统计', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/commodityPurchasingStatistics/commodityPurchasingStatistics.vue")
            },
            {
                path: "commodityPurchaseRanking",
                name: "commodityPurchaseRanking",
                meta: { isDebug: true, pageName: '商品进货排行', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/commodityPurchaseRanking/commodityPurchaseRanking.vue")
            },
            {
                path: "supplierPurchaseRanking",
                name: "supplierPurchaseRanking",
                meta: { isDebug: true, pageName: '供应商进货', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/inventoryReport/supplierPurchaseRanking/supplierPurchaseRanking.vue")
            },
            // #endregion
            // #region 营销报表
            {
                path: "referrerReport",
                name: "referrerReport",
                meta: { isDebug: true, pageName: '推荐人报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/marketingReport/referrerReport/referrerReport.vue")
            },
            {
                path: "invitationDetails",
                name: "invitationDetails",
                meta: { isDebug: true, pageName: '邀请有礼明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/marketingReport/invitationDetails/invitationDetails.vue")
            },
            {
                path: "invitationCourtesySummary",
                name: "invitationCourtesySummary",
                meta: { isDebug: true, pageName: '邀请有礼汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/marketingReport/invitationCourtesySummary/invitationCourtesySummary.vue")
            },
            // #endregion
            // #region 员工提成
            {
                path: "commodityAch",
                name: "commodityAch",
                meta: { isDebug: true, pageName: '商品业绩明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/commodityAch/commodityAch.vue")
            },
            {
                path: "commodityPer",
                name: "commodityPer",
                meta: { isDebug: true, pageName: '商品提成明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/commodityPer/commodityPer.vue")
            },
            {
                path: "projectAch",
                name: "projectAch",
                meta: { isDebug: true, pageName: '项目业绩明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/projectAch/projectAch.vue")
            },
            {
                path: "projectPer",
                name: "projectPer",
                meta: { isDebug: true, pageName: '项目提成明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/projectPer/projectPer.vue")
            },
            {
                path: "sellingCardsAch",
                name: "sellingCardsAch",
                meta: { isDebug: true, pageName: '售卡业绩明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/sellingCardsAch/sellingCardsAch.vue")
            },
            {
                path: "sellingCardsPer",
                name: "sellingCardsPer",
                meta: { isDebug: true, pageName: '售卡提成明细', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/sellingCardsPer/sellingCardsPer.vue")
            },
            {
                path: "staffAch",
                name: "staffAch",
                meta: { isDebug: true, pageName: '员工业绩汇总', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/staffAch/staffAch.vue")
            },
            {
                path: "monthlyAch",
                name: "monthlyAch",
                meta: { isDebug: true, pageName: '月提成报表', },
                component: () => import( /* webpackChunkName: "testRouter" */ "@/modules/common/views/reportNew/staffCommission/monthlyAch/monthlyAch.vue")
            },
            // #endregion 员工提成
            // #region BI报表
            {
                path: "BiProcurement",
                name: "BiProcurement",
                meta: { isDebug: true, pageName: '采购汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/BiReport/procurement/procurement.vue")
            },
            {
                path: "BiSale",
                name: "BiSale",
                meta: { isDebug: true, pageName: '销售汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/BiReport/sale/sale.vue")
            },
            {
                path: "BiInventory",
                name: "BiInventory",
                meta: { isDebug: true, pageName: '库存查询BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/BiReport/inventory/inventory.vue")
            },
            {
                path: "BiAllot",
                name: "BiAllot",
                meta: { isDebug: true, pageName: '直调汇总BI', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/BiReport/allot/allot.vue")
            },
            // #endregion BI报表
            // #region 教务报表
            {
                path: "apply",
                name: "apply",
                meta: { isDebug: true, pageName: '报名订单', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/apply/apply.vue")
            },
            {
                path: "detail",
                name: "detail",
                meta: { isDebug: true, pageName: '订单明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/detail/detail.vue")
            },
            {
                path: "expense",
                name: "expense",
                meta: { isDebug: true, pageName: '消课记录', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/expense/expense.vue")
            },
            {
                path: "summary",
                name: "summary",
                meta: { isDebug: true, pageName: '课程汇总', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/summary/summary.vue")
            },
            {
                path: "callRoll",
                name: "callRoll",
                meta: { isDebug: true, pageName: '点名记录', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/callRoll/callRoll.vue")
            },
            {
                path: "course",
                name: "course",
                meta: { isDebug: true, pageName: '学员课程', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/educationReport/course/course.vue")
            },
            // #endregion 教务报表
            // #region 订单报表
            {
                path: "orderReportDetail",
                name: "orderReportDetail",
                meta: { isDebug: true, pageName: '签单流水', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/detail/detail.vue")
            },
            {
                path: "orderReportApply",
                name: "orderReportApply",
                meta: { isDebug: true, pageName: '课程报表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/apply/apply.vue")
            },
            {
                path: "orderReportExpense",
                name: "orderReportExpense",
                meta: { isDebug: true, pageName: '上课报表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/expense/expense.vue")
            },
            {
                path: "orderReportSummary",
                name: "orderReportSummary",
                meta: { isDebug: true, pageName: '课程汇总', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/summary/summary.vue")
            },
            {
                path: "orderReportCallRoll",
                name: "orderReportCallRoll",
                meta: { isDebug: true, pageName: '签到记录', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/callRoll/callRoll.vue")
            },
            {
                path: "orderReportCourse",
                name: "orderReportCourse",
                meta: { isDebug: true, pageName: '会员课程', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/course/course.vue")
            },
            {
                path: "courseReservation",
                name: "courseReservation",
                meta: { isDebug: true, pageName: '预约列表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/orderReport/courseReservation/courseReservation.vue")
            },
            // #endregion 订单报表
            // #region 已售报表
            {
                path: "entryCard",
                name: "entryCard",
                meta: { isDebug: true, pageName: '已售入场卡', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/entryCard/entryCard.vue")
            },
            {
                path: "entryCardDetail",
                name: "entryCardDetail",
                meta: { isDebug: true, pageName: "已售入场卡详情", },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/entryCardDetail/entryCardDetail.vue")
            },
            {
                path: "courseCard",
                name: "courseCard",
                meta: { isDebug: true, pageName: '已售课程卡', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/courseCard/courseCard.vue")
            },
            {
                path: "personCourseCard",
                name: "personCourseCard",
                meta: { isDebug: true, pageName: '已售私教课', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/personCourseCard/personCourseCard.vue")
            },
            {
                path: "biManage",
                name: "biManage",
                meta: { isDebug: true, pageName: '入场管理明细', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/biManage/biManage.vue")
            },
            {
                path: "biCount",
                name: "biCount",
                meta: { isDebug: true, pageName: '会员入场统计', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/saledReport/biCount/biCount.vue")
            },
            // #endregion 已售报表
            {
                path: "downloadReport",
                meta: { isDebug: true, pageName: '报表下载列表', },
                component: () => import( /* webpackChunkName: "reportRouter" */ "@/modules/common/views/reportNew/downloadReport/downloadReport.vue")
            },
        ]
    },
]
export default reportNew;
import base from '@/api/base';
import { mapState } from 'vuex';
import { helpCenter } from '@/components/index';
export default {
    components: { helpCenter },
    data() {
        return {
            selectedFirst: '',              // 当前选中的一级菜单
            selectedSecond: '',             // 当前选中的二级菜单   
            mainMenuSelectedCode: '',       // 
            list: [],                       // 目录数据
            html: '',                       // html数据源
            isHtml: true,
            openIndex: '0',
            openeds: [],
            pageName: '智能分析',           // 一级目录名称
            helpCenterListId: 74,           // 帮助中心列表id
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isCatering() {                            // 是否是餐饮行业
            return this.userInfo.sv_us_industrytype === 27;
        },
        checkedItem() {
            if (this.$app.isNull(this.selectedFirst) || this.$app.isNull(this.selectedSecond)) return '';
            let first = this.list.find(item => item.sv_func_id === this.selectedFirst);
            return first.isOnly ? first : first.children.find(item => item.sv_func_code === this.selectedSecond);
        },
    },
    watch: {
        $route: {
            deep: true, immediate: true,
            handler(val, oldval) {
                let Jurisdiction = this.$store.state.JurisdictionObj;
                this.IsAuthority = this.$app.isNull(val.meta.authorityCode) ? true : Jurisdiction[val.meta.authorityCode] ? true : false;
                // if (val.path === '/purchasePackage/purchase' && !Jurisdiction.PurchaseManage) this.IsAuthority = false;
                // if (val.path === '/purchasePackage/returnGoods' && !Jurisdiction.ReturnGoods) this.IsAuthority = false;
                // if (val.path === '/allocationManagement/goodsAllocation' && !Jurisdiction.StockAllocationList) this.IsAuthority = false;
                // if (val.path === '/cargoFlow/demandList' && !Jurisdiction.RequireList) this.IsAuthority = false;
                // if (val.path === '/cargoFlow/directOrder' && !Jurisdiction.DirectList) this.IsAuthority = false;
                // if (val.path === '/cargoFlow/differenceOrder' && !Jurisdiction.Discrepancy_List) this.IsAuthority = false;
                // !this.IsAuthority ? this.$message({ message: '无权限查看' }) : '';
                if (!this.IsAuthority) {
                    // this.$router.push(oldval);
                    this.$message({ message: '无权限查看' });
                }
            }
        }
    },
    mounted() {
        this.handleToDownload();
    },
    methods: {
        handleToDownload() {                                // 权限菜单
            const hasDeposit = this.userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' && this.$app.getCheckMenu('storeCardList')
            let json = [
                {
                    sv_func_id: '1', sv_func_name: '日常报表', children: [
                        // { sv_func_parentid: '1', sv_func_id: '1-1', sv_func_code: '1-1', sv_func_name: '每日对账单', sv_remark: '查看门店每日收银数据', href: '/vueview/rustructure/dailyReport.html?activeName=dailyStatement', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Daily_Statement.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-1', sv_func_code: '1-1', sv_func_name: '营业日报', sv_remark: '查看门店收银数据', isVue: true, href: '/cashier/storeReconciliation', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Daily_Statement.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-2', sv_func_code: '1-2', sv_func_name: '交接班记录', sv_remark: '查看员工交接班记录', href: '/vueview/rustructure/dailyReport.html?activeName=handoverRecord', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Change_Shifts_Record.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-3', sv_func_code: '1-3', sv_func_name: '门店概况', sv_remark: '查看门店收银及商品概况', href: '/vueview/rustructure/dailyReport.html?activeName=storeOverview', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Overview_Stores.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-4', sv_func_code: '1-4', sv_func_name: '营业报表', sv_remark: '查看门店具体营收情况', href: '/vueview/rustructure/dailyReport.html?activeName=businessStatement', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Operating_Statement.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-5', sv_func_code: '1-5', sv_func_name: '收银员业绩统计', sv_remark: '查看门店收银员业绩统计情况', href: '/vueview/rustructure/dailyReport.html?activeName=cashierAchievement', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/cashierAchievement.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-6', sv_func_code: '1-6', sv_func_name: '支付收款明细', sv_remark: '查看门店支付收款明细', href: '/vueview/rustructure/dailyReport.html?activeName=collectionDetails', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/collectionDetails.png' },
                        { sv_func_parentid: '1', sv_func_id: '1-7', sv_func_code: '1-7', sv_func_name: '预付金记录表', isVue: true, sv_remark: '查看预付金收款明细', href: '/preMoneyReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/collectionDetails.png' }
                    ]
                },
                {
                    sv_func_id: '2', sv_func_name: '销售报表', children: [
                        { sv_func_parentid: '2', sv_func_id: '2-1', sv_func_code: '2-1', sv_func_name: '销售流水表', sv_remark: '查看商品销售流水明细', href: '/vueview/rustructure/salesReport.html?activeName=salesFlow', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Sales_Flow_info.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-2', sv_func_code: '2-2', sv_func_name: '退货报表', sv_remark: '查看商品退货明细', href: '/vueview/rustructure/salesReport.html?activeName=returnReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Sales_Return.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-3', sv_func_code: '2-3', sv_func_name: '销售毛利分析', sv_remark: '查看销售的商品情况', href: '/vueview/rustructure/salesReport.html?activeName=commoditySalesAnalysis', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Product_Sales_Analysis.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-4', sv_func_code: '2-4', sv_func_name: '商品类别分析', sv_remark: '查看销售的商品类别情况', href: '/vueview/rustructure/salesReport.html?activeName=commodityCategoryAnalysis', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Product_Category_Analysis.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-5', sv_func_code: '2-5', sv_func_name: '价格段分析', sv_remark: '查看门店订单价格段分析', href: '/vueview/rustructure/salesReport.html?activeName=orderStageAnalysis', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/orderStageAnalysis.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-6', sv_func_code: '2-6', sv_func_name: '商品销售统计', sv_remark: '商品销量、毛利占比统计', href: '/vueview/rustructure/salesReport.html?activeName=commoditySalesStatistics', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/commoditySalesStatistics.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-7', sv_func_code: '2-7', sv_func_name: '寄存明细报表', sv_remark: '查看会员寄存商品明细', href: '/vueview/rustructure/salesReport.html?activeName=depositDetailReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Deposit_Details.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-8', sv_func_code: '2-8', sv_func_name: '寄存汇总报表', sv_remark: '查看会员寄存商品汇总', href: '/vueview/rustructure/salesReport.html?activeName=consignmentSummaryReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Deposit_Summary.png' },
                        { sv_func_parentid: '2', sv_func_id: '2-9', sv_func_code: '2-9', sv_func_name: '毛利汇总', sv_remark: '', href: '/storeGrossProfitSummary', sv_func_icon_n3: base.frontImgBase + '/images/report/SGPS.png', isVue: true },
                        { sv_func_parentid: '2', sv_func_id: '2-10', sv_func_code: '2-10', sv_func_name: '餐台报表', sv_remark: '查看餐台报表情况', href: '/tableReport', sv_func_icon_n3: base.frontImgBase + '/images/report/tableReport.png', isVue: true },
                    ]
                },
                {
                    sv_func_id: '3', sv_func_name: '会员报表', children: [
                        { sv_func_parentid: '3', sv_func_id: '3-1', sv_func_code: '3-1', sv_func_name: '充值报表', sv_remark: '会员充值记录及撤销充值', href: '/vueview/rustructure/memberReport.html?activeName=rechargeReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Recharge_Info.png' },
                        hasDeposit && { sv_func_parentid: '3', sv_func_id: '3-15', sv_func_code: '3-15', sv_func_name: '押金报表', sv_remark: '会员储值卡押金记录', href: '/vueview/rustructure/memberReport.html?activeName=depositReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Deposit_Info.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-2', sv_func_code: '3-2', sv_func_name: '会员卡退款明细', sv_remark: '查看会员开卡充值退款明细 ', href: '/vueview/rustructure/memberReport.html?activeName=storedRefund', sv_func_icon_n3: base.frontImgBase + '/images/report/storedRefund.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-3', sv_func_code: '3-3', sv_func_name: '会员储值日报表', sv_remark: '查看会员储值明细', href: '/vueview/rustructure/memberReport.html?activeName=storedDaily', sv_func_icon_n3: base.frontImgBase + '/images/report/storedDaily.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-4', sv_func_code: '3-4', sv_func_name: '门店储值汇总', sv_remark: '查看门店储值汇总', href: '/vueview/rustructure/memberReport.html?activeName=storedSummary', sv_func_icon_n3: base.frontImgBase + '/images/report/storedSummary.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-5', sv_func_code: '3-5', sv_func_name: '门店会员卡汇总', sv_remark: ' 查看门店会员卡汇总', href: '/vueview/rustructure/memberReport.html?activeName=memberCardSummary', sv_func_icon_n3: base.frontImgBase + '/images/report/memberCardSummary.png' },
                        // { sv_func_parentid: '3', sv_func_id: '3-6', sv_func_code: '3-6', sv_func_name: '计次报表', sv_remark: '查看会员单品扣次明细', href: '/vueview/rustructure/memberReport.html?activeName=accountingReport', sv_func_icon_n3: base.frontImgBase + '/images/report/accountingReport.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-7', sv_func_code: '3-7', sv_func_name: '会员分析', sv_remark: '查看会员消费笔数、金额', href: '/vueview/rustructure/memberReport.html?activeName=memberAnalysis', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Membership_Analysis.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-8', sv_func_code: '3-8', sv_func_name: '会员跨店明细', sv_remark: '查看会员跨店消费储值明细', href: '/vueview/rustructure/memberReport.html?activeName=memberCrossStoreDetails', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Member_Across_Stores_Details.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-9', sv_func_code: '3-9', sv_func_name: '会员跨店汇总', sv_remark: '查看会员跨店消费储值汇总', href: '/vueview/rustructure/memberReport.html?activeName=memberCrossStoreDetailsTable', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Member_Across_Stores_Summary.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-10', sv_func_code: '3-10', sv_func_name: '欠款管理', sv_remark: '查看门店欠款会员及金额', href: '/vueview/rustructure/memberReport.html?activeName=arrearsManagement', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Arrears_Management.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-11', sv_func_code: '3-11', sv_func_name: '还款流水报表', sv_remark: '查看还款流水记录', href: '/vueview/rustructure/memberReport.html?activeName=repaymentReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/repaymentReport_Management.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-12', sv_func_code: '3-12', sv_func_name: '积分明细', sv_remark: '查看会员积分变动明细', href: '/vueview/rustructure/memberReport.html?activeName=pointsDetails', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Integral_Details.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-13', sv_func_code: '3-13', sv_func_name: '会员余额变动', sv_remark: '查看会员余额变动', href: '/vueview/rustructure/memberReport.html?activeName=balanceChangeReport', sv_func_icon_n3: base.frontImgBase + '/images/report/balanceChangeReport.png' },
                        { sv_func_parentid: '3', sv_func_id: '3-14', sv_func_code: '3-14', sv_func_name: 'RFM分析', sv_remark: '会员RFM分析', isVue: true, href: '/rfmReport', sv_func_icon_n3: base.frontImgBase + '/images/report/biProcurement.png' },
                    ]
                },
                {
                    sv_func_id: '6', sv_func_name: '次卡报表', children: [
                        { sv_func_parentid: '6', sv_func_id: '6-1', sv_func_code: '6-1', sv_func_name: '次卡消费流水', sv_remark: '查看会员次卡扣次明细', href: '/vueview/rustructure/secondaryCardReport.html?activeName=consumption', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Subcard_Sales_Info.png' },
                        { sv_func_parentid: '6', sv_func_id: '6-2', sv_func_code: '6-2', sv_func_name: '剩余次数汇总', sv_remark: '查看会员次卡项目剩余次数', href: '/vueview/rustructure/secondaryCardReport.html?activeName=summaryTableOfRemainingTimes', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Subcard_Residual_Statistics.png' },
                        { sv_func_parentid: '6', sv_func_id: '6-3', sv_func_code: '6-3', sv_func_name: '售卡明细表', sv_remark: '查看门店售卡具体情况', href: '/vueview/rustructure/secondaryCardReport.html?activeName=cardSalesSchedule', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Subcard_Sales_Details.png' },
                        { sv_func_parentid: '6', sv_func_id: '6-4', sv_func_code: '6-4', sv_func_name: '售卡汇总表', sv_remark: '查看门店售卡汇总', href: '/vueview/rustructure/secondaryCardReport.html?activeName=cardSalesSummary', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Subcard_Sales_Summary.png' },
                    ]
                },
                {
                    sv_func_id: '4', sv_func_name: '库存报表', children: [
                        { sv_func_parentid: '4', sv_func_id: '4-1', sv_func_code: '4-1', sv_func_name: '出入库明细', sv_remark: '查看商品出入库明细', href: '/vueview/rustructure/inventoryReport.html?activeName=accessInventoryDetails', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Out_Enter_Stock_Details.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-2', sv_func_code: '4-2', sv_func_name: '出入库汇总', sv_remark: '查看商品出入库汇总', href: '/vueview/rustructure/inventoryReport.html?activeName=inboundAndOutboundSummary', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Out_Enter_Stock_Summary.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-3', sv_func_code: '4-3', sv_func_name: '进销存报表', sv_remark: '查看商品进销存变动明细', href: '/vueview/rustructure/inventoryReport.html?activeName=invoicingReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Enter_Sales_Deposit.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-4', sv_func_code: '4-4', sv_func_name: '盘点明细表', sv_remark: '查看盘点商品情况', href: '/vueview/rustructure/inventoryReport.html?activeName=inventoryList', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Inventory_Details.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-5', sv_func_code: '4-5', sv_func_name: '盘点差异表', sv_remark: '查看盘点商品的差异明细', href: '/vueview/rustructure/inventoryReport.html?activeName=inventoryDifferenceTable', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Inventory_Difference.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-6', sv_func_code: '4-6', sv_func_name: '进货额排行', sv_remark: '门店进货笔数、金额排行', href: '/vueview/rustructure/inventoryReport.html?activeName=purchaseAmount', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Goods_purchased_money.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-7', sv_func_code: '4-7', sv_func_name: '商品采购统计', sv_remark: '查看商品采购数量和金额', href: '/vueview/rustructure/inventoryReport.html?activeName=commodityPurchasingStatistics', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Purchasing_Statistics.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-8', sv_func_code: '4-8', sv_func_name: '商品进货排行', sv_remark: '查看商品进货排行表', href: '/vueview/rustructure/inventoryReport.html?activeName=commodityPurchaseRanking', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Goods_purchase_ranking.png' },
                        { sv_func_parentid: '4', sv_func_id: '4-9', sv_func_code: '4-9', sv_func_name: '供应商进货', sv_remark: '查看供应商供货统计', href: '/vueview/rustructure/inventoryReport.html?activeName=supplierPurchaseRanking', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Supplier_purchase_ranking.png' },

                    ]
                },
                {
                    sv_func_id: '5', sv_func_name: '营销报表', children: [
                        { sv_func_parentid: '5', sv_func_id: '5-1', sv_func_code: '5-1', sv_func_name: '推荐人报表', sv_remark: '推荐会员开卡获得佣金明细', href: '/vueview/rustructure/marketingReport.html?activeName=referrerReport', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/Recommender_info.png' },
                        { sv_func_parentid: '5', sv_func_id: '5-2', sv_func_code: '5-2', sv_func_name: '邀请有礼明细', sv_remark: '线上邀请会员获得返利明细', href: '/vueview/rustructure/marketingReport.html?activeName=invitationDetails', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/invitationDetails.png' },
                        { sv_func_parentid: '5', sv_func_id: '5-3', sv_func_code: '5-3', sv_func_name: '邀请有礼汇总', sv_remark: '线上邀请会员获得返利汇总', href: '/vueview/rustructure/marketingReport.html?activeName=invitationCourtesySummary', sv_func_icon_n3: 'https://ros.decerp.cc/menu_img/invitationCourtesySummary.png' },
                    ]
                },
                {
                    sv_func_name: '员工提成', sv_func_id: '211-1', isVue: true, showChild: false, children: [
                        { sv_func_name: '商品业绩明细', sv_func_id: '211-1-1', sv_func_code: '211-1-1', sv_func_parentid: '211-1', isVue: true, href: '/commodityAch', sv_remark: '查看商品业绩详情', sv_func_icon_n3: base.frontImgBase + '/images/report/commodityAch.png' },
                        { sv_func_name: '商品提成明细', sv_func_id: '211-1-2', sv_func_code: '211-1-2', sv_func_parentid: '211-1', isVue: true, href: '/commodityPer', sv_remark: '查看商品提成详情', sv_func_icon_n3: base.frontImgBase + '/images/report/commodityPer.png' },
                        { sv_func_name: '项目业绩明细', sv_func_id: '211-1-3', sv_func_code: '211-1-3', sv_func_parentid: '211-1', isVue: true, href: '/projectAch', sv_remark: '查看项目业绩详情', sv_func_icon_n3: base.frontImgBase + '/images/report/projectAch.png' },
                        { sv_func_name: '项目提成明细', sv_func_id: '211-1-4', sv_func_code: '211-1-4', sv_func_parentid: '211-1', isVue: true, href: '/projectPer', sv_remark: '查看项目提成详情', sv_func_icon_n3: base.frontImgBase + '/images/report/projectPer.png' },
                        { sv_func_name: '售卡业绩明细', sv_func_id: '211-1-5', sv_func_code: '211-1-5', sv_func_parentid: '211-1', isVue: true, href: '/sellingCardsAch', sv_remark: '查看售卡业绩详情', sv_func_icon_n3: base.frontImgBase + '/images/report/sellingCardsAch.png' },
                        { sv_func_name: '售卡提成明细', sv_func_id: '211-1-6', sv_func_code: '211-1-6', sv_func_parentid: '211-1', isVue: true, href: '/sellingCardsPer', sv_remark: '查看售卡提成详情', sv_func_icon_n3: base.frontImgBase + '/images/report/sellingCardsPer.png' },
                        { sv_func_name: '员工业绩汇总', sv_func_id: '211-1-7', sv_func_code: '211-1-7', sv_func_parentid: '211-1', isVue: true, href: '/staffAch', sv_remark: '查看员工业绩汇总', sv_func_icon_n3: base.frontImgBase + '/images/report/staffAch.png' },
                        { sv_func_name: '月度提成报表', sv_func_id: '211-1-8', sv_func_code: '211-1-8', sv_func_parentid: '211-1', isVue: true, href: '/monthlyAch', sv_remark: '查看月提成报表', sv_func_icon_n3: base.frontImgBase + '/images/report/staffAch.png' },
                    ],
                },
                {
                    sv_func_id: '7', sv_func_name: 'BI报表', isVue: true, showChild: false, children: [
                        { sv_func_parentid: '7', sv_func_id: '7-1', sv_func_code: '7-1', sv_func_name: '采购汇总BI', sv_remark: '查看采购汇总BI', isVue: true, href: '/BiProcurement', sv_func_icon_n3: base.frontImgBase + '/images/report/biProcurement.png' },
                        { sv_func_parentid: '7', sv_func_id: '7-2', sv_func_code: '7-2', sv_func_name: '销售汇总BI', sv_remark: '查看销售汇总BI', isVue: true, href: '/BiSale', sv_func_icon_n3: base.frontImgBase + '/images/report/biSale.png' },
                        { sv_func_parentid: '7', sv_func_id: '7-3', sv_func_code: '7-3', sv_func_name: '库存查询BI', sv_remark: '查看库存查询BI', isVue: true, href: '/BiInventory', sv_func_icon_n3: base.frontImgBase + '/images/report/biInventory.png' },
                        { sv_func_parentid: '7', sv_func_id: '7-4', sv_func_code: '7-4', sv_func_name: '直调汇总BI', sv_remark: '查看直调汇总BI', isVue: true, href: '/BiAllot', sv_func_icon_n3: base.frontImgBase + '/images/report/biAllot.png' },
                    ]
                },
                {
                    sv_func_id: '8', sv_func_name: '教务报表', isVue: true, showChild: false, children: [
                        { sv_func_parentid: '8', sv_func_id: '8-1', sv_func_code: '8-1', sv_func_name: '报名订单', sv_remark: '查看报名订单', isVue: true, href: '/apply', sv_func_icon_n3: base.frontImgBase + '/images/report/educationApply.png' },
                        { sv_func_parentid: '8', sv_func_id: '8-2', sv_func_code: '8-2', sv_func_name: '订单明细', sv_remark: '查看订单明细', isVue: true, href: '/detail', sv_func_icon_n3: base.frontImgBase + '/images/report/educationDetail.png' },
                        { sv_func_parentid: '8', sv_func_id: '8-3', sv_func_code: '8-3', sv_func_name: '消课记录', sv_remark: '查看消课记录', isVue: true, href: '/expense', sv_func_icon_n3: base.frontImgBase + '/images/report/educationExpense.png' },
                        { sv_func_parentid: '8', sv_func_id: '8-4', sv_func_code: '8-4', sv_func_name: '课程汇总', sv_remark: '查看课程汇总', isVue: true, href: '/summary', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' },
                        { sv_func_parentid: '8', sv_func_id: '8-5', sv_func_code: '8-5', sv_func_name: '点名记录', sv_remark: '查看点名记录', isVue: true, href: '/callRoll', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' },
                        { sv_func_parentid: '8', sv_func_id: '8-6', sv_func_code: '8-6', sv_func_name: '学员课程', sv_remark: '统计学员课程', isVue: true, href: '/course', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' }
                    ]
                },
                {
                    sv_func_id: '9', sv_func_name: '订单报表', isVue: true, showChild: false, children: [
                        { sv_func_parentid: '9', sv_func_id: '9-1', sv_func_code: '9-1', sv_func_name: '签单流水', sv_remark: '查看签单流水', isVue: true, href: '/jianshengDetail', sv_func_icon_n3: base.frontImgBase + '/images/report/educationDetail.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-2', sv_func_code: '9-2', sv_func_name: '课程报表', sv_remark: '查看课程报表', isVue: true, href: '/jianshengApply', sv_func_icon_n3: base.frontImgBase + '/images/report/educationApply.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-3', sv_func_code: '9-3', sv_func_name: '上课报表', sv_remark: '查看上课报表', isVue: true, href: '/jianshengExpense', sv_func_icon_n3: base.frontImgBase + '/images/report/educationExpense.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-4', sv_func_code: '9-4', sv_func_name: '课程汇总', sv_remark: '查看课程汇总', isVue: true, href: '/jianshengSummary', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-5', sv_func_code: '9-5', sv_func_name: '签到记录', sv_remark: '查看签到记录', isVue: true, href: '/jianshengCallRoll', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-6', sv_func_code: '9-6', sv_func_name: '会员课程', sv_remark: '统计会员课程', isVue: true, href: '/jianshengCourse', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' },
                        { sv_func_parentid: '9', sv_func_id: '9-7', sv_func_code: '9-7', sv_func_name: '预约列表', sv_remark: '会员课程预约', isVue: true, href: '/courseReservation', sv_func_icon_n3: base.frontImgBase + '/images/report/educationSummary.png' }
                    ]
                },
                {
                    sv_func_id: '10', sv_func_name: '已售报表', isVue: true, sv_enabled: true, isDebug: false, showChild: false, children: [
                        { sv_func_parentid: '10', sv_func_id: '10-1', sv_func_code: '10-1', sv_func_name: '已售入场卡', sv_remark: '查看已售入场卡', isVue: true, isDebug: false, href: '/entryCard', sv_func_icon_n3: base.frontImgBase + '/images/report/educationApply.png' },
                        { sv_func_parentid: '10', sv_func_id: '10-2', sv_func_code: '10-2', sv_func_name: '已售课程卡', sv_remark: '查看已售课程卡', isVue: true, href: '/courseCard', sv_func_icon_n3: base.frontImgBase + '/images/report/educationDetail.png' },
                        { sv_func_parentid: '10', sv_func_id: '10-3', sv_func_code: '10-3', sv_func_name: '已售私教课', sv_remark: '查看已售私教课', isVue: true, href: '/personCourseCard', sv_func_icon_n3: base.frontImgBase + '/images/report/educationExpense.png' },
                    ]
                },
                // ...(this.userInfo.sv_us_industrytype == 32 &&)
                {
                    sv_func_id: '11', sv_func_name: '入场统计', isVue: true, sv_enabled: true, isDebug: false, showChild: false, children: [
                        { sv_func_parentid: '11', sv_func_id: '11-1', sv_func_code: '11-1', sv_func_name: '入场管理明细', sv_remark: '查看入场管理明细', isVue: true, isDebug: false, href: '/biManage', sv_func_icon_n3: base.frontImgBase + '/images/report/educationApply.png' },
                        { sv_func_parentid: '11', sv_func_id: '11-2', sv_func_code: '11-2', sv_func_name: '会员入场统计', sv_remark: '查看会员入场统计', isVue: true, isDebug: false, href: '/biCount', sv_func_icon_n3: base.frontImgBase + '/images/report/educationDetail.png' },
                    ]
                },
                // {
                //     sv_func_id: '8', sv_func_name: '会员中心',isVue: true, showChild: false, children: [
                //         { sv_func_parentid: '8', sv_func_id: '8-1', sv_func_code: '8-1', sv_func_name: 'RFM分析', sv_remark: '会员RFM分析',isVue: true, href: '/rfmReport', sv_func_icon_n3: base.frontImgBase + '/images/report/biProcurement.png'},
                //     ]
                // },
                // { sv_func_parentid: '11', sv_func_id: '11-1', sv_func_code: '11-1', sv_func_name: '已售入场卡', sv_remark: '查看已售入场卡', isVue: true, isDebug: false, href: '/entryCard', sv_func_icon_n3: base.frontImgBase + '/images/report/educationApply.png' },
                {
                    sv_func_name: '报表下载', sv_func_id: '311-1', sv_func_parentid: '311-1', sv_func_code: '311-1-1', isVue: true, isOnly: true, showChild: false, href: '/downloadReport',
                },
            ]
            let hasStoreJuris = this.userInfo.isStore === false && this.userInfo.storeNumber === 0 ? false : true;

            json.filter(f => f.sv_func_name !== '返回旧版' && f.sv_func_name !== '餐饮报表').map((e, i) => {
                if (!hasStoreJuris && e.sv_func_name === '会员报表') {
                    e.children = e.children.filter(k => k.sv_func_name !== '会员跨店明细' && k.sv_func_name !== '会员跨店汇总');
                }
                return {
                    ...e,
                    showChild: false
                }
            });
            this.list = this.$app.getNotMenu(json);
            // this.list = json
            let path = this.$route.path;
            if (path !== '/reportCensus') {
                const item = this.$app.treeJsonFind(json, (data) => data.href === path);
                if (this.$app.isNull(item)) return;
                this.pageName = item.sv_func_name;
                this.isHtml = false;
                this.selectedFirst = item.sv_func_parentid;
                this.selectedSecond = item.sv_func_code;
                this.list.forEach(e => { e.showChild = e.sv_func_id === item.sv_func_parentid ? true : false; });

                const path = this.$route.path;
                if (path !== '/reportCensus') this.setActiveReportCensus(json, path);
            }

            if (this.$route.query.activeName) this.setActiveName(this.$route.query.activeName)
        },
        setActiveName(activeName) {
            let currentItem = {}
            this.list.forEach(e => {
                const item = e.children.find(k => k.href.indexOf(activeName) > -1)
                if (item) {
                    currentItem = { ...item }
                }
            })
            // const item = this.$app.treeJsonFind(this.list, (e) => e.children.find(k =).indexOf(activeName) > -1);
            this.pageName = currentItem.sv_func_name;
            this.isHtml = false;
            this.selectedFirst = currentItem.sv_func_parentid;
            this.selectedSecond = currentItem.sv_func_code;
            this.list.forEach(e => { e.showChild = e.sv_func_id === currentItem.sv_func_parentid ? true : false; });
            currentItem.isVue ? this.$router.push({ path: currentItem.href }) : (this.$route.path !== '/reportCensus' && this.$router.push({ path: '/reportCensus' }), this.html = window.parent.location.origin + currentItem.href);
        },
        setActiveReportCensus(json, path) {
            let item = this.$app.treeJsonFind(json, (e) => e.href === path)
            if (this.$app.isNull(item)) return;
            this.pageName = item.sv_func_name;
            this.isHtml = false;
            this.selectedFirst = item.sv_func_parentid;
            this.selectedSecond = item.sv_func_code;
            this.list.forEach(e => { e.showChild = e.sv_func_id === item.sv_func_parentid ? true : false; });

        },
        handleChildShow(_item, index) {                      // 点击展开
            this.list = this.list.map((e, i) => { e.showChild = index === i ? !_item.showChild : false; return { ...e } });
            if (_item.isOnly) {
                if (this.$route.path.indexOf(_item.href) > -1) return;
                this.selectedFirst = _item.sv_func_parentid;
                this.selectedSecond = _item.sv_func_code;
                this.isHtml = false;
                this.pageName = _item.sv_func_name;
                return this.$router.push({ path: _item.href });
            }
            _item.showChild = !_item.showChild;
        },
        onChildClick(_item, _child) {                       // 设置路由跳转
            if (this.selectedSecond === _child.sv_func_id) return;
            if (!_child.sv_enabled) return this.$message({ showClose: true, message: '版本未开放此功能，请联系客服', type: 'warning', duration: 5000 });
            this.pageName = _child.sv_func_name;
            this.isHtml = false;
            this.openeds = [_item.sv_func_code]
            this.openIndex = _child.sv_func_code;
            this.selectedFirst = _child.sv_func_parentid;
            this.selectedSecond = _child.sv_func_id;
            this.list = this.list.map(e => {
                e.showChild = e.sv_func_id === _child.sv_func_parentid ? true : false;
                return { ...e }
            })
            _child.isVue ? this.$router.push({ path: _child.href }) : (this.$route.path !== '/reportCensus' && this.$router.push({ path: '/reportCensus' }), this.html = window.parent.location.origin + _child.href);
        },
        showHome() {
            this.isHtml = true
            this.openIndex = '0'
            this.openeds = [];
            this.pageName = '智能分析';
            this.selectedFirst = '';
            this.selectedSecond = '';
            this.$router.push('/reportCensus');
        },
    }
}

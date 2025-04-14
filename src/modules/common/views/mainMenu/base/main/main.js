import { multiPage } from '@/components/index';
export default {
    components: { multiPage },
    data() {
        return {
            selected: '', 						// 当前的路由路径
            multiPageList: [],
            systemMenu: [
                // 模块主菜单
                // {
                //     name: '测试模块1',
                //     showChild: true,
                //     children: [
                //         { name: '列表', isHide: true, isDebug: true, href: '/report/testList' },
                //         { name: '列表1', isHide: true, isDebug: true, href: '/report/testList1' },
                //     ],
                // },
                {
                    name: '日常报表',
                    code: 'menuPos1',
                    showChild: false,
                    children: [
                        { name: '营业日报', isHide: true, isDebug: true, href: '/report/storeReconciliation' },
                        { name: '交接班记录', isHide: true, isDebug: true, href: '/report/handoverRecord' },
                        { name: '门店概况', isHide: true, isDebug: true, href: '/report/storeOverview' },
                        { name: '营业报表', isHide: true, isDebug: true, href: '/report/businessStatement' },
                        { name: '收银员业绩统计', isHide: true, isDebug: true, href: '/report/cashierAchievement' },
                        { name: '门店销售统计', isHide: true, isDebug: true, href: '/report/storeSales' },
                        { name: '分账明细表', isHide: true, isDebug: true, href: '/report/ledgerAccount' },
                        { name: '分账汇总表', isHide: true, isDebug: true, href: '/report/managementLedgerAccount' },
                        { name: '支付收款明细', isHide: true, isDebug: true, href: '/report/collectionDetails' },
                        { name: '预付金记录表', isHide: true, isDebug: true, href: '/report/preMoneyReport' }
                    ],
                },
                {
                    name: '销售报表',
                    code: 'menuPos2',
                    showChild: false,
                    children: [
                        { name: '销售流水报表', isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: '退货报表', isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: '反结账', isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: '品项赠送报表', isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: '品项折扣报表', isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                        { name: '销售毛利分析', isHide: true, isDebug: true, href: '/report/commoditySalesAnalysis' },
                        { name: '商品销售统计', isHide: true, isDebug: true, href: '/report/commoditySalesStatistics' },
                        { name: '价格段分析', isHide: true, isDebug: true, href: '/report/orderStageAnalysis' },
                        { name: '寄存明细报表', isHide: true, isDebug: true, href: '/report/depositDetailReport' },
                        { name: '寄存汇总报表', isHide: true, isDebug: true, href: '/report/consignmentSummaryReport' },
                        { name: '毛利汇总', isHide: true, isDebug: true, href: '/report/storeGrossProfitSummary' },
                        { name: '餐台报表', isHide: true, isDebug: true, href: '/report/tableReport' }
                    ],
                },
                {
                    name: '会员报表',
                    code: 'menuPos3',
                    showChild: false,
                    children: [
                        { name: '充值明细报表', isHide: true, isDebug: true, href: '/report/rechargeReport' },
                        { name: '押金报表', isHide: true, isDebug: true, href: '/report/depositReport' },
                        { name: '会员卡退款明细', isHide: true, isDebug: true, href: '/report/storedRefund' },
                        { name: '会员储值日报表', isHide: true, isDebug: true, href: '/report/storedDaily' },
                        { name: '门店储值汇总', isHide: true, isDebug: true, href: '/report/storedSummary' },
                        { name: '门店会员卡汇总', isHide: true, isDebug: true, href: '/report/memberCardSummary' },
                        { name: '会员分析', isHide: true, isDebug: true, href: '/report/memberAnalysis' },
                        { name: '会员跨店明细', isHide: true, isDebug: true, href: '/report/memberCrossStoreDetails' },
                        { name: '会员跨店汇总', isHide: true, isDebug: true, href: '/report/memberCrossStoreDetailsTable' },
                        { name: '欠款管理', isHide: true, isDebug: true, href: '/report/arrearsManagement' },
                        { name: '还款流水报表', isHide: true, isDebug: true, href: '/report/repaymentReport' },
                        { name: '积分明细', isHide: true, isDebug: true, href: '/report/pointsDetails' },
                        { name: '会员余额变动', isHide: true, isDebug: true, href: '/report/balanceChangeReport' },
                        { name: '会员RFM分析', isHide: true, isDebug: true, href: '/report/rfmReport' },
                    ],
                },
                {
                    name: '次卡报表',
                    code: 'menuPos4',
                    showChild: false,
                    children: [
                        { name: '次卡消费流水', isHide: true, isDebug: true, href: '/report/consumption' },
                        { name: '剩余次数汇总', isHide: true, isDebug: true, href: '/report/summaryTableOfRemainingTimes' },
                        { name: '售卡明细表', isHide: true, isDebug: true, href: '/report/cardSalesSchedule' },
                        { name: '售卡汇总表', isHide: true, isDebug: true, href: '/report/cardSalesSummary' }
                    ],
                },
                {
                    name: '库存报表',
                    code: 'menuPos5',
                    showChild: false,
                    children: [
                        { name: '出入库明细', isHide: true, isDebug: true, href: '/report/accessInventoryDetails' },
                        { name: '出入库汇总', isHide: true, isDebug: true, href: '/report/inboundAndOutboundSummary' },
                        { name: '进销存报表', isHide: true, isDebug: true, href: '/report/invoicingReport' },
                        { name: '盘点明细表', isHide: true, isDebug: true, href: '/report/inventoryList' },
                        { name: '盘点差异表', isHide: true, isDebug: true, href: '/report/inventoryDifferenceTable' },
                        { name: '进货额排行', isHide: true, isDebug: true, href: '/report/purchaseAmount' },
                        { name: '商品采购统计', isHide: true, isDebug: true, href: '/report/commodityPurchasingStatistics' },
                        { name: '商品进货排行', isHide: true, isDebug: true, href: '/report/commodityPurchaseRanking' },
                        { name: '供应商进货', isHide: true, isDebug: true, href: '/report/supplierPurchaseRanking' }
                    ],
                },
                {
                    name: '营销报表',
                    code: 'menuPos6',
                    showChild: false,
                    children: [
                        { name: '推荐人报表', isHide: true, isDebug: true, href: '/report/referrerReport' },
                        { name: '邀请有礼明细', isHide: true, isDebug: true, href: '/report/invitationDetails' },
                        { name: '邀请有礼汇总', isHide: true, isDebug: true, href: '/report/invitationCourtesySummary' }
                    ],
                },
                {
                    name: '员工提成',
                    code: 'menuPos7',
                    showChild: false,
                    children: [
                        { name: '商品业绩明细', isHide: true, isDebug: true, href: '/report/commodityAch', },
                        { name: '商品提成明细', isHide: true, isDebug: true, href: '/report/commodityPer' },
                        { name: '项目业绩明细', isHide: true, isDebug: true, href: '/report/projectAch' },
                        { name: '项目提成明细', isHide: true, isDebug: true, href: '/report/projectPer' },
                        { name: '售卡业绩明细', isHide: true, isDebug: true, href: '/report/sellingCardsAch' },
                        { name: '售卡提成明细', isHide: true, isDebug: true, href: '/report/sellingCardsPer' },
                        { name: '员工业绩汇总', isHide: true, isDebug: true, href: '/report/staffAch' },
                        { name: '月度提成报表', isHide: true, isDebug: true, href: '/report/monthlyAch' }
                    ],
                },
                {
                    name: 'BI报表',
                    code: 'menuPos8',
                    showChild: false,
                    children: [
                        { name: '采购汇总BI', isHide: true, isDebug: true, href: '/report/BiProcurement', },
                        { name: '销售汇总BI', isHide: true, isDebug: true, href: '/report/BiSale' },
                        { name: '库存查询BI', isHide: true, isDebug: true, href: '/report/BiInventory' },
                        { name: '直调汇总BI', isHide: true, isDebug: true, href: '/report/BiAllot' }
                    ],
                },
                {
                    name: '教务报表',
                    code: 'menuPos9',
                    showChild: false,
                    children: [
                        { name: '报名订单', isHide: true, isDebug: true, href: '/report/apply', },
                        { name: '订单明细', isHide: true, isDebug: true, href: '/report/detail' },
                        { name: '消课记录', isHide: true, isDebug: true, href: '/report/expense' },
                        { name: '课程汇总', isHide: true, isDebug: true, href: '/report/summary' },
                        { name: '点名记录', isHide: true, isDebug: true, href: '/report/callRoll' },
                        { name: '学员课程', isHide: true, isDebug: true, href: '/report/course' }
                    ],
                },
                {
                    name: '订单报表',
                    code: 'menuPos10',
                    showChild: false,
                    children: [
                        { name: '签单流水', isHide: true, isDebug: true, href: '/report/orderReportDetail', },
                        { name: '课程报表', isHide: true, isDebug: true, href: '/report/orderReportApply' },
                        { name: '上课报表', isHide: true, isDebug: true, href: '/report/orderReportExpense' },
                        { name: '课程汇总', isHide: true, isDebug: true, href: '/report/orderReportSummary' },
                        { name: '签到记录', isHide: true, isDebug: true, href: '/report/orderReportCallRoll' },
                        { name: '会员课程', isHide: true, isDebug: true, href: '/report/orderReportCourse' },
                        { name: '预约列表', isHide: true, isDebug: true, href: '/report/courseReservation' }
                    ],
                },
                {
                    name: '已售报表',
                    code: 'menuPos11',
                    showChild: false,
                    children: [
                        { name: '已售入场卡', isHide: true, isDebug: true, href: '/report/entryCard', },
                        { name: '已售课程卡', isHide: true, isDebug: true, href: '/report/entryCardDetail' },
                        { name: '已售私教课', isHide: true, isDebug: true, href: '/report/courseCard' }
                    ],
                },
                {
                    name: '入场统计',
                    code: 'menuPos12',
                    showChild: false,
                    children: [
                        { name: '入场管理明细', isHide: true, isDebug: true, href: '/report/biManage', },
                        { name: '会员入场统计', isHide: true, isDebug: true, href: '/report/biCount' }
                    ],
                },
            ],
        };
    },
    computed: {
        breadcrumb() {
            // 面包屑导航
            let list = [...this.$route.meta.pageName];
            if (list.length < 2) return list;
            if (this.$route.query.type && !this.$app.isNull(this.$route.meta.name)) {
                const item = this.$route.meta.name.find((e) => e.type === this.$route.query.type);
                if (item) {
                    list[1].name = item.name;
                }
            }
            return list;
        },
        isHome() {
            return this.selected === '/report/reportCensus'
        },
    },
    watch: {
        '$route': {
            deep: true,
            immediate: true,
            handler(newval, oldval) {
                this.selected = newval.path;
                const currentPage = this.multiPageList.find(e => e.url === newval.path);
                // console.log(this.multiPageList.map(e => e.pageCode));
                this.systemMenu.forEach(subItem => {
                    if (subItem.children.findIndex(e => e.href === this.selected) > -1) {
                        subItem.showChild = true;
                    } else {
                        subItem.showChild = false;
                    }
                });
                if (!currentPage && newval.path !== '/report/reportCensus') {
                    this.multiPageList.push({
                        url: newval.path,
                        pageCode: newval.name,
                        name: newval.meta.pageName
                    });
                }
            },
        },
    },
    mounted() {
        this.selected = this.$route.path; // 获取路由路径
        this.systemMenu = this.$app.getNotMenu(this.systemMenu);
        console.log(this.$t('reports.staffReports'));
    },
    methods: {
        showHome() {
            if (this.$route.path === '/report/reportCensus') return
            this.multiPageList = [];
            this.$router.replace('/report/reportCensus');
        },
        closePage(pos) {
            const selectedPageUrl = this.multiPageList[pos].url;
            if (selectedPageUrl === this.selected) {
                if (this.multiPageList.length > 1) {
                    const nextUrl = pos === this.multiPageList.length - 1 ? this.multiPageList[pos - 1].url : this.multiPageList[pos + 1].url
                    this.$router.replace(nextUrl);
                } else {
                    return
                }
            }
            this.multiPageList.splice(pos, 1)
        },
        handleChildShow(_item) {
            // 点击展开
            this.systemMenu.forEach(subItem => {
                subItem.showChild = _item.code === subItem.code ? !_item.showChild : false;
            })
            if (this.$app.isNull(_item.children)) {
                _item.href && (this.$router.push(_item.href), (this.selected = _item.href));
            }
            this.handleUpdateScroll();
        },
        onChildClick(_item, _child) {
            // 设置路由跳转
            if (this.$route.path === _child.href) return;
            _child.href && this.$router.replace(_child.href);
            this.handleUpdateScroll();
        },
        handleDownLoad() {
            if (this.$route.path === '/report/downloadReport') return;
            this.$router.replace('/report/downloadReport');
        },
        handleUpdateScroll() {
            this.$nextTick(() => {
                !!this.$refs.menuSrocll && this.$refs.menuSrocll.update()
            })
        },
    },
};
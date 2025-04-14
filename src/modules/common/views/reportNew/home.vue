<template>
    <div class="mainTem">
        <!-- main头部 -->
        <div class="mt_top"></div>
        <!-- main内容 -->
        <section class="mt_section">
            <!-- main左侧 -->
            <div class="mt_left">
                <!-- 一级菜单 -->
                <div class="mt_oneMenu"></div>
                <!-- 二级菜单 -->
                <div class="mt_towMenu">
                    <div class="mttm_title" @click="showHome">智能分析</div>
                    <div class="scrollbar">
                        <el-scrollbar ref="menuSrocll" style="height: 100%; width: 100%">
                            <template v-for="item in systemMenu">
                                <div class="navmenu" v-if="!item.isHide" :key="item.code">
                                    <div class="navmenu_one">
                                        <div class="nav_oneTitle" @click="handleChildShow(item)" :class="{ selected: selected === item.href }">
                                            <div :class="{ selected: item.children.findIndex((e) => e.href === selected) > -1 }" v-if="!$app.isNull(item.children)">
                                                <!-- <i class="el-icon-arrow-down" v-if="item.showChild"></i> -->
                                                <i class="iconLeft el-icon-arrow-right" :class="{ show: item.showChild }"></i>
                                            </div>
                                            <label>{{ item.name }}</label>
                                        </div>
                                        <div class="navmenu_tow" v-if="item.showChild">
                                            <div class="nav_towName" :class="{ selected: k.href === selected }" v-for="k in item.children" :key="k.code" @click="onChildClick(item, k)">{{ k.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-scrollbar>
                    </div>
                    <div class="downloadItem" :class="{'selected': selected === '/report/downloadReport' }" @click="handleDownLoad">
                        <cmd-icon type="icon-xiazai" color="rgba(var(--main-theme-color),1)" size="20"></cmd-icon>
                        <span class="itemName">报表下载</span>
                    </div>
                </div>
            </div>
            <!-- main主要内容 -->
            <keep-alive v-if="isHome">
                <router-view />
            </keep-alive>
            <multi-page :breadcrumb="multiPageList" v-show="!isHome" pageWidth="calc(100% - 150px)" @closePage="closePage">
                <!-- keep-alive 对应页面的name和router的name需要一致 -->
                <keep-alive :include="multiPageList.map(e => e.pageCode)">
                    <router-view />
                </keep-alive>
            </multi-page>
        </section>
    </div>
</template>

<script>
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
</script>

<style lang="scss" scoped>
.mainTem {
    width: 100%;
    height: 100%;
    background-color: #f7f8fa;

    .mt_section {
        width: 100%;
        height: 100%;
        display: flex;

        .mt_left {
            //   width: 130rx;
            height: 100%;
            width: 150px;
            padding: 0 0 0 5px;
            background-color: #ffffff;

            /* .mt_oneMenu {} */
            .mt_towMenu {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;

                .mttm_title {
                    height: 60rx;
                    width: 100%;
                    font-size: 14px;
                    font-weight: 400;
                    color: #000000;
                    flex: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #ebedf0;
                    cursor: pointer;
                }

                .scrollbar {
                    max-height: calc(100% - 60rx - 60px);
                    width: 100%;
                }

                .downloadItem {
                    padding-left: 10px;
                    margin-top: 10px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    color: rgba(var(--main-theme-color), 1);
                    cursor: pointer;

                    .itemName {
                        padding-left: 10px;
                    }
                    &:hover,
                    &.selected {
                        background-color: #f1f2f3;
                    }
                }
            }
        }

        .mt_right {
            position: absolute;
            right: 0;
            height: 100%;
            width: 224px;
            -webkit-box-shadow: inset 1px 0 0 0 #ebedf0;
            box-shadow: inset 1px 0 0 0 #ebedf0;
            font-size: 14px;
            background-color: #ffffff;
            transform: translateX(224px);
            -webkit-transform: translateX(224px);
            transition: 300ms;

            &.show {
                transform: translateX(0);
                -webkit-transform: translateX(0);
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                height: 60rx;
                text-align: center;
                border-bottom: 1px solid #ebedf0;
                cursor: pointer;

                .btn_hideHelp {
                    cursor: pointer;
                }

                .divFont {
                    color: #1775fc;
                    cursor: pointer;

                    span {
                        margin: 0 5px 0 0;
                    }
                }
            }

            .container {
                height: calc(100% - 60rx);

                .help_ul {
                    display: flex;
                    overflow: hidden;
                    padding: 10px 0;
                    min-height: 280px;
                    max-height: calc(100% - 280rx);

                    &.OEMHeight {
                        max-height: calc(100% - 20rx);
                    }

                    .li {
                        padding: 10px 16px;
                        cursor: pointer;

                        &:hover {
                            color: #1775fc;
                        }
                    }
                }
            }
        }
    }

    .schoolWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
}

.schoolDialog {
    /deep/.el-dialog__headerbtn {
        z-index: 99;
        height: 30px;
        width: 30px;
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;

        .el-dialog__close {
            color: #ffffff;
        }
    }
}

.downloadWrap {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    z-index: 13;

    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 560px;
        width: 360px;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        padding: 0 80px;
        background-color: #ffffff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .close {
            position: absolute;
            right: -50rx;
            top: 0rx;
            width: 40rx;
            height: 40rx;
            color: #ffffff;
            font-size: 28px;
            cursor: pointer;
        }

        .dowloadTitle {
            margin-top: 40px;
            color: #000000;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }

        .qrCode {
            margin: 28px 0;
            width: 180px;
            height: 180px;
            background-color: red;
        }

        .btn {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding-left: 40px;
            width: 200px;
            height: 58px;
            color: #000000;
            border: 1px solid #000000;
            border-radius: 30px;
            font-size: 16px;
            font-weight: bold;

            .btn_icon {
                margin-right: 16px;
            }

            &.typewin {
                color: #1775fc;
                border: 1px solid #1775fc;
                cursor: pointer;

                &:hover {
                    background-color: rgba($color: #1775fc, $alpha: 0.1);
                }
            }
        }
    }
}

//region 二级菜单导航
.navmenu {
    width: 100%;
    cursor: pointer;

    .navmenu_one {
        width: 100%;
        height: auto;
        padding-top: 10rx;
        user-select: none;

        .nav_oneTitle {
            display: flex;
            align-items: center;
            height: 35px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            user-select: none;

            .iconLeft {
                padding-left: 5px;
                font-size: 14px;
                transition-duration: 300ms;

                &.show {
                    transform: rotate(90deg);
                }
            }

            .selected {
                color: rgba(var(--main-theme-color), 1);
            }

            label {
                padding: 0 0 0 5px;
                cursor: pointer;

                &.selected {
                    color: rgba(var(--main-theme-color), 1);
                }

                &.renturnBack {
                    color: rgba(var(--main-theme-color), 1);
                    // margin: 0 0 0 15px;
                }
            }

            &:hover,
            &.selected {
                color: rgba(var(--main-theme-color), 1);
                background: #f1f2f3;
                border-radius: 4px;
            }
        }

        .navmenu_tow {
            .nav_towName {
                padding-left: 25px;
                margin-top: 5px;
                height: 35px;
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 400;
                color: #333333;

                &:hover {
                    color: rgba(var(--main-theme-color), 1);
                    background: #f1f2f3;
                    border-radius: 4px;
                    cursor: pointer;
                }

                &.selected {
                    color: rgba(var(--main-theme-color), 1);
                    background: #f1f2f3;
                }
            }
        }

        .active {
            color: rgba(var(--main-theme-color), 1);
            background: #f1f2f3;
            border-radius: 4px;
        }
    }
}
</style>

<!-- 充值明细报表 -->
<template>
    <div class="rechargeReport">
        <report-filter :filterable="{}"></report-filter>
        <div class="contentWrap">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="id" :data="dataList || []">
                    <my-table-cell label="序号" fixed="left" prop="index" width="80" align="center"></my-table-cell>
                    <my-table-cell label="推荐人卡号" prop="sv_mr_cardno" showTooltip width="250"></my-table-cell>
                    <my-table-cell label="推荐人姓名" prop="sv_mr_name"></my-table-cell>
                    <my-table-cell label="推荐奖励（元）" prop="sv_reward_amount"></my-table-cell>
                    <my-table-cell label="推荐奖励（积分）" prop="sv_reward_point" align="center"></my-table-cell>
                    <my-table-cell label="被推荐卡号" prop="reded_mr_cardno" align="center"></my-table-cell>
                    <my-table-cell label="被推荐人" prop="reded_mr_name" align="center"></my-table-cell>
                    <my-table-cell label="被推荐奖励" prop="reded_reward_amount" align="center"></my-table-cell>
                    <my-table-cell label="推荐门店" prop="sv_us_name" align="center"></my-table-cell>
                    <my-table-cell label="推荐时间" prop="red_date" width="120" align="center">
                        <template v-slot:default="row">
                            <span>{{ row.red_date }}</span>
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script src="./rechargeReport.js"></script>
<style lang="scss" scoped>
@import './rechargeReport.scss';
</style>
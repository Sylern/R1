<!-- 反结账 -->
<template>
    <div class="antiCheckout">
        <report-filter :filterable="{}"></report-filter>
        <div class="contentWrap">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="id" :data="dataList || []">
                    <my-table-cell label="序号" fixed="left" prop="index" width="80" align="center"></my-table-cell>
                    <my-table-cell label="推荐人卡号" prop="sv_mr_cardno" showTooltip width="250"></my-table-cell>
                    <my-table-cell label="推荐人姓名" prop="sv_mr_name"></my-table-cell>
                    <my-table-cell label="推荐奖励（元）" prop="sv_reward_amount"></my-table-cell>
                    <my-table-cell label="推荐奖励（积分）" prop="sv_reward_point" align="center"></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script src="./antiCheckout.js"></script>
<style lang="scss" scoped>
@import "./antiCheckout.scss";
</style>
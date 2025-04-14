<!-- 出入库汇总 -->
<template>
    <div class="accessInventoryDetails">
        <report-filter :filterable="{}"></report-filter>
        <div class="contentWrap">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="id" :data="dataList || []">
                    <my-table-cell label="序号" fixed="left" prop="index" width="80" align="center"></my-table-cell>
                    <my-table-cell label="推荐人卡号" prop="sv_mr_cardno" showTooltip width="250"></my-table-cell>
                    <my-table-cell label="推荐人姓名" prop="sv_mr_name" align="center"></my-table-cell>
                    <my-table-cell label="会员等级" prop="sv_ml_name" align="center"></my-table-cell>
                    <my-table-cell label="一级推荐人数" prop="onelevel_number" align="center"></my-table-cell>
                    <my-table-cell label="二级推荐人数" prop="twolevel_number" align="center"></my-table-cell>
                    <my-table-cell label="二级获利金额" prop="twolevel_profit" align="center"></my-table-cell>
                    <my-table-cell label="三级推荐人数" prop="threelevel_number" align="center"></my-table-cell>
                    <my-table-cell label="三级获利金额" prop="threelevel_profit" align="center"></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script src="./accessInventoryDetails.js"></script>
<style lang="scss" scoped>
@import './accessInventoryDetails.scss';
</style>
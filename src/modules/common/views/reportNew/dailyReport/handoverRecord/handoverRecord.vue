<!-- 交接班记录 -->
<template>
    <div class="handoverRecord">
        <report-filter ref="reportFilter" :filterable="filterable" @update="handleUpdateFilter"></report-filter>
        <div class="contentWrap">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="id" :data="dataList || []">
                    <my-table-cell label="序号" fixed="left" prop="index" width="80" align="center">
                         <template v-slot:default="scope">
                            <span>{{ (query.page - 1) * query.pageSize + scope.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="员工姓名" prop="order_operator" width="200" showTooltip></my-table-cell>
                    <my-table-cell label="开始时间" prop="start_time" align="center"></my-table-cell>
                    <my-table-cell label="结束时间" prop="end_time" align="center"></my-table-cell>
                    <my-table-cell label="交接时间" prop="succession_time" align="center"></my-table-cell>
                    <my-table-cell label="备用金" prop="cash_money" align="center"></my-table-cell>
                    <my-table-cell label="操作" prop="control" align="center">
                        <template v-slot:default="scope">
                            <span class="controlBtn btn" @click="handleInfo(scope)">对账</span>
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
<script src="./handoverRecord.js"></script>
<style lang="scss" scoped>
@import './handoverRecord.scss';
</style>
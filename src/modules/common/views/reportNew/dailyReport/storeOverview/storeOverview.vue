<!-- isCCB ? '门店收银统计' : '门店概况' -->
<template>
    <div class="storeOverview">
        <report-filter ref="reportFilter" :filterable="filterable" @update="handleUpdateFilter"></report-filter>
        <div class="contentWrap">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="id" :data="dataList || []">
                    <my-table-cell label="序号" fixed="left" prop="index" width="80" align="center">
                        <template v-slot:default="scope">
                            <span>{{ (query.page - 1) * query.pageSize + scope.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="门店名称" prop="sv_us_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="门店编号" prop="user_id" width="120" align="center"></my-table-cell>
                    <my-table-cell label="销售数量" prop="product_num" width="120" align="center">
                        <template slot="header">
                            <span>销售数量</span>
                            <el-tooltip class="item" effect="dark" content="商品销售数量不含退货数量 并且 减掉单品退货" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="销售笔数" prop="succession_time" width="120" align="center"></my-table-cell>
                    <my-table-cell label="营业总额" prop="order_receivables" width="120" align="center"></my-table-cell>
                    <my-table-cell label="储值消费金额" prop="storedsalesamount" width="120" align="center"></my-table-cell>
                    <my-table-cell label="消费本金" prop="order_principal" width="120" align="center"></my-table-cell>
                    <my-table-cell label="消费赠金" prop="order_give" width="120" align="center"></my-table-cell>
                    <my-table-cell :prop="item.order_payment" :label="item.order_payment" v-for="(item, index) in dataList.payment_list" :key="index" min-width="120">
                    </my-table-cell>
                    <my-table-cell label="积分抵扣" prop="order_aintegral" width="120" align="center"></my-table-cell>
                    <my-table-cell label="优折赠" prop="order_pdgfee" width="120" align="center"></my-table-cell>
                    <my-table-cell label="退货金额" prop="retrun_receivable" width="120" align="center"></my-table-cell>
                    <my-table-cell label="应清金额" prop="clean_receivable" width="120" align="center"></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script src="./storeOverview.js"></script>
<style lang="scss" scoped>
@import './storeOverview.scss';
</style>
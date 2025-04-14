
<template>
    <main class="allot-Main">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="exportHandle">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">直调时间：</div>
                        <date-time-picker :paramData="[queryEntity.start_date,queryEntity.end_date]" @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">调出门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.out_id" filterable placeholder="请选择" @change="getReportHandle">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">调入门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.ent_id" filterable placeholder="请选择" @change="getReportHandle">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <!-- <my-table ref="myTable" rowKey="id" :data="dataList||[]" @select-all="handleSelectAll" @select="handleSellect">
                    <my-table-cell fixed prop="selection" width="40" align="right"></my-table-cell> -->
                <my-table ref="myTable" rowKey="id" :data="dataList||[]">
                    <my-table-cell align="center" label="序号" width="80" prop="index">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.Page-1)*queryEntity.PageSize+ row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="调出分店编号" prop="sv_out_id"></my-table-cell>
                    <my-table-cell align="center" label="调出分店名称" prop="sv_out_name"></my-table-cell>
                    <my-table-cell align="center" label="调入分店编号" prop="sv_enter_id"></my-table-cell>
                    <my-table-cell align="center" label="调入分店名称" prop="sv_enter_name"></my-table-cell>
                    <my-table-cell align="center" label="调出数量" prop="sv_out_num"></my-table-cell>
                    <!-- <my-table-cell align="center" label="调出赠送数量" prop="sv_us_name"></my-table-cell> -->
                    <my-table-cell align="center" label="调出金额" prop="sv_out_money">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.sv_out_money,2)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="调入数量" prop="sv_enter_num"></my-table-cell>
                    <!-- <my-table-cell align="center" label="调入赠送数量" prop="sv_us_name"></my-table-cell> -->
                    <my-table-cell align="center" label="调入金额" prop="sv_enter_money">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.sv_enter_money,2)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="调拨差异数量" prop="sv_diversity_num"></my-table-cell>
                    <my-table-cell align="center" label="调拨差异金额" prop="sv_diversity_money">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.order_receivable,2)}}
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary"> </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.Page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './allot.scss';
</style>
<script src="./allot.js"></script>

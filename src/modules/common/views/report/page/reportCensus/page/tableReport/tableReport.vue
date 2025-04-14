
<template>
    <main class="tableReport-Main">
        <div class="rep_query">
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="[queryEntity.date_start, queryEntity.date_end]" @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="currentShopIds" placeholder="请选择" multiple collapse-tags @change="changeHandle">
                                <template>
                                    <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;" >
                                        <el-checkbox :value="currentShopIds.length == storeList.length" @change="checkAllHandle">全部</el-checkbox>
                                    </div>
                                    <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <el-button @click="handleDownload" class="bottom" type="success" plain>导出</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_micard_id" :data="dataList||[]" @select="handleSellect" @select-all="handleSellectAll">
                    <my-table-cell align="center" label="序号" width="100" prop="index">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.page-1)*queryEntity.pagesize+ row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="所属门店" prop="sv_us_name"></my-table-cell>
                    <my-table-cell label="房台区域" prop="sv_region_name"></my-table-cell>
                    <my-table-cell label="餐台桌号" prop="sv_table_name"></my-table-cell>
                    <my-table-cell label="订单笔数" prop="order_num"></my-table-cell>
                    <my-table-cell label="消费人数" prop="sv_person_num"></my-table-cell>
                    <my-table-cell align="right" label="销售金额" prop="order_receivable">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.order_receivable,2)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="right" label="人均消费" prop="person_avg">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.person_avg,2)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="right" label="桌平均消费" prop="table_avg">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.table_avg,2)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" width="10">
                        <!-- 操作 -->
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <div class="summary">
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './tableReport.scss';
</style>
<script src="./tableReport.js"></script>

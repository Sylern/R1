
<template>
    <main class="procurement-Main">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="[queryEntity.start_date, queryEntity.end_date]" @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.uids" multiple collapse-tags filterable clearable placeholder="选择门店" @change="storeChangeHandle">
                                <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;">
                                    <el-checkbox :value="queryEntity.uids.length == storeList.length" @change="checkAllStoreHandle">全部</el-checkbox>
                                </div>
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">供应商：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.suids" :disabled="queryEntity.uids.length != 1" multiple filterable collapse-tags clearable placeholder="选择供应商" @change="handleSearch">
                                <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;">
                                    <el-checkbox :value="queryEntity.suids.length == suppliers.length" @change="checkAllSupplierHandle">全部</el-checkbox>
                                </div>
                                <el-option v-for="item in suppliers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_micard_id" :data="dataList||[]" @select="handleSellect" @select-all="handleSellectAll">
                    <my-table-cell align="center" label="序号" width="100" prop="index">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.Page-1)*queryEntity.PageSize+ row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="供应商编号" prop="sv_supplier_code"></my-table-cell>
                    <my-table-cell align="center" label="供应商名称" prop="sv_suid_name"></my-table-cell>
                    <my-table-cell align="center" label="采购数量" prop="enter_num"></my-table-cell>
                    <my-table-cell align="center" label="采购金额" prop="enter_money"></my-table-cell>
                    <my-table-cell align="center" label="退货数量" prop="out_num"></my-table-cell>
                    <my-table-cell align="center" label="退货金额" prop="out_money"></my-table-cell>
                    <my-table-cell align="center" label="赠送数量" prop="give_num"></my-table-cell>
                    <!-- <my-table-cell align="center" label="税额" prop="sv_person_num"></my-table-cell>
                    <my-table-cell align="center" label="不含税金额" prop="sv_person_num"></my-table-cell> -->
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary">
                    <!--<span>销售金额汇总：</span>
                    <label>{{this.summaryData.totalMoney}}</label>
                    <span>退款提成汇总：</span>
                    <label>{{this.summaryData.totalRefundMoney}}</label>
                    <span>提成/业绩汇总：</span>
                    <label>{{this.summaryData.totalCalcMoney}}</label>-->
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.Page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './procurement.scss';
</style>
<script src="./procurement.js"></script>

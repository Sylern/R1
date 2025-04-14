
<template>
    <main class="sale-Main">
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
                            <el-select v-model="queryEntity.ids" filterable multiple collapse-tags clearable placeholder="选择门店" @change="handleSearch">
                                <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;">
                                    <el-checkbox :value="queryEntity.ids.length == storeList.length" @change="checkAllStoreHandle">全部</el-checkbox>
                                </div>
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <gridManager :option="gridOption" ref="gridmanager"></gridManager>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <div class="summary">
                    <!--<span>销售金额汇总：</span>
                    <label>{{summaryData.totalMoney}}</label>
                    <span>退款提成汇总：</span>
                    <label>{{summaryData.totalRefundMoney}}</label>
                    <span>提成/业绩汇总：</span>
                    <label>{{summaryData.totalCalcMoney}}</label>-->
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.Page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './sale.scss';
</style>
<style lang="scss" >
.sale-Main {
    [grid-manager] {
        width: auto;
    }
    .table-wrap.gridManagerTable {
        &.disable-line tr td,
        &.disable-line tr th {
            border-right-color: #ebeef5;
        }
        thead {
            tr {
                &:first-child {
                    th {
                        border-top: none;
                    }
                }
                th {
                    border-top: var(--gm-border);
                    min-width: 100px;
                    .th-wrap {
                        padding: 6px;
                    }
                }

                &:first-child {
                    th:nth-child(2) {
                        min-width: 110px;
                    }
                    th:nth-child(1) {
                        min-width: 50px;
                    }
                }
            }
        }
        .gm-ready {
            thead {
                tr:nth-child(2) {
                    th {
                        &:nth-child(1),
                        &:nth-child(8),
                        &:nth-child(12),
                        &:nth-child(16) {
                            min-width: 130px;
                        }
                    }
                }
            }
        }
    }
    .table-wrap {
        --gm-remind-icon-color: rgba(var(--main-theme-color), 1);;
        .gm-remind-action {
            right: 4px;
            left: initial;
            .ra-icon {
                opacity: 1;
                cursor: pointer;
            }
        }
        tr {
            td {
                padding: 11px 6px;
                &:nth-child(1) {
                    min-width: 50px;
                }
            }
        }
    }
}
</style>
<script src="./sale.js"></script>

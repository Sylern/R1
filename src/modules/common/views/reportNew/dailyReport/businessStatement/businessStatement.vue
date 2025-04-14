<!-- 营业报表 -->
<template>
    <div class="businessStatement">
        <report-filter :filterable="filterable" @search="handleSearch" @reset="handleReset"></report-filter>
        <div class="contentWrap">
            <div class="req_table">
                <div class="tableBox SheetTable">
                    <gridManager :option="gridOption" :callback="callback" ref="gridmanager"></gridManager>
                </div>
                <div class="pageWrap" v-if="total > 0">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./businessStatement.js"></script>
<style lang="scss">
.businessStatement {
    [grid-manager] {
        width: auto;
    }
    .table-wrap.gridManagerTable {
        .table-header {
            background-color: rgba($color: #f4f6f9, $alpha: 0.3);
        }
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
                    min-width: 110px;
                }
                &:first-child {
                    th:nth-child(1) {
                        min-width: 80px;
                    }
                }
            }
        }
    }
    .table-wrap {
        --gm-remind-icon-color: rgba(var(--main-theme-color), 1);
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
                min-width: 110px;
                &:nth-child(1) {
                    min-width: 80px;
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
@import './businessStatement.scss';
</style>
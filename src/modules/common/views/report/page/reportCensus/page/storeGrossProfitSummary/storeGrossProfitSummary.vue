<template>
    <main class="storeGrossProfitSummary-Main">
        <div class="rep_query">
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="bottom" @click="handleSetType(2)" :class="{ active: queryEntity.date_type===2 }">
                        <span>按月</span>
                        <el-date-picker v-model="queryEntity.date" type="month" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
                    </div>

                    <div class="bottom" @click="handleSetType(1)" :class="{ active: queryEntity.date_type===1 }">
                        <span>按年</span>
                        <el-date-picker v-model="queryEntity.date" type="year" value-format="yyyy-MM-dd" :clearable="false"> </el-date-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.u_list" @change="handleChangeUList" :multiple="queryEntity.date_type===2" :collapse-tags="queryEntity.date_type===2" placeholder="请选择">
                                <el-option v-for="item in storeListAll" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <el-button v-repeatClick @click="handleDownload" class="bottom" type="success" plain>导出</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <myTable ref="myTable" rowKey="id" :data="tableJson">
                    <my-table-cell label="序号" prop="序号" width="60" align="center">
                        <template v-slot:default="scope">
                            <span>{{(queryEntity.page-1)*queryEntity.pagesize + scope.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell v-for="item in tableHeader" :key="item.name" :label="item.name" :prop="item.value"></my-table-cell>
                </myTable>
            </div>
            <div class="pageWrap">
                <el-pagination @current-change="index=>{handleCurrentSize(index,'current')}" @size-change="index=>{handleCurrentSize(index,'size')}" :current-page="queryEntity.PageIndex" :page-sizes="[10,20,30,40,50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 重复下载提示 -->
        <el-dialog title="提示" center :visible.sync="dialogDownloadRepeatVisible" class="repeatDialog">
            <div class="dialogContent">
                <div class="tips">
                    <span>检测到同样条件的导出申请（<label>下载流水号：{{repeatInfo.code}}</label>）</span>
                    <div class="line">请在点击确定下载</div>
                </div>
                <div class="btn" v-repeatClick @click="repeatDownloadEnter">
                    <span>确定</span>
                </div>
            </div>
        </el-dialog>
    </main>
</template>
<style lang="scss" scoped>
@import './storeGrossProfitSummary.scss';
</style>
<style lang="scss">
.storeGrossProfitSummary-Main {
    .rep_query {
        .rep_q_bottom {
            .bottom {
                .el-date-editor {
                    input {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
<script src="./storeGrossProfitSummary.js"></script>

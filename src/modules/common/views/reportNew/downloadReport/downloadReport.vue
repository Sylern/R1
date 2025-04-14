
<template>
    <main class="downloadReport-Main">
        <!-- <div class="rep_query">
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.ShopIds" placeholder="请选择">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">员工：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.EmployeeId" placeholder="请选择">
                                <el-option v-for="item in staffList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="dateTime" @change="handleChangeTime" needTimePicker></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <el-button @click="handleEmpty" class="bottom" type="warning" plain>清空</el-button>
                        <el-button @click="handleSearch" class="bottom" type="primary" plain>搜索</el-button>
                        <el-button @click="handleDownload" class="bottom" type="success" plain>下载报表</el-button>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="req_table">
            <div class="tableBox SheetTable">
                <myTable ref="myTable" rowKey="id" :data="dataList">
                    <my-table-cell label="序号" prop="序号" width="60" align="center">
                        <template v-slot:default="scope">
                            <span>{{(queryEntity.Page-1)*queryEntity.PageSize + scope.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="导出时间" prop="sv_created_date" width="200"></my-table-cell>
                    <my-table-cell label="操作员" prop="sv_download_by_name" width="200"></my-table-cell>
                    <my-table-cell label="流水号" prop="sv_excel_code"></my-table-cell>
                    <my-table-cell label="文件描述" prop="sv_business_name" align="center"></my-table-cell>
                    <my-table-cell label="状态" prop="sv_effective_name" align="center"></my-table-cell>
                    <my-table-cell label="结果下载" prop="sv_effective_type" width="150" align="center">
                        <template v-slot:default="scope">
                            <span class="item btnDownload" v-if="scope.sv_effective_type === 1">报表生成中</span>
                            <span class="item btnDownload" v-if="scope.sv_effective_type == 2" @click="handleDownload(scope.index)">点击下载</span>
                            <span class="item" v-if="scope.sv_effective_type === 3">已经过期</span>
                            <span class="item" v-if="scope.sv_effective_type === 4">下载失败</span>
                            <span class="item" v-if="scope.sv_effective_type === 5">无数据</span>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="total > 0" class="pageWrap">
                <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange" :current-page="queryEntity.Page" :page-sizes="[10,20,30,40,50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './downloadReport.scss';
</style>
<script src="./downloadReport.js"></script>

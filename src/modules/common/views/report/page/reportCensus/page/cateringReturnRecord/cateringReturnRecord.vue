
<template>
    <main class="cateringReturnRecord-Main">
        <div class="rep_query">
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.user_id" placeholder="请选择">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="dateTime" @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <el-button @click="handleEmpty" class="bottom" type="warning" plain>清空</el-button>
                        <el-button @click="handleSearch" class="bottom" type="primary" plain>搜索</el-button>
                        <el-button @click="handleDownload" class="bottom" type="success" plain>下载报表</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <gridManager :option="gridOption" :callback="callback" ref="gridmanager"></gridManager>
            </div>
            <div class="pageWrap">
                <el-pagination @current-change="index=>{handleCurrentSize(index,'current')}" @size-change="index=>{handleCurrentSize(index,'size')}" :current-page="queryEntity.page" :page-sizes="[10,20,30,40,50]" :page-size="queryEntity.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './cateringReturnRecord.scss';
</style>
<script src="./cateringReturnRecord.js"></script>

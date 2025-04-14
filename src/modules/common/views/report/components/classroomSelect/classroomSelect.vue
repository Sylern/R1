<template>
    <dc-dialog class="classroomSelectWrap system_dialog queryFilter" v-if="dialogVisible" title="选择教室" width="800"
        height="650" @close="closeDialog">
        <div class="searchInput">
            <el-input placeholder="请输入教室名称" v-model="queryEntity.seachStr" @keyup.enter.native="inputSearch"
                @clear="inputSearch" clearable></el-input>
        </div>
        <div class="list">
            <div class="tableBox">
                <myTable ref="courseTable" @select-all="handleSelectAll" @select="handleSellect" rowKey="id" :data="list">
                    <my-table-cell fixed prop="selection" width="40" align="right" v-if="!onlySelect"></my-table-cell>
                    <my-table-cell fixed prop="onlySelected" width="40" align="right" v-else>
                        <template v-slot:default="scope">
                            <el-radio class="radio" v-model="checkedRadio" :label="scope">{{ '' }}</el-radio>
                        </template>
                    </my-table-cell>
                    <my-table-cell fixed label="序号" prop="序号" width="60" align="center">
                        <template v-slot:default="scope">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + scope.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="教室名称" prop="sv_table_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="区域名称" prop="sv_region_name" width="150"></my-table-cell>
                    <my-table-cell label="地址" prop="sv_table_address" showTooltip></my-table-cell>
                </myTable>
            </div>
            <div v-if="total > 0" class="pageWrap">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                    :current-page="queryEntity.pageIndex" :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="queryEntity.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="total"></el-pagination>
            </div>
        </div>
        <div class="btnWrap">
            <el-button @click="closeDialog" class="btnItem btnBasic">取消</el-button>
            <el-button @click="handleSubmit" class="btnItem btnPrimary" v-repeatClick>确定</el-button>
        </div>
    </dc-dialog>
</template>

<script src="./classroomSelect.js"></script>
<style  lang="sass" scoped>
@import "./classroomSelect.scss";
</style>

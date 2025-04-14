
<template>
    <dc-dialog title="选择分类" v-if="dialogVisible" width="480" height="650" @close="closeDialog" class="system_dialog">
        <div class="checkedClassify queryTable">
            <div class="searchInput">
                <el-input @keyup.enter.native="handleSearchRe" v-model="queryEntity.keywards" placeholder="请输入查询名称" clearable>
                    <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="myTable">
                <myTable :data="tableJson" @select-all="handleSelectAll" @select="handleSelect" ref="myTable" rowKey="id">
                    <my-table-cell prop="selection" width="80" align="center"></my-table-cell>
                    <my-table-cell label="分类名称" prop="name"></my-table-cell>
                    <my-table-cell label="分类编码" prop="code"></my-table-cell>
                </myTable>
            </div>
            <div class="pageWrap">
                <el-pagination :total="initEntity.total" @current-change="handleCurrentChange" :current-page="queryEntity.page" :page-size="queryEntity.pagesize" background layout="total, prev, pager, next"></el-pagination>
            </div>
            <div class="foot">
                <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
            </div>
        </div>
    </dc-dialog>
</template>

<style lang="scss" scoped>
@import './checkedClassify.scss';
</style>
<script src="./checkedClassify.js"></script>

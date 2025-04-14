
<template>
    <el-dialog title="选择加料" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="580px" center class="system_dialog">
        <div class="checkedFeeding borderTop queryTable">
            <div class="searchInput">
                <el-input @keyup.enter.native="handleSearchRe" v-model="queryEntity.keywards" placeholder="请输入查询名称" clearable>
                    <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="myTable">
                <myTable :data="tableJson" @select-all="handleSelectAll" @select="handleSelect"  ref="myTable" rowKey="id">
                    <my-table-cell prop="selection" width="80" align="center"></my-table-cell>
                    <my-table-cell label="名称" prop="name"></my-table-cell>
                    <my-table-cell label="价格" prop="priceName"></my-table-cell>
                </myTable>
            </div>
            <div class="pageWrap">
                <el-pagination :total="initEntity.total" @current-change="handleCurrentChange"  :current-page="queryEntity.page"  :page-size="queryEntity.pageSize" background layout="total, prev, pager, next, jumper" ></el-pagination>
            </div>
            <div class="foot">
                <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
@import './checkedFeeding.scss';
</style>
<script src="./checkedFeeding.js"></script>

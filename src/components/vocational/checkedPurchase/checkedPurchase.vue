<template>
    <el-dialog title="选择采购入库单" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" center class="system_dialog">
        <div class="checkedPurchase borderTop">
            <div class="filterWrap queryFrom">
                <div class="item">
                    <div class="key">单据号：</div>
                    <div class="input">
                        <el-input v-model.trim="queryEntity.keywards" @keyup.enter.native="handleSearch" class="inputBasic" placeholder="采购单号">
                            <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="key">供应商：</div>
                    <div class="select">
                        <el-select v-model.trim="queryEntity.supp_id" placeholder="请选择" filterable>
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option v-for="item in supplierNameList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <div class="key">仓库/门店：</div>
                    <div class="input">
                        <el-select v-model.trim="queryEntity.id" placeholder="请选择">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option v-for="item in warehouseNameList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <div class="key">制单日期：</div>
                    <div class="select">
                        <el-date-picker v-model.trim="dateTime" @change="handleChangeTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                    </div>
                </div>
            </div>
            <div class="tablePagin">
                <div class="myTable">
                    <myTable ref="myTable" rowKey="id" :data="tableData">
                        <my-table-cell fixed prop="单选" width="40" align="right">
                            <template v-slot:default="scope">
                                <el-radio class="radio" v-model.trim="checkedRadio" :label="scope.id">{{''}}</el-radio>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="采购单号" prop="sv_pc_noid" width="250">
                            <template v-slot:default="row">
                                <span class="copy" v-copy="row.sv_pc_noid" title="复制">
                                    <i class="el-icon-document-copy"></i>
                                    {{row.sv_pc_noid}}
                                </span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="供应商" prop="sv_suname"></my-table-cell>
                        <my-table-cell label="仓库/门店" prop="sv_targetwarehouse_name"></my-table-cell>
                        <my-table-cell label="制单人" prop="sv_salesman_name"></my-table-cell>
                        <my-table-cell label="制单日期" prop="sv_pc_cdate" width="200" align="center"></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap">
                    <el-pagination @current-change="handleCurrentChange" :page-size="queryEntity.pageSize" background layout="prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
                <div class="foot">
                    <div @click="handleSubmit" class="btnItem btnPrimary">确定</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './checkedPurchase.scss';
</style>
<script src="./checkedPurchase.js"></script>
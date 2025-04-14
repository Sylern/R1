<template>
    <el-dialog title="选择单据" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" center class="system_dialog">
        <div class="checkedBill borderTop">
            <div class="filterWrap queryFrom">
                <div class="item">
                    <div class="key">单据编号：</div>
                    <div class="input">
                        <el-input v-model.trim="queryEntity.keywards" class="inputBasic" placeholder="单据编号"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="key">制单日期：</div>
                    <div class="select">
                        <date-time-picker @change="handleChangeTime"></date-time-picker>
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
                        <my-table-cell label="单据编号" prop="sv_pc_noid" width="280">
                            <template v-slot:default="row">
                                <span class="copy" v-copy="row.sv_pc_noid" title="复制">
                                    <i class="el-icon-document-copy"></i>
                                    {{row.sv_pc_noid}}
                                </span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="订单来源" prop="sv_suname_warehouseName"></my-table-cell>
                        <my-table-cell label="应付金额" prop="sv_pc_combined"></my-table-cell>
                        <my-table-cell label="已付金额" prop="sv_pc_realpay"></my-table-cell>
                        <my-table-cell label="入库状态" prop="sv_pc_statestr"></my-table-cell>
                        <my-table-cell label="制单日期" prop="sv_pc_cdate"></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap">
                    <el-pagination @current-change="handleCurrentChange" :page-size="queryEntity.pagesize" background layout="prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
                <div class="foot">
                    <div @click="handleSubmit" class="btnItem btnPrimary">确定</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './checkedBill.scss';
</style>
<script src="./checkedBill.js"></script>
<template>
    <div>
        <el-dialog title="未盘商品列表" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="920px" center class="unCheckedStocktaking system_dialog">
            <div class="tablePagin queryTable">
                <div class="searchInput">
                    <el-input :placeholder="'请输入商品名称/'+$store.state.userInfo.goodsCode_charact" clearable @clear="getNotStoreStockCheckProductInfo" @keyup.enter.native="getNotStoreStockCheckProductInfo" v-model.trim="queryNotStore.keywards">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
                <div class="myTable">
                    <myTable ref="myTable" rowKey="id" :data="notStoreList" @select-all="notStoreHandleSelectAll" @select="notStoreHandleSelect">
                        <my-table-cell prop="selection" width="50" v-if="isContent"></my-table-cell>
                        <my-table-cell fixed label="序号" prop="序号" width="60" align="center">
                            <template v-slot:default="scope">
                                <span>{{(queryNotStore.page-1)*queryNotStore.pageSize + scope.index+1}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell :label="$store.state.userInfo.goodsCode_charact" prop="sv_p_barcode">
                            <template v-slot:default="scope">
                                <div v-copy="scope.sv_p_barcode">
                                    <i class="el-icon-document-copy"></i>
                                    <span>{{scope.sv_p_barcode}}</span>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="商品名称" prop="sv_p_name"></my-table-cell>
                        <my-table-cell label="库存" prop="sv_p_storage"></my-table-cell>
                        <my-table-cell label="规格" prop="sv_p_specs"></my-table-cell>
                        <my-table-cell label="单位" prop="sv_p_unit"></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap" v-if="queryNotStoreTotal">
                    <el-pagination @current-change="notStoreHandleCurrentChange" :page-size="queryNotStore.pagesize" background layout="prev, pager, next, jumper" :total="queryNotStoreTotal"></el-pagination>
                </div>
                <div class="foot" v-if="queryNotStoreTotal">
                    <div class="btnItem btnBasic" v-repeatClick @click="handleNotDiskExport">导出未盘商品</div>
                    <div class="btnItem btnPrimary" v-if="isContent" @click="notStoreHandleSubmit(0)">加入盘点</div>
                    <div class="btnItem btnPrimary" v-else @click="handleBack">返回</div>
                    <div class="btnItem btnPrimary" @click="notStoreHandleSubmit(1)">审核</div>
                    <div class="btnItem btnPrimary" v-if="shwoClearBtn" @click="notStoreHandleSubmit(2)">审核并清空未盘商品</div>
                    <!-- <div class="btnItem btnPrimary" v-if="JurisdictionObj.BatchnumberZeroExamine" @click="notStoreHandleSubmit(2)">审核并清空未盘商品</div> -->
                </div>
                <div class="foot" v-else style="padding-top: 30px;">
                    <div class="btnItem btnPrimary" @click="handleBack">返回</div>
                    <div class="btnItem btnPrimary" @click="notStoreHandleSubmit(1)">审核</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="请输入密码" :append-to-body="true" :close-on-click-modal="false" :visible.sync="pswVisible" width="400px" top="calc(50vh - 150px)" center class="pswWrap system_dialog">
            <div class="pswContent">
                <el-input type="password" v-model.trim="pswText"></el-input>
                <div class="btnWrap">
                    <div class="btnItem btnPrimary" @click="pswSubmit()">确定</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scope>
@import './unCheckedStocktaking.scss';
</style>
<script src="./unCheckedStocktaking.js"></script>

<template>
    <el-dialog title="选择原料" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" center class="system_dialog">
        <div class="checkedCommodity borderTop">
            <div class="left">
                <el-scrollbar style="height:100%;width:100%">
                    <div v-for="item in classJson" :key="item.id" class="dl">
                        <div @click="handleClass({item,type:'one'})" class="title">
                            <div :class="{active:checkedClass[0]===item.id && checkedClass.length===1}">{{item.name}}</div>
                            <i v-if="!$app.isNull(item.children)" :class="[item.isCheck?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
                        </div>
                        <div v-if="item.isCheck" class="dd">
                            <dd @click="handleClass({item:itm,type:'two'})" v-for="itm in item.children" :key="itm.id" :class="{active:checkedClass[1]===itm.id && checkedClass.length===2}">{{itm.name}}</dd>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="right tablePagin queryTable">
                <div class="right_top searchInput">
                    <el-input @keyup.enter.native="handleSearchRe" v-model.trim="queryEntity.keywards" placeholder="请输入搜索名称或条码" clearable>
                        <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
                <div class="myTable">
                    <myTable ref="myTable" rowKey="product_id" :data="tableData" @select-all="handleSelectAll" @select="handleSelect">
                        <my-table-cell prop="selection" width="50" align="right"></my-table-cell>
                        <my-table-cell label="原料条码" prop="sv_p_barcode" width="150">
                            <template v-slot:default="row">
                                <span class="copy" v-copy="row.sv_p_barcode" title="复制">
                                    <i class="el-icon-document-copy"></i>
                                    {{row.sv_p_barcode}}
                                </span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="原料名称" prop="sv_p_name" width="200" showTooltip></my-table-cell>
                        <my-table-cell label="单位" prop="sv_p_unit" showTooltip></my-table-cell>
                        <my-table-cell label="进货价" prop="sv_purchaseprice"></my-table-cell>
                        <my-table-cell label="销售单价" prop="sv_p_unitprice"></my-table-cell>
                        <my-table-cell label="库存" prop="sv_p_storage_weight"></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap">
                    <el-pagination @current-change="e=>{handlePagination(e,'current')}" @size-change="e=>{handlePagination(e,'size')}" :current-page="queryEntity.page" :page-size="queryEntity.pagesize" background layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
                <div class="foot">
                    <div class="txt">
                        <span >已选{{checkedJson.length}}个商品</span>
                    </div>
                    <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
@import './checkedMaterial.scss';
</style>
<script src="./checkedMaterial.js"></script>

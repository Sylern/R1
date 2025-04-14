<!--已下秤商品-->
<template>
    <div class="goodsSetting" v-if="dialogVisible">
        <dc-dialog width="12" height="6.6" title="已下秤商品" @close="closeDialog">
            <div class="gsContentWrap">
                <div class="filterWrap">
                    <el-input class="inputWrap" ref="searchText" v-model.trim="query.keyword" :placeholder="'请输入'+$store.state.userInfo.goodsCode_charact+'或PLU码搜索下称商品'" @keyup.native.enter="handleSearch">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
                    </el-input>
                    <div class="btnItem btnPrimary small" @click="addGoods">添加商品</div>
                    <div class="btnItem btnPrimary small" @click="goodsSetting">下发商品</div>
                </div>
                <div class="tableWrap queryTable">
                    <div class="tableBox">
                        <myTable ref="myTable" rowKey="id" :data="tableData">
                            <my-table-cell label="序号" prop="序号" width="80" align="center">
                                <template v-slot:default="row">
                                    <span>{{(query.page-1)*query.pagesize + row.index+1}}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="PLU码" prop="sv_scale_product_plu" width="150" showTooltip>
                                <template v-slot:default="row">
                                    <el-input v-model.trim="row.sv_scale_product_plu" maxlength="4" @keyup.native.stop="pluChange($event, row.index)"></el-input>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="商品名称" prop="sv_p_name" width="150" showTooltip></my-table-cell>
                            <my-table-cell :label="$store.state.userInfo.goodsNumber_charact" prop="sv_p_artno" align="center"></my-table-cell>
                            <my-table-cell label="商品售价" prop="sv_p_unitprice" align="center"></my-table-cell>
                            <my-table-cell label="质保天数" prop="sv_guaranteeperiod" align="center"></my-table-cell>
                        </myTable>
                    </div>
                    <div v-if="tableData.length>0" class="pageWrap">
                        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                    </div>
                </div>
                <div class="btnSure" @click="handleSure">确定</div>
            </div>
        </dc-dialog>
        
        <checkedCommodity :visible.sync="isCheckedCommodity" :dataJson="checkedCommodity" :isScaleType="true" @callback="getCheckedCommodity"></checkedCommodity>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsSetting.scss';
</style>
<script src="./goodsSetting.js"></script>
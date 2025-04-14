<template>
    <el-dialog :title="title" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="1000px" center class="system_dialog">
        <div class="checkedSeckill borderTop">
            <div class="left">
                <el-scrollbar style="height:100%;width:100%">
                    <div v-for="item in showClassData" :key="item.id" class="dl">
                        <div @click="handleClass(item,'one')" class="title">
                            <div :class="{active:checkedOneId===item.id && checkedTowId.length<1}">{{item.label}}</div>
                            <i v-if="item.children.length>0" :class="[item.isCheck?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
                        </div>
                        <div v-if="item.isCheck" class="dd">
                            <dd @click="handleClass(itm,'two')" v-for="itm in item.children" :key="itm.id" :class="{active:checkedTowId===itm.id}">{{itm.label}}</dd>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="right tablePagin queryTable">
                <div class="right_top searchInput" :class="{isProductAdd:isProductAdd}">
                    <div v-if="isProductAdd" @click="handleRoute('/product/productEntryAdd')" class="btnItem btnPrimary">新增商品</div>
                    <el-input :placeholder="'请输入商品名称/'+$store.state.userInfo.goodsCode_charact" clearable @change="handleSearchRe" v-model.trim="keywards">
                        <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
                <div class="myTable">
                    <myTable ref="myTable" rowKey="product_id" :data="tableData" @select-all="handleSelectAll" @select="handleSelect">
                        <my-table-cell prop="selection" width="50" v-if="!isRadio" align="right"></my-table-cell>
                        <my-table-cell fixed prop="单选" width="50" align="right" v-else>
                            <template v-slot:default="scope">
                                <el-radio class="radio" v-model.trim="checkedRadio" :label="scope.product_id">{{''}}</el-radio>
                            </template>
                        </my-table-cell>
                        <my-table-cell :label="$store.state.userInfo.goodsCode_charact" prop="sv_p_barcode" width="150">
                            <template v-slot:default="row">
                                <span class="copy" v-copy="row.sv_p_barcode" title="复制">
                                    <i class="el-icon-document-copy"></i>
                                    {{row.sv_p_barcode}}
                                </span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="商品名称" prop="sv_p_name" width="200" showTooltip></my-table-cell>
                        <my-table-cell label="参考进价" v-if="jurisdiction" prop="sv_pc_price"></my-table-cell>
                        <my-table-cell label="零售价" v-if="isUnitprice" prop="sv_p_unitprice"></my-table-cell>
                        <my-table-cell label="库存" prop="sv_p_storage" v-if="showStock"></my-table-cell>
                        <my-table-cell label="规格" prop="sv_p_specs" width="100" align="center" showTooltip></my-table-cell>
                        <my-table-cell label="单位" prop="sv_p_unit" align="center" showTooltip></my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,40,50]" :page-size="pagesize" background :layout="importPageSize>0?'total':'total, sizes,prev, pager, next, jumper'" :total="total"></el-pagination>
                </div>
                <div class="foot">
                    <div class="txt">
                        <span v-if="!isRadio">已选{{checkedJson.length}}个商品</span>
                    </div>
                    <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './checkedSeckill.scss';
</style>
<script src="./checkedSeckill.js"></script>
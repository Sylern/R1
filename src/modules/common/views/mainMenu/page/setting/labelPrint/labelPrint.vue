
<template>
    <div class="labelPrint-wrap">
        <div class="contentWrap">
            <div class="lP_left">
                <div class="titleLabel">打印设置</div>
                <div class="lPl_dl">
                    <div class="lPl_name">打印模板</div>
                    <div @click="handleOpenPage" class="lPl_add">新建模板</div>
                </div>
                <div class="lPl_checkTemp">
                    <div v-if="$app.isNull(printData.checkedLabelTemplate)" @click="isLabelTemplateList=!isLabelTemplateList" class="checkTemp">
                        <i class="el-icon-plus"></i>
                        <div class="lPlCheckName">选择模板</div>
                    </div>
                    <div v-else class="showTemp" @click="isLabelTemplateList=!isLabelTemplateList">
                        <el-scrollbar style="height:100%;width:100%">
                            <labelTemplate :item="printData.checkedLabelTemplate"></labelTemplate>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="lPl_dl padding">
                    <div class="lPl_name">打印机</div>
                </div>
                <div class="lPl_select">
                    <el-select v-model.trim="printData.printName" placeholder="请选择打印机">
                        <el-option v-for="item in printDevice" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </div>
                <div class="lPl_dl padding">
                    <div class="lPl_name">纸张类型</div>
                </div>
                <div class="lPl_select">
                    <el-select v-model.trim="printData.paperType" placeholder="请选择纸张类型">
                        <el-option label="标签热敏纸（默认）" value="1"></el-option>
                    </el-select>
                </div>
                <div class="lPl_dl padding">
                    <div class="lPl_name">多列打印</div>
                </div>
                <div class="lPl_select">
                    <el-select v-model.trim="printData.labelColumn" placeholder="请选择每行标签数量">
                        <el-option label="1" :value="1"></el-option>
                        <el-option label="4" :value="4"></el-option>
                    </el-select>
                </div>
            </div>

            <div class="lP_right">
                <div class="filterWrap queryFilter">
                    <div class="left">
                        <div @click="isCheckedProducts=!isCheckedProducts" class="btnItem">选择商品</div>
                        <div @click="isQuotationNo=!isQuotationNo" type="btnItem" class="btnItem">引用单号</div>
                        <el-button :disabled="$app.isNull(checkedJson)" @click="hanldeDelete" class="btnItem">批量移除</el-button>
                    </div>
                    <div class="right searchInput">
                        <el-input v-model.trim="scanProduct" @keyup.enter.native="handleAddProd" clearable :placeholder="'扫描'+$store.state.userInfo.goodsCode_charact">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                </div>

                <div class="tableWrap">
                    <div class="tableBox">
                        <myTable ref="labelPrintEntry" rowKey="product_id" @select-all="handleSelectAll" @select="handleSellect" :data="showData">
                            <template v-slot:empty>
                                <span>暂无待打印商品，请</span>
                                <span @click="isCheckedProducts=!isCheckedProducts" class="clickAdd">添加商品</span>
                                <span>之后再打印</span>
                            </template>
                            <my-table-cell fixed prop="selection" width="40" align="right"></my-table-cell>
                            <my-table-cell fixed label="序号" prop="序号" width="40" align="center">
                                <template v-slot:default="row">
                                    <span>{{(query.page-1)*query.pageSize + row.index+1}}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="待打印商品" prop="sv_p_name" width="150"></my-table-cell>
                            <my-table-cell label="规格" prop="sv_p_specs"></my-table-cell>
                            <template>
                                <my-table-cell label="零售价" prop="sv_p_unitprice">
                                    <template v-slot:default="row">
                                        <span>{{$app.moneyFixed(row.sv_p_unitprice,2)}}</span>
                                    </template>
                                </my-table-cell>
                            </template>
                            <my-table-cell label="库存" prop="sv_p_storage" align="center"></my-table-cell>
                            <my-table-cell label="打印份数(默认可受库存数)" prop="num" width="200" align="center">
                                <template v-slot:header>
                                    <el-checkbox v-model.trim="isCheckPrintNumber" @change="handleChange" class="checkPrintNumber" ref="checkPrintNumber" key="checkPrintNumber">打印份数
                                        <el-tooltip content="默认可售库数" class="toopltipItem" effect="dark" placement="top-start">
                                            <i class="el-icon-question icon-po"></i>
                                        </el-tooltip>
                                    </el-checkbox>
                                </template>
                                <template v-slot:default="row">
                                    <el-input-number v-model.trim="tableJson[(query.page-1)*query.pageSize + row.index].num" :min="0" size="small"></el-input-number>
                                </template>
                            </my-table-cell>
                            <my-table-cell fixed="right" label="操作" prop="handle" width="80" align="center">
                                <template v-slot:default="row">
                                    <el-button @click="handleDelete(row)" type="text" size="small">移除</el-button>
                                </template>
                            </my-table-cell>
                        </myTable>
                    </div>
                    <div v-if="tableJson.length>0" class="pageWrap">
                        <span>批量打印</span>
                        <el-input-number v-model.trim="printNumber" class="tableNumber" size="small"></el-input-number>
                        <template>
                            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomWrap">
            <el-popconfirm class="span" @confirm="handleEmpty" title="是否清除全部需要打印的商品？">
                <div slot="reference" class>
                    <el-button :disabled="$app.isNull(tableJson)" class="btnItem">清空商品</el-button>
                </div>
            </el-popconfirm>

            <div @click="handlePrint" class="btnItem">确认打印</div>
        </div>

        <!-- 标签模板选择 -->
        <labelTemplateList :visible.sync="isLabelTemplateList" @callback="handleCallbackLabelTemplateList"></labelTemplateList>
        <!-- 选择商品 -->
        <checkedCommodity :visible.sync="isCheckedProducts" :jurisdiction="$store.state.JurisdictionObj.Sv_purchaseprice" :isUnitprice="$store.state.JurisdictionObj.Sv_p_unitprice" @callback="handleCallbackCheckedProducts" :dataJson="[...tableJson]"></checkedCommodity>
        <!-- 选中单号 -->
        <quotationNo :dataJson="quotationNoJson" :visible.sync="isQuotationNo" @callback="handleQuotationNo"></quotationNo>
    </div>
</template>

<style lang="scss" scope>
@import './labelPrint.scss';
</style>
<script src="./labelPrint.js"></script>

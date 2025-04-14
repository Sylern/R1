<template>
    <dc-dialog v-if="dialogVisible" :z-index="zIndex" width="1200" height="680" :title="title" @close="closeDialog">
        <div class="popCheckedCommodity borderTop">
            <div class="popLeft">
                <el-scrollbar ref="menuLeft" style="height:100%; width:100%">
                    <div v-for="item in showClassData" :key="item.id" class="menuWrap">
                        <div @click="handleClass(item,'one')" class="menuItem">
                            <div class="text" :class="{active: checkedOneId === item.id && checkedTowId.length < 1 }">{{ item.label }}</div>
                            <i v-if="item.children.length>0" :class="[item.isCheck?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
                        </div>
                        <div v-if="item.isCheck" class="subItem">
                            <div class="subText" @click="handleClass(itm,'two')" v-for="itm in item.children" :key="itm.id" :class="{ active:checkedTowId === itm.id }">{{itm.label}}</div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="popRight queryTable">
                <div class="right_top searchInput" :class="{isProductAdd:isProductAdd}">
                    <div v-if="isProductAdd" @click="handleRoute('/product/productEntryAdd')" class="btnItem btnPrimary">新增商品</div>
                    <el-input :placeholder="'请输入商品名称/'+$store.state.userInfo.goodsCode_charact" clearable @change="handleSearchRe" v-model.trim="keywards">
                        <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
                <div class="popTable">
                    <el-table :data="tableData" style="width: 100%;" height="100%" @row-click="handleRow">
                        <!-- <el-table-column fixed type="selection" width="50" align="center"></el-table-column> -->
                        <el-table-column prop="selection" width="50" v-if="!isRadio" align="center">
                            <template slot="header" slot-scope="scope">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleSelectAll">
                                    <span v-if="scope.$index !== 0"></span>
                                </el-checkbox>
                            </template>
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.rowChecked" @change="handleSelect(scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="单选" width="50" align="right" v-else>
                            <template v-slot:default="scope">
                                <el-radio class="radio" v-model.trim="checkedRadio" :label="scope.row.product_id">{{''}}</el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$store.state.userInfo.goodsCode_charact" prop="sv_p_barcode" width="150">
                            <template v-slot:default="scope">
                                <el-tooltip effect="dark" placement="top" :content="scope.row.sv_p_barcode" class="etr_tooltip">
                                    <span class="copy" v-copy="scope.row.sv_p_barcode" title="复制">
                                        <i class="el-icon-document-copy"></i>
                                        <label>{{scope.row.sv_p_barcode}}</label>
                                    </span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="" prop="sv_pc_img" width="50">
                            <template v-slot:default="scope">
                                <div class="img_cell" @click.stop="">
                                    <el-image :src="scope.row.image[0]" :preview-src-list="scope.row.image"> </el-image>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="sv_p_name" width="200">
                            <template v-slot:default="scope">
                                <el-tooltip effect="dark" placement="top" :content="scope.row.sv_p_name" class="etr_tooltip">
                                    <span>{{scope.row.sv_p_name}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考进价" v-if="jurisdiction" prop="sv_pc_price">
                            <template v-slot:default="scope">
                                <span>{{ commodityType.type !='rawMaterial'? scope.row.sv_pc_price : scope.row.sv_purchaseprice}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="零售价" v-if="isUnitprice && commodityType.type !='rawMaterial'" prop="sv_p_unitprice"></el-table-column>
                        <el-table-column label="库存" prop="sv_p_storage" v-if="showStock">
                            <template v-slot:default="scope">
                                <span v-if="commodityType.type !=='rawMaterial'">{{ scope.row.sv_p_storage }}</span>
                                <span v-else>{{ scope.row[scope.row.sv_pricing_method == 0 ? 'sv_p_storage' : 'sv_p_total_weight'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格" prop="sv_p_specs" width="100" align="center">
                            <template v-slot:default="scope">
                                <el-tooltip v-if="scope.row.sv_p_specs" effect="dark" placement="top" :content="scope.row.sv_p_specs" class="etr_tooltip">
                                    <span>{{scope.row.sv_p_specs}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="sv_p_unit" align="center"></el-table-column>
                    </el-table>
                    <!-- <myTable ref="myTable" rowKey="id" :data="tableData" @select-all="handleSelectAll" @select="handleSelect">
                        <my-table-cell prop="selection" width="50" v-if="!isRadio" align="right"></my-table-cell>
                        <my-table-cell fixed prop="单选" width="50" align="right" v-else>
                            <template v-slot:default="scope">
                                <el-radio class="radio" v-model.trim="checkedRadio" :label="scope.product_id">{{''}}</el-radio>
                            </template>
                        </my-table-cell>
                        <my-table-cell :label="$store.state.userInfo.goodsCode_charact" prop="sv_p_barcode" width="150">
                            <template v-slot:default="row">
                                <el-tooltip effect="dark" placement="top" :content="row.sv_p_barcode" class="etr_tooltip">
                                    <span class="copy" v-copy="row.sv_p_barcode" title="复制">
                                        <i class="el-icon-document-copy"></i>
                                            {{row.sv_p_barcode}}
                                    </span>
                                </el-tooltip>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="" prop="sv_pc_img" width="60">
                            <template v-slot:default="row">
                                <div class="img_cell" @click.stop="()=>{return false}">
                                    <el-image :src="row.image[0]" :preview-src-list="row.image"> </el-image>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="商品名称" prop="sv_p_name" width="200" showTooltip></my-table-cell>
                        <my-table-cell label="参考进价" v-if="jurisdiction" prop="sv_pc_price">
                            <template v-slot:default="row">
                            {{ commodityType.type !='rawMaterial'? row.sv_pc_price:row.sv_purchaseprice}}
                            </template>
                        </my-table-cell>
                        <my-table-cell label="零售价" v-if="isUnitprice && commodityType.type !='rawMaterial'" prop="sv_p_unitprice"></my-table-cell>
                        <my-table-cell label="库存" prop="sv_p_storage" v-if="showStock">
                            <template v-slot:default="row">
                                {{ commodityType.type !='rawMaterial'?row.sv_p_storage: row[row.sv_pricing_method==0?'sv_p_storage':'sv_p_total_weight']}}
                            </template>
                        </my-table-cell>
                        <my-table-cell label="规格" prop="sv_p_specs" width="100" align="center" showTooltip></my-table-cell>
                        <my-table-cell label="单位" prop="sv_p_unit" align="center" showTooltip></my-table-cell>
                    </myTable> -->
                </div>
                <div class="popPageWrap">
                    <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-sizes="[10,20,30,40,50]" :page-size="pagesize" :layout="importPageSize>0?'total':'total, sizes,prev, pager, next, jumper'" :total="total"></el-pagination>
                </div>
                <div class="popBottom">
                    <div class="txt">
                        <span v-if="!isRadio">已选{{checkedJson.length}}个商品</span>
                    </div>
                    <div class="btnItem btnPrimary" @click="handleSubmit">确定</div>
                </div>
            </div>
        </div>
    </dc-dialog>
    <!-- <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogVisible" width="1200px" center class="system_dialog">
    </el-dialog> -->
</template>

<style lang="scss" scope>
@import './checkedCommodity.scss';
</style>
<script src="./checkedCommodity.js"></script>
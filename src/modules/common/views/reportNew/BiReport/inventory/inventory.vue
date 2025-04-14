
<template>
    <main class="inventory-Main">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.u_id" multiple collapse-tags clearable filterable placeholder="选择门店" @change="storeChangeHandle">
                                <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;">
                                    <el-checkbox :value="queryEntity.u_id.length == storeList.length" @change="checkAllStoreHandle">全部</el-checkbox>
                                </div>
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">类别：</div>
                        <div class="rep_qbfi_label">
                            <el-cascader :disabled="queryEntity.u_id.length !== 1" v-model="pIds" :options="categorys" :props="props" placeholder="选择类别" clearable collapse-tags @change="categoryChangeHandle"></el-cascader>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">品牌：</div>
                        <div class="rep_qbfi_label">
                            <el-select :disabled="queryEntity.u_id.length !== 1" filterable multiple v-model="queryEntity.b_ids" clearable collapse-tags placeholder="选择品牌" @change="brandChangeHandle">
                                <div style="width: 100%; box-sizing: border-box; padding: 10px 20px;">
                                    <el-checkbox :value="queryEntity.b_ids.length == brandList.length" @change="checkAllBrandHandle">全部</el-checkbox>
                                </div>
                                <el-option v-for="item in brandList" :key="item.id" :label="item.sv_brand_name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_micard_id" :data="dataList||[]" @select="handleSellect" @select-all="handleSellectAll">
                    <my-table-cell align="center" label="序号" width="100" prop="index">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.Page-1)*queryEntity.PageSize+ row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="分店编码" prop="sv_user_id"></my-table-cell>
                    <my-table-cell align="center" label="分店名称" prop="sv_user_name"></my-table-cell>
                    <my-table-cell align="center" label="成本价" prop="price">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.price,3)}}
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="库存数量" prop="sv_num"></my-table-cell>
                    <my-table-cell align="center" label="库存金额" prop="sv_money">
                        <template v-slot:default="row">
                            {{$app.moneyFixed(row.sv_money,3)}}
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary">
                    <span>合计金额：</span>
                    <label>{{$app.moneyFixed(this.summaryData.sv_money_total||0,3)}}</label>
                    <span>合计数量：</span>
                    <label>{{this.summaryData.sv_num_total||0}}</label>
                    <!-- <span>提成/业绩汇总：</span>
                    <label>{{this.summaryData.totalCalcMoney}}</label> -->
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.Page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './inventory.scss';
</style>
<script src="./inventory.js"></script>

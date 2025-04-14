<template>
    <div class="summary">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.keywards" placeholder="请输入课程名称" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">交费日期：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]" @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">交费类型：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_type" placeholder="选择经办人" @change="handleSearch">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="item in [{ label: '续报', value: 3 }, { label: '报名', value: 1 }]" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.u_id" placeholder="选择门店" filterable @change="storeChangeHandle">
                                <!-- <el-option label="全部" :value="-1"></el-option> -->
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="rep_map">
            <div class="map_type">
                <el-radio-group v-removeAria v-model="queryEntity.sort_type" @input="top10ChangeHandle">
                    <el-radio :label="1">课程销售人数TOP10</el-radio>
                    <el-radio :label="2">课程实收费用TOP10</el-radio>
                </el-radio-group>
            </div>
            <div class="map_content">
                <div class="left">
                    <div class="title">{{ queryEntity.sort_type == 1 ? '课程销售人数TOP10':'课程实收费用TOP10' }}</div>
                    <div id="left_map"> </div>
                </div>
                <div class="right">
                    <div id="right_map"></div>
                    <div class="title">{{ `课程销售结构:总人数(${membertotal}),私教课(${courseValue[0]||0}),团体课(${courseValue[1]||0})` }}</div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_detail_id" :data="dataList || []">
                    <my-table-cell align="center" label="序号" prop="index" width="60" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="课程名称" prop="sv_p_name"></my-table-cell>
                    <my-table-cell label="私教模式" prop="sv_type_name"></my-table-cell>
                    <my-table-cell align="right" label="课程销售人数" prop="sv_product_member"></my-table-cell>
                    <my-table-cell align="right" label="课程实付费用" prop="sv_product_money">
                        <template v-slot:default="row">
                            <span>￥{{ $app.moneyFixed(row.sv_product_money||0,2) }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script src="./summary"></script>
<style lang="scss" scoped>
@import './summary.scss';
</style>

<template>
    <div class="biManage">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.keywards" placeholder="请输入姓名或手机号" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">入场类型：</div>
                        <el-select v-model="queryEntity.type" placeholder="选择类型" @change="typeChangeHandle">
                            <el-option
                                v-for="item in [{ label: '全部', value: -1 }, { label: '当天首次', value: 1 }, { label: '重复', value: 2 }]"
                                :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">入场时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_time, queryEntity.sv_end_time]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable"  :data="dataList || []" >
                    <my-table-cell align="center" label="序号" prop="index" width="60" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="会员姓名" prop="sv_mr_name"  width="150"></my-table-cell>
                    <my-table-cell label="手机号" prop="sv_mr_mobile"  width="110"></my-table-cell>
                    <my-table-cell label="扣除额度" prop="sv_num"></my-table-cell>
                    <my-table-cell label="入场类型" prop="sv_enter_type_name"></my-table-cell>
                    <my-table-cell label="入场时间" prop="sv_enter_date" width="150"></my-table-cell>
                    <my-table-cell label="入场区域" prop="sv_enter_name"></my-table-cell>
                    <my-table-cell label="入场方式" prop="sv_enter_way_name"></my-table-cell>
                    <my-table-cell label="离场时间" prop="sv_out_date" width="150"></my-table-cell>
                    <my-table-cell label="离场区域" prop="sv_out_name"></my-table-cell>
                    <my-table-cell label="离场方式" prop="sv_out_way_name"></my-table-cell>
                    <my-table-cell label="在场时间" prop="sv_time_long">
                        <template v-slot:default="row">{{ row.sv_time_long }}分钟</template>
                    </my-table-cell>
                    
                   <my-table-cell label="操作" prop="op" width="100">
                        <template v-slot:default="row">
                            <!-- <el-tag :type="row.sv_register_abbr == '退' ? 'danger' : 'success'" size="mini">{{ row.sv_register_abbr }}</el-tag>
                            {{ row.sv_register_name }} -->
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './biManage.scss';
</style>
<script src="./biManage.js"></script>

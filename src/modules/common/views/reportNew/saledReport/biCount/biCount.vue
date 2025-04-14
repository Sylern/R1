
<template>
    <div class="biCount">
        <div class="info">
            <div class="item">
                <div class="label">入场(人)：</div>
                <div class="des">单日去重的入场会员人数，同一会员入场多次计一次</div>
            </div>
            <div class="item">
                <div class="label">入场次数 ：</div>
                <div class="des">单日入场的总次数，入场一次计一次</div>
            </div>
            <div class="item">
                <div class="label">离场(人) ：</div>
                <div class="des">单日去重的离场会员人数</div>
            </div>
            <div class="item">
                <div class="label">离场次数 ：</div>
                <div class="des">单日离场的总次数</div>
            </div>
            <div class="item">
                <div class="label">前台入场(人) ：</div>
                <div class="des">单日通过前台页面操作入场的会员人数</div>
            </div>
            <div class="item">
                <div class="label">智能硬件入场(人) ：</div>
                <div class="des">单日通过三体智能硬件入场的会员人数，包含智慧前台、门禁等</div>
            </div>
        </div>
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <!-- <el-input v-model.trim="queryEntity.keywards" placeholder="请输入姓名或手机号" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input> -->
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
                    <my-table-cell label="日期" prop="datetime" ></my-table-cell>
                    <my-table-cell label="入场（人）" prop="sv_entry_by_num" ></my-table-cell>
                    <my-table-cell label="入场次数" prop="sv_entry_number" ></my-table-cell>
                    <my-table-cell label="离场（人）" prop="sv_out_by_num" ></my-table-cell>
                    <my-table-cell label="离场次数" prop="sv_out_number" ></my-table-cell>
                    <my-table-cell label="前台入场（人）" prop="sv_people_work_entry_by_num" ></my-table-cell>
                    <my-table-cell label="智能硬件入场（人）" prop="sv_intelligent_entry_by_num" ></my-table-cell>
                    
                </my-table>
            </div>
            
            <div class="pageWrap" v-if="total > 0">
                <div class="summary" >
                
                <div class="item">
                  <div class="label">入场（人）：</div>
                  <div class="value">{{ values.sv_entry_by_Total }}</div>
                </div>
                <div class="item">
                  <div class="label">入场次数：</div>
                  <div class="value">{{ values.sv_entry_Total }}</div>
                </div>
                <div class="item">
                  <div class="label">离场（人）：</div>
                  <div class="value">{{ values.sv_out_by_Total }}</div>
                </div>
                <div class="item">
                  <div class="label">离场次数：</div>
                  <div class="value">{{ values.sv_out_Total }}</div>
                </div>
                <div class="item">
                  <div class="label">前台入场（人）：</div>
                  <div class="value">{{ values.sv_people_work_Total }}</div>
                </div>
                <div class="item">
                  <div class="label">智能硬件入场（人）</div>
                  <div class="value">{{ values.sv_intelligent_Total }}</div>
                </div>
              </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <member-list :visible.sync="memberListStatus" title="选择会员" :syncStore="false"
            @selectMember="handleMemberInfo"></member-list>
    </div>
</template>

<style lang="scss" scoped>
@import './biCount.scss';
</style>
<script src="./biCount.js"></script>

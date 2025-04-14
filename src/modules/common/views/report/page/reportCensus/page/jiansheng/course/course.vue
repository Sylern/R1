
<template>
    <div class="course">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.search" placeholder="请输入会员姓名/电话" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">授课课程：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentCourse.map(item => item.sv_p_name).join(',')" placeholder="选择课程"
                                @focus="courseStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleCourseSubmit"></el-input>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课教练：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentTeacher.map(item => item.name).join(',')" placeholder="选择教练"
                                @focus="teacherStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="getGuiderSelected"></el-input>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课场地：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentClass.map(item => item.sv_class_name).join(',')" placeholder="选择场地"
                                @focus="classStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleClassSubmit"></el-input>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">欠费状态：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.arrears_state" placeholder="选择类型" @change="arrearsStateChangeHandle">
                                <el-option v-for="item in [{label:'全部',value:-1},{label:'欠费课程',value:1},{label:'正常课程',value:2}]" 
                                :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    
                </div>
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_micard_id" :data="dataList || []" @select="handleSellect"
                    @select-all="handleSellectAll">
                    <my-table-cell align="center" label="序号" width="60" prop="index" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="会员姓名" prop="sv_mr_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="手机号" prop="sv_mr_mobile" width="110"></my-table-cell>
                    <my-table-cell label="上课场地" prop="sv_class_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="上课教练" prop="sv_teacher_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="授课课程" prop="sv_p_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell align="right" label="购买金额" prop="sv_subtotal" width="100" >
                        <template v-slot:default="row">
                            ￥{{ $app.moneyFixed(row.sv_subtotal) }}
                        </template>
                    </my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="总课时" prop="sv_effective_class_hour_num_total" width="100" ></my-table-cell>
                    <my-table-cell label="购买课时" prop="sv_effective_class_hour_num" width="100" ></my-table-cell>
                    <my-table-cell label="赠送课时" prop="sv_give_class_hour" width="100" ></my-table-cell>
                    <my-table-cell label="已用课时" prop="sv_consumption_class_hour" width="100" ></my-table-cell>
                    <my-table-cell label="已退课时" prop="sv_refund_class_hour" width="100" ></my-table-cell>
                    <my-table-cell label="剩余课时" prop="sv_surplus_class_hour" width="100" ></my-table-cell>
                    <my-table-cell label="剩余过期课时" prop="sv_surplus_class_hour_overdue" width="130" ></my-table-cell>
                    <my-table-cell align="right" label="剩余金额" prop="sv_surplus_price" width="100" >
                        <template v-slot:default="row">
                            ￥{{ $app.moneyFixed(row.sv_surplus_price) }}
                        </template>
                    </my-table-cell>
                     <my-table-cell align="right" label="欠费课时" prop="sv_arrears_class_hour" width="100" ></my-table-cell>
                    <my-table-cell align="right" label="欠费金额" prop="sv_arrears_price" width="100" >
                        <template v-slot:default="row">
                            ￥{{ $app.moneyFixed(row.sv_arrears_price) }}
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <div class="summary">
                    <span>购买金额：</span>
                    <label>{{  $app.moneyFixed(values.total_subtotal||0,2) }}</label>
                    <span>总课时：</span>
                    <label>{{ values.total_effective_class_hour_num_total }}</label>
                    <span>购买：</span>
                    <label>{{ values.total_effective_class_hour_num }}</label>
                    <span>赠送：</span>
                    <label>{{ values.total_give_class_hour }}</label>
                    <span>剩余：</span>
                    <label>{{ values.total_surplus_class_hour }}</label>
                    <span>剩余金额：</span>
                    <label>￥{{ $app.moneyFixed(values.total_surplus_price||0) }}</label>
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 选择学生 -->
        <member-list :visible.sync="memberListStatus" title="选择会员" :syncStore="false" @selectMember="handleMemberInfo"></member-list>
        <!-- 选择教练、助教 -->
        <guider-select :visible.sync="teacherStatus" title="选择教练" :selectedNumber="4" @handleBack="getGuiderSelected"></guider-select>
        <!-- 选择课程 -->
        <course-select :visible.sync="courseStatus" @handleSubmit="handleCourseSubmit"></course-select>
        <!-- 选择场地 -->
        <class-select :visible.sync="classStatus" @handleSubmit="handleClassSubmit"></class-select>
    </div>
</template>

<style lang="scss" scoped>@import './course.scss';</style>
<script src="./course.js"></script>

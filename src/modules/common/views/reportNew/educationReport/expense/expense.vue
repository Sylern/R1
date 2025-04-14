
<template>
    <div class="expense">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.sv_order_code" placeholder="请输入订单编号" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">消课日期：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_class_date, queryEntity.sv_end_class_date]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">报名学员：</div>
                        <div class="rep_qbfi_label">
                            <el-input v-model="memberInfo.sv_mr_name" placeholder="选择学员" @focus="memberListStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleMemberInfo()"></el-input>
                        </div>
                    </div> -->
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课班级：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentClass.map(item => item.sv_class_name).join(',')" placeholder="选择班级"
                                @focus="classStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleClassSubmit"></el-input>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课老师：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentTeacher.map(item => item.name).join(',')" placeholder="选择老师"
                                @focus="teacherStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="getGuiderSelected"></el-input>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课课程：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentCourse.map(item => item.sv_p_name).join(',')" placeholder="选择课程"
                                @focus="courseStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleCourseSubmit"></el-input>
                        </div>
                    </div>
                </div>
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">创建日期：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]"
                                @change="handleChangeCreateTime"></date-time-picker>
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
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.PageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="订单编号" prop="sv_order_code" width="170">
                        <template v-slot:default="row">
                            <i class="el-icon-document-copy" v-copy="row.sv_order_code" title="复制"></i>
                            <span style="width: 150px;" showTooltip >{{row.sv_order_code}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="消课时间" prop="sv_class_date" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="学员姓名" prop="sv_mr_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="手机号" prop="sv_mr_mobile" width="110"></my-table-cell>
                    <my-table-cell label="上课班级" prop="sv_class_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="上课老师" prop="sv_teacher_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="上课课程" prop="sv_p_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="消课类型" prop="sv_hour_type_name" width="100"></my-table-cell>
                    <my-table-cell align="right" label="消耗课时|天数" prop="sv_consume_name" width="100" ></my-table-cell>
                    <my-table-cell align="right" label="剩余时间" prop="sv_remaining" width="100"></my-table-cell>
                    <my-table-cell align="right" label="消课金额" prop="sv_consumption_amount" width="100">
                        <template v-slot:default="row">
                            <span>￥{{ $app.moneyFixed(row.sv_consumption_amount||0,2) }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="创建时间" prop="sv_creation_time" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="备注" prop="sv_remark" width="200" showTooltip></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <div class="summary">
                    <span>总金额：</span>
                    <label>{{  $app.moneyFixed(values.sumAmount||0,2) }}</label>
                    <span>总消课课时：</span>
                    <label>{{ values.sumHour||0 }}</label>
                    <span>总消课天数：</span>
                    <label>{{ values.sumDay||0 }}</label>
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 选择学生 -->
        <member-list :visible.sync="memberListStatus" title="选择学员" :syncStore="false" @selectMember="handleMemberInfo"></member-list>
        <!-- 选择老师、助教 -->
        <guider-select :visible.sync="teacherStatus" title="选择老师" :selectedNumber="4" @handleBack="getGuiderSelected"></guider-select>
        <!-- 选择课程 -->
        <course-select :visible.sync="courseStatus" @handleSubmit="handleCourseSubmit"></course-select>
        <!-- 选择班级 -->
        <class-select :visible.sync="classStatus" @handleSubmit="handleClassSubmit"></class-select>
    </div>
</template>

<style lang="scss" scoped>@import './expense.scss';</style>
<script src="./expense.js"></script>

<template>
    <div class="record">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.sv_calss_name" placeholder="请输入场地名称" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_class_date, queryEntity.sv_end_class_date]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
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
                        <div class="rep_qbfi_name">签到教练：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_roll_call_teachers" placeholder="选择教练"
                                @change="handleSearch">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="item in salesclerk" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课会员：</div>
                        <div class="rep_qbfi_label">
                            <el-input v-model="memberInfo.sv_mr_name" placeholder="选择会员" @focus="memberListStatus = true"
                                clearable suffix-icon="el-icon-s-grid" @clear="handleMemberInfo()"></el-input>
                        </div>
                    </div> -->
                </div>
                <!-- <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课教室：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentClassRoom.map(item => item.sv_table_name).join(',')" placeholder="选择教室"
                                @focus="classroomStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleClassroomSubmit"></el-input>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" :data="dataList || []">
                    <my-table-cell align="center" label="序号" prop="index" width="60" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.PageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="签到时间" prop="sv_roll_call_time" showTooltip width="150"></my-table-cell>
                    <my-table-cell label="场地名称" prop="sv_class_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="授课课程" prop="sv_p_name" width="180" showTooltip></my-table-cell>
                    <my-table-cell label="上课教练" prop="sv_teacher_name" width="150" showTooltip></my-table-cell>
                    <!-- <my-table-cell label="上课教室" prop="sv_room_name" width="150"></my-table-cell> -->
                    <my-table-cell label="上课时间" prop="sv_class_time" width="260" showTooltip></my-table-cell>
                    <my-table-cell label="上课时长" prop="sv_duration" width="100" align="right"></my-table-cell>
                    <my-table-cell label="实到人数" prop="sv_actual_should_arrive" width="150" align="right"
                        showTooltip></my-table-cell>
                    <my-table-cell label="授课时间" prop="sv_teaching_hour" width="80" align="right"></my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="签到教练" prop="sv_roll_call_teacher" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="上课内容" prop="sv_remark" width="200">
                        <template v-slot:default="row">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    <div style="max-width: 200px;">{{ row.sv_remark }}</div>
                                </div>
                                <span>{{ row.sv_remark }}</span>
                            </el-tooltip>
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="操作" prop="op" width="80" fixed="right">
                        <template v-slot:default="row">
                            <el-button type="text" :disabled="row.state" @click="revocationHandle(row)">{{
                                row.state ? '已撤销' : '撤销签到' }}</el-button>
                        </template>
                    </my-table-cell>
                </my-table>
            </div>

            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 选择学生 -->
        <member-list :visible.sync="memberListStatus" title="选择会员" :syncStore="false"
            @selectMember="handleMemberInfo"></member-list>
        <!-- 选择教练、助教 -->
        <guider-select :visible.sync="teacherStatus" title="选择教练" :selectedNumber="4"
            @handleBack="getGuiderSelected"></guider-select>
        <!-- 选择课程 -->
        <course-select :visible.sync="courseStatus" @handleSubmit="handleCourseSubmit"></course-select>
        <!-- 选择教室 -->
        <classroom-select :visible.sync="classroomStatus" @handleSubmit="handleClassroomSubmit"></classroom-select>

    </div>
</template>
<script src="./record.js"></script>
<style lang="scss" scoped>@import "./record.scss";</style>
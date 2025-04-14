<template>
    <div class="studentRecord">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <!-- <el-input v-model.trim="queryEntity.keywards" placeholder="请输入场地" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input> -->
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课会员：</div>
                        <div class="rep_qbfi_label">
                            <el-input v-model="memberInfo.sv_mr_name" placeholder="选择会员" @focus="memberListStatus = true"
                                clearable suffix-icon="el-icon-s-grid" @clear="handleMemberInfo()"></el-input>
                        </div>
                    </div>

                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_class_date, queryEntity.sv_end_class_date]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">签到状态：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_state" placeholder="选择类型" @change="stateChangeHandle">
                                <el-option
                                    v-for="item in [{ label: '全部', value: -1 }, { label: '到课', value: 1 }, { label: '迟到', value: 2 }, { label: '请假', value: 3 }, { label: '未到', value: 4 }]"
                                    :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <!-- <el-input v-model="memberInfo.sv_mr_name" placeholder="选择会员" @focus="memberListStatus = true"
                                clearable suffix-icon="el-icon-s-grid" @clear="handleMemberInfo()"></el-input> -->
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">消课课程：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentCourse.map(item => item.sv_p_name).join(',')" placeholder="选择课程"
                                @focus="courseStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleCourseSubmit"></el-input>
                        </div>
                    </div>



                </div>
                <div class="rep_qb_from">
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
                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">上课教室：</div>
                        <div class="rep_qbfi_label">
                            <el-input :value="currentClassRoom.map(item => item.sv_table_name).join(',')" placeholder="选择教室"
                                @focus="classroomStatus = true" clearable suffix-icon="el-icon-s-grid"
                                @clear="handleClassroomSubmit"></el-input>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable"  :data="dataList || []">
                    <my-table-cell align="center" label="序号" prop="index" width="60" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="会员姓名" prop="sv_mr_name" showTooltip width="150"></my-table-cell>
                    <my-table-cell label="上课时间" prop="sv_class_time" width="280" showTooltip></my-table-cell>
                    <my-table-cell label="签到时间" prop="sv_roll_call_time" width="160" showTooltip></my-table-cell>
                    <my-table-cell label="上课时长" prop="sv_duration" width="80" align="right"></my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="签到状态" prop="sv_roll_call_state" width="80" showTooltip>
                        <template v-slot:default="row">
                            <el-tag :type="row.sv_roll_call_state == '缺勤' ? 'warning' : row.sv_roll_call_state == '到课' ? 'success' : row.sv_roll_call_state == '未到' ? 'danger' : ''" size="mini">
                                {{ row.sv_roll_call_state }}
                            </el-tag>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="扣课时" prop="sv_consume_name" width="100" showTooltip></my-table-cell>
                    <my-table-cell label="消课金额" prop="sv_consumption_amount" width="100" align="right" showTooltip>
                        <template v-slot:default="row">
                            ￥{{ $app.moneyFixed(row.sv_consumption_amount, 2) }}
                        </template>
                    </my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="场地名称" prop="sv_class_name" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="消课课程" prop="sv_p_name" width="120"></my-table-cell>
                    <my-table-cell label="上课教练" prop="sv_teacher_name" width="150" showTooltip></my-table-cell>
                    <!-- <my-table-cell label="上课教室" prop="sv_room_name" width="150"></my-table-cell> -->
                    <my-table-cell label="备注" prop="sv_remark" width="200" showTooltip></my-table-cell>
                </my-table>
            </div>

            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize"
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
        <!-- 选择场地 -->
        <class-select :visible.sync="classStatus" @handleSubmit="handleClassSubmit"></class-select>
        <!-- 选择教室 -->
        <classroom-select :visible.sync="classroomStatus" @handleSubmit="handleClassroomSubmit"></classroom-select>

    </div>
</template>
<script src="./studentRecord.js"></script>
<style lang="scss" scoped>@import "./studentRecord.scss";</style>
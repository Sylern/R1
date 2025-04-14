 <!-- 预约管理 -->
<template>
    <div class="courseReservation">
        <div class="contentWrap">
            <div class="filterWrap queryFilter">
                <div class="btnWrap">
                    <div class="left">
                        <!-- <el-button @click="handleAdd" class="btnItem btnPrimary">导出</el-button> -->
                    </div>
                    <div class="right searchInput">
                        <el-input v-model.trim="query.keywards" @keyup.enter.native="handleReSearch" @clear="handleReSearch" clearable placeholder="请输入会员名称/手机号/卡号">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleReSearch"></i>
                        </el-input>
                    </div>
                </div>
                <div class="selectList">
                    <div class="selectLine">
                        <div class="item">
                            <div class="key">类型：</div>
                            <div class="select">
                                <el-select v-model.trim="query.business_type" placeholder="请选择" @change="handleReSearch">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option label="团体课" :value="100"></el-option>
                                    <el-option label="私教课" :value="200"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">预约状态：</div>
                            <div class="select">
                                <el-select v-model.trim="query.state" placeholder="请选择" @change="handleReSearch">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option label="未签到" :value="2"></el-option>
                                    <el-option label="已签到" :value="1"></el-option>
                                    <el-option label="已取消" :value="0"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">教练：</div>
                            <div class="select">
                                <el-select v-model.trim="query.c_id" placeholder="请选择" @change="handleReSearch">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in coachList" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="selectLine">
                        <div class="item">
                            <div class="key">时间：</div>
                            <div class="select">
                                <date-time-picker :paramData="dateTime" @change="handleChangeTime" needTimePicker></date-time-picker>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tableWrap queryTable">
                <div class="tableBox">
                    <myTable ref="myTable" rowKey="sub_Id" :data="tableJson">
                        <my-table-cell label="序号" prop="index" width="80" align="center">
                            <template v-slot:default="scope">
                                <span>{{(query.pageIndex - 1) * query.pageSize + scope.index + 1}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="课程名称" prop="course_name" showTooltip>
                            <template v-slot:default="scope">
                                <div class="tableCellContent flex-start">
                                    <div class="tableLineText">{{scope.course_name}}</div>
                                    <div class="tableLineText signTag" :class="{ type2: scope.business_type !== 100 }">{{scope.business_type === 100 ? '团体课': '私教课'}}</div>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="课程时间" prop="course_day" width="150" align="center">
                            <template v-slot:default="scope">
                                <div class="tableCellContent">
                                    <div class="tableLineText">{{$app.currentTime(new Date(scope.course_day), 'yyyy-MM-dd')}}</div>
                                    <div class="tableLineText">{{scope.course_time}}</div>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="教练" prop="coach_name" align="center"></my-table-cell>
                        <my-table-cell label="会员" prop="mr_name" align="center">
                            <template v-slot:default="scope">
                                <div class="tableCellContent">
                                    <div class="tableLineText">{{scope.mr_name}}</div>
                                    <div class="tableLineText">{{scope.mr_mobile}}</div>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="预约状态" prop="state" align="center">
                            <template v-slot:default="scope">
                                <span>{{stateText[scope.state]}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="预约时间" prop="reservation_time" width="140" align="center"></my-table-cell>
                        <my-table-cell label="预约人" prop="reservation_name" align="center">
                            <template v-slot:default="scope">
                                <div class="tableCellContent">
                                    <div class="tableLineText">{{scope.reservation_name}}</div>
                                    <div class="tableLineText">{{scope.sv_type}}</div>
                                </div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="签到时间" prop="sign_time" align="center"></my-table-cell>
                        <my-table-cell label="签到人" prop="sign_by" align="center"></my-table-cell>
                        <my-table-cell label="本次扣除" prop="deduction_hour" width="150" align="center">
                            <template v-slot:default="scope">
                                <div>{{scope.deduction_hour || '--'}}</div>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="操作" prop="handle" width="150" align="center">
                            <template v-slot:default="scope">
                                <div class="inLine">
                                    <el-popconfirm class="span" @confirm="handleCancel(scope)" title="是否取消预约？">
                                        <div slot="reference" class>
                                            <el-button type="text" v-if="scope.state === 2">取消预约</el-button>
                                        </div>
                                    </el-popconfirm>
                                    <el-popconfirm class="span" @confirm="handleSign(scope)" title="是否签到？">
                                        <div slot="reference" class>
                                            <el-button type="text" v-if="scope.state === 2">签到</el-button>
                                        </div>
                                    </el-popconfirm>
                                    <!-- <el-button type="text" @click="handleEdit(scope)">打印小票</el-button> -->
                                </div>
                            </template>
                        </my-table-cell>
                    </myTable>
                </div>
                <div class="pageWrap" v-if="total > 0">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scope>
@import './courseReservation.scss';
</style>
<script src="./courseReservation.js"></script>


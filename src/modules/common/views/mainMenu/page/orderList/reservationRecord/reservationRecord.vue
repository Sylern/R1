<!-- 房台预约 -->
<template>
    <div class="reservationRecord">
        <div class="filterWrap queryFilter">
            <div class="btnWrap">
                <div class="left">
                    <div class="stateItem" :class="{ selected: item.state === query.sv_order_state }" v-for="(item, index) in orderStateList" :key="index" @click="handleOrderState(item.state)">
                        <span>{{ item.name }}</span>
                    </div>
                    <!-- <div class="btnItem btnBasic" @click="handleExport">导出</div> -->
                </div>
                <div class="right searchInput">
                    <el-input v-model.trim="query.sv_booking_mobile" placeholder="请输入手机号" clearable @clear="handleReGetInfo" @keyup.enter.native="handleReGetInfo">
                        <i @click="handleReGetInfo" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="selectList">
                <div class="top">
                    <div class="left">
                        <div class="item">
                            <div class="key">操作员：</div>
                            <div class="select">
                                <el-select v-model.trim="query.sv_created_by" placeholder="请选择" @change="handleReGetInfo">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option v-for="item in salesclerkInfo" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">创建时间：</div>
                            <date-time-picker :paramData="defaultArrivalDate" @change="handleChangeCreatedTime" needTimePicker></date-time-picker>
                        </div>
                    </div>
                    <div class="center">
                        <div class="item">
                            <div class="key">预订方式：</div>
                            <div class="select">
                                <el-select v-model.trim="query.sv_source_type" placeholder="请选择预定方式" @change="handleReGetInfo">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option label="线下" :value="0"></el-option>
                                    <el-option label="微信小程序" :value="1"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="item">
                            <div class="key">预抵时间：</div>
                            <date-time-picker :paramData="defaultArrivalDate" @change="handleChangeArrivalTime" allSelect forwardSelect needTimePicker></date-time-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tableWrap queryTable">
            <div class="tableBox">
                <myTable ref="myTable" rowKey="id" :data="dataJson" :minWidth="80">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="row">
                            <span>{{(query.pageIndex-1)*query.pageSize + row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="操作员" prop="sv_created_name" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="预订人" prop="sv_booking_name" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="联系电话" prop="sv_booking_mobile" align="center"></my-table-cell>
                    <my-table-cell label="预订房台" prop="sv_table_name" align="center"></my-table-cell>
                    <my-table-cell label="预抵时间" prop="sv_arrival_date" width="150" align="center">
                        <template v-slot:default="row">
                            <div class="timeWrap">
                                <div class="date">{{ row.sv_arrival_date.substring(0, 10) }}</div>
                                <div class="time">
                                    <span>{{ row.sv_arrival_date.substring(11, 16) }}</span>
                                    <span> ~ {{ row.sv_arrival_end_date.substring(11, 16) }}</span>
                                </div>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="支付状态" prop="payment_state" align="center">
                        <template v-slot:default="row">
                            <div class="payItem" v-if="row.payment_state === 1">
                                <span class="dot"></span>
                                <span>已支付</span>
                            </div>
                            <div class="payItem type2" v-if="row.payment_state === 0">
                                <span class="dot"></span>
                                <span>待支付</span>
                            </div>
                            <div class="payItem type3" v-if="row.payment_state === 2">
                                <span class="dot"></span>
                                <span>已取消</span>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="预订方式" prop="sv_source_type_name" align="center"></my-table-cell>
                    <my-table-cell label="创建时间" prop="sv_creation_date" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell fixed="right" label="操作" prop="handle" width="180" align="center">
                        <template v-slot:default="row">
                            <span v-if="row.sv_order_state === 0 || row.sv_order_state === 5">
                                <el-button @click="handleCancel(row)" type="text" size="small">{{ row.payment_state !== 1 ? '取消预约' : '取消预约并退款'}}</el-button>
                            </span>
                            <span v-if="row.sv_order_state === 1" style="color: #999999">使用中</span>
                            <span v-if="row.sv_order_state === 2" style="color: #999999">已完成</span>
                            <span v-if="row.sv_order_state === 3" style="color: #999999">已取消</span>
                            <span v-if="row.sv_order_state === 4" style="color: #999999">已过期</span>
                            <span style="margin-left: 5px;" v-if="row.sv_order_state === 2 || row.sv_order_state === 4">
                                <el-button @click="handleCancel(row)" type="text" size="small">退款</el-button>
                            </span>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="dataJson.length>0" class="pageWrap">
                <div class="left"></div>
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="sass" scoped>
@import "./reservationRecord.scss"
</style>
<script src="./reservationRecord.js"></script>
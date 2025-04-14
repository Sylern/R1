<template>
    <div class="cardsSaleRecord">
        <div class="filterWrap queryFilter">
            <div class="btnWrap">
                <div class="left">
                    <div class="btnItem btnBasic" @click="handleExport">导出</div>
                </div>
                <div class="right searchInput">
                    <el-input v-model.trim="query.keywards" placeholder="请输入卡号/手机号/姓名" clearable @clear="handleReGetRechargeInfo" @keyup.enter.native="handleReGetRechargeInfo">
                        <i @click="handleReGetRechargeInfo" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="selectList">
                <div class="top">
                    <div class="left">
                        <div class="item">
                            <div class="key">门店：</div>
                            <div class="select">
                                <el-select v-model.trim="query.user_id" placeholder="请选择门店" filterable @change="handleReGetRechargeInfo">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option v-for="item in storelist" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="center">
                        <div class="item">
                            <div class="key">时间：</div>
                            <date-time-picker :paramData="defaultDate" @change="handleChangeTime" needTimePicker></date-time-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tableWrap queryTable">
            <div class="tableBox">
                <myTable ref="myTable2" rowKey="id" :data="dataJson" :minWidth="80">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="row">
                            <span>{{(query.page-1)*query.pageSize + row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="流水号" prop="sv_serialnumber" width="160" showTooltip></my-table-cell>
                    <my-table-cell label="计次卡名称" prop="sv_p_name" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="会员卡号/会员" prop="sv_mr_names" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="会员等级" prop="sv_ml_name" align="center"></my-table-cell>
                    <my-table-cell label="次数" prop="sv_mcr_countafter" align="center"></my-table-cell>
                    <my-table-cell label="金额" prop="amount" align="center"></my-table-cell>
                    <my-table-cell label="支付方式" prop="sv_mcr_payment" align="center"></my-table-cell>
                    <my-table-cell label="操作人员" prop="sv_employee_name" align="center"></my-table-cell>
                    <my-table-cell label="购买时间" prop="sv_created_date" width="150" align="center"></my-table-cell>
                    <my-table-cell label="所属门店" prop="memberuserName" align="center"></my-table-cell>
                    <my-table-cell label="备注" prop="sv_p_remark" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell fixed="right" label="操作" prop="handle" width="150" align="center">
                        <template v-slot:default="row">
                            <div v-if="!row.sv_mcr_sate && row.setmealrechargedetail">
                                <el-button @click="handleUndo(row)" type="text" size="small">撤销计次</el-button>
                                <el-button @click="handlePrint(row)" type="text" size="small">打印</el-button>
                            </div>
                            <div v-else style="color: #999999">已撤销</div>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="dataJson.length>0" class="pageWrap">
                <div class="left">
                    <label>支付总金额：</label>
                    <span class="money">{{ totalAmount }}</span>
                    <label>撤销支付金额：</label>
                    <span class="money">{{ totalRevokeAmount }}</span>
                </div>
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="sass" scoped>
@import "./cardsSaleRecord.scss"
</style>
<script src="./cardsSaleRecord.js"></script>
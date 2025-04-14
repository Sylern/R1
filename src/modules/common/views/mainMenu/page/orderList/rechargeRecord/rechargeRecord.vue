<template>
    <div class="rechargeRecord">
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
                        <div class="item">
                            <div class="key">支付方式：</div>
                            <div class="select">
                                <el-select v-model.trim="query.payment_method" placeholder="选择支付方式" @change="handleReGetRechargeInfo">
                                    <el-option label="全部" value></el-option>
                                    <el-option v-for="item in paymentList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="center">
                        <div class="item">
                            <div class="key">员工：</div>
                            <div class="select">
                                <el-select v-model.trim="query.salesclerkid_id" placeholder="请选择员工" @change="handleReGetRechargeInfo">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in salesclerkInfo" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
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
                <myTable ref="myTable" rowKey="id" :data="dataJson" :minWidth="80">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="row">
                            <span>{{(query.page-1)*query.pageSize + row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="会员卡号" prop="sv_mr_cardno" width="120" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="会员姓名" prop="sv_mr_name" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="类型" prop="sv_mrr_type_name" align="center"></my-table-cell>
                    <my-table-cell label="充值金额" prop="sv_mrr_money" align="center"></my-table-cell>
                    <my-table-cell label="赠送金额" prop="sv_mrr_present" align="center"></my-table-cell>
                    <my-table-cell label="充值后金额" prop="sv_mrr_amountafter" align="center"></my-table-cell>
                    <my-table-cell label="充值时间" prop="sv_mrr_date" width="150" align="center"></my-table-cell>
                    <my-table-cell label="支付方式" prop="sv_mrr_payment" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="消费门店" prop="consumeusername" align="center"></my-table-cell>
                    <my-table-cell label="所属门店" prop="memberuserName" align="center"></my-table-cell>
                    <my-table-cell label="备注" prop="sv_mrr_desc" width="200" align="center" showTooltip></my-table-cell>
                    <my-table-cell fixed="right" label="操作" prop="handle" width="150" align="center">
                        <template v-slot:default="row">
                            <div v-if="!row.sv_mrr_state && row.sv_mrr_type != -1 && row.sv_mrr_type != -2">
                                <el-button @click="handleUndo(row)" type="text" size="small">撤销充值</el-button>
                                <el-button @click="handlePrint(row)" type="text" size="small">打印</el-button>
                            </div>
                            <div v-else style="color: #999999">已撤销</div>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="dataJson.length>0" class="pageWrap">
                <div class="left">
                    <label>共</label>
                    <span class="count">{{ recharge_count }}</span>
                    <label>笔，充值金额汇总：</label>
                    <span class="money">{{ recharge_total }}</span>
                    <label>赠送金额汇总：</label>
                    <span class="money">{{ presenttotal_total }}</span>
                </div>
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="sass" scoped>
@import "./rechargeRecord.scss"
</style>
<script src="./rechargeRecord.js"></script>

<template>
    <div class="apply">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.keywards" placeholder="请输入订单编号" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">订单类型：</div>
                        <el-select v-model="queryEntity.sv_type" placeholder="选择类型" @change="typeChangeHandle">
                                <el-option v-for="item in [{label:'全部',value:-1},{label:'报名',value:1},{label:'退课',value:2},{label:'续报',value:3},{label:'转课',value:4}]" 
                                :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                    </div>
                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">报名学员：</div>
                        <div class="rep_qbfi_label">
                            <el-input v-model="memberInfo.sv_mr_name" placeholder="选择学员" @focus="memberListStatus=true" clearable suffix-icon="el-icon-s-grid" @clear="handleMemberInfo()"></el-input>
                        </div>
                    </div> -->
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">业绩归属：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_c_e_id"  placeholder="选择业绩人" @change="handleSearch">
                                <el-option  label="全部" :value="-1"></el-option>
                                <el-option v-for="item in employees" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">经办人：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_h_d_id" placeholder="选择经办人" @change="handleSearch">
                                <el-option  label="全部" :value="-1"></el-option>
                                <el-option v-for="item in salesclerk" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker needTimePicker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]" @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                </div>
                <!-- <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker needTimePicker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]" @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" :data="dataList||[]">
                    <my-table-cell align="center" label="序号" width="60" prop="index" fixed="left">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.pageIndex-1)*queryEntity.pageSize+ row.index+1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="订单编号" prop="sv_register_order_code" width="170">
                        <template v-slot:default="row">
                            <i class="el-icon-document-copy" v-copy="row.sv_register_order_code" title="复制"></i>
                            <span style="width: 150px;" showTooltip >{{row.sv_register_order_code}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="学员姓名" prop="sv_mr_name" showTooltip width="150"></my-table-cell>
                    <my-table-cell  label="订单类型" prop="sv_register_name" width="100">
                        <template v-slot:default="row">
                            <el-tag :type="row.sv_register_abbr == '退'?'danger':'success'" size="mini">{{ row.sv_register_abbr }}</el-tag>
                            {{ row.sv_register_name }}
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="购买项目" prop="sv_buy_items" width="200">
                        <template v-slot:default="row"><div style="width:200px;" v-tooltip>{{ (row.sv_buy_items||[]).join('、') }}</div></template>
                    </my-table-cell>
                    <my-table-cell label="支付方式" prop="sv_payment_method" width="120"> </my-table-cell>
                    <my-table-cell  label="总价" prop="sv_total_price" showTooltip align="right" width="120">
                        <template v-slot:default="row">￥{{ $app.moneyFixed(row.sv_total_price,2)  }}</template>
                    </my-table-cell>
                    <my-table-cell  label="应收/应退" prop="sv_receivable" showTooltip align="right" width="130">
                        <template  v-slot:default="row">
                            <el-tag :type="row.sv_order_type == '退'?'danger':'success'" size="mini">{{ row.sv_order_type }}</el-tag>
                            ￥{{  $app.moneyFixed(row.sv_receivable,2) }}
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="实收/实退" prop="sv_paid_amount" showTooltip align="right" width="120">
                        <template  v-slot:default="row">
                            <el-tag :type="row.sv_order_type == '退'?'danger':'success'" size="mini">{{ row.sv_order_type }}</el-tag>
                            ￥{{ $app.moneyFixed(row.sv_paid_amount,2) }}
                        </template>
                    </my-table-cell>
                    <my-table-cell  label="积分" prop="sv_give_integral" showTooltip align="right" width="100"></my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell  label="业绩归属人" prop="commission_peoples_name" showTooltip width="150"></my-table-cell>
                    <my-table-cell  label="经办人" prop="sv_handled_by" showTooltip width="150"></my-table-cell>
                    <my-table-cell  label="经办时间" prop="sv_order_time" showTooltip width="150"></my-table-cell>
                    <my-table-cell  label="备注" prop="sv_remarks" showTooltip width="200"></my-table-cell>
                    <my-table-cell  label="状态" prop="sv_state_name" showTooltip width="60"></my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell align="center" label="操作" prop="op" width="120" fixed="right">
                        <template v-slot:default="row">
                            <el-button type="text" :disabled="!row.sv_allow_withdrawal" @click="ReturnHandle(row.sv_register_order_id)">撤销</el-button>
                            <el-button type="text" @click="OrderPrintHandle(row.sv_register_order_id)">打印收据</el-button>
                        </template>
                    </my-table-cell>
                    
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary">
                    <span>总应收：</span>
                    <label>￥{{ $app.moneyFixed(values.total_receivable,2)}}</label>
                    <span>总实收：</span>
                    <label>￥{{ $app.moneyFixed(values.total_paid_amount,2) }}</label>
                    <span>总实退：</span>
                    <label>￥{{ $app.moneyFixed(values.total_return_amount,2) }}</label>
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <member-list :visible.sync="memberListStatus" title="选择学员" :syncStore="false" @selectMember="handleMemberInfo"></member-list>
        <!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handleRefundPassword"></return-psw>
    </div>
</template>

<style lang="scss" scoped>
@import './apply.scss';
</style>
<script src="./apply.js"></script>

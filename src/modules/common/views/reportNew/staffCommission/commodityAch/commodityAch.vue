
<template>
    <main class="commodityAch-Main">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <el-button @click="handleDownload" class="bottom" type="success" plain>下载报表</el-button>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.ProductFilter" placeholder="请输入商品名称/商品编码/货号" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.ShopIds" placeholder="请选择" @change="handleSearch">
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">员工：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.EmployeeId" placeholder="请选择" @change="handleSearch">
                                <el-option v-for="item in staffList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">支付方式：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.PaymentFilter" placeholder="请选择" @change="handleSearch">
                                <el-option v-for="item in paymentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item" v-if="!$store.state.isOnAndroid">
                        <div class="rep_qbfi_name">类型：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.IsRefund" placeholder="请选择" @change="handleSearch">
                                <el-option label="全部" :value="null"></el-option>
                                <el-option label="正常订单" :value="false"></el-option>
                                <el-option label="退款订单" :value="true"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">商品分类：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.PtIdS" placeholder="请选择" @change="handleSearch">
                                <el-option v-for="item in classifyOneData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="dateTime" @change="handleChangeTime"></date-time-picker>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <gridManager :option="gridOption" :callback="callback" ref="gridmanager"></gridManager>
            </div>
            <div class="pageWrap" v-if="total > 0 && this.summaryData.totalMoney !== ''">
                <div class="summary">
                    <span>销售金额汇总：</span>
                    <label>{{this.summaryData.totalMoney}}</label>
                    <span>退款业绩汇总：</span>
                    <label>{{this.summaryData.totalRefundMoney}}</label>
                    <span>提成/业绩汇总：</span>
                    <label>{{this.summaryData.totalCalcMoney}}</label>
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.PageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './commodityAch.scss';
</style>
<script src="./commodityAch.js"></script>

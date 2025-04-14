
<template>
    <main class="preMoneyReport">
        <div class="rep_query">
            <div class="rep_q_top queryTable">
                <div class="rep_qtf_item">
                    <el-button @click="handleDownload" class="button" plain>导出</el-button>
                </div>
                <div class="rep_qtf_item searchInput">
                    <el-input v-model="queryEntity.filter" @keyup.enter.native="handleSearch" clearable @clear="handleSearch" placeholder="请搜索订单号/金额/房台">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <date-time-picker :paramData="[queryEntity.startTime, queryEntity.endTime]" @change="handleChangeTime" needTimePicker></date-time-picker>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">门店：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.shopId" placeholder="请选择" @change="handleSearch">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item_button">
                        <el-button @click="handleClearQuery" plain size="medium">清空</el-button>
                    </div>
                    <!-- <div class="rep_qbf_item_button">
                        <el-button @click="handleSearch" class="button" plain>查询</el-button>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable" rowKey="sv_micard_id" :data="dataList||[]" @select="handleSellect" @select-all="handleSellectAll">
                    <my-table-cell align="center" label="序号" width="100" prop="index">
                        <template v-slot:default="scope">
                            <span>{{(queryEntity.pageIndex -1)*queryEntity.pageSize + scope.index + 1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="订单号" prop="orderRunningId" width="180"></my-table-cell>
                    <my-table-cell label="房台" prop="tableName"></my-table-cell>
                    <my-table-cell label="支付时间" prop="createTime" width="180"></my-table-cell>
                    <my-table-cell label="操作" prop="typeString">
                        <template v-slot:default="scope">
                            <div class="cellContent">
                                <span class="typeFlag" :class="['flag_'+ scope.type]"></span>
                                <span>{{ scope.typeString }}</span>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="支付方式" prop="payment"></my-table-cell>
                    <my-table-cell label="金额" prop="money">
                        <template v-slot:default="scope">
                            <div class="cellContent" :class="['money_'+ scope.type]">
                                <span>{{ scope.type === 1 ? '+' : '-' }}</span>
                                <span>{{ $app.moneyFixed(scope.money) }}</span>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="所属门店" prop="shopName"></my-table-cell>
                    <my-table-cell fixed="right" align="center" prop="control" label="操作">
                        <template v-slot:default="scope">
                            <el-button class="cellBtn" type="text" v-if="scope.canRefund" @click="handleReturn(scope)">退款</el-button>
                        </template>
                    </my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <div class="summary">
                    <div class="dataItem">
                        <span>预付金总额</span>
                        <span class="value">{{ $app.moneyFixed(infos.totalMoney) }}</span>
                    </div>
                    <div class="dataItem">
                        <span>预付金退款金额</span>
                        <span class="value">{{ $app.moneyFixed(infos.totalRefundMoney) }}</span>
                    </div>
                    <div class="dataItem">
                        <span>预付金抵扣总金额</span>
                        <span class="value">{{ $app.moneyFixed(infos.totalDeductionMoney) }}</span>
                    </div>
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </main>
</template>

<style lang="scss" scoped>
@import './preMoneyReport.scss';
</style>
<script src="./preMoneyReport.js"></script>

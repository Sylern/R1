<template>
    <div class="cardReport">
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
                                <el-select v-model.trim="query.user_id" filterable placeholder="请选择门店" @change="handleReGetRechargeInfo">
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
                            <span>{{ (query.page - 1) * query.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="流水号" prop="order_running_id" width="160" showTooltip></my-table-cell>
                    <my-table-cell label="商品编码" prop="sv_p_barcode" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="商品/项目" prop="sv_p_name" width="150" showTooltip>
                        <template v-slot:default="row">
                            <span>{{ row.sv_p_name + '/' + row.sv_p_setmeal_name }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="会员卡号/会员" prop="sv_mr_cardno" width="150" align="center" showTooltip>
                        <template v-slot:default="row">
                            <span>{{ row.sv_mr_cardno + '/' + row.sv_mr_name }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="项目价格" prop="setmeal_unitprice" align="center"></my-table-cell>
                    <my-table-cell label="次数" prop="product_num" align="center"></my-table-cell>
                    <my-table-cell label="消费门店" prop="sv_us_name" align="center"></my-table-cell>
                    <my-table-cell label="所属门店" prop="memberuserName" align="center"></my-table-cell>
                    <my-table-cell label="操作员" prop="sv_employee_name" align="center"></my-table-cell>
                    <my-table-cell label="消费时间" prop="order_datetime" width="150" align="center"></my-table-cell>
                    <my-table-cell fixed="right" label="操作" prop="handle" width="150" align="center">
                        <template v-slot:default="row">
                            <el-button @click="handleUndo(row)" type="text" size="small">撤销计次</el-button>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="dataJson.length > 0" class="pageWrap">
                <div class="left"></div>
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>

        <dc-dialog v-if="dialogFormVisible" class="dialogForm" width="500" height="400" title="撤销计次" @close="dialogFormVisible = false">
            <div class="contentWrap">
                <el-form :model="form" label-width="80px">
                    <el-form-item label="撤销原因">
                        <el-select v-model="form.return_cause" placeholder="请选择撤销原因" style="width: 100%">
                            <el-option label="商品质量原因，客户退货" value="商品质量原因，客户退货"></el-option>
                            <el-option label="商品不一致，客户退货" value="商品不一致，客户退货"></el-option>
                            <el-option label="其他原因" value="其他原因"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="撤销次数">
                        <el-input :value="form.return_num" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息">
                        <el-input v-model="form.return_remark" type="textarea" :rows="4" placeholder="请输入原因" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btnWrap">
                <el-button class="btn" @click="dialogFormVisible = false">取 消</el-button>
                <el-button class="btn" type="primary" @click="cancelReturenSales">确 定</el-button>
            </div>
        </dc-dialog>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="sass" scoped>
@import "./cardReport.scss"
</style>
<script src="./cardReport.js"></script>
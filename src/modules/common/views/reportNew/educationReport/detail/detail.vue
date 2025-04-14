
<template>
    <div class="detail">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.keywards" placeholder="请输入订单编号/卡号/手机号" clearable @clear="handleSearch"
                        @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">订单类型：</div>
                        <el-select v-model="queryEntity.sv_type" placeholder="选择类型" @change="typeChangeHandle">
                            <el-option
                                v-for="item in [{ label: '全部', value: -1 }, { label: '报名', value: 1 }, { label: '退费', value: 2 }, { label: '续报', value: 3 }, { label: '转课', value: 4 }]"
                                :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">报名学员：</div>
                        <div class="rep_qbfi_label">
                            <el-input v-model="memberInfo.sv_mr_name" placeholder="选择学员" @focus="memberListStatus = true" clearable suffix-icon="el-icon-s-grid" @clear="handleMemberInfo()"></el-input>
                        </div>
                    </div> -->

                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">经办人：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_h_d_id" placeholder="选择经办人" @change="handleSearch">
                                <el-option  label="全部" :value="-1"></el-option>
                                <el-option v-for="item in salesclerk" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_date, queryEntity.sv_end_date]"
                                @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <my-table ref="myTable"  :data="dataList || []" >
                    <my-table-cell align="center" label="序号" prop="index" width="60" fixed="left">
                        <template v-slot:default="row">
                            <span>{{ (queryEntity.pageIndex - 1) * queryEntity.pageSize + row.index + 1 }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="订单编号" prop="sv_register_order_code" width="170">
                        <template v-slot:default="row">
                            <i class="el-icon-document-copy" v-copy="row.sv_register_order_code" title="复制"></i>
                            <span style="width: 150px;" showTooltip>{{row.sv_register_order_code}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="学员姓名" prop="sv_mr_name" showTooltip width="150"></my-table-cell>
                    <my-table-cell label="订单类型" prop="sv_register_name" width="100">
                        <template v-slot:default="row">
                            <el-tag :type="row.sv_register_abbr == '退' ? 'danger' : 'success'" size="mini">{{ row.sv_register_abbr }}</el-tag>
                            {{ row.sv_register_name }}
                        </template>
                    </my-table-cell>
                    <my-table-cell label="项目名称" prop="sv_product_name" width="180" showTooltip></my-table-cell>
                    <my-table-cell label="收费标准" prop="sv_charging_standards" width="200" showTooltip></my-table-cell>
                    <my-table-cell label="购买数量" prop="sv_buy_num" align="right" width="180" showTooltip></my-table-cell>
                    <my-table-cell label="总价" prop="sv_total_price" align="right" width="120">
                        <template v-slot:default="row">￥{{ $app.moneyFixed(row.sv_total_price,2) }}</template>
                    </my-table-cell>
                    <my-table-cell label="赠送数量" prop="sv_give_num" align="right" width="120"></my-table-cell>
                    <my-table-cell label="小计金额" prop="sv_subtotal" align="right" width="130">
                        <template v-slot:default="row">
                            <el-tag :type="row.sv_order_type == '退' ? 'danger' : 'success'" size="mini">{{ row.sv_register_abbr }}</el-tag>
                            ￥{{ $app.moneyFixed(row.sv_subtotal,2) }}
                        </template>
                    </my-table-cell>
                    <my-table-cell width="10" prop="grap"></my-table-cell>
                    <my-table-cell label="业绩归属人" prop="commission_peoples_name" width="150"></my-table-cell>
                    <my-table-cell label="经办人" prop="sv_handled_by" width="150"></my-table-cell>
                    <my-table-cell label="经办日期" prop="sv_order_time" width="150" showTooltip></my-table-cell>
                    <my-table-cell label="订单状态" prop="sv_state_name" width="80"></my-table-cell>
                </my-table>
            </div>
            <div class="summary" v-if="total > 0">
                <div class="in">
                    <div class="item">
                        <el-tag type="success" size="mini">总收入</el-tag>
                        ￥{{ $app.moneyFixed(values.total_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="success" size="mini">收</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_hour_num || 0 }}课时 金额￥{{ $app.moneyFixed(values.total_hour_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="success" size="mini">收</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_day_num || 0 }}天 金额￥{{ $app.moneyFixed(values.total_day_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="success" size="mini">收</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_month_num || 0 }}月 金额￥{{ $app.moneyFixed(values.total_month_subtotal||0,2)}}
                    </div>
                    <div class="item">
                        <el-tag type="success" size="mini">收</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_time_num || 0 }}期 金额￥{{ $app.moneyFixed(values.total_time_subtotal || 0,2) }}
                    </div>
                </div>
                <div class="out">
                    <div class="item">
                        <el-tag type="danger" size="mini">总支出</el-tag>
                        ￥{{ $app.moneyFixed(values.total_return_subtotal || 0,2)}}
                    </div>
                    <div class="item">
                        <el-tag type="danger" size="mini">退</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_return_hour_num || 0 }}课时 金额￥{{ $app.moneyFixed(values.total_return_hour_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="danger" size="mini">退</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_return_day_num || 0 }}天 金额￥{{ $app.moneyFixed(values.total_return_day_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="danger" size="mini">退</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_return_month_num || 0 }}月 金额￥{{ $app.moneyFixed(values.total_return_month_subtotal || 0,2) }}
                    </div>
                    <div class="item">
                        <el-tag type="danger" size="mini">退</el-tag>
                        <el-tag type="info" size="mini">报名/续报</el-tag>
                        <el-tag type="info" size="mini">课程</el-tag>
                        数量：{{ values.total_return_time_num || 0 }}期 金额￥{{ $app.moneyFixed(values.total_return_time_subtotal || 0,2) }}
                    </div>
                </div>
            </div>
            <div class="pageWrap" v-if="total > 0">
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }"
                    @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <member-list :visible.sync="memberListStatus" title="选择学员" :syncStore="false"
            @selectMember="handleMemberInfo"></member-list>
    </div>
</template>

<style lang="scss" scoped>
@import './detail.scss';
</style>
<script src="./detail.js"></script>

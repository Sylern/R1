<template>
    <div class="courseCard">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="handleDownload">导出</div>
                </div>
                <div class="searchInput">
                    <el-input v-model.trim="queryEntity.keywards" placeholder="会员名称/手机号" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                        <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">生效状态：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_open_card_state" placeholder="选择开卡状态" @change="handleSearch">
                                <el-option v-for="item in openCardStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <!-- <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">入场卡类型：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.sv_card_type" placeholder="选择入场卡类型" @change="handleSearch">
                                <el-option v-for="item in cardTypes" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div> -->
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">生效时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker allSelect :paramData="[queryEntity.sv_start_datetime, queryEntity.sv_end_datetime]" @change="handleChangeTime($event, 'expiration')"></date-time-picker>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">开卡时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_expiration_datetime, queryEntity.sv_end_expiration_datetime]" @change="handleChangeTime($event)"></date-time-picker>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">购买时间：</div>
                        <div class="rep_qbfi_label">
                            <date-time-picker :paramData="[queryEntity.sv_start_order_datetime, queryEntity.sv_end_order_datetime]" @change="handleChangeTime($event, 'order')"></date-time-picker>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <el-table ref="multipleTable" :data="dataList" tooltip-effect="dark" height="100%" style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column prop="sv_mr_name" label="会员" width="100" align="left"> </el-table-column>
                    <el-table-column prop="sv_mr_mobile" label="手机号码" width="120" align="left"> </el-table-column>
                    <el-table-column prop="sv_p_name" label="卡名称" width="120"></el-table-column>
                    <el-table-column prop="sv_state" label="状态" width="100">
                        <template v-slot:default="{ row }">
                            <span :class="row.sv_state ? 'status' : 'status-err'"></span>{{ row.sv_state ? '有效' : '失效' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="额度状况" width="300" align="left">
                        <template v-slot:default="{ row }">
                            <div class="limit-item">
                                <span>总计:{{row.sv_limit_status.sv_TotalLimit}}</span>
                                <span>剩余:{{row.sv_limit_status.sv_RemainingLimit}}</span>
                            </div>
                            <div class="limit-item">
                                <span>赠总:{{row.sv_limit_status.sv_TotalGive}}</span>
                                <span>赠余:{{row.sv_limit_status.sv_RemainingGive}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sv_order_datetime" label="购买时间" width="160" align="left">
                        <template v-slot:default="{ row }">
                            <div>
                                <span :class="row.sv_open_card_state ? 'status' : 'status-err'"></span>
                                {{ row.sv_open_card_state?'已开卡':'未开卡' }}
                            </div>
                            {{row.sv_order_datetime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="有效期" width="180">
                        <template v-slot:default="{ row }">
                            <div>{{row.sv_start_validity_date}} 至</div>
                            <div>{{ row.sv_end_validity_date}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="消费状况" width="300" align="left">
                        <template v-slot:default="{ row }">
                            <div>实收金额:￥{{$app.moneyFixed(row.sv_consumption_status.sv_ActualAmount,2)}}</div>
                            <div class="limit-item">
                                <span>剩余摊销:￥{{$app.moneyFixed(row.sv_consumption_status.sv_RemainingAmortization,2)}}</span>
                                <span>摊销总额:￥{{$app.moneyFixed(row.sv_consumption_status.sv_AmortizationTota,2)}}</span>
                            </div>
                            <!-- <div>实收金额：￥{{$app.moneyFixed(row.sv_consumption_status.sv_ActualAmount,2)}}</div>
                            <div>剩余摊销：￥{{$app.moneyFixed(row.sv_consumption_status.sv_RemainingAmortization,2)}}</div>
                            <div>摊销总额：￥{{$app.moneyFixed(row.sv_consumption_status.sv_AmortizationTota,2)}}</div> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="salesperson" label="销售" width="120" align="left"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <!-- <template v-slot:default="{ row }">
                            <el-button type="text" @click="detailHandle(row)">详情</el-button>
                            <span style="padding:0 5px"></span>
                            <el-dropdown>
                                <el-button type="text">更多<i class="el-icon-arrow-down"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>打印小票</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template> -->
                    </el-table-column>
                </el-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary">
                    <!-- <div class="btnItem btnBasic" @click="showGift = true">赠送额度</div>
                    <div class="btnItem btnBasic" @click="showRegion = true">变更入场区域</div>
                    <div class="btnItem btnBasic" @click="showEffective = true">延长有效期</div> -->
                </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.pageIndex" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <dcDialog title="赠送额度" width="430" height="320" v-if="showGift" @close="showGift = false">
            <div class="gift-content queryFilter">
                <div class="item">
                    <div class="label"><span class="require">*</span>赠送额度</div>
                    <div class="value">
                        <el-input placeholder="请输入内容" v-model="input2">
                            <template slot="append">次/天</template>
                        </el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="label">备注</div>
                    <div class="value">
                        <el-input type="textarea" rows="5" placeholder="请输入内容" v-model="input2"> </el-input>
                    </div>
                </div>
                <div class="foot">
                    <div class="btnItem btnBasic" @click="showGift = false">取消</div>
                    <div class="btnItem btnPrimary">确定</div>
                </div>
            </div>
        </dcDialog>
        <dcDialog title="延长有效期" width="430" height="320" v-if="showEffective" @close="showEffective = false">
            <div class="gift-content queryFilter">
                <div class="item">
                    <div class="label"><span class="require">*</span>延长天数</div>
                    <div class="value">
                        <el-input placeholder="请输入内容" v-model="input2">
                            <template slot="append">次/天</template>
                        </el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="label">备注</div>
                    <div class="value">
                        <el-input type="textarea" rows="5" placeholder="请输入内容" v-model="input2"> </el-input>
                    </div>
                </div>
                <div class="foot">
                    <div class="btnItem btnBasic" @click="showEffective = false">取消</div>
                    <div class="btnItem btnPrimary">确定</div>
                </div>
            </div>
        </dcDialog>
        <dcDialog title="延长有效期" width="450" height="320" v-if="showRegion" @close="showRegion = false">
            <div class="region">
                <div class="region-content">
                    <div class="lebel">入场区域</div>
                    <div class="value">
                        <el-scrollbar style="width:100%;height:100%">
                            <div class="scroll-content">
                                <el-checkbox-group v-model="checkList">
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 A"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 B"></el-checkbox>
                                    </div>
                                    <div class="item">
                                        <el-checkbox label="复选框 C"></el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="foot">
                    <div class="btnItem btnBasic" @click="showRegion = false">取消</div>
                    <div class="btnItem btnPrimary">确定</div>
                </div>
            </div>
        </dcDialog>
    </div>
</template>
<script src="./courseCard"></script>
<style lang="scss" scoped>
@import './courseCard.scss';
</style>

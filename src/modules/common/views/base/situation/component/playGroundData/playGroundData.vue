<template>
    <div class="playGroundData" v-if="show" @click.stop="">
        <div class="head">
            <div class="left">
                <div class="back" @click.stop="$emit('input', false)">
                    <cmdIcon type="icon-fanhui" size="24"></cmdIcon>
                    <div class="txt">返回</div>
                </div>
                <!-- 出入闸状态，null：全部，1：离场，2：在场 -->
                <!-- <div :class="['txt', 'h-btn', { 'txt-active': query.InOutStatus === null }]" @click="statusHandle(null)">全部 </div> -->
                <div :class="['txt', 'h-btn', { 'txt-active': query.InOutStatus === 2 }]" @click="statusHandle(2)">在场</div>
                <div :class="['txt', 'h-btn', { 'txt-active': query.InOutStatus === 1 }]" @click="statusHandle(1)">中途离场</div>
                <div class="refresh" @click="refreshHandle">
                    <div :class="['el-icon-refresh', { 'refresh-active': isRefresh }]"> </div>
                    <div class="txt">刷新</div>
                </div>
            </div>
            <div class="center">
                场地<span>BI</span>
            </div>
            <div class="op">
                <div :class="['search',{'search-has-content':query.BarCode}]" @click="$refs.sInput.focus()">
                    <cmdIcon type="icon-sousuo" size="24"></cmdIcon>
                    <div :class="['p-input',{'p-input-has-content':query.BarCode}]" @click.stop="">
                        <input ref="sInput" @keyup.enter="searchHandle" v-model="query.BarCode" @keyup.stop="" placeholder="请输入票号" />
                        <i v-if="query.BarCode" @click="query.BarCode = ''" class="close el-icon-circle-close"></i>
                    </div>
                    <div class="txt" @click="searchHandle">搜索</div>
                </div>
                <div :class="['txt', 'h-btn', { 'txt-active': dateType === 'today' }]" @click="dateSelectHandle('today')">今日</div>
                <div :class="['txt', 'h-btn', { 'txt-active': dateType === 'yesterday' }]" @click="dateSelectHandle('yesterday')">昨日</div>
                <div :class="['txt', 'h-btn', { 'txt-active': dateType === 'week' }]" @click="dateSelectHandle('week')">本周</div>
                <div :class="['txt', 'h-btn', { 'txt-active': dateType === 'other' }]">
                    其它
                    <div class="date">
                        <dateTimePicker :paramData="[query.BeginDate, query.EndDate]" needTimePicker @change="dateSelectHandle('other', $event)"></dateTimePicker>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-content">
            <div class="p-total">
                <div class="item p-border">
                    <div class="value">{{ total }}</div>
                    <div class="des">{{ `${query.InOutStatus === 2 ? '在场票数' : '离场票数'}` }}</div>
                </div>
                <div class="item p-border">
                    <div class="value">{{ timeoutCount }}</div>
                    <div class="des">超时票数</div>
                </div>
                <div class="item p-border">
                    <div class="value">{{ $app.moneyFixed(paybackMoney, 2) }}</div>
                    <div class="des">应补金额(元)</div>
                </div>
                <div class="item p-border">
                    <div class="value">{{ $app.moneyFixed(refundMoney, 2) }}</div>
                    <div class="des">应退金额(元)</div>
                </div>
            </div>
            <div class="table-container p-border">
                <div class="p-table">
                    <div class="t-head">
                        <div class="tr">
                            <div class="th">
                                <el-checkbox v-model="checkedAll" @change="checkAllHandle"></el-checkbox>
                                <div class="checkbox">
                                    <div :class="['check', { 'checkbox-active': checkedAll }]">
                                        <cmdIcon type="icon-gougou" size="10" color="#010429"></cmdIcon>
                                    </div>
                                </div>
                            </div>
                            <div class="th">序号</div>
                            <div class="th">票码</div>
                            <div class="th">项目名称</div>
                            <div class="th">进场时间</div>
                            <div class="th">出场时间</div>
                            <div class="th">应补金额</div>
                            <div class="th">游玩时长</div>
                            <div class="th">应退金额</div>
                        </div>
                    </div>
                    <el-scrollbar class="scrollbar">
                        <div :class="['tr', { 'tr-active': item.checked }]" v-for="(item, index) in list" :key="index">
                            <div class="td">
                                <el-checkbox v-model="item.checked" @change="checkHandle($event, item.id)"></el-checkbox>
                                <div :class="['checkbox', { 'checkbox-active': item.checked }]">
                                    <div class="check">
                                        <cmdIcon type="icon-gougou" size="10" color="#010429"></cmdIcon>
                                    </div>
                                </div>
                            </div>
                            <div class="td"> {{ `${(query.Page - 1) * query.Size + index + 1}`.padStart(Math.max(`${total}`.length, 2), '0') }} </div>
                            <div class="td">{{ item.sv_bar_code }}<span class="copy" v-copy="item.sv_bar_code"><i class="el-icon-document-copy"></i></span></div>
                            <div class="td">
                                <el-tooltip class="td-tooltip" effect="dark" :content="item.sv_p_name" placement="top">
                                    <span style="width:100%;">{{ item.sv_p_name }}</span>
                                </el-tooltip>
                            </div>
                            <div :class="['td', { 'timeout': item.paybackMoney > 0 }]"> {{ $app.currentTime(new Date(item.sv_in_gate_datetime), "yyyy-MM-dd HH:mm:ss") }} </div>
                            <div :class="['td', { 'timeout': item.paybackMoney > 0 }]">
                                {{ `${item.sv_in_out_status == 1 && item.lastLeaveTime? $app.currentTime(new Date(item.lastLeaveTime), "yyyy-MM-dd HH:mm:ss"):''}` }}
                            </div>
                            <div :class="['td', { 'timeout': item.paybackMoney > 0 }]">{{ $app.moneyFixed(item.paybackMoney, 2) }}</div>
                            <div :class="['td', { 'timeout': item.paybackMoney > 0 }]">{{ item.sv_duration }}(分钟)</div>
                            <div class="td">{{ $app.moneyFixed(item.refundMoney, 2) }}</div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="p-pages">
                <div class="left">
                    <div class="btn" @click="showClearDlg = true; endTime = ''">一键清场</div>
                    <div class="btn" @click="verifyHandle">验票</div>
                </div>
                <div class="right">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" background :current-page="query.Page" :page-sizes="[10, 20, 30, 40, 50, 60]" :page-size="query.Size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                    <div :class="['btn', { 'btn-disable': checkedJson.length == 0 }]" @click="cleanHandle">确认清场</div>
                </div>
            </div>
        </div>

        <el-dialog class="deepDlg clearDlg" :visible.sync="showClearDlg" :close-on-click-modal="false" width="26%" :show-close="false" :modal="false">
            <div class="p-dlg p-border">
                <div class="title">截止时间</div>
                <div class="clear-time">
                    {{ endTime || "请选择截止时间" }}
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" type="datetime" v-model="endTime" :picker-options="{ disabledDate: (time) => time.getTime() > Date.now() }"> </el-date-picker>
                </div>
                <div class="btns">
                    <div class="btn" @click="showClearDlg = false">取消</div>
                    <div :class="['btn', { 'btn-disable': !endTime }]" @click="cleanAllHandle">确认</div>
                </div>
            </div>
        </el-dialog>

        <dcDialog v-if="showNoDlg" width="400" height="130" @close="barCode='';showNoDlg = false">
            <div class="search-dlg">
                <div class="search-no">
                    <div class="search-icon">
                        <cmdIcon type="icon-sousuo" size="30" color="rgba(var(--main-theme-color), 1);"></cmdIcon>
                    </div>
                    <input ref="barCode" @click.stop="" @keyup.enter.stop="searchNOHandle" type="text" placeholder="请输入票码" v-model="barCode">
                </div>
                <div class="search-foot"> ↵ 按回车键搜索 </div>
            </div>
        </dcDialog>

        <dcDialog title="验票" v-if="showInOutVerify" width="1100" height="700" @close="barCode='';showInOutVerify = false">
            <div class="in-out-verify">
                <div class="content">
                    <div class="left">
                        <div class="searchInput">
                            <el-input v-model.trim="barCode" placeholder="请输入票码" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                                <i @click="handleSearch" slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <div class="top">
                            <div class="item">
                                <div class="label">闸机</div>
                                <div class="value">
                                    <el-select v-model="currentGateSN" placeholder="">
                                        <el-option v-for="item in outGates" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <template v-if="verifyName == 'outVerify' && outInBtnTxt != '验票出闸'">
                                <div class="item">
                                    <div class="label">{{outInBtnTxt=='补款出闸'?'应补金额':'退款金额'}}</div>
                                    <div class="value " v-if="outInBtnTxt=='补款出闸'">{{ $app.moneyFixed(outInfo.paybackMoney || 0, 2) }}</div>
                                    <div class="value" v-else>{{ $app.moneyFixed(outInfo.refundMoney || 0, 2) }}</div>
                                </div>
                                <div class="item" v-if="outInBtnTxt=='补款出闸'">
                                    <div class="label">实收金额</div>
                                    <input class="value" type="text" placeholder="请输入实收金额" v-model="payInfo.money" @keyup="amountChangeHandle">
                                </div>
                            </template>
                        </div>
                        <div class="bottom">
                            <div class="pay-btn" v-show="verifyName == 'outVerify' && (outInfo.paybackMoney || 0) > 0">
                                <pay-type-list ref="payTypeList" :payInfo="payInfo" :import_member_id="memberInfo.member_id" :isDisabled="isSubmitting" @paySuccess="scanPaySuccess" @closeScan="handleCloseScan"></pay-type-list>
                            </div>
                            <div class="btns">
                                <div v-if="halfwayOutTxt != ''" :class="['btnItem', 'btnPrimary',{ 'disable': currentGateSN == '', 'errBtn': currentGateSN != '' }]" @click="opGateHandle('halfway')">{{ halfwayOutTxt }}</div>
                                <div :class="['btnItem', 'btnPrimary',{ 'disable': currentGateSN == '' }]" @click="opGateHandle('')">{{ outInBtnTxt }} </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="member">
                            <div class="member-info">
                                <div class="member-head" :style="{ backgroundImage: `${memberInfo.sv_mr_headimg ? `url(${memberInfo.sv_mr_headimg})` : ''}` }">
                                    <cmdIcon v-if="!memberInfo.sv_mr_headimg" type="icon-headDefault" size="30" color="#E6E6E6"></cmdIcon>
                                </div>
                                <div class="name-phone">
                                    <div class="name">{{ memberInfo.sv_mr_name }}</div>
                                    <div class="phone">{{ memberInfo.sv_mr_mobile }}</div>
                                </div>
                            </div>
                            <div class="member-val">
                                <div class="val-item">
                                    <div class="des">积分</div>
                                    <div class="val">{{ memberInfo.sv_mw_availablepoint||0 }}</div>
                                </div>
                                <div class="val-item">
                                    <div class="des">余额</div>
                                    <div class="val">{{ $app.moneyFixed(memberInfo.sv_mw_availableamount||"0", 2) }}</div>
                                </div>
                                <div class="val-item">
                                    <div class="des">折扣</div>
                                    <div class="val"> {{ memberInfo.sv_ml_commondiscount?`${memberInfo.sv_ml_commondiscount}折`:'--' }}</div>
                                </div>
                                <div class="val-item">
                                    <div class="des">等级</div>
                                    <div class="val">{{ memberInfo.sv_ml_name||"--" }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="verify-info">
                            <el-scrollbar style="width: 100%;height: 100%; padding-top: 10px;">
                                <div v-show="verifyName == 'inVerify'" class="in-verify">
                                    <div class="in-item" v-for="(item, index) in inInfos" :key="index" @click="inTickChangeHandle(item)">
                                        <div class="tick-title">
                                            <el-checkbox @input="inTickChangeHandle(item)" :value="consumeId == item.id"> {{ item.sv_p_name }} </el-checkbox>
                                            <el-tooltip placement="right"><span slot="content" v-html="item.payDescription"></span><span class="el-icon-question"></span> </el-tooltip>
                                        </div>
                                        <!-- <div class="item">
                                            <div class="label">使用状态</div>
                                            <div class="value">已使用</div>
                                        </div> -->
                                        <!-- <div class="item">
                                            <div class="label">总次数</div>
                                            <div class="value">10次</div>
                                        </div> -->
                                        <div class="item" v-if="item.sv_consume_count > 0">
                                            <div class="label">已用次数</div>
                                            <div class="value">{{ item.sv_consume_count }}次</div>
                                        </div>
                                        <!-- <div class="item">
                                            <div class="label">剩余次数</div>
                                            <div class="value">10次</div>
                                        </div> -->
                                        <template v-if="item.sv_in_out_status == 1">
                                            <div class="item" v-if="item.lastLeaveTime">
                                                <div class="label">出场时间</div>
                                                <div class="value">{{ $app.currentTime(new Date(item.lastLeaveTime), "yyyy-MM-dd HH:mm:ss") }}</div>
                                            </div>
                                            <div class="item" v-if="item.sv_allow_leave_time > 0 ">
                                                <div class="label">允许离场</div>
                                                <div class="value">{{ item.sv_allow_leave_time }}分钟</div>
                                            </div>
                                        </template>
                                        <div class="item">
                                            <div class="label">购买时间</div>
                                            <div class="value">{{ item.sv_creation_date }}</div>
                                        </div>
                                    </div>

                                </div>
                                <div v-show="verifyName == 'outVerify' && outInfo.sv_in_gate_sn" class="out-verify">
                                    <div class="item">
                                        <div class="label">入场闸机码</div>
                                        <div class="value">{{ outInfo.sv_in_gate_sn || "" }}</div>
                                    </div>
                                    <div class="item">
                                        <div class="label">套票类型</div>
                                        <div class="value">{{ outInfo.chargeTypeString || "" }}</div>
                                    </div>
                                    <div class="item">
                                        <div class="label">游玩时间</div>
                                        <div class="value">{{ outInfo.sv_duration || 0 }}分钟</div>
                                    </div>
                                    <div class="item">
                                        <div class="label">消费金额</div>
                                        <div class="value">{{ $app.moneyFixed(outInfo.sv_base_money || 0, 2) }}</div>
                                    </div>
                                    <div class="item">
                                        <div class="label">进场时间</div>
                                        <div class="value">{{ outInfo.sv_in_gate_datetime || "" }}</div>
                                    </div>
                                    <div class="item">
                                        <div class="label">扣费说明</div>
                                        <div class="value" style="line-height: 25px;" v-html="outInfo.payDescription"></div>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </dcDialog>

    </div>
</template>
<script src='./playGroundData.js'></script>
<style lang='scss' scoped>
@import './playGroundData.scss';
</style>
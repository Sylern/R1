<template>
    <div class="storeContent">
        <!-- 营业概况 -->
        <div class="select_wrap">
            <div class="select_title">营业概况</div>
            <div class="select_item">
                <div class="date_item" :class="{ 'active': businessDateType == '1' }" @click="handleBusinessDate('1')">今日
                </div>
                <div class="date_item" :class="{ 'active': businessDateType == '2' }" @click="handleBusinessDate('2')">昨日
                </div>
                <div class="date_item" :class="{ 'active': businessDateType == '3' }" @click="handleBusinessDate('3')">近7天
                </div>
                <div class="date_item" :class="{ 'active': businessDateType == '4' }" @click="handleBusinessDate('4')">近30天
                </div>
                <div class="date_item" :class="{ 'active': businessDateType == '5' }" @click="handleDatePick">自定义</div>
                <el-date-picker :picker-options="pickerOptions" @change="handleChangeTime" v-model="businessDate"
                    :default-time="['00:00:00', '23:59:59']" prefix-icon="none" clear-icon="none" range-separator=""
                    type="datetimerange" class="date_picker" ref="datePicker"></el-date-picker>
                <!-- <el-button v-if="hasBigData" class="btnItem btnBasic small store_btn" @click="handleToOtherModel('数据信息')">数据信息</el-button> -->
            </div>
        </div>
        <!-- 常用功能 -->
        <div class="date_tip">
            <div class="tip_item">
                <div class="tip_title">综合收入
                    <el-tooltip effect="dark" placement="top"
                        content="温馨提示：综合总收入=会员总收入+散客消费总额+会员消费总额-会员储值卡消费-赊账-会员退货合计（不含储值卡的退货金额）-散客退货合计+会员还款-找零汇总"
                        class="etr_tooltip">
                        <el-radio v-model="monthTrendType" label="1"></el-radio>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </div>
                <div class="tip_num"><span v-if="JurisdictionObj.Consolidated_Income">￥</span>{{
                    JurisdictionObj.Consolidated_Income ? businessData.amount_all : '***' }}
                </div>
            </div>
            <div class="tip_item">
                <div class="tip_title">订单数</div>
                <div class="tip_num">{{ JurisdictionObj.OrderTransaction_Number ? businessData.count_order : '***' }}</div>
            </div>
            <div class="tip_item">
                <div class="tip_title">会员消费金额</div>
                <div class="tip_num"><span v-if="JurisdictionObj.Member_Consume">￥</span>{{ JurisdictionObj.Member_Consume ?
                    businessData.expense_member : '***' }}
                </div>
            </div>
            <div class="tip_item">
                <div class="tip_title">新增会员</div>
                <div class="tip_num">{{ businessData.count_newmember }}</div>
            </div>
            <div class="tip_item">
                <div class="tip_title">退款</div>
                <div class="tip_num"><span v-if="JurisdictionObj.Refund_Money">￥</span>{{ JurisdictionObj.Refund_Money ?
                    businessData.refund : '***' }}
                </div>
            </div>
            <div class="tip_item">
                <div class="tip_title">优折赠金额</div>
                <div class="tip_num"><span v-if="JurisdictionObj.Preferential_Amount">￥</span>{{
                    JurisdictionObj.Preferential_Amount ? businessData.free : '***' }}
                </div>
            </div>
        </div>
        <!-- echarts列表 近30日趋势 -->
        <div class="echarts_list">
            <div class="echarts_item">
                <div v-if="JurisdictionObj.Sales_Trend" class="echart_title">
                    <div>最近30日销售趋势</div>
                    <div class="et_right">
                        <el-radio v-model="monthTrendType" label="1">商品销售</el-radio>
                        <el-radio v-model="monthTrendType" label="2">订单笔数</el-radio>
                        <el-radio v-model="monthTrendType" label="3">新增会员</el-radio>
                        <i class="el-icon-setting" @click="selectChartWrap = true"></i>
                    </div>
                </div>
                <div v-else class="echart_title no_echart_title">
                    <i class="el-icon-setting" @click="selectChartWrap = true"></i>
                </div>
                <div v-if="JurisdictionObj.Sales_Trend" class="echartWrap" id="monthTrendEchart"></div>
            </div>

            <!-- 常用功能 -->
            <div class="function_wrap">
                <div class="wrap_title">
                    <div>常用功能</div>
                    <!-- <div><el-button type="text" @click="commonFunction=true">自定义</el-button></div> -->
                </div>
                <div class="function_list">
                    <template v-for="(item, index) in commonFuncList">
                        <div class="function_item" :key="index" v-if="commonFuncIsShow(item)">
                            <div class="function_item_wrap" @click="handleCommonFunc(item)">
                                <img class="img icon" :src="item.icon">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="echarts_item" v-for="(item, index) in chartsList" :key="index">
                <div v-if="handleJurisdiction(item.type)">
                    <div class="echart_title">
                        <div>{{ handleItemName(item.type) }}</div>
                        <div class="et_right" v-if="item.type !== 'E'">
                            <div class="date_item" :class="{ 'active': otherChartsDate[index] == '1' }"
                                @click="handleChartsDate('1', index, item.type)">今日</div>
                            <div class="date_item" :class="{ 'active': otherChartsDate[index] == '2' }"
                                @click="handleChartsDate('2', index, item.type)">昨日</div>
                            <div class="date_item" :class="{ 'active': otherChartsDate[index] == '6' }"
                                @click="handleChartsDate('6', index, item.type)">本周</div>
                            <div class="date_item" :class="{ 'active': otherChartsDate[index] == '7' }"
                                @click="handleChartsDate('7', index, item.type)">本月</div>
                        </div>
                    </div>
                    <div class="echartWrap">
                        <div class="echart_item" :id="handleChartId(item.type)"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 更多服务 -->
        <div class="service" v-if="!isNewVersion">
            <div class="service_wrap">
                <div class="wrap_title">
                    <div>更多服务</div>
                </div>
                <div class="serve_list">
                    <div class="serve_item" @click="handleToOtherModel(item.sv_func_name, item.expired)"
                        v-for="item in promotionList" :key="item.sv_func_id">
                        <div class="icon"><span class="first">{{ item.title[0] }}</span><span class="last">{{ item.title[1]
                        }}</span></div>
                        <div class="text">{{ item.sv_func_name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <commonCharts :visible="selectChartWrap" :chartsList="otherCharts" @updata="updata" />
        <commonFunction :visible="commonFunction" @updata="updata" />
    </div>
</template>

<script src="./overViewCommon.js"></script>

<style lang="scss" scoped>
@import './overViewCommon.scss';

.popover {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 13px;
    width: 200px;

    .des {
        color: #000000;
        margin: 11px 0 0 0;
    }

    .btnPopover {
        display: flex;
        color: #2b82fd;
        margin: 10px 0 0 0;
    }

    .btnPopover:hover {
        text-decoration: underline;
        color: rgba(43, 130, 253, 0.7);
        cursor: pointer;
    }

    .btnPopover.active {
        color: #ff1500;
    }

    .btnPopover.active:hover {
        text-decoration: none;
        cursor: default;
    }


}</style>

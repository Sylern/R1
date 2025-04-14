<!-- 美业挂单列表 -->
<template>
    <div class="meiye">
        <div class="peddingList" ref="peddingList" v-show="!showServicesPrrson && !showCashier" tabindex="0" @keyup.enter.stop="handleEnter">
            <div class="topWrap">
                <div class="menuLeft">
                    <div class="menuWrap">
                        <!-- <div class="item">全部</div>
                        <div class="item selected">进行中</div>
                        <div class="item">已结账</div>
                        <div class="item">已取消</div> -->
                        <el-date-picker class="datePicker" v-model="queryList.date" type="date" placeholder="选择日期" @change="dateChange"></el-date-picker>
                        <div class="btnDownSelected" @click="filterServicerStatus = true">
                            <span>{{btnFilterText}}</span>
                            <i class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                    <div class="typeWrap">
                        <span class="iconGreen"></span>
                        <span>散客</span>
                        <span class="iconRed"></span>
                        <span>会员</span>
                    </div>
                </div>
                <div class="btnRight">
                    <el-input v-if="isSetHandNumber" ref="isSetHandNumber" v-model="queryList.sv_catering_grade" @change="getServiceOrders(true)" clearable placeholder="请输入手牌号"></el-input>
                    <div class="btn" @click="handleOrderStart">
                        <span>开单</span>
                    </div>
                </div>
            </div>
            <div class="contentWrap">
                <div class="listWrap">
                    <el-empty v-if="orderList.length === 0 && afterPedding" description="没有挂单数据"></el-empty>
                    <el-scrollbar ref="scrollContent" style="width: 100%; height: 100%;">
                        <div class="listWrap_view" ref="peddingListWrap">
                            <div class="item" v-for="(item,index) in orderList" :key="index" @click="handleTakeOrder(item)">
                                <div class="itemTopWrap">
                                    <div class="typeIcon" :class="{'isMemberVip': !$app.isNull(item.member_id) && item.member_id != 0}">
                                        <span>{{index+1}}</span>
                                        <span class="corver"></span>
                                    </div>
                                    <div class="itemTitle">
                                        <span>{{item.wt_datetime}}</span>
                                    </div>
                                </div>
                                <div class="itemContent">
                                    <div class="itemOrderWrap">
                                        <div class="itemLine">
                                            <div class="key">
                                                <span>开单人</span>
                                            </div>
                                            <div class="value">
                                                <span>{{ item.sv_bizemployee_id === 0 ? userInfo.sv_ul_name : item.sv_bizemployee_name }}</span>
                                            </div>
                                        </div>
                                        <div class="itemLine">
                                            <div class="key">
                                                <span>单号</span>
                                            </div>
                                            <div class="value">
                                                <span>{{item.wt_nober}}</span>
                                            </div>
                                        </div>
                                        <div class="itemLine" v-if="isSetHandNumber">
                                            <div class="key">
                                                <span>手牌号</span>
                                            </div>
                                            <div class="value">
                                                <span>{{item.sv_catering_grade}}</span>
                                            </div>
                                        </div>
                                        <div class="itemLine" v-if="item.sv_mr_name">
                                            <div class="memberInfo">
                                                <span class="name">{{item.sv_mr_name}}</span>
                                                <span>{{item.sv_mr_mobile}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="itemServiceWrap">
                                        <div class="serviceTitle">
                                            <div class="key">
                                                <span>项目/产品</span>
                                            </div>
                                            <div class="value">
                                                <span>价格</span>
                                            </div>
                                        </div>
                                        <div class="listContent">
                                            <div class="itemLine" v-for="(data,pos) in item.product" :key="pos">
                                                <div class="key">
                                                    <span>{{data.product_name}}</span>
                                                </div>
                                                <div class="value">
                                                    <span>{{$app.moneyFixed(data.product_total)}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="itemBottomWrap">
                                    <div class="itemPriceWrap">
                                        <div class="leftIcon" @click.stop="handleDelete(item)">
                                            <i class="el-icon-delete"></i>
                                        </div>
                                        <div class="rightValue">
                                            <span>总价</span>
                                            <span class="price">¥{{$app.moneyFixed(item.sv_actual_money)}}</span>
                                        </div>
                                    </div>
                                    <div class="bottomLine">
                                        <span class="icon" v-for="(item,index) in 13" :key="index"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="workerWrap">
                    <div class="text">
                        <span>服务中</span>
                    </div>
                    <div class="workerListWrap">
                        <el-scrollbar ref="workerListScroll" style="width: 100%; height: 100%;">
                            <div class="item" v-for="(item, index) in employeeList" @click="handlEemployee(item)" :key="index">
                                <div class="flag" v-if="item.is_service">服务中</div>
                                <div class="employeePhoto">
                                    <cmd-icon v-if="$app.isNull(item.sv_employee_photo)" type="icon-huiyuan1" size="100" color="#8056F7"></cmd-icon>
                                    <img class="img" v-else :src="imgBase + item.sv_employee_photo" />
                                </div>
                                <div class="textWrap">
                                    <el-tooltip effect="dark" placement="top" :content="item.sv_employee_name">
                                        <span>{{item.sv_employee_name}}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>
        <!-- 选择开单人 员工 -->
        <services-person-select v-if="showServicesPrrson" :pendingOrderId="pendingOrderId" @handleCashier="handleShowCashier" @handleBack="showPendingList"></services-person-select>
        <!-- 美业收银台 -->
        <m-cashier v-if="showCashier" :isOrderBack="isOrderBack" @handleBack="showPendingList"></m-cashier>
        <!-- 设置员工筛选-->
        <servicer-setting-single :visible.sync="filterServicerStatus" :hasBtnAll="true" @handleServicer="handleFilterServicer"></servicer-setting-single>
        <!-- 请输入牌号 -->
        <number-change :visible.sync="numberChangeStatus" title="请输入手牌号" :defaultNumber="inputHandNumber" noLimited @handleNumberChange="handleNumberChange"></number-change>
    </div>
</template>

<style lang="scss" scoped>
@import "./peddingList.scss"
</style>
<script src="./peddingList.js"></script>
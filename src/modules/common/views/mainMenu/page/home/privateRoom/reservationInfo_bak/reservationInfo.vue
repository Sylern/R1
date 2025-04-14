<!--预定详情弹窗-->
<template>
    <div class="reservationInfo" ref="reservationInfo" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="500" height="680" @close="closeDialog" zIndex="400">
            <div class="contentWrap">
                <div class="topWrap tableInfo" v-if="popTableInfo.sv_table_id">
                    <div class="tableTop">
                        <div class="tableName">{{ popTableInfo.sv_table_name }}</div>
                        <div class="tableDuration" v-if="!$app.isNull(billabletimeInfo.durationString)">
                            <i class="el-icon-time"></i>
                            <span>{{ billabletimeInfo.durationString }}</span>
                        </div>
                    </div>
                    <div class="memberInfo">
                        <div class="content">
                            <div class="userInfo">
                                <div class="left">
                                    <div class="logo">
                                        <el-image v-if="!$app.isNull(currentMemberInfo.sv_mr_headimg)" :src="$app.getImgUrl(currentMemberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(currentMemberInfo.sv_mr_headimg)]"></el-image>
                                        <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                    </div>
                                    <div class="nameWrap">
                                        <div class="nametext">
                                            <span class="name">{{ currentMemberInfo.sv_mr_name }}</span>
                                            <span class="flag" v-if="currentMemberInfo.sv_ml_name">{{ currentMemberInfo.sv_ml_name }}</span>
                                        </div>
                                        <div class="telephone">
                                            <div class="mobile item">
                                                <cmd-icon type="icon-phone-o" size="16" color="#333333"></cmd-icon>
                                                <span>{{ currentMemberInfo.sv_mr_mobile }}</span>
                                            </div>
                                            <div class="cardno item">
                                                <cmd-icon type="icon-memberCard" size="16" color="#333333"></cmd-icon>
                                                <el-tooltip effect="dark" placement="top" :content="'卡号：' + currentMemberInfo.sv_mr_cardno">
                                                    <span>{{ currentMemberInfo.sv_mr_cardno }}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right" @click.stop="">
                                    <!-- <div class="btn btnClear" @click="showMemberList">选择</div> -->
                                    <!-- <div class="btn btnRecharge" @click="showMemberRecharge">充值</div> -->
                                    <!-- <div class="btn btnRecharge" @click="handleClearMember">清除</div> -->
                                </div>
                            </div>
                            <div class="userRights">
                                <div class="item">
                                    <div class="key">余额</div>
                                    <div class="value">{{ currentMemberInfo.sv_mw_availableamount }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">积分</div>
                                    <div class="value">{{ currentMemberInfo.sv_mw_availablepoint }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">权益卡</div>
                                    <div class="value">{{ currentMemberInfo.micard_count || 0 }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">优惠券</div>
                                    <div class="value">{{ currentMemberInfo.couponCountNumber }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="timeInfo">
                        <div class="timeBox">
                            <div class="time">
                                <span class="date">{{ bookingInfo.sv_arrival_date ? bookingInfo.sv_arrival_date.substring(0, 10) : '' }}</span>
                                <span>{{ bookingInfo.sv_arrival_date ? bookingInfo.sv_arrival_date.substring(11, 16) : '' }}</span>
                            </div>
                            <div class="text">预定开始时间</div>
                        </div>
                        <div class="spaceBox">
                            <div class="line"></div>
                        </div>
                        <div class="timeBox">
                            <div class="time">
                                <span class="date">{{ bookingInfo.sv_arrival_end_date ? bookingInfo.sv_arrival_end_date.substring(0, 10) : '' }}</span>
                                <span>{{ bookingInfo.sv_arrival_end_date ? bookingInfo.sv_arrival_end_date.substring(11, 16) : '' }}</span>
                            </div>
                            <div class="text">预定结束时间</div>
                        </div>
                    </div>
                </div>
                <div class="topWrap shopInfo" v-else>
                    <img class="img" :src="store_logo" />
                    <div class="shopName">{{ userInfo.sv_us_name }}</div>
                    <div class="shopEmployee">
                        <span>操作员：{{ userInfo.sv_ul_name }}</span>
                        <span>店铺号码：{{ userInfo.sv_us_phone }}</span>
                    </div>
                </div>
                <div class="bottomWrap" v-if="popTableInfo.sv_table_id">
                    <div class="tableFn">
                        <div class="fnTitle">房台服务</div>
                        <div class="fnList">
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('scheduleStatus')">
                                    <cmd-icon class="btn_icon" type="icon-wodeyuyue" size="28" color="#333333"></cmd-icon>
                                    <div class="text">预约</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('reservationList')">
                                    <cmd-icon class="btn_icon" type="icon-kecheng" size="28" color="#333333"></cmd-icon>
                                    <div class="text">预约列表</div>
                                </div>
                            </div>
                            <!-- <div class="fnItem">
                                <div class="fnContent" :class="{ isDefault: !hasOccupy }" @click="handleFnItem('occupy', hasOccupy)">
                                    <cmd-icon class="btn_icon" type="icon-fangtaizhanyong" size="28" :color="!hasOccupy ? '#909090' : '#333333'"></cmd-icon>
                                    <div class="text">占用</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" :class="{ isDefault: !hasMaintenance }" @click="handleFnItem('maintenance', hasMaintenance)">
                                    <cmd-icon class="btn_icon" type="icon-fangtaiweihu" size="28" :color="!hasMaintenance ? '#909090' : '#333333'"></cmd-icon>
                                    <div class="text">维护</div>
                                </div>
                            </div> -->
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('changeTable')">
                                    <cmd-icon class="btn_icon" type="icon-huantai" size="28" color="#333333"></cmd-icon>
                                    <div class="text">换台</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Turn_On_The_Lights, fn: handleFnItem, param: ['kaideng', true] }">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                    <div class="text">开灯</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Turn_Off_The_Lights, fn: handleFnItem, param: ['guandeng', true] }">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="#333333"></cmd-icon>
                                    <div class="text">关灯</div>
                                </div>
                            </div>
                            <!-- <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('editRemark')">
                                    <cmd-icon class="btn_icon" type="icon-editRemark" size="28" color="#333333"></cmd-icon>
                                    <div class="text">备注</div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                    <el-button class="btnOrderCheck" v-repeatClick @click="handleClearTable">
                        <span>结束服务</span>
                    </el-button>
                </div>
                <div class="bottomWrap" v-else>
                    <div class="tableFn">
                        <div class="fnList">
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('recharge', true)">
                                    <cmd-icon class="btn_icon" type="icon-chongzhi" size="40" color="#000000"></cmd-icon>
                                    <div class="text">充值</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Add_Members, fn: showMemberAdd }">
                                    <cmd-icon class="btn_icon" type="icon-huiyuan" size="40" color="#000000"></cmd-icon>
                                    <div class="text">新增会员</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 房台列表弹窗 -->
            <pop-table-list :visible.sync="popTableListStatus" :dataObj="popTableData" @updateTable="handleUpdateTable"></pop-table-list>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './reservationInfo.scss';
</style>
<script src="./reservationInfo.js"></script>
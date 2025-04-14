<!--预订弹窗-->
<template>
    <div class="reservation" ref="reservation" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="740" title="预订" @close="closeDialog" zIndex="3001">
            <div class="contentWrap">
                <div class="leftWrap">
                    <div class="tableInfo">
                        <div class="name" v-if="tableInfo.sv_table_id">{{ tableInfo.sv_table_name }}</div>
                        <div class="area" v-if="tableInfo.sv_table_id">{{ tableInfo.sv_region_name }}</div>
                    </div>
                    <div class="infoLine billabletimeInfo">
                        <div class="key">计费规则</div>
                        <el-select class="selectBox" v-model="sv_billable_id" :disabled="editReservation.isEdit" placeholder="请选择" @change="handleChangeBillable">
                            <el-option v-for="(item, index) in billabletimeList" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                    <div class="timeInfo">
                        <div class="dateWrap">
                            <div class="btn btnLast" v-if="!editReservation.isEdit" :class="{ disabled: isToday }" @click="handleChangeDate('last')">
                                <i class="el-icon-arrow-left"></i>
                            </div>
                            <div class="dateText" v-if="currentDate">
                                <span>{{ currentDate +' '+ $app.convertWeek(currentDate) }}</span>
                                <span class="dateFlag" v-if="isToday">今天</span>
                            </div>
                            <div class="btn btnNext" v-if="!editReservation.isEdit" @click="handleChangeDate('next')">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="timeControl">
                            <div class="timeSelect">
                                <div class="timeBox">
                                    <div class="time" :class="{ canset: !editReservation.isEdit }">
                                        <span>{{ startTime ? startTime.substring(0, 5) : '请选择' }}</span>
                                        <i class="icon el-icon-edit" v-if="!editReservation.isEdit"></i>
                                        <el-time-select v-if="!editReservation.isEdit" placeholder="起始时间" :clearable="false" v-model="setStartTime" :picker-options="{ start: pickerStart, step: '00:05', end: '23:55'}" @change="handleChangeTime"></el-time-select>
                                    </div>
                                    <div class="text">订单开始时间</div>
                                </div>
                                <div class="spaceBox">
                                    <div class="line"></div>
                                </div>
                                <div class="timeBox">
                                    <div class="time">
                                        <span>{{ endTime ? endTime.substring(0, 5) : '00:00' }}</span>
                                    </div>
                                    <div class="text">订单结束时间</div>
                                </div>
                            </div>
                            <div class="timeLine">
                                <div class="timeLineItem" v-for="(item, index) in 24" :key="index">
                                    <div class="line"></div>
                                    <div class="text">{{ index }}</div>
                                    <div class="timeLineSelect" v-if="bookSelect[index] && bookSelect[index].isSet" :style="{ left: bookSelect[index].left, width: bookSelect[index].width }"></div>
                                </div>
                                <!-- <div class="timeSelect" :style="{ left: timeSelectItem(item).left, width: timeSelectItem(item).width }" v-for="(item, index) in bookingList" :key="index"></div> -->
                            </div>
                            <div class="tipsWrap">
                                <div class="tipsItem">
                                    <span class="dot isSet"></span>
                                    <span>已预定时段</span>
                                </div>
                                <div class="tipsItem">
                                    <span class="dot"></span>
                                    <span>可预定时段</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="infoLine employeeInfo">
                        <div class="key">预订员工</div>
                        <el-select class="selectBox" v-model="sv_employee_id" placeholder="请选择">
                            <el-option v-for="(item, index) in guiderList" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                    <div class="remarkInfo">
                        <el-input class="remark" type="textarea" resize="none" border="none" :rows="6" v-model="sv_remark" placeholder="请输入客人留言"></el-input>
                    </div>
                </div>
                <div class="rightWrap">
                    <el-input class="searchMember" v-model="inputMemberKeyword" type="text" @input="handleInputLimited" @keyup.native.stop="handlePrevent" placeholder="输入会员号/姓名/手机">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <el-button slot="append" @click="showMemberList">选择会员</el-button>
                    </el-input>
                    <div class="memberInfo" v-if="!$app.isNull(memberInfo.member_id)">
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#8E92A5"></cmd-icon>
                                </div>
                                <div class="nameWrap" v-if="!$app.isNull(memberInfo.member_id)">
                                    <div class="nametext">
                                        <span class="name">{{memberInfo.sv_mr_name}}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{memberInfo.sv_ml_name}}</span>
                                    </div>
                                    <div class="telephone">{{$app.phoneNumberHiding(memberInfo.sv_mr_mobile)}}</div>
                                </div>
                            </div>
                            <div class="right" v-if="!$app.isNull(memberInfo.member_id)">
                                <div class="btn btnClear" @click="clearMember">清除</div>
                                <div class="btn btnRecharge" v-permission="{permission: CashierManage.Recharge, fn: showMemberRecharge }">充值</div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{memberInfo.sv_mw_availableamount}}</div>
                            </div>
                            <div class="item discount" @click="showStoreCard">
                                <div class="key">卡项</div>
                                <div class="value">{{memberInfo.wallets_list.length}}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{memberInfo.sv_mw_availablepoint}}</div>
                            </div>
                            <div class="item discount" @click="showEquityCard">
                                <div class="key">权益卡</div>
                                <div class="value">{{memberInfo.member_id ? memberInfo.micard_count : ''}}</div>
                            </div>
                            <div class="item discount" @click="showDiscount">
                                <div class="key">优惠券</div>
                                <div class="value">{{memberInfo.couponCountNumber}}</div>
                            </div>
                        </div>
                    </div>
                    <template v-if="!$app.isNull(reservationData.dealMoney)">
                        <div class="receivableMoney">
                            <div class="payInputItem">
                                <div class="key">应收</div>
                                <div class="value">
                                    <span>{{ $app.moneyFixed(receivableMoney) }}</span>
                                    <i class="moneyEdit el-icon-edit" v-permission="{permission: CashierManage.Change_Receive, fn: handleReceivable}"></i>
                                </div>
                            </div>
                            <div class="payInputItem">
                                <div class="key">找零</div>
                                <div class="value highLight">{{ $app.moneyFixed(exchangeMoney) }}</div>
                            </div>
                        </div>
                        <div class="dealMoney" v-if="!isMultiPayType">
                            <div class="key">收款</div>
                            <div class="value">
                                <span>{{ $app.moneyFixed(payMoney) }}</span>
                                <i v-if="!isMultiPayType && $refs.payTypeList.getPayTypeInfo().length === 1 && $refs.payTypeList.getPayTypeInfo()[0].name === '现金'" class="moneyEdit el-icon-edit" @click="handleExchange"></i>
                            </div>
                        </div>
                        <div class="dealMoney" v-else>
                            <div class="payInputItem" v-for="(item, index) in $refs.payTypeList.getPayTypeInfo()" :key="index" @click="handleChangeMoney(item, index)">
                                <div class="key">{{ item.name }}</div>
                                <div class="value">
                                    <span>{{ $app.moneyFixed(multiPayMoney['dealMoney'+ (index + 1)]) }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="pointWrap" v-if="hasPointWrap" @click.stop="">
                        <div class="useWrap">
                            <div class="left">
                                <span>使用</span>
                                <el-input type="text" class="inputPoint" disabled v-model.number="pointData.point"></el-input>
                                <span>积分</span>
                                <span v-if="usePointCheck">，抵扣{{pointData.money}}元</span>
                                <span class="updatePoint" v-if="usePointCheck" @click="showNumberChange">修改</span>
                            </div>
                            <el-switch v-model="usePointCheck" class="pointCheckBox" @change="handlePointSwitch"></el-switch>
                        </div>
                    </div>
                    <div class="discountWrap" v-if="hasOrderCouponMoney" @click.stop="">
                        <div class="key"></div>
                        <div class="btn" v-permission="{permission: CashierManage.Select_Coupon, fn: showDiscount}">
                            <span>{{couponSelected ? '已选优惠券': '选择优惠券'}}</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                    <!-- <pay-type-list ref="payTypeList" isMultiPay :canMulti="!downPaymentSetted" :isMultiPaySelected.sync="isMultiPayType" :payInfo="payInfo" @paySuccess="submitSuccess" @closeScan="handleCloseScan" :isDisabled="isSubmitting"> -->
                    <pay-type-list ref="payTypeList" v-show="!$app.isNull(reservationData.dealMoney)" isMultiPay canMulti :downPaymentMoneyEnough="downPaymentMoneyEnough" :isMultiPaySelected.sync="isMultiPayType" :payInfo="payInfo" @handleMemberCard="showMemberList" @paySuccess="submitSuccess" @closeScan="handleCloseScan" @change="handlePaymemtChange" :isDisabled="isSubmitting">
                        <div slot="downPayment" v-if="hasDownPayment" class="item" :class="{'selected': downPaymentSetted}" @click="handleDownPaymet">
                            <div class="img">
                                <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/payImg/downPayment.png'" />
                            </div>
                            <div class="payTypeName">
                                <span>订金</span>
                            </div>
                            <div class="corner">
                                <cmd-icon type="icon-gouxuan1" color="rgba(var(--main-theme-color), 1);" size="36"></cmd-icon>
                            </div>
                        </div>
                    </pay-type-list>
                    <template v-if="!$app.isNull(reservationData.dealMoney)">
                        <div class="btnWrap" v-if="editReservation.isEdit">
                            <div class="btn check checkPay" :class="{ disabled: isSubmitting }" @click="handleSubmitOrder">付款</div>
                        </div>
                        <div class="btnWrap" v-else>
                            <div class="btn" @click="handleBooking" v-repeatClick>挂单</div>
                            <div class="btn check" :class="{ disabled: isSubmitting }" @click="handleSubmitOrder">下单</div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 积分改数量 -->
            <number-change :visible.sync="memberPointStatus" title="使用积分" :onlyNumber="true" :compare="true" :defaultNumber="userPoint.maxValue" @close="handlePointClose" @handleNumberChange="handlePointChange"></number-change>
            <!-- 优惠券 -->
            <discount :visible.sync="discountStatus" @returnCouponRecordIdList="getCouponRecordId"></discount>
            <!-- 改价改折 -->
            <price-change :visible.sync="priceChangeStatus" :improtMoney="payChangeMoney" :discountMoney="payChangeMoneyType === -2 ? 0 : null" @submitMoney="submitMoney"></price-change>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './reservation.scss';
</style>
<script src="./reservation.js"></script>
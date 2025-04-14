<!--结算弹窗-->
<template>
    <div class="checkin" v-if="dialogVisible">
        <!-- 消费详情 -->
        <dc-dialog class="checkin-dialog" v-if="checkinStatus" width="12" height="7.6" title="订单结算" @close="closeDialog" @handleTitle="showFix">
            <div class="contentWrap" ref="checkin" tabindex="0" @keyup.stop="listenKeyup">
                <div class="topInfo">
                    <div class="orderWrap">
                        <!-- <span>订单号：</span> -->
                        <div v-if="isFixing">
                            <!-- <span>补单时间：</span> -->
                            <el-date-picker v-model="fixingTime" type="datetime" placeholder="选择补单时间"></el-date-picker>
                        </div>
                    </div>
                    <div class="right" v-if="hasGuider">
                        <div class="btn" v-permission="{permission: CashierManage.Select_Salesman, fn: showGuiderSelect}">
                            <span>选择导购员</span>
                        </div>
                        <div class="symbol" v-if="guiderList.length > 0">【{{ guiderList.map(e => e.name).join('、') }}】</div>
                    </div>
                </div>
                <div class="statistics">
                    <div class="item line">
                        <div class="itemTitle">原价</div>
                        <div class="value">
                            <span class="symbol">¥</span>
                            <span>{{$app.moneyFixed(carttingData.totalMoney)}}</span>
                        </div>
                    </div>
                    <div class="item line">
                        <div class="itemTitle">
                            <span class="text" v-if="carttingData.givePromotions.length > 0" v-permission="{permission: CashierManage.Select_Promotion_Gifts, fn: handleGoodsActivity}">
                                <label>优惠</label>
                                <label class="btnGoodsActivity">有促销</label>
                            </span>
                            <span class="text" v-else>
                                <label>优惠</label>
                            </span>
                        </div>
                        <div class="value">
                            <span class="symbol">¥</span>
                            <span>{{discountMoney}}</span>
                        </div>
                    </div>
                    <div class="item line billabletime" v-if="!$app.isNull(checkBillabletimeInfo.id)">
                        <div class="itemTitle">计时费</div>
                        <div class="value receivable">
                            <span class="symbol">¥</span>
                            <span>{{ $app.moneyFixed(carttingData.productResults[0].dealMoney) }}</span>
                            <span class="linethruthText" v-if="checkBillabletimeInfo.totalMoney > carttingData.productResults[0].dealMoney">({{$app.moneyFixed(checkBillabletimeInfo.totalMoney)}})</span>
                        </div>
                        <div class="valueTime receivable">
                            <span>结束时间：{{ checkBillabletimeInfo.endTime }}</span>
                            <i class="moneyEdit el-icon-date" @click="handleShowUpdateTime"></i>
                        </div>
                    </div>
                    <div class="item line">
                        <div class="itemTitle">应收</div>
                        <div class="value receivable">
                            <span class="symbol">¥</span>
                            <span>{{ receivableMoney }}</span>
                            <i v-if="discountBase" class="moneyEdit el-icon-edit-outline" v-permission="{permission: CashierManage.Change_Receive, fn: handleReceivable}"></i>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemTitle">找零</div>
                        <div class="value highlight">
                            <span class="symbol">¥</span>
                            <span>{{$app.moneyFixed(exchangeMoney)}}</span>
                        </div>
                    </div>
                </div>
                <div class="controlWrap">
                    <div class="leftWrap">
                        <el-input class="searchMember" ref="searchMember" v-model="inputMemberKeyword" type="text" @input="handleInputLimited" @keyup.native.stop="" @keyup.native.esc.stop="closeDialog" @keyup.native.enter.stop="handleSearchMemberEnter" placeholder="输入会员号/姓名/手机">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            <el-button slot="append" @click="showMemberList">选择会员</el-button>
                        </el-input>
                        <!-- <div class="memberInfo" v-if="memberSelected"> -->
                        <div class="memberInfo" v-if="!$app.isNull(memberInfo.member_id)">
                            <div class="userInfo">
                                <div class="left">
                                    <div class="logo">
                                        <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                        <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
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
                                    <div class="btn btnRecharge" v-permission="{permission: CashierManage.Recharge, fn: handleRecharge }">充值</div>
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
                        <div class="pointWrap" v-if="hasPointWrap">
                            <div class="useWrap">
                                <div class="left">
                                    <!-- <el-checkbox class="pointCheckBox" v-model="usePointCheck"></el-checkbox> -->
                                    <span>使用</span>
                                    <el-input type="text" class="inputPoint" disabled v-model.number="pointData.point"></el-input>
                                    <span>积分</span>
                                    <span v-if="usePointCheck">，抵扣{{pointData.money}}元</span>
                                    <span class="updatePoint" v-if="usePointCheck" @click="showNumberChange">修改</span>
                                </div>
                                <el-switch v-model="usePointCheck" class="pointCheckBox" @change="handlePointSwitch"></el-switch>
                            </div>
                            <!-- <div class="pointChangeBtn" v-if="usePointCheck" @click="showNumberChange">
                                <span>使用积分</span>
                            </div> -->
                        </div>
                        <div class="discountWrap">
                            <div class="key"></div>
                            <div class="btn" v-show="hasOrderCouponMoney" v-permission="{permission: CashierManage.Select_Coupon, fn: showDiscount}">
                                <span>{{couponSelected.length > 0 ? '已选优惠券': '选择优惠券'}}</span>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <!-- <pay-type-list ref="payTypeList" isMultiPay :canMulti="!downPaymentSetted" :isMultiPaySelected.sync="isMultiPayType" :payInfo="payInfo" @paySuccess="submitSuccess" @closeScan="handleCloseScan" :isDisabled="isSubmitting"> -->
                        <pay-type-list ref="payTypeList" :paymentList.sync="paymentList" :class="{ isMultipay: !preOrderMoneyData.used }"  :isMultiPay.sync="!preOrderMoneyData.used" :canMulti="!downPaymentSetted" :preMoneyEnough="preMoneyEnough" :isMultiPaySelected.sync="isMultiPayType" :payInfo="payInfo" @change="changePayment" @handleMemberCard="showMemberList" @paySuccess="submitSuccess" @closeScan="handleCloseScan" :isDisabled="isSubmitting">
                            <div slot="downPayment" v-if="hasDownPayment" class="item" :class="{'selected': downPaymentSetted}" @click="handleDownPaymet">
                                <div class="imgWrap">
                                    <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/payImg/downPayment.png'" />
                                </div>
                                <div class="payTypeName">
                                    <span>订金</span>
                                </div>
                                <div class="corner">
                                    <cmd-icon type="icon-gouxuan1" color="rgba(var(--main-theme-color), 1);" size="36"></cmd-icon>
                                </div>
                            </div>
                            <div slot="downPayment" v-if="selectedInfo.preOrderMoney > 0" class="item" :class="{'selected': preOrderMoneyData.used}" @click="handlePreMoneyPaymet">
                                <div class="imgWrap">
                                    <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/payImg/preOrderMoney.png'" />
                                </div>
                                <div class="payTypeName">
                                    <span>预付金</span>
                                </div>
                                <div class="corner">
                                    <cmd-icon type="icon-gouxuan1" color="rgba(var(--main-theme-color), 1);" size="36"></cmd-icon>
                                </div>
                            </div>
                        </pay-type-list>
                    </div>
                    <div class="rightWrap">
                        <div class="rightTop">
                            <div class="rightTopContent">
                                <div class="receipts" v-if="downPaymentInfo.isShowInCheckIn">
                                    <div class="key">订金</div>
                                    <div class="money">
                                        <div>{{downPaymentMoney}}</div>
                                    </div>
                                </div>
                                <div class="receipts preOrder" v-if="preOrderMoneyData.used > 0">
                                    <div class="key">预付金</div>
                                    <div class="money">
                                        <div>-￥{{ selectedInfo.preOrderMoney }}</div>
                                    </div>
                                </div>
                                <div class="receipts" v-if="!isMultiPayType">
                                    <div class="key">
                                        <span v-if="downPaymentInfo.isShowInCheckIn || preOrderMoneyData.used">{{ paySelectedList.length > 0 ? paySelectedList[0].name : '收款' }}</span>
                                        <span v-else>收款</span>
                                    </div>
                                    <div class="money">
                                        <div>
                                            <span class="symbol">¥</span>
                                            <span>{{inputNumber}}</span>
                                        </div>
                                        <div class="highlight" v-if="freeZeroMoney !== 0">抹零：{{0-freeZeroMoney}}</div>
                                    </div>
                                </div>
                                <div class="multiPayInput" v-else>
                                    <div class="payInputItem" v-for="(item, index) in paySelectedList" :key="index">
                                        <div class="key">{{item.name}}</div>
                                        <div class="money">
                                            <div v-if="receivableMoney > parseFloat(inputNumber)">
                                                <span class="symbol">¥</span>
                                                <span>{{index === 0 ? inputNumber : $app.subtractNumber(receivableMoney, parseFloat(inputNumber))}}</span>
                                            </div>
                                            <div v-else>
                                                <span class="symbol">¥</span>
                                                <span>{{index === 0 ? inputNumber : 0}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="highlight" v-if="freeZeroMoney !== 0">抹零：{{0-freeZeroMoney}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="btnListWrap">
                            <div class="left">
                                <div class="calculatorItem" :class="{'isRowFirst': index%3 == 0}" v-for="(item,index) in btnCalculator" :key="index" @click="handleBtnInput(item)">
                                    <!-- <div class="checkPrint" v-if="index == btnCalculator.length-1 && checkPrint">✔</div> -->
                                    <div class="contentBtn">
                                        <span>{{item.value}}</span>
                                    </div>
                                </div>
                                <div class="calculatorItem" v-permission="{permission: CashierManage.Print_Switch, fn: handleBtnPrint}">
                                    <div class="contentBtn">
                                        <el-switch switch v-model="checkPrint" @change="handleBtnPrint" @click.stop=""></el-switch>
                                        <span class="checkPrint">打印开关</span>
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="controlItem" :class="{'isRowFirst': index%2 == 0}" v-for="(item,index) in btnControl" :key="index" v-permission="{permission: CashierManage[item.permission], fn: handleControl, param: [item]}">
                                    <div class="contentBtn">
                                        <span>{{item.value}}</span>
                                    </div>
                                </div>
                                <div class="controlItem" v-repeatClick v-permission="{permission: isCatering ? CashierManage.Pre_Print_Catering : CashierManage.Pre_Print, fn: preSubmit}">
                                    <div class="contentBtn">
                                        <span>{{prePrintText}}</span>
                                        <div v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'">打印</div>
                                    </div>
                                </div>
                                <!-- <div class="controlItem isRowFirst isEnd" v-repeatClick @click="handleSubmit">
                                    <span>确定结算</span>
                                </div> -->
                                <div class="checkinBtnWrap">
                                    <el-button :disabled="isSubmitting" class="checkinBtn" v-repeatClick v-permission="{permission: CashierManage.Cashlebtn, fn: handleSubmit}">确定结算</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <dc-dialog v-if="ckeckInSuccessStatus" width="500" :height="successInfo.sv_mr_name?680:460" title="收款成功" @close="closeSuccessDialog">
            <div class="successContentWrap">
                <div class="orderInfo">
                    <div class="icon">
                        <span>✔</span>
                    </div>
                    <div class="orderNumber">
                        <span>订单号：{{successInfo.orderNumber}}</span>
                    </div>
                    <div class="itemBox">
                        <div class="key">应收：</div>
                        <div class="value">{{successInfo.receivableMoney}}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">优惠：</div>
                        <div class="value">{{successInfo.couponMoney}}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">实收：</div>
                        <div class="value">{{successInfo.dealMoney}}</div>
                    </div>
                    <div class="itemBox" v-if="parseFloat(successInfo.exchangeMoney) > 0">
                        <div class="key">找零：</div>
                        <div class="value">{{successInfo.exchangeMoney}}</div>
                    </div>
                </div>
                <div class="memberInfo" v-if="successInfo.sv_mr_name">
                    <div class="memberTitle">会员信息</div>
                    <div class="itemBox">
                        <div class="key">会员名称</div>
                        <div class="value">{{successInfo.sv_mr_name}}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">储值余额</div>
                        <div class="value">{{successInfo.availableamount}}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">积分余额</div>
                        <div class="value">{{successInfo.availablepoint}}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">欠款金额</div>
                        <div class="value">{{successInfo.credit}}</div>
                    </div>
                </div>
                <div class="btnSure">
                    <div class="btn" @click="closeSuccessDialog">
                        <span>确定{{successShowTime}}S</span>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <dc-dialog v-if="showBillabletimeUpdate" width="680" height="360" title="修改计时" @close="showBillabletimeUpdate = false">
            <div class="billabletimeUpdate">
                <div class="updateInfo">
                    <div class="infoItem">
                        <span class="key">房间类型：</span>
                        <span class="value">{{ selectedInfo.sv_region_name }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">房台号：</span>
                        <span class="value">{{ selectedInfo.sv_table_name }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">计费规则：</span>
                        <span class="value">{{ updateBillabletimeInfo.configName }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">顾客人数：</span>
                        <span class="value">{{ selectedInfo.sv_person_num }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">开单时间：</span>
                        <span class="value">{{ updateBillabletimeInfo.startTime }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">结束时间：</span>
                        <span class="value" @click="handleUpdateTimeProp = true">
                            <el-date-picker v-model="updateBillabletimeInfo.endTime" type="datetime" :clearable="false" placeholder="结束时间" :picker-options="{
                                disabledDate(time) { return time.getTime() > Date.now() } }" @change="handleEndTimeChange"></el-date-picker>
                        </span>
                    </div>
                    <div class="infoItem">
                        <span class="key">已选时长：</span>
                        <span class="value">{{ updateBillabletimeInfo.durationTime }}</span>
                    </div>
                </div>
                <div class="billabletimeBtnWrap">
                    <div class="billabletimePrice">
                        <span>总计费用：</span>
                        <span class="highLight">{{ updateBillabletimeInfo.totalMoney }}</span>
                        <span>元</span>
                    </div>
                    <div class="btnItem sure" :class=" { disabled: handleUpdateTimeProp}" @click="handleUpdateBilltimeSure">
                        <span>确定</span>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <!-- 使用订金 -->
        <number-change :visible.sync="showDownPayment" title="搜索订金单" onlyNumber noLimited defaultNumber="" :autoClose="false" @handleNumberChange="handleDownPaymentChange"></number-change>
        <dc-dialog v-if="showDownPaymentContent" width="500" height="460" title="确认订金消费" @close="showDownPaymentContent = false">
            <div class="downPaymentContentWrap">
                <div class="receivableMoney">￥{{receivableMoney}}</div>
                <div class="downPaymentInfo">
                    <div class="top">
                        <div class="customerName">{{downPaymentInfo.customerName}}</div>
                        <div class="money">
                            <span>余额</span>
                            <span class="highLight">￥{{downPaymentInfo.money}}</span>
                        </div>
                    </div>
                    <div class="line">
                        <span>手机号：{{downPaymentInfo.customerPhone}}</span>
                    </div>
                    <div class="line">
                        <span>订金编号：{{downPaymentInfo.no}}</span>
                    </div>
                    <div class="line">
                        <span>收取时间：{{downPaymentInfo.payTime || downPaymentInfo.createTime}}</span>
                    </div>
                </div>
                <div class="downPaymentBtnWrap">
                    <div class="btnItem" @click="handleDownPaymentContentCancel">
                        <span>取消</span>
                    </div>
                    <div class="btnItem sure" @click="handleDownPaymentContentSure">
                        <span>确定</span>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <!-- 请输入牌号 -->
        <number-change :visible.sync="showBrandNum" title="请输入牌号" @handleNumberChange="handleBrandNum"></number-change>

        <!-- 补单 -->
        <order-supplement :visible.sync="orderSupplementStatus"></order-supplement>
        <!-- 积分改数量 -->
        <number-change :visible.sync="memberPointStatus" title="使用积分" :onlyNumber="true" :compare="true" :defaultNumber="userPoint.maxValue" @close="handlePointClose" @handleNumberChange="handlePointChange"></number-change>
        <!-- 选择销售员 -->
        <guider-select :visible.sync="guiderSelectStatus" @handleBack="getGuiderSelected"></guider-select>
        <!-- 优惠券 -->
        <discount :visible.sync="discountStatus" :couponSelected="couponSelected" @returnCouponRecordIdList="getCouponRecordId"></discount>
        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" :keyword="inputMemberKeyword" :allStoreStatus="allStoreStatus" @handleCloseMember="handleCloseMember" @handleLeavePage="handleLeavePage"></member-list>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 改价改折 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" isCheckIn :improtMoney="receiveBase" :discountMoney="discountBase" @submitMoney="submitMoney"></price-change>
        <!-- 储值卡消费结算验证 -->
        <member-card-check :visible.sync="memberCardCheckStatus" :checkType="memberCardCheckType" :paymentAmount="receivableMoney" :memberInfo="memberInfo" @success="memberCardCheckSuccess"></member-card-check>
        <!-- 绑定票码 -->
        <bind-code :visible.sync="bindCodeStatus" :orderId="bindOrderId" @close="closeDialog"></bind-code>
    </div>
</template>

<style  lang="scss" scoped>
@import './checkin.scss';
</style>
<script src="./checkin.js"></script>
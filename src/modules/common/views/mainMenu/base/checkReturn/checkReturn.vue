<!--无单退货结算弹窗-->
<template>
    <div class="checkReturn" v-if="dialogVisible">
        <!-- 退货退款 -->
        <dc-dialog v-if="checkReturnStatus" width="1100" height="700" :title="pageTitle" @close="closeDialog">
            <div class="topInfo">
                <div class="btn" v-if="dataList.length > 0" @click="showGuiderSelect">
                    <span>选择导购员</span>
                </div>
                <div class="symbol" v-if="guiderList.length > 0">【</div>
                <div class="guiderItem" v-for="(item, index) in guiderList" :key="index">
                    <span v-if="index !== 0">、</span>
                    <span>{{ item.name }}</span>
                </div>
                <div class="symbol" v-if="guiderList.length > 0">】</div>
            </div>
            <div class="contentWrap" ref="checkReturn" tabindex="0" @keyup.stop="listenKeyup">
                <div class="leftWrap">
                    <el-input class="searchMember" v-if="$app.isNull(orderNumber)" v-model="inputMemberKeyword" type="text" @keyup.native.enter.stop="showMemberList" placeholder="输入会员号/姓名/手机">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <el-button slot="append" @click="showMemberList">选择会员</el-button>
                    </el-input>
                    <div class="customerInfo" v-if="!$app.isNull(orderNumber) && $app.isNull(memberInfo.member_id)">
                        <div class="logo">
                            <cmd-icon type="icon-headDefault" size="40" color="#ffffff"></cmd-icon>
                        </div>
                        <div class="nameWrap">散客</div>
                    </div>
                    <div class="memberInfo" v-if="!$app.isNull(memberInfo.member_id)">
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                </div>
                                <div class="nameWrap" v-if="!$app.isNull(memberInfo.member_id)">
                                    <div class="nametext">
                                        <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                    </div>
                                    <div class="telephone">{{ $app.phoneNumberHiding(memberInfo.sv_mr_mobile) }}</div>
                                </div>
                            </div>
                            <div class="right" v-if="!$app.isNull(memberInfo.member_id)">
                                <div class="btn btnClear" v-if="$app.isNull(orderNumber)" @click="clearMember">清除</div>
                                <div class="btn btnRecharge" @click="handleRecharge">充值</div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                            </div>
                            <div class="item discount" @click="showStoreCard">
                                <div class="key">卡项</div>
                                <div class="value">{{memberInfo.wallets_list.length}}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                            </div>
                            <div class="item discount" @click="showEquityCard">
                                <div class="key">权益卡</div>
                                <div class="value">{{ memberInfo.member_id ? memberInfo.micard_count : '' }}</div>
                            </div>
                            <div class="item discount">
                                <div class="key">优惠券</div>
                                <div class="value">{{ memberInfo.couponCountNumber }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="originalReturnWrap" v-if="!$app.isNull(orderNumber) && dataList.length === 0">
                        <span class="text">订单原路退</span>
                        <el-switch v-model="isOriginalReturn" @change="handleOriginalReturn"></el-switch>
                    </div>
                    <pay-type-list ref="payTypeList" v-if="!isOriginalReturn" :payInfo="payInfo" @paySuccess="submitSuccess" @closeScan="handleCloseScan" :isDisabled="isSubmitting"></pay-type-list>
                </div>
                <div class="rightWrap">
                    <div class="rightTop" v-if="$app.isNull(orderNumber)">
                        <div class="item">
                            <label>退款金额</label>
                            <span class="value">
                                <label class="symbol">￥</label>
                                <label>{{ importMoneyInfo.addGoodsMoney }}</label>
                            </span>
                        </div>
                        <div class="item" @click="handleInputMoney">
                            <label>实退款</label>
                            <span class="value highLight" :class="{ isBtn: $app.isNull(orderNumber)}">{{ $app.moneyFixed(inputNumber) }}</span>
                        </div>
                    </div>
                    <div class="rightTop" v-else>
                        <div class="item">
                            <label>退货金额</label>
                            <span class="value">
                                <label class="symbol">￥</label>
                                <label>{{ importMoneyInfo.orderMoney }}</label>
                            </span>
                        </div>
                        <div class="item" v-if="dataList.length > 0">
                            <label>换货金额</label>
                            <span class="value">
                                <label class="symbol">￥</label>
                                <label>{{ importMoneyInfo.addGoodsMoney }}</label>
                            </span>
                        </div>
                        <div class="item" @click="handleInputMoney">
                            <label>{{ importMoneyInfo.payMoney > 0 ? '应付金额' : '实退款'}}</label>
                            <span class="value highLight" :class="{ isBtn: $app.isNull(orderNumber)}">{{ $app.moneyFixed(inputNumber) }}</span>
                        </div>
                    </div>
                    <div class="btnListWrap">
                        <div class="left">
                            <div class="calculatorItem" :class="{ isRowFirst: index % 3 == 0 }" v-for="(item, index) in btnCalculator" :key="index" @click="handleBtnInput(item)">
                                <!-- <div class="checkPrint" v-if="index == btnCalculator.length-1 && checkPrint">✔</div> -->
                                <span>{{ item.value }}</span>
                            </div>
                            <div class="calculatorItem" @click="handleBtnPrint">
                                <el-switch v-model="checkPrint" @change="handleBtnPrint" @click.stop=""></el-switch>
                                <span class="checkPrint">打印开关</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="controlItem" :class="{ isRowFirst: index % 2 == 0 }" v-for="(item, index) in btnControl" :key="index" @click="handleControl(item)">
                                <span>{{ item.value }}</span>
                            </div>
                            <div class="controlItem" v-repeatClick @click="preSubmit">
                                <span>预打</span>
                            </div>
                            <el-button :disabled="isSubmitting" class="controlItem isRowFirst isEnd" v-repeatClick @click="handleSubmit">确定结算</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <dc-dialog v-if="ckeckReturnSuccessStatus" width="470" :height="successInfo.memberName ? 680 : 520" title="退货成功" @close="closeDialog">
            <div class="successContentWrap">
                <div class="orderInfo">
                    <div class="icon">
                        <span>✔</span>
                    </div>
                    <!-- <div class="orderNumber">
                        <span>订单号：{{ successInfo.orderNumber }}</span>
                    </div> -->
                    <template v-if="$app.isNull(orderNumber)">
                        <template v-if="dataList.length === 0">
                            <div class="itemBox">
                                <div class="key">退款金额：</div>
                                <div class="value">{{ successInfo.returnMoney }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">实退款：</div>
                                <div class="value">{{ successInfo.dealMoney }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">退款方式：</div>
                                <div class="value">{{ successInfo.payment }}</div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="itemBox">
                                <div class="key">退货金额：</div>
                                <div class="value">{{ $app.moneyFixed(importMoneyInfo.orderMoney) }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">换货金额：</div>
                                <div class="value">{{ $app.moneyFixed(importMoneyInfo.addGoodsMoney) }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">{{ importMoneyInfo.payMoney > 0 ? '应付金额：' : '退款金额'}}</div>
                                <div class="value">{{ $app.moneyFixed(importMoneyInfo.payMoney) }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">{{ importMoneyInfo.payMoney > 0 ? '实付款：' : '实退款：'}}</div>
                                <div class="value">{{ successInfo.dealMoney }}</div>
                            </div>
                            <div class="itemBox">
                                <div class="key">{{ importMoneyInfo.payMoney > 0 ? '支付方式：' : '退款方式：'}}</div>
                                <div class="value">{{ successInfo.payment }}</div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <div class="itemBox">
                            <div class="key">退款金额：</div>
                            <div class="value">{{ successInfo.returnMoney }}</div>
                        </div>
                        <div class="itemBox">
                            <div class="key">实退款：</div>
                            <div class="value">{{ successInfo.dealMoney }}</div>
                        </div>
                        <div class="itemBox">
                            <div class="key">退款方式：</div>
                            <div class="value">{{ successInfo.payment }}</div>
                        </div>
                    </template>
                </div>
                <div class="memberInfo" v-if="successInfo.memberName">
                    <div class="memberTitle">会员信息</div>
                    <div class="itemBox">
                        <div class="key">会员名称</div>
                        <div class="value">{{ successInfo.memberName }}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">储值余额</div>
                        <div class="value">{{ successInfo.availableamount }}</div>
                    </div>
                </div>
                <div class="btnSure">
                    <div class="btn" @click="closeDialog">
                        <span>确定{{ successShowTime }}S</span>
                    </div>
                </div>
            </div>
        </dc-dialog>
        
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @cancel="checkInFocus" @submitPsw="doSubmit"></return-psw>
        <!-- 选择销售员 -->
        <guider-select :visible.sync="guiderSelectStatus" @handleBack="getGuiderSelected"></guider-select>
        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" :keyword="inputMemberKeyword" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 改价改折 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :ischeckReturn="true" :improtMoney="inputNumber" @submitMoney="submitMoney"></price-change>
    </div>
</template>

<style lang="scss" scoped>
@import './checkReturn.scss';
</style>
<script src="./checkReturn.js"></script>

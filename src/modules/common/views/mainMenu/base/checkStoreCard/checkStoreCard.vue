<!--储值卡结算弹窗-->
<template>
    <div class="checkStoreCard" v-if="dialogVisible">
        <dc-dialog v-if="checkStoreCardStatus" width="450" height="740" title="确定结算" @close="closeDialog">
            <div class="contentWrap" ref="checkStoreCard" tabindex="0" @keyup.stop="listenKeyup">
                <el-input class="searchMember" v-model="inputMemberKeyword" type="text" @keyup.native.stop="" @keyup.native.enter.stop="showMemberList" placeholder="输入会员号/姓名/手机">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-button slot="append" @click="showMemberList">选择会员</el-button>
                </el-input>
                <!-- <div class="memberInfo" v-if="memberSelected"> -->
                <div class="memberInfo" v-if="!$app.isNull(currentMemberInfo.member_id)">
                    <div class="userInfo">
                        <div class="left">
                            <div class="logo">
                                <el-image v-if="!$app.isNull(currentMemberInfo.sv_mr_headimg)" :src="$app.getImgUrl(currentMemberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(currentMemberInfo.sv_mr_headimg)]"></el-image>
                                <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                            </div>
                            <div class="nameWrap" v-if="!$app.isNull(currentMemberInfo.member_id)">
                                <div class="nametext">
                                    <span class="name">{{ currentMemberInfo.sv_mr_name }}</span>
                                    <span class="flag" v-if="currentMemberInfo.sv_ml_name">{{ currentMemberInfo.sv_ml_name }}</span>
                                </div>
                                <div class="telephone">{{ $app.phoneNumberHiding(currentMemberInfo.sv_mr_mobile) }}</div>
                            </div>
                        </div>
                        <div class="right" v-if="!$app.isNull(currentMemberInfo.member_id)">
                            <div class="btn btnClear" @click="handleClearMember">清除</div>
                            <div class="btn btnRecharge" @click="handleRecharge">充值</div>
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
                            <div class="value">{{ currentMemberInfo.member_id ? memberInfo.micard_count : '' }}</div>
                        </div>
                        <div class="item discount">
                            <div class="key">优惠券</div>
                            <div class="value">{{ currentMemberInfo.couponCountNumber }}</div>
                        </div>
                    </div>
                </div>
                <div class="controlContent">
                    <el-scrollbar style="width: 100%; height: 100%;">
                        <div class="controlWrap">
                            <div class="inputWrap">
                                <div class="inputLine">
                                    <el-input class="input right" v-model="sv_card_number" ref="cardNumber" clearable placeholder="请输入储值卡号" @focus="$event.currentTarget.select()">
                                        <span slot="prepend" v-textStar>储值卡号</span>
                                    </el-input>
                                </div>
                            </div>
                            <div class="inputWrap">
                                <div class="inputLine">
                                    <el-input class="input right" ref="inputRechargeMoney" v-model="inputMoney" maxlength="8" @input="handleInput($event, 'inputMoney')" @focus="$event.currentTarget.select()" clearable placeholder="请输入开卡本金">
                                        <span slot="prepend" v-textStar>本金</span>
                                    </el-input>
                                    <el-input class="input right ml-10" v-model="inputPresent" maxlength="8" @input="handleInput($event, 'inputPresent')" @focus="$event.currentTarget.select()" clearable placeholder="请输入开卡赠送">
                                        <span slot="prepend">赠送</span>
                                    </el-input>
                                </div>
                            </div>
                            <div class="dataItem">
                                <div class="key">销售人员</div>
                                <div class="value">
                                    <div class="left">
                                        <span class="saleman_name" v-if="guiderList.length > 0">{{ guiderList.map(e => e.name).join('/') }}</span>
                                    </div>
                                    <div class="btn">
                                        <el-button size="mini" round @click="showGuiderSelect" type="primary" plain>选择</el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="dataItem">
                                <div class="key">打印小票</div>
                                <div class="value">
                                    <div class="left"></div>
                                    <el-switch v-model="checkPrint"></el-switch>
                                </div>
                            </div>
                            <div class="dataItem" v-if="!isMultiPayType">
                                <div class="key">支付金额</div>
                                <div class="value">
                                    <div class="left"></div>
                                    <span>{{ checkMoney }}元</span>
                                </div>
                            </div>
                            <div class="multiPay" v-else>
                                <div class="payInputItem" v-for="(item, index) in ($refs.payTypeListStoreCard ? $refs.payTypeListStoreCard.getPayTypeInfo() : [])" :key="index">
                                    <div class="key">{{item.name}}</div>
                                    <div class="value" v-if="index === 0">
                                        <el-input v-model="payMoney1" @focus="$event.currentTarget.select()" @input="handleInputMoney($event, 1)">
                                            <span slot="suffix">元</span>
                                        </el-input>
                                    </div>
                                    <div class="value" v-else>
                                        <el-input v-model="payMoney2" @focus="$event.currentTarget.select()" @input="handleInputMoney($event, 2)">
                                            <span slot="suffix">元</span>
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <pay-type-list ref="payTypeListStoreCard" :payInfo="payInfo" :isDisabled="isSubmitting" isRecharge isMultiPay :isMultiPaySelected.sync="isMultiPayType" @paySuccess="successHandle" @returnCode="submitScan" @closeScan="handleCloseScan" />
                        </div>
                    </el-scrollbar>
                </div>

                <div class="btnWrap">
                    <el-button :disabled="isSubmitting" class="controlItem" v-repeatClick @click="handleSubmit">确定结算￥{{ checkMoney }}</el-button>
                </div>
            </div>
        </dc-dialog>

        <dc-dialog v-if="ckeckReturnSuccessStatus" width="470" height="580" title="支付成功" @close="closeDialog">
            <div class="successContentWrap">
                <div class="orderInfo">
                    <div class="icon">
                        <span>✔</span>
                    </div>
                    <div class="itemBox">
                        <div class="key">支付金额：</div>
                        <div class="value">{{ successInfo.checkMoney }}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">实 付 款：</div>
                        <div class="value">{{ successInfo.dealMoney }}</div>
                    </div>
                    <div class="itemBox">
                        <div class="key">付款方式：</div>
                        <div class="value">{{ successInfo.payment }}</div>
                    </div>
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
                    <div class="btn" v-repeatClick @click="closeDialog">
                        <span>确定{{ successShowTime }}S</span>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <!-- 选择业绩归属人 -->
        <guider-select :visible.sync="guiderSelectStatus" title="选择业绩归属人" @handleBack="getGuiderSelected"></guider-select>
        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" title="选择会员" :keyword="inputMemberKeyword" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
    </div>
</template>

<style lang="scss" scoped>
@import './checkStoreCard.scss';
</style>
<script src="./checkStoreCard.js"></script>
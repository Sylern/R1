<template>
	<div class="quickPay">
        <pay-type-list :paymentList.sync="paymentList" ref="quickPayList" class="quickPayList" :payInfo="payInfo" @paySuccess="submitSuccess" @closeScan="handleCloseScan" :isDisabled="isSubmitting"></pay-type-list>
        <!-- 支付成功 -->
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
        <!-- 绑定票码 -->
        <bind-code :visible.sync="bindCodeStatus" :orderId="bindOrderId" @close="closeDialog"></bind-code>
	</div>
</template>

<style lang="sass" scoped>
@import "./quickPay.scss"
</style>
<script src="./quickPay.js"></script>

<!--艺培课程结算弹窗-->
<template>
	<div class="checkCourse" v-if="dialogVisible">
		<!-- 确认报名 -->
		<dc-dialog v-if="checkCourseStatus" width="1100" height="700" title="确认报名" @close="closeDialog">
			<div class="topInfo">
				<div class="btn" @click="showGuiderSelect">
					<span>选择业绩归属人</span>
				</div>
				<div class="symbol" v-if="guiderList.length > 0">【</div>
				<div class="guiderItem" v-for="(item, index) in guiderList" :key="index">
					<span v-if="index !== 0">、</span>
					<span>{{ item.name }}</span>
				</div>
				<div class="symbol" v-if="guiderList.length > 0">】</div>
			</div>
			<div class="contentWrap" ref="checkCourse" tabindex="0" @keyup.stop="listenKeyup">
				<div class="leftWrap">
					<el-input class="searchMember" v-model="inputMemberKeyword" type="text" @keyup.native.stop="" @keyup.native.enter.stop="showMemberList" placeholder="输入学员号/姓名/手机">
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
						<el-button slot="append" @click="showMemberList">选择学员</el-button>
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
										<span class="name">{{ memberInfo.sv_mr_name }}</span>
										<span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
									</div>
									<div class="telephone">{{ $app.phoneNumberHiding(memberInfo.sv_mr_mobile) }}</div>
								</div>
							</div>
							<div class="right" v-if="!$app.isNull(memberInfo.member_id)">
								<div class="btn btnClear" @click="clearMember">清除</div>
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
					<pay-type-list ref="payTypeList" :payInfo="payInfo" :isDisabled="isSubmitting" @paySuccess="submitSuccess(false)" @closeScan="handleCloseScan" />
				</div>
				<div class="rightWrap">
					<div class="rightTop">
						<div class="item">
							<label>应收金额</label>
							<span class="value receiveMoney" @click="showPriceChange(0)">
								<span class="symbol">￥</span>
								<span>{{ checkMoney }}</span>
								<i class="moneyEdit el-icon-edit-outline"></i>
							</span>
						</div>
						<div class="item">
							<label>实收款</label>
							<span class="value highLight">{{ inputNumber }}</span>
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

		<dc-dialog v-if="ckeckReturnSuccessStatus" width="470" height="620" title="报名成功" @close="closeDialog">
			<div class="successContentWrap">
				<div class="orderInfo">
					<div class="icon">
						<span>✔</span>
					</div>
					<div class="orderNumber">
						<span>订 单 号：{{ successInfo.orderNumber }}</span>
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
					<div class="memberTitle">学员信息</div>
					<div class="itemBox">
						<div class="key">学员名称</div>
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
		<!-- 学员列表 -->
		<member-list :visible.sync="memberListStatus" title="选择学员" :keyword="inputMemberKeyword" @handleCloseMember="handleCloseMember"></member-list>
		<!-- 学员充值 -->
		<member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
		<!-- 改价改折 -->
		<price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="importInfo.money" :discountMoney="discountBase" @submitMoney="submitMoney"></price-change>
		<!-- 储值卡消费结算验证 -->
        <member-card-check :visible.sync="memberCardCheckStatus" :checkType="memberCardCheckType" :paymentAmount="checkMoney" :memberInfo="memberInfo" @success="doSubmit"></member-card-check>

		<!-- 选择班级 -->
		<class-selection :visible.sync="classSelectionStatus" :courseList="courseList" :orderId="classSelectionOrderId" :memberId="classSelectionMemberId" @close="submitSuccess(true)"></class-selection>
	</div>
</template>

<style lang="scss" scoped>
@import './checkCourse.scss';
</style>
<script src="./checkCourse.js"></script>

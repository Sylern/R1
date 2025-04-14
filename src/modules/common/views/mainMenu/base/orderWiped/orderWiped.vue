<!--订单核销-->
<template>
	<div class="orderWiped" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
		<dc-dialog v-if="orderWipedStatus" width="468" height="660" @close="closeDialog">
			<div class="titleWrap">
				<div class="btnBack" v-if="steps > 1" @click="handlePrev">
					<i class="el-icon-arrow-left"></i>
				</div>
				<div class="center">
					<template v-for="(item, index) in menuList">
						<div class="titleItem" :class="{ selected: menuPos === item.sn }" :key="index" v-if="item.isShow" @click="handleMenu(item.sn)">{{ item.name }}</div>
					</template>
				</div>
			</div>
			<div class="contentWrap">
				<el-carousel ref="pageCard" :loop="false" :autoplay="false" indicator-position="none" arrow="never" trigger="none" height="100%">
					<el-carousel-item>
						<div class="topWrap">
							<el-input class="inputWrap" ref="inputNumber" v-model.trim="inputNumber" :placeholder="menuList[menuPos].plaText" @focus="handleFocus" @keyup.native.stop="handleInputBlur" @blur="handleInputBlur" @keyup.native.enter="handleEnter" @clear="clearInputNumber" clearable></el-input>
						</div>
						<div class="listWrap" v-if="menuPos === 0">
							<div class="listItem" :class="{ center: index % 3 == 1, right: index % 3 == 2 }" v-for="(item, index) in calculatorList" :key="index" @click="calculateInput(item.key)">
								<div class="keyItem">{{ item.key }}</div>
							</div>
						</div>
						<div class="btnSure" v-if="menuPos === 0" @click="handleCheckNumber">确定</div>
						<div class="scanImg" v-if="menuPos === 1">
							<img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/douyinScan.png'" />
							<div class="btnSwitch">
								<span>核销后自动关闭当前窗口</span>
								<!-- <el-switch v-model="dowyinSwitch" @change="doPrint"></el-switch> -->
								<el-switch v-model="dowyinSwitch"></el-switch>
							</div>
						</div>
					</el-carousel-item>

					<el-carousel-item>
						<div class="memberInfo">
							<div class="left">
								<div class="logo">
									<el-image :src="memberInfo.sv_mr_headimg" :preview-src-list="[memberInfo.sv_mr_headimg]" @click.stop=""></el-image>
								</div>
								<div class="memberName">
									<div class="nameText">
										<span>{{ memberInfo.sv_mr_name }}</span>
										<span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
									</div>
									<div class="telephone">{{ memberInfo.sv_mr_mobile }}</div>
								</div>
							</div>
							<div class="right">
								<div class="point">积分：{{ memberInfo.sv_mw_availablepoint }}</div>
								<div class="balance">余额：¥{{ memberInfo.sv_mw_availableamount }}</div>
							</div>
						</div>
						<div class="orderList">
							<!-- <div class="orderItem selected"></div> -->
							<el-scrollbar style="width: 100%; height: 100%">
								<div class="orderItem" v-for="(item, index) in orderList" :key="index" @click="handleOrderItem(item)">
									<div class="left">{{ index + 1 }}</div>
									<div class="center">
										<div class="orderNumber">订单编号：{{ item.wt_nober }}</div>
										<div class="orderTime">订单时间：{{ item.wt_datetime }}</div>
									</div>
									<div class="right">
										<span>金额：{{ item.sv_order_actual_money_new }}</span>
									</div>
								</div>
							</el-scrollbar>
						</div>
					</el-carousel-item>
					<!-- 结果 -->
					<el-carousel-item>
						<div class="dataResult">
							<el-scrollbar style="width: 100%; height: 100%">
								<div class="itemBox">
									<div class="key">取货人</div>
									<div class="value">{{ orderInfo.userName }}</div>
								</div>
								<div class="itemBox">
									<div class="key">手机号码</div>
									<div class="value">{{ orderInfo.telephone }}</div>
								</div>
								<div class="itemBox">
									<div class="key">销售单号</div>
									<div class="value">{{ orderInfo.orderNumber }}</div>
								</div>
								<div class="itemBox">
									<div class="key">下单时间</div>
									<div class="value">{{ orderInfo.orderTime }}</div>
								</div>
								<div class="itemBox">
									<div class="key">
										<span>核销人员：</span>
										<span>{{ orderInfo.verifyuserText }}</span>
									</div>
									<div class="value">
										<el-button size="mini" round @click="guiderSelectStatus = true" type="primary" plain>选择</el-button>
									</div>
								</div>
								<div class="textareaBox">
									<el-input type="textarea" v-model="verifyQueryDate.verifyremark" :rows="2" resize="none" placeholder="核销备注"></el-input>
								</div>
								<div class="product_list_title">
									<div class="key">核销商品</div>
								</div>
								<div class="productList">
									<div class="productItem" v-for="(item, index) in orderInfo.productList" :key="index">
										<div class="itemLeft">
											<div class="productName">
												<span>{{ item.sv_p_name }}</span>
											</div>
											<!-- <div class="productCode">
                                                <span>453212</span>
                                                <span>白色 均码</span>
                                            </div> -->
										</div>
										<div class="itemRight">
											<span>x{{ item.sv_p_weight || item.product_num }}</span>
										</div>
									</div>
								</div>
							</el-scrollbar>
							<div class="btnSure" @click="verifyOrderByCode">立即核销</div>
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
			<!-- 核销员选择 -->
			<guider-select :visible.sync="guiderSelectStatus" title="核销员选择" :selectedNumber="1" @handleBack="getGuiderSelected"></guider-select>
		</dc-dialog>
		<!-- 抖音核销 -->
		<order-Wiped-Douyin :visible.sync="douyinStatus" :dataItem="douyinDataItem"></order-Wiped-Douyin>
		<!-- 人脸识别结果展示 -->
		<head-scan :isOnWatchScan="steps === 1 && menuPos === 0" @handleShow="handleHeadScanShow" @handleCancel="handleHeadScanCanel" @handleHeadScan="handleHeadScanSure"></head-scan>
	</div>
</template>

<style lang="scss" scoped>
@import './orderWiped.scss';
</style>
<script src="./orderWiped.js"></script>

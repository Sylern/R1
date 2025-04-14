<!--抖音核销-->
<template>
	<dc-dialog v-if="dialogVisible" width="1080" height="660" @close="closeDialog">
		<div class="wrapTitle" v-if="checkedSuccess">
			<span>核销详情</span>
		</div>
		<div class="wrapTitle bet" v-else>
			<span>券码核销</span>
			<div class="searchWrap">
				<el-input ref="searchCode" @keyup.enter.native="prepare4ShortUrl" v-model.trim="searchCode" placeholder="请输入核销码">
					<!-- <i @click="handleSearchRe" slot="suffix" class="el-input__icon el-icon-search"></i> -->
					<cmd-icon slot="suffix" type="icon-saoma1" size="26" color="#333333"></cmd-icon>
				</el-input>
			</div>
		</div>
		<div class="douyinContentWrap" v-if="!checkedSuccess">
			<div class="listWrap">
				<myTable @select-all="handleSelectAll" @select="handleSellect" ref="myTable" rowKey="order_id" :data="tableList" minWidth="80">
					<my-table-cell prop="selection" width="40" align="right"></my-table-cell>
					<my-table-cell label="序号" prop="序号" width="60" align="center">
						<template v-slot:default="scope">
							<span>{{ scope.index + 1 }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="商品名称" prop="title" width="300" showTooltip>
						<template v-slot:default="scope">
							<span>{{ scope.sku.title }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="价格" prop="original_amount" showTooltip>
						<template v-slot:default="scope">
							<span class="price">￥{{ handleGetCheckInfoPrice(scope) }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="数量" prop="codeList" showTooltip>
						<template v-slot:default="scope">
							<span>{{ handleGetCheckInfoNumber(scope) }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="有效期至" prop="expire_time" width="150" align="center" showTooltip>
						<template v-slot:default="scope">
							<span>{{ $app.currentTime(new Date(scope.expire_time * 1000), 'yyyy-MM-dd HH:mm:ss') }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="核销数量" prop="currentNum" width="200" align="center" showTooltip>
						<template v-slot:default="scope">
							<div class="checkNumber">
								<div class="btn btnSubtract" @click="handleSubtract(scope)">-</div>
								<div class="currentNum">{{ scope.currentNum }}</div>
								<div class="btn btnAdd" @click="handleAdd(scope)">+</div>
							</div>
						</template>
					</my-table-cell>
					<my-table-cell label="操作" prop="control" width="100" align="center" showTooltip>
						<template v-slot:default="scope">
							<div class="btnDelete" @click="handleDelete(scope.index)">移除</div>
						</template>
					</my-table-cell>
				</myTable>
				<!-- <el-scrollbar style="width: 100%; height: 100%">
                    <div class="listContent">
                        <div class="listItem" v-for="(item, index) in 10" :key="index">
                            <div class="content">
                                <div class="topInfo">
                                    <div class="itemName">【双11预售】单人3小时游玩（大小通用）</div>
                                    <div class="itemPrice">￥69.90</div>
                                </div>
                                <div class="bottomInfo">
                                    <div class="left">
                                        <div class="number">当前共1张可用</div>
                                        <div class="time">有效期至2023-12-31 23:59:59</div>
                                    </div>
                                    <div class="right">
                                        <div class="btn btnSubtract">-</div>
                                        <div class="currentNum">1</div>
                                        <div class="btn btnAdd">+</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar> -->
			</div>
			<div class="btnWrap">
				<div class="tips">
					<span>共选择<label>{{ checkedLength }}</label>张券，核销前请与顾客确认核销券数</span>
				</div>
				<div class="btnSure" @click="handleSure">确定核销</div>
			</div>
		</div>
		<div class="resultSuccess" v-else>
			<div class="logoWrap">
				<cmd-icon type="icon-chenggong" size="60" color="#4DCC50"></cmd-icon>
				<div class="logoTips1">团购券核销成功</div>
				<div class="logoTips2">
					<span>核销券数{{ resultList.filter((e) => e.result === 0 && !e.isCancel).length }}张，核销金额</span>
					<span class="price">￥{{ $app.moneyFixed($app.divideNumber(resultTotalMoney, 100)) }}</span>
				</div>
			</div>
			<div class="listWrap">
				<myTable ref="myTableResult" :data="resultList" minWidth="80">
					<my-table-cell label="序号" prop="序号" width="60" align="center">
						<template v-slot:default="scope">
							<span>{{ scope.index + 1 }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="商品名称" prop="title" width="300" showTooltip>
						<template v-slot:default="scope">
							<span>{{ scope.title }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="价格" prop="original_amount" showTooltip>
						<template v-slot:default="scope">
							<span class="price" v-if="scope.verify_amount_info">￥{{ $app.moneyFixed($app.divideNumber(scope.verify_amount_info.times_card_serial_amount.amount.original_amount, 100)) }}</span>
							<span class="price" v-else>￥{{ $app.moneyFixed($app.divideNumber(scope.original_amount, 100)) }}</span>
							<!-- <span class="price">￥{{ $app.moneyFixed($app.divideNumber(scope.original_amount, 100)) }}</span> -->
						</template>
					</my-table-cell>
					<my-table-cell label="券码" prop="origin_code" showTooltip></my-table-cell>
					<my-table-cell label="提示" prop="msg" width="150" align="center" showTooltip></my-table-cell>
					<my-table-cell label="状态" prop="result" align="center">
						<template v-slot:default="scope">
							<span v-if="scope.isCancel">已撤销</span>
							<span v-else>{{ scope.result === 0 ? '已核销' : '核销失败' }}</span>
						</template>
					</my-table-cell>
					<my-table-cell label="操作" prop="currentNum" width="150" align="center">
						<template v-slot:default="scope">
							<div class="btnCancel" v-repeatClick v-if="!scope.isCancel && scope.result === 0" @click="handleCancelVerify(scope)">撤销核销</div>
						</template>
					</my-table-cell>
				</myTable>
				<!-- <el-scrollbar style="width: 100%; height: 100%">
					<div class="listContent">
						<div class="listItem" v-for="(item, index) in 10" :key="index">
							<div class="content">
								<div class="topInfo">
									<div class="itemName">【双11预售】单人3小时游玩（大小通用）</div>
									<div class="itemPrice">￥69.90</div>
								</div>
								<div class="bottomInfo">
									<div class="line">
										<div class="left">
											<div class="ticketCode">券码:101556247200898</div>
											<div class="tips">核销1小时内可以撤销</div>
										</div>
										<div class="right">
											<div class="status">已核销</div>
										</div>
									</div>
									<div class="btnWrap">
										<div class="btn">撤销核销</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</el-scrollbar> -->
			</div>
		</div>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
		<!-- 核销员选择 -->
		<guider-select :visible.sync="guiderSelectStatus" title="核销员选择" :selectedNumber="1" @handleBack="getGuiderSelected"></guider-select>
	</dc-dialog>
</template>

<style lang="scss" scoped>
@import './orderWipedDouyin.scss';
</style>
<script src="./orderWipedDouyin.js"></script>

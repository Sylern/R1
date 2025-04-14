<!--抖音绑定-->
<template>
	<div class="douyinBind">
		<div class="subTitle">
			<span>请确认绑定信息</span>
		</div>
		<div class="subTitle2 redText">
			<span>请核实设备信息是否准确</span>
		</div>
		<div class="containar">
			<div class="line">
				<div class="key">
					<span class="redText">*</span>
					<span>抖音商家Id：</span>
				</div>
				<div class="value">
					<el-input placeholder="请输入抖音商家Id" v-model="dataObj.DouYinOpenAccountId.value"></el-input>
				</div>
				<div class="lineBtnWrap" @click="handleSaveAccountId('DouYinOpenAccountId')">
					<span class="btn">保存</span>
				</div>
			</div>
			<div class="line">
				<div class="key">
					<span class="redText">*</span>
					<span>抖音商家门店：</span>
				</div>
				<div class="value">
					<el-select v-model="currentStore">
						<el-option v-for="(item, index) in storeList" :key="index" :label="item.label" :value="item"></el-option>
					</el-select>
				</div>
				<div class="lineBtnWrap" v-if="hasBindedStore" @click="handleCancelSave">
					<span class="btn">取消绑定</span>
				</div>
			</div>
			<div class="btnSavePoi">
				<el-button class="btnPrimary big" v-repeatClick @click="handleSavePoi">绑定门店</el-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scope>
@import './douyinBind.scss';
</style>
<script src="./douyinBind.js"></script>

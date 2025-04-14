<!--库存设置-->
<template>
	<div class="stockSetting">
		<div class="itemBox">
			<div class="top">
				<div class="left">
					<span class="itemName">盘点库存清零</span>
					<span class="itemSub">选择不清零后全场盘点或类别盘点时，未盘商品直接保留原库存，选择清零未盘商品可做清零选择</span>
				</div>
			</div>
			<div class="itemContent">
				<el-radio-group v-removeAria class="radioWrap" v-model="dataObj.NotStoreStockCheck_Is_Zero.value" @change="handleRadio('NotStoreStockCheck_Is_Zero')">
					<el-radio :label="true" :value="true">清零 </el-radio>
					<el-radio :label="false" :value="false">不清零 </el-radio>
				</el-radio-group>
			</div>
		</div>
		<div class="itemBox">
			<div class="top">
				<div class="left">
					<span class="itemName">盘点—明盘/盲盘</span>
					<span class="itemSub">选择盲盘后不显示商品当前库存</span>
				</div>
			</div>
			<div class="itemContent">
				<el-radio-group v-removeAria class="radioWrap" v-model="dataObj.NotStoreStockCheck_Is_Opendisc.value" @change="handleRadio('NotStoreStockCheck_Is_Opendisc')">
					<el-radio :label="true" :value="true">明盘 </el-radio>
					<el-radio :label="false" :value="false">盲盘 </el-radio>
				</el-radio-group>
			</div>
		</div>
		<div class="itemBox hover">
			<div class="top">
				<div class="left">
					<span class="itemName">货流零库存出库</span>
					<span class="itemSub">开启后可以零库存出库</span>
				</div>
				<div class="right">
					<el-switch v-model="dataObj.CargoFlowZeroStockOut_Switch.value" @change="handleRadio('CargoFlowZeroStockOut_Switch')"></el-switch>
				</div>
			</div>
		</div>
		<div class="itemBox">
			<div class="top">
				<div class="left">
					<span class="itemName">直调/要货商品设置</span>
					<!-- <span class="itemSub">选择盲盘后不显示商品当前库存</span> -->
				</div>
			</div>
			<div class="itemContent">
				<el-radio-group v-removeAria class="radioWrap" v-model="dataObj.NotStoreStockCheck_Is_Tuneout.value" @change="handleRadio('NotStoreStockCheck_Is_Tuneout')">
					<el-radio :label="false" :value="false">调入门店商品列表 </el-radio>
					<el-radio :label="true" :value="true">
                        <span>调出门店商品列表</span>
                        <span class="highLight">（可同步商品）</span>
                    </el-radio>
				</el-radio-group>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scope>
@import './stockSetting.scss';
</style>
<script src="./stockSetting.js"></script>

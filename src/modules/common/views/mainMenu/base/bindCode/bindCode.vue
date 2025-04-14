<!--绑定票码弹窗-->
<template>
	<div class="discount" ref="discount" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
		<dc-dialog width="6" height="550" title="绑定票码" @close="closeDialog">
			<div class="contentWrap">
				<div class="header">
					<div class="left">游玩项目</div>
					<div class="right">票码</div>
				</div>
				<el-scrollbar class="listWrap">
					<div class="listContent">
						<div class="listItem" v-for="(item, index) in goodsList" :key="index">
							<div class="goodsName">
								<span>{{ item.productName }}</span>
								<span style="padding-left: 3px">x{{ item.number }}</span>
							</div>
							<div class="codeInputWrap">
								<div class="codeInput" v-for="(data, pos) in item.codeList" :key="pos">
									<el-input v-model.trim="data.value" :ref="'input_'+ data.refPos" :disabled="data.isDisabled" @keyup.enter.native="focusNext(data)" placeholder="输入对应票码" maxlength="18" @clear="clearKeyWord" clearable></el-input>
								</div>
							</div>
						</div>
					</div>
				</el-scrollbar>
				<div class="btnWrap">
					<div class="totalInfo">
						<span>已购买项目数：{{ goodsTotal }}</span>
						<span style="padding-left: 20px">需绑定票码：{{ needTotal }}张</span>
					</div>
					<div class="btnSure" v-repeatClick @click="handleEnter">确定</div>
				</div>
			</div>
		</dc-dialog>
	</div>
</template>

<style lang="scss" scoped>
@import './bindCode.scss';
</style>
<script src="./bindCode.js"></script>

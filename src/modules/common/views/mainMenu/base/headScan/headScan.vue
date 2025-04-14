<!-- 人脸识别结果展示 -->
<template>
	<dc-dialog  v-if="headScanStatus" width="400" height="650" @close="closeDialog">
		<div class="headScanWrap">
			<div class="headTitle">人脸识别</div>
			<div class="scanContent">
				<div class="scanContentImg">
					<el-image v-if="!$app.isNull(headScanMemberInfo.sv_mr_headimg)" :src="$app.getImgUrl(headScanMemberInfo.sv_mr_headimg)"></el-image>
				</div>
				<div class="scanCenter">
					<div class="default_headImg" v-if="$app.isNull(headScanMemberInfo.sv_mr_headimg)">
						<cmd-icon type="icon-huiyuan" color="#0EEEF6" size="150"></cmd-icon>
					</div>
					<div class="topLeft">
						<div class="row"></div>
						<div class="column"></div>
					</div>
					<div class="topRight">
						<div class="row"></div>
						<div class="column"></div>
					</div>
					<div class="bottomLeft">
						<div class="row"></div>
						<div class="column"></div>
					</div>
					<div class="bottomRight">
						<div class="row"></div>
						<div class="column"></div>
					</div>
				</div>
			</div>
			<div class="memberInfo">
				<div class="topLeft">
					<div class="row"></div>
					<div class="column"></div>
				</div>
				<div class="topRight">
					<div class="row"></div>
					<div class="slant">
						<span class="item" v-for="(item, index) in 7" :key="index"></span>
					</div>
					<div class="column"></div>
				</div>
				<div class="bottomLeft">
					<div class="row"></div>
					<div class="slant">
						<span class="item" v-for="(item, index) in 7" :key="index"></span>
					</div>
				</div>
				<div class="bottomRight">
					<div class="row"></div>
					<div class="column"></div>
				</div>
				<div class="infoCenter">
					<div class="infoItem">
						<span>姓名：{{ headScanMemberInfo.sv_mr_name }}</span>
					</div>
					<div class="infoItem">
						<span>等级：{{ headScanMemberInfo.sv_ml_name }}</span>
					</div>
					<div class="infoItem">
						<span>手机号：{{ headScanMemberInfo.sv_mr_mobile }}</span>
					</div>
					<div class="infoItem">
						<span>生日：{{ $app.isNull(headScanMemberInfo.sv_mr_birthday) ? '' : $app.currentTime(new Date(headScanMemberInfo.sv_mr_birthday), 'yyyy-MM-dd') }}</span>
					</div>
					<div class="infoItem">
						<span>余额：{{ headScanMemberInfo.sv_mw_availableamount }}</span>
					</div>
					<div class="infoItem">
						<span>积分：{{ headScanMemberInfo.sv_mw_availablepoint }}</span>
					</div>
				</div>
			</div>
			<div class="btnWrap">
				<div class="btn cancel" @click="handleHeadScanCanel">取消</div>
				<div class="btn sure" @click="handleHeadScanSure">确定</div>
			</div>
		</div>
	</dc-dialog>
</template>

<style lang="scss" scoped>
@import './headScan.scss';
</style>
<script src="./headScan.js"></script>

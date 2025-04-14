<template>
	<div class="home">
		<template v-if="activeMask === -1">
			<c-cashier v-if="isCommon" :fastPayInfo="fastPayInfo"></c-cashier>
			<pedding-list v-if="userInfo.sv_us_industrytype === 1"></pedding-list>
			<desk-list v-if="userInfo.sv_us_industrytype === 27"></desk-list>
			<room-list v-if="isPrivateRoom && cashierJurisdiction.cashierModel === '0'"></room-list>
			<room-list2 v-if="isPrivateRoom && cashierJurisdiction.cashierModel === '1'"></room-list2>
			<education ref="courseCashier" v-if="userInfo.sv_us_industrytype === 11"></education>
			<fitness ref="fitnessCashier" v-if="userInfo.sv_us_industrytype === 32 || userInfo.sv_us_industrytype === 69"></fitness>
		</template>
		<template v-if="activeMask > -1">
			<div class="cashier_mask">
				<img class="img" v-show="activeMask === 0" :src="$store.state.base.frontImgBase + '/images/cashier/mask_01.png'" alt="" />
				<img class="img" v-show="activeMask === 1" :src="$store.state.base.frontImgBase + '/images/cashier/mask_02.png'" alt="" />
				<img class="img" v-show="activeMask === 2" :src="$store.state.base.frontImgBase + '/images/cashier/mask_03.png'" alt="" />
				<img class="img" v-show="activeMask === 3" :src="$store.state.base.frontImgBase + '/images/cashier/mask_04.png'" alt="" />
				<img class="img" v-show="activeMask === 4" :src="$store.state.base.frontImgBase + '/images/cashier/mask_05.png'" alt="" />
				<img class="img" v-show="activeMask === 5" :src="$store.state.base.frontImgBase + '/images/cashier/mask_06.png'" alt="" />
				<div class="cashier_m_btnGroup">
					<el-button @click="handleSubmit(3, 'not')" class="cashier_mbg_btn" v-repeatClick>不再提示</el-button>
					<el-button @click="handleSubmit(1, 'add')" class="cashier_mbg_btn" v-repeatClick>{{ activeMask === 5 ? '知道了' : '跳过' }}</el-button>
				</div>
				<div @click="handleLeftRight(-1)" v-show="activeMask !== 0" class="cashier_ms_item cashier_msi_left"><i class="el-icon-arrow-left" /></div>
				<div @click="handleLeftRight(1)" v-show="activeMask !== 5" class="cashier_ms_item cashier_msi_right"><i class="el-icon-arrow-right" /></div>
			</div>
		</template>
        <private-room-tips ref="refPrivateRoomTips" :visible.sync="showPrivateRoomTips"></private-room-tips>
        <quick-pay ref="quickPay" :fastPayInfo.sync="fastPayInfo"></quick-pay>
	</div>
</template>

<style lang="sass" scoped>
@import "./home.scss"
</style>
<script src="./home.js"></script>

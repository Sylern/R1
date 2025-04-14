<template>
	<div class="customScreen" ref="customScreen" tabindex="0" @keyup.stop="listenKeyup" @click="startVideo">
		<img class="img" v-if="type === 0 && hasSetting" :src="'https://ds.decerp.cc/images/'+ customBg" />
        <div class="type1" v-if="type === 1">
			<div class="title">总金额</div>
			<div class="value">{{'￥'+ $app.moneyFixed(carttingData.dealMoney) }}</div>
		</div>
		<div class="type2" v-if="type === 2">
			<div class="topName">
				<span>{{ userInfo.sv_us_name }}</span>
			</div>
			<div class="goodsListWrap">
				<div class="topHeader">
					<div class="cell1">
						<span>商品名称</span>
					</div>
					<div class="cell2">
						<span>单价</span>
					</div>
					<div class="cell3">
						<span>数量</span>
					</div>
					<div class="cell4">
						<span>小计</span>
					</div>
				</div>
				<div class="tableBody">
					<el-scrollbar ref="scrollList" style="width: 100%; height: 100%; overflow: hidden">
						<div class="goodsItem" v-for="(goodsItem, index) in carttingData.productResults" :key="index">
							<div class="cell1">
								<span>{{ goodsItem.isNewSpec ? goodsItem.productName + ' [' + goodsItem.sepcs + ']' : goodsItem.productName }}</span>
							</div>
							<div class="cell2">
								<span>{{ $app.moneyFixed(goodsItem.dealPrice) }}</span>
							</div>
							<div class="cell3">
								<span>{{ goodsItem.number }}</span>
							</div>
							<div class="cell4">
								<span>{{ $app.moneyFixed(goodsItem.dealMoney) }}</span>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</div>
			<div class="bottomTotal">
				<div class="totalNumber">
					<span>数量：</span>
					<span class="value">{{ carttingData.buyNumber }}</span>
				</div>
				<div class="totalMoney">
					<span>合计金额(元)：</span>
					<span class="value">{{ $app.moneyFixed(carttingData.dealMoney) }}</span>
				</div>
			</div>
		</div>
		<div class="type3" v-if="type === 3 || type === 5">
			<div class="imgList" v-if="type === 3">
				<template v-for="(item, index) in imgList">
					<img class="img" :class="{ isShow: imgPos === index }" :src="imgBase + item" :key="index" />
				</template>
			</div>
			<div class="videoWrap" v-if="type === 5">
				<video id="pageVideo1" :src="vidoeSrc" @ended="playEnd"></video>
			</div>
		</div>
		<div class="type4" v-if="type === 4 || type === 6">
			<div class="left">
				<div class="imgList" v-if="type === 4">
					<template v-for="(item, index) in imgList">
						<img class="img" :class="{ isShow: imgPos === index }" :src="imgBase + item" :key="index" />
					</template>
				</div>
				<div class="videoWrap" v-if="type === 6">
					<video id="pageVideo2" :src="vidoeSrc" @ended="playEnd"></video>
				</div>
			</div>
			<div class="goodsWrap">
				<div class="topName">
					<span>{{ userInfo.sv_us_name }}</span>
				</div>
				<div class="goodsListWrap">
					<div class="topHeader">
						<div class="cell1">
							<span>商品名称</span>
						</div>
						<div class="cell2">
							<span>单价</span>
						</div>
						<div class="cell3">
							<span>数量</span>
						</div>
						<div class="cell4">
							<span>小计</span>
						</div>
					</div>
					<div class="tableBody">
						<el-scrollbar ref="scrollList" style="width: 100%; height: 100%; overflow: hidden">
							<div class="goodsItem" v-for="(goodsItem, index) in carttingData.productResults" :key="index">
								<div class="cell1">
									<span>{{ goodsItem.isNewSpec ? goodsItem.productName + ' [' + goodsItem.sepcs + ']' : goodsItem.productName }}</span>
								</div>
								<div class="cell2">
									<span>{{ $app.moneyFixed(goodsItem.dealPrice) }}</span>
								</div>
								<div class="cell3">
									<span>{{ goodsItem.number }}</span>
								</div>
								<div class="cell4">
									<span>{{ $app.moneyFixed(goodsItem.dealMoney) }}</span>
								</div>
							</div>
						</el-scrollbar>
					</div>
				</div>
				<div class="bottomTotal">
					<div class="totalNumber">
						<span>数量：</span>
						<span class="value">{{ carttingData.buyNumber }}</span>
					</div>
					<div class="totalMoney">
						<span>合计金额(元)：</span>
						<span class="value">{{ $app.moneyFixed(carttingData.dealMoney) }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
@import "./customScreen.scss"
</style>
<script src="./customScreen.js"></script>

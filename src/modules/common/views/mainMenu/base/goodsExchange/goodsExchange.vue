<!--换货弹窗-->
<template>
	<div class="goodsExchange" ref="goodsExchange" v-if="dialogVisible">
		<dc-dialog width="900" height="580" title="换货" @close="closeDialog">
			<div class="contentWrap">
				<myTable ref="myTable" rowKey="id" :data="orderList">
					<my-table-cell fixed label="序号" prop="序号" width="80" align="center">
						<template v-slot:default="scope">
							<span>{{ scope.index > -1 ? scope.index+1 : ''}}</span>
						</template>
					</my-table-cell>
					<my-table-cell fixed label="商品名称" prop="product_name" width="250" showTooltip>
						<template v-slot:default="scope">
							<div class="contentName">
								<span class="main">{{ scope.product_name }}</span>
								<span class="sub" v-html="calcTaste(scope)"></span>
							</div>
						</template>
					</my-table-cell>
					<my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
					<my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                    <my-table-cell label="可换数量" prop="product_num" align="center">
                        <template v-slot:default="scope">
                            <span>{{ scope.index > -1 ? scope.product_num : '' }}</span>
                        </template>
                    </my-table-cell>
					<my-table-cell label="换货数量" prop="currentNumber" align="center">
						<template v-slot:default="scope">
                            <div class="currentNumber" v-if="scope.index > -1" @click.stop="">
								<span class="btn" @click.stop="handleGoodsNumberSubtract(scope, scope.index)">-</span>
								<span class="value" @click.stop="showNumberChange(scope)">{{ scope.currentNumber }}</span>
								<span class="btn" @click.stop="handleGoodsNumberAdd(scope, scope.index)">+</span>
							</div>
						</template>
					</my-table-cell>
                    <my-table-cell label="成交单价" prop="product_unitprice" align="center">
                        <template v-slot:default="scope">
                            <span>{{ scope.index > -1 ? scope.product_unitprice : '' }}</span>
                        </template>
                    </my-table-cell>
				</myTable>
			</div>
			<div class="btnWrap">
				<div class="left">
					<div class="item" v-if="checkedTotalInfo.num">
						<span>换货数量：</span>
						<span class="value">{{ checkedTotalInfo.num }}</span>
					</div>
					<div class="item" v-if="checkedTotalInfo.num">
						<span>合计金额：</span>
						<span class="value">{{ $app.moneyFixed(checkedTotalInfo.totalMoney, 2) }}</span>
					</div>
					<div class="remark">
						<el-input v-model="remark" placeholder="换货备注"></el-input>
					</div>
				</div>
				<div class="right">
					<div class="btnSure" :class="{ disabled: checkedJson.length < 1 }" @click="handleExchangeNext">下一步</div>
				</div>
			</div>
		</dc-dialog>
		<dc-dialog width="1200" height="700" v-if="popExchangeStuts" @close="popExchangeStuts = false">
			<div class="popExchange">
				<div class="popExchangeLeft">
					<div class="popTitle">
						<div class="text">选择换取的商品</div>
					</div>
					<div class="popCashier">
						<div class="header">
							<div class="td1">商品名称</div>
							<div class="td2">数量</div>
							<div class="td3">单价</div>
							<div class="td4">小计</div>
							<div class="td5">操作</div>
						</div>
						<div class="list">
							<el-scrollbar ref="goodsList" class="list_wrap">
								<div class="listContent">
									<div class="goodsItem returnItem" v-for="(item, index) in checkedJson" :key="index">
										<div class="td1">{{ item.product_name }}</div>
										<div class="td2">
											<span>-{{ item.currentNumber }}</span>
										</div>
										<div class="td3"></div>
										<div class="td4">{{ $app.multiplyNumber(item.currentNumber, item.product_unitprice) }}</div>
										<div class="td5">
											<div class="returnFlag">
												<span>换货</span>
												<div class="shape"></div>
											</div>
										</div>
									</div>
									<div class="goodsItem" v-for="(item, index) in carttingData" :key="index">
										<div class="td1">{{ item.productName }}</div>
										<div class="td2 tdControl" @click="handleGoodsNumber(item)">
											<span>{{ item.number }}</span>
											<i class="el-icon-edit"></i>
										</div>
										<div class="td3 tdControl" @click="handleGoodsPrice(item)">
											<span>{{ item.dealPrice }}</span>
											<i class="el-icon-edit"></i>
										</div>
										<div class="td4">{{ item.dealMoney }}</div>
										<div class="td5">
											<div class="btnDelete" @click.stop="handleDel(index)">
												<i class="el-icon-delete"></i>
											</div>
										</div>
									</div>
								</div>
							</el-scrollbar>
						</div>
					</div>
					<div class="popLeftBottom" v-if="totalCarttingInfo.num > 0">
						<div class="goodsTotal">
							<div class="totalNum">
								<span>数量合计：</span>
								<span>{{ totalCarttingInfo.num }}</span>
							</div>
							<div class="totalMoney">
								<span>金额合计：</span>
								<span>{{ $app.moneyFixed(totalCarttingInfo.totalMoney, 2) }}</span>
							</div>
						</div>
						<div class="moneyInfo">
							<div class="key">{{ checkedTotalInfo.payMoney > 0 ? '应补金额' : '可退金额'}}</div>
							<div class="value">
								<span>￥</span>
								<span>{{ $app.moneyFixed(Math.abs(checkedTotalInfo.payMoney), 2) }}</span>
							</div>
						</div>
						<div class="payTypeTop">
							<div class="infoLeft">支付方式</div>
							<div class="infoRight">
								<span>打印小票</span>
								<el-switch v-model="checkPrint"></el-switch>
							</div>
						</div>
						<pay-type-list ref="payTypeList" :payInfo="payInfo" refuseScan :isDisabled="isSubmitting" @paySuccess="submitSuccess" @closeScan="handleCloseScan" />
						<el-button :disabled="isSubmitting" class="btnCheck" v-repeatClick  @click="handleCheck">确定结算</el-button>
					</div>
				</div>
				<div class="popExchangeRight">
					<div class="searchWrap">
						<el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.enter.stop="searchGoodsList" @clear="searchGoodsList" clearable placeholder="条码/助词码（大写）">
							<i @click="searchGoodsList" slot="suffix" class="el-input__icon el-icon-search"></i>
						</el-input>
					</div>
					<div class="categoryWrap">
						<div class="categoryItem" :class="{ selected: queryGoods.category === item.value }" v-for="(item, index) in categoryList" :key="index" @click="handleCategory(item)">
							<span>{{ item.label }}</span>
						</div>
					</div>
					<div class="goodsWrap">
						<div class="goodsList">
							<el-scrollbar ref="goodsListScroll" style="width: 100%; height: 100%">
								<div class="listWrap">
									<div class="itemContent" :class="{ isBig: imgModelType === '1' }"  v-for="(item, index) in goodsList" :index="index" :key="index">
										<goodsItem ref="goodsItem" isCurrent :goodsItem="item" @addCart="addCart" />
									</div>
								</div>
							</el-scrollbar>
						</div>
						<div class="pageWrap">
							<div class="btnLast btn" v-if="goodsTotal > 0" :class="{'disabled': queryGoods.pageIndex === 1}" @click="pageLast">
								<i class="el-icon-arrow-left"></i>
							</div>
							<div class="pages" v-if="goodsTotal > 0">{{queryGoods.pageIndex +'/'+ goodsTotal}}</div>
							<div class="btnNext btn" v-if="goodsTotal > 0" :class="{'disabled': queryGoods.pageIndex === goodsTotal}" @click="pageNext">
								<i class="el-icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</dc-dialog>
		<div id="ball" :style="ballAnimation">
			<img class="img" v-if="animationImg" :src="animationImg" style="width:100%; height:100%;" />
			<img class="img" v-else :src="$store.state.base.frontImgBase + '/images/cashier/noGoodsImg.png'" />
		</div>

		<!-- 换货原订单改数量 -->
		<number-change :visible.sync="goodsNumberChangeStatus" title="换货数量" :onlyNumber="currentExchangeItem.sv_pricing_method === 0" compare :defaultNumber="currentExchangeItem.product_num" @handleNumberChange="handleNumberChange"></number-change>

		<!-- 换货购物车改数量 -->
		<number-change :visible.sync="carttingGoodsNumberChangeStatus" title="商品数量" :onlyNumber="currentCarrtingItem.sv_pricing_method === 0" :defaultNumber="currentCarrtingItem.number" @handleNumberChange="handleCarttingNumberChange"></number-change>

		<!-- 改价改折 -->
        <price-change :visible.sync="priceChangeStatus" :improtMoney="currentCarrtingItem.dealPrice" @submitMoney="handleCarttingPriceChange"></price-change>
	</div>
</template>

<style lang="scss" scoped>
@import './goodsExchange.scss';
</style>
<script src="./goodsExchange.js"></script>

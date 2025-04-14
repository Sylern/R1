<!--美业购物车-->
<template>
	<div class="carttingMeiye">
		<div class="tableWrap">
			<el-empty v-if="carttingData.productResults.length === 0" description="暂未添加商品"></el-empty>
			<el-scrollbar v-else ref="scrollList" style="width: 100%; height: 100%">
				<div class="cartItem" :class="{ selected: currentPos === index, isPackage: item.isPackage }" v-for="(item, index) in carttingData.productResults" :key="index" @click="handleItemSelected(item, index)">
					<div class="content">
						<div class="itemPackage" v-if="item.isPackage">套</div>
						<div class="dataMain">
							<div class="rowTop row">
								<div class="cell1">
									<span class="index">{{ index + 1 }}</span>
								</div>
								<div class="cell2">
									<span>商品</span>
								</div>
								<div class="cell3">
									<span>数量</span>
								</div>
								<div class="cell4">
									<span>单价</span>
								</div>
								<div class="cell5">
									<span>小计</span>
								</div>
								<div class="cell6"></div>
							</div>
							<div class="rowMiddle row">
								<div class="cell1"></div>
								<div class="cell2">
									<div class="goodsName">
										<div class="topInfo">
											<span>{{ item.barCode }}</span>
										</div>
										<div class="nameText">
											<span>{{ item.isNewSpec ? item.productName + '[' + item.sepcs + ']' : item.productName }}</span>
										</div>
										<div class="subInfo" v-html="handleCartering(item)"></div>
									</div>
									<div class="flag_kouci" v-if="showkouciFlag(item)">
										<div class="img">
											<img class="img" src="@/assets/images/cashier/kouci.png" />
										</div>
										<div class="btnClearKouci" @click.stop="handleClearKouci(index)">
											<i class="el-icon-close"></i>
										</div>
									</div>
								</div>
								<div class="cell3">
									<!-- <div class="btnSubtract" @click.stop="handleSubtract(item,index)">
                                        <span>-</span>
                                    </div> -->
									<div class="product_num" @click.stop="handleNumberChange(index)">
										<span>x{{ item.number }}</span>
									</div>
									<!-- <div class="btnAdd" @click.stop="handleAdd(item,index)">
                                        <span>+</span>
                                    </div> -->
								</div>
								<div class="cell4" @click.stop="handlePriceChange(index)">
									<span class="dealPrice">{{ $app.moneyFixed(item.dealPrice) }}</span>
								</div>
								<div class="cell5">
									<span class="dealMoney">{{ $app.moneyFixed(item.dealMoney) }}</span>
								</div>
								<div class="cell6">
									<div class="btnDelete" @click.stop="handleDel(index)">
										<i class="el-icon-delete"></i>
									</div>
								</div>
							</div>
							<div class="rowBottom row">
								<div class="cell1"></div>
								<div class="cell2" v-html="handleProductCouponDesc(item)"></div>
								<div class="cell4" v-html="handleProductCouponMoney(item)"></div>
								<div class="cell6"></div>
							</div>
						</div>
						<div class="subWrap">
							<div class="subItem" v-for="(data, pos) in item.packageGroups" :key="pos">
								<div class="subName">
									<span>—— {{ data.name }} ——</span>
								</div>
								<div v-for="(k, p) in data.products" :key="p">
									<div class="rowTop row">
										<div class="cell1"></div>
										<div class="cell2">
											<div class="goodsNumber">{{ k.barCode }}</div>
										</div>
										<div class="cell3"></div>
										<div class="cell4"></div>
										<!-- <div class="cell5"></div> -->
										<div class="cell6"></div>
									</div>
									<div class="rowMiddle row">
										<div class="cell1"></div>
										<div class="cell2">
											<div class="goodsName">
												<div class="nameText">
													<span>{{ k.name }}</span>
												</div>
												<div class="subInfo" v-html="handleCarteringSub(k)"></div>
											</div>
										</div>
										<div class="cell3">
											<div class="product_num">
												<span>x{{ k.number }}</span>
											</div>
										</div>
										<div class="cell4">
											<div class="salePrice">
												<span>{{ $app.moneyFixed(k.price) }}</span>
											</div>
										</div>
									</div>
									<div class="rowBottom row">
										<div class="cell1"></div>
										<div class="cell2" v-html="handleProductCouponDesc(k)"></div>
										<div class="cell3"></div>
										<div class="cell4" v-html="handleProductCouponMoney(k)"></div>
									</div>
								</div>
							</div>
						</div>
						<!-- 美业-服务人 -->
						<div class="workerWrap" @click.stop="" v-if="goodsEmployeeList">
							<div class="productCommon" v-if="item.productType === 0 && currentEmployeeList(index, item).employeeList">
								<!-- 普通商品 -->
								<div class="salerTitle">
									<div class="text">销售人员</div>
								</div>
								<div class="listItem" v-for="(emItem, emIndex) in currentEmployeeList(index, item).employeeList" :key="emIndex">
									<div class="itemLeft">
										<div class="logo">
											<cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="#8056F7"></cmd-icon>
											<img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
										</div>
										<div class="name">{{ emItem.sv_employee_name }}</div>
										<div class="text"></div>
									</div>
									<div class="itemRight">
										<div class="btnDelete" @click.stop="handleServiceDelete(index, item, emIndex)">
											<i class="el-icon-error"></i>
										</div>
										<!-- <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
											<cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
										</div> -->
									</div>
								</div>
								<div class="listItem" v-if="currentEmployeeList(index, item).employeeList.length === 0">
									<div class="itemLeft">
										<div class="logo"></div>
										<div class="name"></div>
										<div class="text"></div>
									</div>
									<div class="itemRight">
										<div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
											<cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
										</div>
									</div>
								</div>
							</div>
							<div class="productMeiye" v-if="item.productType === 1 && currentEmployeeList(index, item).employeeList">
								<!-- 服务产品 -->
                                <div class="listItem" v-for="(emItem, emIndex) in currentEmployeeList(index, item).employeeList" :key="emIndex">
                                    <div class="itemLeft bg" :class="'type' + (emIndex + 1)">
                                        <div class="wrap" @click="handleEmployeeIndex($event, emItem, index)"></div>
                                        <div class="index" v-if="!emItem.inputLocked">
                                            <div class="line" :style="{ width: emItem.percent > 0 ? emItem.percent + '%' : '3px' }"></div>
                                            <el-slider v-model="emItem.percent" :show-tooltip="false" @change="handleSliderChange(emItem, index)"></el-slider>
                                        </div>
                                        <div class="td1">
                                            <div class="isLocked" v-if="emItem.isLocked">
                                                <cmd-icon type="icon-gougou" size="16" color="#999"></cmd-icon>
                                            </div>
                                            <div class="logo">
                                                <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="#8056F7"></cmd-icon>
                                                <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                            </div>
                                            <div class="textWrap">
                                                <div class="name">{{ emItem.sv_employee_name }}</div>
                                                <div class="text">
                                                    <span class="typeName">{{ emItem.grouping_name }}</span>
                                                    <span class="workerNum">工号：{{ emItem.sv_employee_number }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="td2">
                                            <el-input placeholder="业绩占比" :disabled="emItem.inputLocked" v-model.number="emItem.percent" :max="100" @input="handlePercentInput(emItem, index)">
                                                <span slot="suffix">%</span>
                                            </el-input>
                                        </div>
                                        <div class="td3">
                                            <el-input placeholder="业绩" v-model="emItem.percentValue" @change="handlePercentValueChange($event, item, emItem, index)"></el-input>
                                        </div>
                                    </div>
                                    <div class="td4">
                                        <div class="btnRoundWrap">
                                            <el-switch v-model="emItem.isAppoint" @change="handleEmployeeAppoint(index, emItem, emIndex)"></el-switch>
                                        </div>
                                        <div class="btnDelete" @click.stop="handleServiceDelete(index, item, emIndex)">
                                            <i class="el-icon-error"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="listItem isEmpty" v-if="currentEmployeeList(index, item).employeeList.length !== 4">
                                    <div class="itemLeft">
                                        <div class="td1">
                                            <div class="logo"></div>
                                            <div class="name">第{{ workerTextList[currentEmployeeList(index, item).employeeList.length] }}工位</div>
                                            <div class="text"></div>
                                        </div>
                                        <div class="td2"></div>
                                        <div class="td3"></div>
                                    </div>
                                    <div class="td4">
                                        <div class="btnRoundWrap"></div>
                                        <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                            <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                        </div>
                                    </div>
                                </div>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<div class="tableControl">
			<div class="totalInfoWrap" :class="{ isShow: totalPage > 0 }">
				<span class="goodsTotalNumber"
					>数量：
					<label>{{ carttingData.buyNumber }}</label>
					<span class="discount highlight" v-if="carttingData.couponMoney > 0">优惠：{{ $app.moneyFixed(carttingData.couponMoney) }}</span>
				</span>
				<div class="totalDealMoney">
					<span>合计：</span>
					<span class="highlight">¥</span>
					<span class="totalMoney highlight">{{ $app.moneyFixed(carttingData.dealMoney) }}</span>
				</div>
			</div>
		</div>
		<!-- 称重商品 -->
		<goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
		<!-- 套餐 -->
		<goods-package :visible.sync="goodsPackageStatus" :goodsId="goodsPackageItem.id" @handleSure="returnGoodsPackage"></goods-package>
		<!-- 商品改价 -->
		<price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="improtMoney" :discountMoney="improtMoney" @submitMoney="moneyEdit"></price-change>
		<!-- 设置服务员 -->
		<servicer-setting :visible.sync="servicerSettingStatus" :isSingle="isServicerSingle" :carttingPos="currentPos" @handleServicerSetting="handleServicerSetting"></servicer-setting>
        <!-- 设置服务员 -->
		<servicer-workstation :visible.sync="servicerWorkstationStatus" :carttingPos="currentPos" @handleServicerSetting="handleServicerSetting"></servicer-workstation>
	</div>
</template>

<style lang="scss" scoped>
@import './carttingMeiye.scss';
</style>
<script src="./carttingMeiye.js"></script>

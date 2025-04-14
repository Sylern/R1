<!--基础设置-->
<template>
	<div class="cashierBase">
		<el-scrollbar style="width: 100%; height: 100%">
			<div class="containar">
				<div class="itemBox main">
					<div class="top">
						<div class="left">
							<span class="itemName">流水单号设置</span>
							<span class="itemSub">每次销售后单号自动+1，流水单号只能大于上次设置的流水单号</span>
						</div>
					</div>
				</div>
				<div class="itemBox">
					<div class="top">
						<div class="left">
							<span class="itemName">初始单号：</span>
							<div class="itemSub">
								<el-input placeholder="请输入单号" v-model="sv_uc_serialnumberset.valu" @input.native="handleSerialnumberChange"></el-input>
								<span class="btn" v-debounce="handleSerialnumber">确定</span>
							</div>
						</div>
					</div>
				</div>

				<div class="itemBox main" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'">
					<div class="top">
						<div class="left">
							<span class="itemName">每日流水号（取餐号）</span>
							<span class="itemSub">每日流水号重置</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.EveryDaySerialNumber.enable" @change="switchEveryDaySerialNumber"></el-switch>
						</div>
					</div>
					<div class="itemContent">
						<div class="itemContentLeft">
							<div class="valueBox">
								<span class="contentName">编号前缀</span>
								<div class="itemSub">
									<el-select v-model="dataObj.EveryDaySerialNumber.input1" :disabled="!dataObj.EveryDaySerialNumber.enable" placeholder="请选择编号前缀">
										<el-option value="" label="--"></el-option>
										<el-option value="A" label="A"></el-option>
										<el-option value="B" label="B"></el-option>
										<el-option value="C" label="C"></el-option>
										<el-option value="D" label="D"></el-option>
										<el-option value="E" label="E"></el-option>
									</el-select>
									<!-- <el-input :disabled="!dataObj.EveryDaySerialNumber.enable" maxlength="2" v-model="dataObj.EveryDaySerialNumber.input1" @keyup.native="handleEveryDayInput($event, 'en', 'input1')" placeholder="请输入编号前缀"></el-input> -->
								</div>
							</div>
							<div class="valueBox">
								<span class="contentName">最小长度</span>
								<div class="itemSub">
									<el-input :disabled="!dataObj.EveryDaySerialNumber.enable" v-model="dataObj.EveryDaySerialNumber.input2" @keyup.native="handleEveryDayInput($event, 'number', 'input2')" placeholder="请输入最小长度"></el-input>
								</div>
							</div>
							<div class="valueBox">
								<span class="contentName">填充字符</span>
								<div class="itemSub">
									<!-- <el-input :disabled="!dataObj.EveryDaySerialNumber.enable" maxlength="1" v-model="dataObj.EveryDaySerialNumber.input3" @keyup.native="handleEveryDayInput($event, 'en', 'input3')" placeholder="请输入填充字符"></el-input> -->
									<el-input disabled v-model="dataObj.EveryDaySerialNumber.input3" @keyup.native="handleEveryDayInput($event, 'en', 'input3')" placeholder="请输入填充字符"></el-input>
								</div>
							</div>
							<div class="valueBox">
								<span class="contentName">最大长度</span>
								<div class="itemSub">
									<el-input :disabled="!dataObj.EveryDaySerialNumber.enable" v-model="dataObj.EveryDaySerialNumber.input4" @keyup.native="handleEveryDayInput($event, 'number', 'input4')" placeholder="请输入最大长度"></el-input>
								</div>
							</div>
							<div class="valueBox">
								<span class="btn" :class="{ disabled: !dataObj.EveryDaySerialNumber.enable }" v-debounce="handleEveryDaySerialNumber">确定</span>
							</div>
						</div>
						<div class="itemContentRight">
							<div class="text">预览</div>
							<div class="showBox">
								<span>{{ previewNumber }}</span>
							</div>
						</div>
					</div>
				</div>
                <div class="itemBox main hasRight" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'">
                    <div class="top">
						<div class="left">
							<span class="itemName">牌号设置</span>
							<span class="itemSub">开启后，轻餐下单输入牌号，打印在小票上</span>
						</div>
						<div class="right">
							<el-switch v-model="openBrandNum" @change="handleBrandNumSwitch"></el-switch>
						</div>
					</div>
                </div>

				<div class="itemBox main">
					<div class="top">
						<div class="left">
							<span class="itemName">销售设置</span>
							<!-- <span class="itemSub">开启后门店可自行设置</span> -->
						</div>
						<div class="right">
							<!-- <el-switch v-model="switchStatus"></el-switch> -->
						</div>
					</div>
				</div>
				<!-- <div class="itemBox">
                    <div class="top">
                        <div class="left">
                            <span class="itemName">显示多规格</span>
                            <span class="itemSub">开启后前台收银显示多规格商品</span>
                        </div>
                        <div class="right">
                            <el-switch v-model="dataObj.MultiSpecification.enable" @change="switchControl('MultiSpecification')"></el-switch>
                        </div>
                    </div>
                </div> -->
				<!-- <div class="itemBox" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'">
					<div class="top">
						<div class="left">
							<span class="itemName">时价商品是否允许打折</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.Current_Price_UpdateDiscount.enable" @change="switchControlSub('Current_Price_UpdateDiscount')"></el-switch>
						</div>
					</div>
				</div> -->
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">结账时是否必选销售人员（导购员）</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.SelectCommissionRequired.enable" @change="switchControl('SelectCommissionRequired')"></el-switch>
						</div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">次卡购买、充值时是否必选销售人员（导购员）</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.RechargeSelectCommissionRequired.enable" @change="switchControl('RechargeSelectCommissionRequired')"></el-switch>
						</div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">负库存销售</span>
							<span class="itemSub">开启后可以负库存销售</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.ZeroInventorySales.enable" @change="switchControl('ZeroInventorySales')"></el-switch>
						</div>
					</div>
				</div>
				<!-- <div class="itemBox">
                    <div class="top">
                        <div class="left">
                            <span class="itemName">
                                <label>商品拆分自动拆分销售</label>
                                <el-tooltip class="btnItem item" effect="dark" placement="right">
                                    <div slot="content">未开启零库存销售时，当大件商品还有库存，小件商品没有库存销售时，自动拆开大件商品进行销售，减去大件商品库存，对应增加小件商品库存。</div>
                                    <div class="tips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </span>
                        </div>
                        <div class="right">
                            <el-switch v-model="dataObj.SplitOpenACase.enable" @change="switchControl('SplitOpenACase')"></el-switch>
                        </div>
                    </div>
                </div> -->
				<!-- <div class="itemBox">
                    <div class="top">
                        <div class="left">
                            <span class="itemName">
                                <label>商品拆分自动组合销售</label>
                                <el-tooltip class="btnItem item" effect="dark" placement="right">
                                    <div slot="content">未开启零库存销售时，当小件商品还有库存，大件商品没有库存销售时，判断小件商品够库存组合成大件商品，则销售大件商品并减去小件商品库存。</div>
                                    <div class="tips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </span>
                        </div>
                        <div class="right">
                            <el-switch v-model="dataObj.Package_Bundle_Sales.enable" @change="switchControl('Package_Bundle_Sales')"></el-switch>
                        </div>
                    </div>
                </div> -->
				<!-- <div class="itemBox">
                    <div class="top">
                        <div class="left">
                            <span class="itemName">多价格弹窗</span>
                            <span class="itemSub">开启后收银商品弹出多价格弹窗选择，关闭则直接进入购物车</span>
                        </div>
                        <div class="right">
                            <el-switch v-model="dataObj.Multiple_Price_tips.enable" @change="switchControlSub('Multiple_Price_tips')"></el-switch>
                        </div>
                    </div>
                </div> -->
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">收银商品数量是否累加</span>
							<span class="itemSub">开启后商品数量累加显示</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.Cashier_Number_Cumulation.enable" @change="switchControlSub('Cashier_Number_Cumulation')"></el-switch>
						</div>
					</div>
				</div>

				<div class="itemBox hasRight" v-if="userInfo.sv_uit_cache_name !== 'cache_name_catering'">
					<div class="top">
						<div class="left">
							<span class="itemName">收银商品是否显示{{ userInfo.sv_uit_cache_name !== 'cache_name_clothing_and_shoes' ? '条码' : '款号' }}</span>
							<span class="itemSub">开启后收银台商品显示条码</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.Desk_Cashier_Is_ShowCode_Switch.enable" @change="switchControlSub('Desk_Cashier_Is_ShowCode_Switch')"></el-switch>
						</div>
					</div>
				</div>

				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">收银商品是否显示上次拿货价</span>
							<span class="itemSub">开启后收银台商品显示上次结算金额</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.IsShowLastSettlement.enable" @change="switchControl('IsShowLastSettlement')"></el-switch>
						</div>
					</div>
				</div>

				<div class="itemBox main hasRight" v-if="userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground'">
					<div class="top">
						<div class="left">
							<span class="itemName">开启后无需手动输入票码即可绑定票码</span>
							<el-switch v-model="dataObj.AutoBindCode.enable" @change="switchControlSub('AutoBindCode')"></el-switch>
						</div>
						<div class="right">
						</div>
					</div>
				</div>
				<div class="itemBox" v-if="userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' && dataObj.AutoBindCode.enable">
					<div class="top">
						<div class="left">
							<span class="itemName">初始票码：</span>
							<div class="itemSub">
								<el-input placeholder="请输入初始票码" v-model="dataObj.playCode.value" maxlength="13" @input.native="handlePlayCodeChange"></el-input>
								<span class="btn" v-debounce="handleSavePlayCode">确定</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 非美业行业展示 -->
				<div class="itemBox radioWrap" v-if="userInfo.sv_uit_cache_name !== 'cache_name_cosmetology'">
					<div class="label">服务商品提成业绩平分开关</div>
					<div class="radioContent">
						<el-radio-group v-removeAria v-model="Service_Commission_Switch.sv_is_enable" @change="updateConfigSwitch">
							<el-radio :label="false">多人平分提成业绩</el-radio>
							<el-radio :label="true">单人独享100%</el-radio>
						</el-radio-group>
					</div>
				</div>

				<div class="itemBox main">
					<div class="top">
						<div class="left">
							<span class="itemName">交接班设置</span>
							<!-- <span class="itemSub">开启后门店可自行设置交接班设置</span> -->
						</div>
						<div class="right">
							<!-- <el-switch v-model="switchStatus"></el-switch> -->
						</div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">交接班</span>
							<span class="itemSub">开启后可进行交接班操作</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.succession.enable" @change="switchControl('succession')"></el-switch>
						</div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">交接班备用金</span>
							<!-- <span class="itemSub">开启后需填写备用金输入频次</span> -->
						</div>
						<div class="right">
							<el-switch v-model="sv_store_cashmoney_enable" @change="setShopCashMoneyEnable"></el-switch>
						</div>
					</div>
					<!-- <div class="itemContent">
                        <el-radio-group v-removeAria class="radioWrap" v-model="radioValue">
                            <div class="radioBox">
                                <el-radio label="每天填写" :value="1"></el-radio>
                            </div>
                            <div class="radioBox">
                                <el-radio label="每次登录填写" :value="2"></el-radio>
                            </div>
                        </el-radio-group>
                    </div> -->
				</div>

				<div class="itemBox main hasRight" v-if="userInfo.sv_uit_cache_name === 'cache_name_cosmetology'">
					<div class="top">
						<div class="left">
							<span class="itemName">牌号设置</span>
							<span class="itemSub">开启后下单将使用牌号挂单</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.HandNumber.enable" @change="switchControlSub('HandNumber')"></el-switch>
						</div>
					</div>
				</div>

				<div class="itemBox main">
					<div class="top">
						<div class="left">
							<span class="itemName">语音设置</span>
						</div>
						<div class="right"></div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">前台收银语音</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.CashierVoice.enable" @change="switchControl('CashierVoice')"></el-switch>
						</div>
					</div>
				</div>
				<div class="itemBox hasRight">
					<div class="top">
						<div class="left">
							<span class="itemName">线上来单语音</span>
						</div>
						<div class="right">
							<el-switch v-model="dataObj.OnlineOrderVoice.enable" @change="switchControl('OnlineOrderVoice')"></el-switch>
						</div>
					</div>
				</div>

				<div class="itemBox main">
					<div class="top">
						<div class="left">
							<span class="itemName">币符设置</span>
						</div>
						<div class="right"></div>
					</div>
				</div>
				<div class="itemBox">
					<div class="top">
						<div class="left">
							<span class="itemName">币符：</span>
							<div class="itemSub">
								<el-select v-model="dataObj.TokenSymbols.sv_detail_value"  placeholder="请选择币符">
										<el-option v-for="item in unitList" :key="item.id" :value="item.symbol" :label="`${item.symbol}(${item.name})`"></el-option>
									</el-select>
								<span class="btn" @click="saveUnitHandle">确定</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<style lang="scss" scope>
@import './cashierBase.scss';
</style>
<script src="./cashierBase.js"></script>

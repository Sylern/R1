<template>
	<div class="screenCustom">
		<el-scrollbar class="contentSrcoll">
			<div class="contentWrap">
				<!-- <div class="customSetting">
                    <div class="subTitle">
                        <span>客显设置</span>
                    </div>
                    <div class="line switchWrap">
                        <div class="key">
                            <span>客显设置：</span>
                        </div>
                        <div class="value">
                            <div class="switch">
                                <el-switch v-model="custom.switch"></el-switch>
                            </div>
                            <div class="info">
                                <span>说明：线下消费客户通过客显屏幕查看交易信息</span>
                            </div>
                        </div>
                    </div>
                    <div class="line portWrap">
                        <div class="key">
                            <span>通讯端口：</span>
                        </div>
                        <div class="value">
                            <el-select v-model="submitData.ic.port">
                                <el-option v-for="(item, index) in custom.port" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="line baudRate">
                        <div class="key">
                            <span>波特率：</span>
                        </div>
                        <div class="value">
                            <el-select v-model="submitData.ic.baudRate">
                                <el-option v-for="(item, index) in custom.baudRate" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="line testWrap">
                        <div class="key">
                            <span>测试客显：</span>
                        </div>
                        <div class="value">
                            <div class="slotInputBox">
                                <el-input v-model="submitData.ic.password" placeholder="0">
                                    <div slot="prepend">数量：</div>
                                </el-input>
                            </div>
                            <div class="slotInputBox">
                                <el-input v-model="submitData.ic.password" placeholder="0.00">
                                    <div slot="prepend">单价：</div>
                                    <div slot="append">测试</div>
                                </el-input>
                            </div>
                            <div class="slotInputBox">
                                <el-input v-model="submitData.ic.password" placeholder="0.00">
                                    <div slot="prepend">总计：</div>
                                    <div slot="append">测试</div>
                                </el-input>
                            </div>
                            <div class="slotInputBox">
                                <el-input v-model="submitData.ic.password" placeholder="0.00">
                                    <div slot="prepend">收款：</div>
                                    <div slot="append">测试</div>
                                </el-input>
                            </div>
                            <div class="slotInputBox">
                                <el-input v-model="submitData.ic.password" placeholder="0.00">
                                    <div slot="prepend">找零：</div>
                                    <div slot="append">测试</div>
                                </el-input>
                            </div>
                        </div>
                    </div>
                </div> -->
				<div class="screenSetting">
					<div class="containar">
						<div class="line">
							<div class="key subTitle">
								<span>分屏设置：</span>
							</div>
							<div class="value switchWrap">
								<div class="switch">
									<el-switch v-model="submitData.sv_enable"></el-switch>
								</div>
								<div class="info">
									<span>说明：线下消费客户通过分屏屏幕查看交易信息</span>
								</div>
							</div>
						</div>
						<div class="line cssContent">
							<div class="key">
								<span>样式一：</span>
							</div>
							<div class="value">
								<div class="showWrap">
									<div class="item" @click="handelModelType(1)">
										<el-radio v-model="submitData.sv_type" :label="1">文字</el-radio>
										<div class="itemContent">
											<img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/screen/screen1.png'" />
										</div>
									</div>
									<div class="item" @click="handelModelType(2)">
										<el-radio v-model="submitData.sv_type" :label="2">清单</el-radio>
										<div class="itemContent">
											<img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/screen/screen2.png'" />
										</div>
									</div>
								</div>
								<div class="importWrap"></div>
							</div>
						</div>
						<div class="line cssContent">
							<div class="key">
								<span>样式二：</span>
							</div>
							<div class="value">
								<div class="showWrap">
									<div class="item" @click="handelModelType(3)">
										<el-radio v-model="submitData.sv_type" :label="3">幻灯片</el-radio>
										<div class="itemContent">
											<div class="allImg" v-if="imgList.length < 1">图片</div>
											<div class="img" v-else>
												<img class="img" :src="imgBase + imgList[0]" />
											</div>
										</div>
									</div>
									<div class="item" @click="handelModelType(4)">
										<el-radio v-model="submitData.sv_type" :label="4">幻灯片+清单</el-radio>
										<div class="itemContent">
											<div class="left">
												<div class="noPic" v-if="imgList.length < 1">图片</div>
												<div class="img" v-else>
													<img class="img" :src="imgBase + imgList[0]" />
												</div>
											</div>
											<div class="list">
												<img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/screen/screen3.png'" />
											</div>
										</div>
									</div>
								</div>
								<div class="importWrap">
									<ImportImg :dataJson="imgList" @callback="callbackImportImg" :verifyJson="imgVerifyJson" :typeEntity="typeEntity"></ImportImg>
								</div>
							</div>
						</div>
						<div class="line cssContent">
							<div class="key">
								<span>样式三：</span>
							</div>
							<div class="value">
								<div class="showWrap">
									<div class="item" @click="handelModelType(5)">
										<el-radio v-model="submitData.sv_type" :label="5">视频</el-radio>
										<div class="itemContent">
											<div class="allImg" v-if="videoList.length < 1">视频封面</div>
                                            <video ref="video1" v-else :src="videoBase + videoList[0]"></video>
										</div>
									</div>
									<div class="item" @click="handelModelType(6)">
										<el-radio v-model="submitData.sv_type" :label="6">视频+清单</el-radio>
										<div class="itemContent">
											<div class="left">
												<div class="noPic" v-if="videoList.length < 1">视频封面</div>
                                                <video ref="video2" v-else :src="videoBase + videoList[0]"></video>
											</div>
											<div class="list">
												<img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/screen/screen3.png'" />
											</div>
										</div>
									</div>
								</div>
								<div class="importWrap">
                                    <ImportImg :dataJson="videoList" @callback="callbackImportVideo" :verifyJson="videoVerifyJson" :typeEntity="videoTypeEntity"></ImportImg>
                                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-scrollbar>
		<div class="bottomWrap">
			<div class="btn" @click="handleSave">保存</div>
		</div>
	</div>
</template>

<style lang="scss" scope>
@import './screenCustom.scss';
</style>
<script src="./screenCustom.js"></script>

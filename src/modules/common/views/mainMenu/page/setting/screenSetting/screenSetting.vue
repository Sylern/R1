<template>
    <div class="screenSetting">
        <el-scrollbar class="contentSrcoll">
            <div class="customSetting">
                <div class="line">
                    <div class="key subTitle">
                        <span>客显设置:</span>
                    </div>
                    <div class="value switchWrap">
                        <div class="switch">
                            <el-switch v-model="settingSwitch"></el-switch>
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
                        <el-select v-model="query[0].value">
                            <el-option v-for="item in ports" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="line baudRate">
                    <div class="key">
                        <span>波特率：</span>
                    </div>
                    <div class="value">
                        <el-select v-model="query[1].value">
                            <el-option v-for="item in baudRates" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="line testWrap">
                    <div class="key">
                        <span>测试客显：</span>
                    </div>
                    <div class="value">
                        <!-- <div class="slotInputBox">
                        <el-input v-model="testData.count" placeholder="0">
                            <div slot="prepend">数量：</div>
                        </el-input>
                    </div> -->
                        <div class="slotInputBox">
                            <el-input v-model="testData.price" placeholder="0.00">
                                <div slot="prepend">单价：</div>
                                <div slot="append" @click="testHandle(1, testData.price)">测试</div>
                            </el-input>
                        </div>
                        <div class="slotInputBox">
                            <el-input v-model="testData.total" placeholder="0.00">
                                <div slot="prepend">总计：</div>
                                <div slot="append" @click="testHandle(2, testData.total)">测试</div>
                            </el-input>
                        </div>
                        <div class="slotInputBox">
                            <el-input v-model="testData.get" placeholder="0.00">
                                <div slot="prepend">收款：</div>
                                <div slot="append" @click="testHandle(3, testData.get)">测试</div>
                            </el-input>
                        </div>
                        <div class="slotInputBox">
                            <el-input v-model="testData.pay" placeholder="0.00">
                                <div slot="prepend">找零：</div>
                                <div slot="append" @click="testHandle(4, testData.pay)">测试</div>
                            </el-input>
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

<script src="./screenSetting.js"></script>
<style lang="scss" scoped>
@import "./screenSetting.scss";
</style>
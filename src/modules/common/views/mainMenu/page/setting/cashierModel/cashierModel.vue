<template>
    <div class="cashierModel">
        <el-scrollbar ref="pageScroll" style="width: 100; height: 100%;">
            <div class="contentWrap">
                <div class="itemWrap">
                    <div class="itemTitle">
                        <span>收银模式选择</span>
                    </div>
                    <div class="itemValue">
                        <div class="item" @click="handelType('0')">
                            <el-radio v-model="cashierType" label="0">房台看板</el-radio>
                            <div class="containar">
                                <img class="img img1" :src="$store.state.base.frontImgBase + '/images/cashier/setting/cashierModel1.png'" />
                            </div>
                        </div>
                        <div class="item" @click="handelType('1')">
                            <el-radio v-model="cashierType" label="1">功能看板</el-radio>
                            <div class="containar">
                                <img class="img img2" :src="$store.state.base.frontImgBase + '/images/cashier/setting/cashierModel2.png'" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="itemWrap">
                    <div class="itemTitle">
                        <span>自动预结提醒</span>
                    </div>
                    <div class="itemBox">
                        <span class="key">是否启用预结提醒：</span>
                        <el-switch v-model="remind.PrekontRemind" @change="handleConfigSave('PrekontRemind', 'remind', 'PrekontRemind')"></el-switch>
                    </div>
                    <template v-if="remind.PrekontRemind">
                        <div class="itemBox">
                            <span class="key pright">房台预结前，提前</span>
                            <el-select class="timeSelect" v-model="remind.PrekontRemindTime" @change="handleConfigSave('PrekontRemind', 'remind','PrekontRemindTime')">
                                <el-option v-for="(item, index) in 59" :key="index" :label="item" :value="item"></el-option>
                            </el-select>
                            <span>分钟提醒</span>
                            <!-- <span class="btn" @click="handleConfigSave('PrekontRemind', 'remind','PrekontRemindTime')">确定</span> -->
                        </div>
                        <div class="itemBox">
                            <span class="key">启用消息提醒：</span>
                            <el-switch v-model="remind.PrekontMessage" @change="handleConfigSave('PrekontRemind', 'remind','PrekontMessage')"></el-switch>
                        </div>
                        <div class="itemBox">
                            <span class="key">启用弹窗提醒：</span>
                            <el-switch v-model="remind.PrekontTips" @change="handleConfigSave('PrekontRemind', 'remind','PrekontTips')"></el-switch>
                        </div>
                        <div class="itemBox">
                            <span class="key">启用语音播报：</span>
                            <el-switch v-model="remind.PrekontVoice" @change="handleConfigSave('PrekontRemind', 'remind','PrekontVoice')"></el-switch>
                        </div>
                    </template>
                    <div class="itemBox">
                        <span class="key">预结后是否自动断电：</span>
                        <el-switch v-model="remind.PrekontDelay" @change="handleConfigSave('PrekontRemind', 'remind', 'PrekontDelay')"></el-switch>
                    </div>
                </div>
                <div class="itemWrap">
                    <div class="itemTitle">
                        <span>延时关灯设置</span>
                    </div>
                    <div class="itemBox">
                        <span class="key">是否启用延时关灯：</span>
                        <el-switch v-model="delay.SettlementDelay" @change="handleConfigSave('SettlementDelay', 'delay','SettlementDelay')"></el-switch>
                    </div>
                    <template v-if="delay.SettlementDelay">
                        <div class="itemBox">
                            <span class="key pright">房台结算后，延时</span>
                            <el-select class="timeSelect" v-model="delay.SettlementDelayTime" @change="handleConfigSave('SettlementDelay','delay','SettlementDelayTime')">
                                <el-option v-for="(item, index) in 59" :key="index" :label="item" :value="item"></el-option>
                            </el-select>
                            <span>分钟断电</span>
                            <!-- <span class="btn" @click="handleConfigSave('SettlementDelay','delay','SettlementDelayTime')">确定</span> -->
                        </div>
                    </template>
                </div>
                 <div class="itemWrap">
                    <div class="itemTitle">
                        <span>预约订单设置</span>
                    </div>
                    <div class="itemBox">
                        <span class="key">是否启用自动核销：</span>
                        <el-switch v-model="openTable.AutoOpenTable" @change="handleConfigSave('AutoOpenTable', 'openTable','AutoOpenTable')"></el-switch>
                    </div>
                    <div class="itemBox">
                        <span class="key">暂停是否关灯：</span>
                        <el-switch v-model="pauseInfo.PauseClose" @change="handleConfigSave('BillablePause', 'pauseInfo','PauseClose')"></el-switch>
                    </div>
                    <div class="itemBox">
                        <span class="key">暂停是否累计预结时长：</span>
                        <el-switch v-model="pauseInfo.PauseAccruedDuration" @change="handleConfigSave('BillablePause', 'pauseInfo','PauseAccruedDuration')"></el-switch>
                    </div>
                 </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<style lang="scss" scope>
@import './cashierModel.scss';
</style>
<script src="./cashierModel.js"></script>
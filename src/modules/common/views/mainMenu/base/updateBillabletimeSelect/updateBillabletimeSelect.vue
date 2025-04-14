<!--修改计时弹窗-->
<template>
    <dc-dialog v-if="dialogVisible" width="880" height="420" title="修改计费规则" @close="dialogVisible = false">
        <div class="updateBillabletimeSelect">
            <div class="nameWrap">
                <div class="left">
                    <div class="infoItem">
                        <span class="key">当前计费规则：</span>
                        <span class="value">{{ billabletimeInfo.configName }}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="infoItem">
                        <span class="key">新的计费规则：</span>
                        <span class="value">
                            <el-select v-model="sv_billable_id">
                                <el-option v-for="(item, index) in this.billabletimeData.list.filter(item => item.value !== billabletimeInfo.configId)" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </span>
                    </div>
                </div>
            </div>
            <div class="updateInfo">
                <div class="itemListWrap">
                    <div class="infoItem">
                        <span class="key">计费时长：</span>
                        <span class="value">{{ billabletimeInfo.durationString }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">开始时间：</span>
                        <span class="value">{{ billabletimeInfo.startTime }}</span>
                    </div>
                    <div class="infoItem">
                        <span class="key">计费金额：</span>
                        <span class="value">{{ billabletimeInfo.totalMoney }}</span>
                    </div>
                </div>
                <!-- <div class="infoItem">
                    <span class="key">商品费用：</span>
                    <span class="value">{{ $app.moneyFixed(carttingData.dealMoney) || '' }}</span>
                </div> -->
                <!-- <div class="tips">
                    <div class="tipsLeft">
                        <span>注：</span>
                    </div>
                    <div class="tipsRight">
                        <div class="tipsLine">1、修改计费规则后，必须先点击试算费用后才能点击确定修改!</div>
                        <div class="tipsLine">2、修改计费规则会将之前的所有计费清单洁掉（包含提作的暂停时长）并使用修改后的计费规则从开台时间 到当前时间重新计算计时费用!</div>
                    </div>
                </div> -->
            </div>
            <div class="billabletimeBtnWrap">
                <div class="billabletimePrice"></div>
                <div class="btnItem sure" :class="{ disabled: handleUpdateTimeProp}" @click="handleSure">
                    <span>确定</span>
                </div>
            </div>
        </div>
    </dc-dialog>
</template>

<style  lang="scss" scoped>
@import './updateBillabletimeSelect.scss';
</style>
<script src="./updateBillabletimeSelect.js"></script>
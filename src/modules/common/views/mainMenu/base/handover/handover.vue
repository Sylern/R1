<!--交接班弹窗-->
<template>
    <div class="handover" ref="handover" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="5" height="8.7" title="交接班员工：张三" @close="closeDialog">
            <div class="contentWrap">
                <div class="infoWrap">
                    <div class="infoTitle">收银对账单</div>
                    <div class="timeSelect">
                        <date-time-picker needTimePicker @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="list">
                        <div class="listTitle">&#60;消费人数&#62;</div>
                        <div class="listItem">
                            <div class="key">散客消费</div>
                            <div class="value">1人</div>
                        </div>
                        <div class="listItem">
                            <div class="key">会员消费</div>
                            <div class="value">1人</div>
                        </div>
                        <div class="listItem">
                            <div class="key">合计</div>
                            <div class="value">2人</div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listTitle">&#60;会员储值金额&#62;</div>
                        <div class="listItem">
                            <div class="key">现金</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">聚合支付</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">银行卡</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">合计</div>
                            <div class="value">¥300.00</div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listTitle">&#60;散客消费&#62;</div>
                        <div class="listItem">
                            <div class="key">现金</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">聚合支付</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">银行卡</div>
                            <div class="value">¥100.00</div>
                        </div>
                        <div class="listItem">
                            <div class="key">合计</div>
                            <div class="value">¥300.00</div>
                        </div>
                    </div>
                    <el-checkbox class="printSwitch" label="打印">打印</el-checkbox>
                </div>
                <div class="btnWrap">
                    <div class="btn">仅退出系统</div>
                    <div class="btn btnSure">交接并退出系统</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './handover.scss';
</style>
<script src="./handover.js"></script>
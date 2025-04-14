<!--支付方式-->
<template>
    <div class="numberChange" v-if="dialogVisible">
        <dc-dialog width="620" title="延期" height="300" class="delay" @close="handleClose">
            <div class="delayContent">
                <el-radio-group v-removeAria v-model="tabPosition" style="margin-bottom: 30px;" @change="handleTab">
                    <el-radio-button label="1">1个月</el-radio-button>
                    <el-radio-button label="2">3个月</el-radio-button>
                    <el-radio-button label="3">6个月</el-radio-button>
                    <el-radio-button label="4">一年</el-radio-button>
                    <el-radio-button label="5">长期</el-radio-button>
                    <el-radio-button label="6">自定义</el-radio-button>
                </el-radio-group>
                <el-date-picker v-model="currentTime" type="date" :disabled="timeDisabled" placeholder="选择日期"></el-date-picker>
                <div class="btnWrap">
                    <el-button class="btn" @click="handleClose">取消</el-button>
                    <el-button class="btn" type="primary" @click="handleSure">确定</el-button>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './delay.scss';
</style>
<script src="./delay.js"></script>
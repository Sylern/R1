<template>
    <div class="salesPrint">
        <div class="subTitle">
            <span>销售小票设置</span>
        </div>
        <div class="contentWrap">
            <div class="item">
                <div class="key">启用打印：</div>
                <div class="value">
                    <el-switch class="main" v-model="printData.isSwitch" @change="handleChange('PrintReceipts')"></el-switch>
                    <span class="subInfo">禁用后将不会打印小票</span>
                </div>
            </div>
            <div class="item">
                <div class="key">打印机：</div>
                <div class="value">
                    <el-select v-model="printData.printName" placeholder="请选择打印机" @change="changePrint">
                        <el-option v-for="item in printDevice" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="key">打印份数：</div>
                <div class="value">
                    <div class="inline">
                        <span class="btn" @click="handlePrintSum(0)">-</span>
                        <span class="inputBox">{{printData.printSum}}</span>
                        <span class="btn" @click="handlePrintSum(1)">+</span>
                    </div>
                </div>
            </div>
            <!-- <div class="item">
                <div class="key">钱箱设置：</div>
                <div class="value">
                    <el-switch class="main" v-model="printData.opencashbox" @change="handleChangeSub('PrintSet_cash_opencashbox', printData.opencashbox)"></el-switch>
                    <span class="subInfo">开启后自动弹出钱箱</span>
                </div>
            </div> -->
            <div class="item" v-if="hasGuestPrint">
                <div class="key">宾客单打印：</div>
                <!-- <div class="key">宾客单、后厨单打印：</div> -->
                <div class="value">
                    <el-switch class="main" v-model="printData.PrintSet_guestorderprint" @change="handleChangeSub('PrintSet_guestorderprint', printData.PrintSet_guestorderprint)"></el-switch>
                </div>
            </div>
            <!-- <div class="item">
                <div class="key">小票字体：</div>
                <div class="value">
                    <el-switch class="main" v-model="printData.isComplexFont" @change="handleChange('PrintingComplexFont')"></el-switch>
                    <span class="subInfo">打印小票是否为繁体字</span>
                </div>
            </div> -->
        </div>
        <div class="test_print">
            <el-button type="primary" @click="handleTestPrint">测试打印</el-button>
            <!-- <el-button type="primary" @click="handleTestPrint2">测试打印2</el-button> -->
        </div>
    </div>
</template>

<style lang="scss" scope>
@import './salesPrint.scss';
</style>
<script src="./salesPrint.js"></script>
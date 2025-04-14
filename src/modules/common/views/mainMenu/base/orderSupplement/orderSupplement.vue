<!--补单弹窗-->
<template>
    <div class="orderSupplement" ref="orderSupplement" v-if="dialogVisible" tabindex="0" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <dc-dialog width="4.7" height="3" title="补单" @close="closeDialog">
            <div class="contentWrap">
                <div class="tips">
                    <span>补单后，该订单的数据显示在选择的日期中</span>
                </div>
                <div class="selectWrap">
                    <el-select v-model.trim="supplementTime">
                        <el-option v-for="item in timeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './orderSupplement.scss';
</style>
<script src="./orderSupplement.js"></script>
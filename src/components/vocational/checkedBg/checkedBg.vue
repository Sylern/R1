<template>
    <dcDialog v-if="show" width="930" height="680" :title="title" @close="$emit('close')">
        <div class="checkedBg">
            <el-scrollbar class="checkedBg bg-content-scrollbar">
                <div class="bg-content">
                    <div class="bg-item" v-for="item in defaultImgVal" :key="item.val"  @click.stop="currentBgHandle(item)"
                        :style="{ 'background-image': `${item.isDef?`url(${$app.fmtImg(item.val)})`:''}` }">
                        <i v-if="selectBg && selectBg == item.val" class="select el-icon-success"></i>
                        <ImportImg v-if="!item.isDef" :verifyJson="verifyJson" :typeEntity="typeEntity" @callback="uploadBgHandle" :dataJson="!$app.isNull(item.val) ? [item.val] : []"></ImportImg>
                    </div>
                </div>
            </el-scrollbar>
            <div class="bg-foot">
                <el-button class="btnItem btnPrimary big" @click="confirmBgHandle">确定</el-button>
            </div>
        </div>
    </dcDialog>
</template>
<style lang="scss" scoped>
@import "./checkedBg.scss";
</style>
<script src="./checkedBg.js"></script>
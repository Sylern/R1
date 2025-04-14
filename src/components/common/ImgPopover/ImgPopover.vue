<template>
    <el-popover placement="right" trigger="click">
        <div class="img-box" slot="reference">
            <i class="el-icon-zoom-in"></i>
            <img class="img popover-img" :src="src" />
            <div class="mask">
                
            </div>
        </div>
        <img class="img big-img" :src="src" />
    </el-popover>
</template>
<style lang='scss' scoped>
@import './ImgPopover.scss';
</style>
<script src="./ImgPopover.js"></script>

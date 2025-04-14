<!--弹窗基础组件-->
<template>
    <div class="dcDialog" @click.stop="close">
        <div class="dcContent" :style="contentCss" @click.stop="eventPrevent">
            <div class="close" @click="close">
                <i class="el-icon-close"></i>
            </div>
            <div class="title">{{title}}</div>
            <slot></slot>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
@import './dcDialog.scss';
</style>
<script src="./dcDialog.js"></script>
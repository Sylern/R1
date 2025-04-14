<!--弹窗基础组件-->
<template>
    <!-- <div class="dcDialog" @click="close"> -->
    <div class="dcDialog" ref="dcDialog" tabindex="0" @keyup.stop="" @keyup.esc.stop="close" @keyup.enter.stop="handleEnter" :style="{'z-index':zIndex}">
        <div class="dcContent" :style="contentCss" @click.stop="eventPrevent">
            <div class="close" v-if="showClose" @click="close">
                <i class="el-icon-close"></i>
            </div>
            <div class="dcTitle">
                <div class="back" v-show="back && stepLevel > 0" @click="backHandle">
                    <i class="el-icon-back"></i>
                </div>
                <span @dblclick="handleTitleTwice">{{title}}</span>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
@import './dcDialog.scss';
</style>
<script src="./dcDialog.js"></script>
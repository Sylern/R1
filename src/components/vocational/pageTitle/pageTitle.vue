<template>
    <div class="pageTitle_wrap">
        <slot></slot>
        <span class="showHelpWrap" @click="onShowHelp" v-show="showHelpTitle">
            <label>帮助和服务</label>
            <i class="btn_showHelp el-icon-d-arrow-left"></i>
        </span>
    </div>
</template>

<style lang="sass" scoped>
@import './pageTitle.scss';
</style>
<script src="./pageTitle.js"></script>
<template>
    <el-popover placement="left" title="微信小程序" width="500" trigger="click" v-model="show">
        <div class="minAppLink">
            <div class="left">
                <div class="qr-code" v-loading="loading" :style="{ backgroundImage: `${wxQrCode ? `url(${wxQrCode})` : ''}` }"></div>
                <div class="btns">
                    <el-button type="text" size="small" @click="downloadHandle" :disabled="!wxQrCode">下载</el-button>
                    <el-button type="text" size="small" v-copy="wxPath">复制地址</el-button>
                </div>
            </div>
            <div class="right">
                <div class="link">
                    <div class="title">推广至公众号与小程序 <cmd-icon size="17" type="icon-gzh"></cmd-icon> <cmd-icon size="20"
                            type="icon-xiaochengxu1" color="#605ab0"></cmd-icon></div> <el-button type="text"
                        size="small" v-copy="h5Path" :disabled="!h5Path">复制路径</el-button>
                </div>
                <div class="link">
                    <div class="title">推广至微信与朋友圈 <cmd-icon size="17" type="icon-weixin"></cmd-icon> <cmd-icon size="18"
                            type="icon-pengyouquan"></cmd-icon></div> <el-button type="text" size="small" :disabled="!sortLink"
                        v-copy="sortLink">复制短链接</el-button>
                </div>
            </div>
        </div>
        <span slot="reference" style="margin-right: 10px;">
            <slot></slot>
        </span>
    </el-popover>
</template>
<script src="./minAppLink.js"></script>
<style lang="scss" scoped>
@import "./minAppLink.scss";
</style>

<template>
    <div class="registerOk-wrap">
        <div class="state">注册成功</div>
        <div class="image">
            <img class="img" :src="$store.state.base.frontImgBase+'/images/base/login/tick@2x.png'" />
        </div>
        <div class="accountName">您的店铺账号</div>
        <div class="account">{{objJson.account}}</div>

        <div class="bottom">
            <div class="imgWrap">
                <img class="img" :src="objJson.img" />
            </div>
            <div class="name">{{objJson.name}}</div>
            <div class="text">支持安卓ios下载</div>
            <div @click="handleDownload" class="a">点击下载</div>
        </div>
    </div>
</template>

<style lang="scss" scope>
@import './registerOk.scss';
</style>
<script src="./registerOk.js"></script>

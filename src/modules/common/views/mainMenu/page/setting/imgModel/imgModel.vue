<template>
    <div class="imgModel">
        <div class="subTitle">
            <span>展示商品图片设置</span>
        </div>
        <div class="contentWrap">
            <div class="key">样式：</div>
            <div class="value">
                <div class="item noImg" @click="handelTyoe('2')">
                    <el-radio v-model="imgType" label="2">无图展示</el-radio>
                    <div class="containar">
                        <div class="lineBox"></div>
                        <div class="lineBox middle"></div>
                        <div class="lineBox small"></div>
                    </div>
                </div>
                <div class="item smallImg" @click="handelTyoe('0')">
                    <el-radio v-model="imgType" label="0">小图展示</el-radio>
                    <div class="containar">
                        <div class="left">
                            <i class="el-icon-picture"></i>
                        </div>
                        <div class="right">
                            <div class="lineBox"></div>
                            <div class="lineBox middle"></div>
                            <div class="lineBox small"></div>
                        </div>
                    </div>
                </div>
                <div class="item bigImg" @click="handelTyoe('1')">
                    <el-radio v-model="imgType" label="1">大图展示</el-radio>
                    <div class="containar">
                        <div class="top">
                            <i class="el-icon-picture"></i>
                        </div>
                        <div class="bottom">
                            <div class="lineBox"></div>
                            <div class="lineBox middle"></div>
                            <div class="lineBox small"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomWrap">
            <div class="btn" @click="handleSave">保存</div>
        </div>
    </div>
</template>

<style lang="scss" scope>
@import './imgModel.scss';
</style>
<script src="./imgModel.js"></script>
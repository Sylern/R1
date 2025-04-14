<template>
    <div class="loginWrap">
        <div class="contentWrap">
            <div class="title">账号登陆</div>
            <div class="infoWrap" @keyup.enter="handleShowSlide">
                <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                    <el-form-item prop="user_id" class="lineBox">
                        <el-input class="value" type="number" placeholder="请输入手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model.trim="loginForm.user_id" :onkeyup="loginForm.user_id=loginForm.user_id.replace(/[\D]/ig,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="user_psw" class="lineBox">
                        <el-input class="value" type="password" placeholder="请输入密码" minlength="6" maxlength="15" v-model.trim="loginForm.user_psw" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')"></el-input>
                    </el-form-item>
                    <el-form-item class="lineBox" v-if="slideDialogVisible">
                        <div class="ncWrap">
                            <div id="nvc"></div>
                        </div>
                    </el-form-item>
                    <el-button class="btnRegister" @click="handleShowSlide" :disabled="loginDisabled||slideDialogVisible">登录</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<style lang="sass" scoped>@import "./login.scss"
</style>
<script src="./login.js"></script>
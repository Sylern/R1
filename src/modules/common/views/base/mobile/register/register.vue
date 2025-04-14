<template>
    <div class="m_registerWrap">
        <div class="contentWrap">
            <div class="title">创建新账号</div>
            <div class="infoWrap">
                <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                    <el-form-item prop="user_id" class="lineBox">
                        <el-input class="value" type="number" placeholder="请输入手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model.trim="loginForm.user_id" :onkeyup="loginForm.user_id=loginForm.user_id.replace(/[\D]/ig,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="user_psw" class="lineBox">
                        <el-input class="value" :type="showPsw ? 'text': 'password'" placeholder="请设置登录密码（6-15个字符，不能输入空格）" minlength="6" maxlength="15" v-model.trim="loginForm.user_psw" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')">
                            <i slot="suffix" v-if="showPsw" class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                            <i slot="suffix" v-else class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="verifi_code" class="lineBox loginAppendWrap">
                        <el-input class="value" placeholder="手机验证码" maxlength="6" v-model.trim="loginForm.verifi_code">
                            <div slot="append" class="btnVerifi" @click="handelGetVerifiCode">{{verifi_code_text}}</div>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="verifi_code" class="lineBox" v-if="slideDialogVisible">
                        <div class="ncWrap">
                            <div id="nc"></div>
                        </div>
                    </el-form-item>
                    <div class="agreement">
                        <el-checkbox v-model.trim="agreementStatus" class="checkbox"></el-checkbox>
                        <span>我接受并同意用户协议</span>
                        <span class="link" @click="onPageService">《服务条款》</span>
                        <span>和</span>
                        <span class="link" @click="onPagePrivacy">《私隐条款》</span>
                    </div>
                    <el-button class="btnRegister" @click="submitRegister" v-repeatClick>注册账号</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<style>
.m_registerWrap .el-input-group__append,
.el-input-group__prepend {
    padding: 0 10rpx;
}
.m_registerWrap .el-input__inner {
    height: 96rpx;
    background-color: #f7f7f7;
    border: none;
    font-size: 16px;
}
.m_registerWrap .el-input__suffix {
    padding: 0 5px;
}
.m_registerWrap .el-select .el-input__inner:focus,
.el-input.is-active .el-input__inner,
.el-input__inner:focus,
.el-textarea__inner:focus,
.el-select .el-input.is-focus .el-input__inner {
    border-color: #1775fc;
}
.m_registerWrap .el-input-group--append .el-input__inner {
    /* width: 380rpx; */
    width: 95%;
    border-radius: 4px;
}
.m_registerWrap .el-input-group__append {
    border: 1px solid #eeeeee;
    border-radius: 4px;
}
.m_registerWrap .el-checkbox__input.is-checked .el-checkbox__inner {
    color: #1775fc;
    background-color: #1775fc;
}
</style>
<style lang="sass" scoped>@import "./register.scss"
</style>
<script src="./register.js"></script>
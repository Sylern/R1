<template>
    <div class="registerWrap module_login" :style="{'backgroundImage': 'url('+ bgUrl +')'}">
        <div class="logo">
            <img class="img" v-if="logoUrl" :src="logoUrl" />
        </div>
        <div class="contentWrap">
            <div class="loginContent">
                <div class="left" v-if="$app.isNull(adUrl) && hasMounted">
                    <div class="main">
                        <div class="picture">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/base/login/picture.png'" />
                        </div>
                        <div class="QRCode">
                            <div class="imgWrap">
                                <img class="img" v-if="loginPageType === 0" :src="$store.state.base.frontImgBase+'/images/base/login/APP.png'" />
                                <img class="img" v-if="loginPageType === 1||loginPageType === 2" :src="$store.state.base.frontImgBase+'/images/base/login/OEM.png'" />
                            </div>
                            <div class="text">扫码下载{{loginPageType === 0?'德客':''}}APP</div>
                        </div>
                    </div>
                </div>
                <div class="imgLeft" v-if="!hasMounted"></div>
                <div class="imgLeft" v-if="adUrl && hasMounted">
                    <img class="img" :src="adUrl" />
                </div>
                <div class="right">
                    <div class="main">
                        <div>
                            <div class="title">创建新账号</div>
                            <div class="infoWrap">
                                <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                                    <el-form-item prop="user_id" class="lineBox">
                                        <el-input oninput="value=value.replace(/[\D]/ig,'');if(value.length>11)value=value.slice(0,11)" v-model.trim="loginForm.user_id" class="value" type="text" placeholder="输入您的注册手机号" autocomplete="new-password"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="user_psw" class="lineBox">
                                        <el-input :type="showPsw ? 'text': 'password'" placeholder="请设置登录密码（8-32位数字+字母+符号组合）" minlength="6" maxlength="15" v-model.trim="loginForm.user_psw" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" autocomplete="new-password" class="value" name="decerpPassword">
                                            <i slot="suffix" v-if="showPsw" class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                                            <i slot="suffix" v-else class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="verifi_code" class="lineBox loginAppendWrap">
                                        <el-input class="value" placeholder="手机验证码" max="6" v-model.trim="loginForm.verifi_code">
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
                                    <div class="bottomBtn">
                                        <div></div>
                                        <div @click="handleLogin">已有账号？<span class="login_btn">登录</span></div>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">粤ICP备13009346</div>

        <industry-select :visible="showIndustrySelect" @submit="handleSelected"></industry-select>
    </div>
</template>

<style lang="sass" scoped>@import "./register.scss"
</style>
<style lang="scss">
.registerWrap {
    .infoWrap {
        .el-form-item {
            .el-input__suffix {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
<script src="./register.js"></script>
<template>
    <div class="loginWrap module_login" :style="{'backgroundImage': 'url('+ bgUrl +')'}">
        <div class="logo">
            <img class="img" v-if="logoUrl" :src="logoUrl" />
        </div>
        <div class="contentWrap">
            <div class="loginContent">
                <div class="left" v-if="$app.isNull(adUrl) && hasMounted">
                    <div class="main">
                        <div class="picture">
                            <img class="img" :src="picture" />
                        </div>
                        <div class="QRCode" v-if="loginQRcode">
                            <div class="imgWrap">
                                <img class="img" v-if="loginPageType === 0" :src="$store.state.base.frontImgBase+'/images/base/login/APP.png'" />
                                <img class="img" v-if="loginPageType === 1 || loginPageType === 2" :src="loginQRcode" />
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
                    <div class="topRight" v-if="loginQRcode" @click="handleChangeLoginType">
                        <div class="coverGray"></div>
                        <div class="topRightImg">
                            <img class="img" v-if="!loginQRCode" :src="$store.state.base.frontImgBase+'/images/base/login/qrCode.png'" />
                            <img class="img" v-if="loginQRCode" :src="$store.state.base.frontImgBase+'/images/base/login/account.png'" />
                        </div>
                        <div class="coverWhite"></div>
                    </div>
                    <div class="topTitle" v-if="loginQRcode" @click="handleChangeLoginType">
                        <span class="cover"></span>
                        <span class="text" v-if="loginQRCode">账号登录</span>
                        <span class="text" v-if="!loginQRCode">扫码登录更安全</span>
                    </div>
                    <div class="main" v-show="loginQRCode">
                        <div class="title_QRCode">手机扫码，安全登录</div>
                        <div class="QRCodeLogin">
                            <div class="imgWrap">
                                <div id="qrcode" ref="qrcode"></div>
                                <div v-show="!qrcode" class="invalid">
                                    <div>
                                        <div class="invalid-text">正在加载二维码</div>
                                        <!-- <el-button type="primary">点击刷新</el-button> -->
                                        <i class="el-icon-loading"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="moreImg">
                                <img class="img" :src="$store.state.base.frontImgBase+'/images/base/login/picture2.png'" />
                            </div>
                        </div>
                        <div class="tips">打开 {{loginPageType === 0?'德客':''}}APP 扫码登录</div>
                        <div class="downLoad">
                            <div class="icon">
                                <img class="img" v-if="loginPageType === 0" :src="$store.state.base.frontImgBase+'/images/base/login/APPlogo.png'" />
                                <img class="img" v-else :src="$store.state.base.frontImgBase+'/images/base/login/OEMlogo.png'" />
                            </div>
                            <div class="text">{{loginPageType === 0?'德客':'APP'}}移动收银</div>
                        </div>
                        <div class="bottomBtn">
                            <div></div>
                            <div v-if="loginPageType!==1" @click="handleRegister">注册账号</div>
                        </div>
                        <div class="agree"><el-checkbox v-model="aggree" disabled></el-checkbox>登录视为您已经同意&nbsp;《<div class="span" @click="xieyiClickHandle('xieyi')">用户协议</div>》&nbsp;和&nbsp;《<div class="span" @click="xieyiClickHandle">隐私政策</div>》</div>
                    </div>
                    <div class="main" v-show="!loginQRCode" @keyup.enter="handleShowSlide">
                        <div class="title">账号登录</div>
                        <div class="infoWrap">
                            <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                                <el-form-item prop="user_id" class="lineBox">
                                    <el-input v-model.trim="loginForm.user_id" @keyup.native.stop="handleToPasswrod" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" class="value" type="text" placeholder="输入您的注册手机号">
                                        <i slot="prefix" class="formIcon el-icon-user-solid"></i>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="user_psw" class="lineBox">
                                    <el-input v-model.trim="loginForm.user_psw" @keydown.native="handleCapsLock" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" ref="password" class="value" type="password" placeholder="输入您的密码" minlength="6" maxlength="20">
                                        <i slot="prefix" class="formIcon el-icon-lock"></i>
                                    </el-input>
                                    <i class="lock-icon el-icon-info" v-show="capsLock">大写已锁定</i>
                                </el-form-item>
                                <el-form-item class="lineBox" v-show="slideDialogVisible">
                                    <div class="ncWrap">
                                        <div id="nc"></div>
                                    </div>
                                </el-form-item>
                                <div class="checkRememberPsw">
                                    <el-checkbox v-model.trim="checkedPass" label="记住密码"></el-checkbox>
                                    <div>
                                        <a class="forgetPsw" href="/Login?x=1" v-if="!isNewVersion" style="margin-right:10px;text-decoration: none;">旧版登录</a>
                                        <span class="forgetPsw" @click="handlePswReset">忘记密码</span>
                                    </div>
                                </div>
                                <el-button class="btnLogin" @click="handleShowSlide" :disabled="loginDisabled||slideDialogVisible">登录</el-button>
                                <div v-if="loginPageType!==1" class="btnRegister" @click="handleRegister">注册账号</div>
                            </el-form>
                        </div>
                        <div class="agree"><el-checkbox v-model="aggree"></el-checkbox>登录视为您已经同意&nbsp;《<div class="span" @click="xieyiClickHandle('xieyi')">用户协议</div>》&nbsp;和&nbsp;《<div class="span" @click="xieyiClickHandle">隐私政策</div>》</div>
                    </div>
                </div>
            </div>
        </div>
        <a class="copyright" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ IPCText }}</a>
        <industry-select :visible="showIndustrySelect" @submit="loginSuccessJump"></industry-select>
        <dcDialog :title="agreeTitle" width="1100" height="800" v-if="showAgree" @close="showAgree = false">
            <div class="agree-dlg">
                <div class="content">
                    <iframe :src="agreeSrc" class="iframe"></iframe>
                </div>
                <div class="foot">
                    <div v-if="!loginQRCode" class="btnItem btnBasic" @click="unAgreeHandle">不同意</div>
                    <div class="btnItem btnPrimary" @click="agreeHandle">同意</div>
                </div>
            </div>
        </dcDialog>
        <dcDialog title="是否同意勾选?" v-if="showAgreeConfirm" width="340" height="160" @close="showAgreeConfirm = false">
            <div class="agree-confirm">
                勾选并同意《用户协议》和《隐私政策》
                <div class="foot">
                    <div class="btnItem btnPrimary" @click="aggree = true;showAgreeConfirm=false">同意</div>
                </div>
            </div>
        </dcDialog>
    </div>
</template>

<style lang="sass" scoped>@import "./login.scss"

/deep/ .el-input__inner 
    height: 48rx;
    background-color: #f7f7f7;
    font-size: 16px;

@media screen and (max-width: 1300px)
    font-size: 13px;
    

</style>
<script src="./login.js"></script>
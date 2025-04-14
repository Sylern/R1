<template>
    <div class="pswResetWrap module_login">
        <div class="logo">
            <img class="img" v-if="logoUrl" :src="logoUrl" />
        </div>
        <div class="contentWrap">
            <div class="loginContent">
                <div class="main">
                    <div class="title">找回密码</div>
                    <el-steps class="stepWrap" :active="stepPos" align-center>
                        <el-step title="验证">
                            <div slot="icon"></div>
                        </el-step>
                        <el-step title="重置密码" align-center>
                            <div slot="icon"></div>
                        </el-step>
                        <el-step title="完成" align-center>
                            <div slot="icon"></div>
                        </el-step>
                    </el-steps>
                    <div class="infoWrap" v-if="stepPos == 0">
                        <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                            <el-form-item prop="user_id" class="lineBox">
                                <el-input class="value" type="number" placeholder="请输入手机号" oninput="if(value.length>11)value=value.slice(0,11)" v-model.trim="loginForm.user_id" :onkeyup="loginForm.user_id=loginForm.user_id.replace(/[\D]/ig,'')"></el-input>
                            </el-form-item>
                            <el-form-item prop="verifi_code" class="lineBox loginAppendWrap">
                                <el-input class="value" placeholder="手机验证码" max="6" v-model.trim="loginForm.verifi_code">
                                    <div slot="append" class="btnVerifi" @click="handelGetVerifiCode">{{verifi_code_text}}</div>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="lineBox" v-if="slideDialogVisible">
                                <div class="ncWrap">
                                    <div class="tips">请拖动下方滑块，完成安全验证</div>
                                    <div id="nc"></div>
                                </div>
                            </el-form-item>
                            <div class="btnRegister" @click="handleNext">下一步</div>
                            <div class="bottomBtn">
                                <div></div>
                                <div @click="handleLogin">登录</div>
                            </div>
                        </el-form>
                    </div>
                    <div class="infoWrap" v-if="stepPos == 1">
                        <el-form :model="loginForm" :rules="rulesPasswordForm" ref="passwordForm">
                            <el-form-item prop="user_psw" class="lineBox">
                                <el-input class="value" :type="showPsw ? 'text': 'password'" placeholder="请输入新密码" minlength="6" maxlength="15" v-model.trim="loginForm.user_psw" :onkeyup="loginForm.user_psw=loginForm.user_psw.replace(/[\u4e00-\u9fa5]/ig,'')">
                                    <i slot="suffix" v-if="showPsw" class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                                    <i slot="suffix" v-if="!showPsw" class="formIcon el-icon-view" @click="showPsw = !showPsw"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="user_psw_again" class="lineBox">
                                <el-input class="value" :type="showPswAgain ? 'text': 'password'" placeholder="请再次输入新密码" minlength="6" maxlength="15" v-model.trim="loginForm.user_psw_again" :onkeyup="loginForm.user_psw=loginForm.user_psw.replace(/[\u4e00-\u9fa5]/ig,'')">
                                    <i slot="suffix" v-if="showPswAgain" class="formIcon el-icon-view" @click="showPswAgain = !showPswAgain"></i>
                                    <i slot="suffix" v-if="!showPswAgain" class="formIcon el-icon-view" @click="showPswAgain = !showPswAgain"></i>
                                </el-input>
                            </el-form-item>
                            <div class="btnRegister" @click="handleNext" v-repeatClick>确认</div>
                            <div class="bottomBtn">
                                <div></div>
                                <div @click="handleLogin">登录</div>
                            </div>
                        </el-form>
                    </div>
                    <div class="infoWrap" v-if="stepPos == 2">
                        <div class="success_icon">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/base/login/pswResetSuccess.png'" />
                            <div class="text">新密码已经生效</div>
                        </div>
                        <div class="btnBack" @click="handleLogin">返回登录</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">粤ICP备13009346</div>
    </div>
</template>

<style lang="sass" scoped>@import "./pswReset.scss"
</style>
<script src="./pswReset.js"></script>
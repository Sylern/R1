<template>
    <div class="loginWrap module_login">
        <div class="contentWrap">
            <div class="loginContent">
                <div class="left">
                    <div class="picture">
                        <img class="img" src="@/assets/images/ruoyi.png" />
                    </div>
                    <div class="text">
                        <span>{{ $t('base.welcomeUse') +' '+ $t('base.systemName')}}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="title">
                        <div>{{ $t('base.login') }}</div>
                        <div class="mt-20">{{ $t('base.systemName') +'，'+ $t('base.welcomeLogin') }}！</div>
                    </div>
                    <div class="infoWrap">
                        <el-form :model="loginForm" :rules="rulesLoginForm" ref="loginForm">
                            <el-form-item prop="user_id">
                                <el-input v-model.trim="loginForm.user_id" @keyup.native.stop="handleToPasswrod" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" class="value" type="text" :placeholder="$t('base.userName')">
                                    <i slot="suffix" class="formIcon el-icon-user-solid"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="user_psw">
                                <el-input v-model.trim="loginForm.user_psw" @keydown.native="handleCapsLock" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" ref="password" class="value" type="password" :placeholder="$t('base.password')" minlength="20" maxlength="20">
                                    <i slot="suffix" class="formIcon el-icon-lock"></i>
                                </el-input>
                                <i class="lock-icon el-icon-info" v-show="capsLock">{{ $t('base.capsLock')}}</i>
                            </el-form-item>
                            <el-form-item prop="code">
                                <div class="codeBox">
                                    <el-input v-model.trim="loginForm.code" @keyup.native.stop="handleToPasswrod" onkeyup="value=value.replace(/[\u4e00-\u9fa5\s]/ig,'')" class="code" type="text" :placeholder="$t('base.verification')"></el-input>
                                    <div class="codeImg"></div>
                                </div>
                            </el-form-item>
                            <div class="checkRememberPsw">
                                <el-checkbox v-model.trim="checkedPass" :label="$t('base.rmPsw')"></el-checkbox>
                            </div>
                            <el-button class="btnLogin mt-15" @click="handlesubmitLogin">{{ $t('base.login') }}</el-button>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <a class="copyright" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ IPCText }}</a>
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
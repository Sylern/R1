<!--会员储值卡支付验证弹窗-->
<template>
    <div class="memberCardCheck" ref="memberCardCheck" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="470" height="320" title="储值卡消费验证" @close="closeDialog">
            <div class="contentWrap">
                <div class="inputWrap" v-if="checkType === 0">
                    <div class="tips">
                        <span>请输入手机号验证</span>
                    </div>
                    <el-input v-model="checkPhoneNumber" clear @keyup.native.stop="" :placeholder="$app.phoneNumberHiding(memberInfo.sv_mr_mobile)"></el-input>
                </div>
                <div class="inputWrap" v-if="checkType === 1">
                    <div class="tips">
                        <span>请输入会员密码</span>
                    </div>
                    <el-input v-model="checkMemberPSW" type="password" @keyup.native.stop="" clear placeholder="请输入会员密码" autocomplete="new-password"></el-input>
                </div>
                <div class="inputWrap" v-if="checkType === 2">
                    <div class="tips">
                        <!-- <span>已发送到手机{{$app.phoneNumberHiding(memberInfo.sv_mr_mobile)}}</span> -->
                        <span>会员手机短信验证码验证</span>
                    </div>
                    <div class="phoneBox">
                        <div class="key">手机号码</div>
                        <div class="value">
                            <el-input disabled :value="$app.phoneNumberHiding(memberInfo.sv_mr_mobile)"></el-input>
                        </div>
                    </div>
                    <div class="codeBox">
                        <template v-if="!showNC">
                            <div class="key">
                                <el-input v-model="messageCode" maxlength="6" @input.native.stop="handlerInput" placeholder="请输入验证码"></el-input>
                            </div>
                            <div class="value">
                                <div class="btn" :class="{'highLight': verifi_code_time === 61}" @click="handleSend" v-repeatClick>{{verifi_code_time === 61 ? '获取验证码' : (verifi_code_time+'S')}}</div>
                            </div>
                        </template>
                        <div class="ncWrap" v-if="showNC">
                            <div id="nc"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btnSure" @click="handleEnter">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './memberCardCheck.scss';
</style>
<script src="./memberCardCheck.js"></script>
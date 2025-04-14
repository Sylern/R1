<template>
    <div class="cashierSecurity">
        <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">储值卡支付会员验证</span>
                </div>
                <div class="right">
                    <el-switch v-model="sv_uc_isenablepwd" @change="handleSwitch"></el-switch>
                </div>
            </div>
            <div class="itemContent">
                <el-radio-group v-removeAria class="radioWrap" v-model="radioValue" @change="handleRadio">
                    <div class="radioBox">
                        <el-radio :label="0" :disabled="!sv_uc_isenablepwd" :value="0">
                            <div class="radioName">手机号验证</div>
                            <div class="tips">会员手机号码可以验证会员身份</div>
                        </el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio :label="1" :disabled="!sv_uc_isenablepwd" :value="1">
                            <div class="radioName">会员密码验证</div>
                            <div class="tips">开启后会员可通过会员密码验证会员身份</div>
                        </el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio :label="2" :disabled="!sv_uc_isenablepwd" :value="2">
                            <div class="radioName">会员短信验证</div>
                            <div class="tips">开启后会员需通过会员短信验证码验证会员身份</div>
                        </el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div>

        <!-- <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">储值卡支付会员密码验证</span>
                </div>
            </div>
        </div>

        <div class="itemBox">
            <div class="top">
                <div class="left">
                    <span class="itemName">支付密码</span>
                    <span class="itemSub">会员通过支付密码验证方可会员结算</span>
                </div>
                <div class="right">
                    <el-switch v-model="sv_uc_isenablepwd" @change="handleSwitch"></el-switch>
                </div>
            </div>
        </div> -->

        <!-- <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">设置会员密码</span>
                    <span class="itemSub">设置后，没有设置过密码的会员,其密码将统一设置为初始密码</span>
                </div>
            </div>
        </div>

        <div class="itemBox">
            <div class="top">
                <div class="left">
                    <span class="itemName">初始密码：</span>
                    <div class="itemSub">
                        <el-input v-model="psw_vip"  maxlength="6" @keyup.native="handleInput" placeholder="请输入6位密码" type="password"></el-input>
                        <span class="btn" v-debounce="handleVipPsw">确定</span>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- 餐饮行业-设置退菜密码 -->
        <div class="itemBox mian" v-if="hasReturnCateringPsw">
            <div class="top">
                <div class="left">
                    <span class="itemName">{{ psw_table_text[userInfo.sv_us_industrytype] }}</span>
                    <span class="itemSub">开启后退菜时需要输入{{ psw_table_text[userInfo.sv_us_industrytype] }}</span>
                </div>
                <div class="right">
                    <el-switch v-model="dataObj.Return_Vegetables_Pwd.enable" @change="switchControlSub('Return_Vegetables_Pwd')"></el-switch>
                </div>
            </div>
        </div>

        <div class="itemBox" v-if="hasReturnCateringPsw">
            <div class="top">
                <div class="left">
                    <span class="itemName">设置密码：</span>
                    <div class="itemSub">
                        <el-input v-model="psw_table" :disabled="!dataObj.Return_Vegetables_Pwd.enable" maxlength="6" @keyup.native="handleInput" placeholder="请输入6位密码" type="password"></el-input>
                        <span class="btn" :class="{'disabled': !dataObj.Return_Vegetables_Pwd.enable}" v-debounce="handleVegetablePsw">确定</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 所有行业-设置退款密码 -->
        <div class="itemBox mian" v-if="hasReturnPsw">
            <div class="top">
                <div class="left tips">
                    <span class="itemName">退款密码</span>
                    <!-- <div class="itemSubTips">
                        <span class="tipsMain">开启后退款时需要输入退款密码</span>
                    </div> -->
                    <div class="itemSubTips">
                        <span class="tipsMain">开启后退款时需要输入退款密码，关闭后退款时不需验证密码，原路退还</span>
                        <span class="subText">
                            <label>系统提示：关闭退款密码有风险!</label>
                            <label>会造成退单/退款损失!请严谨操作!</label>
                        </span>
                    </div>
                </div>
                <div class="right">
                    <el-switch v-model="dataObj.Refund_Password_Switch.enable" @change="handlePswSwitch"></el-switch>
                </div>
            </div>
        </div>

        <div class="itemBox">
            <div class="top">
                <div class="left">
                    <span class="itemName">设置密码：</span>
                    <div class="itemSub">
                        <el-input v-model="psw" :disabled="!dataObj.Refund_Password_Switch.enable" maxlength="6" @keyup.native="handleInput" placeholder="请输入6位密码" type="password" autocomplete="new-password"></el-input>
                        <span class="btn" :class="{'disabled': !dataObj.Refund_Password_Switch.enable}" v-debounce="handlePsw">确定</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 发送短信 -->
        <dc-dialog title="验证密保信息" v-if="messageDialog" width="400" height="260" class="messageDialog system_dialog" @close="handleMessageCancel">
            <div class="messageContent">
                <div class="userPhone">
                    <span>验证方式：密保手机{{$app.phoneNumberHiding(userInfo.sv_ul_mobile)}}</span>
                </div>
                <div class="inputWrap">
                    <el-input v-model.trim="messageCode" @keyup.native="handleInput" placeholder="请输入验证码" maxlength="8" clearable></el-input>
                    <div class="btnSend" :class="{'reject': isSending > 0}" @click="sendCode">
                        <span>{{isSending ? isSending+'秒' : '发送验证码'}}</span>
                    </div>
                </div>
                <div class="messageBtnWrap">
                    <div class="btn btnSure" v-debounce="handleMessageSure">
                        <span>确定</span>
                    </div>
                    <div class="btn btnCancle" @click="handleMessageCancel">
                        <span>取消</span>
                    </div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style lang="scss" scope>
@import './cashierSecurity.scss';
</style>
<script src="./cashierSecurity.js"></script>
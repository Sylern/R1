<!--退款密码-->
<template>
    <div class="returnPsw" ref="returnPsw" v-if="pswWrap">
        <dc-dialog width="400" height="300" title="退款密码" v-if="pswWrap" @close="pswWrap = false">
            <div class="pswContentWrap">
                <!-- 有退款密码 -->
                <div v-if="hasReturnPsw" class="pswBox">
                    <el-input ref="refPsw" v-model.trim="psw" @keyup.native.enter="handleEnter" placeholder="请输入退款密码" type="password" autocomplete="new-password"></el-input>
                </div>
                <div v-else class="tips">
                    <span>尚未设置退款密码，是否去设置？</span>
                </div>
            </div>
            <div class="pswBtnWrap">
                <div class="btnSure" :class="{'disabled': psw.length < 1 && hasReturnPsw}" @click="handleEnter">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './returnPsw.scss';
</style>
<script src="./returnPsw.js"></script>

<template>
    <el-dialog title="修改密码" :close-on-click-modal="false" :visible.sync="dialogVisible" width="540px" class="system_dialog">
        <div class="updatePassword borderTop">
            <el-form :model="entityPwd" :rules="entityRulesPwd" ref="formPwd" class="form">
                <el-form-item label="原密码：" prop="orgpwd">
                    <el-input @keyup.native="verifyLetterNumber('orgpwd')" v-model.trim="entityPwd.orgpwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newpwd">
                    <el-input @keyup.native="verifyLetterNumber('newpwd')" type="password" v-model.trim="entityPwd.newpwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="newpwdTow">
                    <el-input @keyup.native="verifyLetterNumber('newpwdTow')" type="password" v-model.trim="entityPwd.newpwdTow"></el-input>
                </el-form-item>
            </el-form>
            <div class="btnWrap">
                <el-button @click="handleSubmitPwd" class="btnItem btnPrimary" v-repeatClick>确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
@import './updatePassword.scss';
</style>
<script src="./updatePassword.js"></script>

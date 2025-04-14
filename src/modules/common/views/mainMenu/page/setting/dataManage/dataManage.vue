<template>
    <div class="dataManage">
        <div class="dm_title">
            注意！数据是您最宝贵的财富。请不要随便初始化数据。初始化的店铺数据将永远无法恢复。如有疑问请咨询在线客服或致电400-0521-131
        </div>
        <div class="dm_name">选择初始化内容</div>
        <el-scrollbar class="dm_scrollbar">
            <div class="dm_sb_item">
                <el-checkbox-group v-model="activeJson">
                    <el-checkbox v-for="item in jsonData" :label="item.value" :key="item.value" class="dm_sb_i_checkbox">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>

        </el-scrollbar>
        <div class="dm_foot">
            <div v-if="isShowProcess" class="dm_progree">
                <div class="dm_p_name">{{processName}}</div>
                <no-progress></no-progress>
            </div>
            <el-button v-else @click="handleSubmit" class="btnItem dm_f_btn" v-repeatClick>数据初始化</el-button>
        </div>

        <el-dialog title="提示" :visible.sync="isVisible" width="540px" class="system_dialog" :close-on-click-modal="false">
            <div class="dataManageEntry  stores_Form">
                <div class="dme_name">数据初始化需验证绑定手机号：{{mobile}}</div>
                <el-form :model="entityObj">
                    <el-form-item v-if="!isVerifice" label="" prop="code">
                        <div class="flex">
                            <el-input @keyup.native="verifyNumber('code')" v-model.trim="entityObj.code"></el-input>
                            <el-button :disabled="verifi_code_time!==61" @click="handleSend" class="btnItem btnPrimary">{{verifi_code_text}}</el-button>
                        </div>
                    </el-form-item>
                    <div v-if="isVerifice" class="ncWrap">
                        <div class="tips">请拖动下方滑块，完成安全验证</div>
                        <div id="nc"></div>
                    </div>
                </el-form>
                <div class="btnWrap">
                    <el-button @click="handleEntity" class="btnItem btnPrimary" v-repeatClick>确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scope>
@import './dataManage.scss';
</style>
<style lang="scss">
.dataManage {
    .dm_sb_i_checkbox {
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
        }
        .el-checkbox__inner::after {
            left: 5px;
            top: 0px;
            width: 4px;
            height: 9px;
        }
        .el-checkbox__label {
            font-size: 15px;
            font-weight: 400;
            color: #333333;
            padding-left: 20px;
            margin-bottom: 2px;
        }
    }
}
</style>
<script src="./dataManage.js"></script>
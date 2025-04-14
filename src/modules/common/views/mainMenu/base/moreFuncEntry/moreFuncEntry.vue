<!--收银更多功能弹窗-->
<template>
    <div class="moreFuncEntry" ref="moreFuncEntry" v-if="dialogVisible" tabindex="0" @keyup.esc.stop="closeDialog">
        <dc-dialog width="700" height="360" title="更多功能" @close="closeDialog">
            <div class="contentWrap">
                <template v-for="(item, index) in iconList">
                    <div class="item" v-if="item.isShow" :key="index" v-permission="{permission: CashierManage[item.permission], fn: handleItem, param: [item]}">
                        <div class="checkItem" v-if="!item.noCheckIcon" @click.stop="">
                            <el-checkbox v-model="item.isChecked" @change="handleCheckIcon(item)"></el-checkbox>
                        </div>
                        <cmd-icon :type="item.icon" size="50" color="#3333333"></cmd-icon>
                        <div class="name">
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="btnWrap">
                <div class="btn" @click="closeDialog">确 定</div>
            </div>
        </dc-dialog>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
    </div>
</template>

<style  lang="scss" scoped>
@import './moreFuncEntry.scss';
</style>
<script src="./moreFuncEntry.js"></script>
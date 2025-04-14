<!--会员列表弹窗-->
<template>
    <div class="memberList" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog v-show="memberListStatus" width="4.7" height="6.6" title="选择会员" @close="closeDialog">
            <div class="listContentWrap">
                <el-input class="searchWrap" ref="inputKeyWord" v-model.trim="queryMembers.sectkey" placeholder="刷卡或输入卡号/手机号/姓名" @keyup.native.stop="handlePrevent" @clear="clearKeyWord" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div class="listContent">
                    <el-scrollbar ref="scrollContent" style="width:100%; height: 100%;">
                        <div class="listWrap" ref="listWrap">
                            <div class="listItem" :class="{'selected': memberInfo.memberId === item.member_id}" v-for="(item,index) in memberList" :key="index" @click="handleMember(item)">
                                <div class="left">
                                    <div class="logo">
                                        <img class="img"  v-if="!$app.isNull(item.sv_mr_headimg)" :src="handleImgUrl(item.sv_mr_headimg)" width="100%" />
                                        <cmd-icon v-else type="icon-headDefault" size="40" color="#cccccc"></cmd-icon>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="user lineOccuped">
                                        <div class="nameWrap">
                                            <span class="nameText">{{item.sv_mr_name}}</span>
                                            <span class="flag" v-if="item.sv_ml_name">{{item.sv_ml_name}}</span>
                                        </div>
                                        <div>积分：{{item.sv_mw_availablepoint}}</div>
                                    </div>
                                    <div class="phoneWrap lineOccuped">
                                        <div class="telephone">{{item.sv_mr_mobile}}</div>
                                        <div class="balance">余额：¥{{item.sv_mw_availableamount}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './memberList.scss';
</style>
<script src="./memberList.js"></script>
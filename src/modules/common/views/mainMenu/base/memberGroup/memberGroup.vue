<!--选择卡成员-->
<template>
    <div class="memberGroup" ref="memberGroup" tabindex="0" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="430" height="680" :title="title" @close="closeDialog">
            <div class="memberGroupContent">
                <el-input class="searchWrap" ref="inputKeyWord" v-model.trim="queryMembers.sectkey" @keyup.native.stop="" @keyup.native.enter="handleSearch" placeholder="刷卡或输入卡号/手机号" clearable @clear="handleSearch">
					<span slot="append" @click="handleSearch">查询会员</span>
				</el-input>
                <div class="memberGroupListWrap">
                    <el-scrollbar ref="scrollContent" style="width:100%; height: 100%;">
                        <div class="listItem" :class="{ selected: selectedIds.findIndex(e => e.member_id === item.member_id) > -1 }" v-for="(item, index) in memberList" :key="index" @click="handleMember(item)">
                            <div class="left">
                                <div class="logo">
                                    <el-image v-if="!$app.isNull(item.sv_mr_headimg)" :src="$app.getImgUrl(item.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(item.sv_mr_headimg)]" @click.stop=""></el-image>
                                    <cmd-icon v-else type="icon-headDefault" size="24" color="#E5CAA0"></cmd-icon>
                                </div>
                            </div>
                            <div class="center">
                                <div class="user lineOccuped">
                                    <div class="nameWrap">
                                        <span class="nameText">
                                            <label>{{ item.sv_mr_name }}</label>
                                            <span class="flag" v-if="item.sv_ml_name">{{ item.sv_ml_name }}</span>
                                        </span>
                                        <span v-if="item.sv_mr_status == 1" class="invalid">(已挂失)</span>
                                        <span v-if="item.isOverdue" class="invalid">(已过期)</span>
                                    </div>
                                </div>
                                <div class="balanceWrap">
                                    <div class="balance">余额：¥{{ item.sv_mw_availableamount }}</div>
                                    <div>积分：{{ item.sv_mw_availablepoint }}</div>
                                </div>
                                <div class="phoneWrap lineOccuped">
                                    <div class="telephone">
                                        <div class="mobile item">
                                            <cmd-icon type="icon-phone-o" size="18" color="#333333"></cmd-icon>
                                            <span>{{ item.sv_mr_mobile }}</span>
                                        </div>
                                        <div class="cardno item">
                                            <cmd-icon type="icon-memberCard" size="18" color="#333333"></cmd-icon>
                                            <el-tooltip effect="dark" placement="top" :content="'卡号：'+ item.sv_mr_cardno">
                                                <span>{{ item.sv_mr_cardno }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="check" :class="{'isCheck': selectedIds.filter(e => e.id === item.member_id).length > 0}"></div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="memberGroupBtnWrap">
                    <div class="btnSure" @click="handleSure">
                        <span>确定</span>
                        <span v-if="selectedIds.length > 0">（已选{{ selectedIds.length }}人）</span>
                    </div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './memberGroup.scss';
</style>
<script src="./memberGroup.js"></script>
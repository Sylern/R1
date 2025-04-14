<!--预付金弹窗-->
<template>
    <div class="carttingPreOrder" :class="{ onAddCartting: !isOrderList }" v-show="dialogVisible" @click.stop="">
        <div class="pagePopContent" :class="{ show: showContent}">
            <div class="totalInfo">
                <div class="preTopLeft">
                    <div class="btnBack" @click="handleBack">
                        <i class="el-icon-arrow-left"></i>
                        <span class="text">关闭</span>
                    </div>
                    <!-- <span>预付金</span> -->
                </div>
                <div class="preTopBtn" @click="handShowAdd">
                    <span>+预付金</span>
                </div>
            </div>
            <div class="tableList">
                <div class="tableInfo">
                    <div class="tableWrap">
                        <div class="header">
                            <div class="cell1">
                                <span>类型</span>
                            </div>
                            <div class="cell2">
                                <span>付款方式</span>
                            </div>
                            <div class="cell3">
                                <span>时间</span>
                            </div>
                            <div class="cell4">
                                <span>金额</span>
                            </div>
                            <div class="cell5">
                                <span>操作人</span>
                            </div>
                            <div class="cell6">
                                <span>备注</span>
                            </div>
                            <div class="cell7">
                                <span>操作</span>
                            </div>
                        </div>
                        <div class="tbody">
                            <el-scrollbar ref="scrollList" style="width:100%; height:100%; overflow:hidden;">
                                <div class="tableItem" v-for="(item, index) in dataList" :key="index">
                                    <div class="cell1">
                                        <span>{{ dataType[item.type] ? dataType[item.type] : '' }}</span>
                                    </div>
                                    <div class="cell2">
                                        <span>{{ item.payment }}</span>
                                    </div>
                                    <div class="cell3">
                                        <span>{{ item.createTime }}</span>
                                    </div>
                                    <div class="cell4">
                                        <span>{{ item.money }}</span>
                                    </div>
                                    <div class="cell5">
                                        <span>{{ item.operator }}</span>
                                    </div>
                                    <div class="cell6">
                                        <el-tooltip effect="dark" placement="top" :content="item.remark" class="etr_tooltip">
                                            <i class="el-icon-question" v-if="item.remark"></i>
                                        </el-tooltip>
                                    </div>
                                    <div class="cell7">
                                        <span v-if="item.canRefund" class="btnReturn" @click="handShowReturn(item)">退款</span>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="popper__arrow" :class="{ show: showContent}"></div>
        <dc-dialog v-if="addPreOrderStatus" width="500" height="650" title="添加预付金" @close="addPreOrderStatus = false">
            <div class="addPreOrderContent">
                <div class="preOrderContentInfo">
                    <div class="infoLine">
                        <div class="key">预付金额:</div>
                        <div class="value">
                            <el-input v-model="payInfo.money" @input.native.prevent="handleInput">
                                <span slot="suffix" class="suffixText">元</span>
                            </el-input>
                        </div>
                    </div>
                    <div class="payInfo">
                        <div class="top">
                            <div class="key">支付方式:</div>
                            <div class="memberInfo">
                                <div class="unSelected" v-if="!memberSelected">
                                    <div class="btnItem btnMemberSelect" v-permission="{ permission: CashierManage.Select_Members, fn: showMemberList }">
                                        <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                                        <span class="text">选择会员</span>
                                    </div>
                                </div>
                                <div class="content" v-else>
                                    <div class="userInfo">
                                        <div class="nameWrap">
                                            <div class="nametext">
                                                <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                                <span class="availableamount">（余额：￥{{ memberInfo.sv_mw_availableamount }}）</span>
                                            </div>
                                        </div>
                                        <div class="btnWrap" @click.stop="">
                                            <!-- <div class="btn btnClear" @click="showMemberList">选择</div> -->
                                            <div class="btn btnRecharge" @click="handleClearMember">清除</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="value">
                            <pay-type-list ref="prepayTypeList" :payInfo="payInfo" @paySuccess="submitSuccess" @handleMemberCard="showMemberList" @closeScan="handleCloseScan" :isDisabled="isSubmitting"></pay-type-list>
                        </div>
                    </div>
                    <div class="infoLine">
                        <div class="key">备注:</div>
                        <div class="value remark">
                            <el-input type="textarea" :rows="3" resize="none" v-model="remark"></el-input>
                        </div>
                    </div>
                </div>
                <div class="preOrderBtnWrap">
                    <div class="preOrderSubmit" v-repeatClick @click="preOrderSubmit">确定</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 退款弹窗 -->
        <dc-dialog v-if="returnPreOrderStatus" width="500" height="450" title="退回预付金" @close="returnPreOrderStatus = false">
            <div class="returnPreOrderContent">
                <div class="preOrderContentInfo">
                    <div class="infoLine">
                        <div class="key">预付金额:</div>
                        <div class="value">
                            <el-input v-model="returnData.money" disabled="">
                                <span slot="suffix" class="suffixText">元</span>
                            </el-input>
                        </div>
                    </div>
                    <div class="infoLine">
                        <div class="key">备注:</div>
                        <div class="value remark">
                            <el-input type="textarea" :rows="3" resize="none" v-model="returnData.remark"></el-input>
                        </div>
                    </div>
                </div>
                <div class="preOrderBtnWrap">
                    <div class="preOrderSubmit" v-repeatClick @click="preOrderReturn">确定</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingPreOrder.scss';
</style>
<script src="./carttingPreOrder.js"></script>
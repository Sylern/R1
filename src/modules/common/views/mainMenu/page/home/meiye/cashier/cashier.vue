<!-- 美业收银 -->
<template>
    <div class="cashier" ref="meiyeCashier" tabindex="0" @keyup.enter.stop="handleEnter">
        <div class="cashierLeft">
            <div class="inputWrap">
                <div class="left">
                    <div class="btnBack" v-if="!isOnlight" @click="handleBack">
                        <i class="el-icon-arrow-left"></i>
                        <span class="text">返回</span>
                    </div>
                    <div class="inputBox">
                        <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @input.native.stop="" @keyup.native.right.stop="handleSearchCheckIn" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
                    </div>
                </div>
                <div class="btnRight">
                    <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                        <cmd-icon type="icon-saoma1" size="36" color="#9967FB"></cmd-icon>
                    </div>
                    <div class="btn btn_xiaoxi" v-permission="{permission: CashierManage.Message, fn: handleMessage}">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#9967FB"></cmd-icon>
                        <div class="tips_num" v-if="tipsNum>0">{{tipsNum>99?'99+':tipsNum}}</div>
                    </div>
                </div>
            </div>
            <div class="deskInfo">
                <div class="orderInfo">
                    <div class="line">
                        <div class="userName">
                            <span>开单人：{{isOnlight || tableInfo.sv_employee_id === 0 ? userInfo.sv_ul_name : tableInfo.sv_employee_name}}</span>
                            <div class="btnEdit" v-if="!isOnlight" @click="startServicerStatus = true">
                                <i class="el-icon-edit-outline"></i>
                            </div>
                        </div>
                        <div class="orderRemark" v-if="!isOrderBack" @click="handleOrderRemark">
                            <cmd-icon type="icon-biaoqiandayin" color="#9967FB" size="24"></cmd-icon>
                            <span class="text">备注</span>
                        </div>
                    </div>
                    <div class="orderTime line">
                        <div class="left">开单时间：{{tableInfo.wt_datetime}} </div>
                        <div class="right">
                            <!-- <div class="btnIcon" @click="tableInfo.sv_sex = 1">
                                <img class="img" v-if="tableInfo.sv_sex === 1" src="@/assets/images/cashier/fmIcon.png" />
                                <img class="img" v-else src="@/assets/images/cashier/fmIcon1.png" />
                            </div>
                            <div class="btnIcon" @click="tableInfo.sv_sex = 0">
                                <img class="img" v-if="tableInfo.sv_sex === 0" src="@/assets/images/cashier/mIcon.png" />
                                <img class="img" v-else src="@/assets/images/cashier/mIcon1.png" />
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="memberInfo">
                    <div class="btnSlected" v-if="$app.isNull(memberInfo.member_id)">
                        <div class="btnItem btnMemberSelect" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                            <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                            <span class="text">选择会员</span>
                        </div>
                        <div class="btnItem btnMemberAdd" v-permission="{permission: CashierManage.Add_Members, fn: showMemberAdd}">
                            <cmd-icon type="icon-jia" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                            <span class="text">新增会员</span>
                        </div>
                    </div>
                    <div class="selectedWrap" v-else>
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                    <cmd-icon v-else type="icon-huiyuan1" size="30" color="#8056F7"></cmd-icon>
                                </div>
                                <div class="nameWrap">
                                    <div class="nametext">
                                        <span class="name">{{memberInfo.sv_mr_name}}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{memberInfo.sv_ml_name}}</span>
                                    </div>
                                    <div class="telephone">
                                        <div class="mobile item">
                                            <cmd-icon type="icon-phone-o" size="16" color="#333333"></cmd-icon>
                                            <span>{{ memberInfo.sv_mr_mobile }}</span>
                                        </div>
                                        <div class="cardno item">
                                            <cmd-icon type="icon-memberCard" size="16" color="#333333"></cmd-icon>
                                            <el-tooltip effect="dark" placement="top" :content="'卡号：'+ memberInfo.sv_mr_cardno">
                                                <span>{{ memberInfo.sv_mr_cardno }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="right" @click.stop="">
                                <div class="btn btnClear" @click="showMemberList">选择</div>
                                <div class="btn btnRecharge" @click="clearMember">清除</div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{memberInfo.sv_mw_availableamount}}</div>
                            </div>
                            <div class="item discount" v-if="!hasStoreCard || $app.isNull(currentCardInfo().sv_wallet_id)" @click="showStoreCard">
                                <div class="key">卡项</div>
                                <div class="value" v-if="memberInfo.wallets_list">{{memberInfo.wallets_list.length}}</div>
                            </div>
                            <el-popover v-model="showPopStoreCard" v-if="hasStoreCard && currentCardInfo().sv_wallet_id" effect="light" width="410" placement="bottom" trigger="hover">
                                <div class="item discount" slot="reference" v-if="hasStoreCard">
                                    <div class="key">卡项</div>
                                    <div class="value">{{memberInfo.wallets_list.length}}</div>
                                </div>
                                <div class="popStoreCard" :style="currentCardInfo().sv_background_image ? 'background:url(//res.decerp.cc'+ currentCardInfo().sv_background_image+') center / cover no-repeat;':''">
                                    <div class="infoTop">
                                        <div class="topLeft">
                                            <div class="cardName" :class="{ btn: memberInfo.wallets_list.length > 1 }" @click="showStoreCard">
                                                <span>{{currentCardInfo().sv_card_name}}</span>
                                                <i v-if="memberInfo.wallets_list.length > 1" class="el-icon-arrow-right"></i>
                                            </div>
                                            <div class="cardNumber">{{currentCardInfo().sv_card_number}}</div>
                                        </div>
                                        <div class="topRight">
                                            <div class="priceWrap">
                                                <div class="value">
                                                    <span class="symbol">¥</span>
                                                    <span>{{$app.moneyFixed(currentCardInfo().sv_balance)}}</span>
                                                </div>
                                                <div class="key">余额</div>
                                            </div>
                                            <div class="priceWrap" v-if="!$app.isNull(currentCardInfo().sv_wallet_id)">
                                                <div class="value">
                                                    <span class="symbol">¥</span>
                                                    <span>{{$app.moneyFixed(currentCardInfo().sv_gifts)}}</span>
                                                </div>
                                                <div class="key">赠送金</div>
                                            </div>
                                        </div>
                                        <!-- <div class="infoRow">有效期：{{currentCardInfo().sv_validity_time}}</div> -->
                                    </div>
                                    <div class="infoBottom" v-if="!$app.isNull(currentCardInfo().sv_wallet_id)">
                                        <div class="infoRemark">{{currentCardInfo().sv_remark}}</div>
                                        <div class="btnEdit" @click.stop="handleRemarkUpdate(currentCardInfo())">
                                            <i class="el-icon-edit"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="popBtnRecharge" @click="handlePopReaharge">
                                    <span>充值</span>
                                </div>
                            </el-popover>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{memberInfo.sv_mw_availablepoint}}</div>
                            </div>
                            <div class="item">
                                <div class="key">权益卡</div>
                                <div class="value">{{memberInfo.micard_count || 0}}</div>
                            </div>
                            <div class="item">
                                <div class="key">优惠券</div>
                                <div class="value">{{memberInfo.couponCountNumber}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="leftContent">
                <cartting-meiye ref="carttingMeiye" @returnWithout_list_id="returnWithout_list_id" />
            </div>

            <div class="leftBottom">
                <div class="btnClear" v-permission="{permission: CashierManage.delete_all, fn: clearCartting}">
                    <span>清空</span>
                </div>
                <div class="btnClear" v-permission="{permission: CashierManage.guadanclick, fn: withOrderSave}">
                    <span>{{ isCarrtingNull ? '取单' : '挂单' }}</span>
                </div>
                <div class="btnCheck" :class="{'disabled': carttingData.productResults.length === 0}"  v-permission="{permission: CashierManage.Collection, fn: handleSubmitOrder}">
                    <span>结算 {{$app.moneyFixed(carttingData.dealMoney)}}</span>
                </div>
            </div>

        </div>
        <cashier-right ref="cashierRight"></cashier-right>
        
        <dc-dialog title="修改备注" width="400" height="250" v-if="updateRemarkVisible" class="system_dialog updateRemarkVisible" @close="updateRemarkVisible = false">
            <div class="updateInfoWrap">
                <div class="infoLine">
                    <div class="key">备注：</div>
                    <div class="value remark">
                        <el-input v-model="updateRemark" :rows="3" type="textarea" resize="none" @focus="$event.currentTarget.select()"></el-input>
                    </div>
                </div>
            </div>
            <div class="bottomBtnWrap">
                <el-button type="primary" class="btnPrimary" v-repeatClick @click="handleSubmitInfo">确定</el-button>
            </div>
        </dc-dialog>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 修改开单人-->
        <servicer-setting-single :visible.sync="startServicerStatus" @handleServicer="handleServicer"></servicer-setting-single>
    </div>
</template>

<style  lang="sass" scoped>@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>
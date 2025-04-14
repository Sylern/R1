<template>
    <div class="cashier" ref="cashier">
        <div class="cashierLeft">
            <div class="leftTop">
                <div class="saleNumber" :class="{'inScaleType': scaleSwitch}">
                    <div class="title">
                        <div class="scaleTitle" v-if="scaleSwitch">
                            <div class="btnWrap">
                                <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                                    <cmd-icon type="icon-saoma1" size="36" color="#3988FF"></cmd-icon>
                                </div>
                                <div class="btn btn_xiaoxi" v-permission="{permission: CashierManage.Message, fn: handleMessage}">
                                    <cmd-icon type="icon-xinxi_huaban" size="36" color="#3988FF"></cmd-icon>
                                    <div class="tips_num" v-if="tipsNum>0">{{tipsNum>99?'99+':tipsNum}}</div>
                                </div>
                            </div>
                            <div class="scaleType" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                                <!-- 电子秤开启 -->
                                <span class="selectMember" v-if="!memberSelected">选择会员</span>
                                <span v-else>{{memberInfo.sv_mr_name}}</span>
                            </div>
                            <span class="clearMember" v-if="memberSelected" @click="handleClearMember">
                                <i class="el-icon-close"></i>
                            </span>
                        </div>
                        <div class="commonTitle" v-else>
                            <div class="titleLeft"></div>
                            <div class="btnWrap">
                                <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                                    <cmd-icon type="icon-saoma1" size="36" color="#3988FF"></cmd-icon>
                                </div>
                                <div class="btn btn_xiaoxi" v-permission="{permission: CashierManage.Message, fn: handleMessage}">
                                    <cmd-icon type="icon-xinxi_huaban" size="36" color="#3988FF"></cmd-icon>
                                    <div class="tips_num" v-if="tipsNum>0">{{tipsNum>99?'99+':tipsNum}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="inputBox">
                        <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.right.stop="handleSearchCheckIn" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
                    </div>
                </div>
                <!-- 电子秤 -->
                <div class="scaleWrap" v-if="scaleSwitch">
                    <div class="scaleWrapLeft">
                        <div class="item">
                            <span class="flag isStabilize"></span>
                            <span>净重</span>
                        </div>
                        <div class="item">
                            <span class="flag" :class="{ isStabilize: pricingScaleData.isStabilize}"></span>
                            <span>{{ pricingScaleData.isStabilize ? '稳定' : '读取中' }}</span>
                        </div>
                    </div>
                    <div class="scaleWrapCenter">
                        <div class="item">
                            <span class="key">皮重</span>
                            <span class="scaleValue">{{pricingScaleData.tare}}</span>
                        </div>
                        <div class="item">
                            <span class="key">净重</span>
                            <span class="scaleValue">{{pricingScaleData.weight}}</span>
                        </div>
                        <div class="item">
                            <span class="key">单价</span>
                            <span class="scaleValue">{{pricingScaleData.unit_price}}</span>
                        </div>
                        <div class="item">
                            <span class="key">金额</span>
                            <span class="scaleValue">{{pricingScaleData.total_price}}</span>
                        </div>
                    </div>
                    <div class="scaleWrapRight">
                        <div class="btn" @click="handleTare">
                            <span>去皮</span>
                        </div>
                        <div class="btn" @click="handleReset">
                            <span>重置</span>
                        </div>
                    </div>
                </div>
                <div class="members" v-else>
                    <div class="unSelected" v-if="!memberSelected">
                        <div class="btnItem btnMemberSelect" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                            <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                            <span class="text">选择会员</span>
                        </div>
                        <div class="btnItem btnMemberAdd" v-permission="{permission: CashierManage.Add_Members, fn: showMemberAdd}">
                            <cmd-icon type="icon-jia" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                            <span class="text">新增会员</span>
                        </div>
                        <!-- <div class="btn" v-permission="{permission: CashierManage.Add_Members, fn: showMemberAdd}">新增会员</div>
                        <div class="title" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">选择会员F6</div> -->
                    </div>
                    <div class="content" v-else>
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
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
                                <!-- <div class="btn btnRecharge" @click="showMemberRecharge">充值</div> -->
                                <div class="btn btnRecharge" @click="handleClearMember">清除</div>
                            </div>
                            <!-- <div class="clearMember" @click="handleClearMember">
                                <i class="el-icon-error"></i>
                            </div> -->
                        </div>
                        <div class="userRights">
                            <div class="item" v-if="!hasStoreCard || $app.isNull(currentCardInfo().sv_remark)">
                                <div class="key">余额</div>
                                <div class="value">{{memberInfo.sv_mw_availableamount}}</div>
                            </div>
                            <el-tooltip v-if="hasStoreCard && currentCardInfo().sv_remark" effect="dark" placement="bottom" :content="currentCardInfo().sv_remark" class="etr_tooltip">
                                <div class="item discount" v-if="hasStoreCard">
                                    <div class="key">余额</div>
                                    <div class="value">{{memberInfo.sv_mw_availableamount}}</div>
                                </div>
                            </el-tooltip>
                            <div class="item discount" @click="showStoreCard">
                                <div class="key">卡项</div>
                                <div class="value" v-if="memberInfo.wallets_list">{{memberInfo.wallets_list.length}}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{memberInfo.sv_mw_availablepoint}}</div>
                            </div>
                            <div class="item discount" @click="showEquityCard">
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
                <cartting @getRemark="getRemark" />
            </div>
            <div class="leftBottom">
                <div class="statisticsWrap">
                    <div class="settlementOrder" v-if="!$app.isNull(settlementOrder.order_id)">
                        <span>上一单：{{settlementOrder.order_running_id}}</span>
                        <span>结算金额：{{$app.moneyFixed(settlementOrder.order_receivable)}}</span>
                        <span>找零：{{$app.moneyFixed(settlementOrder.sv_give_change)}}</span>
                    </div>
                    <div>
                        <span class="discount highlight" v-if="carttingData.couponMoney > 0">优惠：{{$app.moneyFixed(carttingData.couponMoney)}}</span>
                        <span>总计：</span>
                        <span class="highlight">¥</span>
                        <span class="totalMoney highlight">{{$app.moneyFixed(carttingData.dealMoney)}}</span>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnPost" v-if="isOrderTake && $app.isNull(selectedInfo.sv_order_list_id)" v-permission="{permission: CashierManage.guadanclick, fn: handleOrderTake}">
                        <span>挂单</span>
                    </div>
                    <div class="btnPost" v-if="!isOrderTake" v-permission="{permission: CashierManage.guadanclick, fn: handleOrderTake}">
                        <span>取单</span>
                    </div>
                    <div class="btnQuikcCashier" v-if="fastPayInfo.isSet" @click="postFastPay">
                        <cmd-icon type="icon-jiezhang" size="28" color="rgba(var(--main-theme-color), 1)"></cmd-icon>
                        <span>{{ fastPayInfo.payment }}</span>
                    </div>
                    <div class="btnCash" v-permission="{permission: CashierManage.Collection, fn: showCheckin}">
                        <span>收 款</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cashierRight">
            <div class="classification">
                <div class="c_one">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': firstSelected == 0}" @click="handleFirstCategoryAll">全部</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': firstSelected == (index+1)}" v-for="(item,index) in firstCategory" :key="index" @click="handleFirstCategory(item,index+1)">{{item.sv_pc_name}}</div>
                        <div class="item add" :class="{'rowFirst': (firstCategory.length+1)%6 == 0}" @click="showCategoryFirst">+</div>
                    </el-scrollbar>
                </div>
                <div class="c_two" v-if="firstSelected != 0">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': secondSelected == 0}" @click="handleSecondCategoryAll">全部</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': secondSelected == (index+1)}" v-for="(item,index) in secondCategory" :key="index" @click="handleSecondCategory(item,index+1)">{{item.sv_psc_name}}</div>
                        <div class="item add" :class="{'rowFirst': (secondCategory.length+1)%6 == 0}" @click="showCategorySecond">+</div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="goodsWrap" :style="{'height': goodsWrapHeight}">
                <goodsList ref="goodsList" :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" />
            </div>
        </div>

        <dc-dialog v-if="postPopStatus" width="470" height="260" title="挂单" @close="postPopStatus = false" @handleEnter="handlePostPop">
            <div class="postPopWrap" tabindex="0">
                <div class="mainWrap">
                    <el-input ref="popOrderTake" v-model="postPopText" placeholder="请输入挂单备注"></el-input>
                </div>
                <div class="btnSure">
                    <el-button class="btn" :disabled="isSubmitting" @click="handlePostPop">
                        <span>确定</span>
                    </el-button>
                </div>
            </div>
        </dc-dialog>

        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 新增二级分类 -->
        <category-second-add :visible.sync="categorySecondStatus" :firstCategory="firstCategory" :firstCategoryId="firstSelectedItem.id" @callback="secondAddBack"></category-second-add>
    </div>
</template>

<style  lang="sass" scoped>
@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>
<!-- 退换货 -->
<template>
    <div class="return" ref="return">
        <div class="returnLeft">
            <div class="leftTop">
                <div class="saleNumber">
                    <div class="title">
                        <div class="numberLeft">
                            <!-- <span>销售单号：</span> -->
                        </div>
                        <div class="btnRight">
                            <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                                <cmd-icon type="icon-saoma1" size="36" color="#3988FF"></cmd-icon>
                            </div>
                            <div class="btn btn_xiaoxi" v-permission="{permission: CashierManage.Message, fn: handleMessage}">
                                <cmd-icon type="icon-xinxi_huaban" size="36" color="#3988FF"></cmd-icon>
                                <div class="tips_num" v-if="tipsNum>0">{{tipsNum>99?'99+':tipsNum}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="inputBox">
                        <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
                    </div>
                </div>
                <div class="members">
                    <div class="unSelected" v-if="!memberSelected && $app.isNull(orderNumber)">
                        <div class="btnItem btnMemberSelect" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                            <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                            <span class="text">选择会员</span>
                        </div>
                        <div class="btnItem btnMemberAdd" v-permission="{permission: CashierManage.Add_Members, fn: showMemberAdd}">
                            <cmd-icon type="icon-jia" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                            <span class="text">新增会员</span>
                        </div>
                    </div>
                    <div class="customer" v-if="!memberSelected && !$app.isNull(orderNumber)">
                        <div class="logo">
                            <cmd-icon type="icon-headDefault" size="40" color="#ffffff"></cmd-icon>
                        </div>
                        <div class="nameWrap">散客</div>
                    </div>
                    <div class="content" v-if="memberSelected">
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <img class="img" v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="memberInfo.sv_mr_headimg.indexOf('http') > -1 ? memberInfo.sv_mr_headimg : (imgBase + memberInfo.sv_mr_headimg)" width="100%" />
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                </div>
                                <div class="nameWrap">
                                    <div class="nametext">
                                        <span class="name">{{memberInfo.sv_mr_name}}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{memberInfo.sv_ml_name}}</span>
                                    </div>
                                    <div class="telephone">{{memberInfo.sv_mr_mobile}}</div>
                                </div>
                            </div>
                            <div class="right" v-if="orderTotalInfo.number === 0">
                                <div class="btn btnClear" @click.stop="showMemberList">选择</div>
                                <!-- <div class="btn btnRecharge" @click="showMemberRecharge">充值</div> -->
                                <div class="btn btnRecharge" @click.stop="handleClearMember">清除</div>
                            </div>
                            <!-- <div class="clearMember" @click="handleClearMember">
                                <i class="el-icon-error"></i>
                            </div> -->
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{memberInfo.sv_mw_availableamount}}</div>
                            </div>
                            <div class="item discount" @click="showStoreCard">
                                <div class="key">卡项</div>
                                <div class="value">{{memberInfo.wallets_list.length}}</div>
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
                <cartting :dataList.sync="returnCarttingData" :orderDataList.sync="orderDataList" @clearCartting="clearCartting" @getRemark="getRemark" />
            </div>
            <div class="leftBottom">
                <div class="statisticsWrap">
                    <div class="left">
                        <span class="goodsNumber" v-if="orderDataList.length > 0">退货数量：{{orderTotalInfo.number}}</span>
                        <span class="goodsNumber" v-else>退货数量：{{addTotalInfo.number}}</span>
                        <span class="goodsNumber" v-if="orderDataList.length > 0 && addTotalInfo.number > 0">换货数量：{{addTotalInfo.number}}</span>
                    </div>
                    <div class="right" v-if="orderDataList.length > 0">
                        <div class="moneyWrap">
                            <span>退货金额：</span>
                            <span class="highlight">¥</span>
                            <span class="totalMoney highlight">{{orderTotalInfo.money}}</span>
                        </div>
                        <template v-if="addTotalInfo.money > 0">
                            <div class="moneyWrap">
                                <span>换货金额：</span>
                                <span class="highlight">¥</span>
                                <span class="totalMoney highlight">{{addTotalInfo.money}}</span>
                            </div>
                            <div class="moneyWrap">
                                <span>{{ totalMoney > 0 ? '应付金额' : '退款金额'}}：</span>
                                <span class="highlight">¥</span>
                                <span class="totalMoney highlight">{{$app.moneyFixed(Math.abs(totalMoney))}}</span>
                            </div>
                        </template>
                    </div>
                    <div class="right" v-else>
                        <div class="moneyWrap">
                            <span>总计：</span>
                            <span class="highlight">¥</span>
                            <span class="totalMoney highlight">{{addTotalInfo.money}}</span>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnOrder" @click="handleOrderList">
                        <span>按单退</span>
                    </div>
                    <div class="btnCash" :class="{'disabled': orderDataList.length.length === 0 && returnCarttingData.length === 0}" @click="showCheckReturn">
                        <template v-if="orderDataList.length > 0">
                            <span v-if="returnCarttingData.length > 0">换 货</span>
                            <span v-else>退 货</span>
                        </template>
                        <span v-else>退 货</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="returnRight" ref="returnRight">
            <div class="classification" ref="classification">
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
                <goodsList ref="goodsList" :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" @handleGoodsList="handleGoodsList" />
            </div>
        </div>
        <!-- 选择订单 -->
        <select-order :visible.sync="selectOrderStatus" @submit="handleReturnData"></select-order>
        <!-- 订单核销 -->
        <order-wiped :visible.sync="orderWipedStatus"></order-wiped>
        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 新增二级分类 -->
        <category-second-add :visible.sync="categorySecondStatus" :firstCategory="firstCategory" :firstCategoryId="firstSelectedItem.id" @callback="secondAddBack"></category-second-add>
        <!-- 订单结算 -->
        <check-return :visible.sync="checkReturnStatus" :orderNumber="orderNumber" :orderList="orderDataList" :dataList="returnCarttingData" :importMoneyInfo="importMoneyInfo" @handleSuccess="handleSuccess"></check-return>
    </div>
</template>

<style lang="sass" scoped>
@import "./return.scss";
</style>
<script src="./return.js"></script>
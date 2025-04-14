<template>
    <div class="lightMeal restaurant" ref="lightMeal" tabindex="0">
        <div class="lightMealLeft">
            <div class="inputWrap">
                <div class="inputBox">
                    <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
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
            <div class="mainInfo">
                <div class="orderRemark" @click="handleOrderRemark">
                    <i class="el-icon-edit-outline"></i>
                    <span class="text">整单备注</span>
                </div>
                <div class="memberInfo">
                    <div class="btn" v-if="!memberSelected" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                        <cmd-icon type="icon-huiyuan" color="#3988FF" size="24"></cmd-icon>
                        <span>选择会员</span>
                    </div>
                    <div class="memberName" v-else>
                        <span>{{memberInfo.sv_mr_name}}</span>
                    </div>
                    <div class="clearMember" v-if="memberSelected" @click="clearMember">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
            </div>
            <div class="leftContent">
                <cartting-light />
            </div>
            <div class="leftBottom">
                <div class="btnLeft">
                    <div class="btn btnClear" :class="{'disabled': carttingData.productResults.length === 0}" v-permission="{permission: CashierManage.delete_all, fn: clearCartting}">清空</div>
                    <div class="btn" v-permission="{permission: CashierManage.guadanclick, fn: handleOrderTake}">{{isOrderTake ? '挂单' : '取单'}}</div>
                </div>
                <div class="btnRight">
                    <div class="btn btnQuikcCashier" v-if="fastPayInfo.isSet" @click="postFastPay">
                        <cmd-icon type="icon-jiezhang" size="28" color="rgba(var(--main-theme-color), 1)"></cmd-icon>
                        <span>{{ fastPayInfo.payment }}</span>
                    </div>
                    <div class="btnCash" :class="{'disabled': carttingData.productResults.length === 0}" v-repeatClick v-permission="{permission: CashierManage.Collection, fn: showCheckin}">
                        <span>收款¥ {{$app.moneyFixed(carttingData.dealMoney)}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="lightMealRight" ref="lightMealRight">
            <div class="classification">
                <div class="c_one">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': firstSelected == 0}" @click="handleFirstCategoryAll">热销</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': firstSelected == (index+1)}" v-for="(item,index) in firstCategory" :key="index" @click="handleFirstCategory(item,index+1)">{{item.sv_pc_name}}</div>
                        <div class="item add" :class="{'rowFirst': (firstCategory.length+1)%6 == 0}" @click="showCategoryFirst">+</div>
                    </el-scrollbar>
                </div>
                <div class="c_two" v-if="firstSelected != 0 && secondCategory.length > 0">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': secondSelected == 0}" @click="handleSecondCategoryAll">全部</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': secondSelected == (index+1)}" v-for="(item,index) in secondCategory" :key="index" @click="handleSecondCategory(item,index+1)">{{item.sv_psc_name}}</div>
                        <!-- <div class="item add" :class="{'rowFirst': (secondCategory.length+1)%6 == 0}" @click="showCategorySecond">+</div> -->
                    </el-scrollbar>
                </div>
            </div>
            <div class="goodsWrap">
                <goodsList ref="goodsList" darkModel :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" />
            </div>
        </div>

        <dc-dialog v-if="postPopStatus" width="470" height="260" title="挂单" @close="postPopStatus = false">
            <div class="postPopWrap">
                <div class="mainWrap">
                    <el-input v-model="postPopText" placeholder="请输入挂单备注"></el-input>
                    <div class="switchPrint">
                        <span>挂单打印</span>
                        <el-switch v-model="postPopPrintStatus"></el-switch>
                    </div>
                </div>
                <div class="btnSure">
                    <el-button class="btn" :class="{'disabled': isSubmitting}" @click="handlePostPop">
                        <span>确定</span>
                    </el-button>
                </div>
            </div>
        </dc-dialog>
        <!-- 快捷支付 -->
        <quick-pay ref="quickPayLightMeal" :fastPayInfo.sync="fastPayInfo"></quick-pay>
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

<style  lang="sass" scoped>@import "./lightMeal.scss"
</style>
<script src="./lightMeal.js"></script>
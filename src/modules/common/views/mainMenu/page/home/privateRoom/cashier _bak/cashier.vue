<template>
    <div class="cashier privateRoom" ref="restaurant" tabindex="0" @keyup.enter.stop="handleEnter" @click="handleCashier">
        <div class="cashierLeft">
            <div class="inputWrap">
                <div class="btnBack" @click="handleBack">
                    <i class="el-icon-arrow-left"></i>
                    <span class="text">返回</span>
                </div>
                <div class="inputBox">
                    <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @input.native.stop="" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
                </div>
                <div class="btnRight">
                    <div class="btn btn_saoma" v-permission="{ permission: CashierManage.Reverse, fn: handleHexiao }">
                        <cmd-icon type="icon-saoma1" size="36" color="#3988FF"></cmd-icon>
                    </div>
                    <div class="btn btn_xiaoxi" v-permission="{ permission: CashierManage.Message, fn: handleMessage }">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#3988FF"></cmd-icon>
                        <div class="tips_num" v-if="tipsNum > 0">{{ tipsNum > 99 ? '99+' : tipsNum }}</div>
                    </div>
                </div>
            </div>
            <div class="deskInfo">
                <div class="mainInfo">
                    <div class="leftInfo">
                        <div class="infoItem">
                            <span v-if="tableInfo.sv_table_name">台号：{{ tableInfo.sv_table_name }}</span>
                        </div>
                        <div class="infoItem">
                            <span v-if="!isOrderBack">人数：{{ tableInfo.sv_person_num }}</span>
                            <div class="editPeopleNumber" v-if="!isOrderBack" v-permission="{ permission: CashierManage.Change_Number, fn: () => {
										numberChangeStatus = true;
									},
								}">
                                <i class="el-icon-edit-outline"></i>
                            </div>
                        </div>
                    </div>
                    <div class="orderRemark" @click="handleOrderRemark">
                        <i class="el-icon-edit-outline"></i>
                        <span class="text">整单备注</span>
                    </div>
                </div>
                <!-- <div class="memberInfo">
                        <div class="btn" v-if="!memberSelected" @click="showMemberList">
                            <span>选择会员</span>
                        </div>
                        <div class="memberName" v-else>
                            <span>{{memberInfo.sv_mr_name}}</span>
                        </div>
                        <div class="clearMember" v-if="memberSelected" @click="clearMember">
                            <i class="el-icon-close"></i>
                        </div>
                    </div> -->
                <div class="billabletimeWrap" v-if="!$app.isNull(billabletimeInfo.id)">
                    <div class="wrapInfo">
                        <div class="billName">
                            <div class="key">计费服务</div>
                            <div class="valueMore">
                                <div class="value">
                                    <span>{{ billabletimeInfo.configName }}</span>
                                </div>
                                <i class="el-icon-edit-outline" @click="showBillableTimeUpdate"></i>
                            </div>
                        </div>
                        <div class="startTime">
                            <div class="key">开始时间</div>
                            <div class="value" v-if="billabletimeInfo.startTime">{{ billabletimeInfo.startTime.substring(5, billabletimeInfo.startTime.length - 3) }}</div>
                        </div>
                        <div class="accumulatedTime" v-if="tableInfo.sv_table_using_state === 5">
                            <div class="key">预结时间</div>
                            <div class="value">
                                <span>{{ tableInfo.sv_table_prekont_date }}</span>
                            </div>
                        </div>
                        <div class="accumulatedTime" v-else>
                            <div class="key">累积时长</div>
                            <div class="value" v-if="billabletimeInfo.duration > 59">
                                <label class="hightLight">{{ parseInt(billabletimeInfo.duration / 60) }}</label>
                                <span>小时</span>
                                <label class="hightLight" v-if="billabletimeInfo.duration % 60 > 0">{{ parseInt(billabletimeInfo.duration % 60) }}</label>
                                <span v-if="billabletimeInfo.duration % 60 > 0">分钟</span>
                            </div>
                            <div class="value" v-else>
                                <label class="hightLight">{{ billabletimeInfo.duration }}</label>
                                <span>分钟</span>
                            </div>
                        </div>
                        <div class="billMoney">
                            <div class="key">计费金额</div>
                            <div class="value">
                                <label class="hightLight">{{ billabletimeInfo.totalMoney }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="wrapStatus">
                        <template v-if="tableInfo.sv_table_using_state === 5">
                            <div class="statusText">
                                <span>计费状态：已预结</span>
                                <span class="btnHandleCancel" @click="handleCancelPreTime">取消预结</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="statusText">
                                <div>计费状态：{{ billabletimeInfo.statusString }}</div>
                                <div class="statusIconBtn" v-repeatClick v-if="billabletimeInfo.canPause" @click="handleStatusIcon">
                                    <cmd-icon v-if="billabletimeInfo.status === 1" type="icon-zanting" size="22" color="rgba(var(--main-theme-color), 1)"></cmd-icon>
                                    <cmd-icon v-if="billabletimeInfo.status === 2" type="icon-bofang" size="22" color="rgba(var(--main-theme-color), 1)"></cmd-icon>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="leftContent" :class="{ hasBillabletime: !$app.isNull(billabletimeInfo.id), isOrderList: isOrderList, isOrderBack: isOrderBack }">
                <cartting-coffee ref="carttingCoffee" :isOrderList.sync="isOrderList" :tableInfo="tableInfo" :popOrderData.sync="orderData" :waittingStatus.sync="waittingStatus" @returnWithout_list_id="returnWithout_list_id" @caterCallback="caterCallback" />

                <div class="tableControl">
                    <div class="pagesWrap" :class="{'isShow': totalPage > 0}">
                        <div class="left">
                            <span class="goodsNumber">数量：
                                <label v-if="isOrderList && dataLength > 0">{{dataLength}}</label>
                                <label v-if="!isOrderList">{{carttingData.buyNumber}}</label>
                            </span>
                        </div>
                        <div class="right">
                            <div class="moreTableBtn" v-if="tableInfo.booking_type === 1" @click.stop="showPreOrder">
                                <span style="padding-right: 2px;">预付款</span>
                                <span v-if="tableInfo.preOrderMoney > 0">￥{{ tableInfo.preOrderMoney }}</span>
                            </div>
                            <div class="moreTableBtn" v-if="tableInfo.mergeCateringTableIds.length > 0" @click.stop="showMoreTable">合并房台</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="leftBottom">
                <template v-if="isOrderList">
                    <div class="btnOrderWrap">
                        <div class="btn" v-permission="{ permission: CashierManage.openCateringTable_add_dish, fn: handleBtnControl, param: [1] }">
                            <span>加单</span>
                        </div>
                        <div class="btn" v-permission="{ permission: CashierManage.openCateringTable_Turntable, fn: handleBtnControl, param: [6] }">
                            <span>换台</span>
                        </div>
                        <div class="btn" v-if="tableInfo.booking_type !== 1" v-repeatClick v-permission="{ permission: CashierManage.openCateringTable_A_table, fn: handleBtnControl, param: [5] }">
                            <span>并台</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{ permission: CashierManage.openCateringTable_Return_food, fn: handleBtnControl, param: [3] }">
                            <span>退单</span>
                        </div>
                    </div>
                    <div class="orderCheckWrap">
                        <div class="btnCommon" v-if="orderData.productResults.length > 0 && orderData.productResults.filter((e) => e.sv_return_status !== 2).length === 0" v-permission="{ permission: CashierManage.openCateringTable_Clear_the_table, fn: handleClearTable }">
                            <span>清台</span>
                        </div>
                        <el-button class="btnOrderCheck" v-repeatClick v-permission="{ permission: CashierManage.Collection_Catering, fn: showCheckin }">
                            <span v-if="orderTotalMoney">结算¥ {{ orderTotalMoney || '' }} </span>
                        </el-button>
                    </div>
                </template>
                <template v-else>
                    <template v-if="isOrderBack">
                        <!-- 反结账 -->
                        <div class="orderBackBtnWrap">
                            <div class="btnCommon" @click="clearCartting">
                                <span>清空</span>
                            </div>
                            <div class="btnBackCash" v-repeatClick @click="handleSubmitOrder">
                                <span>结算¥ {{ $app.moneyFixed(carttingData.dealMoney) || '' }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="btnCash">
                            <div class="btnCommon" v-if="carttingData.productResults.length > 0" @click="clearCarttingList">
                                <span>清空</span>
                            </div>
                            <div class="btnCommon" v-else v-permission="{ permission: CashierManage.openCateringTable_Clear_the_table, fn: handleClearTableOrShowOrder }">
                                <span>{{ $app.isNull(orderData.productResults) ? '清台' : '已下单' }}</span>
                            </div>
                           <div class="btnCommon" v-permission="{ permission: CashierManage.openCateringTable_Turntable, fn: handleBtnControl, param: [6] }">
                                <span>换台</span>
                            </div>
                             <!-- <div class="btnCommon add" v-permission="{ permission: CashierManage.openCateringTable_A_table, fn: handleBtnControl, param: [5] }">
                                <span>并台结算</span>
                            </div> -->
                            <el-button class="btnCashCheck" :class="{ disabled: isSubmitting }" @click="handleSubmitOrder">
                                <template v-if="carttingData.productResults.length === 0">
                                    <span>结算</span>
                                    <span v-if="carttingTotalMoney">¥ {{ $app.moneyFixed(orderTotalMoney) || '' }}</span>
                                </template>
                                <template v-else>
                                    <span>下单</span>
                                    <span v-if="carttingTotalMoney">¥ {{ $app.moneyFixed(carttingData.dealMoney) || '' }}</span>
                                </template>
                            </el-button>
                        </div>
                    </template>
                </template>
            </div>
            <!-- 并台弹窗 -->
            <cartting-coffee-more :visible.sync="moreTableStatus" :tableInfo="tableInfo" :isOrderList.sync="isOrderList" :mergeCateringList="mergeCateringList" :popOrderData.sync="orderData" @refreshTable="handleRefresh" />
            <!-- 预付款弹窗 -->
            <cartting-pre-order :visible.sync="preOrderStatus" :tableInfo="tableInfo" :isOrderList.sync="isOrderList" @change="getPrepaymentMoney4Table" />
        </div>
        <div class="cashierRight">
            <div class="classification">
                <div class="c_one">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{ selected: firstSelected == 0 }" @click="handleFirstCategoryAll">热销</div>
                        <div class="item" :class="{ rowFirst: (index + 1) % 6 == 0, selected: firstSelected == index + 1 }" v-for="(item, index) in firstCategory" :key="index" @click="handleFirstCategory(item, index + 1)">{{ item.sv_pc_name }}</div>
                        <div class="item add" :class="{ rowFirst: (firstCategory.length + 1) % 6 == 0 }" @click="showCategoryFirst">+</div>
                    </el-scrollbar>
                </div>
                <div class="c_two" v-if="firstSelected != 0">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{ selected: secondSelected == 0 }" @click="handleSecondCategoryAll">全部</div>
                        <div class="item" :class="{ rowFirst: (index + 1) % 6 == 0, selected: secondSelected == index + 1 }" v-for="(item, index) in secondCategory" :key="index" @click="handleSecondCategory(item, index + 1)">{{ item.sv_psc_name }}</div>
                        <div class="item add" :class="{ rowFirst: (secondCategory.length + 1) % 6 == 0 }" @click="showCategorySecond">+</div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="goodsWrap">
                <goodsList ref="goodsList" darkModel :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" :waittingStatus="waittingStatus" />
            </div>
        </div>

        <dc-dialog v-if="billabletimeTipsStatus" :showClose="false" width="600" height="300" title="提示">
            <div class="billabletimeTips">
                <div class="tips_text">
                    <span>暂停：</span>
                    <span class="highLight">{{ billabletimeInfo.pauseTime }}分钟已结束</span>
                </div>
                <div class="tips_btnWrap">
                    <div class="btn" v-repeatClick @click="handleCloseBillable">确定结束暂停</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 修改计费规则 -->
        <updateBillabletimeSelect :visible.sync="billabletimeUpdateStatus" :billabletimeInfo="billabletimeInfo" :tableId="tableInfo.sv_table_id" @handleBillableTimeUpdate="handleBillableTimeUpdate"></updateBillabletimeSelect>
        <!-- 就餐人数 -->
        <number-change :visible.sync="numberChangeStatus" :onlyNumber="true" :defaultNumber="tableInfo.sv_person_num" title="就餐人数" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 房台列表弹窗 -->
        <pop-table-list :visible.sync="popTableListStatus" :dataObj="popTableData" @updateTable="handleUpdateTable"></pop-table-list>
        <!-- 并台弹窗 -->
        <pop-table-and :visible.sync="popTableAndStatus" :dataObj="popTableData" :mergeCateringTableIds="tableInfo.mergeCateringTableIds" @updateTable="handleUpdateTable"></pop-table-and>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 新增二级分类 -->
        <category-second-add :visible.sync="categorySecondStatus" :firstCategory="firstCategory" :firstCategoryId="firstSelectedItem.id" @callback="secondAddBack"></category-second-add>

        <!-- 退菜数量 -->
        <catering-return :visible.sync="returnNumberStatus" :onlyNumber="true" :cateringReturnInfo="cateringReturnInfo" title="退菜数量" @handleReturnNumber="handleReturnNumberChange"></catering-return>
    </div>
</template>

<style lang="sass" scoped>
@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>

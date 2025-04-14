<template>
    <div class="cashier restaurant" ref="restaurant" tabindex="0" @keyup.enter.stop="handleEnter">
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
                    <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                        <cmd-icon type="icon-saoma1" size="36" color="#3988FF"></cmd-icon>
                    </div>
                    <div class="btn btn_xiaoxi" v-permission="{permission: CashierManage.Message, fn: handleMessage}">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#3988FF"></cmd-icon>
                        <div class="tips_num" v-if="tipsNum>0">{{tipsNum>99?'99+':tipsNum}}</div>
                    </div>
                </div>
            </div>
            <div class="deskInfo">
                <div class="mainInfo">
                    <div class="infoItem">
                        <span>台号：{{tableInfo.sv_table_name}}</span>
                    </div>
                    <div class="infoProple">
                        <span>人数：{{tableInfo.sv_person_num}}</span>
                        <div class="editPeopleNumber" v-if="!isOrderBack" v-permission="{permission: CashierManage.Change_Number, fn: () => { numberChangeStatus = true }}">
                            <i class="el-icon-edit-outline"></i>
                        </div>
                    </div>
                    <div class="infoService" v-if="service_fee_data.total > 0 && !isOrderBack">
                        <span>服务费：{{service_fee_data.text}}</span>
                    </div>
                </div>
                <div class="timeInfo">
                    <div class="timeText">时间：{{tableInfo.wt_datetime ? tableInfo.wt_datetime.substring(5, 16) : ''}}</div>
                    <div class="orderRemark" @click="handleOrderRemark">
                        <i class="el-icon-edit-outline"></i>
                        <span class="text">整单备注</span>
                    </div>
                </div>
            </div>
            <div class="leftContent" :class="{'isOrderList': isOrderList, 'isOrderBack':isOrderBack}">
                <cartting-cater ref="carttingCater" :isOrderList.sync="isOrderList" :tableInfo="tableInfo" :popOrderData.sync="orderData" :waittingStatus.sync="waittingStatus" @returnWithout_list_id="returnWithout_list_id" @caterCallback="caterCallback" />
            </div>

            <div class="leftBottom">
                <template v-if="isOrderList">
                    <div class="btnOrderWrap">
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.openCateringTable_add_dish, fn: handleBtnControl, param: [1]}">
                            <span>加菜</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.Urge_Dishes, fn: handleBtnControl, param: [2]}">
                            <span>催菜</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.openCateringTable_Return_food, fn: handleBtnControl, param: [3]}">
                            <span>退菜</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.Starting_Dishes, fn: handleBtnControl, param: [4]}">
                            <span>起菜</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.openCateringTable_A_table, fn: handleBtnControl, param: [5]}">
                            <span>并台</span>
                        </div>
                        <div class="btn" v-repeatClick v-permission="{permission: CashierManage.openCateringTable_Turntable, fn: handleBtnControl, param: [6]}">
                            <span>换台</span>
                        </div>
                    </div>
                    <!-- <div class="btnCash" v-if="isShowClearTable" v-repeatClick @click="handleClearTable">
                        <span>清台</span>
                    </div> -->
                    <el-button class="btnCash" v-if="orderData.productResults.filter(e => e.sv_return_status !== 2).length === 0" v-repeatClick v-permission="{permission: CashierManage.openCateringTable_Clear_the_table, fn: handleClearTable}">
                        清台
                    </el-button>
                    <el-button class="btnCash" v-else v-repeatClick v-permission="{permission: CashierManage.Collection_Catering, fn: showCheckin}">
                        结算¥ {{ takeASingleCale3.sv_isbeforehand && takeASingleCale3.sv_order_actual_money > 0 ? this.$app.moneyFixed(takeASingleCale3.sv_order_actual_money) : $app.moneyFixed($app.addNumber(orderData.dealMoney, service_fee_data.total))}}
                    </el-button>
                </template>
                <template v-else>
                    <template v-if="isOrderBack">
                        <!-- 反结账 -->
                        <div class="orderBackBtnWrap">
                            <div class="btnClear" @click="clearCartting">
                                <span>清空</span>
                            </div>
                            <div class="btnBackCash" :class="{'disabled': carttingData.productResults.length === 0}" v-repeatClick @click="handleOrder">
                                <span>结算¥ {{$app.moneyFixed(carttingData.dealMoney)}}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="btnWrap">
                            <div class="btn btnClear" v-if="carttingData.productResults.length > 0" @click="clearCarttingList">
                                <span>清空</span>
                            </div>
                            <div class="btn btnClear" v-else v-permission="{permission: CashierManage.openCateringTable_Clear_the_table, fn: handleClearTableOrShowOrder}">
                                <span>{{$app.isNull(orderData.productResults) ? '清台' :'订单'}}</span>
                            </div>
                            <div class="btn" :class="{'disabled': carttingData.productResults.length === 0}" v-permission="{permission: CashierManage.Wait_Catering, fn: handleWaitting}">
                                <span>{{sv_is_rouse ? '取消等叫' : '等叫'}}</span>
                            </div>
                        </div>
                        <el-button class="btnCash" :class="{'disabled': carttingData.productResults.length === 0 || isSubmitting}" :disabled="carttingData.productResults.length === 0" @click="handleOrder">
                            <span v-if="!$app.isNull(orderData.productResults)">{{'加菜'+ $app.moneyFixed(carttingData.dealMoney)}}</span>
                            <span v-else>
                                <span>下单</span>
                                <span v-if="$app.addNumber(carttingData.dealMoney,service_fee_data.total) > 0">¥ {{$app.moneyFixed($app.addNumber(carttingData.dealMoney,service_fee_data.total))}}</span>
                            </span>
                        </el-button>
                    </template>
                </template>
            </div>

        </div>
        <div class="cashierRight">
            <div class="classification">
                <div class="c_one">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': firstSelected == 0}" @click="handleFirstCategoryAll">热销</div>
                        <div class="item" :class="{'selected': firstSelected == (index+1)}" v-for="(item,index) in firstCategory" :key="index" @click="handleFirstCategory(item,index+1)">{{item.sv_pc_name}}</div>
                        <div class="item add" :class="{'rowFirst': (firstCategory.length+1)%6 == 0}" @click="showCategoryFirst">+</div>
                    </el-scrollbar>
                </div>
                <div class="c_two" v-if="firstSelected != 0 && secondCategory.length > 0">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': secondSelected == 0}" @click="handleSecondCategoryAll">全部</div>
                        <div class="item" :class="{'selected': secondSelected == (index+1)}" v-for="(item,index) in secondCategory" :key="index" @click="handleSecondCategory(item,index+1)">{{item.sv_psc_name}}</div>
                        <!-- <div class="item add" :class="{'rowFirst': (secondCategory.length+1)%6 == 0}" @click="showCategorySecond">+</div> -->
                    </el-scrollbar>
                </div>
            </div>
            <div class="goodsWrap" :style="{'height': goodsWrapHeight}">
                <goodsList ref="goodsList" darkModel :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" :waittingStatus="waittingStatus" />
            </div>
        </div>
        <!-- 就餐人数 -->
        <number-change :visible.sync="numberChangeStatus" :onlyNumber="true" :defaultNumber="tableInfo.sv_person_num" title="就餐人数" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 房台列表弹窗 -->
        <pop-table-list :visible.sync="popTableListStatus" :dataObj="popTableData" @updateTable="handleUpdateTable"></pop-table-list>
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

<style  lang="sass" scoped>@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>
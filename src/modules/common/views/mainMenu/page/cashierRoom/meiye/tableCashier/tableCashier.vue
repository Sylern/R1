<!-- 美业房台收银 -->
<template>
    <div class="tableCashier" ref="tableCashier" tabindex="0" @keyup.enter.stop="handleEnter" @click="handleCashier">
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
                        <cmd-icon type="icon-saoma1" size="36" color="#9967FB"></cmd-icon>
                    </div>
                    <div class="btn btn_xiaoxi" v-permission="{ permission: CashierManage.Message, fn: handleMessage }">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#9967FB"></cmd-icon>
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
                        <cmd-icon type="icon-biaoqiandayin" color="#9967FB" size="24"></cmd-icon>
                        <span class="text">备注</span>
                    </div>
                </div>
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
                            <div class="value" v-if="billabletimeInfo.startTime">{{ billabletimeInfo.startTime.substring(5, billabletimeInfo.startTime.length) }}</div>
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
                        <!-- <div class="moreTableBtn"></div> -->
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
                            <div class="btn btnRecharge" @click="handleClearMember">清除</div>
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
            <div class="leftContent" :class="{ hasBillabletime: !$app.isNull(billabletimeInfo.id), isOrderList: isOrderList, isOrderBack: isOrderBack }">
                <cartting-meiye-table ref="carttingMeiyeTable" :isOrderList.sync="isOrderList" :tableInfo="tableInfo" :popOrderData.sync="orderData" :waittingStatus.sync="waittingStatus" @returnWithout_list_id="returnWithout_list_id" @caterCallback="caterCallback" />

                <div class="tableControl">
                    <div class="pagesWrap" :class="{'isShow': totalPage > 0}">
                        <div class="left">
                            <span class="goodsNumber">数量：
                                <label v-if="isOrderList && dataLength > 0">{{dataLength}}</label>
                                <label v-if="!isOrderList">{{carttingData.buyNumber}}</label>
                            </span>
                        </div>
                        <div class="right">
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
                        <div class="btn" v-permission="{ permission: CashierManage.openCateringTable_A_table, fn: handleBtnControl, param: [5] }">
                            <span>并台</span>
                        </div>
                        <div class="btn" v-permission="{ permission: CashierManage.openCateringTable_Return_food, fn: handleBtnControl, param: [3] }">
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
                    <div class="btnCash">
                        <div class="btnCommon" v-if="carttingData.productResults.length > 0" @click="clearCarttingList">
                            <span>清空</span>
                        </div>
						<template v-else>
							<div class="btnCommon" v-if="$app.isNull(orderData.productResults)" v-permission="{ permission: CashierManage.openCateringTable_Clear_the_table, fn: handleClearTable }">
								<span>清台</span>
							</div>
							<div class="btnCommon" v-else @click="handleShowOrder">
								<span>已下单</span>
							</div>
						</template>
                        <div class="btnCommon" v-permission="{ permission: CashierManage.openCateringTable_Turntable, fn: handleBtnControl, param: [6] }">
                            <span>换台</span>
                        </div>
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
            </div>
            <!-- 并台弹窗 -->
            <cartting-coffee-more :visible.sync="moreTableStatus" :tableInfo="tableInfo" :isOrderList.sync="isOrderList" :mergeCateringList="mergeCateringList" :popOrderData.sync="orderData" @refreshTable="handleRefresh" />
        </div>
        <cashier-right ref="cashierRight"></cashier-right>

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
        <!-- 退菜数量 -->
        <catering-return :visible.sync="returnNumberStatus" :onlyNumber="true" :cateringReturnInfo="cateringReturnInfo" title="退菜数量" @handleReturnNumber="handleReturnNumberChange"></catering-return>
    </div>
</template>

<style lang="sass" scoped>
@import "./tableCashier.scss"
</style>
<script src="./tableCashier.js"></script>

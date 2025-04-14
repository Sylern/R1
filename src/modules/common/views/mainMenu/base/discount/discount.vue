<!--优惠券列表弹窗-->
<template>
    <div class="discount" ref="discount" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="1000" height="650" title="选择优惠券" @close="closeDialog">
            <div class="contentWrap">
                <el-input class="searchWrap" ref="inputKeyWord" v-model.trim="keyWord" placeholder="输入核销码" @keyup.native.stop="handlePrevent" @keyup.native.enter="handleInputEnter" @clear="clearKeyWord" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-scrollbar class="listWrap">
                    <div class="listContent">
                        <div class="listItem ticketResult" v-if="showInputResult">
                            <div class="listItemContent">
                                <div class="container">
                                    <div class="leftSemicircle"></div>
                                    <div class="rightSemicircle"></div>
                                    <div class="checkBox">
                                        <div class="check isCheck"></div>
                                    </div>
                                    <div class="infoWrap">
                                        <div class="priceWrap" v-if="ticketResult.sv_coupon_type === 0">
                                            <span class="symbol">¥</span>
                                            <span>{{$app.moneyFixed(ticketResult.sv_coupon_money)}}</span>
                                        </div>
                                        <div class="priceWrap" v-if="ticketResult.sv_coupon_type === 1">
                                            <span>{{$app.moneyFixed(ticketResult.sv_coupon_money/10,1)}}</span>
                                            <span class="symbol"> 折</span>
                                        </div>
                                        <div class="infoRow" v-if="ticketResult.sv_coupon_use_conditions">{{ticketResult.sv_coupon_name}}（满{{ticketResult.sv_coupon_use_conditions}}可用）</div>
                                        <div class="infoRow" v-else>{{ticketResult.sv_coupon_name}}（无门槛）</div>
                                        <div class="infoRow">有效期至：{{$app.currentTime(new Date(ticketResult.sv_coupon_enddate))}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="listItem" v-else :class="{ disabled: !coupon_is_superposition && selectedCouponIdList.findIndex(e => e.sv_record_id === item.sv_record_id) === -1}" v-for="(item,index) in memberInfo.couponCountList" :key="index" @click="handleItemClick(item)">
                            <div class="listItemContent">
                                <div class="container">
                                    <div class="leftSemicircle"></div>
                                    <div class="rightSemicircle"></div>
                                    <div class="checkBox">
                                        <div class="check" :class="{'isCheck': selectedCouponIdList.findIndex(e => e.sv_record_id === item.sv_record_id) > -1}"></div>
                                    </div>
                                    <div class="infoWrap">
                                        <div class="priceWrap" v-if="item.sv_coupon_type === 0">
                                            <span class="symbol">¥</span>
                                            <span>{{$app.moneyFixed(item.sv_coupon_money)}}</span>
                                        </div>
                                        <div class="priceWrap" v-if="item.sv_coupon_type === 1">
                                            <span>{{$app.moneyFixed(item.sv_coupon_money/10,1)}}</span>
                                            <span class="symbol"> 折</span>
                                        </div>
                                        <div class="infoRow" v-if="item.sv_coupon_use_conditions">{{item.sv_coupon_name}}（满{{item.sv_coupon_use_conditions}}可用）</div>
                                        <div class="infoRow" v-else>{{item.sv_coupon_name}}（无门槛）</div>
                                        <div class="infoRow">有效期至：{{$app.currentTime(new Date(item.sv_coupon_enddate))}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './discount.scss';
</style>
<script src="./discount.js"></script>
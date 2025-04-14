<!--优惠券列表弹窗-->
<template>
    <div class="discount" ref="discount" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="10" height="6.5" title="选择优惠券" @close="closeDialog">
            <div class="contentWrap">
                <el-input class="searchWrap" ref="inputKeyWord" v-model.trim="query.keywords" placeholder="搜索优惠券名字" @keyup.enter.native.stop="getCouponList" @clear="clearKeyWord" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-scrollbar class="listWrap">
                    <div class="listContent">
                        <div class="listItem selected" :class="{'isLineFirst': index%3 == 0}" v-for="(item,index) in couponCountList" :key="index" @click="handleItemClick(index)">
                            <div class="container" v-scale>
                                <div class="leftSemicircle"></div>
                                <div class="rightSemicircle"></div>
                                <div class="checkBox">
                                    <div class="check" :class="{'isCheck': selectedPos == index}"></div>
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
                                    <!-- <div class="priceWrap">
                                        <span class="symbol">¥</span>
                                        <span>{{$app.moneyFixed(item.sv_coupon_money)}}</span>
                                    </div>
                                    <div class="infoRow">{{item.sv_coupon_name}}（满{{item.sv_coupon_use_conditions}}可用）</div>
                                    <div class="infoRow">有效期：{{$app.currentTime(new Date(item.sv_coupon_enddate))}}</div> -->
                                </div>
                            </div>
                        </div>
                        <div v-if="couponCountList.length<1" class="notNull">暂无可用优惠券，<el-button @click="handleToCoupon" type="text">去查看优惠券</el-button></div>
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
@import './couponList.scss';
</style>
<script src="./couponList.js"></script>
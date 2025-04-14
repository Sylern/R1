<!--一二级分类下商品列表-->
<template>
    <div class="goodsList">
        <el-scrollbar class="listWrap">
            <div class="itemWrap">
                <goodsItem ref="goodsItem" isCurrent v-for="(item,index) in goodsList" :index="index" :goodsItem="item" :key="index" @addCart="addCart" />
            </div>
        </el-scrollbar>
        <div class="btnWrap">
            <div class="btnList">
                <!-- <div class="btnMore btn" @click="handleOrderList">
                    <span>按单退</span>
                </div> -->
            </div>
            <div class="btnOnGoods">
                <!-- <div class="btnAdd btn" @click="showGoodsAdd">
                    <span>+新增商品</span>
                </div> -->
                <div class="btnLast btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === 1}" @click="pageLast">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="pages" v-if="goodsTotal > 0">{{query.pageIndex +'/'+ goodsTotal}}</div>
                <div class="btnNext btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === goodsTotal}" @click="pageNext">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>

        <div id="ball" :style="ballAnimation">
            <img class="img" v-if="animationImg" :src="animationImg" style="width:100%;height:100%;" />
            <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/cashier/noGoodsImg.png'" />
        </div>
        
        <!-- 备用金 -->
        <pop-cashmoney :visible.sync="isShowCash" title="请输入备用金" :onlyNumber="false" @handleNumberChange="setSalesclerkCash"></pop-cashmoney>

        <!-- 更多功能弹窗 -->
        <more-func-entry :visible.sync="funcEntryStatus"></more-func-entry>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsList.scss';
</style>
<script src="./goodsList.js"></script>
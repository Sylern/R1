<!--称重商品弹窗-->
<template>
    <div class="goodsWeigh" v-if="dialogVisible">
        <dc-dialog width="900" height="580" @close="closeDialog">
            <div class="contentWrap" ref="goodsWeigh" tabindex="0" @keyup.stop="listenKeyup">
                <div class="left">
                    <div class="contentTitle">商品数量</div>
                    <div class="goodsInfo">
                        <div class="imgBox">
                            <img class="img" v-if="!$app.isNull(goodsImg)" :src="goodsInfo.goodsImg" />
                            <img class="img" v-else :src="$store.state.base.frontImgBase+'/images/cashier/noGoodsImg.png'" />
                        </div>
                        <div class="goodsText">
                            <div class="goodsName">{{goodsInfo.goodsName}}</div>
                            <div class="goodsAttr">
                                <span>{{goodsInfo.barcode}}</span>
                                <!-- <span class="spec">{{goodsInfo.specs}}</span> -->
                                <span class="stock">库：{{goodsInfo.storage}}</span>
                            </div>
                            <div class="goodsPrice">￥{{$app.moneyFixed(goodsInfo.unitprice)}}</div>
                        </div>
                    </div>
                    <div class="goodsItemInfo" :class="{'selected': index === goodsAttrPos}" v-for="(item, index) in goodsAttr" :key="index" @click="handleAttrPos(index)">
                        <div>
                            <span>{{item.keyName}}</span>
                        </div>
                        <div>
                            <span class="attrValue">{{item.value}}</span>
                            <label class="attrUnit" v-if="item.unit">{{item.unit}}</label>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <!-- 多单位 -->
                    <div class="calculatorWrap" v-if="hasCalculator && !isShowMutiPrice">
                        <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                            <div class="keyItem">{{item.key}}</div>
                        </div>
                    </div>
                    <!-- 多价格 -->
                    <!-- <div class="multiPrice" v-if="hasMultiPrice && isShowMutiPrice">
                        <div class="typeBack" @click="handleMultiPriceBack">返回</div>
                        <div class="headerWrap">
                            <span>选择价格类型</span>
                        </div>
                        <div class="listWrap">
                            <div class="listItem" :class="{'selected': index === multiPricePos}" v-for="(item,index) in priceList" :key="index" @click="handleMultiPriceItem(index,item)">
                                <div class="itemName">{{item.name}}</div>
                                <div class="itemValue">¥{{item.value}}</div>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="bottomWrap">
                <div class="totalPrice">
                    <span class="nomarl">总价：</span>
                    <span class="value">{{this.$app.moneyFixed(priceTotal,2)}}</span>
                    <!-- <div class="weightSwitch">
                        <span class="text">稳定后自动加入购物车</span>
                        <el-switch v-model="weightSwitchStatus"></el-switch>
                    </div> -->
                </div>
                <div class="btnWrap">
                    <div class="remark">
                        <span>备注：</span>
                        <el-input v-model="remark" maxlength="30" placeholder="请输入备注，限制30字内"></el-input>
                    </div>
                    <div class="btnSure" @click.stop="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsWeight.scss';
</style>
<script src="./goodsWeight.js"></script>
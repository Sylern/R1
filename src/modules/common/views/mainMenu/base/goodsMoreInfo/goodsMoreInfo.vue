<!--商品多规格、多单位、多价格弹窗-->
<template>
    <div class="goodsMoreInfo" ref="goodsMoreInfo" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="900" height="580" @close="closeDialog">
            <div class="contentWrap">
                <div class="left">
                    <div class="contentTitle">商品</div>
                    <div class="goodsInfo">
                        <div class="imgBox">
                            <img class="img" v-if="!$app.isNull(goodsImg)" :src="goodsImg" />
                            <img class="img" v-else :src="$store.state.base.frontImgBase+'/images/default.png'" />
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
                    <!-- 多价格 -->
                    <template v-if="hasMultiPrice">
                        <div class="salePrice" @click="isShowMutiPrice = true">
                            <div>{{currentPrice.name}}</div>
                            <div class="value">
                                <span>¥{{$app.moneyFixed(currentPrice.value)}}</span>
                                <i class="icon el-icon-arrow-down"></i>
                            </div>
                        </div>
                    </template>
                    <!-- 多规格 -->
                    <div class="multiSpecWrap" :class="{ noMultiPrice: !hasMultiPrice}" v-if="hasMultiSpec">
                        <el-scrollbar ref="multiSpecWrap" style="width:100%; height: 100%;">
                            <template v-for="(item, index) in validList">
                                <div class="multiSpec" v-if="item.dataList.length > 0" :key="index">
                                    <div class="validTitle">
                                        <span>{{item.spec_name}}</span>
                                    </div>
                                    <div class="specItem">
                                        <span class="item" :class="{'selected': k.selected, 'lineLast': pos%3 === 2}" v-for="(k,pos) in item.dataList" :key="pos" @click="handleSpecItem(index,pos)">
                                            {{k.name}}
                                            <!-- <label class="number" v-if="item.selectedValue > 0 && item.selected">{{item.selectedValue}}</label> -->
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </el-scrollbar>
                    </div>
                    <!-- 多单位 -->
                    <template v-if="hasMultiUnit">
                        <div class="multiUnit">
                            <div class="unitItem">
                                <span class="item selected">件（x48.0支)</span>
                                <span class="item">箱（x24.0支）</span>
                                <span class="item lineLast">支（x1.0支）</span>
                            </div>
                        </div>
                    </template>
                    <!-- 可以小键盘修改数量 -->
                    <template v-if="hasCalculator">
                        <div class="goodsNum">
                            <div>数量</div>
                            <div>{{inputNumber}}</div>
                        </div>
                    </template>
                </div>
                <div class="right">
                    <!-- 多价格、多单位 -->
                    <div class="calculatorWrap" v-if="hasCalculator && !isShowMutiPrice && !isShowMultiSpec">
                        <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                            <div class="keyItem">{{item.key}}</div>
                        </div>
                    </div>
                    <!-- 多规格 -->
                    <div class="multiSpecRight" v-if="hasMultiSpec && !isShowMutiPrice">
                        <div class="headerWrap">
                            <div class="td1">规格</div>
                            <div class="td2">零售价</div>
                            <div class="td3">库存</div>
                            <div class="td4">
                                <span class="btn subtract" @click="batchSubtract" v-show="batchUpdateNum > 0">-</span>
                                <span class="itemValue" v-show="batchUpdateNum > 0">
                                    <el-input v-model.trim.lazy="batchUpdateNum" @input.native.stop="handleBatchInput"></el-input>
                                </span>
                                <span class="btn add" @click="batchAdd">+</span>
                            </div>
                        </div>
                        <el-scrollbar ref="listWrap" class="listWrap">
                            <template v-for="(item,index) in specGoodsList">
                                <div class="itemWrap" v-if="item.isShow" :key="index">
                                    <div class="td1">
                                        <div class="lineInfo">{{item.sv_p_artno || item.sv_p_barcode}}</div>
                                        <div class="lineInfo">{{item.sv_p_specs}}</div>
                                    </div>
                                    <div class="td2">{{$app.moneyFixed(item.sv_p_unitprice)}}</div>
                                    <div class="td3">{{item.sv_p_storage}}</div>
                                    <div class="td4">
                                        <span class="btn subtract" @click="handleSubtract(item)" v-show="item.num > 0">-</span>
                                        <span class="itemValue" v-show="item.num > 0">
                                            <el-input v-model.trim.lazy="item.num" @input.native.stop="handleItemInput"></el-input>
                                        </span>
                                        <span class="btn add" @click="handleAdd(item)">+</span>
                                    </div>
                                </div>
                            </template>
                        </el-scrollbar>
                    </div>
                    <!-- 多价格 -->
                    <div class="multiPrice" v-if="hasMultiPrice && isShowMutiPrice">
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
                    </div>
                </div>
            </div>
            <div class="bottomWrap">
                <div class="totalCount">
                    <div class="totalNumber" v-if="!hasCalculator">
                        <span>数量：{{goodsTotal}}</span>
                    </div>
                    <div class="totalPrice">
                        <span class="nomarl">总价：</span>
                        <span class="value">{{priceTotal}}</span>
                    </div>
                </div>
                <div class="btnSure" @click="handleSure">确定</div>
            </div>
        </dc-dialog>

        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="goodsInfo.unitprice" @handleNumberChange="moneyEdit"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsMoreInfo.scss';
</style>
<script src="./goodsMoreInfo.js"></script>
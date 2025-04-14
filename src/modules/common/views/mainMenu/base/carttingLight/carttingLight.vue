<!--轻餐-->
<template>
    <div class="carttingLight">
        <div class="tableWrap">
            <div class="header">
                <div class="cell1">
                    <span>序号</span>
                </div>
                <div class="cell2">
                    <span>{{ isCatting ? '菜品名称' : '商品名称'}}</span>
                </div>
                <div class="cell3">
                    <span>数量</span>
                </div>
                <div class="cell4">
                    <span>售价</span>
                </div>
            </div>
            <div class="tbody">
                <el-scrollbar style="width:100%; height:100%; overflow:hidden;">
                    <div class="cartItem" v-for="(item,index) in carttingData.productResults" :key="index" @click.stop="handleItemSelected(item,index)">
                        <div class="itemPackage" v-if="item.isPackage">套</div>
                        <div class="dataMain">
                            <div class="itemStatus">
                                <img class="img" v-if="waittingStatus" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" />
                            </div>
                            <div class="rowTop row">
                                <div class="cell1"></div>
                                <div class="cell2">
                                    <div class="goodsNumber">{{item.barCode}}</div>
                                </div>
                                <div class="cell3"></div>
                                <div class="cell4"></div>
                            </div>
                            <div class="rowMiddle row">
                                <div class="cell1">
                                    <span class="index">{{index + 1}}</span>
                                </div>
                                <div class="cell2">
                                    <div class="goodsName">
                                        <div class="nameText">
                                            <span>{{item.isNewSpec ? item.productName +'['+ item.sepcs +']' : item.productName}}</span>
                                        </div>
                                        <div class="subInfo" v-html="handleCartering(item)"></div>
                                    </div>
                                </div>
                                <div class="cell3" @click.stop="">
                                    <div class="btnSubtract" v-permission="{permission: CashierManage.key_num, fn: handleSubtract, param: [item,index]}">
                                        <span>-</span>
                                    </div>
                                    <div class="product_num" v-permission="{permission: CashierManage.key_num, fn: handleNumberChange, param: [index]}">
                                        <span>{{item.number}}</span>
                                    </div>
                                    <div class="btnAdd" v-permission="{permission: CashierManage.key_num, fn: handleAdd, param: [item,index]}">
                                        <span>+</span>
                                    </div>
                                </div>
                                <div class="cell4" @click.stop="">
                                    <div class="salePrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [item, index]}">
                                        <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="rowBottom row">
                                <div class="cell1"></div>
                                <div class="cell2" v-html="handleProductCouponDesc(item)"></div>
                                <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                            </div>
                        </div>
                        <div class="dataSub" v-for="(data, pos) in item.packageGroups" :key="pos">
                            <div class="subName">
                                <span>{{data.name}}</span>
                            </div>
                            <div v-for="(k, p) in data.products" :key="p">
                                <div class="rowTop row">
                                    <div class="cell1"></div>
                                    <div class="cell2">
                                        <div class="goodsNumber">{{k.barCode}}</div>
                                    </div>
                                    <div class="cell3"></div>
                                    <div class="cell4"></div>
                                </div>
                                <div class="rowMiddle row">
                                    <div class="cell1"></div>
                                    <div class="cell2">
                                        <div class="goodsName">
                                            <div class="nameText">
                                                <span>{{k.name}}</span>
                                            </div>
                                            <div class="subInfo" v-html="handleCartering(k)"></div>
                                        </div>
                                    </div>
                                    <div class="cell3">
                                        <div class="product_num">
                                            <span>x{{k.number}}</span>
                                        </div>
                                    </div>
                                    <div class="cell4">
                                        <div class="addPrice" v-if="k.addPrice > 0">
                                            <span>加价：{{$app.moneyFixed(k.addPrice)}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="rowBottom row">
                                    <div class="cell1"></div>
                                    <div class="cell2" v-html="handleProductCouponDesc(k)"></div>
                                    <div class="cell4" v-html="handleProductCouponMoney(k)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="tableControl">
            <div class="pagesWrap" :class="{'isShow': totalPage > 0}">
                <div class="left">
                    <span class="goodsNumber">数量：
                        <label>{{carttingData.buyNumber}}</label>
                    </span>
                </div>
            </div>
        </div>
        <!-- 餐饮更多 -->
        <catering-more :visible.sync="cateringMoreStatus" :cateringInfo="cateringInfo" :cateringData="cateringData" @handleSure="returnGoodsInfo"></catering-more>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
        <!-- 套餐 -->
        <goods-package :visible.sync="goodsPackageStatus" :goodsId="goodsPackageItem.id" @handleSure="returnGoodsPackage"></goods-package>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="improtMoney" :discountMoney="improtMoney" @submitMoney="moneyEdit"></price-change>

        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="improtMoney" @handleNumberChange="moneyEdit"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingLight.scss';
</style>
<script src="./carttingLight.js"></script>
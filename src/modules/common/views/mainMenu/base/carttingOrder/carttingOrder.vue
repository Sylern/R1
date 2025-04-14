<!--主页左侧购物车-->
<template>
    <div class="carttingOrder">
        <div class="tableWrap">
            <div class="header">
                <div class="cell1">
                    <span>序号</span>
                </div>
                <div class="cell2">
                    <span>菜品名称</span>
                </div>
                <div class="cell3">
                    <span>数量</span>
                </div>
                <div class="cell4">
                    <span>售价</span>
                </div>
            </div>
            <div class="tbody">
                <el-scrollbar style="width:100%;height:100%; overflow:hidden;">
                    <div class="cartItem" :class="{'selected': currentPos === index}" v-for="(item,index) in orderData.productResults" :key="index" @click="handleItemSelected(index)">
                        <div class="itemStatus">
                            <!-- <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/tui.png'" alt="" /> -->
                            <img class="img" v-if="item.sv_return_status === 2" :src="$store.state.base.frontImgBase + '/images/cashier/tui.png'" alt="" />
                            <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 1" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" alt="" />
                            <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 2" :src="$store.state.base.frontImgBase + '/images/cashier/qi.png'" alt="" />
                        </div>
                        <div class="rowTop row">
                            <div class="cell1"></div>
                            <div class="cell2">
                                <div class="goodsNumber">{{item.barCode}}</div>
                            </div>
                            <div class="cell3"></div>
                            <div class="cell4"></div>
                            <!-- <div class="cell5"></div> -->
                            <div class="cell6"></div>
                        </div>
                        <div class="rowMiddle row">
                            <div class="cell1">
                                <span>{{index+1}}</span>
                            </div>
                            <div class="cell2">
                                <div class="goodsName">
                                    <div class="nameText">
                                        <span>{{item.isNewSpec ? item.productName +'['+ item.sepcs +']' : item.productName}}</span>
                                    </div>
                                    <div class="subInfo" v-html="handleCartering(item)"></div>
                                </div>
                            </div>
                            <div class="cell3">
                                <div class="product_num">
                                    <span>{{item.number}}</span>
                                </div>
                            </div>
                            <div class="cell4">
                                <div class="salePrice" @click.stop="handlePriceChange(index)">
                                    <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                    <!-- <el-input v-model.trim="item.dealPrice" @keyup.native.stop="priceInputChange($event, item)" @blur="priceInputBlur($event, item)"></el-input> -->
                                </div>
                            </div>
                        </div>
                        <div class="rowBottom row">
                            <div class="cell1"></div>
                            <div class="cell2" v-html="handleProductCouponDesc(item)"></div>
                            <div class="cell3"></div>
                            <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="tableControl" v-if="dataLength > 0">
            <div class="pagesWrap">
                <div class="left">
                    <span class="goodsNumber">数量：
                        <label>{{dataLength}}</label>
                    </span>
                </div>
            </div>
        </div>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="improtMoney" :discountMoney="improtMoney" @submitMoney="moneyEdit"></price-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingOrder.scss';
</style>
<script src="./carttingOrder.js"></script>
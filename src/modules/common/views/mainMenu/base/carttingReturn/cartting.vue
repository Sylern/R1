<!--主页左侧购物车-->
<template>
    <div class="cartting">
        <div class="tableWrap">
            <div class="header">
                <div class="cell1">
                    <span>序号</span>
                </div>
                <div class="cell2">
                    <span>商品名称</span>
                </div>
                <div class="cell3">
                    <span v-if="orderDataList.length > 0">可退数量</span>
                </div>
                <div class="cell4">
                    <span>数量</span>
                </div>
                <div class="cell5">
                    <span>售价</span>
                </div>
                <div class="cell6">
                    <span>单位</span>
                </div>
                <div class="cell7">
                    <span>小计</span>
                </div>
            </div>
            <div class="tbody">
                <el-scrollbar style="width:100%;height:100%; overflow:hidden;">
                    <div class="cartItem" v-for="(item,index) in orderDataList" :key="index">
                        <div class="rowTop row">
                            <div class="cell1"></div>
                            <div class="cell2">
                                <div class="goodsNumber">{{item.barCode}}</div>
                            </div>
                            <div class="cell3"></div>
                            <div class="cell4"></div>
                            <div class="cell5"></div>
                            <div class="cell6"></div>
                            <div class="cell7"></div>
                        </div>
                        <div class="rowMiddle row">
                            <div class="cell1">
                                <span>{{ index + 1 }}</span>
                            </div>
                            <div class="cell2">
                                <div class="goodsName">
                                    <div class="nameText">
                                        <span>{{item.productName}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cell3">
                                <span>{{item.number}}</span>
                            </div>
                            <div class="cell4">
                                <div class="btnSubtract" @click.stop="handleOrderSubtract(item, index)">
                                    <span>-</span>
                                </div>
                                <div class="product_num">
                                    <span>{{item.currentNumber}}</span>
                                </div>
                                <div class="btnAdd" @click.stop="handleOrderAdd(item, index)">
                                    <span>+</span>
                                </div>
                            </div>
                            <div class="cell5">
                                <div class="salePrice">
                                    <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                </div>
                            </div>
                            <div class="cell6">
                                <span class="unit">{{item.unitName}}</span>
                            </div>
                            <div class="cell7">
                                <div class="subTotal">{{$app.moneyFixed(item.dealMoney)}}</div>
                            </div>
                        </div>
                        <div class="rowBottom row">
                            <div class="cell1"></div>
                            <div class="cell2" v-html="handleCartering(item)"></div>
                            <div class="cell3"></div>
                            <div class="cell4"></div>
                            <div class="cell5" v-html="handleProductCouponMoney(item)"></div>
                            <div class="cell6"></div>
                            <div class="cell7">
                                <div class="btnDelete" @click.stop="handleOrderDel(index)">
                                    <i class="el-icon-delete"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="exchargeInfo" v-if="orderDataList.length > 0 && dataList.length > 0">换货商品</div>
                    <div class="cartItem returnData" v-for="(item,index) in dataList" :key="index" @click="handleItemSelected(item,index)">
                        <div class="rowTop row">
                            <div class="cell1"></div>
                            <div class="cell2">
                                <div class="goodsNumber">{{item.barCode}}</div>
                            </div>
                            <div class="cell3"></div>
                            <div class="cell4"></div>
                            <div class="cell5"></div>
                            <div class="cell6"></div>
                            <div class="cell7"></div>
                        </div>
                        <div class="rowMiddle row">
                            <div class="cell1">
                                <span>{{ index + 1 }}</span>
                            </div>
                            <div class="cell2">
                                <div class="goodsName">
                                    <div class="nameText">
                                        <span>{{item.isNewSpec ? item.productName +'['+ item.sepcs +']' : item.productName}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cell3"></div>
                            <div class="cell4">
                                <div class="btnSubtract" @click.stop="handleSubtract(item,index)">
                                    <span>-</span>
                                </div>
                                <div class="product_num" @click.stop="clickNumberChange(index)">
                                    <span>{{item.number}}</span>
                                </div>
                                <div class="btnAdd" @click.stop="handleAdd(item,index)">
                                    <span>+</span>
                                </div>
                            </div>
                            <div class="cell5">
                                <div class="salePrice" @click.stop="handlePriceChange(index)">
                                    <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                </div>
                            </div>
                            <div class="cell6">
                                <span class="unit">{{item.unitName}}</span>
                            </div>
                            <div class="cell7">
                                <!-- <div class="subTotal">{{item.product_total}}</div> -->
                                <div class="subTotal">{{$app.moneyFixed(item.dealMoney)}}</div>
                            </div>
                        </div>
                        <div class="rowBottom row">
                            <div class="cell1"></div>
                            <div class="cell2" v-html="handleCartering(item)"></div>
                            <div class="cell3"></div>
                            <div class="cell4"></div>
                            <div class="cell5" v-html="handleProductCouponMoney(item)"></div>
                            <div class="cell6"></div>
                            <div class="cell7">
                                <div class="btnDelete" @click.stop="handleDel(index)">
                                    <i class="el-icon-delete"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="tableControl" v-if="orderDataList.length > 0 || dataList.length > 0">
            <div class="pagesWrap">
                <div class="left">
                    <div class="btnItem" @click="clearCarttingList">
                        <span>清空</span>
                    </div>
                    <el-input class="remark" v-model="remarks" @keyup.native.stop="" type="text" placeholder="备注：请输入订单备注"></el-input>
                </div>
                <div class="right"></div>
            </div>
        </div>
        <!-- 商品改数量 -->
        <number-change :visible.sync="numberChangeStatus" title="商品数量" :onlyNumber="carttingSelectedPos > -1 ? !dataList[carttingSelectedPos].isPricingMethod : true" :defaultNumber="carttingSelectedPos > -1 ? dataList[carttingSelectedPos].number : 1" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="carttingSelectedPos > -1 ? dataList[carttingSelectedPos].dealPrice : ''" @submitMoney="handlePriceChangeBack"></price-change>
        <!-- 餐饮更多 -->
        <catering-more :visible.sync="cateringMoreStatus" :cateringInfo="cateringInfo" :cateringData="cateringData" @handleSure="returnGoodsInfo"></catering-more>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
    </div>
</template>

<style  lang="scss" scoped>
@import './cartting.scss';
</style>
<script src="./cartting.js"></script>
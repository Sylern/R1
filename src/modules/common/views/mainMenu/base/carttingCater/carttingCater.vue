<!--餐饮购物车及订单-->
<template>
    <div class="carttingCater">
        <div class="tableWrap">
            <div class="header">
                <div class="cell1">
                    <span>序号</span>
                </div>
                <div class="cell2">
                    <span>{{isCatering ? '菜品名称' : '商品名称' }}</span>
                </div>
                <div class="cell3">
                    <span>数量</span>
                </div>
                <div class="cell4">
                    <span>售价</span>
                </div>
            </div>
            <div class="tbody">
                <el-scrollbar ref="scrollList" style="width:100%; height:100%; overflow:hidden;">
                    <template v-if="isOrderList">
                        <div class="orderItem" :class="{'selected': currentPos === index, 'isPackage': item.isPackage}" v-for="(item,index) in orderData.productResults" :key="index" @click="handleOrderItemSelected(index)">
                            <div class="itemPackage" v-if="item.isPackage">套</div>
                            <div class="itemGive" v-if="item.dealMoney === 0 && item.sv_return_status !== 2">
                                <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/giving.png'" alt="" />
                            </div>
                            <div class="dataMain">
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
                                    <div class="cell4" @click.stop="">
                                        <div class="salePrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [item, index]}">
                                            <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                            <!-- <el-input v-model.trim="item.dealPrice" @keyup.native.stop="priceInputChange($event, item)" @blur="priceInputBlur($event, item)"></el-input> -->
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
                                <div class="subName" v-if="data.name">
                                    <span>—— {{data.name}} ——</span>
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
                                                <div class="subInfo" v-html="handleCarteringSub(k)"></div>
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
                    </template>
                    <template v-else>
                        <div class="cartItem" :class="{'isPackage': item.isPackage}" v-for="(item,index) in carttingData.productResults" :key="index" @click.stop="handleItemSelected(item,index)">
                            <template v-if="!item.isHidden">
                                <div class="itemPackage" v-if="item.isPackage">套</div>
                                <div class="itemGive" v-if="item.dealMoney === 0">
                                    <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/giving.png'" alt="" />
                                </div>
                                <div class="dataMain">
                                    <div class="itemStatus">
                                        <img class="img" v-if="item.waittingStatus" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" />
                                    </div>
                                    <div class="rowTop row">
                                        <div class="cell1"></div>
                                        <div class="cell2">
                                            <div class="goodsNumber">{{item.barCode}}</div>
                                        </div>
                                        <div class="cell3"></div>
                                        <div class="cell4"></div>
                                    </div>
                                    <div class="rowMiddle row" @click.stop="">
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
                                        <div class="cell3">
                                            <div class="btnSubtract" v-permission="{permission: CashierManage.ZCshuliangjianshao, fn: handleSubtract, param: [item,index]}">
                                                <span>-</span>
                                            </div>
                                            <div class="product_num" v-permission="{permission: CashierManage.key_num, fn: handleNumberChange, param: [index]}">
                                                <span>{{item.number}}</span>
                                            </div>
                                            <div class="btnAdd" v-permission="{permission: CashierManage.ZCshuliangzengjia, fn: handleAdd, param: [item,index]}">
                                                <span>+</span>
                                            </div>
                                        </div>
                                        <div class="cell4">
                                            <div class="salePrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [item, index]}">
                                                <span>{{$app.moneyFixed(item.dealMoney)}}</span>
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
                                        <span>—— {{data.name}} ——</span>
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
                                                    <div class="subInfo" v-html="handleCarteringSub(k)"></div>
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
                            </template>
                        </div>
                    </template>
                </el-scrollbar>
            </div>
        </div>
        <div class="tableControl">
            <div class="pagesWrap" :class="{'isShow': totalPage > 0}">
                <div class="left">
                    <span class="goodsNumber">数量：
                        <label v-if="isOrderList && dataLength > 0">{{dataLength}}</label>
                        <label v-if="!isOrderList">{{carttingData.buyNumber}}</label>
                    </span>
                </div>
            </div>
        </div>

        <!-- 已下单菜品点击弹窗 -->
        <div class="orderItemHandle" v-if="orderItemHandleStatus">
            <dc-dialog width="360" :height="isCatering ? 240 : 140" @close="closeOrderItemHandle">
                <div class="contentWrap" v-if="isCatering">
                    <div class="btnItem" v-permission="{permission: CashierManage.complimentary_food, fn: orderItemHandleEvent, param: [1]}">
                        <div class="btnIcon">
                            <cmd-icon type="icon-zengcai" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">赠菜</div>
                    </div>
                    <div class="btnItem" v-permission="{permission: CashierManage.Move_Dishes, fn: orderItemHandleEvent, param: [2]}">
                        <div class="btnIcon">
                            <cmd-icon type="icon-yicai" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">移菜</div>
                    </div>
                    <div class="btnItem">
                        <div class="btnIcon" v-permission="{permission: CashierManage.key_change_price1, fn: orderItemHandleEvent, param: [3]}">
                            <cmd-icon type="icon-gaijia" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">改价</div>
                    </div>
                    <div class="btnItem">
                        <div class="btnIcon" v-permission="{permission: CashierManage.Starting_Dishes, fn: orderItemHandleEvent, param: [4]}">
                            <cmd-icon type="icon-jiaoqi" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">起菜</div>
                    </div>
                    <div class="btnItem">
                        <div class="btnIcon" v-permission="{permission: CashierManage.openCateringTable_Return_food, fn: orderItemHandleEvent, param: [5]}">
                            <cmd-icon type="icon-tuicai" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">退菜</div>
                    </div>
                    <div class="btnItem isEmpty"></div>
                </div>
                <div class="contentWrap" v-else>
                    <div class="btnItem" v-permission="{permission: CashierManage.complimentary_food, fn: orderItemHandleEvent, param: [1]}">
                        <div class="btnIcon">
                            <cmd-icon type="icon-zengcai" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">赠单</div>
                    </div>
                    <div class="btnItem">
                        <div class="btnIcon" v-permission="{permission: CashierManage.openCateringTable_Return_food, fn: orderItemHandleEvent, param: [5]}">
                            <cmd-icon type="icon-tuicai" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">退单</div>
                    </div>
                    <div class="btnItem">
                        <div class="btnIcon" v-permission="{permission: CashierManage.key_change_price1, fn: orderItemHandleEvent, param: [3]}">
                            <cmd-icon type="icon-gaijia" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">改价</div>
                    </div>
                </div>
            </dc-dialog>
        </div>
        <!-- 餐饮更多 -->
        <catering-more :visible.sync="cateringMoreStatus" :cateringInfo="cateringInfo" :cateringData="cateringData" @handleSure="returnGoodsInfo"></catering-more>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
        <!-- 套餐 -->
        <goods-package :visible.sync="goodsPackageStatus" :goodsId="goodsPackageItem.id" @handleSure="returnGoodsPackage"></goods-package>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" showGive :menuPos.sync="priceChangeMenuPos" :improtMoney="improtMoney" :discountMoney="improtMoney" @submitMoney="moneyEdit"></price-change>

        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="improtMoney" @handleNumberChange="moneyEdit"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingCater.scss';
</style>
<script src="./carttingCater.js"></script>
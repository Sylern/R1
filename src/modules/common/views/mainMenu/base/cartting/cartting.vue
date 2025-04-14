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
                    <span>数量</span>
                </div>
                <div class="cell4">
                    <span>售价</span>
                </div>
                <div class="cell5">
                    <span>单位</span>
                </div>
                <div class="cell6">
                    <span>小计</span>
                </div>
                <div class="cell7"></div>
            </div>
            <div class="tbody">
                <el-scrollbar ref="scrollList" style="width:100%;height:100%; overflow:hidden;">
                    <div class="cartItem" :class="{'selected': carttingSelectedPos === (carttingCurrentPage-1)*8+index, 'isPackage': item.isPackage}" v-for="(item,index) in currentData" :key="index" @click="handleItemSelected(item,index)">
                        <!-- <div class="cartItem" v-for="(item,index) in currentData" :key="index" @click="handleItemSelected(index)"> -->
                        <div class="itemPackage" v-if="item.isPackage">套</div>
                        <div class="dataMain">
                            <div class="rowTop row">
                                <div class="cell1"></div>
                                <div class="cell2">
                                    <div class="goodsNumber">{{isUserArtNo && !$app.isNull(item.artNo) ? item.artNo : item.barCode}}</div>
                                </div>
                                <div class="cell3"></div>
                                <div class="cell4 settlementProductPrice" v-html="handleSettlementProductPrice(item)"></div>
                                <div class="cell5"></div>
                                <div class="cell6"></div>
                                <div class="cell7"></div>
                            </div>
                            <div class="rowMiddle row">
                                <div class="cell1">
                                    <span>{{(carttingCurrentPage-1)*8+index+1}}</span>
                                </div>
                                <div class="cell2">
                                    <div class="goodsName">
                                        <div class="nameText">
                                            <span>{{item.isNewSpec ? item.productName +' ['+ item.sepcs +']' : item.productName}}</span>
                                        </div>
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
                                    <div class="salePrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [index]}">
                                        <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                    </div>
                                </div>
                                <div class="cell5">
                                    <span class="unit">{{item.unitName}}</span>
                                </div>
                                <div class="cell6" @click.stop="" v-permission="{permission: CashierManage.key_change_price, fn: handleMoneyChange, param: [index]}">
                                    <div class="subTotal">{{$app.moneyFixed(item.dealMoney)}}</div>
                                </div>
                                <div class="cell7" @click.stop="">
                                    <div class="btnDelete" v-permission="{permission: CashierManage.delete_p, fn: handleDel, param: [(carttingCurrentPage-1)*8 + index]}">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="rowBottom row">
                                <div class="cell1"></div>
                                <div class="cell2" v-html="handleProductCouponDesc(item)"> </div>
                                <div class="cell3"></div>
                                <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                                <div class="cell5"></div>
                                <div class="cell6"></div>
                                <div class="cell7"></div>
                            </div>
                        </div>
                        <div class="dataSub" v-for="(data, pos) in item.packageGroups" :key="pos">
                            <!-- 套餐及捆绑子项 -->
                            <div class="subName" v-if="data.name">
                                <span>—— {{data.name}} ——</span>
                            </div>
                            <div v-for="(k, p) in data.products" :key="p">
                                <div class="rowTop row">
                                    <div class="cell1"></div>
                                    <div class="cell2">
                                        <div class="goodsNumber">{{isUserArtNo && !$app.isNull(k.artNo) ? k.artNo : k.barCode}}</div>
                                    </div>
                                    <div class="cell3"></div>
                                    <div class="cell4"></div>
                                    <div class="cell5"></div>
                                    <div class="cell6"></div>
                                    <div class="cell7"></div>
                                </div>
                                <div class="rowMiddle row">
                                    <div class="cell1"></div>
                                    <div class="cell2">
                                        <div class="goodsName">
                                            <div class="nameText">
                                                <span>{{k.name}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cell3">
                                        <div class="product_num">
                                            <span>x{{k.number}}</span>
                                        </div>
                                    </div>
                                    <div class="cell4">
                                        <div class="salePrice">
                                            <span>{{$app.moneyFixed(k.price)}}</span>
                                        </div>
                                    </div>
                                    <div class="cell5">
                                        <span class="unit">{{k.unitName}}</span>
                                    </div>
                                    <div class="cell6"></div>
                                    <div class="cell7"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="tableControl" v-if="totalPage > 0">
            <div class="pagesWrap">
                <div class="left">
                    <div class="goodsNumber">数量：{{carttingData.buyNumber}}</div>
                    <el-input class="remark" v-if="!noRemark" v-model="remarks" @keyup.native.stop="" type="text" placeholder="备注：请输入订单备注"></el-input>
                    <div class="btnItem" :class="{'disabled': carttingData.productResults.length == 0}" v-permission="{permission: CashierManage.delete_all, fn: clearCarttingList}">
                        <!-- <span>清空F1</span> -->
                        <span>清空</span>
                    </div>
                </div>
                <div class="right" :class="{'isShow': totalPage > 1}">
                    <div class="btnLast btn" :class="{'disabled': carttingCurrentPage === 1}" @click="handlePageLast">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="currentPage">
                        <span>{{carttingCurrentPage +' / '+ totalPage}}</span>
                    </div>
                    <div class="btnNext btn" :class="{'disabled': carttingCurrentPage === totalPage}" @click="handlePageNext">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
    </div>
</template>

<style  lang="scss" scoped>
@import './cartting.scss';
</style>
<script src="./cartting.js"></script>
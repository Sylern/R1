<!--美业购物车-->
<template>
    <div class="carttingMeiye">
        <div class="tableWrap">
            <el-empty v-if="carttingData.productResults.length === 0" description="暂未添加商品"></el-empty>
            <el-scrollbar v-else ref="scrollList" style="width: 100%; height: 100%">
                <div class="cartItem" :class="{ selected: currentPos === index, isPackage: item.isPackage }" v-for="(item, index) in carttingData.productResults" :key="index" @click="handleItemSelected(item, index)">
                    <div class="content">
                        <div class="itemPackage" v-if="item.isPackage">套</div>
                        <div class="dataMain">
                            <div class="rowTop row">
                                <div class="cell1">
                                    <span class="index">{{ index + 1 }}</span>
                                </div>
                                <div class="cell2">
                                    <span>商品</span>
                                </div>
                                <div class="cell3">
                                    <span>数量</span>
                                </div>
                                <div class="cell4">
                                    <span>单价</span>
                                </div>
                                <div class="cell5">
                                    <span>小计</span>
                                </div>
                                <div class="cell6"></div>
                            </div>
                            <div class="rowMiddle row">
                                <div class="cell1"></div>
                                <div class="cell2">
                                    <div class="goodsName">
                                        <div class="topInfo">
                                            <span>{{ item.barCode }}</span>
                                        </div>
                                        <div class="nameText">
                                            <span>{{ item.isNewSpec ? item.productName + '[' + item.sepcs + ']' : item.productName }}</span>
                                        </div>
                                        <div class="subInfo" v-html="handleCartering(item)"></div>
                                    </div>
                                    <div class="flag_kouci" v-if="showkouciFlag(item)">
                                        <div class="img">
                                            <img class="img" src="@/assets/images/cashier/kouci.png" />
                                        </div>
                                        <div class="btnClearKouci" @click.stop="handleClearKouci(index)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="cell3" @click.stop="">
                                    <!-- <div class="btnSubtract" @click.stop="handleSubtract(item,index)">
                                        <span>-</span>
                                    </div> -->
                                    <div class="product_num" v-permission="{permission: CashierManage.key_num, fn: handleNumberChange, param: [index]}">
                                        <span>x{{ item.number }}</span>
                                    </div>
                                    <!-- <div class="btnAdd" @click.stop="handleAdd(item,index)">
                                        <span>+</span>
                                    </div> -->
                                </div>
                                <div class="cell4" @click.stop="">
                                    <div class="dealPrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [index]}">
                                        <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                    </div>
                                </div>
                                <div class="cell5">
                                    <span class="dealMoney">{{ $app.moneyFixed(item.dealMoney) }}</span>
                                </div>
                                <div class="cell6" @click.stop="">
                                    <div class="btnDelete" v-permission="{permission: CashierManage.delete_p, fn: handleDel, param: [index]}">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="rowBottom row">
                                <div class="cell1"></div>
                                <div class="cell2" v-html="handleProductCouponDesc(item)"></div>
                                <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                                <div class="cell6"></div>
                            </div>
                        </div>
                        <div class="subWrap">
                            <div class="subItem" v-for="(data, pos) in item.packageGroups" :key="pos">
                                <div class="subName">
                                    <span>—— {{ data.name }} ——</span>
                                </div>
                                <div v-for="(k, p) in data.products" :key="p">
                                    <div class="rowTop row">
                                        <div class="cell1"></div>
                                        <div class="cell2">
                                            <div class="goodsNumber">{{ k.barCode }}</div>
                                        </div>
                                        <div class="cell3"></div>
                                        <div class="cell4"></div>
                                        <!-- <div class="cell5"></div> -->
                                        <div class="cell6"></div>
                                    </div>
                                    <div class="rowMiddle row">
                                        <div class="cell1"></div>
                                        <div class="cell2">
                                            <div class="goodsName">
                                                <div class="nameText">
                                                    <span>{{ k.name }}</span>
                                                </div>
                                                <div class="subInfo" v-html="handleCarteringSub(k)"></div>
                                            </div>
                                        </div>
                                        <div class="cell3">
                                            <div class="product_num">
                                                <span>x{{ k.number }}</span>
                                            </div>
                                        </div>
                                        <div class="cell4">
                                            <div class="salePrice">
                                                <span>{{ $app.moneyFixed(k.price) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="rowBottom row">
                                        <div class="cell1"></div>
                                        <div class="cell2" v-html="handleProductCouponDesc(k)"></div>
                                        <div class="cell3"></div>
                                        <div class="cell4" v-html="handleProductCouponMoney(k)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 美业-服务人 -->
                        <div class="workerWrap" @click.stop="" v-if="item.multCommissions">
                            <div class="productCommon" v-if="item.productType === 0 && item.multCommissions.length > 0">
                                <!-- 普通商品 -->
                                <div class="salerTitle">
                                    <div class="text">销售人员</div>
                                </div>
                                <div class="listItem"  v-for="(emItem, emIndex) in item.multCommissions[0]" :key="emIndex">
                                    <div class="itemLeft">
                                        <div class="logo">
                                            <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="#8056F7"></cmd-icon>
                                            <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                        </div>
                                        <div class="name">{{ emItem.sv_employee_name }}</div>
                                        <div class="text"></div>
                                    </div>
                                    <div class="itemRight" @click.stop="">
                                        <div class="btnDelete" v-permission="{permission: CashierManage.Select_Salesman, fn: handleServiceDelete, param: [item, emIndex]}">
                                            <i class="el-icon-error"></i>
                                        </div>
                                        <!-- <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                            <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                        </div> -->
                                    </div>
                                </div>
                                <div class="listItem" v-if="item.multCommissions[0].length === 0">
                                    <div class="itemLeft">
                                        <div class="logo"></div>
                                        <div class="name"></div>
                                        <div class="text"></div>
                                    </div>
                                    <div class="itemRight" @click.stop="">
                                        <div class="btnEdit" v-permission="{permission: CashierManage.Select_Salesman, fn: handleServiceShow, param: [index, item.productType]}">
                                            <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="productMeiye" v-if="item.productType === 1 && item.multCommissions.length > 0">
                                <!-- 服务产品 -->
                                <div class="workerWrapLeft">
                                    <template v-for="(wsItem, wdIndex) in item.multCommissions">
                                        <div class="wsItem" v-if="wsItem.length > 0" :key="wdIndex">
                                            <div class="wsFlag">第{{ workerTextList[wdIndex] }}工位</div>
                                            <div class="wsList">
                                                <div class="listItem" v-for="(emItem, emIndex) in wsItem" :key="emIndex" @click="emItem.isAppoint = !emItem.isAppoint">
                                                    <div class="indexBg" :class="emItem.selectedType" :style="{ width: emItem.percent + '%' }"></div>
                                                    <div class="itemContent">
                                                        <div class="infoLeft">
                                                            <div class="itemNumer">
                                                                <span>{{ emItem.sv_employee_number }}</span>
                                                                <span class="appoint" v-if="emItem.isAppoint">指定</span>
                                                            </div>
                                                            <div class="name">{{ emItem.sv_employee_name }}</div>
                                                        </div>
                                                        <div class="infoRight">{{ emItem.percent }}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="workerWrapRight" @click.stop="">
                                    <div class="btnEdit" v-permission="{permission: CashierManage.Select_Salesman, fn: handleWorkstationShow, param: [index, item.productType]}">
                                        <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="tableControl">
            <div class="totalInfoWrap" :class="{ isShow: totalPage > 0 }">
                <span class="goodsTotalNumber">数量：
                    <label>{{ carttingData.buyNumber }}</label>
                    <span class="discount highlight" v-if="carttingData.couponMoney > 0">优惠：{{ $app.moneyFixed(carttingData.couponMoney) }}</span>
                </span>
                <div class="totalDealMoney">
                    <span>合计：</span>
                    <span class="highlight">¥</span>
                    <span class="totalMoney highlight">{{ $app.moneyFixed(carttingData.dealMoney) }}</span>
                </div>
            </div>
        </div>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeightStatus" :dataItem="goodsWeightItem"></goods-weight>
        <!-- 套餐 -->
        <goods-package :visible.sync="goodsPackageStatus" :goodsId="goodsPackageItem.id" @handleSure="returnGoodsPackage"></goods-package>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :improtMoney="improtMoney" :discountMoney="improtMoney" @submitMoney="moneyEdit"></price-change>
        <!-- 设置服务员 -->
        <servicer-setting :visible.sync="servicerSettingStatus" :isSingle="isServicerSingle" :carttingPos="currentPos" @handleServicerSetting="handleServicerSetting"></servicer-setting>
        <!-- 多工位设置服务员 -->
        <servicer-workstation :visible.sync="servicerWorkstationStatus" :carttingPos="currentPos" @handleWorkstation="handleWorkstation"></servicer-workstation>
    </div>
</template>

<style lang="scss" scoped>
@import './carttingMeiye.scss';
</style>
<script src="./carttingMeiye.js"></script>

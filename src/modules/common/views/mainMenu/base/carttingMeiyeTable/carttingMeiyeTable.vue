<!--棋牌购物车及订单-->
<template>
    <div class="carttingMeiyeTable">
        <div class="tableWrap">
            <el-scrollbar ref="scrollList" style="width: 100%; height: 100%">
                <div class="dataList">
                    <div class="cartItem" :class="{ isPackage: item.isPackage }" v-for="(item, index) in carttingList" :key="index">
                        <div class="content" :class="{ selected: currentPos === index }" @click="handleItemSelcet(index)">
                            <div class="itemPackage" v-if="item.isPackage">套</div>
                            <div class="dataMain isOrderList" v-if="isOrderList">
                                <div class="itemStatus">
                                    <!-- <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/tui.png'" alt="" /> -->
                                    <img class="img" v-if="item.sv_return_status === 2" :src="$store.state.base.frontImgBase + '/images/cashier/tui.png'" alt="" />
                                    <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 1" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" alt="" />
                                    <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 2" :src="$store.state.base.frontImgBase + '/images/cashier/qi.png'" alt="" />
                                </div>
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
                                        </div>
                                    </div>
                                    <div class="cell3" @click.stop="">
                                        <!-- <div class="btnSubtract" @click.stop="handleSubtract(item,index)">
                                            <span>-</span>
                                        </div> -->
                                        <div class="product_num">
                                            <span>x{{ item.number }}</span>
                                        </div>
                                        <!-- <div class="btnAdd" @click.stop="handleAdd(item,index)">
                                            <span>+</span>
                                        </div> -->
                                    </div>
                                    <div class="cell4" @click.stop="">
                                        <div class="dealPrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [item, index]}">
                                            <span>{{$app.moneyFixed(item.dealPrice)}}</span>
                                        </div>
                                    </div>
                                    <div class="cell5">
                                        <span class="dealMoney">{{ $app.moneyFixed(item.dealMoney) }}</span>
                                    </div>
                                    <div class="cell6" @click.stop="">
                                        <!-- <div class="btnDelete" v-permission="{permission: CashierManage.delete_p, fn: handleDel, param: [index]}">
                                            <i class="el-icon-delete"></i>
                                        </div> -->
                                        <div class="btnIcon" v-if="item.sv_return_status !== 2" v-permission="{permission: CashierManage.openCateringTable_Return_food, fn: handleOrderReturnBtn, param: [index]}">
                                            <cmd-icon type="icon-tuicai" size="36" color="#8056F7"></cmd-icon>
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
                            <div class="dataMain" v-else>
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
                                        <div class="dealPrice" v-permission="{permission: CashierManage.key_change_price, fn: handlePriceChange, param: [item, index]}">
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
                            <div class="workerWrap" @click.stop="" v-if="item.multCommissions && item.sv_return_status !== 2">
                                <div class="productCommon" v-if="item.productType === 0 && item.multCommissions.length > 0">
                                    <!-- 普通商品 -->
                                    <div class="salerTitle">
                                        <div class="text">销售人员</div>
                                    </div>
                                    <div class="listWrap">
                                        <div class="listItem" v-for="(emItem, emIndex) in item.multCommissions[0]" :key="emIndex">
                                            <div class="itemLeft">
                                                <div class="logo">
                                                    <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="#8056F7"></cmd-icon>
                                                    <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                                </div>
                                                <div class="name">{{ emItem.sv_employee_name }}</div>
                                            </div>
                                            <div class="itemRight">
                                                <div class="btnDelete" @click.stop="handleServiceDelete(index, item, emIndex)">
                                                    <i class="el-icon-error"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="item.multCommissions[0].length < 4">
                                            <div class="listItem">
                                                <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                                    <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="productMeiye" v-if="item.productType === 1 && item.multCommissions.length > 0">
                                    <!-- 服务产品 -->
                                    <template v-if="item.isNewSpec">
                                        <div class="productService">
                                            <!-- 服务产品 -->
                                            <div class="wsheader">
                                                <div class="td1">服务人员</div>
                                                <div class="td2">状态</div>
                                                <div class="td3">上钟</div>
                                                <div class="td4">下钟</div>
                                            </div>
                                            <div class="wsItem" v-for="(emItem, emIndex) in item.multCommissions[0]" :key="emIndex">
                                                <div class="td1">
                                                    <div class="logo">
                                                        <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="#8056F7"></cmd-icon>
                                                        <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                                    </div>
                                                    <div class="name">{{ emItem.sv_employee_name }}</div>
                                                    <div class="text"></div>
                                                    <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                                        <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                                    </div>
                                                </div>
                                                <div class="td2">
                                                    <div class="status" @click.stop="">
                                                        <div class="statusText" :class="{ isOnServer: emItem.status !== 0 }">{{ emItem.status === 0 ? '等待' : emItem.status === 1 ? '上钟' : '下钟'}}</div>
                                                        <el-popconfirm class="span" @confirm="handleUpdateStatus(emItem, index, item)" :title="'项目是否'+ (emItem.status === 0 ? '上钟' : '下钟')">
                                                            <div slot="reference" class="statusBtn" v-if="emItem.status !== 2">{{ emItem.status === 0 ? '上钟' : '下钟'}}</div>
                                                        </el-popconfirm>
                                                    </div>
                                                </div>
                                                <div class="td3">{{ emItem.start_time }}</div>
                                                <div class="td4">{{ emItem.end_time }}</div>
                                            </div>
                                            <div class="wsItemEmpty" v-if="item.multCommissions[0].length === 0">
                                                <div class="emptyBtnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                                    <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                                    <div class="emptuText">选择服务人</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="salerTitle">
                                            <div class="text">服务人员</div>
                                        </div>
                                        <div class="listContent">
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
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <!-- 已下单菜品点击弹窗 -->
        <div class="orderItemHandle" v-if="orderItemHandleStatus">
            <dc-dialog width="360" height="140" @close="closeOrderItemHandle">
                <div class="contentWrap">
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
        <!-- 设置服务员 -->
        <servicer-setting :visible.sync="servicerSettingStatus" :isSingle="isServicerSingle" :isOrderList="isOrderList" :employeeList="popCurrentEmployee" :carttingPos="currentPos" @handleServicerSetting="handleServicerSetting"></servicer-setting>
        <!-- 设置服务员 -->
        <servicer-workstation :visible.sync="servicerWorkstationStatus" :carttingPos="currentPos" :isOrderList="isOrderList" :orderData="orderData" @handleWorkstation="handleWorkstationSubmit"></servicer-workstation>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingMeiyeTable.scss';
</style>
<script src="./carttingMeiyeTable.js"></script>
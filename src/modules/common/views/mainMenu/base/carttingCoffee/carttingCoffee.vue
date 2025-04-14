<!--棋牌购物车及订单-->
<template>
    <div class="carttingCoffee">
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
            </div>
            <div class="tbody">
                <el-scrollbar ref="scrollList" style="width:100%; height:100%; overflow:hidden;">
                    <div class="orderItem" :class="{'isPackage': item.isPackage, 'selected': currentPos === index}" v-for="(item,index) in carttingList" :key="index" @click="handleOrderItemSelected(item, index)">
                        <div class="itemPackage" v-if="item.isPackage">套</div>
                        <div class="itemGive" v-if="item.dealMoney === 0 && item.sv_return_status !== 2 && !item.isAssistant">
                            <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/giving.png'" alt="" />
                        </div>
                        <div class="dataMain" v-if="isOrderList">
                            <div class="itemStatus">
                                <!-- <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/tui.png'" alt="" /> -->
                                <img class="img" v-if="item.sv_return_status === 2" :src="$store.state.base.frontImgBase + '/images/cashier/tui.png'" alt="" />
                                <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 1" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" alt="" />
                                <img class="img" v-if="item.sv_return_status !== 2 && item.sv_is_rouse === 2" :src="$store.state.base.frontImgBase + '/images/cashier/qi.png'" alt="" />
                            </div>
                            <div class="assistantInfo" v-if="item.billabletime_code">
                                <div class="cell1">{{index + 1}}</div>
                                <div class="infoData" v-if="item.isAssistant">
                                    <div class="employeeInfo" v-if="item.multCommissions[0][0]">
                                        <span class="text">{{ item.multCommissions[0][0].sv_employee_number }}</span>
                                        <span class="text">{{ item.multCommissions[0][0].sv_employee_name }}</span>
                                    </div>
                                    <div class="assistantName">
                                        <span class="text1">{{ item.productName }}</span>
                                        <template v-if="item.billable">
                                            <span>开始时间：</span>
                                            <span class="text2">{{ item.billable.startTime.substring(5, item.billable.startTime.length - 3) }}</span>
                                            <span class="statusFlag">{{ item.billable.statusString }}</span>
                                        </template>
                                    </div>
                                </div>
                                <div class="cell4" v-if="item.billable">
                                    <div class="salePrice">
                                        <span>{{$app.moneyFixed(item.billable.totalMoney)}}</span>
                                    </div>
                                    <div class="moreInfo">
                                        <el-tooltip effect="dark" placement="right">
                                            <div slot="content">
                                                <div class="tips" v-for="(data, pos) in item.billable.calcLogs" :key="pos">{{ (pos + 1) +'：'+ data }}</div>
                                            </div>
                                            <span>{{ item.billable.typeString }}<i class="el-icon-question"></i></span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                            <template v-else>
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
                                    <div class="cell3"></div>
                                    <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                                </div>
                            </template>
                        </div>
                        <div class="dataMain" v-else>
                            <div class="assistantInfo" v-if="item.isAssistant">
                                <div class="cell1">{{index + 1}}</div>
                                <!-- <div class="emPhoto">
                                    <cmd-icon v-if="$app.isNull(item.attachData.sv_employee_photo)" type="icon-huiyuan1" size="48" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                    <img class="img" v-else :src="imgBase + item.attachData.sv_employee_photo" />
                                </div> -->
                                <div class="infoData" @click.stop="">
                                    <div class="employeeInfo">
                                        <span class="text">{{ item.attachData.sv_employee_number }}</span>
                                        <span class="text">{{ item.attachData.sv_employee_name }}</span>
                                    </div>
                                    <div class="assistantName">
                                        <span>{{ item.attachData.sv_p_name }}</span>
                                    </div>
                                    <div class="assistantDel" v-permission="{permission: CashierManage.delete_p, fn: handleDel, param: [index]}">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </div>
                            <template v-else>
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
                                    <div class="cell3"></div>
                                    <div class="cell4" v-html="handleProductCouponMoney(item)"></div>
                                </div>
                            </template>
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
                        <!-- 服务人 -->
                        <template v-if="!isOrderBack">
                            <div class="workerWrap" @click.stop="" v-if="item.multCommissions">
                                <div class="productCommon" v-if="item.productType === 0 && item.multCommissions.length > 0">
                                    <!-- 普通商品 -->
                                    <div class="salerTitle">
                                        <div class="text">销售人员</div>
                                        <div class="btnEdit" v-if="item.multCommissions[0].length === 0" @click.stop="handleServiceShow(index, item.productType)">
                                            <cmd-icon class="icon-bianji2" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                                        </div>
                                    </div>
                                    <div class="listWrap" v-if="item.multCommissions[0].length < 4 && item.multCommissions[0].length > 0">
                                        <div class="listItem" v-for="(emItem, emIndex) in item.multCommissions[0]" :key="emIndex">
                                            <div class="itemLeft">
                                                <div class="logo">
                                                    <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                                    <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                                </div>
                                                <div class="name">{{ emItem.sv_employee_name }}</div>
                                                <div class="text"></div>
                                            </div>
                                            <div class="itemRight">
                                                <div class="btnDelete" @click.stop="handleServiceDelete(index, item, emIndex)">
                                                    <i class="el-icon-error"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="item.multCommissions[0].length < 4 && item.multCommissions[0].length > 0">
                                            <div class="listItem">
                                                <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                                    <cmd-icon class="icon-bianji2" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="productService" v-if="item.productType === 1 && item.multCommissions.length > 0">
                                    <!-- 服务产品 -->
                                    <div class="wsheader">
                                        <div class="td1">服务人员</div>
                                        <div class="td2">状态</div>
                                        <div class="td3">上钟</div>
                                        <div class="td4">下钟</div>
                                    </div>
                                    <template v-for="(emItem, emIndex) in item.multCommissions[0]">
                                        <div class="wsItem" :key="emIndex">
                                            <div class="td1">
                                                <div class="logo">
                                                    <cmd-icon v-if="$app.isNull(emItem.sv_employee_photo)" type="icon-huiyuan1" size="32" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                                    <img class="img" v-else :src="imgBase + emItem.sv_employee_photo" />
                                                </div>
                                                <div class="name">{{ emItem.sv_employee_name }}</div>
                                                <div class="text"></div>
                                                <div class="btnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                                    <cmd-icon class="icon-bianji2" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                                                </div>
                                            </div>
                                            <div class="td2">
                                                <div class="status">
                                                    <div class="statusText" :class="{ isOnServer: emItem.status !== 0 }">{{ emItem.status === 0 ? '等待' : emItem.status === 1 ? '上钟' : '下钟'}}</div>
                                                    <el-popconfirm class="span" @confirm="handleUpdateStatus(emItem, index, item)" :title="'项目是否'+ (emItem.status === 0 ? '上钟' : '下钟')">
                                                        <div slot="reference" class="statusBtn" v-if="emItem.status !== 2">{{ emItem.status === 0 ? '上钟' : '下钟'}}</div>
                                                    </el-popconfirm>
                                                </div>
                                            </div>
                                            <div class="td3">{{ emItem.start_time }}</div>
                                            <div class="td4">{{ emItem.end_time }}</div>
                                        </div>
                                    </template>
                                    <div class="wsItemEmpty" v-if="item.multCommissions[0].length === 0">
                                        <div class="emptyBtnEdit" @click.stop="handleServiceShow(index, item.productType)">
                                            <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                            <div class="emptuText">选择服务人</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </el-scrollbar>
            </div>
        </div>

        <!-- 已下单菜品点击弹窗 -->
        <div class="orderItemHandle" v-if="orderItemHandleStatus">
            <dc-dialog width="360" height="140" @close="closeOrderItemHandle">
                {{ void (orderItem = orderData.productResults[currentPos]) }}
                <div class="contentWrap">
                    <div class="btnItem" v-if="orderItem.isAssistant" @click="orderItemChangeEmployee">
                        <div class="btnIcon">
                            <cmd-icon type="icon-huanren" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">换人</div>
                    </div>
                    <div class="btnItem" v-if="!orderItem.isAssistant" v-permission="{permission: CashierManage.complimentary_food, fn: orderItemHandleEvent, param: [1]}">
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
                    <div class="btnItem" v-if="orderItem.isAssistant" @click="orderItemRemark">
                        <div class="btnIcon">
                            <cmd-icon type="icon-biaoqiandayin" size="32" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">备注</div>
                    </div>
                    <div class="btnItem" v-if="!orderItem.isAssistant">
                        <div class="btnIcon" v-permission="{permission: CashierManage.key_change_price1, fn: orderItemHandleEvent, param: [3]}">
                            <cmd-icon type="icon-gaijia" size="36" color="#333333"></cmd-icon>
                        </div>
                        <div class="BtnText">改价</div>
                    </div>
                </div>
            </dc-dialog>
        </div>
        <!-- 已下单菜品点击弹窗 -->
        <div class="orderItemChangeEmployee" v-if="changeEmployeeStatus">
            <dc-dialog width="360" height="500" @close="changeEmployeeStatus = false">
                {{ void (orderItem = orderData.productResults[currentPos]) }}
                <div class="contentWrap">
                    <div class="groupName">{{ groupDataItem.sv_grouping_name }}</div>
                    <div class="listWrap">
                        <el-scrollbar ref="emListRef" style="width: 100%; height: 100%">
                            <div class="employeeList">
                                <div class="employeeItem" v-for="(item, index) in groupDataItem.e_list" :key="pos + index" @click="handleEmployee(item)">
                                    <div class="employeeImg">
                                        <!-- <img :src="sv_employee_photo" /> -->
                                        <cmd-icon v-if="$app.isNull(item.sv_employee_photo)" type="icon-huiyuan1" size="150" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                        <img class="img" v-else :src="imgBase + item.sv_employee_photo" />
                                    </div>
                                    <div class="itemInfo">
                                        <div class="itemName">{{ item.sv_employee_name }}</div>
                                        <div class="itemNum">工号：{{ item.sv_employee_number }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="noData" v-if="groupDataItem.e_list.length === 0">
                                <span>{{ groupDataItem.sv_grouping_name }} 岗位，暂无其他助教</span>
                            </div>
                        </el-scrollbar>
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
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingCoffee.scss';
</style>
<script src="./carttingCoffee.js"></script>
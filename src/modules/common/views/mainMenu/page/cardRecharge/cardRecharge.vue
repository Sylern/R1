<template>
    <div class="cardRecharge" ref="cardRecharge">
        <div class="cardRechargeLeft">
            <div class="leftTop">
                <div class="saleNumber">
                    <div class="inputBox">
                        <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.enter.native="handleSearch" clearable placeholder="请输入关键词搜索"></el-input>
                    </div>
                </div>
                <div class="members">
                    <div class="unSelected" v-if="!memberSelected">
                        <div class="btnItem btnMemberSelect" v-permission="{permission: CashierManage.Select_Members, fn: showMemberList}">
                            <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                            <span class="text">选择会员</span>
                        </div>
                        <div class="btnItem btnMemberAdd" v-permission="{permission: CashierManage.Add_Members, fn: showMemberAdd}">
                            <cmd-icon type="icon-jia" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                            <span class="text">新增会员</span>
                        </div>
                    </div>
                    <div class="content" v-else>
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <img class="img" v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="memberInfo.sv_mr_headimg.indexOf('http') > -1 ? memberInfo.sv_mr_headimg : imgBase + memberInfo.sv_mr_headimg" width="100%" />
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                </div>
                                <div class="nameWrap">
                                    <div class="nametext">
                                        <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                    </div>
                                    <div class="telephone">{{ memberInfo.sv_mr_mobile }}</div>
                                </div>
                            </div>
                            <div class="right" @click.stop="">
                                <div class="btn btnClear" @click="showMemberList">选择</div>
                                <!-- <div class="btn btnRecharge" @click="showMemberRecharge">充值</div> -->
                                <div class="btn btnRecharge" @click="handleClearMember">清除</div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                            </div>
                            <div class="item">
                                <div class="key">累计消费</div>
                                <div class="value">{{ memberInfo.sv_mw_sumamount }}</div>
                            </div>
                            <div class="item">
                                <div class="key">生日</div>
                                <div class="value">{{ memberBirthday }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="leftContent">
                <!-- 入场卡 -->
                <template v-if="currentMenuKey === 'admissionCards'">
                    <div class="admissionTable" :class="{ memberSelected: memberSelected }">
                        <div class="tableBox">
                            <div class="header">
                                <div class="cell1">
                                    <span>序号</span>
                                </div>
                                <div class="cell2">
                                    <span>购买课程</span>
                                </div>
                                <div class="cell3">
                                    <span>收费标准</span>
                                </div>
                                <div class="cell4">
                                    <span>单价</span>
                                </div>
                                <div class="cell5">
                                    <span>购买数量</span>
                                </div>
                                <div class="cell6">
                                    <span>赠送</span>
                                </div>
                                <div class="cell7">
                                    <span>小计</span>
                                </div>
                            </div>
                            <div class="tbody">
                                <el-scrollbar ref="scrollList" style="width:100%; height:100%; overflow: hidden;">
                                    <div class="coursePackageContent" v-if="courseData.length > 0">
                                        <div class="admissionContentItem" v-for="(item, index) in courseData" :key="index">
                                            <div class="cell1">
                                                <span>{{ index + 1 }}</span>
                                            </div>
                                            <div class="cell2">
                                                <div class="goodsName">
                                                    <div class="nameText">
                                                        <span>{{ item.sv_p_name }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="cell3">
                                                <div class="salePriceList">
                                                    <el-select v-model="item.salePos" @change="handleSalePos(item)">
                                                        <el-option v-for="(saleItem, pos) in item.list" :key="pos" :value="saleItem.value" :label="saleItem.label"></el-option>
                                                    </el-select>
                                                </div>
                                            </div>
                                            <div class="cell4">
                                                <span>{{ item.unitprice }}</span>
                                            </div>
                                            <div class="cell5" @click.stop="">
                                                <div class="product_num">
                                                    <span>{{ item.number }}</span>
                                                </div>
                                            </div>
                                            <div class="cell6">
                                                <span>{{ item.timedetail[item.salePos].sv_give_class_hour }}</span>
                                            </div>
                                            <div class="cell7">
                                                <div class="priceTotal">
                                                    <span>{{ item.priceTotal }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="coursePackageTag">入场卡</div>
                                        <div class="coursePackageValidity" v-if="extendInfo.courseDataType === 3">
                                            <div class="courseUseInfo">
                                                <el-radio-group v-removeAria v-model="extendInfo.open_card_way" @change="handleChangeOpenCard">
                                                    <el-radio v-for="(data, pos) in extendInfo.sv_open_card_way_list" :label="data.value" :key="pos">{{ data.label }}</el-radio>
                                                </el-radio-group>
                                                <div class="effectiveTime" v-if="extendInfo.open_card_way !== 300">有效期：{{ extendInfo.sv_effective_time }}</div>
                                                <div class="effectiveTime" v-else>有效期：
                                                    <el-date-picker v-model="extendInfo.sv_effective_time_start" type="datetime" :clearable="false" placeholder="开始时间" :picker-options="{
                                                            disabledDate(time) {
                                                                return time.getTime() < Date.now();
                                                            }
                                                        }" @change="handleChangeOpenCard"></el-date-picker>
                                                    <span>至 {{ extendInfo.sv_effective_time_end }}</span>
                                                </div>
                                            </div>
                                            <div class="btnDelete" @click="handleDelPackage">
                                                <i class="el-icon-delete"></i>
                                            </div>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="admissionControl">
                            <div class="left">
                                <el-date-picker v-model="orderTime" type="datetime" :clearable="false" placeholder="经办时间" :picker-options="{ disabledDate(time) { return time.getTime() > Date.now() } }"></el-date-picker>
                                <div class="item" @click="handleOrderRemark">
                                    <i class="el-icon-collection"></i>
                                    <span>备注</span>
                                </div>
                                <div class="item" v-if="extendInfo.sv_number_people > 0" @click="handleMemberGroup">
                                    <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                                    <span v-if="extendInfo.sv_affiliation_m_id.length === 0">选择卡成员({{ extendInfo.sv_number_people }}人)</span>
                                    <span v-else>{{ extendInfo.sv_affiliation_m_id.map(e => e.name).join('、') }}</span>
                                </div>
                            </div>
                            <div class="right">
                                <div class="item" @click="pointChangeStatus = true">
                                    <span>赠送积分</span>
                                    <span class="value">{{ orderIntegral }}</span>
                                    <i class="el-icon-edit"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="tableWrap">
                        <div class="header">
                            <div class="cell1">
                                <span>序号</span>
                            </div>
                            <div class="cell2">
                                <span>会员卡</span>
                            </div>
                            <div class="cell3">
                                <span>数量</span>
                            </div>
                            <div class="cell4">
                                <span>赠送</span>
                            </div>
                            <div class="cell5">
                                <span>有效期</span>
                            </div>
                            <div class="cell6">
                                <span>金额</span>
                            </div>
                        </div>
                        <div class="tbody">
                            <el-scrollbar ref="scrollList" style="width: 100%; height: 100%; overflow: hidden">
                                <div class="cartItem" :class="{ selected: carttingSelectedPos === index }" v-for="(item, index) in carttingData.productResults" :key="index">
                                    <div class="cell1">
                                        <span>{{ index + 1 }}</span>
                                    </div>
                                    <div class="cell2 nameWrap">
                                        <div class="goodsBarcode">{{ item.barCode }}</div>
                                        <div class="goodsName">
                                            <div class="nameText">
                                                <span>{{ item.productName }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cell3" @click.stop="">
                                        <div class="btnSubtract" v-show="cardType !== 'storeCards'" @click="handleSubtract(item, index)">
                                            <span>-</span>
                                        </div>
                                        <div class="product_num" :class="{ showPop: cardType !== 'storeCards' }" @click="handleNumber(index, 'number')">
                                            <span>{{ item.number }}</span>
                                        </div>
                                        <div class="btnAdd" v-show="cardType !== 'storeCards'" @click="handleAdd(item, index)">
                                            <span>+</span>
                                        </div>
                                    </div>
                                    <div class="cell4" @click.stop="">
                                        <div class="btnSubtract" v-show="cardType !== 'storeCards'" @click="handleSubtract_give(item, index)">
                                            <span>-</span>
                                        </div>
                                        <div class="product_num" :class="{ showPop: cardType !== 'storeCards' }" @click="handleNumber(index, 'give')">
                                            <span>{{ item.giveNumber }}</span>
                                            <span v-if="cardType === 'storeCards'">元</span>
                                        </div>
                                        <div class="btnAdd" v-show="cardType !== 'storeCards'" @click="handleAdd_give(item, index)">
                                            <span>+</span>
                                        </div>
                                    </div>
                                    <div class="cell5" v-if="cardType !== 'goods'">
                                        <span>{{ item.validity_date }}</span>
                                    </div>
                                    <div class="cell5" v-else>
                                        <el-input v-model.trim="item.sv_eff_range" v-if="item.rangeShow" @keyup.native="handleKeyUp(item)" @change="handleEff(item, index)" class="nine_input" :disabled="cardType !== 'goods'"></el-input>
                                        <el-select v-model.trim="item.rangeShowType" @change="handleEffType(item.rangeShowType, index)" class="six_select" :disabled="cardType !== 'goods'">
                                            <el-option label="天" :value="1">天</el-option>
                                            <el-option label="月" :value="2">月</el-option>
                                            <el-option label="年" :value="3">年</el-option>
                                            <el-option label="1个月" :value="4">1个月</el-option>
                                            <el-option label="3个月" :value="5">3个月</el-option>
                                            <el-option label="6个月" :value="6">6个月</el-option>
                                            <el-option label="1年" :value="7">1年</el-option>
                                            <el-tooltip effect="dark" placement="left" content="长期，则有效期10年" class="etr_tooltip">
                                                <el-option label="长期" :value="8">长期</el-option>
                                            </el-tooltip>
                                        </el-select>
                                    </div>
                                    <div class="cell6">
                                        <div class="subTotal" :class="{ showPop: cardType !== 'storeCards' }" @click="showCashierPriceChange(index)">{{ $app.moneyFixed(item.dealMoney) }}</div>
                                        <div class="btnDelete" @click="handleDel(index)">
                                            <i class="el-icon-delete"></i>
                                        </div>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                    <div class="tableControl" v-if="goodsTotalInfo.buyNumber > 0">
                        <div class="goodsNumber">数量：{{ goodsTotalInfo.buyNumber }}</div>
                        <div class="btnClear" :class="{ disabled: goodsTotalInfo.buyNumber == 0 }" @click="clearCarttingList">
                            <!-- <span>清空F1</span> -->
                            <span>清空</span>
                        </div>
                        <el-input class="remark" v-model="remarks" @keyup.native.stop="" type="text" placeholder="备注：请输入订单备注"></el-input>
                    </div>
                </template>
            </div>
            <div class="leftBottom">
                <div class="statisticsWrap">
                    <span>总计：</span>
                    <span class="highlight">¥</span>
                    <span class="totalMoney highlight">{{ currentMenuKey === 'admissionCards' ? totalInfo.money : $app.moneyFixed(goodsTotalInfo.totalMoney) }}</span>
                    <i class="moneyEdit el-icon-edit-outline" v-if="cardType === 'packages'" @click="showCheckinPriceChange"></i>
                </div>
                <div class="btnWrap">
                    <div class="btnPost" v-if="hasStoreCard" @click="showStoreCardDeposit">
                        <span>储值卡押金</span>
                    </div>
                    <div class="btnPost" @click="showMemberRecharge">
                        <span>会员充值</span>
                    </div>
                    <div class="btnPost" v-if="hasStoreCard" @click="showDepositReturn">
                        <span>储值卡退卡</span>
                    </div>
                    <div class="btnCash" @click="showCheckin">
                        <span>收 款</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardRechargeRight" ref="cardRechargeRight">
            <div class="menuList">
                <div class="menuItem" :class="{ selected: currentMenuKey === item.key }" v-for="(item, index) in menuList" :key="index" @click="handleMenuItem(item)">{{ item.name}}</div>
            </div>
            <div class="cardContent" v-if="currentMenuKey === 'storeCards'">
                <el-scrollbar class="cardsScrollbar">
                    <div class="listWrap">
                        <div class="card_item_wrap add_card" @click="handleToAddStoreCard">
                            <div class="main">
                                <div class="card_img_wrap">
                                    <cmd-icon type="icon-huiyuanka" size="45" color="#EEF5F2"></cmd-icon>
                                </div>
                                <div class="text_btn_wrap">
                                    <el-button type="text">+ 新增储值卡</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="card_item_wrap" v-for="item in storeCardList" :key="item.product_id" @click="addCart($event, item)">
                            <div class="ciw_content">
                                <div class="main" :style="item.sv_background_image ? 'background:url(//res.decerp.cc'+ item.sv_background_image+') center / cover no-repeat;':''">
                                    <div class="unUpload" v-if="item.sv_p_status === -3">
                                        <img class="img" src="@/assets/images/cashier/unUpload.png" />
                                    </div>
                                    <div class="card_title">
                                        <div class="card_name">{{item.sv_card_name}}</div>
                                    </div>
                                    <div class="card_price">{{item.sv_card_money}}<span class="unit">元</span></div>
                                    <div class="present">
                                        <span v-show="item.sv_card_present_money">赠送：{{item.sv_card_present_money}}元</span>
                                    </div>
                                    <div class="card_wrap_bottom">
                                        <div class="time">有效期：{{ item.sv_card_date }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <!-- 入场卡 -->
            <div class="cardContent" v-if="currentMenuKey === 'admissionCards'">
                <el-scrollbar class="cardsScrollbar">
                    <div class="listWrap">
                        <div class="card_item_wrap add_card" @click="handleToAddAdmissionCard">
                            <div class="main">
                                <div class="card_img_wrap">
                                    <cmd-icon type="icon-huiyuanka" size="45" color="#EEF5F2"></cmd-icon>
                                </div>
                                <div class="text_btn_wrap">
                                    <el-button type="text">+ 新增入场卡</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="card_item_wrap" v-for="item in admissionList" :key="item.product_id" @click="addAdmissionCart($event, item)">
                            <div class="ciw_content">
                                <div class="main" :style="item.sv_p_image ? 'background:url(//res.decerp.cc'+ item.sv_p_image+') center / cover no-repeat;':''">
                                    <div class="unUpload" v-if="item.sv_p_status === -3">
                                        <img class="img" src="@/assets/images/cashier/unUpload.png" />
                                    </div>
                                    <div class="card_title">
                                        <div class="card_name">{{item.sv_p_name}}</div>
                                    </div>
                                    <div class="card_price">{{item.sv_p_unitprice}}<span class="unit">元</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="cardContent" v-if="currentMenuKey === 'packages'">
                <el-scrollbar class="cardsScrollbar">
                    <div class="listWrap">
                        <div class="card_item_wrap add_card" @click="handleToAddCard(item)">
                            <div class="main">
                                <div class="card_img_wrap">
                                    <cmd-icon type="icon-huiyuanka" size="45" color="#EEF5F2"></cmd-icon>
                                </div>
                                <div class="text_btn_wrap">
                                    <el-button type="text">+ 新增次卡套餐</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="card_item_wrap" v-for="item in cardsList" :key="item.product_id" @click="getCardSetmealInfo(item)">
                            <div class="ciw_content">
                                <div class="main" :style="item.sv_p_images2 ? 'background:url(//res.decerp.cc' + item.sv_p_images2 + ') center / cover no-repeat;' : ''">
                                    <div class="unUpload" v-if="item.sv_p_status === -3">
                                        <img class="img" src="@/assets/images/cashier/unUpload.png" />
                                    </div>
                                    <div class="card_title">
                                        <div class="card_name">{{ item.sv_p_name }}</div>
                                    </div>
                                    <div class="stock">库存：{{ item.sv_p_storage }}</div>
                                    <div class="card_price">{{ item.sv_p_unitprice }}<span class="unit">元</span></div>
                                    <div class="card_wrap_bottom">
                                        <div class="time">时间：{{ item.sv_dis_startdate ? item.sv_dis_startdate.substr(0, 10) : '' }}至{{ item.sv_dis_enddate ? item.sv_dis_enddate.substr(0, 10) : '' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="goodsContent" v-if="currentMenuKey === 'goods'" ref="goodsContent">
                <div class="classification" ref="classification">
                    <div class="c_one">
                        <el-scrollbar class="el_list">
                            <div class="item rowFirst" :class="{ selected: firstSelected == 0 }" @click="handleFirstCategoryAll">全部</div>
                            <div class="item" :class="{ rowFirst: (index + 1) % 6 == 0, selected: firstSelected == index + 1 }" v-for="(item, index) in firstCategory" :key="index" @click="handleFirstCategory(item, index + 1)">{{ item.sv_pc_name }}</div>
                            <div class="item add" :class="{ rowFirst: (firstCategory.length + 1) % 6 == 0 }" @click="showCategoryFirst">+</div>
                        </el-scrollbar>
                    </div>
                    <div class="c_two" v-if="firstSelected != 0">
                        <el-scrollbar class="el_list">
                            <div class="item rowFirst" :class="{ selected: secondSelected == 0 }" @click="handleSecondCategoryAll">全部</div>
                            <div class="item" :class="{ rowFirst: (index + 1) % 6 == 0, selected: secondSelected == index + 1 }" v-for="(item, index) in secondCategory" :key="index" @click="handleSecondCategory(item, index + 1)">{{ item.sv_psc_name }}</div>
                            <div class="item add" :class="{ rowFirst: (secondCategory.length + 1) % 6 == 0 }" @click="showCategorySecond">+</div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="goodsWrap">
                    <div class="goodsList">
                        <el-scrollbar class="listWrap">
                            <div class="itemWrap">
                                <goodsItem ref="goodsItem" v-for="(item, index) in goodsList" :index="index" :goodsItem="item" :key="index" @addCart="addCart" />
                            </div>
                        </el-scrollbar>
                        <div class="btnWrap">
                            <div class="btnAdd btn" v-permission="{ permission: CashierManage.Add_Product, fn: showGoodsAdd }">
                                <span>+新增商品</span>
                            </div>
                            <div class="btnLast btn" v-if="goodsTotal > 0" :class="{ disabled: query.pageIndex === 1 }" @click="pageLast">
                                <i class="el-icon-arrow-left"></i>
                            </div>
                            <div class="pages" v-if="goodsTotal > 0">{{ query.pageIndex + '/' + goodsTotal }}</div>
                            <div class="btnNext btn" v-if="goodsTotal > 0" :class="{ disabled: query.pageIndex === goodsTotal }" @click="pageNext">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="ball" :style="ballAnimation">
                <img class="img" v-if="animationImg" :src="animationImg" style="width: 100%; height: 100%" />
                <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/cashier/noGoodsImg.png'" />
            </div>
        </div>
        <!-- 结算弹窗 -->
        <dc-dialog v-if="checkinStatus" width="9.8" height="7.4" title="订单结算" @close="closeCheckin" class="checkin">
            <div class="contentWrap" ref="checkin">
                <div class="topInfo">
                    <div class="right">
                        <div class="btn" @click.stop="showGuiderSelect">
                            <span>选择导购员</span>
                        </div>
                        <div class="symbol" v-if="guiderSelectList.length > 0">【</div>
                        <div class="guiderItem">
                            <span>{{ guiderSelectList.map(e => e.name).join('、') }}</span>
                        </div>
                        <div class="symbol" v-if="guiderSelectList.length > 0">】</div>
                    </div>
                </div>
                <div class="statistics">
                    <div class="item line">
                        <div class="itemTitle">原价</div>
                        <div class="value">
                            <span class="symbol">¥</span>
                            <span>{{ $app.moneyFixed(checkinData.totalMoney) }}</span>
                        </div>
                    </div>
                    <div class="item line">
                        <div class="itemTitle">
                            <span class="text">
                                <label>优惠</label>
                            </span>
                        </div>
                        <div class="value">
                            <span class="symbol">¥</span>
                            <span>{{ $app.moneyFixed(checkinData.discountMoney) }}</span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemTitle">应收</div>
                        <div class="value receivable">
                            <span class="symbol">¥</span>
                            <span>{{ checkinData.receivableMoney }}</span>
                            <i class="moneyEdit el-icon-edit-outline" @click="showCheckinPriceChange"></i>
                        </div>
                    </div>
                </div>
                <div class="controlWrap">
                    <div class="leftWrap">
                        <el-input class="searchMember" v-model="inputMemberKeyword" type="text" @change="showMemberList" placeholder="输入会员号/姓名/手机">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            <el-button slot="append" @click="showMemberList">选择会员</el-button>
                        </el-input>
                        <div class="memberInfo" v-if="memberSelected">
                            <div class="userInfo">
                                <div class="left">
                                    <div class="logo">
                                        <img class="img" v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="memberInfo.sv_mr_headimg.indexOf('http') > -1 ? memberInfo.sv_mr_headimg : imgBase + memberInfo.sv_mr_headimg" width="100%" />
                                        <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                    </div>
                                    <div class="nameWrap" v-if="!$app.isNull(memberInfo.member_id)">
                                        <div class="nametext">
                                            <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                            <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                        </div>
                                        <div class="telephone">{{ $app.phoneNumberHiding(memberInfo.sv_mr_mobile) }}</div>
                                    </div>
                                </div>
                                <div class="right" v-if="memberSelected">
                                    <div class="btn btnClear" @click="handleClearMember">清除</div>
                                    <div class="btn btnRecharge" @click="showMemberRecharge">充值</div>
                                </div>
                            </div>
                            <div class="userRights">
                                <div class="item">
                                    <div class="key">余额</div>
                                    <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">积分</div>
                                    <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">累计消费</div>
                                    <div class="value">{{ memberInfo.sv_mw_sumamount }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">生日</div>
                                    <div class="value">{{ memberBirthday }}</div>
                                </div>
                            </div>
                        </div>
                        <pay-type-list ref="payTypeList" :payInfo="payInfo" :import_member_id="memberInfo.member_id" isRecharge :showChuzhi="!hasStoreCard" @returnCode="convergePurchase" @paySuccess="submitSuccess" @closeScan="handleCloseScan" @handleNoMember="showMemberList" :isDisabled="isSubmitting"></pay-type-list>
                        <div class="btnSwitch">
                            <div class="switch">
                                <span class="text">打印开关</span>
                                <el-switch v-model="checkPrint"></el-switch>
                            </div>
                            <div class="switch">
                                <span class="text">发送短信</span>
                                <el-switch v-model="checkMessage"></el-switch>
                            </div>
                        </div>
                    </div>
                    <div class="rightWrap">
                        <div class="btnListWrap">
                            <div class="calculatorItem" :class="{ isRowFirst: index % 3 == 0 }" v-for="(item, index) in btnCalculator" :key="index" @click="handleBtnInput(item)">
                                <span>{{ item.value }}</span>
                            </div>
                            <!-- <div class="calculatorItem" v-permission="{ permission: CashierManage.Print_Switch, fn: handleBtnPrint }">
								<el-switch v-model="checkPrint" @change="handleBtnPrint" @click.stop=""></el-switch>
								<span class="checkPrint">打印开关</span>
							</div> -->
                        </div>
                        <el-button :disabled="isSubmitting" class="submitBtn" v-repeatClick @click="handleSubmit">确定结算</el-button>
                    </div>
                </div>
            </div>
        </dc-dialog>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 新增二级分类 -->
        <!-- 新增商品 -->
        <goods-add :visible.sync="goodsAddStatus" :firstCategory="firstCategory"></goods-add>
        <category-second-add :visible.sync="categorySecondStatus" :firstCategory="firstCategory" :firstCategoryId="query.erjicategory" @callback="secondAddBack"></category-second-add>
        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" @handleCloseMember="selectMember" @close="handleCloseMemberDialog"></member-list>
        <!-- 选择销售员 -->
        <guider-select :visible.sync="guiderSelectStatus" @handleBack="getGuiderSelected"></guider-select>
        <!-- 商品改数量 -->
        <number-change :visible.sync="numberChangeStatus" :title="currentGoodsInfo.title" onlyNumber :defaultNumber="currentGoodsInfo.type === 'number' ? currentGoodsInfo.data.number : currentGoodsInfo.data.giveNumber" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 改价改折 -->
        <price-change :visible.sync="priceChangeStatus" :menuPos.sync="priceChangeMenuPos" :extendInfo="priceChangeExtend" :isCheckIn="true" :improtMoney="improtChangeMoney" @submitMoney="submitMoney"></price-change>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" @addSuccess="memberAddSuccess"></member-add>
        <!-- 储值卡押金 -->
        <store-card-deposit :visible.sync="storeCardDepositStatus"></store-card-deposit>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus" successNeedClearMember></member-recharge>
        <!-- 押金退卡 -->
        <store-card-deposit-return :visible.sync="depositReturnStatus"></store-card-deposit-return>
        <!-- 选择卡成员 -->
        <member-group :visible.sync="memberGroupStatus" title="选择卡成员" :selectedNumber="extendInfo.sv_number_people" :selectedList="extendInfo.sv_affiliation_m_id" @handleBack="handleMemberGroupBack"></member-group>
        <!-- 赠送积分 -->
        <number-change :visible.sync="pointChangeStatus" title="赠送积分" :defaultNumber="orderIntegral" noLimited @handleNumberChange="handlePointChange"></number-change>
        <!-- 储值卡消费结算验证 -->
        <member-card-check :visible.sync="memberCardCheckStatus" :checkType="memberCardCheckType" :paymentAmount="checkinData.receivableMoney" :memberInfo="memberInfo" @success="memberCardCheckSuccess"></member-card-check>
        <check-store-card :visible.sync="checkStoreStatus" :importInfo="checkStoreInfo" @handleSuccess="submitSuccess"></check-store-card>
        <!-- 入场卡结算 -->
        <check-fitness :visible.sync="checkCourseStatus" :dataList="courseData" :importInfo="totalInfo" :extendInfo="extendInfo" @handleSuccess="handleSuccess"></check-fitness>
    </div>
</template>

<style lang="sass" scoped>
@import "./cardRecharge.scss"
</style>
<script src="./cardRecharge.js"></script>

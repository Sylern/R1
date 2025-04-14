<template>
    <div class="cashier education" ref="cashier">
        <div class="cashierLeft">
            <div class="leftTop">
                <div class="inputBox">
                    <el-input type="text" ref="searchInput" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.right.stop="handleSearchCheckIn" @keyup.native.enter.stop="handleSearch" clearable placeholder="私教课/课程卡/入场卡/商品名称">
                        <i slot="prefix" class="el-icon-search"></i>
                    </el-input>
                    <div class="btn btn_saoma" v-permission="{permission: CashierManage.Reverse, fn: handleHexiao}">
                        <cmd-icon type="icon-saoma1" size="36" color="#ffffff"></cmd-icon>
                    </div>
                    <div class="btn_xiaoxi" v-permission="{ permission: CashierManage.Message, fn: handleMessage }">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#ffffff"></cmd-icon>
                        <div class="tips_num" v-if="tipsNum > 0">{{ tipsNum > 99 ? '99+' : tipsNum }}</div>
                    </div>
                </div>
                <div class="memberBtn">
                    <div class="btnItem btnMemberSelect" v-permission="{ permission: CashierManage.Select_Members, fn: showMemberList }">
                        <cmd-icon type="icon-huiyuan" color="#ffffff" size="30"></cmd-icon>
                        <span class="text">选择会员</span>
                    </div>
                    <div class="btnItem btnMemberAdd" v-permission="{ permission: CashierManage.Add_Members, fn: showMemberAdd }">
                        <cmd-icon type="icon-jia" color="#ffffff" size="24"></cmd-icon>
                        <span class="text">新增会员</span>
                    </div>
                </div>
            </div>
            <div class="leftContent">
                <div class="memberInfo" v-if="memberSelected">
                    <div class="left">
                        <div class="memberImg">
                            <div class="img">
                                <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                            </div>
                            <div class="memberTitle">{{ memberInfo.sv_ml_name }}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="infoItem">
                            <div class="key">姓名：</div>
                            <div class="value">{{ memberInfo.sv_mr_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">余额：</div>
                            <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">优惠券：</div>
                            <div class="value">{{ memberInfo.couponCountNumber }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">电话：</div>
                            <div class="value">{{ memberInfo.sv_mr_mobile }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">积分：</div>
                            <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">权益卡：</div>
                            <div class="value">{{ memberInfo.micard_count || 0 }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">卡号：</div>
                            <div class="value">{{ memberInfo.sv_mr_cardno }}</div>
                        </div>
                    </div>
                    <div class="clearMember" @click="handleClearMember">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
                <div class="tableWrap" :class="{ memberSelected: memberSelected }">
                    <div class="tableBox">
                        <div class="courseBox" :class="{ hasCartting: carttingDataLength > 0}">
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
                                    <div :class="{ isCoursePackage: extendInfo.courseDataType !== 1}">
                                        <div class="coursePackageContent">
                                            <div class="cartItem" v-for="(item, index) in courseData" :key="index">
                                                <div class="dataMain">
                                                    <div class="rowTop row">
                                                        <div class="cell1"></div>
                                                        <div class="cell2">
                                                            <div class="goodsNumber">{{ item.barCode }}</div>
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
                                                            <div class="btnSubtract" v-if="extendInfo.courseDataType === 1" v-permission="{ permission: CashierManage.key_num, fn: handleSubtract, param: [item, index] }">
                                                                <span>-</span>
                                                            </div>
                                                            <div class="product_num" v-permission="{ permission: CashierManage.key_num, fn: handleNumberChange, param: [index] }">
                                                                <span>{{ item.number }}</span>
                                                            </div>
                                                            <div class="btnAdd" v-if="extendInfo.courseDataType === 1" v-permission="{ permission: CashierManage.key_num, fn: handleAdd, param: [item, index] }">
                                                                <span>+</span>
                                                            </div>
                                                        </div>
                                                        <div class="cell6">
                                                            <span>{{ item.timedetail[item.salePos].sv_give_class_hour }}</span>
                                                        </div>
                                                        <div class="cell7">
                                                            <div class="priceTotal" :class="{ isPackage: extendInfo.courseDataType !== 1 }" @click="handlePriceChange(index)">
                                                                <span>{{ item.priceTotal }}</span>
                                                                <i class="el-icon-edit" v-if="extendInfo.courseDataType === 1"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="rowBottom row">
                                                        <div class="cell1"></div>
                                                        <div class="cell2"> </div>
                                                        <div class="cell3"></div>
                                                        <div class="cell4"></div>
                                                        <div class="cell5"></div>
                                                        <div class="cell6"></div>
                                                        <div class="cell7" @click.stop="">
                                                            <div class="btnDelete" v-if="extendInfo.courseDataType === 1" v-permission="{ permission: CashierManage.delete_p, fn: handleDel, param: [index] }">
                                                                <i class="el-icon-delete"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="courseValidity" v-if="extendInfo.courseDataType === 1">
                                                    <div class="courseUseInfo">
                                                        <!-- <span>开卡方式：</span> -->
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
                                                            <span>至 {{ extendInfo.sv_effective_time_end.substring(0, 10) }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="coursePackageTag" v-if="extendInfo.courseDataType === 2">课程卡</div>
                                            <div class="coursePackageTag" v-if="extendInfo.courseDataType === 3">入场卡</div>
                                            <div class="coursePackageValidity" v-if="extendInfo.courseDataType === 2">
                                                <div class="courseUseInfo">
                                                    <!-- <span>开卡方式：</span>
                                                    <el-select class="userInfoSelect" v-model="extendInfo.open_card_way">
                                                        <el-option v-for="(item, index) in extendInfo.sv_open_card_way_list" :value="item.value" :label="item.label" :key="index"></el-option>
                                                    </el-select> -->
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
                                                        <span>至 {{ extendInfo.sv_effective_time_end.substring(0, 10) }}</span>
                                                    </div>
                                                </div>
                                                <div class="btnDelete" @click="handleDelPackage">
                                                    <i class="el-icon-delete"></i>
                                                </div>
                                            </div>
                                            <div class="coursePackageValidity" v-if="extendInfo.courseDataType === 3">
                                                <div class="courseUseInfo">
                                                    <!-- <span>开卡方式：</span>
                                                    <el-select class="userInfoSelect" v-model="extendInfo.open_card_way">
                                                        <el-option v-for="(item, index) in extendInfo.sv_open_card_way_list" :value="item.value" :label="item.label" :key="index"></el-option>
                                                    </el-select> -->
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
                                                        <span>至 {{ extendInfo.sv_effective_time_end.substring(0, 10) }}</span>
                                                    </div>
                                                </div>
                                                <div class="btnDelete" @click="handleDelPackage">
                                                    <i class="el-icon-delete"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="carttingBox" v-if="carttingDataLength > 0">
                            <cartting noRemark />
                        </div>
                    </div>
                    <div class="leftBottom">
                        <div class="orderFolder">
                            <div class="left">
                                <el-date-picker v-model="orderTime" type="datetime" :clearable="false" placeholder="经办时间" :picker-options="{
                                        disabledDate(time) {
                                            return time.getTime() > Date.now();
                                        }
                                    }"></el-date-picker>
                                <!-- <div class="item">
                                    <i class="el-icon-folder-add"></i>
                                    <span>附件</span>
                                </div> -->
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
                                <div class="item" @click="numberChangeStatus = true">
                                    <span>赠送积分</span>
                                    <span class="value">{{ orderIntegral }}</span>
                                    <i class="el-icon-edit"></i>
                                </div>
                                <!-- <div class="item">
                                    <span>业绩归属人</span>
                                    <span class="value">{{ orderIntegral }}</span>
                                    <i class="el-icon-arrow-down"></i>
                                </div> -->
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="statisticsWrap">
                                <div>
                                    <span class="highlight">¥</span>
                                    <span class="totalMoney highlight">{{ totalInfo.money }}</span>
                                </div>
                            </div>
                            <div class="btnWrap">
                                <!-- <div class="btnPost" v-if="isOrderTake"
                                    v-permission="{ permission: CashierManage.guadanclick, fn: handleOrderTake }">
                                    <span>保存草稿</span>
                                </div>
                                <div class="btnPost" v-else
                                    v-permission="{ permission: CashierManage.guadanclick, fn: handleOrderTake }">
                                    <span>取单</span>
                                </div> -->
                                <div class="btnCash" v-permission="{ permission: CashierManage.Collection, fn: showCheckin }">
                                    <span>结算</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cashierRight">
            <div class="menuWrap">
                <div class="left">
                    <div class="menuItem" :class="{ selected: menuType === 1 }" @click="handleChangeMenu(1)">私教课</div>
                    <div class="menuItem" :class="{ selected: menuType === 2 }" @click="handleChangeMenu(2)">课程卡</div>
                    <div class="menuItem" :class="{ selected: menuType === 3 }" @click="handleChangeMenu(3)">入场卡</div>
                    <div class="menuItem" :class="{ selected: menuType === 4 }" @click="handleChangeMenu(4)">商品</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="rightContent" ref="rightContent">
                <course-list ref="courseList" v-if="menuType === 1" @handleToCart="addCart"></course-list>
                <package-list ref="packageList" v-if="menuType === 2" @handleToCart="addPackageCart"></package-list>
                <admission-list ref="admissionList" v-if="menuType === 3" @handleToCart="addAdmissionCart"></admission-list>
                <goodsList ref="goodsList" v-if="menuType === 4" darkModel :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id"></goodsList>
            </div>
        </div>

        <div id="ball" :style="ballAnimation">
            <img class="img" v-if="animationImg" :src="animationImg" style="width:100%;height:100%;" />
            <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/cashier/noGoodsImg.png'" />
        </div>

        <dc-dialog v-if="postPopStatus" width="470" height="260" title="挂单" @close="postPopStatus = false">
            <div class="postPopWrap">
                <div class="mainWrap">
                    <el-input v-model="postPopText" placeholder="请输入挂单备注"></el-input>
                </div>
                <div class="btnSure">
                    <el-button class="btn" :disabled="isSubmitting" @click="handlePostPop">
                        <span>确定</span>
                    </el-button>
                </div>
            </div>
        </dc-dialog>

        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" title="选择会员" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>

        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :improtMoney="improtMoney" @submitMoney="handlePriceChangeBack"></price-change>
        <!-- 选择卡成员 -->
        <member-group :visible.sync="memberGroupStatus" title="选择卡成员" :selectedNumber="extendInfo.sv_number_people" :selectedList="extendInfo.sv_affiliation_m_id" @handleBack="handleMemberGroupBack"></member-group>
        <!-- 赠送积分 -->
        <number-change :visible.sync="numberChangeStatus" title="赠送积分" :defaultNumber="orderIntegral" noLimited @handleNumberChange="handleNumberChange"></number-change>
        <!-- 订单结算 -->
        <check-fitness :visible.sync="checkCourseStatus" :dataList="courseData" :importInfo="totalInfo" :extendInfo="extendInfo" @handleSuccess="handleSuccess"></check-fitness>
    </div>
</template>

<style  lang="sass" scoped>@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>
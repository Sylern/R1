<template>
    <div class="cashier education" ref="cashier">
        <div class="cashierLeft">
            <div class="leftTop">
                <div class="inputBox">
                    <el-input type="text" ref="searchInput" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.right.stop="handleSearchCheckIn" @keyup.native.enter.stop="handleSearch" clearable placeholder="课程名称/课程包名称/商品名称">
                        <i slot="prefix" class="el-icon-search"></i>
                    </el-input>
                    <div class="btn_xiaoxi" v-permission="{ permission: CashierManage.Message, fn: handleMessage }">
                        <cmd-icon type="icon-xinxi_huaban" size="36" color="#ffffff"></cmd-icon>
                        <div class="tips_num" v-if="tipsNum > 0">{{ tipsNum > 99 ? '99+' : tipsNum }}</div>
                    </div>
                </div>
                <div class="memberBtn">
                    <div class="btnItem btnMemberSelect" v-permission="{ permission: CashierManage.Select_Members, fn: showMemberList }">
                        <cmd-icon type="icon-huiyuan" color="#ffffff" size="30"></cmd-icon>
                        <span class="text">选择学员</span>
                    </div>
                    <div class="btnItem btnMemberAdd" v-permission="{ permission: CashierManage.Add_Members, fn: showMemberAdd }">
                        <cmd-icon type="icon-jia" color="#ffffff" size="24"></cmd-icon>
                        <span class="text">新增学员</span>
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
                            <div class="memberTitle">在读学员</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="infoItem">
                            <div class="key">学员姓名：</div>
                            <div class="value">{{ memberInfo.sv_mr_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">跟进人：</div>
                            <div class="value">{{ memberInfo.sv_reg_employe_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">就读年级：</div>
                            <div class="value">{{ memberInfo.sv_grade_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">学员来源：</div>
                            <div class="value">{{ memberInfo.sv_ms_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">学管师：</div>
                            <div class="value">{{ memberInfo.teacher }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">年 龄：</div>
                            <div class="value">{{ memberInfo.age }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">学员电话：</div>
                            <div class="value">{{ memberInfo.sv_mr_mobile }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">就读学校：</div>
                            <div class="value">{{ memberInfo.sv_school}}</div>
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
                                    <span>有效期</span>
                                </div>
                                <div class="cell8">
                                    <span>小计</span>
                                </div>
                            </div>
                            <div class="tbody">
                                <el-scrollbar ref="scrollList" style="width:100%;height:100%; overflow:hidden;">
                                    <div class="cartItem" :class="{ isPackage: item.isPackage }" v-for="(item, index) in courseData" :key="index">
                                        <div class="itemPackage" v-if="item.isPackage">套</div>
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
                                                <div class="cell8"></div>
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
                                                    <div class="btnSubtract" v-permission="{ permission: CashierManage.key_num, fn: handleSubtract, param: [item, index] }">
                                                        <span>-</span>
                                                    </div>
                                                    <div class="product_num" v-permission="{ permission: CashierManage.key_num, fn: handleNumberChange, param: [index] }">
                                                        <span>{{ item.number }}</span>
                                                    </div>
                                                    <div class="btnAdd" v-permission="{ permission: CashierManage.key_num, fn: handleAdd, param: [item, index] }">
                                                        <span>+</span>
                                                    </div>
                                                </div>
                                                <div class="cell6">
                                                    <span>{{ item.timedetail[item.salePos].sv_give_class_hour }}</span>
                                                </div>
                                                <div class="cell7">
                                                    <span>{{ item.sv_effective_time }}</span>
                                                </div>
                                                <div class="cell8">
                                                    <div class="priceTotal" @click="handlePriceChange(index)">
                                                        <span>{{ item.priceTotal }}</span>
                                                        <i class="el-icon-edit"></i>
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
                                                <div class="cell7"></div>
                                                <div class="cell8" @click.stop="">
                                                    <div class="btnDelete" v-permission="{ permission: CashierManage.delete_p, fn: handleDel, param: [index] }">
                                                        <i class="el-icon-delete"></i>
                                                    </div>
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
                                    <span>确认报名</span>
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
                    <div class="menuItem" :class="{ selected: menuType === 1 }" @click="handleChangeMenu(1)">课程</div>
                    <div class="menuItem" :class="{ selected: menuType === 2 }" @click="handleChangeMenu(2)">课程包</div>
                    <div class="menuItem" :class="{ selected: menuType === 3 }" @click="handleChangeMenu(3)">商品</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="rightContent" ref="rightContent">
                <course-list ref="courseList" v-if="menuType === 1" @handleToCart="addCart"></course-list>
                <package-list ref="packageList" v-if="menuType === 2" @handleToCart="addPackageCart"></package-list>
                <goodsList ref="goodsList" v-if="menuType === 3" darkModel :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id"></goodsList>
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
        <member-list :visible.sync="memberListStatus" title="选择学员" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 新增学员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>

        <!-- 学员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus"></member-recharge>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :improtMoney="improtMoney" @submitMoney="handlePriceChangeBack"></price-change>
        <!-- 赠送积分 -->
        <number-change :visible.sync="numberChangeStatus" title="赠送积分" :defaultNumber="orderIntegral" noLimited @handleNumberChange="handleNumberChange"></number-change>
        <!-- 订单结算 -->
        <check-course :visible.sync="checkCourseStatus" :dataList="courseData" :importInfo="totalInfo" @handleSuccess="handleSuccess"></check-course>
    </div>
</template>

<style  lang="sass" scoped>@import "./cashier.scss"
</style>
<script src="./cashier.js"></script>
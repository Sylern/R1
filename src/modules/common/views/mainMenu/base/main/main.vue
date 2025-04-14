<!--入口框架-->
<template>
    <div class="main-wrap" ref="mian" :class="{'transWrap': !mainLeftShow}" tabindex="0" @keyup.stop="listenKeyup">
        <div class="mainLeft" @click="showLogoMenu = false">
            <div class="controlWrap">
                <div class="logo" @click.stop="showLogoMenu = !showLogoMenu">
                    <img class="img" :src="store_logo" />
                    <!-- <img class="img" src="@/assets/images/cashier/default_user_logo.png" /> -->
                    <div class="logoMenu" :class="{'show': showLogoMenu}">
                        <div class="content" @click.stop="">
                            <div class="shape"></div>
                            <div class="item" @click.stop="visiblePwd=true">修改密码</div>
                            <div class="item" @click.stop="handleStore">店铺信息</div>
                            <div class="item" v-if="userInfo.Switch_Stores" @click.stop="handleInfo">
                                <span>切换门店</span>
                                <span class="icon_right">
                                    <i class="el-icon-arrow-right"></i>
                                </span>
                                <div class="subContent" @click.stop="">
                                    <div class="subContentWrap">
                                        <div class="searchBox">
                                            <el-input v-model="storeSearchText" placeholder="请输入店铺名称" clearable @input.stop="handleSearchInput" @keyup.native.enter="searchStoreList" @clear="clearStoreList">
                                                <i @click="searchStoreList" slot="suffix" class="el-input__icon el-icon-search"></i>
                                            </el-input>
                                        </div>
                                        <div class="storeList">
                                            <el-scrollbar style="width:100%;">
                                                <div class="subItem" v-for="(item, index) in currStoreList" :key="index" @click="handleStoreChange(item)">
                                                    <label class="headSotre" v-if="!item.isStore">总店</label>
                                                    <span>{{item.sv_us_shortname}}</span>
                                                </div>
                                            </el-scrollbar>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="item" v-if="isOnFrontCashier && cashierJurisdiction.succession" @click="handleHandover">交接对账</div>
                            <div class="item" v-if="isOnFrontCashier && hasStoreReconciliation" v-permission="{permission: CashierManage.Store_Account_Checking, fn: handleStoreReconciliation}">营业日报</div>
                            <div class="item" v-if="!isOnAndroid" @click.stop="handleLoginout">退出系统</div>
                        </div>
                    </div>
                </div>
                <div class="iconWrap">
                    <!-- <el-scrollbar style="width: 100%; height: 100%;"> -->
                    <div v-for="(item, index) in mainMenu" :key="index">
                        <transition name="slide-fade">
                            <div class="iconBox" v-if="!item.pageHide" :class="{'selected': $route.path === item.url || item.menuMetaMatch === menuPathMatch}" @click.stop="handleIconClick(item)">
                                <cmd-icon :type="item.icon" size="30"></cmd-icon>
                                <div class="text">{{ item.name }}</div>
                            </div>
                        </transition>
                    </div>
                <!-- </el-scrollbar> -->
                </div>
            </div>
            <div class="leftBottom">
                <div class="iconSetting" :class="{'selected': $route.path === '/cashier/setting'}" @click="handelSetting">
                    <cmd-icon type="icon-shezhi" size="30"></cmd-icon>
                    <div class="text">设置</div>
                </div>
                <div class="handleLeftBtn" @click="handleLeftStatus">
                    <i class="el-icon-arrow-left"></i>
                </div>
            </div>
        </div>
        <div class="mainRight" @click="showLogoMenu = false">
            <div class="mainContent">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive && IsAuthority" />
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive && IsAuthority" />
            </div>
            <div class="handleLeftBtn" :class="{ hideLeft: !mainLeftShow }" @click="handleLeftStatus">
                <i class="el-icon-arrow-right"></i>
            </div>
            <div class="mainBottom" :class="{ paddingLeft: !mainLeftShow, darkMode: isDarkMode }">
                <div class="loginUser">
                    <span class="shopName">店铺：{{userInfo.sv_us_name}}</span>
                    <span class="userID">店铺ID：{{userInfo.user_id}}</span>
                    <span class="userName">收银员：{{userInfo.sv_ul_name}}</span>
                    <span class="localTime">{{localTime}}</span>
                </div>
                <div v-if="userInfo.distributor_id === 1" class="technicalSupport">{{technicalSupport}}</div>
            </div>
        </div>
        <dc-dialog v-if="handoverStatus" width="400" height="240" title="退出提示" @close="closeHandoverDialog" @handleEnter="handleHandover">
            <div class="h_content">
                <div class="h_text">退出收银前，是否进行收银对账？</div>
                <div class="h_btnWrap">
                    <div class="btn h_light" @click="handleHandover">交接对账</div>
                    <div class="btn" @click="popLoginout">确认退出</div>
                    <div class="btn" @click="handoverStatus = false">取消</div>
                </div>
            </div>
        </dc-dialog>

        <!-- 订单核销 -->
        <order-wiped :visible.sync="orderWipedStatus"></order-wiped>
        <!-- 取单 -->
        <order-take :visible.sync="orderTakeStatus"></order-take>
        <!-- 快捷键设置 -->
        <shortcut-setting :visible.sync="shortcutSettingStatus"></shortcut-setting>
        <!-- 交接班 -->
        <!-- <handover :visible.sync="handoverStatus"></handover> -->

        <!-- 会员列表 -->
        <member-list :visible.sync="memberListStatus" :showCardWrap="showCardWrap" :useType="useType" @handleCloseMember="handleCloseMember"></member-list>
        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus"></member-add>
        <!-- 会员充值 -->
        <member-recharge :visible.sync="memberRechargeStatus" :useType="useType"></member-recharge>
        <!-- 选择储值卡 -->
        <store-card-select :visible.sync="storeCardStatus"></store-card-select>
        <!-- 选择权益卡 -->
        <equity-card-select :visible.sync="equityCardStatus"></equity-card-select>
        <!-- 新增商品 -->
        <goods-add :visible.sync="goodsAddStatus"></goods-add>
        <!-- 商品改价 -->
        <price-change :visible.sync="priceChangeStatus" :improtMoney="priceChangeImprotMoney" :menuPos.sync="priceChangeMenuPos" @submitMoney="handlePriceChangeBack"></price-change>
        <!-- 商品改数量 -->
        <number-change :visible.sync="numberChangeStatus" title="商品数量" :onlyNumber="!isPricingMethod" :defaultNumber="currentDefaultNumber" @handleNumberChange="handleNumberChange"></number-change>
        
        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="priceChangeImprotMoney" @handleNumberChange="handlePriceChangeBack"></number-change>

        <!-- 无码收银计算器 -->
        <quick-collect :visible.sync="quickCollectStatus"></quick-collect>
        <!-- 加价购、满送 -->
        <is-goods-activity :visible.sync="isGoodsActivityStatus" @handleSure="handleGoodsActivitySelected"></is-goods-activity>
        <!-- 订单结算 -->
        <checkin :visible.sync="checkinStatus" @handleGoodsActivity="isGoodsActivityStatus = true"></checkin>
        <!-- 修改密码 -->
        <updatePassword :visible.sync="visiblePwd"></updatePassword>

        <el-dialog :visible.sync="isLogUpdate" :close-on-click-modal="false" class="logUpdate_dialog system_dialog">
            <section class="lud_section">
                <div class="luds_title">门店管理系统-更新日志</div>
                <div class="luds_time">{{entityLogUpdate.dateTime}}<span>{{entityLogUpdate.weekTime}}</span></div>
                <div class="luds_name">{{entityLogUpdate.title}}</div>
                <div class="luds_content">
                    <el-scrollbar ref="logupdate_scrollbar" style="height:100%;width:100%">
                        <div class="luds_c_section" v-html="entityLogUpdate.content"></div>
                    </el-scrollbar>
                </div>
                <div class="luds_btn">
                    <div @click="isLogUpdate=false" class="btnItem btnPrimary">知道了</div>
                </div>
            </section>
        </el-dialog>

        <el-dialog title="到期提醒" :visible.sync="showToMenuExpire" :close-on-click-modal="false" width="440px" class="system_dialog" @close="hideExpire">
            <div class="expireWrap">
                <div v-if="userInfo.distributorId === 1">
                    <div>您的店铺服务已过期。现在订购可获得多种行业解决方案。立即订购</div>
                    <div class="btn" @click="handleRenewUrl">立即续费</div>
                </div>
                <div v-else>
                    <div>您的店铺服务已过期。现在订购可获得多种行业解决方案。请及时联系：</div>
                    <div class="link">{{userInfo.sv_d_phone || ''}}</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="临期提醒" :visible.sync="showToMenuExpireDay" :close-on-click-modal="false" width="440px" class="system_dialog" @close="hideExpireDay">
            <div class="expireDayWrap">
                <div v-if="userInfo.distributorId === 1">
                    <div>您的店铺服务剩余<label class="sv_expire_days">{{userInfo.sv_expire_days}}</label>天，即将到期。为避免影响您的软件使用体验，请及时续费。</div>
                    <div class="btn" @click="handleRenewUrl">立即续费</div>
                </div>
                <div v-else>
                    <div>您的店铺服务剩余<label class="sv_expire_days">{{userInfo.sv_expire_days}}</label>天，即将到期。现在订购可获得多种行业解决方案。请及时联系：</div>
                    <div class="link">{{userInfo.sv_d_phone || ''}}</div>
                </div>
            </div>
        </el-dialog>
        <!-- 微信卡券、微信推送已过期提醒 -->
        <!-- <el-dialog title="到期提醒" :visible.sync="isShowCardExpire" :close-on-click-modal="false" width="580px" class="system_dialog" @close="isShowCardExpire = false"> -->
        <el-dialog title="到期提醒" :visible.sync="showToMenuCardExpire" :close-on-click-modal="false" width="580px" class="system_dialog" @close="closeCardExpire">
            <div class="expireWrap">
                <div>{{cardExpireText}}</div>
                <div class="btn" @click="closeCardExpire">确定</div>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scope>
@import './main.scss';
</style>
<style lang="scss">
@import '@/assets/style/style.scss';
@import '@/assets/style/element-ui.scss';
.logUpdate_dialog {
    .el-dialog {
        width: 70%;
        margin: 0;
        img {
            width: auto;
        }
    }
}
</style>
<script src="./main.js"></script>

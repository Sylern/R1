<template>
    <div class="setting" @click="showEdit = false">
        <div class="content">
            <div class="leftWrap">
                <el-scrollbar style="height: 100%; width: 100%;">
                    <div class="settingBox" v-if="!isOnAndroid">
                        <div class="title">外接设备</div>
                        <!-- <div class="item noMargin bottomLine">
                            <div class="key">电子称</div>
                            <div class="value highLightLabel">已连接</div>
                        </div> -->
                        <div class="item noMargin" data-name="sales-print">
                            <div class="key" v-hightlight="'小'">小票机</div>
                            <!-- <div class="value unConnect">未连接</div> -->
                            <div class="value highLightLabel" @click="handleSetting('小票打印机设置')">设置</div>
                        </div>
                    </div>

                    <div class="settingBox">
                        <div class="title">硬件信息</div>
                        <div class="item" v-if="hasHardware">
                            <div class="key">硬件设置</div>
                            <div class="value highLightLabel" @click="handleSetting('硬件设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasElectronic">
                            <div class="key">电控设置</div>
                            <div class="value highLightLabel" @click="handleSetting('电控设置')">设置</div>
                        </div>
                        <div class="item">
                            <div class="key">小票打印模版</div>
                            <div class="value highLightLabel" @click="handleSetting('小票打印模版设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasPriceTag">
                            <div class="key">标签打印模版</div>
                            <div class="value highLightLabel" @click="handleSetting('标签打印模版设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasKitchPrint">
                            <div class="key">后厨打印</div>
                            <div class="value highLightLabel" @click="handleSetting('后厨打印设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasCloudPrint">
                            <div class="key">云打印</div>
                            <div class="value highLightLabel" @click="handleSetting('云打印设置')">设置</div>
                        </div>
                        <!-- <div class="item">
                            <div class="key">硬件管理</div>
                            <div class="value highLightLabel" @click="handleSetting('硬件管理')">设置</div>
                        </div> -->
                        <!-- <div class="item">
                            <div class="key">标签打印</div>
                            <div class="value highLightLabel" @click="handleSetting('标签打印')">设置</div>
                        </div>
                        <div class="item">
                            <div class="key">触屏模式</div>
                            <div class="value">
                                <el-switch v-model="settingData.hardware.touchModel"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">启用虚拟键盘</div>
                            <div class="value">
                                <el-switch v-model="settingData.hardware.keyboardCustom"></el-switch>
                            </div>
                        </div> -->
                    </div>

                    <div class="settingBox">
                        <div class="title">收银设置</div>
                        <div class="item" v-if="hasCashierModel">
                            <div class="key">收银模式设置</div>
                            <div class="value">
                                <div class="value highLightLabel" @click="handleSetting('收银模式设置')">设置</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">基础设置</div>
                            <div class="value">
                                <div class="value highLightLabel" @click="handleSetting('基础设置')">设置</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">优惠设置</div>
                            <div class="value">
                                <div class="value highLightLabel" @click="handleSetting('优惠设置')">设置</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">支付设置</div>
                            <div class="value">
                                <div class="value highLightLabel" @click="handleSetting('支付设置')">设置</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">安全设置</div>
                            <div class="value">
                                <div class="value highLightLabel" @click="handleSetting('安全设置')">设置</div>
                            </div>
                        </div>
                        <div class="item" v-if="isClient">
                            <div class="key">
                                <span>本机是否为主机</span>
                                <span class="btn" v-if="appSwitch" @click="handTestClient">测试</span>
                            </div>
                            <el-switch v-model="appSwitch" @change="handleChangeApp"></el-switch>
                        </div>
                        <!-- <div class="item" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'">
                            <div class="key">
                                <span>主机打印宾客单、后厨单</span>
                            </div>
                            <el-switch v-model="cateringSwitch" @change="handleChangeCatering"></el-switch>
                        </div> -->
                        <!-- <div class="item">
                            <div class="key">收款金额播报</div>
                            <div class="value">
                                <el-switch v-model="settingData.moreSetting.showGetMoneyMusic"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">扫码错误播报提示</div>
                            <div class="value">
                                <el-switch v-model="settingData.moreSetting.showErrorScancode"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">扫顾客付款码直接收款</div>
                            <div class="value">
                                <el-switch v-model="settingData.moreSetting.showCustomDirecte"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">
                                <div class="text">使用快捷键</div>
                                <div class="info">开启后，可使用USB键盘进行快捷收银（菜单栏如未显示快捷键，请切换店铺后重试）</div>
                            </div>
                            <div class="value">
                                <el-switch v-model="settingData.moreSetting.useShortcutKey"></el-switch>
                            </div>
                        </div> -->
                    </div>

                    <div class="settingBox">
                        <div class="title">功能设置</div>
                        <div class="item">
                            <div class="key">商品设置</div>
                            <div class="value highLightLabel" @click="handleSetting('商品设置')">设置</div>
                        </div>
                        <div class="item">
                            <div class="key">库存设置</div>
                            <div class="value highLightLabel" @click="handleSetting('库存设置')">设置</div>
                        </div>
                        <div class="item">
                            <div class="key">会员设置</div>
                            <div class="value highLightLabel" @click="handleSetting('会员设置')">设置</div>
                        </div>
                        <!-- <div class="item" v-if="hasDouyinBind"> -->
                        <div class="item">
                            <div class="key">抖音绑定</div>
                            <div class="value highLightLabel" @click="handleSetting('抖音绑定')">设置</div>
                        </div>
                    </div>

                    <div class="settingBox" v-if="!isOnAndroid">
                        <div class="title">商品展示</div>
                        <div class="item">
                            <div class="key">显示商品库存</div>
                            <div class="value">
                                <el-switch v-model="settingData.goodsInfo.showStock" @change="handleStockSwitch"></el-switch>
                            </div>
                        </div>

                        <div class="item">
                            <div class="key">展示商品图片</div>
                            <div class="value highLightLabel" @click="handleSetting('展示商品图片设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasScreen">
                            <div class="key">客显设置</div>
                            <div class="value highLightLabel" @click="handleSetting('客显设置')">设置</div>
                        </div>
                        <div class="item" v-if="hasScreen">
                            <div class="key">副屏设置</div>
                            <div class="value highLightLabel" @click="handleSetting('副屏设置')">设置</div>
                        </div>
                        <!-- <div class="item">
                            <div class="key">展示商品条码</div>
                            <div class="value">
                                <el-switch v-model="settingData.goodsInfo.showBranchCode"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">仅展示商品搜索框</div>
                            <div class="value">
                                <el-switch v-model="settingData.goodsInfo.showSearchBox"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">隐藏售罄商品</div>
                            <div class="value">
                                <el-switch v-model="settingData.goodsInfo.hideSellOut"></el-switch>
                            </div>
                        </div> -->
                    </div>

                    <div class="settingBox" v-if="!isOnAndroid">
                        <div class="title">软件信息</div>
                        <div class="item">
                            <div class="key">{{settingData.software.version}}</div>
                            <div class="value highLightLabel" v-if="settingData.software.hasNewVersion">升级</div>
                            <div class="value">已是最新版本</div>
                        </div>
                        <!-- <div class="item">
                            <div class="key">功能介绍</div>
                            <div class="value highLightLabel">查看</div>
                        </div> -->
                        <div class="item">
                            <div class="key">
                                <div class="text">清空缓存</div>
                                <div class="info">清空当前购物车信息，仅影响收银时操作</div>
                            </div>
                            <div class="value highLightLabel" @click="handleClearCartting">立即清空</div>
                        </div>
                        <div class="item">
                            <div class="key">数据管理</div>
                            <div class="value highLightLabel" @click="handleSetting('数据管理')">查看</div>
                        </div>
                        <div class="item">
                            <div class="key">全局菜单管理</div>
                            <div class="value highLightLabel" @click="handleSetting('全局菜单管理')">设置</div>
                        </div>

                        <!-- <div class="item">
                            <div class="key">上传日志</div>
                            <div class="value highLightLabel">立即上传</div>
                        </div> -->
                    </div>
                </el-scrollbar>
            </div>
            <div class="rightWrap">
                <div class="contentTitle">
                    <span>{{contentTitle}}</span>
                </div>
                <div class="contentPage">
                    <sales-print v-if="settingTitle === '小票打印机设置'"></sales-print>
                    <hardware v-if="settingTitle === '硬件设置'"></hardware>
                    <ECU v-if="settingTitle === '电控设置'"></ECU>
                    <restaurant-print restaurant-print v-if="settingTitle === '后厨打印设置'"></restaurant-print>
                    <!-- <receipt-print v-if="settingTitle === '销售小票设置'"></receipt-print> -->
                    <custom-ticket v-if="settingTitle === '小票打印模版设置'"></custom-ticket>
                    <label-print v-if="settingTitle === '标签打印'"></label-print>
                    <img-model v-if="settingTitle === '展示商品图片设置'"></img-model>
                    <cashier-model v-if="settingTitle === '收银模式设置'"></cashier-model>
                    <goods-setting v-if="settingTitle === '商品设置'"></goods-setting>
                    <stock-setting v-if="settingTitle === '库存设置'"></stock-setting>
                    <member-setting v-if="settingTitle === '会员设置'"></member-setting>
                    <douyin-bind v-if="settingTitle === '抖音绑定'"></douyin-bind>
                    <cashier-base v-if="settingTitle === '基础设置'"></cashier-base>
                    <cashier-discount v-if="settingTitle === '优惠设置'"></cashier-discount>
                    <cashier-pay v-if="settingTitle === '支付设置'"></cashier-pay>
                    <cashier-security v-if="settingTitle === '安全设置'"></cashier-security>
                    <menu-setting v-if="settingTitle === '全局菜单管理'"></menu-setting>
                    <price-tag @handleSetting="handleSetting" v-if="settingTitle === '标签打印模版设置'"></price-tag>
                    <price-tag-add @handleSetting="handleSetting" v-if="settingTitle === '标签模版编辑'"></price-tag-add>
                    <cloud-print v-if="settingTitle === '云打印设置'"></cloud-print>
                    <data-manage v-if="settingTitle === '数据管理'"></data-manage>
                    <!-- <hardwareManagement v-if="settingTitle === '硬件管理'"></hardwareManagement>
                    <hardwareManagementAdd v-if="settingTitle === '新增硬件'"></hardwareManagementAdd> -->
                    <screen-setting v-if="settingTitle === '客显设置'"></screen-setting>
                    <screen-custom v-if="settingTitle === '副屏设置'"></screen-custom>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scope>
@import './setting.scss';
</style>
<script src="./setting.js"></script>
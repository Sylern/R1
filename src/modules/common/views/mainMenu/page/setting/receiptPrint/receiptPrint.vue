<template>
    <div class="receiptPrint">
        <el-scrollbar class="contentSrcoll">
            <div class="subTitle">
                <span>销售小票设置</span>
            </div>
            <div class="contentWrap" v-if="!showSetting">
                <div class="left">
                    <div class="line switchWrap">
                        <div class="key">
                            <span>禁用打印：</span>
                        </div>
                        <div class="value">
                            <div class="switch">
                                <el-switch v-model="printData.switchAll"></el-switch>
                            </div>
                            <div class="info">
                                <span>禁用后将不会打印小票</span>
                            </div>
                        </div>
                    </div>

                    <div class="line printWrap">
                        <div class="key">
                            <span>打印机：</span>
                        </div>
                        <div class="value">
                            <el-select v-model="checkPrint">
                                <el-option v-for="(item, index) in printData.printList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="line printNumWrap">
                        <div class="key">
                            <span>打印份数：</span>
                        </div>
                        <div class="value">
                            <div class="containar">
                                <div class="btn">-</div>
                                <div class="number"></div>
                                <div class="btn">+</div>
                            </div>
                        </div>
                    </div>

                    <div class="line switchWrap">
                        <div class="key">
                            <span>钱箱设置：</span>
                        </div>
                        <div class="value">
                            <div class="switch">
                                <el-switch v-model="printData.cashBoxSwitch"></el-switch>
                            </div>
                            <div class="info">
                                <span>开启后自动弹出钱箱</span>
                            </div>
                        </div>
                    </div>

                    <div class="line fontWrap">
                        <div class="key">
                            <span>小票字体：</span>
                        </div>
                        <div class="value">
                            <div class="switch">
                                <el-switch v-model="printData.fontSwitch"></el-switch>
                            </div>
                            <div class="info">
                                <span>打印小票是否为繁体字</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="line">
                        <div class="key">
                            <span>纸张宽度：</span>
                        </div>
                        <div class="value">
                            <div class="radioWrap">
                                <el-radio-group v-removeAria v-model="printData.sizeSelected">
                                    <el-radio v-for="(item, index) in printData.sizeList" :key="index" :label="item.name"></el-radio>
                                </el-radio-group>
                            </div>
                            <div class="info">
                                <span>若设置与纸张宽度不匹配，可能影响打印效果。</span>
                            </div>

                            <div class="btnLabelWrap">
                                <div class="btnLabel">
                                    <span>自定义模板</span>
                                </div>
                                <div class="btnLabel">
                                    <span>效果预览</span>
                                </div>
                            </div>

                            <div class="showReceipt">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settingContent" v-if="showSetting">
                <div class="line">
                    <div class="key">
                        <span>纸张宽度：</span>
                    </div>
                    <div class="value">
                        <div class="radioWrap">
                            <el-radio-group v-removeAria v-model="printData.sizeSelected">
                                <el-radio v-for="(item, index) in printData.sizeList" :key="index" :label="item.name"></el-radio>
                            </el-radio-group>
                        </div>
                        <div class="info">
                            <span>若设置与纸张宽度不匹配，可能影响打印效果。</span>
                        </div>
                    </div>
                </div>
                <div class="containar">
                    <div class="left">
                        <div class="basicInfo">
                            <div class="title">基本信息</div>
                            <div class="block isSelected">
                                <div class="shopName">店铺名称</div>
                                <div class="barCode"></div>
                                <div class="liushui">流水号：###</div>
                                <div class="number">桌号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="closeBtn">
                                    <i class="el-icon-close"></i>
                                </div>
                            </div>
                        </div>

                        <div class="goodsInfo">
                            <div class="title">商品信息</div>
                            <div class="block">
                                <div class="shopName">店铺名称</div>
                                <div class="barCode"></div>
                                <div class="liushui">流水号：###</div>
                                <div class="number">桌号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                            </div>
                        </div>

                        <div class="payInfo">
                            <div class="title">支付信息</div>
                            <div class="block">
                                <div class="shopName">店铺名称</div>
                                <div class="barCode"></div>
                                <div class="liushui">流水号：###</div>
                                <div class="number">桌号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                            </div>
                        </div>

                        <div class="customInfo">
                            <div class="title">买家信息</div>
                            <div class="block">
                                <div class="shopName">店铺名称</div>
                                <div class="barCode"></div>
                                <div class="liushui">流水号：###</div>
                                <div class="number">桌号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                            </div>
                        </div>

                        <div class="moreInfo">
                            <div class="title">其他信息</div>
                            <div class="block">
                                <div class="shopName">店铺名称</div>
                                <div class="barCode"></div>
                                <div class="liushui">流水号：###</div>
                                <div class="number">桌号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                                <div class="number">取货号：###</div>
                            </div>
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<style lang="scss" scope>
@import './receiptPrint.scss';
</style>
<script src="./receiptPrint.js"></script>
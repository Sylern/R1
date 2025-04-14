<template>
    <div class="hardware">
        <el-scrollbar class="contentSrcoll">
            <div class="contentWrap">
                <!-- <div class="icSetting">
                    <div class="subTitle">
                        <span>IC卡设置</span>
                    </div>
                    <div class="line switchWrap">
                        <div class="key">
                            <span>IC卡设置：</span>
                        </div>
                        <div class="value">
                            <div class="switch">
                                <el-switch v-model="IC.switch"></el-switch>
                                <el-tooltip class="item" effect="dark" content="提示文字" placement="top-start">
                                    <i class="tipsIcon el-icon-question"></i>
                                </el-tooltip>
                            </div>
                            <div class="info">
                                <span>本系统目前支持接接触式IC卡（4442芯片）、URD-R310等USB读卡器</span>
                            </div>
                        </div>
                    </div>
                    <div class="line portWrap">
                        <div class="key">
                            <span>通讯端口：</span>
                        </div>
                        <div class="value">
                            <el-select v-model="submitData.ic.port">
                                <el-option v-for="(item, index) in IC.port" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="line cardType">
                        <div class="key">
                            <span>卡片类型：</span>
                        </div>
                        <div class="value">
                            <el-select v-model="submitData.ic.cardType">
                                <el-option v-for="(item, index) in IC.cardType" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="line passwordWrap">
                        <div class="key">
                            <span>IC卡密码：</span>
                        </div>
                        <div class="value">
                            <div class="inputBox">
                                <el-input v-model="submitData.ic.password"></el-input>
                            </div>
                            <div class="pswBtnWrap">
                                <div class="btnLabel">
                                    <span class="text">初始化IC卡</span>
                                    <el-tooltip class="item" effect="dark" content="提示文字" placement="top-start">
                                        <i class="tipsIcon el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="btnLabel">
                                    <span class="text">初始化IC卡</span>
                                    <el-tooltip class="item" effect="dark" content="提示文字" placement="top-start">
                                        <i class="tipsIcon el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="info">
                                <span>注意：此功能必须使用PC客户端连接IC卡相关设备才可以使用</span>
                            </div>
                        </div>
                    </div>
                </div> -->
                <div class="pricingScaleSetting" v-if="!isOnAndroid">
                    <div class="subTitle">
                        <span>计价秤设置</span>
                    </div>
                    <div class="containar">
                        <div class="left">
                            <div class="line modelWrap">
                                <div class="key">
                                    <span>选择型号：</span>
                                </div>
                                <div class="value">
                                    <el-select v-model="submitData.pricingScale.model">
                                        <el-option v-for="(item, index) in pricingScale.model" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="line portWrap">
                                <div class="key">
                                    <span>通讯端口：</span>
                                </div>
                                <div class="value">
                                    <el-select v-model="submitData.pricingScale.port">
                                        <el-option v-for="(item, index) in pricingScale.port" :key="index" :label="item.label" :value="item"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="line baudRate">
                                <div class="key">
                                    <span>波特率：</span>
                                </div>
                                <div class="value">
                                    <el-select v-model="submitData.pricingScale.baudRate">
                                        <el-option v-for="(item, index) in pricingScale.baudRate" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="line baudRate">
                                <div class="key">
                                    <span></span>
                                </div>
                                <div class="value">
                                    <div class="btn" @click="savePricingScale">保存</div>
                                </div>
                            </div>
                            <div class="line testWrap">
                                <div class="key">
                                    <span>测试称重：</span>
                                </div>
                                <div class="value">
                                    <div class="inputValue">
                                        <!-- <el-input v-model="submitData.pricingScale.weigh" disabled placeholder="0.00">
                                            <div slot="append" @click="handleScaleTest">
                                                <span class="btnText">测试</span>
                                            </div>
                                        </el-input> -->
                                        <div>{{submitData.pricingScale.weigh || '0.00'}}</div>
                                        <div class="btnTest" @click="handleScaleTest">
                                            <span>测试</span>
                                        </div>
                                    </div>
                                    <div class="status">
                                        <span>状态：</span>
                                        <span class="heightLight">稳定</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="line autoCheck">
                                <div class="key">
                                    <span>是否启用：</span>
                                </div>
                                <div class="value switchWrap">
                                    <div class="switch">
                                        <el-switch v-model="pricingScale.Set_Hareware_Barcode.enable" @change="handlepricingScaleSwitch"></el-switch>
                                    </div>
                                    <div class="info">
                                        <span>开启后，称重商品自动读称</span>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="line autoCheck">
                                <div class="key">
                                    <span>自动确认：</span>
                                </div>
                                <div class="value switchWrap">
                                    <div class="switch">
                                        <el-switch v-model="pricingScale.WeighingStableAutomaticDetermine.sv_detail_is_enable" @change="saveConfigdetailList(pricingScale.WeighingStableAutomaticDetermine)"></el-switch>
                                    </div>
                                    <div class="info">
                                        <span>电子秤稳定后自动确认</span>
                                    </div>
                                </div>
                            </div>
                            <div class="line autoWeight">
                                <div class="key">
                                    <span>自动称重：</span>
                                </div>
                                <div class="value switchWrap">
                                    <div class="switch">
                                        <el-switch v-model="pricingScale.Set_Hareware_Scale_AutoRA.sv_detail_is_enable" @change="saveConfigdetailList(pricingScale.Set_Hareware_Scale_AutoRA)"></el-switch>
                                    </div>
                                    <div class="info">
                                        <span>自动读称加入计重商品</span>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>

                <div class="codeBalance">
                    <div class="subTitle">
                        <span>条码秤设置</span>
                    </div>
                    <div class="containar">
                        <div class="listWrap">
                            <div class="item add" @click="addBalance">
                                <span>+新增条码秤</span>
                            </div>
                            <div class="item" :class="{'isRowFirst': (index+1)%6 === 0}" v-for="(item,index) in codeBalanceList" :key="index">
                                <div class="container" @click="showGoodsSetting(item)">
                                    <div class="itemName">
                                        <span>{{item.sv_scale_name}}</span>
                                    </div>
                                    <div class="itemRow">
                                        <div class="key">IP</div>
                                        <div class="value">{{item.sv_scale_ip}}</div>
                                    </div>
                                    <div class="itemRow">
                                        <div class="key">端口号</div>
                                        <div class="value">{{item.sv_scale_port}}</div>
                                    </div>
                                    <div class="itemRow">
                                        <div class="key">设备类型</div>
                                        <div class="value">{{item.sv_scale_type}}</div>
                                    </div>
                                    <div class="itemRow">
                                        <div class="key">备注</div>
                                        <div class="value">{{item.sv_scale_remark}}</div>
                                    </div>
                                    <div class="handleWrap">
                                        <div class="left" @click.stop="showHotkeySetting(item)">
                                            <span class="btnText">配置热键</span>
                                        </div>
                                        <div class="right">
                                            <span class="btnText" @click.stop="editBalance(item)">编辑</span>
                                            <span class="btnText ml-10" @click.stop="deleteBalance(item)">删除</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>

        <!-- 已下秤商品 -->
        <goods-setting :visible.sync="goodsSettingStatus" :dataItem="currentBalance" @success="goodsSettingSuccess"></goods-setting>
        <!-- 热键设置 -->
        <hotkey-setting :visible.sync="hotkeySettingStatus" :dataItem="currentBalance"></hotkey-setting>
        <!-- 新增-编辑条码秤 -->
        <code-balance-add :visible.sync="codeBalanceAddStatus" :dataItem="currentBalance" :isEdit="balanceEdit" @successBack="editSuccessBack"></code-balance-add>
    </div>
</template>

<style lang="scss" scope>
@import './hardware.scss';
</style>
<script src="./hardware.js"></script>
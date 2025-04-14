<template>
    <div class="cashierPay">
        <div class="btnAdd">
            <div class="btn" @click="handleAdd">新增</div>
        </div>
        <div class="contentWrap">
            <div class="header">
                <div class="td1">
                    <span>序号</span>
                </div>
                <div class="td2">
                    <span>支付方式</span>
                </div>
                <div class="td3">
                    <span>收银启用开关</span>
                </div>
                <div class="td4">
                    <span>充值/充次启用开关</span>
                </div>
                <div class="td5">
                    <span>货流要货</span>
                </div>
                <div class="td6">
                    <span>启用找零</span>
                </div>
                <div class="td7">
                    <span>快捷支付</span>
                </div>
                <div class="td8">
                    <span>排序</span>
                </div>
                <div class="td9">
                    <span>操作</span>
                </div>
            </div>
            <el-scrollbar class="tbody">
                <div class="item" v-for="(item, index) in dataList" :key="index">
                    <div class="td1">
                        <span>{{ index + 1 }}</span>
                    </div>
                    <div class="td2">
                        <div class="img">
                            <img class="img" :src="item.showIcon" />
                        </div>
                        <div class="name">
                            <span>{{ item.name }}</span>
                            <div class="tips" v-if="item.name === '扫码支付'">[支持微信和支付宝]</div>
                            <!-- <template v-if="item.name === '扫码支付'">
                                <el-tooltip class="tips" effect="dark" placement="top">
                                    <div slot="content">扫码支付支持微信和支付宝</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </template> -->
                        </div>
                    </div>
                    <div class="td3">
                        <el-switch v-model="item.settlement_enable" @change="handleSwitch(item, 1)"></el-switch>
                    </div>
                    <div class="td4">
                        <div class="content">
                            <el-switch v-model="item.recharge_enable" :disabled="item.recharge_unCheck" @change="handleSwitch(item, 3)"></el-switch>
                            <template v-if="item.recharge_unCheck || item.name === '储值卡'">
                                <el-tooltip class="tips" effect="dark" placement="top">
                                    <div slot="content">充值{{ item.name === '储值卡' ? '' : '充次' }}不支持储值卡及欠款</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </template>
                        </div>
                    </div>
                    <div class="td5">
                        <div class="content">
                            <el-switch v-model="item.cargoflow_enable" :disabled="item.cargoflow_unCheck" @change="handleSwitch(item, 6)"></el-switch>
                            <template v-if="item.cargoflow_unCheck || item.name === '储值卡'">
                                <el-tooltip class="tips" effect="dark" placement="top">
                                    <div slot="content">货流要货不支持储值卡</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </template>
                        </div>
                    </div>
                    <div class="td6">
                        <div class="content">
                            <el-switch v-model="item.is_changezero" :disabled="item.is_default" @change="handleSwitch(item, 4)"></el-switch>
                            <template v-if="item.is_default">
                                <el-tooltip v-if="item.name !== '现金'" class="tips" effect="dark" placement="top">
                                    <div slot="content">非现金及自定义支付不支持找零</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                                <el-tooltip v-else class="tips" effect="dark" placement="top">
                                    <div slot="content">现金不可关闭找零</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </template>
                        </div>
                    </div>
                    <div class="td7">
                        <div class="content">
                            <template v-if="item.name === '扫码支付'">
                                <el-switch v-model="item.is_scancode" @change="handleSwitch(item, 7)"></el-switch>
                                <el-tooltip class="tips" effect="dark" placement="top">
                                    <div slot="content">收银页面扫微信/支付宝</div>
                                    <div class="batchTips">
                                        <i class="el-icon-question"></i>
                                    </div>
                                </el-tooltip>
                            </template>
                            <el-switch v-if="item.name === '现金' || !item.is_default" v-model="item.is_fast" @change="handleSwitch(item, 5)"></el-switch>
                            <div class="unControl" v-else-if="item.name !== '扫码支付'">
                                <span>—— </span>
                                <span>——</span>
                            </div>
                        </div>
                    </div>
                    <div class="td8">
                        <div class="sort">
                            <!-- 置顶 -->
                            <!-- <template v-if="index !== 0">
                                <div class="sortBtn up" @click="setPaymentSort(item, 'top')" title="置顶">
                                    <div class="show">
                                        <i class="el-icon-upload2"></i>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="sortBtn up">
                                    <div class="show disabled">
                                        <i class="el-icon-upload2"></i>
                                    </div>
                                </div>
                            </template> -->
                            <!-- 上升 -->
                            <template v-if="index !== 0">
                                <div class="sortBtn up" @click="setPaymentSort(item, 'up')" title="向前排一位">
                                    <div class="show">
                                        <i class="el-icon-top"></i>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="sortBtn up">
                                    <div class="show disabled">
                                        <i class="el-icon-top"></i>
                                    </div>
                                </div>
                            </template>
                            <!-- 下降 -->
                            <template v-if="index !== dataList.length - 1">
                                <div class="sortBtn down" @click="setPaymentSort(item, 'down')" title="向后排一位">
                                    <div class="show">
                                        <i class="el-icon-bottom"></i>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="sortBtn down">
                                    <div class="show disabled">
                                        <i class="el-icon-bottom"></i>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="td9">
                        <div class="control" v-if="!item.is_default">
                            <span class="btn" @click="handleEdit(item)">编辑</span>
                            <span class="btn" @click="handleDelete(item)">删除</span>
                        </div>
                        <div class="unControl" v-else title="默认支付方式不支持操作">
                            <span>—— </span>
                            <span>——</span>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <el-dialog :title="isEdit ? '修改支付方式' : '新增支付方式'" :append-to-body="true" :visible.sync="newVisible" width="500px" center class="paymentUpdate system_dialog">
            <div class="dialogContent">
                <el-form label-width="100px" :model="dialogInfo" :rules="dialogRules">
                    <el-form-item label="名称：" prop="payName">
                        <el-input :disabled="isEdit" v-model="dialogInfo.payName" placeholder="请输入支付方式名称" />
                    </el-form-item>
                    <el-form-item label="图片：" prop="payIcon">
                        <div class="icon" :class="{ selected: index === iconSelectedPos }" v-for="(item, index) in customIconList" :key="index" @click="iconSelectedPos = index">
                            <img class="img" :src="item.icon" />
                        </div>
                        <!-- <ImportImg :dataJson="ImportImgJson" @callback="callbackImportImg"></ImportImg> -->
                    </el-form-item>
                </el-form>
                <div class="dialogBtn">
                    <div class="btn" v-debounce="handleDialogSure">确定</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scope>
@import './cashierPay.scss';
</style>
<script src="./cashierPay.js"></script>

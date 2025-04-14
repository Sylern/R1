<!--新增会员、学员-->
<template>
    <div class="memberAdd" v-if="dialogVisible" @keyup.stop="" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <!-- <dc-dialog width="500" height="700" :title="'新增' + $store.getters.memberText" @close="closeDialog"> -->
        <dc-dialog width="500" :height="hasStoreCard ? '640' : '726'" @close="closeDialog">
            <div class="contentWrap">
                <div class="contentTop">
                    <div class="popTitle">{{ '新增' + $store.getters.memberText }}</div>
                    <div class="headImg">
                        <ImportImg :dataJson="memberLogo" @callback="handleImgBack" isTakePhoto width="120" :typeEntity="typeEntity" :verifyJson="verifyJson"></ImportImg>
                    </div>
                </div>
                <div class="inputWrap">
                    <el-form :model="formData" :rules="rules" ref="form">
                        <el-form-item prop="sv_mr_cardno" class="lineBox">
                            <div class="moneyBox">
                                <div class="moneyBoxInput">
                                    <el-input v-model.trim="formData.sv_mr_cardno" @input.native.prevent="handleInputNumber" @focus="$event.currentTarget.select()" placeholder="请输入卡号">
                                        <div class="key" slot="prefix" v-textStar>卡号</div>
                                    </el-input>
                                </div>
                                <div class="moneyBoxInput">
                                    <el-input v-model.trim="formData.sv_mr_mobile" maxlength="11" @input.native.prevent="handleInputNumber" placeholder="请输入手机号码">
                                        <div class="key" slot="prefix" v-textStar>手机</div>
                                    </el-input>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item prop="sv_mr_name" class="lineBox">
                            <div class="inputBox">
                                <div class="key" v-textStar>姓名</div>
                                <el-input ref="sv_mr_name" v-model.trim="formData.sv_mr_name" maxlength="8" placeholder="请输入姓名"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="memberlevel_id" class="lineBox">
                            <div class="inputBox">
                                <div class="key" v-textStar>等级</div>
                                <el-select v-model.trim="formData.memberlevel_id" :placeholder="'请选择' + $store.getters.memberText + '等级'">
                                    <el-option v-for="(item, index) in levelList" :key="index" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_mrr_money" class="lineBox" v-if="!hasStoreCard">
                            <div class="moneyBox">
                                <div class="moneyBoxInput">
                                    <el-input v-model.trim="formData.sv_mrr_money" maxlength="8" @input.native.prevent="handleInputNumber" placeholder="请输入开卡金额">
                                        <div class="key" slot="prefix">开卡金额</div>
                                    </el-input>
                                </div>
                                <div class="moneyBoxInput">
                                    <el-input v-model.trim="formData.sv_mrr_present" maxlength="8" @input.native.prevent="handleInputNumber" placeholder="请输入赠送金额">
                                        <div class="key" slot="prefix">赠送金额</div>
                                    </el-input>
                                </div>
                            </div>
                        </el-form-item>

                        <!-- <el-form-item prop="sv_mrr_present" class="lineBox"></el-form-item> -->

                        <el-form-item prop="sv_mrr_payment" class="lineBox" v-if="!hasStoreCard">
                            <div class="inputBox">
                                <div class="key">支付方式</div>
                                <el-select v-model.trim="formData.sv_mrr_payment" placeholder="请选择支付方式">
                                    <el-option v-for="(item, index) in payTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="salesClerk" class="lineBox">
                            <div class="inputBox">
                                <div class="key">开卡员工</div>
                                <el-select v-model.trim="formData.salesClerk">
                                    <el-option v-for="(item, index) in salesClerk" :key="index" :label="item.label" :value="item.value">{{ item.label }}</el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_mr_pwd" class="lineBox">
                            <div class="inputBox">
                                <div class="key">{{ $store.getters.memberText }}密码</div>
                                <el-input v-model.trim="formData.sv_mr_pwd" type="password" maxlength="6" autocomplete="new-password" @input.native.prevent="handleInputNumber" :placeholder="'请输入' + $store.getters.memberText + '密码'"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_mr_remark" class="lineBox">
                            <div class="inputBox">
                                <div class="key">备注</div>
                                <el-input v-model.trim="formData.sv_mr_remark" placeholder="请输入备注"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="btnWrap">
                <div class="switchPrint">
                    <span class="checkPrintText">是否打印小票</span>
                    <el-switch v-model="checkPrint"></el-switch>
                </div>
                <div class="btnSure" @click="handleEnter">确定</div>
            </div>
        </dc-dialog>
        <!-- 扫码支付 -->
        <converge-pay :visible.sync="isScanning" @convergePayApi="appRecharge" @closePay="isScanning = false"></converge-pay>
    </div>
</template>
<style lang="scss" scoped>
@import './memberAdd.scss';
</style>
<script src="./memberAdd.js"></script>

<!--支付方式-->
<template>
    <div class="payTypeList">
        <audio ref="showScan" src="https://ros.decerp.cc/res/audio/show_pay_code.ogg" hidden></audio>
        <div class="multiPay" v-if="isMultiPay">
            <span>组合支付</span>
            <el-switch v-model="isInMultiPay" v-permission="{permission: CashierManage && CashierManage.Combined_Pay_Switch, fn: handleMultiPayChange, fnType: 'switch', executableDefault: () => (isInMultiPay = false)}"></el-switch>
        </div>
        <div class="listWrap">
            <template v-for="(item,index) in payTypeList">
                <div class="item" :class="{'selected': paySelectedList.filter(e => e.name === item.name).length > 0,'disabled':isDisabled}" :key="index" v-if="item.isShow" @click="changePayType(item)">
                    <div class="imgWrap">
                        <img class="img" :src="item.showIcon" />
                    </div>
                    <div class="payTypeName">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="corner">
                        <cmd-icon type="icon-gouxuan1" color="rgba(var(--main-theme-color), 1);" size="36"></cmd-icon>
                    </div>
                </div>
            </template>
            <slot name="downPayment"></slot>
        </div>
        <!-- 扫码弹窗 -->
        <dc-dialog v-show="payScanVisible" width="410" height="410" class="qr_pay" @close="btnScanClose">
            <div class="pay_content">
                <div class="pc_title">扫码付款</div>
                <div class="pc_item" v-if="payStep==0">
                    <div class="pci_img_wrap"><img class="img pci_img" :src="$store.state.base.frontImgBase+'/images/vip/scanning.gif'"></div>
                    <el-input v-model="queryPay.authCode" class="pci_text authcode" @focus="scanInputErr=false" @blur="scanInputErr=true" @keyup.native.stop="concatAuthcode" placeholder="请出示付款码" ref="scaningCode"></el-input>
                    <div :style="'visibility:'+(scanInputErr?'visible':'hidden')" class="authcode_err">请点击输入框后扫码</div>
                    <!-- <div class="pci_text">扫描客户二维码收款</div> -->
                </div>
                <div class="pc_item" v-if="payStep==1">
                    <div class="pci_img_wrap"><i class="el-icon-loading pci_icon"></i></div>
                    <div class="pci_text">
                        <div v-if="queryPay.queryId" class="queryNumber">支付批次号：{{ queryPay.queryId }}</div>
                        <div>正在支付中，请勿进行其他操作</div>
                    </div>
                </div>
                <div class="pc_item" v-if="payStep==2">
                    <div class="pci_img_wrap"><i class="el-icon-circle-check pci_icon"></i></div>
                    <div class="pci_text">支付成功</div>
                </div>
                <div class="pc_item" v-if="payStep==3">
                    <div class="pci_img_wrap"><i class="el-icon-circle-close pci_icon"></i></div>
                    <div class="pci_text">支付失败</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './payTypeList.scss';
</style>
<script src="./payTypeList.js"></script>
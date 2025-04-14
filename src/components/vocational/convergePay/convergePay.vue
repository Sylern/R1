
<template>
    <dc-dialog v-show="dialogVisible" width="410" height="410" class="qr_pay" @close="handleScanClose">
        <div class="pay_content">
            <div class="pc_title">扫码付款</div>
            <div class="pc_item" v-if="payStep==0">
                <div class="pci_img_wrap"><img class="img pci_img" :src="$store.state.base.frontImgBase+'/images/vip/scanning.gif'"></div>
                <el-input v-model="authcode" class="pci_text authcode" @focus="scanInputErr=false" @blur="scanInputErr=true" @keyup.native="concatAuthcode" placeholder="请出示付款码" ref="scaningCode"></el-input>
                <div :style="'visibility:'+(scanInputErr?'visible':'hidden')" class="authcode_err">请点击输入框后扫码</div>
                <!-- <div class="pci_text">扫描客户二维码收款</div> -->
            </div>
            <div class="pc_item" v-if="payStep==1">
                <div class="pci_img_wrap"><i class="el-icon-loading pci_icon"></i></div>
                <div class="pci_text">正在支付中，请勿进行其他操作</div>
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
</template>

<style lang="scss" scoped>
@import "./convergePay.scss";
</style>
<script src="./convergePay.js"></script>

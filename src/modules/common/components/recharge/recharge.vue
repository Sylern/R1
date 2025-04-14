<!-- 会员充值 --> 
<template>
    <el-dialog title="会员充值" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="468px" center class="recharge_dialog">
        <el-form ref="form" :model="form" label-width="90px">
            <el-form-item label="充值金额:">
                <el-input v-model="form.rechargeMoney"></el-input>
            </el-form-item>
            <el-form-item label="赠送金额:">
                <el-input v-model="form.giveMoney"></el-input>
            </el-form-item>
            <el-form-item label="充值活动:" class="item_activity"></el-form-item>
            <el-form-item label="" label-width="10px">
                <div class="activity_wrap">
                    <el-radio v-model="form.activity" label="1" border>充100送10元<br />送券：折扣券5折</el-radio>
                    <el-radio v-model="form.activity" label="2" border>充100送10积分<br />送券：代金券30元</el-radio>
                </div>
            </el-form-item>
            <el-form-item label="备注信息:">
                <el-input v-model="form.remarks" placeholder="最多输入50字"></el-input>
            </el-form-item>
            <el-form-item label="销售人员:">
                <el-button type="text">选择</el-button>
            </el-form-item>
            <el-form-item label="打印小票:">
                <el-checkbox type="textarea" v-model="form.print" checked></el-checkbox>
            </el-form-item>
            <el-form-item label="" label-width="6px">
                <div class="payment_wrap">
                    <el-radio v-model="form.payment" label="现金" border><img class="img" :src="$store.state.base.frontImgBase+'/images/vip/cash.png'" alt=""><br />现金</el-radio>
                    <el-radio v-model="form.payment" label="银行卡" border><img class="img" :src="$store.state.base.frontImgBase+'/images/vip/bankCard.png'" alt=""><br />银行卡</el-radio>
                    <el-radio v-model="form.payment" label="扫码支付" border><img class="img" :src="$store.state.base.frontImgBase+'/images/vip/scan.png'" alt=""><br />扫码支付</el-radio>
                    <el-radio v-model="form.payment" label="储值卡" border><img class="img" :src="$store.state.base.frontImgBase+'/images/vip/StoredValueCard.png'" alt=""><br />储值卡</el-radio>
                    <el-radio v-model="form.payment" label="商场代收" border><img class="img" :src="$store.state.base.frontImgBase+'/images/vip/collection.png'" alt=""><br />商场代收</el-radio>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="centerDialogVisible = false" style="width:378px;">确 定</el-button>
        </span>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './recharge.scss';
</style>
<script src="./recharge.js"></script>
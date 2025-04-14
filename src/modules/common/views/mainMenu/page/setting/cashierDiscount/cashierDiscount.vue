<template>
    <div class="cashierDiscount">
        <!-- <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">门店自行设置</span>
                    <span class="itemSub">开启后门店可自行设置抹零设置</span>
                </div>
                <div class="right">
                    <el-switch v-model="switchStatus"></el-switch>
                </div>
            </div>
        </div> -->
        <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">销售抹零设置</span>
                    <span class="itemSub">开启后销售时可使用销售抹零功能</span>
                </div>
                <div class="right">
                    <el-switch v-model="switchStatus" @change="handleSwitch"></el-switch>
                </div>
            </div>
            <div class="itemContent">
                <el-radio-group v-removeAria class="radioWrap" v-model="radioValue" @change="handleRadio">
                    <div class="radioBox">
                        <el-radio :label="0" :disabled="!switchStatus" :value="0">
                            <div class="radioName">抹角</div>
                            <div class="tips">向下抹角，如1.9元，则实收1.0元</div>
                        </el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio :label="1" :disabled="!switchStatus" :value="1">
                            <div class="radioName">抹分</div>
                            <div class="tips">向下抹分，如1.99元，则实收1.9元</div>
                        </el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio :label="5" :disabled="!switchStatus" :value="5">
                            <div class="radioName">四舍五入到角</div>
                            <div class="tips">四舍五入抹分，如1.94元，则实收1.9元；如1.95元，则实收2.00元</div>
                        </el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio :label="6" :disabled="!switchStatus" :value="6">
                            <div class="radioName">四舍五入到元</div>
                            <div class="tips">四舍五入抹角，如1.49元，则实收1.00元；如1.50元，则实收2.00元</div>
                        </el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div>
        <div class="itemBox mian" v-if="false">
            <div class="top">
                <div class="left">
                    <span class="itemName">订单低于最低折/最低价结算</span>
                    <!-- <span class="itemSub">开启后订单低于最低折或最低价也可以结算</span> -->
                </div>
                <div class="right">
                    <el-switch v-model="dataObj.Cash_Allow_Without_Discount.enable" @change="switchControlSub('Cash_Allow_Without_Discount')"></el-switch>
                </div>
            </div>
        </div>
        <!-- <div class="itemBox">
            <div class="top">
                <div class="left">
                    <span class="itemName">门店自行设置</span>
                    <span class="itemSub">开启后门店可自行设置是否低于最低折或最低价也可以结算</span>
                </div>
                <div class="right">
                    <el-switch v-model="switchStatus"></el-switch>
                </div>
            </div>
            <div class="itemContent">
                <el-radio-group v-removeAria class="radioWrap" v-model="radioValue">
                    <div class="radioBox">
                        <el-radio label="全选" :value="1"></el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio label="岗位1" :value="2"></el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio label="店长" :value="3"></el-radio>
                    </div>
                    <div class="radioBox">
                        <el-radio label="岗位3" :value="4"></el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div> -->
        <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">促销产品退货</span>
                    <span class="itemSub">开启后促销产品可以退货</span>
                </div>
                <div class="right">
                    <el-switch v-model="dataObj.PromotionSaleProduct.enable" @change="switchControl('PromotionSaleProduct')"></el-switch>
                </div>
            </div>
        </div>
        <!-- <div class="itemBox">
            <div class="top">
                <div class="left">
                    <span class="itemName">门店自行设置</span>
                    <span class="itemSub">开启后门店可自行设置是否促销商品可以退货</span>
                </div>
                <div class="right">
                    <el-switch v-model="switchStatus"></el-switch>
                </div>
            </div>
        </div> -->
        <!-- <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">批发价计算会员积分</span>
                    <span class="itemSub">开启后批发价销售的商品也可以计算积分</span>
                </div>
                <div class="right">
                    <el-switch v-model="dataObj.Trade_price_Calculate_integral.enable" @change="switchControlSub('Trade_price_Calculate_integral')"></el-switch>
                </div>
            </div>
        </div>
        <div class="itemBox mian">
            <div class="top">
                <div class="left">
                    <span class="itemName">促销商品计算会员积分</span>
                    <span class="itemSub">开启后批发价销售的商品也可以计算积分</span>
                </div>
                <div class="right">
                    <el-switch v-model="switchStatus"></el-switch>
                </div>
            </div>
        </div> -->
    </div>
</template>

<style lang="scss" scope>
@import './cashierDiscount.scss';
</style>
<script src="./cashierDiscount.js"></script>
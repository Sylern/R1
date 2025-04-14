<!--改价弹窗-->
<template>
    <div class="priceChange" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="468" :height="currentMenuPos == 0 ? 670 : 710" @close="closeDialog">
            <div class="contentWrap">
                <div class="menuBox">
                    <div class="menuItem left" :class="{ 'selected': currentMenuPos == 0 }" @click.stop="changeMenu(0)">改价</div>
                    <div class="menuItem right" :class="{ 'selected': currentMenuPos == 1 }" @click.stop="changeMenu(1)">折扣</div>
                </div>
                <!-- <div class="canDiscountMoney" v-if="!$app.isNull(discountMoney)">可优惠金额：{{$app.moneyFixed(canDiscountMoney)}}</div> -->
                <el-input class="inputWrap" v-if="currentMenuPos == 0" :placeholder="inputMoneyPla" ref="inputMoney" v-model.trim="inputMoney" @keyup.native.stop="handlePrevent" @blur="handleInputBlur" @input.native.prevent="handleInput" @clear="clearInput" clearable></el-input>
                <el-input class="inputWrap discount" v-if="currentMenuPos == 1" ref="inputDiscount" v-model.trim="inputDiscount" @keyup.native.stop="handlePrevent" @blur="handleInputBlur" @input.native.prevent="handleInput" @clear="clearInput" clearable>
                    <!-- <span slot="prefix" class="priceText">价格：{{inputMoney}} x 0.1 x</span> -->
                </el-input>
                <div class="discountWrap" v-if="currentMenuPos == 1">
                    <div class="item" v-for="(item, index) in discountList" :key="index" @click="handleDiscount(item)">
                        <div class="btn">
                            <span>{{item.value}}折</span>
                        </div>
                    </div>
                    <div class="item" @click="handleDiscount({value: 0})">
                        <div class="btn define">
                            <span>自定义</span>
                        </div>
                    </div>
                </div>
                <div class="listWrap">
                    <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                        <div class="keyItem">{{item.key}}</div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnGive" v-if="showGive" @click="handleGive">赠送</div>
                    <div class="btnSure" @click="handleSure">确定</div>
                </div>
            </div>
        </dc-dialog>

        <!-- 自定义折扣 -->
        <custom-discount :visible.sync="customDiscountStatus"></custom-discount>
    </div>
</template>

<style  lang="scss" scoped>
@import './priceChange.scss';
</style>
<script src="./priceChange.js"></script>
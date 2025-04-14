<!--自定义折扣弹窗-->
<template>
    <div class="customDiscount" ref="customDiscount" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="4.68" height="8.1" title="自定义" @close="closeDialog">
            <div class="contentWrap">
                <template v-for="(item,index) in currentDiscountList">
                    <el-input class="inputWrap" :class="{'selected': inputWrapPos === index}" :ref="'inputMoney'+index" :key="index" v-model.trim="item.value" @focus="handleFocus($event,index)" @keyup.native.stop="handlePrevent" @blur="handleInputBlur" @input.native.prevent="handleInput" @clear="clearInput(index)" clearable>
                        <span class="label" slot="prefix">{{item.label}}</span>
                    </el-input>
                </template>
                
                <div class="listWrap">
                    <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                        <div class="keyItem">{{item.key}}</div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleSure">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './customDiscount.scss';
</style>
<script src="./customDiscount.js"></script>
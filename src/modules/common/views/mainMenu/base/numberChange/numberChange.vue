<template>
    <div class="numberChange" v-if="dialogVisible">
        <dc-dialog width="468" height="660" :title="title" @close="handleBtnClose">
            <div class="ncContentWrap" tabindex="0" @keyup.stop="listenKeyup">
                <el-input class="inputWrap" ref="inputNumber" maxlength="21" v-model.trim="inputNumber" @focus="handleFocus" @keyup.native.stop="handlePrevent" @blur="handleInputBlur" @input.native.prevent="handleInput" @clear="clearInputNumber" clearable></el-input>
                <div class="listWrap">
                    <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                        <div class="keyItem">{{item.key}}</div>
                    </div>
                </div>
                <div class="btnSure" @click="handleSure">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './numberChange.scss';
</style>
<script src="./numberChange.js"></script>
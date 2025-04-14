<template>
    <div class="popCashmoney" v-if="dialogVisible">
        <dc-dialog width="4.68" height="6.6" title="请输入备用金" @close="closeDialog">
            <div class="ncContentWrap" tabindex="0" @keyup.stop="listenKeyup">
                <el-input class="inputWrap" ref="inputNumber" v-model.trim="inputNumber" @focus="handleFocus" @keyup.native.stop="handlePrevent" @input.native.prevent="handleInput" @clear="clearInputNumber" clearable></el-input>
                <div class="listWrap">
                    <div class="listItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                        <div class="keyItem">{{item.key}}</div>
                    </div>
                </div>
                <div class="btnSure" @click="handleSure">开班</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './popCashmoney.scss';
</style>
<script src="./popCashmoney.js"></script>
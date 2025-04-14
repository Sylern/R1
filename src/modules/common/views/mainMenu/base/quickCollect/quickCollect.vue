<!--无码收银弹窗-->
<template>
    <div class="quickCollect" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="468" height="660" title="无码收银金额输入" @close="closeDialog">
            <div class="contentWrap">
                <el-input class="inputWrap" ref="inputMoney" v-model.trim="inputMoney" @focus="handleFocus" @blur="handleInputBlur" @keyup.native.stop="handleInput" @clear="clearInputMoney" clearable></el-input>
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
@import './quickCollect.scss';
</style>
<script src="./quickCollect.js"></script>
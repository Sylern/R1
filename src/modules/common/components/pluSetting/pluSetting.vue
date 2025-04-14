<template>
    <div class="pluSetting" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="4.68" height="6.6" title="PLU码设置" @close="closeDialog">
            <div class="ncContentWrap">
                <el-input class="inputWrap" ref="inputNumber" disabled v-model.trim="inputNumber" maxlength="4"></el-input>
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
@import './pluSetting.scss';
</style>
<script src="./pluSetting.js"></script>
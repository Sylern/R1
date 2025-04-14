<!--快捷键设置-->
<template>
    <div class="shortcutSetting" ref="shortcutSetting" v-if="dialogVisible" tabindex="0" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <dc-dialog width="14.8" height="6.4" title="快捷键设置" @close="closeDialog">
            <div class="contentWrap">
                <div class="keyboardWrap" v-scale>
                    <div class="lineOne">
                        <template v-for="(item, index) in keyboardList.lineOne">
                            <div class="item" :key="index" :class="{'used':item.handleName, 'mr_26': index %4 === 0, 'item_first': index === 0, 'mr_18': index === keyboardList.lineOne.length - 2}">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                        </template>
                    </div>
                    <div class="lineTwo">
                        <template v-for="(item, index) in keyboardList.lineTwo">
                            <div class="item" :class="{'used':item.handleName, 'otherWidth': item.otherStyle, 'item_last': index === keyboardList.lineThree.length - 1}" :key="index">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                        </template>
                    </div>
                    <div class="lineThree">
                        <template v-for="(item, index) in keyboardList.lineThree">
                            <div class="item" :key="index" :class="{'used':item.handleName, 'item_first': index === 0, 'otherMargin': item.otherMargin, 'item_last': index === keyboardList.lineThree.length - 1}">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                        </template>
                    </div>
                    <div class="lineFour">
                        <template v-for="(item, index) in keyboardList.lineFour">
                            <div class="item" :key="index" :class="{'used':item.handleName, 'item_first': index === 0, 'otherMargin': item.otherMargin}">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                        </template>
                    </div>
                    <div class="lineFive">
                        <template v-for="(item, index) in keyboardList.lineFive">
                            <div class="item" :key="index" :class="{'used':item.handleName, 'item_first': index === 0, 'otherMargin': item.otherMargin, 'item_last': index === keyboardList.lineFive.length - 1}">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                        </template>
                    </div>
                    <div class="lineSix">
                        <template v-for="(item, index) in keyboardList.lineSix">
                            <div class="item" :key="index" v-if="!item.inBox" :class="{'used':item.handleName, 'item_first': index === 0, 'isSpace': item.isSpace, 'isZero': item.isZero}">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{item.handleName}}</div>
                            </div>
                            <div class="inBox" v-else :key="index">
                                <template v-for="(i,pos) in item.list">
                                    <div class="isTop" :key="pos" v-if="i.isTop">
                                        <div class="item" :key="index+pos" :class="{'used':i.handleName}">
                                            <div class="keyName">
                                                <span>{{i.keyName}}</span>
                                                <span class="handleName">{{i.handleName}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item inline" v-else :class="{'used':i.handleName, 'isLast': pos === item.list.length - 1}" :key="index+pos">
                                        <div class="keyName">
                                            <div>{{i.keyName}}</div>
                                            <div class="handleName">{{i.handleName}}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>
<style  lang="scss" scoped>
@import './shortcutSetting.scss';
</style>
<script src="./shortcutSetting.js"></script>
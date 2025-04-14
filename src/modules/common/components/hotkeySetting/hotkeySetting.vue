<!--热键设置-->
<template>
    <div class="hotkeySetting" ref="hotkeySetting" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="9.7" height="6.2" title="热键设置" @close="closeDialog">
            <div class="contentWrap">
                <div class="keyboardWrap" v-scale>
                    <div class="lineWrap lineOne">
                        <div v-for="(item, index) in keyboardList.lineOne" :key="index">
                            <div class="item bg1" :class="{'bg2': index > 6, 'separate': index == 6, 'isLast': index === keyboardList.lineOne.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineTwo">
                        <div v-for="(item, index) in keyboardList.lineTwo" :key="index">
                            <div class="item bg1" :class="{'bg2': index > 7, 'separate': index == 7, 'isLast': index === keyboardList.lineTwo.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineThree">
                        <div v-for="(item, index) in keyboardList.lineThree" :key="index">
                            <div class="item bg1" :class="{'bg2': index > 7, 'separate': index == 7, 'isLast': index === keyboardList.lineThree.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineFour">
                        <div v-for="(item, index) in keyboardList.lineFour" :key="index">
                            <div class="item" :class="{'bg3': index < 8, 'separate': index == 7, 'isLast': index === keyboardList.lineFour.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">
                                    <span v-if="$app.isNull(item.keyValue)"></span>
                                    <span v-else>{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineFive">
                        <div v-for="(item, index) in keyboardList.lineFive" :key="index">
                            <div class="item" :class="{'bg3': index < 8, 'separate': index == 7, 'isLast': index === keyboardList.lineFive.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">
                                    <span v-if="$app.isNull(item.keyValue)"></span>
                                    <span v-else>{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineSix">
                        <div v-for="(item, index) in keyboardList.lineSix" :key="index">
                            <div class="item" :class="{'bg3': index < 8, 'separate': index == 7, 'isLast': index === keyboardList.lineSix.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">
                                    <span v-if="$app.isNull(item.keyValue)"></span>
                                    <span v-else>{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lineWrap lineSeven">
                        <div v-for="(item, index) in keyboardList.lineSeven" :key="index">
                            <div class="item" :class="{'bg3': index < 8, 'separate': index == 7, 'isLast': index === keyboardList.lineSeven.length-1}" @click="showNumberChange(item)">
                                <div class="keyName">{{item.keyName}}</div>
                                <div class="handleName">
                                    <span v-if="$app.isNull(item.keyValue)"></span>
                                    <span v-else>{{$app.isNull(item.userKeycode) || item.userKeycode === '0000' ? '未设置' : item.userKeycode}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">保存并下发</div>
                </div>
            </div>
        </dc-dialog>
        <!-- PLU弹窗设置 -->
        <plu-setting :visible.sync="pluSettingStatus" :dataScale="dataItem" :keyItem="keyItem" :keyNumList.sync="keyNumList" @success="updateKeySetting"></plu-setting>
    </div>
</template>
<style  lang="scss" scoped>
@import './hotkeySetting.scss';
</style>
<script src="./hotkeySetting.js"></script>
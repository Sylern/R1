<!--收银艺人技能弹窗-->
<template>
    <div class="goodsAssistant" ref="goodsAssistant" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="800" height="580" @close="closeDialog">
            <div class="contentWrap">
                <div class="employeeInfo">
                    <div class="imgBox">
                        <img class="img" v-if="!$app.isNull(goodsImg)" :src="goodsImg" />
                        <img class="img" v-else :src="$store.state.base.frontImgBase+'/images/default.png'" />
                    </div>
                    <div class="employeeText">
                        <div class="employeeName">{{ popAssistant.sv_employee_name }}</div>
                        <div class="employeeNumber">{{ popAssistant.sv_employee_number }}</div>
                    </div>
                </div>
                <!-- 多规格 -->
                <div class="multiSpecWrap">
                    <el-scrollbar ref="multiSpecWrap" style="width:100%; height: 100%;">
                        <div class="specContent">
                            <div class="subTitle">技能</div>
                            <div class="contentList">
                                <div class="specItem" :class="{ selected: index === mainIndex }" v-for="(item, index) in specGoodsList" :key="index" @click="handleMain(item, index)">
                                    <div class="itemText">{{ item.sv_p_name }}</div>
                                </div>
                            </div>
                            <div class="subTitle">模式</div>
                            <div class="contentList" v-if="mainIndex > -1">
                                <div class="specItem" :class="{ selected: index === subIndex }" v-for="(item, index) in specGoodsList[mainIndex].pr_list" :key="index" @click="handleSub(item, index)">
                                    <div class="itemText">{{ item.sv_p_name }}</div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="bottomWrap">
                <div class="btnSure" @click="handleSure">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsAssistant.scss';
</style>
<script src="./goodsAssistant.js"></script>
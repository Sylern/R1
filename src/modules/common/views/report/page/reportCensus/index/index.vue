
<template>
    <div class="intelligentAnalytics">
        <div class="navWrap">
            <div class="title" @click="showHome">智能分析</div>
            <el-scrollbar class="el-srcoll">
                <div class="menuItem" v-for="(item,index) in list" :key="item.sv_func_id">
                    <div class="navmenu_one">
                        <div class="nav_oneTitle" @click="handleChildShow(item,index)" :class="{'selected': item.isOnly && item.sv_func_id === selectedFirst}">
                            <div :class="{'selected':item.children.findIndex(e=>e.sv_func_id===selectedFirst)>-1 }" v-if="!$app.isNull(item.children)">
                                <i class="el-icon-arrow-down" v-if="item.showChild"></i>
                                <i class="el-icon-arrow-right" v-else></i>
                            </div>
                            <cmd-icon type="icon-xiazai" size="20" v-if="item.sv_func_id==='311-1'"></cmd-icon>
                            <label>{{item.sv_func_name}}</label>
                        </div>
                        <div class="navmenu_tow" v-if="item.showChild">
                            <div class="nav_towName" :class="{'selected': selectedSecond === k.sv_func_id}" v-for="k in item.children" :key="k.sv_func_code" @click="onChildClick(item,k)">{{k.sv_func_name}}</div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <!-- main主要内容 -->
        <help-center :pageName="pageName" pageWidth="calc(100% - 140px)" :DocTypeIdFilter="helpCenterListId">
            <div v-if="isHtml" class="containt">
                <el-scrollbar style="height:100%;width:100%;min-height:80vh;">
                    <div class="section">
                        <div v-for="item in list" :key="item.sv_func_id" class="group">
                            <template v-if="!$app.isNull(item.children)">
                                <div class="title">{{item.sv_func_name}}</div>
                                <div class="items">
                                    <a @click="onChildClick(item,children)" v-for="children in item.children" :key="children.sv_func_id" class="item">
                                        <img class="img" :src="children.sv_func_icon_n3" />
                                        <div class="nameText">
                                            <div class="name">{{children.sv_func_name}}</div>
                                            <el-tooltip effect="dark" :content="children.sv_remark" placement="bottom">
                                            <div class="text">{{children.sv_remark}}</div>
                                            </el-tooltip>
                                        </div>
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div v-if="!isHtml" class="iframe-wrap">
                <router-view v-if="checkedItem.isVue && IsAuthority" />
                <iframe v-else :src="html" frameborder="0" class="iframe" scrolling="no" style="min-height:100%; padding-right:20px;"></iframe>
            </div>
        </help-center>
    </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
<script src="./index.js"></script>

<!--入口框架-->
<template>
    <div class="mainTem">
        <!-- main头部 -->
        <div class="mt_top"></div>
        <!-- main内容 -->
        <section class="mt_section">
            <!-- main左侧 -->
            <div class="mt_left">
                <!-- 一级菜单 -->
                <div class="mt_oneMenu"></div>
                <!-- 二级菜单 -->
                <div class="mt_towMenu">
                    <div class="mttm_title" @click="showHome">智能分析</div>
                    <div class="scrollbar">
                        <el-scrollbar ref="menuSrocll" style="height: 100%; width: 100%">
                            <template v-for="item in systemMenu">
                                <div class="navmenu" v-if="!item.isHide" :key="item.code">
                                    <div class="navmenu_one">
                                        <div class="nav_oneTitle" @click="handleChildShow(item)" :class="{ selected: selected === item.href }">
                                            <div :class="{ selected: item.children.findIndex((e) => e.href === selected) > -1 }" v-if="!$app.isNull(item.children)">
                                                <!-- <i class="el-icon-arrow-down" v-if="item.showChild"></i> -->
                                                <i class="iconLeft el-icon-arrow-right" :class="{ show: item.showChild }"></i>
                                            </div>
                                            <label>{{ item.name }}</label>
                                        </div>
                                        <div class="navmenu_tow" v-if="item.showChild">
                                            <div class="nav_towName" :class="{ selected: k.href === selected }" v-for="k in item.children" :key="k.code" @click="onChildClick(item, k)">{{ k.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-scrollbar>
                    </div>
                    <div class="downloadItem" :class="{'selected': selected === '/report/downloadReport' }" @click="handleDownLoad">
                        <cmd-icon type="icon-xiazai" color="rgba(var(--main-theme-color),1)" size="20"></cmd-icon>
                        <span class="itemName">报表下载</span>
                    </div>
                </div>
            </div>
            <!-- main主要内容 -->
            <keep-alive v-if="isHome">
                <router-view />
            </keep-alive>
            <multi-page :breadcrumb="multiPageList" v-show="!isHome" pageWidth="calc(100% - 150px)" @closePage="closePage">
                <!-- keep-alive 对应页面的name和router的name需要一致 -->
                <keep-alive :include="multiPageList.map(e => e.pageCode)">
                    <router-view />
                </keep-alive>
            </multi-page>
        </section>
    </div>
</template>

<style lang="scss" scope>
@import './main.scss';
</style>
<style lang="scss">
@import '@/assets/style/style.scss';
@import '@/assets/style/element-ui.scss';
</style>
<script src="./main.js"></script>

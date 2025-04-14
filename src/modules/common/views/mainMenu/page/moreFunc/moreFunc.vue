<template>
    <div class="moreFunc">
        <div class="pageTop">
            <div class="shopInfo">
                <div class="left">
                    <div class="shopName">
                        <span>{{this.userInfo.sv_us_name}}</span>
                    </div>
                    <!-- <div class="tag">
                        <span>{{this.userInfo.sv_versionname}}</span>
                    </div> -->
                </div>
                <div class="right">
                    <div class="iconWrap">
                        <div class="iconItem" v-for="(item, index) in topIconList" :key="index" @click="handleTopIcon(item)">
                            <img class="img" :src="item.icon" />
                        </div>
                    </div>
                    <div class="userInfo">
                        <div class="userLogo">
                            <span></span>
                        </div>
                        <div class="userName">
                            <span>{{this.userInfo.sv_d_mobile}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="funcContent">
            <el-scrollbar class="el_content" ref="scrollContent">
                <div class="listWrap">
                    <div class="listWrap-title">
                        <span>功能管理</span>
                    </div>
                    <div class="subTitle">
                        <div class="settingText">
                            <span>导航功能</span>
                        </div>
                        <div class="settingWrap" @click.stop="showEdit = !showEdit">
                            <span>快捷自定义</span>
                        </div>
                    </div>
                    <div class="listContent" @click.stop="()=>{return false}">
                        <div class="isEditWrap" v-if="showEdit"></div>
                        <div class="item" v-for="(item,index) in funcList" :key="index" @click="handleFuncItem(item)">
                            <div class="icon" v-if="!showEdit">
                                <img class="img" :src="item.iconMenu" />
                            </div>
                            <div class="icon" v-else>
                                <img class="img" v-if="item.showToMenu" :src="item.iconMenu" />
                                <img class="img" v-else :src="item.icon" />
                            </div>
                            <div class="listName">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <!-- <div class="storeListWrap">
                    <div class="listWrap-title">
                        <span>库存管理</span>
                    </div>
                    <div class="listWrap-content">
                        <div class="storeList" v-for="(item,index) in dataList" :key="index">
                            <div class="listWrap-subtitle">
                                <span>{{item.subTitle}}</span>
                            </div>
                            <div class="listContent" :style="{width: 36 + Math.ceil(item.list.length/2)*120 +'px'}">
                                <div class="item" v-for="(e,pos) in item.list" :key="pos" @click="handleListItem(e)">
                                    <div class="icon">
                                        <img class="img" v-if="e.icon" :src="e.icon" />
                                    </div>
                                    <div class="listName">{{e.name}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </el-scrollbar>
            <!-- 拖拽排序参考 https://blog.csdn.net/qq_41619796/article/details/105432486 -->
            <!-- <div class="editSetting" :class="{'isShow': showEdit}" @click.stop="()=>{return false}">
                <div class="editSetting-title">
                    <span>快捷菜单设置</span>
                    <i class="icon el-icon-close" @click="showEdit = false"></i>
                </div>
                <div class="editList">
                    <div class="item" v-for="(item,index) in editList" :key="index">
                        <div class="icon"></div>
                        <div class="listName">{{item.name}}</div>
                    </div>
                </div>
            </div> -->
        </div>

        <!-- 订单核销 -->
        <order-wiped :visible.sync="orderWipedStatus"></order-wiped>
    </div>
</template>

<style lang="scss" scope>
@import './moreFunc.scss';
</style>
<script src="./moreFunc.js"></script>
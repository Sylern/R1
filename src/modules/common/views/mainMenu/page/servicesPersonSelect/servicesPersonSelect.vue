<template>
    <div class="servicesPersonSelect" ref="servicesPersonSelect" tabindex="0" @keyup.stop="listenKeyup">
        <div class="topWrap">
            <div class="btnBack" @click="handleBack">
                <i class="el-icon-arrow-left"></i>
                <span class="text">返回</span>
            </div>
            <div class="menuWrap">
                <div class="pageTitle">
                    <span>选择开单人</span>
                </div>
                <div class="listWrap">
                    <div class="item" :class="{'selected': index === menuPos}" v-for="(item,index) in dataList" :key="index" @click="handleChangeMenu(index)">
                        <span>{{item.title}}</span>
                        <span class="selectedBar"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contentWrap">
            <div class="listWrap" v-for="(item,index) in dataList" :key="'list_'+index">
                <div class="listTitle">
                    <span>{{item.title}}</span>
                </div>
                <div class="item" v-for="(obj,pos) in item.list" :key="index+pos" @click="handleItem(item)">
                    <div class="textWrap">
                        <div class="name">
                            <span>{{obj.name}}</span>
                        </div>
                        <div class="workerNum">
                            <span>工号：{{obj.number}}</span>
                        </div>
                    </div>
                </div>
                <div class="btnAdd">
                    <span>+</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style  lang="sass" scoped>
@import "./servicesPersonSelect.scss"
</style>
<script src="./servicesPersonSelect.js"></script>
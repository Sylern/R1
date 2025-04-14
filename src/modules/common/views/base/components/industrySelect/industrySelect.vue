<template>
    <div class="industrySelect" v-if="isShow">
        <div class="contentWrap" :class="{'showList': showList}">
            <div class="topTitle">
                <img class="img listLogo" v-if="!showList || isAgent" :src="isAgent ? 'http://ds.decerp.cc/images/industry/industrySelect3.gif' : 'http://ds.decerp.cc/images/industry/industrySelect1.gif'" />
                <img class="img dekeLogo" v-if="showList && !isAgent" src="http://ds.decerp.cc/images/industry/industrySelect2.gif" />
            </div>
            <div class="lineText1" :class="{'fadein': initduration1}">
                <span>欢迎使用{{isAgent ? '' : '德客'}}门店管理系统</span>
            </div>
            <div class="lineText2" :class="{'fadein': initduration2}">
                <span>以便能更精准地帮助您高效体验和上手</span>
            </div>
            <div class="lineText3" :class="{'fadein': initduration3}">
                <span>让我们开始吧</span>
            </div>
            <div class="listContent" :class="{'show': listOpacity}">
                <div class="text">
                    <span>请选择您的行业：</span>
                </div>
                <div class="listWrap">
                    <div class="listItem" :class="{'selected': selectedId === item.sv_us_industrytype}" v-for="(item, index) in dataList" :key="index" @click="handleSelected(item)">
                        <img class="img" v-if="item.sv_industrytype_code" :src="'http://ds.decerp.cc/images/industry/'+ item.sv_industrytype_code+'.png'" />
                        <span>{{item.sv_industrytype_name}}</span>
                        <span class="cricle">
                            <span class="dot"></span>
                        </span>
                    </div>
                </div>
                <div class="btnWrap" :class="{'show': selectedId !== ''}">
                    <el-button class="btn" :disabled="isSubmitting" v-repeatClick @click="updateStoreInfo">开启门店</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./industrySelect.js"></script>

<style lang="sass" scope>
@import './industrySelect.scss';
</style>
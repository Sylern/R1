<!-- 美业收银右边商品 -->
<template>
    <div class="cashierRight">
        <div class="typeWrap">
            <div class="btnItem" :class="{ 'selected': item.type === producttype }" v-for="(item, index) in topBtnType" :key="index" @click="handleTopBtn(item)">
                <cmd-icon :type="item.icon" size="28" color="#3333333"></cmd-icon>
                <span class="typeBtnName">{{ item.name }}</span>
            </div>
        </div>
        <div class="classification">
            <div class="c_one">
                <el-scrollbar class="el_list">
                    <div class="item" :class="{'selected': firstSelected == 0}" @click="handleFirstCategoryAll">热销</div>
                    <div class="item" :class="{'selected': firstSelected == (index+1)}" v-for="(item,index) in firstCategory" :key="index" @click="handleFirstCategory(item,index+1)">{{item.sv_pc_name}}</div>
                    <div class="item add" @click="showCategoryFirst">+</div>
                </el-scrollbar>
            </div>
            <div class="c_two" v-if="firstSelected != 0">
                <el-scrollbar class="el_list">
                    <div class="item" :class="{'selected': secondSelected == 0}" @click="handleSecondCategoryAll">全部</div>
                    <div class="item" :class="{'selected': secondSelected == (index+1)}" v-for="(item,index) in secondCategory" :key="index" @click="handleSecondCategory(item,index+1)">{{item.sv_psc_name}}</div>
                    <div class="item add" @click="showCategorySecond">+</div>
                </el-scrollbar>
            </div>
        </div>
        <div class="goodsWrap">
            <goodsList ref="goodsList" darkModel :producttype="producttype" :categoryId="firstSelectedItem.id" :erjicategory="secondSelectedItem.id" />
        </div>
        <!-- 新增一级分类 -->
        <category-first-add :visible.sync="categoryFirstStatus" @callback="firstAddBack"></category-first-add>
        <!-- 新增二级分类 -->
        <category-second-add :visible.sync="categorySecondStatus" :firstCategory="firstCategory" :firstCategoryId="firstSelectedItem.id" @callback="secondAddBack"></category-second-add>
    </div>
</template>

<style  lang="sass" scoped>
@import "./cashierRight.scss"
</style>
<script src="./cashierRight.js"></script>
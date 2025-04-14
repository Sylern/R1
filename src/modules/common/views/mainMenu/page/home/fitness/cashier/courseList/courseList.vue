<!--课程列表-->
<template>
    <div class="courseWrap" ref="courseWrap">
        <div class="classification" ref="classification">
            <div class="c_one">
                <el-scrollbar class="el_list">
                    <div class="item rowFirst" :class="{ 'selected': firstSelected == 0 }" @click="handleFirstCategoryAll">
                        全部</div>
                    <div class="item"
                        :class="{ 'rowFirst': (index + 1) % 6 == 0, 'selected': firstSelected == (index + 1) }"
                        v-for="(item, index) in firstCategory" :key="index" @click="handleFirstCategory(item, index + 1)">
                        <span>{{ item.name }}</span>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="goodsWrap" :style="{ 'height': goodsWrapHeight }">
            <el-scrollbar class="listWrap" ref="courseListWrap">
                <div class="courseList">
                    <div class="courseItem" :class="{ isRight: (index + 1) % 4 === 0 }" v-for="(item, index) in courseList"
                        :key="index" @click="addCart($event, item)">
                        <div class="courseName">{{ item.sv_p_name }}</div>
                        <div class="courseProduct">
                            <span class="symbil">￥</span>
                            <span>{{ $app.moneyFixed(item.sv_product_total) }}</span>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <div class="btnWrap">
                <div class="btnList">
                    <template v-for="(item, index) in iconList">
                        <div class="btnItem btn" v-if="item.isChecked" :key="index" @click="handleItem(item)">
                            <cmd-icon :type="item.icon" size="24" color="#3333333"></cmd-icon>
                            <span>{{ item.name }}</span>
                        </div>
                    </template>
                </div>
                <div class="btnOnGoods">
                    <div class="btnLast btn" v-if="courseTotalPage > 0" :class="{ 'disabled': queryCourse.pageIndex === 1 }"
                        @click="coursePageLast">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="pages" v-if="courseTotalPage > 0">{{ queryCourse.pageIndex + '/' + courseTotalPage
                    }}</div>
                    <div class="btnNext btn" v-if="courseTotalPage > 0"
                        :class="{ 'disabled': queryCourse.pageIndex === courseTotalPage }" @click="coursePageNext">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './courseList.scss';
</style>
<script src="./courseList.js"></script>

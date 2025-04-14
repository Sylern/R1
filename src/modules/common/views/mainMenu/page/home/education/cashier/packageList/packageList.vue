<!--课程包-->
<template>
    <div class="packageList" ref="packageList">
        <el-scrollbar class="listWrap" ref="listWrap">
            <div class="listContent">
                <div class="courseItem" :class="{ isRight: (index + 1) % 4 === 0 }" v-for="(item, index) in packageList"
                    :key="index" @click="addPackageCart($event, item)">
                    <div class="courseName">{{ item.sv_p_name }}</div>
                    <div class="courseProduct">
                        <span class="symbil">￥</span>
                        <span>{{ item.sv_p_unitprice }}</span>
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
                <div class="btnLast btn" v-if="packageTotalPage > 0" :class="{ 'disabled': queryPackage.pageIndex === 1 }"
                    @click="packagePageLast">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="pages" v-if="packageTotalPage > 0">{{ queryPackage.pageIndex + '/' +
                    packageTotalPage }}</div>
                <div class="btnNext btn" v-if="packageTotalPage > 0"
                    :class="{ 'disabled': queryPackage.pageIndex === packageTotalPage }" @click="packagePageNext">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './packageList.scss';
</style>
<script src="./packageList.js"></script>

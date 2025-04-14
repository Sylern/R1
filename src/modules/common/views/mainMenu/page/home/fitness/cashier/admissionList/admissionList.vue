<!--入场卡-->
<template>
    <div class="admissionList" ref="admissionList">
        <el-scrollbar class="listWrap" ref="admissionListWrap">
            <div class="listContent">
                <div class="courseItem" :class="{ isRight: (index + 1) % 4 === 0 }" v-for="(item, index) in admissionList" :key="index" @click="addAdmissionCart($event, item)">
                    <div class="courseName">{{ item.sv_p_name }}</div>
                    <div class="courseProduct">
                        <span class="symbil">￥</span>
                        <span>{{ $app.moneyFixed(item.sv_p_unitprice) }}</span>
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
                <div class="btnLast btn" v-if="packageTotalPage > 0" :class="{ 'disabled': queryAdmission.pageIndex === 1 }" @click="packagePageLast">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="pages" v-if="packageTotalPage > 0">{{ queryAdmission.pageIndex + '/' + packageTotalPage }}</div>
                <div class="btnNext btn" v-if="packageTotalPage > 0" :class="{ 'disabled': queryAdmission.pageIndex === packageTotalPage }" @click="packagePageNext">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './admissionList.scss';
</style>
<script src="./admissionList.js"></script>

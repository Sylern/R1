<!-- 报表筛选项 -->
<template>
    <div class="reportFilter queryFilter">
        <div class="filterLeft">
            <date-time-picker class="filterItem" v-if="filterable.datetime" needTimePicker :paramData="[filterable.datetime.start, filterable.datetime.end]" @change="handleChangeTime"></date-time-picker>
            <el-select class="filterItem" v-if="filterable.store" v-model.trim="query.user_id" placeholder="请选择门店">
                <el-option label="所有门店" value="-1"></el-option>
                <el-option v-for="item in storelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select class="filterItem" v-if="filterable.customSelect" :key="index" v-model.trim="query[customSelect.key]" filterable placeholder="请选择">
                <el-option v-for="item in customSelect.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div class="btnWrap" v-if="filterable.btnCustom">
                <div class="btnItem btnPrimary small" @click="handleSearch">搜索</div>
                <div class="btnItem btnBasic small" @click="handleReset">重置</div>
            </div>
            <div class="btnExpert" v-if="filterable.export">导出申请</div>
        </div>
        <div class="filterRight searchInput">
            <el-input v-model.trim="query.keywards" v-if="filterable.search" :placeholder="filterable.search.placeholder" clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
                <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
@import './reportFilter.scss';
</style>
<script src="./reportFilter.js"></script>
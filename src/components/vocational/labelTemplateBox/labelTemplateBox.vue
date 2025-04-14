<!--  -->
<template>
    <div class="label-list-item">
        <div class="template-content">
            <div class="isdefault" v-if="item.isdefault">默认</div>
            <div class="template-view">
                <LabelTemplate :item='item' name="labelView" />
            </div>
            <div class="template-name">
                <div class="label-list-name-ellipsis" :title="item.templateName">{{item.templateName}}</div>
                <span :class="`custom ${item.isCustom&&'user'}`">{{item.isCustom?'自定义':'系统'}}</span>
            </div>
            <div class="template-info">
                <span>{{item.width}}*{{item.height}} mm</span>
                <span>{{dateFormat(item.createTime)}}</span>
            </div>
        </div>
        <div class="template-handle">
            <el-button v-if="item.isCustom" @click="handleToEdit(item)" type="text" class="template-handle-item">编辑</el-button>
            <el-button @click="clonTemplate(item)" type="text" class="template-handle-item">复制</el-button>
            <el-button v-if="item.isCustom" :disabled="item.isdefault" @click="handleToDefault(item)" type="text" class="template-handle-item">默认</el-button>
            <el-button v-if="item.isCustom" @click="deleteTemplate(item)" type="text" class="template-handle-item">删除</el-button>
        </div>
    </div>
</template>

<style lang='scss' scoped>
@import './labelTemplateBox.scss';
</style>
<script src="./labelTemplateBox.js"></script>

<!-- 标签模板列表 -->
<template>
    <div ref="tagList" class="label-list">
        <!-- <div class="label-list-btn-box">
        <router-link to="/LabelPrinting"><el-button size="medium" type="success">新建模板</el-button></router-link>&nbsp;
    </div>-->
        <el-scrollbar style="width:100%;height:100%;">
            <div class="label-list-box">
                <LabelTemplateBox v-for="(item, index) in labelTemplates" :key="item.id" :item="item" :index="index" @getTemplateByUser="getTemplateByUser" @handleAdd="handleAdd" class="label_item" />
                <div @click="handleAdd(true)" class="labelAdd">
                    <i class="el-icon-plus"></i>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script src="./tagList"></script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.label-list {
    height: 100%;
    padding: 30px 0;
    .label-list-box {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .label_item {
            width: 292px;
            height: 270px;
            margin: 10px 10px;
            border: 1px solid #dcdee0;
            border-radius: 5px;
            overflow: hidden;
        }
        .labelAdd {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 292px;
            height: 270px;
            margin: 10px 10px;
            color: #c5c4c4;
            background-color: #fff;
            cursor: pointer;
            border: 1px solid #dcdee0;
            border-radius: 5px;
            overflow: hidden;
            i {
                font-size: 70px;
            }
        }
    }
}
</style>

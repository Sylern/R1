<!--新增二级分类-->
<template>
    <div class="categorySecondAdd" v-if="dialogVisible" @keyup.stop="" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <dc-dialog width="470" height="360" title="新增二级分类" @close="closeDialog">
            <div class="contentWrap">
                <div class="inputWrap">
                    <div class="inputBox">
                        <div class="key">一级分类</div>
                        <el-select v-model.trim="querySubmit.productcategory_id" placeholder="请输入分类名称">
                            <el-option v-for="(item,index) in currentFirstCategory" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="inputBox typeName">
                        <div class="key">二级分类名称</div>
                        <el-input ref="categryName" placeholder="请输入分类名称" v-model="querySubmit.sv_pc_name"></el-input>
                    </div>
                    <div class="inputBox typeCode">
                        <div class="key">分类编码</div>
                        <el-input placeholder="请输入分类编码" v-model="querySubmit.sv_pc_code"></el-input>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './categorySecondAdd.scss';
</style>
<script src="./categorySecondAdd.js"></script>
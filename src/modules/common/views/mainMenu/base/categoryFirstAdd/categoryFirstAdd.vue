<!--新增一级分类-->
<template>
    <div class="categoryFirstAdd" v-if="dialogVisible" @keyup.stop="" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <dc-dialog width="470" height="360" title="新增一级分类" @close="closeDialog">
            <div class="contentWrap">
                <div class="menuBox">
                    <div class="item left" :class="{'selected': querySubmit.producttype_id == 0}" @click="changeMenu(0)">产品类型</div>
                    <div class="item right" :class="{'selected': querySubmit.producttype_id == 1}" @click="changeMenu(1)">服务类型</div>
                </div>
                <div class="inputWrap">
                    <div class="inputBox typeName">
                        <div class="key">分类名称</div>
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
@import './categoryFirstAdd.scss';
</style>
<script src="./categoryFirstAdd.js"></script>
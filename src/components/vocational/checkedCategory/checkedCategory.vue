<template>
    <el-dialog title="商品分类" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="400px" center class="system_dialog">
        <div class="checkedCategory">
            <div class="searchInput">
                <el-input placeholder="请输入商品分类" clearable @clear="filterCategoryList" @keyup.enter.native="filterCategoryList" v-model.trim="keywards">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="contentWrap">
                <el-scrollbar style="height:100%; width:100%;">
                    <div v-for="item in filterList" :key="item.id" class="dl" :class="{'showChildren': item.isShowChildren}">
                        <div @click="handleClick(item)" class="title">
                            <div class="checkBox">
                                <el-checkbox v-model.trim="item.isCheck" @click.native.prevent="returnFn"></el-checkbox>
                            </div>
                            <div>{{item.label}}</div>
                            <!-- <i v-if="item.children.length > 0" :class="[item.isShowChildren ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i> -->
                        </div>
                        <!-- <div v-if="item.isShowChildren" class="childrenWrap">
                            <div class="cld" v-for="k in item.children" @click="handleChildClick(k)" :key="k.id" :class="{active:checkedTowId===k.id}">
                                <div class="checkBox">
                                    <el-checkbox v-model.trim="k.isCheck"></el-checkbox>
                                </div>
                                <span>{{k.label}}</span>
                            </div>
                        </div>-->
                    </div>
                </el-scrollbar>
            </div>
            <div class="btnWrap">
                <div class="btnItem btnPrimary" @click="handleSubmit">提交</div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './checkedCategory.scss';
</style>
<script src="./checkedCategory.js"></script>
<!--新增商品-->
<template>
    <div class="goodsAdd" v-if="dialogVisible" @keyup.enter.stop="handleEnter" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="480" height="640" title=" 新增商品" @close="closeDialog">
            <div class="contentWrap">
                <!-- <div class="top">
                    <div class="contentTitle">商品属性</div>
                    <el-radio-group v-removeAria v-model.trim="goodsType">
                        <el-radio :label="0">普通商品</el-radio>
                        <el-radio :label="1">服务商品</el-radio>
                        <el-radio :label="2">计重商品</el-radio>
                    </el-radio-group>
                </div> -->
                <div class="inputWrap">
                    <el-form :model="querySubmit" :rules="rules" ref="form">
                        <el-form-item prop="sv_p_barcode" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>{{$store.state.userInfo.goodsCode_charact}}</span>
                                </div>
                                <el-input ref="sv_p_barcode" v-model.trim="querySubmit.sv_p_barcode" :placeholder="'请输入'+$store.state.userInfo.goodsCode_charact" @keyup.enter.native="handleInputCode"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="sv_p_name" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>商品名称</span>
                                </div>
                                <el-input ref="sv_p_name" v-model.trim="querySubmit.sv_p_name" placeholder="请输入商品名称"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="gender" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>商品分类</span>
                                </div>
                                <el-cascader v-model.trim="categoryId" @expand-change="(e)=>{handleExpand({value:e[0],item:cascader})}" :options="cascader.options" :props="cascader.props" filterable placeholder="请选择分类"></el-cascader>
                            </div>
                        </el-form-item>
                        <el-form-item prop="sv_p_specs" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>商品规格</span>
                                </div>
                                <el-input v-model.trim="querySubmit.sv_p_specs" placeholder="请输入商品规格"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_unit" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>商品单位</span>
                                </div>
                                <el-input v-model.trim="querySubmit.sv_p_unit" placeholder="请输入商品单位"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_unitprice" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>销售价格</span>
                                </div>
                                <el-input v-model.trim="querySubmit.sv_p_unitprice" @keyup.native="handleStorageInput" placeholder="请输入销售价格"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_storage" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>初始库存</span>
                                </div>
                                <el-input v-model.trim="querySubmit.sv_p_storage" placeholder="0" @keyup.native="handleStorageInput" @blur="handleStorageInputBlur"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>
<style  lang="scss" scoped>
@import './goodsAdd.scss';
</style>
<script src="./goodsAdd.js"></script>
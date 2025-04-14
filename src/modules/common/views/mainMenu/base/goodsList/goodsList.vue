<!--一二级分类下商品列表-->
<template>
    <div class="goodsList" :class="{ darkModel: darkModel}">
        <el-scrollbar ref="goodsListScroll" class="listWrap">
            <div class="assistantWrap" v-if="producttype === '5'">
                <!-- 艺人技能 -->
                <div class="stateList">
                    <div class="stateItem" :class="{ selected: stateSelectPos === -1 }" @click="handleState(-1)">
                        <span>全部（{{ state_count.all_count }}）</span>
                    </div>
                    <div class="stateItem" :class="{ selected: stateSelectPos === 0 }" @click="handleState(0)">
                        <span>空闲（{{ state_count.free_count }}）</span>
                    </div>
                    <div class="stateItem" :class="{ selected: stateSelectPos === 1 }" @click="handleState(1)">
                        <span>服务中（{{ state_count.service_count }}）</span>
                    </div>
                </div>
                <div class="groupList" v-for="(item, index) in groupList" :key="index">
                    <div class="groupName">{{ item.sv_grouping_name }}</div>
                    <div class="employeeList">
                        <div class="employeeItem" v-for="(data, pos) in handleEmployeeList(item.e_list)" :key="pos" @click="handleEmployee(data)">
                            <div class="employeeImg">
                                <!-- <img :src="sv_employee_photo" /> -->
                                <cmd-icon v-if="$app.isNull(data.sv_employee_photo)" type="icon-huiyuan1" size="150" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                <img class="img" v-else :src="imgBase + data.sv_employee_photo" />
                            </div>
                            <div class="itemInfo">
                                <div class="itemName">
                                    <span class="nameText">{{ data.sv_employee_name }}</span>
                                    <span class="numberText">{{ data.sv_employee_number }}</span>
                                </div>
                                <div class="itemState">
                                    <span :class="['stateIcon_'+ data.employee_state]"></span>
                                    <span>{{ stateText[data.employee_state] }}</span>
                                </div>
                                <!-- <div class="itemNum">工号：{{ data.sv_employee_number }}</div> -->
                            </div>
                        </div>
                        <div class="emEmpty" v-if="handleEmployeeList(item.e_list).length === 0">
                            <span>岗位无艺人</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="itemWrap" v-else>
                <template v-if="hasTempBtn">
                    <div class="goodsAdd" :class="tempBtnType" v-permission="{permission: CashierManage.Add_Temp_Product_Catering, fn: () => { tempWrapVisible = true }}">
                        <span class="icon">+</span>
                        <span>新增临时菜</span>
                    </div>
                </template>
                <goodsItem ref="goodsItem" v-for="(item,index) in goodsList" :index="index" :goodsItem="item" :key="index" @addCart="addCart" />
            </div>
        </el-scrollbar>
        <div class="btnWrap">
            <div class="btnList">
                <template v-for="(item, index) in btnIconList">
                    <div class="btnItem btn" v-if="item.isChecked" :key="index" v-permission="{permission: CashierManage[item.permission], fn: handleItem, param: [item]}">
                        <cmd-icon :type="item.icon" size="24" color="#3333333"></cmd-icon>
                        <span>{{item.name}}</span>
                    </div>
                </template>
                <div class="btnMore btn" v-permission="{permission: CashierManage.More_Function, fn: () => {funcEntryStatus = true}}">
                    <span>更多功能</span>
                </div>
            </div>
            <div class="btnOnGoods">
                <div class="btnAdd btn" v-permission="{permission: CashierManage.Add_Product, fn: showGoodsAdd}">
                    <!-- <span>+新增商品F2</span> -->
                    <span>+新增商品</span>
                </div>
                <div class="btnLast btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === 1}" @click="pageLast">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="pages" v-if="goodsTotal > 0">{{ query.pageIndex +'/'+ goodsTotal }}</div>
                <div class="btnNext btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === goodsTotal}" @click="pageNext">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>

        <div id="ball" :style="ballAnimation">
            <img class="img" v-if="animationImg" :src="animationImg" style="width:100%;height:100%;" />
            <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/cashier/noGoodsImg.png'" />
        </div>

        <dc-dialog v-if="tempWrapVisible" width="420" height="540" title="新增临时菜" @close="closeCaterDialog" @handleEnter="handleAddCatering">
            <div class="tempCateringWrap">
                <div class="inputWrap">
                    <el-form :model="queryAddCatering" :rules="rules" ref="form">
                        <el-form-item prop="sv_p_barcode" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>商品条码</span>
                                </div>
                                <el-input ref="sv_p_barcode" v-model.trim="queryAddCatering.sv_p_barcode" v-select placeholder="请输入商品条码"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="sv_p_name" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>商品名称</span>
                                </div>
                                <el-input ref="sv_p_name" v-model.trim="queryAddCatering.sv_p_name" placeholder="请输入商品名称"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item prop="gender" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>商品分类</span>
                                </div>
                                <el-cascader v-model.trim="categoryIdList" @expand-change="(e)=>{handleExpand({value:e[0],item:cascader})}" :options="cascader.options" :props="cascader.props" placeholder="请选择分类"></el-cascader>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_unitprice" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol">*</span>
                                    <span>销售价格</span>
                                </div>
                                <el-input v-model.trim="queryAddCatering.sv_p_unitprice" v-select @input.native="handleInputAdd" placeholder="0.00"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_storage" class="lineBox" :class="{'hide': goodsType == 1}">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>厨打方案</span>
                                </div>
                                <el-select v-model.trim="queryAddCatering.sv_printer_id" clearable placeholder="请选择厨打方案">
                                    <!-- <el-option label="请选择厨打方案" :value="-1"></el-option> -->
                                    <el-option v-for="item in printerList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                                <!-- <el-input v-model.trim="queryAddCatering.sv_p_storage" placeholder="0" @keyup.native="handleStorageInput" @blur="handleStorageInputBlur"></el-input> -->
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-footer">
                    <el-button @click="handleAddCatering(1)" class="btnItem btnBasic" v-repeatClick>保存并下单</el-button>
                    <el-button @click="handleAddCatering(2)" class="btnItem btnPrimary" v-repeatClick>下单</el-button>
                </div>
            </div>
        </dc-dialog>
        <!-- 艺人技能弹窗 -->
        <goods-assistant :visible.sync="popGoodsAssistant" :popAssistant="popAssistant" @handleSubmit="setSalesclerkCash"></goods-assistant>

        <!-- 备用金 -->
        <pop-cashmoney :visible.sync="isShowCash" title="请输入备用金" :onlyNumber="false" @handleNumberChange="setSalesclerkCash"></pop-cashmoney>

        <!-- 更多功能弹窗 -->
        <more-func-entry :visible.sync="funcEntryStatus"></more-func-entry>

        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="currentPriceItem.currentDealPrice" @handleNumberChange="handleCurrentPriceBack"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsList.scss';
</style>
<script src="./goodsList.js"></script>
<!--加价购、满送弹窗-->
<template>
    <div class="isGoodsActivity" v-if="dialogVisible">
        <dc-dialog width="12.8" height="7.8" title="选择促销及赠品" @close="closeDialog">
            <div class="contentWrap">
                <div class="top">
                    <div class="left">
                        <div class="leftTItle">已满足条件促销列表</div>
                        <div class="tableHeader">
                            <div class="td1">
                                <!-- <el-checkbox></el-checkbox> -->
                            </div>
                            <div class="td2">
                                <span>活动名称</span>
                            </div>
                            <div class="td3">
                                <span>类型</span>
                            </div>
                            <div class="td4">
                                <span>促销说明</span>
                            </div>
                            <div class="td5">
                                <span>是否叠加</span>
                            </div>
                        </div>
                        <el-scrollbar class="left-scroll">
                            <div class="listItem" :class="{'selected': selectedPos === index}" v-for="(item, index) in dataList" :key="index" @click="handlePromotion(item.promotionId,index)">
                                <div class="td1">
                                    <el-checkbox v-model="item.isChecked" @click.native.stop="" @change="handleMainCheck(item.promotionId,index)"></el-checkbox>
                                </div>
                                <div class="td2">
                                    <span>{{item.name}}</span>
                                </div>
                                <div class="td3">
                                    <span>{{promotionTypeText[item.promotionType]}}</span>
                                </div>
                                <div class="td4">
                                    <span v-if="item.promotionType !== 4">
                                        <label v-if="item.giveType === 2">{{'买满'+ $app.divideNumber(item.buyCount,100) +'元送'+ item.giveCount}}</label>
                                        <label v-else>{{'买'+ item.buyCount +'送'+ item.giveCount}}</label>
                                    </span>
                                    <span v-else>
                                        <label>{{'买满'+ $app.divideNumber(item.buyCount,100) +'元加' }}</label><br />
                                        <label>{{item.addMoney +'元得'+ item.giveCount +'件'}}</label>
                                    </span>
                                </div>
                                <div class="td5">
                                    <span>{{item.isLadder ? '是' : '否'}}</span>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="right" v-if="selectedPos > -1">
                        <div class="rightTitle">
                            <div class="titleText">
                                <span>赠品列表</span>
                                <span class="tips" v-if="currentCanSelectedInfo.number > 0">{{currentCanSelectedInfo.text}}</span>
                            </div>
                            <!-- <el-input placeholder="请输入商品名称/条码"></el-input> -->
                        </div>
                        <div class="tableHeader">
                            <div class="td1">
                                <!-- <el-checkbox></el-checkbox> -->
                            </div>
                            <div class="td2">
                                <span>商品名称</span>
                            </div>
                            <div class="td3">
                                <span>规格</span>
                            </div>
                            <div class="td4">
                                <span>单位</span>
                            </div>
                            <div class="td5">
                                <span>单价</span>
                            </div>
                            <div class="td6">
                                <span>数量</span>
                            </div>
                        </div>
                        <el-scrollbar class="right-scroll">
                            <div class="tableLine" :class="{'selected': 1}" v-for="(item,index) in dataList[selectedPos].subList" :key="index">
                                <div class="td1">
                                    <el-checkbox v-model="item.isChecked" @change="handleSubCheck(item)"></el-checkbox>
                                </div>
                                <div class="td2">
                                    <div class="goodsName">
                                        <span>{{item.sv_p_name}}</span>
                                    </div>
                                    <div class="pcode">
                                        <span>{{item.sv_p_barcode}}</span>
                                    </div>
                                </div>
                                <div class="td3">
                                    <span>{{item.sv_p_specs}}</span>
                                </div>
                                <div class="td4">
                                    <span>{{item.sv_p_unit}}</span>
                                </div>
                                <div class="td5">
                                    <span>{{$app.moneyFixed(item.sv_p_unitprice)}}</span>
                                </div>
                                <div class="td6">
                                    <div class="btnSubtract" @click.stop="handleSubtract(item)">
                                        <span>-</span>
                                    </div>
                                    <div class="goodsNum">
                                        <span>{{item.number}}</span>
                                    </div>
                                    <div class="btnAdd" @click.stop="handleAdd(item)">
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleSure">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './isGoodsActivity.scss';
</style>
<script src="./isGoodsActivity.js"></script>
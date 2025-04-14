<template>
    <div class="appraise restaurant" ref="restaurant" tabindex="0">
        <div class="appraiseLeft">
            <div class="inputWrap">
                <el-input type="text" ref="searchKeywords" v-model.trim="searchKeywords" @keyup.native.stop="" @keyup.native.enter.stop="handleSearch" clearable placeholder="条码/助词码（大写）"></el-input>
            </div>
            <div class="tableWrap">
                <div class="header">
                    <div class="cell1">
                        <span>序号</span>
                    </div>
                    <div class="cell2">
                        <span>菜品名称</span>
                    </div>
                    <div class="cell3">
                        <span>数量</span>
                    </div>
                    <div class="cell4">
                        <span>估清</span>
                    </div>
                    <div class="cell5">
                        <span>操作</span>
                    </div>
                </div>
                <div class="tbody">
                    <el-scrollbar ref="cartList" style="width:100%;height:100%; overflow:hidden;">
                        <div class="cartItem" v-for="(item,index) in appraiseList" :key="index">
                            <div class="rowTop row">
                                <div class="cell1"></div>
                                <div class="cell2">
                                    <div class="goodsNumber">{{item.sv_p_barcode}}</div>
                                </div>
                                <div class="cell3"></div>
                                <div class="cell4"></div>
                                <div class="cell5"></div>
                            </div>
                            <div class="rowMiddle row">
                                <div class="cell1">
                                    <span class="index">{{index + 1}}</span>
                                </div>
                                <div class="cell2">
                                    <div class="goodsName">
                                        <div class="nameText">
                                            <span>{{item.sv_p_name}}</span>
                                        </div>
                                        <!-- <div class="subInfo" v-html="handleCartering(item)"></div> -->
                                        <div class="subInfo"></div>
                                    </div>
                                </div>
                                <div class="cell3">{{item.sv_p_storage}}</div>
                                <div class="cell4">{{item.sv_select_count}}</div>
                                <div class="cell5">
                                    <span class="btnCancel" @click="handleCancel(item)">取消</span>
                                </div>
                            </div>
                            <div class="rowBottom row">
                                <div class="cell1"></div>
                                <div class="cell2"></div>
                                <div class="cell3"></div>
                                <div class="cell4"></div>
                                <div class="cell5"></div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="btnCancelAll">
                <div class="btn" @click="handleCancelAdd">取消全部</div>
            </div>
        </div>
        <div class="appraiseRight" ref="appraiseRight">
            <div class="classification" ref="classification">
                <div class="c_one">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': firstSelected == 0}" @click="handleFirstCategoryAll">热销</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': firstSelected == (index+1)}" v-for="(item,index) in firstCategory" :key="index" @click="handleFirstCategory(item,index+1)">{{item.sv_pc_name}}</div>
                    </el-scrollbar>
                </div>
                <div class="c_two" v-if="firstSelected != 0">
                    <el-scrollbar class="el_list">
                        <div class="item rowFirst" :class="{'selected': secondSelected == 0}" @click="handleSecondCategoryAll">全部</div>
                        <div class="item" :class="{'rowFirst': (index+1)%6 == 0, 'selected': secondSelected == (index+1)}" v-for="(item,index) in secondCategory" :key="index" @click="handleSecondCategory(item,index+1)">{{item.sv_psc_name}}</div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="goodsContent" :style="{'height': goodsWrapHeight}">
                <div class="goodsWrap">
                    <el-scrollbar ref="listWrap" style="width: 100%; height: 100%">
                        <div class="listWrap">
                            <div class="goodsItem" v-for="(goodsItem, index) in goodsList" :key="index" @click="handleGoodsItem(goodsItem)">
                                <div class="isAppraiseClear" v-if="goodsItem.is_sell_clear && goodsItem.sv_p_storage === 0">
                                    <div class="img">
                                        <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/appraise.png'" />
                                    </div>
                                </div>
                                <div class="flag" v-if="goodsItem.is_package || goodsItem.sv_pricing_method === 1">
                                    <span>{{goodsItem.is_package ? '套' : '称'}}</span>
                                    <div class="corver"></div>
                                </div>
                                <div class="goodsImg">
                                    <img class="img" :src="goodsItem.goodsImg" />
                                </div>
                                <div class="goodsName">{{goodsItem.sv_p_name}}</div>
                                <div class="goodsCode">{{goodsItem.sv_p_barcode}}</div>
                                <div class="priceWrap">
                                    <div class="price">
                                        <span class="symbol">¥</span>
                                        <span>{{$app.moneyFixed(goodsItem.sv_p_unitprice)}}</span>
                                    </div>
                                    <div class="stock" v-if="goodsItem.is_sell_clear">
                                        <span class="appraise">估</span>
                                        <span>{{goodsItem.sv_p_storage}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="btnWrap">
                    <div class="btnOnGoods">
                        <div class="btnLast btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === 1}" @click="pageLast">
                            <i class="el-icon-arrow-left"></i>
                        </div>
                        <div class="pages" v-if="goodsTotal > 0">{{query.pageIndex +'/'+ goodsTotal}}</div>
                        <div class="btnNext btn" v-if="goodsTotal > 0" :class="{'disabled': query.pageIndex === goodsTotal}" @click="pageNext">
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <number-change :visible.sync="numberChangeStatus" couldZero :onlyNumber="onlyNumber" :defaultNumber="currentItem.is_sell_clear ? currentItem.sv_p_storage : 1" title="估清数量" @handleNumberChange="handleNumberChange"></number-change>
    </div>
</template>

<style  lang="sass" scoped>@import "./appraise.scss"
</style>
<script src="./appraise.js"></script>
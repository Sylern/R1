<!--餐饮更多弹窗-->
<template>
    <div class="goodsPackage" ref="goodsPackage" v-if="dialogVisible" tabindex="0" @keyup.enter.stop="handleEnter" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="600" @close="closeDialog">
            <div class="contentWrap">
                <div class="contentTitle">{{packageTitle}}</div>
                <div class="moreInfo">
                    <el-scrollbar ref="mianGoods" style="width:100%; height:100%;">
                        <div class="infoBox mianGoods" v-for="(item, index) in dataList" :key="index">
                            <div class="infoTitle">
                                <span>{{item.name}}</span>
                                <span class="babel">（{{item.count}}选{{item.maxSelect}}）</span>
                            </div>
                            <div class="infoList">
                                <div class="infoItem" :class="{'selected': data.selected}" v-for="(data, pos) in item.packageproduct_list" :key="pos" @click="handleMain(item,index,data,pos)">
                                    <div class="goodsName">
                                        <div class="name">
                                            <div class="nameText">{{data.sv_p_name}}</div>
                                            <div class="number" v-if="!data.is_required"> x{{ data.product_number }}</div>
                                        </div>
                                        <div class="flag" v-if="data.is_required">（必选）</div>
                                    </div>
                                    <div class="addPrice" v-if="data.add_price > 0">{{`+${data.add_price}元`}}</div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="bottomWrap">
                <div class="btnSure" :class="{'disabled': requireSelected.unSelected}" @click="handleSure">确定</div>
            </div>
            <dc-dialog width="800" height="520" v-if="showSelectedStatus" @close="showSelectedStatus = false">
                <div class="popContentWrap">
                    <div class="contentTitle">商品</div>
                    <div class="goodsInfo">
                        <div class="imgBox">
                            <img class="img" :src="this.currentChild.goodsImg ? this.currentChild.goodsImg : noGoodsImg" />
                        </div>
                        <div class="goodsText">
                            <div class="goodsName">{{currentChild.goodsName}}</div>
                            <div class="goodsAttr">
                                <span>{{currentChild.barcode}}</span>
                                <!-- <span class="stock">库：{{goodsItem.storage}}</span> -->
                            </div>
                            <!-- <div class="goodsPrice">￥{{$app.moneyFixed(currentChild.unitprice)}}</div> -->
                        </div>
                    </div>
                    <div class="moreInfo">
                        <el-scrollbar ref="scrollbar" style="height: 100%;">
                            <div class="infoBox" v-if="specInfoList.length > 0">
                                <div class="infoTitle">规格</div>
                                <div class="infoList">
                                    <div class="infoItem" :class="{'selected': specIds.find(e => e === item.id)}" v-for="(item, index) in specInfoList" :key="index" @click="handleChangeSpec(item)">
                                        <span>{{item.name}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="infoBox" v-if="chargingInfoList.length > 0">
                                <div class="infoTitle">加料</div>
                                <div class="infoList">
                                    <div class="infoItem" :class="{'selected': chargingIds.find(e => e === item.id)}" v-for="(item, index) in chargingInfoList" :key="index" @click="handleChangecharging(item)">
                                        <span>{{item.name}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="infoBox" v-for="(item, index) in groupingTasteList" :key="index">
                                <div class="infoTitle">
                                    <span>{{item.sv_tastegroup_name}}</span>
                                    <span v-if="item.sv_is_mandatory">（必选，可选{{item.sv_max_options}}项）</span>
                                </div>
                                <div class="infoList">
                                    <div class="infoItem" :class="{'selected': data.selected}" v-for="(data, pos) in item.tasteList" :key="pos" @click="handleChangleTaste(item, data)">
                                        <span>{{data.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="popBottomWrap">
                    <div class="btnCancle" v-if="currentChild.showCancle" @click="popHandleCancle">取消选择</div>
                    <div class="btnSure" :class="{'disabled': requireTaste}" @click="popHandleSure">确定</div>
                </div>
            </dc-dialog>
        </dc-dialog>
        <!-- 商品改时价 -->
        <number-change :visible.sync="currentPriceStatus" title="商品时价" :onlyNumber="false" :defaultNumber="goodsInfo.sv_p_unitprice" @handleNumberChange="moneyEdit"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsPackage.scss';
</style>
<script src="./goodsPackage.js"></script>
<!--餐饮更多弹窗-->
<template>
    <div class="cateringMore" ref="cateringMore" @click.stop="" v-show="dialogVisible" tabindex="0" @keyup.enter.stop="handleSure" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="680" @close="closeDialog">
            <div class="contentWrap">
                <div class="contentTitle">商品</div>
                <div class="contentTop">
                    <div class="goodsInfo">
                        <div class="imgBox">
                            <img class="img" :src="this.goodsInfo.goodsImg ? this.goodsInfo.goodsImg : noGoodsImg" />
                        </div>
                        <div class="goodsText">
                            <div class="goodsName">{{goodsInfo.goodsName}}</div>
                            <div class="goodsPrice">￥{{$app.moneyFixed(goodsInfo.unitprice)}}</div>
                            <div class="goodsAttr">
                                <span>{{goodsInfo.barcode}}</span>
                                <span class="stock" v-if="appraiseNumber">估：{{appraiseNumber}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="goodsNum">
                        <div class="btnSubtract btn" @click.stop="handleSubtract">
                            <span>-</span>
                        </div>
                        <div class="numberText" @click.stop="handleNumberChange">
                            <span>{{numberText}}</span>
                        </div>
                        <div class="btnAdd btn" @click.stop="handleAdd">
                            <span>+</span>
                        </div>
                    </div>
                </div>
                <div class="moreInfo" v-if="needShowMoreInfo">
                    <el-scrollbar ref="scrollbar" style="height: 100%;">
                        <div class="infoBox" v-if="specInfoList.length > 0">
                            <div class="infoTitle">规格</div>
                            <div class="infoList">
                                <div class="infoItem" :class="{'selected': specIds.find(e => e.id === item.id)}" v-for="(item, index) in specInfoList" :key="index" @click="handleChangeSpec(item)">
                                    <span>{{item.name}}</span>
                                    <span v-if="item.price > 0">{{'('+ item.price + '元)'}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="infoBox" v-if="chargingInfoList.length > 0">
                            <div class="infoTitle">加料</div>
                            <div class="infoList">
                                <div class="infoItem" :class="{'selected': chargingIds.find(e => e.id === item.id)}" v-for="(item, index) in chargingInfoList" :key="index" @click="handleChangecharging(item)">
                                    <span>{{item.name}}</span>
                                    <span v-if="item.price > 0">{{'('+ item.price + '元)'}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="infoBox" v-for="(item, index) in groupingTasteList" :key="index">
                            <div class="infoTitle">
                                <span>{{item.sv_tastegroup_name}}</span>
                                <span v-if="item.sv_is_mandatory">（必选，可选{{item.sv_max_options}}项）</span>
                            </div>
                            <div class="infoList">
                                <!-- <div class="infoItem" :class="{'selected': tasteIds.find(e => e.id === data.id)}" v-for="(data, pos) in item.tasteList" :key="pos" @click="handleChangleTaste(data)"> -->
                                <div class="infoItem" :class="{'selected': data.selected}" v-for="(data, pos) in item.tasteList" :key="pos" @click="handleChangleTaste(item, data)">
                                    <span>{{data.name}}</span>
                                    <span v-if="data.price > 0">{{'('+ data.price + '元)'}}</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="bottomWrap">
                <div class="totalPrice">
                    <span class="nomarl">总价：</span>
                    <span class="value">{{priceTotal}}</span>
                </div>
                <div class="btnBottom">
                    <div class="remark">
                        <span>备注：</span>
                        <el-input v-model="goodsInfo.remark" maxlength="30" placeholder="请输入备注，限制30字内"></el-input>
                        <div v-if="!this.isLightMeal" class="btnWartting" :class="{'check': goodsInfo.waittingStatus}" @click="goodsInfo.waittingStatus = !goodsInfo.waittingStatus">{{goodsInfo.waittingStatus ? '取消等叫' : '等叫'}}</div>
                    </div>
                    <div class="btnSure" :class="{'disabled': requireTaste}" @click="handleSure">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './cateringMore.scss';
</style>
<script src="./cateringMore.js"></script>
<!--一二级分类下商品项-->
<template>
    <div class="goodsItem" :class="{'big':imgModelType === '1','small':imgModelType === '0','noPic':imgModelType === '2'}" @click.stop="handleGoodsItem">
        <!-- 大图 -->
        <div class="isAppraiseClear" v-if="isAppraiseClear" @click.stop="appraiseClearShow">
            <div class="img">
                <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/appraise.png'" />
            </div>
        </div>
        <div class="flag" v-if="goodsItem.is_package || goodsItem.sv_pricing_method === 1">
            <span>{{goodsItem.is_package ? '套' : '称'}}</span>
            <div class="corver"></div>
        </div>
        <template v-if="imgModelType === '1'">
            <div class="goodsImg">
                <img class="img" v-if="this.goodsImg" :src="this.goodsImg" />
                <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/default.png'" />
            </div>
            <div class="goodsName">{{goodsItem.sv_p_name}}</div>
            <div class="goodsCode" v-if="cashierJurisdiction.showCode && userInfo.sv_uit_cache_name !== 'cache_name_catering'">{{goodsItem.sv_p_barcode}}</div>
            <!-- <div class="discount">
                <div class="btnFlag">满送</div>
            </div> -->
            <div class="priceWrap">
                <div class="price">
                    <span class="symbol">¥</span>
                    <span>{{$app.moneyFixed(goodsItem.sv_p_unitprice)}}</span>
                </div>
                <div class="stock" v-if="showStorage">
                    <span>库：{{goodsItem.sv_p_storage}}</span>
                </div>
                <div class="priceRight">
                    <div class="stock" v-if="goodsItem.is_sell_clear && !isLightMeal">
                        <span class="appraise">估</span>
                        <span>{{goodsItem.sv_p_storage}}</span>
                    </div>
                    <div class="more" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'" @click.stop="showCateringMore">
                        <span>...</span>
                    </div>
                </div>
            </div>
        </template>
        <!-- 小图 -->
        <template v-if="imgModelType === '0'">
            <div class="goodsImg">
                <img class="img" v-if="this.goodsImg" :src="this.goodsImg" />
                <img class="img" v-else :src="$store.state.base.frontImgBase + '/images/default.png'" />
            </div>
            <div class="goodsInfo">
                <div class="goodsName">{{goodsItem.sv_p_name}}</div>
                <div class="goodsCode" v-if="cashierJurisdiction.showCode && userInfo.sv_uit_cache_name !== 'cache_name_catering'">{{goodsItem.sv_p_barcode}}</div>
                <div class="priceWrap">
                    <div class="price">
                        <span class="symbol">¥</span>
                        <span>{{$app.moneyFixed(goodsItem.sv_p_unitprice)}}</span>
                    </div>
                    <div class="stock" v-if="showStorage">
                        <span>库：{{goodsItem.sv_p_storage}}</span>
                    </div>
                    <div class="priceRight">
                        <div class="stock" v-if="goodsItem.is_sell_clear && !isLightMeal">
                            <span class="appraise">估</span>
                            <span>{{goodsItem.sv_p_storage}}</span>
                        </div>
                        <div class="more" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'" @click.stop="showCateringMore">
                            <span>...</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 无图 -->
        <template v-if="imgModelType === '2'">
            <div class="goodsInfo">
                <div class="goodsName" :class="{'notCommon': goodsItem.is_package || goodsItem.sv_pricing_method === 1}">{{goodsItem.sv_p_name}}</div>
                <div class="goodsCode" v-if="cashierJurisdiction.showCode && userInfo.sv_uit_cache_name !== 'cache_name_catering'">{{goodsItem.sv_p_barcode}}</div>
                <div class="priceWrap">
                    <div class="price">
                        <span class="symbol">¥</span>
                        <span>{{$app.moneyFixed(goodsItem.sv_p_unitprice)}}</span>
                    </div>
                    <div class="stock" v-if="showStorage">
                        <span>库：{{goodsItem.sv_p_storage}}</span>
                    </div>
                    <div class="priceRight">
                        <div class="stock" v-if="goodsItem.is_sell_clear && !isLightMeal">
                            <span class="appraise">估</span>
                            <span>{{goodsItem.sv_p_storage}}</span>
                        </div>
                        <div class="more" v-if="userInfo.sv_uit_cache_name === 'cache_name_catering'" @click.stop="showCateringMore">
                            <span>...</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 多规格等商品 -->
        <goods-more-info :visible.sync="goodsMoreInfoStatus" :isCurrent="isCurrent" :goodsId="goodsItem.product_id" :infoType="goodsMoreInfoType" :isMultiPrice="isMultiPrice"></goods-more-info>
        <!-- 餐饮更多 -->
        <catering-more :visible.sync="cateringMoreStatus" :appraiseNumber="goodsItem.is_sell_clear ? goodsItem.sv_p_storage : null" :cateringInfo="cateringInfo" @handleSure="returnGoodsCatering"></catering-more>
        <!-- 套餐 -->
        <goods-package :visible.sync="goodsPackageStatus" :goodsId="goodsItem.product_id" :isCurrentPrice="goodsItem.sv_is_current_price" @handleSure="returnGoodsPackage"></goods-package>
        <!-- 称重商品 -->
        <goods-weight :visible.sync="goodsWeighStatus" :dataItem="goodsWeigtItem" @handleSure="returnGoodsWeightInfo"></goods-weight>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsItem.scss';
</style>
<script src="./goodsItem.js"></script>
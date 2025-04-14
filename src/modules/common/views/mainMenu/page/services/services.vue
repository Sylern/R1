<template>
    <div class="services" ref="services" tabindex="0" @keyup.stop="listenKeyup">
        <div class="topWrap">
            <div class="menuLeft">
                <div class="menuWrap">
                    <div class="item">全部</div>
                    <div class="item selected">进行中</div>
                    <div class="item">已结账</div>
                    <div class="item">已取消</div>
                </div>
                <div class="typeWrap">
                    <span class="iconGreen"></span>
                    <span>散客</span>
                    <span class="iconRed"></span>
                    <span>会员</span>
                </div>
            </div>
            <div class="btnRight" @click="handleOrderStart">
                <span>开单</span>
            </div>
        </div>
        <div class="contentWrap">
            <div class="listWrap">
                <div class="listWrap_view">
                    <div class="item" v-for="(item,index) in 20" :key="index">
                        <div class="itemTopWrap">
                            <div class="typeIcon">
                                <span>02</span>
                            </div>
                            <div class="itemTitle">
                                <span>13:48</span>
                            </div>
                        </div>
                        <div class="itemOrderWrap">
                            <div class="itemLine">
                                <div class="key">
                                    <span>开单人</span>
                                </div>
                                <div class="value">
                                    <span>Tony</span>
                                </div>
                            </div>
                            <div class="itemLine">
                                <div class="key">
                                    <span>单号</span>
                                </div>
                                <div class="value">
                                    <span>20191223023</span>
                                </div>
                            </div>
                        </div>
                        <div class="itemServiceWrap">
                            <div class="serviceTitle">
                                <div class="key">
                                    <span>项目/产品</span>
                                </div>
                                <div class="value">
                                    <span>价格</span>
                                </div>
                            </div>
                            <div class="itemLine" v-for="(item,index) in 3" :key="index">
                                <div class="key">
                                    <span>洗发</span>
                                </div>
                                <div class="value">
                                    <span>15</span>
                                </div>
                            </div>
                        </div>
                        <div class="itemPriceWrap">
                            <div class="leftIcon">
                                <i class="el-icon-delete"></i>
                            </div>
                            <div class="rightValue">
                                <span>总价</span>
                                <span class="price">¥55</span>
                            </div>
                        </div>
                        <div class="bottomLine">
                            <span class="icon" v-for="(item,index) in 13" :key="index"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="workerWrap">
                <div class="text">
                    <span>服务中</span>
                </div>
                <div class="workerListWrap" ref="workerListWrap">
                    <div class="view" ref="workerView">
                        <div class="item" v-for="(item,index) in 20" :key="index"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style  lang="sass" scoped>
@import "./services.scss"
</style>
<script src="./services.js"></script>
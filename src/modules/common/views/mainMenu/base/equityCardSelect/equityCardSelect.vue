<!--选择权益卡弹窗-->
<template>
    <div class="equityCardSelect" ref="equityCardSelect" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="400" height="650" title="权益卡" @close="closeDialog">
            <div class="equityCardSelectContent">
                <div class="carousel" v-if="list.length > 0">
                    <el-carousel :autoplay="false" :loop="false" indicator-position="none" type="card" arrow="always" height="130px" @change="changeCardPos">
                        <el-carousel-item v-for="item in list" :key="item" class="item" :style="bgStyle(item)">
                            <div class="top">
                                <div class="logo" :style="{ backgroundImage: `url(${logo})` }"> </div>
                                <div class="name">{{ item.sv_micard_name }}</div>
                            </div>
                            <div class="bottom">有效期至:{{ vaildDes(item) }}</div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <el-scrollbar class="listWrap">
                    <div class="contentItemInfo">
                        <div class="info">
                            <div class="title" v-if="commonEquity.length > 0">
                                <span class="titleContent">权益</span>
                            </div>
                            <div class="items">
                                <div class="info-item" v-for="(item, index) in commonEquity" :key="index">
                                    <div v-if="item.sv_midetail_type === 0" class="icon" :style="{ backgroundImage: `url(${item.sv_mi_image})`, backgroundSize: item.sv_mi_image.indexOf('default.png') > -1 ? 'cover' : '80% 80%' }"></div>
                                    <div v-else class="icon">
                                        <cmd-icon type="icon-ccb_shangpin1" size="35"></cmd-icon>
                                    </div>
                                    <div class="name">{{ item.sv_mi_name }}</div>
                                </div>
                            </div>
                            <div class="title" v-if="gitEquity.length > 0">
                                <span class="titleContent">开卡礼包</span>
                            </div>
                            <div class="items second">
                                <div class="info-item" v-for="(item, index) in gitEquity" :key="index">
                                    <!-- sv_midetail_giveconfig.gift_type 0 送积分 1送优惠券 -->
                                    <div class="icon" v-if="item.sv_midetail_giveconfig.gift_type == '0'">
                                        <i class="el-icon-coin"></i>
                                    </div>
                                    <div class="icon" v-if="item.sv_midetail_giveconfig.gift_type == '1'">
                                        <cmd-icon type="icon-youhuiquan1" size="35"></cmd-icon>
                                    </div>
                                    <div class="name">{{ item.sv_midetail_giveconfig.gift_type == '1' ? '送优惠券' : '送积分' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="info" v-if="currentShow.sv_micard_desc">
                            <div class="title">
                                <span class="titleContent">使用须知</span>
                            </div>
                            <div class="rule" v-for="(item, index) in currentShow.sv_micard_desc" :key="index">
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
                <div class="btnWrap" v-if="list.length > 0">
                    <div class="btnSure" @click="closeDialog">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './equityCardSelect.scss';
</style>
<script src="./equityCardSelect.js"></script>
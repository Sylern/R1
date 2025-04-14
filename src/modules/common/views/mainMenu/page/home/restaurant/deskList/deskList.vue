<template>
    <div class="restaurant">
        <div class="deskList" ref="deskList" v-show="!showCashier">
            <div class="mainMenu">
                <div class="desk_mleft">
                    <el-scrollbar ref="scrollbarmLeft" style="height:100%" v-if="menuList.length > 0">
                        <div class="menuList">
                            <div @click="handleMenuClick(item.id)" class="menuItem" :class="{ 'selected': queryEntity.regionId === item.id }" v-for="(item, index) in menuList" :key="index">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="desk_mright">
                    <div class="searchInput">
                        <el-input v-model="queryEntity.tableName" placeholder="房台搜索" @keyup.native.enter="handleSearch" @keyup.native.stop="">
                            <div class="suffixWrap" slot="suffix">
                                <i class="el-icon-circle-close" v-if="queryEntity.tableName" @click="handleClearSearch"></i>
                                <span @click="handleSearch">搜索</span>
                            </div>
                        </el-input>
                    </div>
                    <div @click="handleRefresh" class="refreshWrap">
                        <el-tooltip class="item" effect="light" content="刷新房台" placement="bottom">
                            <cmd-icon class="btn_icon" type="icon-shuaxin" size="32" color="#ffffff"></cmd-icon>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div :class="{ fxzwrap: queryEntity.regionId === -2 }" class="containar">
                <el-scrollbar ref="scrollbar" style="height:100%;width:100%">
                    <div class="listWrap" v-if="queryEntity.regionId !== -2 && !$app.isNull(dataList)">
                        <!-- <div class="listItem" v-for="(item, index) in dataList" :key="index" @click="handleListTable(item)">
                            <template v-if="item.sv_table_using_state === 0">
                                <div class="itemLeft space">
                                    <span class="main">{{ item.sv_table_name }}</span>
                                </div>
                                <div class="itemRight space">
                                    <span>{{ item.sv_table_number }}人桌</span>
                                </div>
                            </template>
                            <template v-else>
                                <div class="itemLeft" :class="['status_' + item.sv_table_using_state]">
                                    <div class="main">
                                        <span>{{ item.sv_table_name }}</span>
                                    </div>
                                    <div class="sub" v-if="item.sv_table_using_state !== 1 && item.sv_table_using_state !== 4">
                                        <span>金额：{{ $app.moneyFixed(item.total_money) }}</span>
                                    </div>
                                </div>
                                <div class="itemRight">
                                    <div class="localPeople" :class="['status_' + item.sv_table_using_state]">
                                        <span>{{ item.stateName }}</span>
                                    </div>
                                    <div class="time">
                                        <span>{{ item.sv_table_use_number }}人</span>
                                        <span v-if="item.sv_table_using_state !== 1 && item.sv_table_using_state !== 4">({{ item.time }})</span>
                                    </div>
                                </div>
                            </template>
                        </div> -->
                        <div class="listItem" :class="['status_' + item.sv_table_using_state]" v-for="(item, index) in dataList" :key="index" @click="handleListTable(item)">
                            <div class="preOrdered" v-if="item.sv_table_using_state === 5">
                                <img class="img" :src="frontImgBase + '/images/cashier/preOrdered.png'" />
                            </div>
                            <div class="main">
                                <!-- 0：空闲状态；1.已开台，等待客户点餐；2.正在使用中；3.待清桌；4.待接单；5.已预打；6.已预订；7.占用 9.待预结-->
                                <div class="left">
                                    <span class="statusIcon" :class="['icon_' + item.sv_table_using_state]" @click.stop="handleTableState(item)">{{ item.stateName }}</span>
                                    <span>{{ item.sv_table_name }}</span>
                                </div>
                                <!-- <div class="right" v-if="item.sv_switch" @click.stop="handleLightSwitch(item)">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="24" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                </div> -->
                            </div>
                            <!-- 已开台 使用中展示 -->
                            <div class="sub" v-if="item.sv_table_using_state === 1 || item.sv_table_using_state === 2 || item.sv_table_using_state === 5 || item.sv_table_using_state === 9">
                                <cmd-icon class="btn_icon" type="icon-fangtaishijian" size="18" color="#ffffff"></cmd-icon>
                                <span>时长：{{ item.time }}</span>
                            </div>
                            <div class="sub" v-if="item.sv_table_using_state === 2 || item.sv_table_using_state === 5 || item.sv_table_using_state === 9">
                                <cmd-icon class="btn_icon" type="icon-jine" size="18" color="#ffffff"></cmd-icon>
                                <span>商品消费：{{ $app.moneyFixed(item.total_money) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="fanjieWrap" v-if="queryEntity.regionId === -2 && !$app.isNull(fanjieList)">
                        <div @click="handleCancel(item)" class="listItem" v-for="(item, index) in fanjieList" :key="index">
                            <div class="itemLeft">
                                <div class="main">
                                    <span>{{ item.sv_catering_grade }}</span>
                                </div>
                                <div class="sub">
                                    <span>{{ item.time }}</span>
                                </div>
                            </div>
                            <div class="itemRight">
                                <div class="localPeople">
                                    <span>反结账</span>
                                </div>
                                <div class="time">
                                    <span>{{ item.sv_person_num }}人</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="(this.$app.isNull(dataList) && queryEntity.regionId !== -2) || (queryEntity.regionId === -2 && $app.isNull(fanjieList))" class="noContent">
                        <img class="img" :src="notImg" />
                        <div class="notTxt">暂无房台</div>
                        <div v-if="queryEntity.regionI3d !== -2" @click="handleJump({ type: 'tableSetting' })" class="noBtn">创建房台</div>
                    </div>
                </el-scrollbar>
            </div>
            <div v-if="queryEntity.regionId !== -2" class="footDesk">
                <div @click="handleState(-1)" :class="{ active: queryEntity.using_state === -1 }" class="desk_li">
                    <div class="desk_name">全部</div>
                    <div class="desk_value">{{ sumCout.cateringTableAllCount }}</div>
                </div>
                <div @click="handleState(0)" :class="{ active: queryEntity.using_state === 0 }" class="desk_li ">
                    <div class="desk_name">空闲</div>
                    <div class="desk_value">{{ sumCout.freeStateCount }}</div>
                </div>
                <div @click="handleState(2)" :class="{ active: queryEntity.using_state === 2 }" class="desk_li ">
                    <div class="desk_name">使用中</div>
                    <div class="desk_value">{{ sumCout.inUseStateCount }}</div>
                </div>
                <div @click="handleState(3)" :class="{ active: queryEntity.using_state === 3 }" class="desk_li ">
                    <div class="desk_name">待清台</div>
                    <div class="desk_value color_1">{{ sumCout.waitForClearCount }}</div>
                </div>
                <div @click="handleState(4)" :class="{ active: queryEntity.using_state === 4 }" class="desk_li ">
                    <div class="desk_name">待接单</div>
                    <div class="desk_value color_2">{{ sumCout.waitForUseCount }}</div>
                </div>
                <div @click="handleState(5)" :class="{ active: queryEntity.using_state === 5 }" class="desk_li ">
                    <div class="desk_name">已预结</div>
                    <div class="desk_value color_2">{{ sumCout.isBeforeHandCount }}</div>
                </div>
            </div>
        </div>

        <r-cashier v-if="showCashier" :dataJson="dataJson" :isOrderBack="isOrderBack"></r-cashier>

        <number-change :visible.sync="numberChangeStatus" title="就餐人数" @handleNumberChange="handleNumberChange"></number-change>

        <dc-dialog v-if="isRemove" width="400" height="240" title="清除房台提示" @close="isRemove = false">
            <div class="restaurant_h_content">
                <div class="h_text">是否确定清除房台？</div>
                <div class="h_btnWrap">
                    <div @click="handleRemove" class="btn h_light">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="sass" scoped>
@import "./deskList.scss"
</style>
<script src="./deskList.js"></script>
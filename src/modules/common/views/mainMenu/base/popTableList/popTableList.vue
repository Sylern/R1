<!--弹出房台列表弹窗-->
<template>
    <div class="popTableList" ref="popTableList" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1200" height="650" :title="dataObj.title" @close="closeDialog">
            <div class="areaMenu">
                <div class="menuWrap">
                    <el-scrollbar ref="menuList" style="width: 100%; height: 100%;">
                        <div class="menuList">
                            <div class="menuItem" :class="{'selected': queryEntity.regionId === item.id}" v-for="(item, index) in menuList" :key="index" @click="handleMenu(item)">
                                <span>{{item.name}}</span>
                                <label class="underLine"></label>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="searchWrap">
                    <el-input v-model="seachStr" placeholder="请输入房台名称" clearable @focus="$event.currentTarget.select()"></el-input>
                </div>
            </div>
            <div class="contentWrap">
                <el-scrollbar ref="scrollbar" class="srcollList">
                    <div class="listWrap" v-if="!$app.isNull(dataList)">
                        <div class="listItem" v-for="(item, index) in searchResult" :key="index" @click="handleListTable(item)">
                            <template v-if="item.sv_table_using_state === 0">
                                <div class="itemLeft space">
                                    <span class="main">{{item.sv_table_name}}</span>
                                </div>
                                <div class="itemRight space">
                                    <span>{{item.sv_table_number}}人桌</span>
                                </div>
                            </template>
                            <template v-else>
                                <div class="itemLeft" :class="['status_'+ item.sv_table_using_state]">
                                    <div class="main">
                                        <span>{{item.sv_table_name}}</span>
                                    </div>
                                    <div class="sub">
                                        <span>入座时长：{{item.time}}</span>
                                    </div>
                                </div>
                                <div class="itemRight">
                                    <div class="localPeople" :class="['status_'+ item.sv_table_using_state]">
                                        <span>{{item.stateName}}</span>
                                    </div>
                                    <div class="time">
                                        <span>{{item.sv_table_use_number}}人</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div v-if="this.$app.isNull(dataList)" class="noContent">
                        <img class="img" :src="notImg" />
                        <div class="notTxt">暂无房台</div>
                    </div>
                </el-scrollbar>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './popTableList.scss';
</style>
<script src="./popTableList.js"></script>
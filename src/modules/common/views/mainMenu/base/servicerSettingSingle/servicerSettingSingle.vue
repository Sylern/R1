<!--设置单个服务人员-->
<template>
    <div class="servicerSettingSingle" v-if="dialogVisible">
        <dc-dialog width="900" height="580" @close="closeDialog">
            <div class="contentWrap">
                <el-scrollbar style="width: 100%; height: 50px;">
                    <div class="menuList">
                        <div class="item" :class="{'selected': menuPos === -1}" @click="handleMenuItem(-1)">全部</div>
                        <div class="item" :class="{'selected': menuPos === index}" v-for="(item, index) in storeEmployeeList" :key="index" @click="handleMenuItem(index)">{{item.grouping_name}}</div>
                    </div>
                </el-scrollbar>
                <el-scrollbar class="rightScroll">
                    <div class="listWrap">
                        <el-empty v-if="currEmployeeList.length === 0" description="分类无员工数据"></el-empty>
                        <div class="listItem" v-for="(item, index) in currEmployeeList" :key="index" @click.stop="handleEmployeeItem(item)">
                            <div class="employeePhoto">
                                <cmd-icon v-if="$app.isNull(item.sv_employee_photo)" type="icon-huiyuan1" size="100" color="#8056F7"></cmd-icon>
                                <img class="img" v-else :src="imgBase + item.sv_employee_photo" />
                            </div>
                            <div class="textWrap">
                                <div class="name">
                                    <el-tooltip effect="dark" placement="top" :content="item.sv_employee_name">
                                        <span>{{item.sv_employee_name}}</span>
                                    </el-tooltip>
                                </div>
                                <div class="workerNum">
                                    <span>工号：{{item.sv_employee_number}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="btnWrap" :class="{'flex-right': !hasBtnAll}">
                <div class="btnAll" v-if="hasBtnAll" @click="handleAll">全选</div>
                <div class="btnCancel" @click="handleCancel">取消</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './servicerSettingSingle.scss';
</style>
<script src="./servicerSettingSingle.js"></script>
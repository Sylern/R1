<!-- 选择开单人 -->
<template>
    <div class="servicesPersonSelect" ref="servicesPersonSelect" tabindex="0" @keyup.stop="listenKeyup">
        <div class="topWrap">
            <div class="btnBack" @click="handleBack">
                <i class="el-icon-arrow-left"></i>
                <span class="text">返回</span>
            </div>
            <div class="menuWrap">
                <div class="pageTitle">
                    <span>选择开单人</span>
                </div>
            </div>
        </div>
        <div class="contentWrap">
            <div class="listWrap" v-for="(item,index) in storeEmployeeList" :key="'list_'+index">
                <div class="listTitle" v-if="!$app.isNull(item.list)">
                    <span>{{item.grouping_name}}</span>
                </div>
                <div class="item" v-for="(obj,pos) in item.list" :key="index+pos" @click="handleItem(obj)">
                    <div class="employeePhoto">
                        <cmd-icon v-if="$app.isNull(obj.sv_employee_photo)" type="icon-huiyuan1" size="100" color="#8056F7"></cmd-icon>
                        <img class="img" v-else :src="imgBase + obj.sv_employee_photo" />
                    </div>
                    <div class="textWrap">
                        <div class="name">
                            <el-tooltip effect="dark" placement="top" :content="obj.sv_employee_name">
                                <span>{{obj.sv_employee_name}}</span>
                            </el-tooltip>
                        </div>
                        <div class="workerNum">
                            <span>工号：{{obj.sv_employee_number}}</span>
                        </div>
                    </div>
                </div>
                <!-- <div class="btnAdd">
                    <span>+</span>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style  lang="sass" scoped>
@import "./servicesPersonSelect.scss"
</style>
<script src="./servicesPersonSelect.js"></script>
<!--选择导购员列表弹窗-->
<template>
    <div class="guiderSelect" v-if="dialogVisible">
        <dc-dialog width="4.7" height="6.6" title="销售人员选择" @close="closeDialog">
            <div class="contentWrap">
                <div class="listWrap">
                    <el-scrollbar style="width:100%; height: 100%;">
                        <!-- <div class="listItem" :class="{'selected': selectedId === item.id}" v-for="(item,index) in 10" :key="index" @click="handleMember(item.id)"> -->
                        <div class="listItem" :class="{'selected': selectedId === item.sv_employee_id}" v-for="(item,index) in dataList" :key="index" @click="handleGuider(item)">
                            <div class="left">
                                <!-- <div class="logo"></div> -->
                                <cmd-icon type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                            </div>
                            <div class="center">
                                <div class="user lineOccuped">
                                    <div class="nameWrap">
                                        <span class="nameText">{{item.sv_employee_name}}</span>
                                    </div>
                                </div>
                                <div class="phoneWrap lineOccuped">
                                    <div class="telephone">{{$app.phoneNumberHiding(item.sv_employee_phone)}}</div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="check" :class="{'isCheck': selectedId === item.sv_employee_id}"></div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="btnWrap">
                    <div class="btnSure">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './operatorList.scss';
</style>
<script src="./operatorList.js"></script>
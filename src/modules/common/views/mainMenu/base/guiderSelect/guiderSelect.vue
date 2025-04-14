<!--选择导购员列表弹窗-->
<template>
    <div class="guiderSelect" ref="guiderSelect" tabindex="0" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="4.7" height="6.6" :title="title" @close="closeDialog">
            <div class="guiderContent">
                <div class="guiderListWrap" :class="{onLySelected: selectedNumber === 1}">
                    <el-scrollbar ref="guiderList" style="width:100%; height: 100%;">
                        <!-- <div class="listItem" :class="{'selected': selectedId === item.id}" v-for="(item,index) in 10" :key="index" @click="handleMember(item.id)"> -->
                        <div class="listItem" :class="{'selected': selectedIds.filter(e => e.id === item.sv_employee_id).length > 0}" v-for="(item,index) in dataList" :key="index" @click="handleGuider(item)">
                            <div class="left">
                                <!-- <div class="logo"></div> -->
                                <img class="img" v-if="item.sv_employee_photo" :src="item.sv_employee_photo.indexOf('http') > -1 ? item.sv_employee_photo : imgBase + item.sv_employee_photo" width="100%" />
                                <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
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
                                <div class="check" :class="{'isCheck': selectedIds.filter(e => e.id === item.sv_employee_id).length > 0}"></div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="guiderBtnWrap" v-if="selectedNumber > 1">
                    <div class="btnSure" @click="handleSure">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './guiderSelect.scss';
</style>
<script src="./guiderSelect.js"></script>
<template>
    <div class="privateRoomList">
        <div class="roomList" ref="roomList" v-show="!showCashier">
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
            <div class="tableStateMenu">
                <div @click="handleState(-1)" :class="{ active: queryEntity.using_state === -1 }" class="desk_li">
                    <div class="desk_name">全部（{{ sumCout.cateringTableAllCount }}）</div>
                </div>
                <div @click="handleState(0)" :class="{ active: queryEntity.using_state === 0 }" class="desk_li">
                    <div class="desk_name">空闲（{{ sumCout.freeStateCount }}）</div>
                </div>
                <div @click="handleState(2)" :class="{ active: queryEntity.using_state === 2 }" class="desk_li">
                    <div class="desk_name">使用中（{{ sumCout.inUseStateCount }}）</div>
                </div>
                <div @click="handleState(6)" :class="{ active: queryEntity.using_state === 6 }" class="desk_li">
                    <div class="desk_name">已预约（{{ sumCout.bookingCount }}）</div>
                    <!-- <div class="desk_value color_1">{{ sumCout.bookingCount }}</div> -->
                </div>
                <div @click="handleState(7)" :class="{ active: queryEntity.using_state === 7 }" class="desk_li">
                    <div class="desk_name">已占用（{{ sumCout.occupationCount }}）</div>
                    <!-- <div class="desk_value color_2">{{ sumCout.occupationCount }}</div> -->
                </div>
                <div @click="handleState(5)" :class="{ active: queryEntity.using_state === 5 }" class="desk_li">
                    <div class="desk_name">已预结（{{ sumCout.isBeforeHandCount }}）</div>
                    <!-- <div class="desk_value color_2">{{ sumCout.isBeforeHandCount }}</div> -->
                </div>
            </div>
            <div class="containar" :class="{ hasProgramAssistant: hasProgramAssistant}">
                <el-scrollbar ref="scrollbar" style="height: 100%; width: 100%">
                    <div class="listWrap" v-if="!$app.isNull(dataList)">
                        <div class="listItem" :class="['status_' + item.sv_table_using_state]" v-for="(item, index) in dataList" :key="index" @click="handleListTable(item)">
                            <div class="preOrdered" v-if="item.sv_table_using_state === 5">
                                <img class="img" :src="frontImgBase + '/images/cashier/preOrdered.png'" />
                            </div>
                            <div class="main">
                                <!-- 0：空闲状态；1.已开台，等待客户点餐；2.正在使用中；3.待清桌；4.待接单；5.已预打；6.已预订；7.占用 9.待预结-->
                                <div class="left">
                                    <span class="statusIcon" :class="['icon_' + item.sv_table_using_state]" @click.stop="handleTableState(item)">{{ item.stateName }}</span>
                                    <span class="tableName">{{ item.sv_table_name }}</span>
                                </div>
                                <div class="right" v-if="item.sv_switch" @click.stop="handleLightSwitch(item)">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="24" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                </div>
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
                    <div class="noContent">
                        <img class="img" :src="notImg" />
                        <div class="notTxt">暂无房台</div>
                        <div v-if="queryEntity.regionI3d !== -2" @click="handleJump({ type: 'tableSetting' })" class="noBtn">创建房台</div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="workerWrap" v-if="state_count.all_count > 0">
                <div class="workerTitle">
                    <span>艺人</span>
                    <div class="stateList">
                        <div class="stateItem" :class="{ selected: stateSelectPos === -1 }" @click="handleWorkerState(-1)">
                            <span>全部（{{ state_count.all_count }}）</span>
                        </div>
                        <div class="stateItem" :class="{ selected: stateSelectPos === 0 }" @click="handleWorkerState(0)">
                            <span>空闲（{{ state_count.free_count }}）</span>
                        </div>
                        <div class="stateItem" :class="{ selected: stateSelectPos === 1 }" @click="handleWorkerState(1)">
                            <span>服务中（{{ state_count.service_count }}）</span>
                        </div>
                    </div>
                </div>
                <div class="workerListWrap">
                    <el-scrollbar ref="workerListScroll" style="width: 100%; height: 100%;">
                        <div class="scrollContent">
                            <div class="groupItem" v-for="(item, index) in groupList" :key="index">
                                <div class="groupName" v-if="handleEmployeeList(item.e_list).length > 0">{{ item.sv_grouping_name }}</div>
                                <div class="employeeList">
                                    <div class="employeeItem" v-for="(data, pos) in handleEmployeeList(item.e_list)" :key="pos">
                                        <div class="employeeImg">
                                            <!-- <img :src="sv_employee_photo" /> -->
                                            <cmd-icon v-if="$app.isNull(data.sv_employee_photo)" type="icon-huiyuan1" size="100" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                            <img class="img" v-else :src="imgBase + data.sv_employee_photo" />
                                        </div>
                                        <div class="itemInfo">
                                            <div class="itemName">
                                                <span class="nameText">{{ data.sv_employee_name }}</span>
                                                <span class="numberText">{{ data.sv_employee_number }}</span>
                                            </div>
                                            <div class="itemState">
                                                <span :class="['stateIcon_'+ data.employee_state]"></span>
                                                <span>{{ stateText[data.employee_state] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="employeePhoto">
                                    <img class="img" v-if="$app.isNull(item.sv_employee_photo)" :src="frontImgBase + '/images/title.png'" />
                                    <img class="img" v-else :src="imgBase + item.sv_employee_photo" />
                                </div>
                                <div class="textWrap">
                                    <el-tooltip effect="dark" placement="top" :content="item.sv_employee_name">
                                        <span>{{item.sv_employee_name}}</span>
                                    </el-tooltip>
                                </div> -->
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>

        <pr-cashier v-if="showCashier" :dataJson="dataJson" :isOrderBack="isOrderBack"></pr-cashier>

        <dc-dialog v-if="showFnList" width="670" height="352" @close="showFnList = false">
            <div class="fnListContent">
                <div class="listWrap">
                    <div class="listItem" v-if="checkedItem.booking_type !== 2" @click="handleFnItem('startOrderStatus')">
                        <cmd-icon class="btn_icon" type="icon-kaifangtai" size="30" color="#666666"></cmd-icon>
                        <div class="text">开房台</div>
                    </div>
                    <div class="listItem" @click="handleFnItem('scheduleStatus')">
                        <cmd-icon class="btn_icon" type="icon-wodeyuyue" size="30" color="#666666"></cmd-icon>
                        <div class="text">预约</div>
                    </div>
                    <div class="listItem" @click="handleFnItem('occupy')">
                        <cmd-icon class="btn_icon" type="icon-fangtaizhanyong" size="30" color="#666666"></cmd-icon>
                        <div class="text">占用</div>
                    </div>
                    <div class="listItem" @click="handleFnItem('maintenance')">
                        <cmd-icon class="btn_icon" type="icon-fangtaiweihu" size="30" color="#666666"></cmd-icon>
                        <div class="text">维护</div>
                    </div>
                    <div class="listItem" v-permission="{ permission: checkedItem.sv_switch ? CashierManage.Turn_Off_The_Lights : CashierManage.Turn_On_The_Lights, fn: handleFnItem, param: ['kaideng'] }">
                        <cmd-icon class="btn_icon" type="icon-kaideng" size="30" color="#666666"></cmd-icon>
                        <div class="text">{{ checkedItem.sv_switch ? '关灯' : '开灯' }}</div>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <!-- 预约、占用、维护 详情 -->
        <dc-dialog v-if="popContentStatus" width="680" height="480" :title="popContent.title" @close="popContentStatus = false">
            <div class="popContentStatus">
                <div class="wrapContent">
                    <div class="infoList">
                        <template v-if="popContent.sv_table_using_state === 6">
                            <div class="infoItem">
                                <div class="key">房间：</div>
                                <div class="value">{{ popContent.sv_table_name }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">预订人：</div>
                                <div class="value">{{ popContent.sv_booking_name }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">联系电话：</div>
                                <div class="value">{{ popContent.sv_booking_mobile }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">预抵时间：</div>
                                <div class="value">{{ popContent.sv_arrival_date }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">取消时间：</div>
                                <div class="value">{{ popContent.sv_cancel_date }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">预约员工：</div>
                                <div class="value">{{ popContent.sv_employee_name }}</div>
                            </div>
                        </template>
                        <template v-if="popContent.sv_table_using_state === 7 || popContent.sv_table_using_state === 8">
                            <div class="infoItem">
                                <div class="key">房间：</div>
                                <div class="value">{{ popContent.sv_table_name }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">开始时间：</div>
                                <div class="value">{{ popContent.sv_creation_date }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">{{ popContent.sv_table_using_state === 7 ? '占用' : '维护' }}员工：</div>
                                <div class="value">{{ popContent.sv_employee_name }}</div>
                            </div>
                            <div class="infoItem">
                                <div class="key">{{ popContent.sv_table_using_state === 7 ? '占用' : '维护' }}时长：</div>
                                <div class="value">{{ popContent.duration }}</div>
                            </div>
                        </template>
                    </div>
                    <div class="remark">
                        <div class="key">备注：</div>
                        <div class="value">{{ popContent.sv_remark }}</div>
                    </div>
                </div>
                <div class="btnWrap">
                    <template v-if="popContent.sv_table_using_state === 6">
                        <div class="btnWrapLeft">
                            <div @click="handleCancelBooking" class="btn">
                                <i class="el-icon-circle-close"></i>
                                <span>取消预约</span>
                            </div>
                            <div @click="handleOccupyToMaintenance" class="btn">
                                <cmd-icon class="btn_icon" type="icon-fangtaiweihu" size="18" color="var(--main-theme-color)"></cmd-icon>
                                <span>维护</span>
                            </div>
                        </div>
                        <div class="btnRight">
                            <div @click="handleUpdateSchedule" class="btn">修改</div>
                            <div @click="handleScheduleToStartOrder" class="btn sure">预订开单</div>
                        </div>
                    </template>
                    <template v-if="popContent.sv_table_using_state === 7">
                        <div class="btnWrapLeft">
                            <div @click="handleCancelOccupy" class="btn">
                                <i class="btnIcon el-icon-circle-close"></i>
                                <span>取消占用</span>
                            </div>
                            <div @click="handleOccupyToMaintenance" class="btn">
                                <cmd-icon class="btn_icon" type="icon-fangtaiweihu" size="18" color="var(--main-theme-color)"></cmd-icon>
                                <span>维护</span>
                            </div>
                        </div>
                        <div class="btnRight">
                            <div @click="handleContentToSchedule" class="btn sure">预约</div>
                        </div>
                    </template>
                    <template v-if="popContent.sv_table_using_state === 8">
                        <div class="btnWrapLeft"></div>
                        <div class="btnRight">
                            <div @click="handleContentToSchedule" class="btn">预约</div>
                            <div @click="handleSuccessMaintenance" class="btn sure">完成维护</div>
                        </div>
                    </template>
                </div>
            </div>
        </dc-dialog>
        <!-- 占用 维护 -->
        <dc-dialog v-if="popSubStatus" width="480" height="360" :title="popObject.sv_type === 3 ? '占用' : '维护'" @close="popSubStatus = false">
            <div class="popSubStatus">
                <div class="wrapContent">
                    <div class="lineItem">
                        <div class="key">{{ popObject.sv_type === 3 ? '占用员工' : '维护员工' }}</div>
                        <div class="value">
                            <el-select class="selectBox" v-model="popObject.sv_employee_id" placeholder="请选择员工">
                                <el-option v-for="(item, index) in guiderList" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="lineItem remark">
                        <div class="key">备注</div>
                        <div class="value">
                            <el-input type="textarea" v-model="popObject.sv_remark" resize="none" :rows="5" maxlength="300" placeholder="请输入备注"></el-input>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div @click="handleUpdatePopSub" class="btn h_light">确定</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 预约 -->
        <dc-dialog v-if="scheduleStatus" width="480" height="680" title="预约" @close="scheduleStatus = false">
            <div class="scheduleStatus">
                <div class="wrapContent">
                    <div class="lineItem">
                        <div class="key">房台</div>
                        <div class="value">{{ checkedItem.sv_table_name }}</div>
                    </div>
                    <div class="lineItem">
                        <div class="key">预订人</div>
                        <div class="value">
                            <el-input class="inputBox" v-model="popObject.sv_booking_name" maxlength="8" placeholder="请输入预约人姓名"></el-input>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">联系电话</div>
                        <div class="value">
                            <el-input class="inputBox" v-model="popObject.sv_booking_mobile" @keyup.native="handleInput" maxlength="11" placeholder="请输入联系电话"></el-input>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">预抵时间</div>
                        <div class="value">
                            <el-date-picker v-model="popObject.sv_arrival_date" type="datetime" :clearable="false" placeholder="预抵时间"></el-date-picker>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">取消时间</div>
                        <div class="value">
                            <el-date-picker v-model="popObject.sv_cancel_date" type="datetime" :clearable="false" placeholder="取消时间"></el-date-picker>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">预订员工</div>
                        <div class="value">
                            <el-select class="selectBox" v-model="popObject.sv_employee_id" placeholder="请选择预订员工">
                                <el-option v-for="(item, index) in guiderList" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="lineItem remark">
                        <div class="key">客人留言</div>
                        <div class="value">
                            <el-input type="textarea" v-model="popObject.sv_remark" resize="none" :rows="5" maxlength="300" placeholder="请输入客人留言"></el-input>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div @click="handleBooking" class="btn h_light">确定</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 开房台 -->
        <dc-dialog v-if="startOrderStatus" width="480" height="680" title="开房台" @close="startOrderStatus = false">
            <div class="startOrderWrap">
                <div class="wrapContent">
                    <div class="lineItem">
                        <div class="key">房台</div>
                        <div class="value">{{ checkedItem.sv_table_name }}</div>
                    </div>
                    <div class="lineItem">
                        <div class="key">计费规则</div>
                        <div class="value">
                            <el-select class="selectBox" v-model="popObject.sv_billable_id" placeholder="请选择计费规则">
                                <el-option v-for="(item, index) in billabletimeList" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">顾客人数</div>
                        <div class="value">
                            <el-input class="inputBox" v-model="popObject.sv_table_use_number" maxlength="3" @keyup.native="handleInput">
                                <span slot="suffix">人</span>
                            </el-input>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">开单时间</div>
                        <div class="value">
                            <el-date-picker v-model="popObject.wt_datetime" type="datetime" :clearable="false" placeholder="开单时间" :picker-options="{
									disabledDate(time) {
										return time.getTime() > Date.now();
									},
								}"></el-date-picker>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">开单员工</div>
                        <div class="value">
                            <el-select class="selectBox" v-model="popObject.sv_employee_id" placeholder="请选择开单员工">
                                <el-option v-for="(item, index) in guiderList" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key">自动预结账</div>
                        <div class="value inline">
                            <el-select class="selectBox2" v-model="popObject.sv_preknot_hour">
                                <el-option :label="0" :value="0"></el-option>
                                <el-option v-for="(item, index) in 23" :label="item" :value="item" :key="index"></el-option>
                            </el-select>
                            <span class="text hour">小时</span>
                            <el-select class="selectBox2" v-model="popObject.sv_preknot_minute">
                                <el-option :label="0" :value="0"></el-option>
                                <el-option v-for="(item, index) in 59" :label="item" :value="item" :key="index"></el-option>
                            </el-select>
                            <span class="text">分钟</span>
                        </div>
                    </div>
                    <div class="lineItem">
                        <div class="key"></div>
                        <div class="value inline">
                            <div class="preknotTimeItem" :class="{ selected: popObject.sv_preknot_hour === 1 && popObject.sv_preknot_minute === 0 }" @click="handlePreknotTime(1)">1小时</div>
                            <div class="preknotTimeItem" :class="{ selected: popObject.sv_preknot_hour === 2 && popObject.sv_preknot_minute === 0 }" @click="handlePreknotTime(2)">2小时</div>
                            <div class="preknotTimeItem" :class="{ selected: popObject.sv_preknot_hour === 3 && popObject.sv_preknot_minute === 0 }" @click="handlePreknotTime(3)">3小时</div>
                            <div class="preknotTimeItem" :class="{ selected: popObject.sv_preknot_hour === 4 && popObject.sv_preknot_minute === 0 }" @click="handlePreknotTime(4)">4小时</div>
                        </div>
                    </div>
                    <div class="lineItem remark">
                        <div class="key">备注</div>
                        <div class="value">
                            <el-input type="textarea" v-model="popObject.sv_remark" resize="none" :rows="5" maxlength="300" placeholder="请输入备注"></el-input>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div @click="handleStartOrder" v-repeatClick class="btn h_light">确定</div>
                </div>
            </div>
        </dc-dialog>

        <!-- <number-change :visible.sync="numberChangeStatus" title="就餐人数" @handleNumberChange="handleNumberChange"></number-change> -->
        <reservation :visible.sync="reservationStatus" :editReservation="editReservation" :tableInfo="checkedItem" :guiderList="guiderList" @submit="reservationListSubmit"></reservation>
        <reservationList :visible.sync="reservationListStatus" :tableInfo="checkedItem" @submit="reservationListSubmit"></reservationList>
        <reservationInfo :visible.sync="reservationInfoStatus" :tableInfo="checkedItem" @submit="reservationListSubmit"></reservationInfo>

        <dc-dialog v-if="isRemove" width="400" height="240" title="清除房台提示" @close="isRemove = false">
            <div class="removeRoom_content">
                <div class="h_text">是否确定清除房台？</div>
                <div class="h_btnWrap">
                    <div @click="handleRemove" class="btn h_light">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style lang="sass" scoped>
@import "./roomList.scss"
</style>
<script src="./roomList.js"></script>

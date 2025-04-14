<template>
    <div class="privateRoomList2" @click="handlePage">
        <div class="roomList" ref="roomList" v-show="!showCashier">
            <div class="roomLeft">
                <div class="topWrap tableInfo" v-if="checkedItem.sv_table_id">
                    <div class="btnBack" @click="handleBack">
                        <i class="el-icon-arrow-left"></i>
                        <span class="text">返回</span>
                    </div>
                    <div class="tableTop">
                        <div class="tableName">{{ checkedItem.sv_table_name }}</div>
                        <div class="tableDuration" v-if="!$app.isNull(billabletimeInfo.durationString)">
                            <i class="el-icon-time"></i>
                            <span>{{ billabletimeInfo.durationString }}</span>
                        </div>
                    </div>
                    <div class="memberInfo">
                        <div class="unSelected" v-if="!memberSelected">
                            <div class="btnItem btnMemberSelect" v-permission="{ permission: CashierManage.Select_Members, fn: showMemberList }">
                                <cmd-icon type="icon-huiyuan" color="rgba(var(--main-theme-color), 1);" size="30"></cmd-icon>
                                <span class="text">选择会员</span>
                            </div>
                            <div class="btnItem btnMemberAdd" v-permission="{ permission: CashierManage.Add_Members, fn: showMemberAdd }">
                                <cmd-icon type="icon-jia" color="rgba(var(--main-theme-color), 1);" size="24"></cmd-icon>
                                <span class="text">新增会员</span>
                            </div>
                        </div>
                        <div class="content" v-else>
                            <div class="userInfo">
                                <div class="left">
                                    <div class="logo">
                                        <el-image v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="$app.getImgUrl(memberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(memberInfo.sv_mr_headimg)]"></el-image>
                                        <cmd-icon v-else type="icon-headDefault" size="30" color="#E5CAA0"></cmd-icon>
                                    </div>
                                    <div class="nameWrap">
                                        <div class="nametext">
                                            <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                            <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                        </div>
                                        <div class="telephone">
                                            <div class="mobile item">
                                                <cmd-icon type="icon-phone-o" size="16" color="#333333"></cmd-icon>
                                                <span>{{ memberInfo.sv_mr_mobile }}</span>
                                            </div>
                                            <div class="cardno item">
                                                <cmd-icon type="icon-memberCard" size="16" color="#333333"></cmd-icon>
                                                <el-tooltip effect="dark" placement="top" :content="'卡号：' + memberInfo.sv_mr_cardno">
                                                    <span>{{ memberInfo.sv_mr_cardno }}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right" @click.stop="" v-if="checkedItem.booking_type !== 2">
                                    <div class="btn btnClear" @click="showMemberList">选择</div>
                                    <!-- <div class="btn btnRecharge" @click="showMemberRecharge">充值</div> -->
                                    <div class="btn btnRecharge" @click="handleClearMember">清除</div>
                                </div>
                                <!-- <div class="clearMember" @click="handleClearMember">
									<i class="el-icon-error"></i>
								</div> -->
                            </div>
                            <div class="userRights">
                                <div class="item">
                                    <div class="key">余额</div>
                                    <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">积分</div>
                                    <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">权益卡</div>
                                    <div class="value">{{ memberInfo.micard_count || 0 }}</div>
                                </div>
                                <div class="item">
                                    <div class="key">优惠券</div>
                                    <div class="value">{{ memberInfo.couponCountNumber }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="topWrap shopInfo" v-else>
                    <img class="img" :src="store_logo" />
                    <div class="shopName">{{ userInfo.sv_us_name }}</div>
                    <div class="shopEmployee">
                        <span>操作员：{{ userInfo.sv_ul_name }}</span>
                        <span>店铺号码：{{ userInfo.sv_us_phone }}</span>
                    </div>
                    <div class="searchInput">
                        <el-input v-model="queryEntity.tableName" placeholder="请输入房台名称" @keyup.native.enter="handleSearch" @keyup.native.stop="">
                            <div class="suffixWrap" slot="suffix">
                                <i class="el-icon-circle-close" v-if="queryEntity.tableName" @click="handleClearSearch"></i>
                                <span @click="handleSearch">搜索房台</span>
                            </div>
                        </el-input>
                    </div>
                </div>
                <div class="bottomWrap" v-if="checkedItem.sv_table_id">
                    <template v-if="checkedItem.booking_type !== 2">
                        <div class="tableFn">
                            <div class="fnTitle">房台服务</div>
                            <div class="fnList">
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasStartOrder }" @click="handleFnItem('startOrderStatus', hasStartOrder)">
                                        <cmd-icon class="btn_icon" type="icon-kaifangtai" size="28" :color="!hasStartOrder ? '#909090' : '#333333'"></cmd-icon>
                                        <div class="text">开台</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasSchedule }" @click="handleFnItem('scheduleStatus', hasSchedule)">
                                        <cmd-icon class="btn_icon" type="icon-wodeyuyue" size="28" :color="!hasSchedule ? '#909090' : '#333333'"></cmd-icon>
                                        <div class="text">预约</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasOccupy }" @click="handleFnItem('occupy', hasOccupy)">
                                        <cmd-icon class="btn_icon" type="icon-fangtaizhanyong" size="28" :color="!hasOccupy ? '#909090' : '#333333'"></cmd-icon>
                                        <div class="text">占用</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasMaintenance }" @click="handleFnItem('maintenance', hasMaintenance)">
                                        <cmd-icon class="btn_icon" type="icon-fangtaiweihu" size="28" :color="!hasMaintenance ? '#909090' : '#333333'"></cmd-icon>
                                        <div class="text">维护</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasChangeTable }" @click="handleFnItem('changeTable', hasChangeTable)">
                                        <cmd-icon class="btn_icon" type="icon-huantai" size="28" color="#333333"></cmd-icon>
                                        <div class="text">换台</div>
                                    </div>
                                </div>
                                <div class="fnItem" v-if="!checkedItem.is_have_prepayment">
                                    <div class="fnContent" :class="{ isDefault: !hasChangeTable }" @click="handleFnItem('mergeTable', hasChangeTable)">
                                        <cmd-icon class="btn_icon" type="icon-bingtaix" size="28" color="#333333"></cmd-icon>
                                        <div class="text">并台</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" v-permission="{ permission: CashierManage.Turn_On_The_Lights, fn: handleFnItem, param: ['kaideng', true] }">
                                        <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                        <div class="text">开灯</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <!-- <div class="fnContent" @click="handleFnItem('guandeng', true)"> -->
                                    <div class="fnContent" v-permission="{ permission: CashierManage.Turn_Off_The_Lights, fn: handleFnItem, param: ['guandeng', true] }">
                                        <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="#333333"></cmd-icon>
                                        <div class="text">关灯</div>
                                    </div>
                                </div>
                                <!-- <div class="fnItem">
                                    <cmd-icon class="btn_icon" type="icon-kaifangtai" size="28" color="#666666"></cmd-icon>
                                    <div class="text">开台</div>
                                </div> -->
                            </div>
                        </div>
                        <div class="tableFn">
                            <div class="fnTitle">房台服务</div>
                            <div class="fnList">
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasSelectGoods }" @click="handleFnItem('selectGoods', hasSelectGoods)">
                                        <cmd-icon class="btn_icon" type="icon-fangtaishangpin" size="28" color="#333333"></cmd-icon>
                                        <div class="text">选商品</div>
                                    </div>
                                </div>
                                <div class="fnItem">
                                    <div class="fnContent" :class="{ isDefault: !hasSelectGoods }" @click="handleFnItem('editRemark', hasSelectGoods)">
                                        <cmd-icon class="btn_icon" type="icon-editRemark" size="28" color="#333333"></cmd-icon>
                                        <div class="text">备注</div>
                                    </div>
                                </div>
                                <div class="fnItem" v-if="hasProgramAssistant">
                                    <div class="fnContent" @click="handleFnItem('programAssistant', true)">
                                        <cmd-icon class="btn_icon" type="icon-huiyuan1" size="28" color="#333333"></cmd-icon>
                                        <div class="text">艺人</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="moreTableBtn" v-if="checkedItem.booking_type !== 2 && checkedItem.sv_table_using_state !== 0" @click.stop="showPreOrder">
                            <span style="padding-right: 2px;">预付金</span>
                            <span v-if="checkedItem.preOrderMoney > 0">￥{{ checkedItem.preOrderMoney }}</span>
                        </div>
                        <div class="moreTableBtn" v-if="checkedItem.mergeCateringTableIds.length > 0" @click.stop="showMoreTable">合并房台</div>
                        <div class="orderCheckWrap" v-if="hasCheckinBtn">
                            <span class="btnToCashier" @click="handleFnItem('selectGoods', hasSelectGoods)">查看</span>
                            <el-button class="btnOrderCheck" v-repeatClick v-permission="{ permission: CashierManage.Collection_Catering, fn: showCheckin }">
                                <span v-if="orderTotalMoney">结算 ¥{{ orderTotalMoney || '' }} </span>
                            </el-button>
                        </div>
                    </template>
                    <div class="timeInfo" v-if="checkedItem.booking_type === 2">
                        <div class="timeBox">
                            <div class="time">
                                <span class="date">{{ bookingInfo.sv_arrival_date ? bookingInfo.sv_arrival_date.substring(0, 10) : '' }}</span>
                                <span>{{ bookingInfo.sv_arrival_date ? bookingInfo.sv_arrival_date.substring(11, 16) : '' }}</span>
                            </div>
                            <div class="text">预定开始时间</div>
                        </div>
                        <div class="spaceBox">
                            <div class="line"></div>
                        </div>
                        <div class="timeBox">
                            <div class="time">
                                <span class="date">{{ bookingInfo.sv_arrival_end_date ? bookingInfo.sv_arrival_end_date.substring(0, 10) : '' }}</span>
                                <span>{{ bookingInfo.sv_arrival_end_date ? bookingInfo.sv_arrival_end_date.substring(11, 16) : '' }}</span>
                            </div>
                            <div class="text">预定结束时间</div>
                        </div>
                    </div>
                    <div class="tableFn" v-if="checkedItem.booking_type === 2">
                        <div class="fnTitle">房台服务</div>
                        <div class="fnList">
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('scheduleStatus')">
                                    <cmd-icon class="btn_icon" type="icon-wodeyuyue" size="28" color="#333333"></cmd-icon>
                                    <div class="text">预约</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('reservationList')">
                                    <cmd-icon class="btn_icon" type="icon-kecheng" size="28" color="#333333"></cmd-icon>
                                    <div class="text">预约列表</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('changeTable', hasChangeTable)">
                                    <cmd-icon class="btn_icon" type="icon-huantai" size="28" color="#333333"></cmd-icon>
                                    <div class="text">换台</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Turn_On_The_Lights, fn: handleFnItem, param: ['kaideng', true] }">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                    <div class="text">开灯</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Turn_Off_The_Lights, fn: handleFnItem, param: ['guandeng', true] }">
                                    <cmd-icon class="btn_icon" type="icon-kaideng" size="28" color="#333333"></cmd-icon>
                                    <div class="text">关灯</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-button class="btnOrderCheck" v-if="checkedItem.booking_type === 2" v-repeatClick @click="handleClearTable">
                        <span>结束服务</span>
                    </el-button>
                </div>
                <div class="bottomWrap" v-else>
                    <div class="tableFn">
                        <div class="fnList">
                            <div class="fnItem">
                                <div class="fnContent" @click="handleFnItem('recharge', true)">
                                    <cmd-icon class="btn_icon" type="icon-chongzhi" size="40" color="#000000"></cmd-icon>
                                    <div class="text">充值</div>
                                </div>
                            </div>
                            <div class="fnItem">
                                <div class="fnContent" v-permission="{ permission: CashierManage.Add_Members, fn: showMemberAdd }">
                                    <cmd-icon class="btn_icon" type="icon-huiyuan" size="40" color="#000000"></cmd-icon>
                                    <div class="text">新增会员</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 并台弹窗 -->
                <cartting-coffee-more :visible.sync="moreTableStatus" :tableInfo="checkedItem" :isOrderList.sync="isOrderList" :mergeCateringList="mergeCateringList" :popOrderData.sync="orderData" @refreshTable="handleRefresh" />
                <!-- 预付金弹窗 -->
                <cartting-pre-order :visible.sync="preOrderStatus" :tableInfo="checkedItem" :isOrderList.sync="isOrderList" @updateCatering="updateCatering" @change="getPrepaymentMoney4Table" />
            </div>
            <div class="roomRight">
                <div class="mainMenu">
                    <div class="menuWrap">
                        <el-scrollbar ref="scrollbarmLeft" style="height:100%" v-if="menuList.length > 0">
                            <div class="menuList">
                                <div @click="handleMenuClick(item.id)" class="menuItem" :class="{ 'selected': queryEntity.regionId === item.id }" v-for="(item, index) in menuList" :key="index">
                                    <span>{{ item.name }}</span>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div @click="handleRefresh" class="comIcon">
                        <el-tooltip class="item" effect="light" content="刷新房台" placement="bottom">
                            <cmd-icon class="btn_icon" type="icon-shuaxin" size="32" color="#ffffff"></cmd-icon>
                        </el-tooltip>
                    </div>
                </div>
                <div class="containar">
                    <el-scrollbar ref="scrollbar" style="height: 100%; width: 100%">
                        <div class="listWrap" v-if="!$app.isNull(dataList)">
                            <div class="listItem" v-for="(item, index) in dataList" :key="index" @click="handleListTable(item)">
                                <div class="listItemContent" :class="['status_' + item.sv_table_using_state, { selected: +item.sv_table_id === checkedItem.sv_table_id }]">
                                    <div class="preOrdered" v-if="item.sv_table_using_state === 5">
                                        <img class="img" :src="frontImgBase + '/images/cashier/preOrdered.png'" />
                                    </div>
                                    <div class="main">
                                        <!-- 0：空闲状态；1.已开台，等待客户点餐；2.正在使用中；3.待清桌；4.待接单；5.已预打；6.已预订；7.占用 9.待预结 -->
                                        <div class="left">
                                            <span class="statusIcon" :class="['icon_' + item.sv_table_using_state]">{{ item.stateName }}</span>
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
                        </div>
                        <div v-if="this.$app.isNull(dataList)" class="noContent">
                            <img class="img" :src="notImg" />
                            <div class="notTxt">暂无房台</div>
                            <div v-if="queryEntity.regionI3d !== -2" @click="handleJump({ type: 'tableSetting' })" class="noBtn">创建房台</div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="footDesk">
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === -1 }" @click="handleState(-1)">
                            <div class="desk_name">全部</div>
                            <div class="desk_value">{{ sumCout.cateringTableAllCount }}</div>
                        </div>
                    </div>
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === 0 }" @click="handleState(0)">
                            <div class="desk_name">空闲</div>
                            <div class="desk_value">{{ sumCout.freeStateCount }}</div>
                        </div>
                    </div>
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === 2 }" @click="handleState(2)">
                            <div class="desk_name">使用中</div>
                            <div class="desk_value">{{ sumCout.inUseStateCount }}</div>
                        </div>
                    </div>
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === 6 }" @click="handleState(6)">
                            <div class="desk_name">已预约</div>
                            <div class="desk_value">{{ sumCout.bookingCount }}</div>
                        </div>
                    </div>
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === 7 }" @click="handleState(7)">
                            <div class="desk_name">已占用</div>
                            <div class="desk_value">{{ sumCout.occupationCount }}</div>
                        </div>
                    </div>
                    <div class="desk_li">
                        <div class="desk_contant" :class="{ active: queryEntity.using_state === 5 }" @click="handleState(5)">
                            <div class="desk_name">已预结</div>
                            <div class="desk_value">{{ sumCout.isBeforeHandCount }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <pr-cashier v-if="showCashier" :dataJson="dataJson" :isOrderBack="isOrderBack"></pr-cashier>

        <!-- 新增会员 -->
        <member-add :visible.sync="memberAddStatus" :dataObj="memberAddImport"></member-add>
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
        <!-- 开台 -->
        <dc-dialog v-if="startOrderStatus" width="480" height="680" title="开台" @close="startOrderStatus = false">
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
                            <el-select class="selectBox2" v-model="popObject.sv_preknot_minute" placeholder="请选择开单员">
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

        <reservation :visible.sync="reservationStatus" :editReservation="editReservation" :tableInfo="reservationTableItem" :guiderList="guiderList" @submit="reservationListSubmit"></reservation>
        <reservationList :visible.sync="reservationListStatus" :tableInfo="reservationTableItem" @submit="reservationListSubmit"></reservationList>

        <!-- 房台列表弹窗 -->
        <pop-table-list :visible.sync="popTableListStatus" :dataObj="popTableData" @updateTable="handleUpdateTable"></pop-table-list>
        <!-- 并台弹窗 -->
        <pop-table-and :visible.sync="popTableAndStatus" :dataObj="popTableData" :mergeCateringTableIds="checkedItem.mergeCateringTableIds" @updateTable="handleUpdateTable"></pop-table-and>
        <!-- <number-change :visible.sync="numberChangeStatus" title="就餐人数" @handleNumberChange="handleNumberChange"></number-change> -->

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
@import "./roomList2.scss"
</style>
<script src="./roomList2.js"></script>

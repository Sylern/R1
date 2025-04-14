<!--预定列表弹窗-->
<template>
    <div class="reservationList" ref="reservationList" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="650" @close="closeDialog" zIndex="1001">
            <div class="contentWrap">
                <div class="topInfo">
                    <div class="tableInfo">
                        <div class="name" v-if="tableInfo.sv_table_id">{{ tableInfo.sv_table_name }}</div>
                        <div class="area" v-if="tableInfo.sv_table_id">{{ tableInfo.sv_region_name }}</div>
                    </div>
                    <div class="timeInfo">
                        <div class="tipsWrap">
                            <div class="tipsItem">
                                <span class="dot isSet"></span>
                                <span>已预定时段</span>
                            </div>
                            <div class="tipsItem">
                                <span class="dot"></span>
                                <span>可预定时段</span>
                            </div>
                        </div>
                        <div class="timeLine">
                            <div class="timeLineItem" v-for="(item, index) in 24" :key="index">
                                <div class="line"></div>
                                <div class="text">{{ index }}</div>
                                <div class="timeLineSelect" v-if="bookSelect[index] && bookSelect[index].isSet" :style="{ left: bookSelect[index].left, width: bookSelect[index].width }"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listContent">
                    <div class="dateSelectBtn">
                        <i class="el-icon-date"></i>
                        <el-date-picker v-model="selectDate" type="datetime" :clearable="false" @change="handleSelectDateChange">
                        </el-date-picker>
                    </div>
                    <div class="dateList" :style="{ transform: 'translateX('+ -1 * (activeIndex - 1) * 320 +'px)' }">
                        <div class="dateItem" :class="{ center: activeIndex <= index && index !== 0 }" v-for="(item, index) in weekList" :key="index" @click="handleChangeDate(index)">
                            <div class="date">
                                <div class="dateText">{{ item.dateText +' '+ item.weekText}}</div>
                                <div class="dateFlag" v-if="todayDate === item.dateText">今天</div>
                                <div class="dateFlag tommorow" v-if="tommorowDate === item.dateText">明天</div>
                                <div class="dot" :class="{ isSet: activeIndex === index }"></div>
                            </div>
                            <div class="bottomLine"></div>
                        </div>
                    </div>
                    <div class="listWrap">
                        <el-scrollbar ref="listWrap" style="width: 100%; height: 100%;">
                            <div class="dataListContent">
                                <div class="listItem" :class="{ selected: checkedItem.id === item.id }" v-for="(item, index) in bookingList" :key="index" @click="handleItem(item)">
                                    <div class="stateImg" v-if="item.sv_order_state !== 5">
                                        <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/reservation/'+ item.sv_order_state +'.png'" />
                                    </div>
                                    <div class="memberInfo">
                                        <div class="memberLogo">
                                            <img class="img" :src="handleImgUrl(item.sv_mr_headimg)" width="100%" />
                                        </div>
                                        <div class="memberTextInfo">
                                            <div class="memberName">
                                                <span class="nameText">{{ item.sv_booking_name || '散客' }}</span>
                                                <span class="phoneText">{{ item.sv_booking_mobile }}</span>
                                            </div>
                                            <div class="reservationDate">
                                                <span>订单时间：{{ item.sv_creation_date }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="timeInfo">
                                        <div class="timeBox">
                                            <div class="time">
                                                <span>{{ item.sv_arrival_date ? item.sv_arrival_date.substring(11, 16) : '' }}</span>
                                            </div>
                                            <div class="text">订单开始时间</div>
                                        </div>
                                        <div class="spaceBox">
                                            <div class="line"></div>
                                        </div>
                                        <div class="timeBox">
                                            <div class="time">
                                                <span>{{ item.sv_arrival_end_date ? item.sv_arrival_end_date.substring(11, 16) : '' }}</span>
                                            </div>
                                            <div class="text">订单结束时间</div>
                                        </div>
                                    </div>
                                    <div class="payInfo" v-if="item.payment_state === 1">
                                        <div class="payItem">
                                            <div class="payItemType">
                                                <div class="payIcon">
                                                    <div class="img">
                                                        <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/payImg/'+ item.payment_icon +'.png'" />
                                                    </div>
                                                    <div class="payText">{{ item.order_payment }}</div>
                                                </div>
                                            </div>
                                            <div class="payItemMoney" v-if="item.order_money > 0">￥{{ item.order_money }}</div>
                                            <div class="payItemMoney" v-else>未支付</div>
                                        </div>
                                        <div class="payItem" v-if="item.order_payment2">
                                            <div class="payItemType">
                                                <div class="payIcon">
                                                    <div class="img">
                                                        <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/payImg/'+ item.payment_icon +'.png'" />
                                                    </div>
                                                    <div class="payText">{{ item.order_payment2 }}</div>
                                                </div>
                                            </div>
                                            <div class="payItemMoney">￥{{ item.order_money2 }}</div>
                                        </div>
                                    </div>
                                    <div class="payInfo" v-if="item.payment_state === 0">
                                        <div class="payItem">
                                            <div class="payItemType">
                                                <div class="payIcon">
                                                    <div class="img"></div>
                                                    <div class="payText"></div>
                                                </div>
                                            </div>
                                            <div class="payItemMoney">未支付</div>
                                        </div>
                                    </div>
                                </div>
                                <el-empty class="empty" v-if="bookingList.length === 0" :description="currentDate + ' 暂无预约数据'"></el-empty>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="btn" @click="handleAddReservation">新增预约</div>
                    <div class="btn check" :class="{ disabled: $app.isNull(checkedItem.id)}" v-if="checkedItem.sv_order_state !== 1 && checkedItem.sv_order_state !== 2 && checkedItem.sv_order_state !== 4" @click="handleOpenTable">{{ checkedItem.sv_order_state === 5 ? '去付款' : '开台' }}</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './reservationList.scss';
</style>
<script src="./reservationList.js"></script>
<template>
    <div class="mHome" @click="shopSelectStatus = false;timeSelectStatus=false">
        <div class="topWrap">
            <div class="headWrap">
                <div class="btn_back" @click="showLoginoutStatus = true">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="filterTitle" @click.stop="timeSelectStatus=false;shopSelectStatus=true">
                    <span class="text">{{shopSelectText}}</span>
                    <i class="el-icon-arrow-down"></i>
                    <div class="titleSelect" v-if="shopSelectStatus">
                        <div class="item" @click.stop="changeLocalShop('')">所有店铺</div>
                        <div class="item" v-for="item in dataShopList" :key="item.user_id" @click.stop="changeLocalShop(item)">{{item.sv_us_name}}</div>
                    </div>
                </div>
                <!-- <div class="btn_right" @click.stop="shopSelectStatus=false;timeSelectStatus=true"> -->
                <div class="btn_right" @click.stop="shopSelectStatus=false;timeSelectStatus=true">
                    <span>{{timeSelectText}}</span>
                    <div class="timeSelect" v-if="timeSelectStatus">
                        <div class="item" @click.stop="changeTime(1)">今日</div>
                        <div class="item" @click.stop="changeTime(7)">近一周</div>
                        <div class="item" @click.stop="changeTime(30)">近一月</div>
                        <div class="item" @click.stop="calendarStatus = true">自定义</div>
                    </div>
                </div>
                <div @click.stop="()=>{return false}">
                    <calendar :show.sync="calendarStatus" :minDate="minDate" :maxDate="maxDate" mode="during" @change="calendarChange"></calendar>
                </div>
                <!-- <inlineCalendar :show.sync="timeSelectStatus" mode="during" @change="calendarChange" /> -->
            </div>
            <!--  -->
        </div>
        <div class="swiperContent">
            <div class="menuWrap">
                <div class="item" v-for="(item,index) in menuList" :key="index" @click="changeMenu(index)">
                    <div class="itemContent" :class="{'isSelected': activeIndex == item.menuPos}">
                        <span>{{item.name}}</span>
                        <span class="selectedBottom"></span>
                    </div>
                </div>
            </div>
            <swiper ref="mySwiper" class="swiper" :options="swiperOptions">
                <!-- 门店概况 -->
                <swiper-slide>
                    <div ref="homeWrap" class="homeWrap">
                        <div class="timeWrap" v-if="timeSelectText == '自定义'">
                            <span>{{startDate +'－'+ endDate}}</span>
                        </div>
                        <div class="statistics">
                            <div class="item">
                                <div class="key">营业总额(元)</div>
                                <div class="value">
                                    <!-- <span class="symbol">¥</span> -->
                                    <span>{{dataShopObj.order_total_receivables}}</span>
                                </div>
                            </div>
                            <div class="item">
                                <div class="key">优折赠(元)</div>
                                <div class="value">
                                    <!-- <span class="symbol">¥</span> -->
                                    <span>{{dataShopObj.order_total_pdgfee}}</span>
                                </div>
                            </div>
                            <div class="item">
                                <div class="key">笔数(笔)</div>
                                <div class="value">{{dataShopObj.totalCount}}</div>
                            </div>
                        </div>
                        <!-- 门店营业额统计 -->
                        <div class="dataContent turnover">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>门店营业额统计</span>
                                </div>
                            </div>
                            <div class="container">
                                <div class="item" v-for="(item,index) in dataShopObj.dataList" :key="index">
                                    <div class="dataWrap">
                                        <span>{{item.sv_us_name}}</span>
                                        <!-- <span>¥{{item.order_receivables}}</span> -->
                                    </div>
                                    <div class="progressWrap">
                                        <div class="progress" :style="{width: (item.order_receivables/maxTurnover > 0 && item.order_receivables/maxTurnover < 0.05 ? 0.05 : item.order_receivables/maxTurnover)*95+'%'}"></div>
                                        <span>¥{{item.order_receivables}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 支付构成 -->
                        <div class="dataContent payment">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>支付构成</span>
                                </div>
                            </div>
                            <div class="container">
                                <div class="dataPayType" ref="dataPayType" :style="{opacity: dataPayment.dataList && dataPayment.dataList.length > 0 ? 1 : 0}"></div>
                                <div v-if="dataPayment.dataList && dataPayment.dataList.length < 1" class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>

                        <!-- 门店名称 -->
                        <div class="tableWrap">
                            <table width="100%" border="0" cellspacing="0">
                                <thead>
                                    <tr>
                                        <td>店铺名称</td>
                                        <td>实收金额</td>
                                        <td>营业笔数</td>
                                        <td>优折赠</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in dataShopObj.dataList" :key="'table_'+index">
                                        <td>{{item.sv_us_name}}</td>
                                        <td>{{item.order_receivables}}</td>
                                        <td>{{item.orderciunt}}</td>
                                        <td>{{item.order_pdgfee}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 会员数统计 -->
                        <div class="memberWrap">
                            <div class="item">
                                <div class="memberTitle">新增会员消费</div>
                                <div class="memberCount">
                                    <span>{{dataMemberObj.newmember_count || 0}}</span>
                                    <span class="unit">人</span>
                                </div>
                                <div class="memberPercent">消费占比{{$app.isNull(dataMemberObj.newmember_ordercount_ratio) ? 0 : $app.moneyFixed(dataMemberObj.newmember_ordercount_ratio*100,2)+'%'}}</div>
                            </div>
                            <div class="item">
                                <div class="memberTitle">老会员消费</div>
                                <div class="memberCount">
                                    <span>{{dataMemberObj.oldmember_count || 0}}</span>
                                    <span class="unit">人</span>
                                </div>
                                <div class="memberPercent">消费占比{{$app.isNull(dataMemberObj.oldmember_ordercount_ratio) ? 0 : $app.moneyFixed(dataMemberObj.oldmember_ordercount_ratio*100,2)+'%'}}</div>
                            </div>
                            <div class="item">
                                <div class="memberTitle">会员总数消费</div>
                                <div class="memberCount">{{dataMemberObj.member_count || 0}}</div>
                                <div class="memberPercent">总消费{{dataMemberObj.member_ordercount}}笔</div>
                            </div>
                        </div>

                        <!-- 会员活跃分布 -->
                        <div class="dataContent memberActiveWrap">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>会员活跃分布</span>
                                </div>
                            </div>
                            <div class="container">
                                <div class="memberActive" ref="memberActive" :style="{opacity: dataMemberActive.dataList && dataMemberActive.dataList.length > 0 ? 1 : 0}"></div>
                                <div v-if="dataMemberActive.dataList && dataMemberActive.dataList.length < 1" class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>

                        <!-- 各门店会员数 -->
                        <div class="dataContent memberNumberWrap">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>各门店会员数</span>
                                </div>
                            </div>
                            <div class="container">
                                <div class="item" v-for="(item,index) in dataMemberNumber" :key="index">
                                    <div class="dataWrap">
                                        <span>{{item.name}}</span>
                                        <!-- <span>¥{{item.order_receivables}}</span> -->
                                    </div>
                                    <div class="progressWrap">
                                        <div class="progress" :style="{width: (item.value/maxMemberNumber > 0 && item.value/maxMemberNumber < 0.05 ? 0.05 : item.value/maxMemberNumber)*90+'%'}"></div>
                                        <span class="value">{{item.value}}人</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 商品销售排行 -->
                        <div class="dataContent">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>商品销售排行</span>
                                </div>
                            </div>
                            <div class="container ranking">
                                <div class="item" v-for="(item,index) in dataRanking" :key="index">
                                    <div class="logo">
                                        <img class="img" v-if="index === 0" :src="$store.state.base.frontImgBase+'/images/report/1.png'" />
                                        <img class="img" v-if="index === 1" :src="$store.state.base.frontImgBase+'/images/report/2.png'" />
                                        <img class="img" v-if="index === 2" :src="$store.state.base.frontImgBase+'/images/report/3.png'" />
                                        <div v-if="index > 2" class="indexWrap">{{index+1}}</div>
                                    </div>
                                    <div class="center">
                                        <div class="goodsName">{{item.product_name}}</div>
                                        <div>
                                            <span>单价：¥{{item.sv_p_unitprice}}</span>
                                            <span class="stock">数量：{{item.product_num}}</span>
                                        </div>
                                    </div>
                                    <div class="right">{{item.sv_p_priceTotal}}</div>
                                </div>
                                <div v-if="dataRanking.length < 1" class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
                <!-- 每日对账单 -->
                <swiper-slide>
                    <div ref="dailyWrap" class="dailyWrap">
                        <div class="timeWrap">
                            <span>{{startDate +'－'+ endDate}}</span>
                        </div>
                        <!-- 支付消费统计 -->
                        <div class="dataContent">
                            <div class="container">
                                <div class="listWrap">
                                    <div class="listItem" v-for="(item,index) in dataDailyBill.totalData" :key="'totalData'+ index">
                                        <div class="key">{{item.payment}}</div>
                                        <div class="value">{{item.amount}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="title mt-30">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>支付消费统计</span>
                                </div>
                            </div>
                            <div class="memberType">
                                <div class="memberTypeItem" :class="{'selected': memberType == 0}" @click="memberType = 0">
                                    <span v-if="dataDailyBill.memberConsumeData.head">{{dataDailyBill.memberConsumeData.head}}</span>
                                    <span v-else>会员0人</span>
                                </div>
                                <div class="memberTypeItem" :class="{'selected': memberType == 1}" @click="memberType = 1">
                                    <span v-if="dataDailyBill.individualConsumeData.head">{{dataDailyBill.individualConsumeData.head}}</span>
                                    <span v-else>散客0人</span>
                                </div>
                            </div>
                            <div class="container memberConsumWrap">
                                <div class="memberConsum" ref="memberConsum" :style="{opacity: memberConsumList.length > 0 ? 1 : 0}"></div>
                                <div v-if="memberConsumList.length < 1" class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>
                        <!-- 新增会员统计 -->
                        <div class="dataContent newMembersWrap">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>新增会员统计</span>
                                </div>
                            </div>
                            <div class="container">
                                <div class="newMembers" ref="newMembers" :style="{opacity: dataDailyBill.livemodel.list && dataDailyBill.livemodel.list.length > 0 ? 1 : 0}"></div>
                                <div v-if="dataDailyBill.livemodel.list && dataDailyBill.livemodel.list.length < 1" class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>
                        <!-- 会员充值金额 -->
                        <div class="dataContent">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>会员充值金额</span>
                                </div>
                            </div>

                            <template v-if="dataDailyBill.membeRechargeData.amount">
                                <div class="item" v-for="(item,index) in dataDailyBill.membeRechargeData.consumeData" :key="'membeRechargeData'+index">
                                    <div class="key">{{item.payment}}</div>
                                    <div class="value">{{$app.moneyFixed(item.amount,2)}}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </template>

                            <div class="title mt-30">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>充次金额</span>
                                </div>
                            </div>
                            <template v-if="dataDailyBill.membeChargeSubData.amount">
                                <div class="item" v-for="(item,index) in dataDailyBill.membeChargeSubData.consumeData" :key="'membeChargeSubData'+index">
                                    <div class="key">{{item.payment}}</div>
                                    <div class="value">{{$app.moneyFixed(item.amount,2)}}</div>
                                </div>
                                <div class="item bt">
                                    <div class="key">合计</div>
                                    <div class="value">{{$app.moneyFixed(dataDailyBill.membeChargeSubData.amount,2)}}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </template>
                        </div>
                        <!-- 次卡售卡统计 -->
                        <div class="dataContent">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>次卡售卡统计</span>
                                </div>
                            </div>
                            <div class="container timesCard" v-if="dataDailyBill.subcardsalescarddata.subcardsalescard && dataDailyBill.subcardsalescarddata.subcardsalescard.length > 0">
                                <div class="item isHead">
                                    <div class="left">项目名称</div>
                                    <div class="right">
                                        <span class="number">数量</span>
                                        <span class="money">金额</span>
                                    </div>
                                </div>
                                <div class="item" v-for="(item,index) in dataDailyBill.subcardsalescarddata.subcardsalescard" :key="'subcardsalescard'+index">
                                    <div class="left">{{item.name}}</div>
                                    <div class="right">
                                        <span class="number">{{item.number}}</span>
                                        <span class="money">{{$app.moneyFixed(item.amount,2)}}</span>
                                    </div>
                                </div>
                                <div class="item bt">
                                    <div class="left">合计</div>
                                    <div class="right">
                                        <span class="number"></span>
                                        <span class="money">{{$app.moneyFixed(dataDailyBill.subcardsalescarddata.amount,2)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="container timesCard" v-else>
                                <div class="data_null_img">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>
                        <!-- 退货金额 -->
                        <div class="dataContent">
                            <div class="title">
                                <div class="left">
                                    <span class="icon"></span>
                                    <span>退货金额</span>
                                </div>
                                <div class="right" v-if="dataDailyBill.refundData.amount">
                                    <span>{{$app.moneyFixed(dataDailyBill.refundData.amount,2)}}</span>
                                </div>
                            </div>
                            <template v-if="dataDailyBill.refundData.consumeData && dataDailyBill.refundData.consumeData.length > 0">
                                <div class="container timesCard" v-if="dataDailyBill.refundData.consumeData.length > 0">
                                    <div class="item" v-for="(item,index) in dataDailyBill.refundData.consumeData" :key="'refundData'+index">
                                        <span>{{item.payment}}</span>
                                        <span>{{$app.moneyFixed(item.amount,2)}}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="container timesCard">
                                    <div class="data_null_img">
                                        <img class="img" :src="$store.state.base.frontImgBase+'/images/report/data_null.png'" />
                                        <span>暂无数据</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </swiper-slide>
                <!-- swiper 页码 -->
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <div class="loginoutWrap" v-if="showLoginoutStatus" @click="showLoginoutStatus = false">
            <div class="contentWrap" @click.stop="()=>{return false}">
                <div class="text">确定退出登录</div>
                <div class="btnWrap">
                    <div class="btn cancel" @click="showLoginoutStatus = false">取消</div>
                    <div class="btn sure" @click="handleLoginout">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import './home.scss';
</style>
<script src="./home.js"></script>


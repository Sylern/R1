<template>
    <div class="handover">
        <div class="left">
            <div class="title">交接班</div>
            <div class="infoMain">
                <div class="userInfo">
                    <div class="logo">
                        <img class="img" :src="store_logo" />
                    </div>
                    <div class="rightInfo">
                        <div class="name">
                            <span>{{userInfo.sv_us_name}}</span>
                        </div>
                        <div class="telephone">
                            <span>{{userInfo.sv_us_phone}}</span>
                        </div>
                    </div>
                </div>
                <div class="infoItemScroll">
                    <el-scrollbar ref="infoItemScroll" style="width: 100%; height: 100%">
                        <div class="infoItem">
                            <div class="item">
                                <div class="key">备用金</div>
                                <div class="value">{{$app.moneyFixed(infoMain.reserve_cashmoney)}}</div>
                            </div>
                            <div class="item">
                                <div class="key">营业额（应收）</div>
                                <div class="value">{{$app.moneyFixed(infoMain.user_turnover_receivable)}}</div>
                            </div>
                            <div class="item">
                                <div class="key">营业额（实收）</div>
                                <div class="value">{{$app.moneyFixed(infoMain.user_turnover)}}</div>
                            </div>
                        </div>
                        <div class="infoItem">
                            <div class="item subTitle">
                                <div class="key">客单单量</div>
                                <div class="value highlight">{{infoMain.customer_volume}}</div>
                            </div>
                            <div class="item">
                                <div class="key">会员</div>
                                <div class="value">{{infoMain.member}}</div>
                            </div>
                            <div class="item">
                                <div class="key">散客</div>
                                <div class="value">{{infoMain.individual}}</div>
                            </div>
                        </div>
                        <div class="infoItem" v-if="infoMain.deposit_volume">
                            <div class="item subTitle">
                                <div class="key">押金笔数</div>
                                <div class="value highlight">{{infoMain.deposit_volume}}笔</div>
                            </div>
                            <div class="item">
                                <div class="key">已退押金笔数</div>
                                <div class="value">{{infoMain.deposit_Return_volume}}笔</div>
                            </div>
                            <div class="item">
                                <div class="key">未退押金笔数</div>
                                <div class="value">{{infoMain.deposit_Refundable_volume}}笔</div>
                            </div>
                        </div>
                        <div class="infoItem listWrap">
                            <div class="item subTitle">
                                <div class="key">
                                    <span>综合汇总</span>
                                    <el-tooltip effect="dark" placement="top">
                                        <div slot="content">温馨提示：综合总收入=会员总收入+散客消费总额+会员消费总额-会员储值卡消费-赊账-会员退货合计（不含储值卡的退货金额）-散客退货合计+会员还款-会员储值卡还款-找零汇总+押金汇总-退还押金</div>
                                        <div class="textTips">
                                            <i class="el-icon-question"></i>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="value highlight">{{$app.moneyFixed(infoMain.comprehensive_summary.summary_money)}}</div>
                            </div>
                            <div class="itemWrap">
                                <div class="item" v-for="(item, index) in infoMain.comprehensive_summary.detailed" :key="index">
                                    <div class="key">{{item.type_name}}</div>
                                    <div class="value">{{$app.moneyFixed(item.type_money)}}</div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="top">
                <div class="key">选择交接班时间：</div>
                <date-time-picker needTimePicker :paramData="[start,end]" @change="handleChangeTime"></date-time-picker>
                <!-- <div class="column">
                    <div class="logo" style="background-color:#EBF2FD;">
                        <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/handover1.png'" />
                    </div>
                    <div class="rightInfo">
                        <div class="name">
                            <span>上班时间</span>
                        </div>
                        <div class="telephone">
                            <el-date-picker v-model="stratTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="column middle">
                    <div class="logo" style="background-color:#F9EDE6;">
                        <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/handover2.png'" />
                    </div>
                    <div class="rightInfo">
                        <div class="name">
                            <span>交班时间</span>
                        </div>
                        <div class="telephone">
                            <span>04月09日 17:19</span>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="logo" style="background-color:#EBF2FD;">
                        <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/handover3.png'" />
                    </div>
                    <div class="rightInfo">
                        <div class="name">
                            <span>上班时长</span>
                        </div>
                        <div class="telephone">
                            <span>08小时19分钟</span>
                        </div>
                    </div>
                </div> -->
            </div>
            <div class="listContent" v-if="hasSaleData">
                <el-scrollbar ref="scrollbarRight" style="height:100%; width:100%">
                    <div class="listWrap">
                        <template v-for="(item, index) in subInfo">
                            <div class="row" v-if="item.summary_money" :key="index">
                                <div class="item subTitle highlight">
                                    <div class="key">{{item.summary_name}}</div>
                                    <div class="value">{{$app.moneyFixed(item.summary_money)}}</div>
                                </div>
                                <div class="item" v-for="(item, index) in item.detailed" :key="index">
                                    <div class="key">{{item.type_name}}</div>
                                    <div class="value">{{$app.moneyFixed(item.type_money)}}</div>
                                </div>
                            </div>
                        </template>
                        <!-- 实收定金汇总  -->
                        <!-- <div class="row" v-if="infoMain.collectDownpayment_summary.summary_money">
                            <div class="item subTitle highlight">
                                <div class="key">{{infoMain.collectDownpayment_summary.summary_name}}</div>
                                <div class="value">{{$app.moneyFixed(infoMain.collectDownpayment_summary.summary_money)}}</div>
                            </div>
                            <div class="item" v-for="(item, index) in infoMain.collectDownpayment_summary.detailed" :key="index">
                                <div class="key">{{item.type_name}}</div>
                                <div class="value">{{$app.moneyFixed(item.type_money)}}</div>
                            </div>
                        </div> -->
                        <!-- 退款定金汇总  -->
                        <!-- <div class="row" v-if="infoMain.returnDownpayment_summary.summary_money">
                            <div class="item subTitle highlight">
                                <div class="key">{{infoMain.returnDownpayment_summary.summary_name}}</div>
                                <div class="value">{{$app.moneyFixed(infoMain.returnDownpayment_summary.summary_money)}}</div>
                            </div>
                            <div class="item" v-for="(item, index) in infoMain.returnDownpayment_summary.detailed" :key="index">
                                <div class="key">{{item.type_name}}</div>
                                <div class="value">{{$app.moneyFixed(item.type_money)}}</div>
                            </div>
                        </div> -->
                    </div>
                </el-scrollbar>
            </div>

            <div class="btnWrap">
                <div class="switch" v-if="hasSaleData">
                    <span>是否打印销售明细：</span>
                    <el-switch active-color="#13ce66" v-model="printSwitchStatus"> </el-switch>
                </div>
                <div class="btnRight">
                    <div class="btnContent" v-if="hasSaleData" @click="handleSaleList">
                        <span>销售明细</span>
                    </div>
                    <div class="btnHandover" @click="handleSubmit">
                        <span>交班</span>
                    </div>
                </div>
            </div>

            <div class="noData" v-if="!hasSaleData">
                <span>暂无数据</span>
            </div>
        </div>
        <el-dialog class="system_dialog" :visible.sync="showList" title="销售列表" width="1000px">
            <div class="saleListDialog">
                <div class="header">
                    <div class="td1">序号</div>
                    <div class="td2">商品名称</div>
                    <div class="td3">商品编码</div>
                    <!-- <div class="td4">销售时间</div> -->
                    <div class="td5">数量</div>
                    <div class="td6">小计</div>
                </div>
                <div class="content">
                    <el-scrollbar style="width:100%;">
                        <div class="category" v-for="(category, index) in saleList" :key="index">
                            <div class="categoryText">{{category.sv_pc_name +'（￥'+ $app.moneyFixed(category.current_sale_total) +'）'}}</div>
                            <div class="tr" v-for="(item, pos) in category.list" :key="pos">
                                <div class="td1">{{pos+1}}</div>
                                <div class="td2">{{item.product_name}}</div>
                                <div class="td3">{{item.sv_p_artno || item.sv_p_barcode}}</div>
                                <!-- <div class="td4">{{$app.currentTime(new Date(item.order_datetime))}}</div> -->
                                <div class="td5">X{{item.current_sale_num}}</div>
                                <div class="td6">{{$app.moneyFixed(item.current_sale_total)}}</div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="footer">
                    <div class="td1">合计</div>
                    <div class="td2"></div>
                    <div class="td3"></div>
                    <!-- <div class="td4"></div> -->
                    <div class="td5">{{saleTotal.current_total_num}}</div>
                    <div class="td6">{{$app.moneyFixed(saleTotal.current_total_money)}}</div>
                </div>
                <template v-if="returnList.length > 0">
                    <div class="returnTitle">退货列表</div>
                    <div class="header">
                        <div class="td1">序号</div>
                        <div class="td2">商品名称</div>
                        <div class="td3">商品编码</div>
                        <!-- <div class="td4">销售时间</div> -->
                        <div class="td5">数量</div>
                        <div class="td6">小计</div>
                    </div>
                    <div class="content">
                        <el-scrollbar style="width:100%;">
                            <div class="category" v-for="(category, index) in returnList" :key="index">
                                <div class="categoryText">{{category.sv_pc_name +'（￥'+ $app.moneyFixed(category.return_total) +'）'}}</div>
                                <div class="tr" v-for="(item, pos) in category.list" :key="pos">
                                    <div class="td1">{{pos+1}}</div>
                                    <div class="td2">{{item.product_name}}</div>
                                    <div class="td3">{{item.sv_p_artno}}</div>
                                    <!-- <div class="td4">{{$app.currentTime(new Date(item.order_datetime))}}</div> -->
                                    <div class="td5">X{{item.return_num}}</div>
                                    <div class="td6">{{$app.moneyFixed(item.return_total)}}</div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="footer">
                        <div class="td1">合计</div>
                        <div class="td2"></div>
                        <div class="td3"></div>
                        <!-- <div class="td4"></div> -->
                        <div class="td5">{{returnTotal.current_total_num}}</div>
                        <div class="td6">{{$app.moneyFixed(returnTotal.current_total_money)}}</div>
                    </div>
                </template>

                <div class="btnWrap">
                    <span class="btnPrint" @click="printDetail">打印</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style  lang="sass" scoped>
@import "./handover.scss"
</style>
<script src="./handover.js"></script>
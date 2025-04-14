<!-- 美业销售流水 -->
<template>
    <div class="cosmetology">
        <div class="filterWrap queryFilter">
            <div class="btnWrap">
                <div class="left">
                    <!-- <div class="btnItem btnBasic" @click="handleExport">导出</div> -->
                </div>
                <div class="right searchInput">
                    <el-input v-model.trim="query.keywards" placeholder="请输入卡号/手机号/姓名" clearable @clear="handleReGetRechargeInfo" @keyup.enter.native="handleReGetRechargeInfo">
                        <i @click="handleReGetRechargeInfo" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="selectList">
                <div class="top">
                    <div class="left">
                        <div class="item">
                            <div class="key">支付方式：</div>
                            <div class="select">
                                <el-select v-model.trim="query.pays" multiple collapse-tags placeholder="选择支付方式" @change="handleReGetRechargeInfo">
                                    <el-option v-for="item in paymentList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">订单状态：</div>
                            <div class="select">
                                <el-select v-model.trim="query.state" placeholder="请选择订单状态" filterable @change="handleReGetRechargeInfo">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option label="正常订单" :value="0"></el-option>
                                    <el-option label="退款订单" :value="1"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="center">
                        <div class="item">
                            <div class="key">员工：</div>
                            <div class="select">
                                <el-select v-model.trim="query.operators" multiple collapse-tags placeholder="请选择员工" @change="handleReGetRechargeInfo">
                                    <el-option v-for="item in salesclerkInfo" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">时间：</div>
                            <date-time-picker :paramData="defaultDate" @change="handleChangeTime" needTimePicker></date-time-picker>
                        </div>
                    </div>
                    <div class="right">
                        <div class="item">
                            <div class="key">是否对账：</div>
                            <div class="select">
                                <el-select v-model.trim="query.verify_type" placeholder="请选择是否对账" @change="handleReGetRechargeInfo">
                                    <el-option label="全部" :value="-1"></el-option>
                                    <el-option label="已对账" :value="1"></el-option>
                                    <el-option label="未对账" :value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tableWrap queryTable">
            <div class="tableBox">
                <myTable ref="myTable" rowKey="id" rowClick notHeight :data="dataJson" :minWidth="80">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="row">
                            <span>{{ row.index > -1 ? (query.pageIndex - 1) * query.pageSize + row.index + 1 : ''}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell fixed label="流水号" prop="order_running_id" width="130" showTooltip>
                        <template v-slot:default="row">
                            <template v-if="row.index > -1">
                                <i class="el-icon-document-copy" v-copy="row.order_running_id" title="复制流水号"></i>
                                <span>{{ row.order_running_id }}</span>
                            </template>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="下单时间" prop="order_datetime" width="150" align="center"></my-table-cell>
                    <my-table-cell label="卡号/姓名" prop="mrName" width="130" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="手机号码" prop="sv_mr_mobile" width="120" align="center"></my-table-cell>
                    <my-table-cell label="消费项目" prop="productName" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="单价" prop="product_unitprice" align="center"></my-table-cell>
                    <my-table-cell label="金额" prop="product_total" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="提成人" prop="workerWrap" width="200" align="center" showTooltip>
                        <template v-slot:default="row">
                            <div v-if="$app.isNull(row.index) && row.producttype_id === 1" class="workerWrap">
                                <el-popover popper-class="workerWrapPop" placement="top" width="500" trigger="hover">
                                    <div class="workerWrapText" slot="reference">
                                        <div class="workerItemLine" v-for="(wsItem, wdIndex) in row.list" :key="wdIndex">
                                            <!-- <span>第{{ workerTextList[wdIndex] }}工位(</span> -->
                                            <span>{{ wsItem.map(emItem => emItem.employeeName).join('、') }}</span>
                                        </div>
                                        <div class="workerEmpty" v-if="row.list.length === 0">未设置</div>
                                    </div>
                                    <div class="popTitle">工位/业绩</div>
                                    <template v-for="(wsItem, wdIndex) in row.list">
                                        <div class="wsItem" v-if="wsItem.length > 0" :key="wdIndex">
                                            <div class="wsFlag">第{{ workerTextList[wdIndex] }}工位</div>
                                            <div class="wsList">
                                                <div class="listItem" v-for="(emItem, emIndex) in wsItem" :key="emIndex" @click="emItem.isAppoint = !emItem.isAppoint">
                                                    <div class="indexBg" :class="emItem.selectedType" :style="{ width: emItem.percent + '%' }"></div>
                                                    <div class="itemContent">
                                                        <div class="infoLeft">
                                                            <div class="itemNumer">
                                                                <span>{{ emItem.sv_employee_number }}</span>
                                                            </div>
                                                            <div class="name">{{ emItem.employeeName }}</div>
                                                        </div>
                                                        <div class="infoRight">{{ emItem.percent }}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </el-popover>
                                <div class="btnEdit" v-if="row.is_Commission" @click.stop="handleWorkstationShow(row)">
                                    <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                </div>
                                <el-tooltip v-else effect="dark" placement="top" content="只支持当天及未撤单订单修改业绩" class="etr_tooltip">
                                    <div class="btnEdit">
                                        <cmd-icon class="icon-bianji2" color="#cccccc" size="30"></cmd-icon>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="mainBtn" v-else>查看</div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="订单状态" prop="orderStatus" width="100" align="center">
                        <template v-slot:default="row">
                            <template v-if="row.index > -1">
                                <div class="orderStatus red" v-if="row.order_state !== 0">
                                    <span v-if="row.sv_sales_return_type === 2">退货单</span>
                                    <span v-else>{{orderText[row.order_state]}}</span>
                                    <span v-if="row.is_anti_settle_new">反结账</span>
                                </div>
                                <div class="orderStatus red" v-if="row.order_state === 0 && row.sv_sales_return_type === 3">
                                    <span>换货单</span>
                                    <span v-if="row.is_anti_settle_new">反结账</span>
                                </div>
                            </template>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="消费类型" prop="producttype_id" align="center">
                        <template v-slot:default="row">
                            <template v-if="$app.isNull(row.index)">
                                <span>{{ producttype[row.producttype_id] }}</span>
                            </template>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="入账" prop="verifies_money" align="center"></my-table-cell>
                    <my-table-cell label="支付方式" prop="order_payment" width="150" align="center" showTooltip></my-table-cell>
                    <my-table-cell label="优惠" prop="deserved" align="center">
						<template v-slot:default="row">
                            <template v-if="row.index > -1">
                                <span>{{ row.deserved }}</span>
                            </template>
                            <template v-else>
                                <el-tooltip effect="dark" placement="right" v-if="row.sv_preferential_data.length > 0">
                                    <div slot="content">
                                        <div class="tips" v-for="(item, index) in row.sv_preferential_data" :key="index">{{ (index + 1) +'：'+ item.s }}</div>
                                    </div>
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </template>
                        </template>
					</my-table-cell>
                    <my-table-cell label="对账" prop="is_verify" align="center">
                        <template v-slot:default="row">
                            <div v-if="row.index > -1" @click.stop="">
                                <el-switch v-model="row.is_verify" :disabled="row.is_verify" @change="handleVerify(row)"></el-switch>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="操作人员" prop="consumeusername" width="120" align="center"></my-table-cell>
                    <my-table-cell label="备注" prop="sv_remarks" width="200" align="center" showTooltip></my-table-cell>
                    <my-table-cell fixed="right" label="操作" prop="handle" width="200" align="center">
                        <template v-slot:default="row">
                            <template v-if="row.index > -1">
                                <el-button @click.stop="handlePrintCustom(row)" type="text" size="small">打印</el-button>
                                <el-button @click.stop="handleEdit(row)" type="text" size="small">详情</el-button>
                                <el-button :disabled="row.order_state === 2" @click.stop="returenSales(row)" type="text" size="small">撤单</el-button>
                                <el-button @click.stop="handleRemark(row)" type="text" size="small">备注</el-button>
                            </template>
                        </template>
                    </my-table-cell>
                </myTable>
            </div>
            <div v-if="dataJson.length>0" class="pageWrap">
                <div class="left">
                    <label>共</label>
                    <span class="count">{{ order_num }}</span>
                    <label>笔，消费总额：</label>
                    <span class="money">￥{{ order_money }}</span>
                    <label>总入账：</label>
                    <span class="money">￥{{ verifies_money }}</span>
                </div>
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <dc-dialog v-if="contentInfoVisible" width="1280" height="660" zIndex="100" class="contentInfoMain" @close="contentInfoVisible = false">
            <div class="contentInfo">
                <div class="leftContentWrap">
                    <div class="memberInfo">
                        <div class="headWrap">
                            <div class="headImg">
                                <img class="img" :src="contentInfoHeadImg" />
                            </div>
                            <div class="headInfo">
                                <div class="name">{{ contentInfo.member_id ? contentInfo.sv_mr_name : '散客'}}</div>
                                <div class="phone" v-if="contentInfo.member_id">{{ contentInfo.sv_mr_mobile }}</div>
                            </div>
                        </div>
                        <div class="infoItem" v-if="contentInfo.member_id">
                            <div class="key">会员卡号</div>
                            <div class="value">：{{ contentInfo.sv_mr_cardno }}</div>
                        </div>
                        <div class="infoItem" v-if="contentInfo.member_id">
                            <div class="key">会员等级</div>
                            <div class="value">：{{ contentInfo.memberlevel_name }}</div>
                        </div>
                        <div class="infoItem" v-if="contentInfo.member_id">
                            <div class="key">开卡门店</div>
                            <div class="value">：{{ contentInfo.member_user_name }}</div>
                        </div>
                    </div>
                    <div class="orderInfo">
                        <div class="infoItem">
                            <div class="key">单号</div>
                            <div class="value">：{{ contentInfo.order_running_id }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">下单时间</div>
                            <div class="value">：{{ contentInfo.order_datetime }}</div>
                        </div>
                    </div>
                    <div class="moreInfo">
                        <div class="infoItem">
                            <div class="key">操作人</div>
                            <div class="value">：{{ contentInfo.consumeusername }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">消费门店</div>
                            <div class="value">：{{ contentInfo.user_name }}</div>
                        </div>
                        <div class="infoItem">
                            <div class="key">备注</div>
                            <div class="value">
                                <span>：{{ contentInfo.sv_remarks }}</span>
                                <div class="btnEdit" @click.stop="handleRemark(contentInfo)">
                                    <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rightContentWrap">
                    <div class="tableWrap">
                        <div class="tableBox">
                            <myTable ref="myTableContent" rowKey="order_id" :data="contentInfo.detail_list" minWidth="80">
                                <my-table-cell label="序号" prop="序号" width="60" align="center">
                                    <template v-slot:default="row">
                                        <span>{{ row.index + 1 }}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="消费项目" prop="product_name" width="160" showTooltip></my-table-cell>
                                <my-table-cell label="消费类型" prop="producttype_id" align="center" showTooltip>
                                    <template v-slot:default="row">
                                        <span>{{ producttype[row.producttype_id] }}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="单价" prop="product_price" width="120" align="center" showTooltip></my-table-cell>
                                <my-table-cell label="成交单价" prop="product_unitprice" width="120" align="center"></my-table-cell>
                                <my-table-cell label="数量" prop="product_num" align="center" showTooltip></my-table-cell>
                                <my-table-cell label="消费金额" prop="product_total" align="center" showTooltip>
                                    <template v-slot:default="row">
                                        <span class="price">￥{{ $app.moneyFixed(row.product_total) }}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="提成人" prop="control" width="200" align="center" showTooltip>
                                    <template v-slot:default="row">
                                        <div v-if="row.producttype_id === 1" class="workerWrap">
                                            <el-popover popper-class="workerWrapPop" placement="top" width="500" trigger="hover">
                                                <!-- <el-tag slot="reference">工位/业绩</el-tag> -->
                                                <div class="workerWrapText" slot="reference">
                                                    <div class="workerItemLine" v-for="(wsItem, wdIndex) in row.list" :key="wdIndex">
                                                        <!-- <span>第{{ workerTextList[wdIndex] }}工位(</span> -->
                                                        <span>{{ wsItem.map(emItem => emItem.employeeName).join('、') }}</span>
                                                    </div>
                                                    <div class="workerEmpty" v-if="row.list.length === 0">未设置</div>
                                                </div>
                                                <div class="popTitle">工位/业绩</div>
                                                <template v-for="(wsItem, wdIndex) in row.list">
                                                    <div class="wsItem" v-if="wsItem.length > 0" :key="wdIndex">
                                                        <div class="wsFlag">第{{ workerTextList[wdIndex] }}工位</div>
                                                        <div class="wsList">
                                                            <div class="listItem" v-for="(emItem, emIndex) in wsItem" :key="emIndex" @click="emItem.isAppoint = !emItem.isAppoint">
                                                                <div class="indexBg" :class="emItem.selectedType" :style="{ width: emItem.percent + '%' }"></div>
                                                                <div class="itemContent">
                                                                    <div class="infoLeft">
                                                                        <div class="itemNumer">
                                                                            <span>{{ emItem.sv_employee_number }}</span>
                                                                        </div>
                                                                        <div class="name">{{ emItem.employeeName }}</div>
                                                                    </div>
                                                                    <div class="infoRight">{{ emItem.percent }}%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </el-popover>
                                            <div class="btnEdit" v-if="row.is_Commission" @click.stop="handleWorkstationShow(row)">
                                                <cmd-icon class="icon-bianji2" color="#9967FB" size="30"></cmd-icon>
                                            </div>
                                            <el-tooltip v-else effect="dark" placement="top" content="只支持当天及未撤单订单修改业绩" class="etr_tooltip">
                                                <div class="btnEdit">
                                                    <cmd-icon class="icon-bianji2" color="#cccccc" size="30"></cmd-icon>
                                                </div>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </my-table-cell>
                            </myTable>
                        </div>
                        <div v-if="contentInfo.detail_list.length > 0" class="pageWrap">
                            <label>消费总额：</label>
                            <span class="money">￥{{ $app.addNumber(contentInfo.order_money, contentInfo.order_money2) }}</span>
                            <label>入账：</label>
                            <span class="money">￥{{ contentInfo.verify_money || 0 }}</span>
                        </div>
                        <div class="statistics" v-if="contentInfo.detail_list.length > 0">
                            <div class="container">
                                <div class="item">
                                    <div class="key">数量合计：</div>
                                    <div class="value">{{contentInfo.numcount}}</div>
                                </div>
                                <template v-if="contentInfo.order_state !== 2">
                                    <div class="item">
                                        <div class="key">应收金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(contentInfo.order_receivable_bak_new)}}</div>
                                    </div>
                                    <div class="item" v-if="contentInfo.deserved">
                                        <div class="key">优惠金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(contentInfo.deserved)}}</div>
                                    </div>
                                    <div class="item" v-if="contentInfo.sv_coupon_names">
                                        <div class="key">优惠券(已用)：</div>
                                        <div class="value multiLine">
                                            <el-tooltip effect="dark" placement="top" :content="contentInfo.sv_coupon_names.join()">
                                                <span>{{ contentInfo.sv_coupon_names.join() }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <div class="key">实收金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(contentInfo.order_receivable_bak_new)}}</div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="item">
                                        <div class="key">退货金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(contentInfo.order_receivable_bak_new)}}</div>
                                    </div>
                                </template>
                                <div class="item">
                                    <div class="key">找零金额：</div>
                                    <div class="value">¥{{$app.moneyFixed(contentInfo.sv_give_change)}}</div>
                                </div>
                                <div class="item">
                                    <div class="key">抹零金额：</div>
                                    <div class="value">¥{{$app.moneyFixed(contentInfo.free_change)}}</div>
                                </div>
                                <div class="item" v-if="contentInfo.sv_discrepancy_money > 0">
                                    <div class="key">换货差额：</div>
                                    <div class="value">¥{{$app.moneyFixed(contentInfo.sv_discrepancy_money)}}</div>
                                </div>
                                <div class="item">
                                    <div class="key">支付方式：</div>
                                    <div class="value" v-if="!$app.isZero(contentInfo.order_money2)">
                                        <span v-if="contentInfo.order_payment === '储值卡' && !$app.isNull(contentInfo.order_give)">
                                            <label>{{contentInfo.order_payment +'(本金：¥'+ $app.moneyFixed(contentInfo.order_principal) +'，赠金：¥'+ $app.moneyFixed(contentInfo.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{contentInfo.order_payment}}</span>
                                    </div>
                                    <div class="value" v-else>
                                        <span v-if="contentInfo.order_payment === '储值卡' && !$app.isNull(contentInfo.order_give)">
                                            <label>{{contentInfo.order_payment +'(本金：¥'+ $app.moneyFixed(contentInfo.order_principal) +'，赠金：¥'+ $app.moneyFixed(contentInfo.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{contentInfo.order_payment +'(¥'+ $app.moneyFixed(contentInfo.order_money) +') '}}</span>
                                        <span v-if="contentInfo.order_payment2 === '储值卡' && !$app.isNull(contentInfo.order_give)">
                                            <label>{{contentInfo.order_payment2 +'(本金：¥'+ $app.moneyFixed(contentInfo.order_principal) +'，赠金：¥'+ $app.moneyFixed(contentInfo.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{contentInfo.order_payment2 +'(¥'+ $app.moneyFixed(contentInfo.order_money2) +')'}}</span>
                                    </div>
                                </div>
                                <template v-if="!$app.isNull(contentInfo.prlist)">
                                    <div class="item" v-if="!$app.isNull(contentInfo.prlist[0].order_number)">
                                        <div class="key">支付单号：</div>
                                        <div class="value">{{contentInfo.prlist[0].order_number}}</div>
                                    </div>
                                </template>
                                <div class="item" v-if="order_discount || member_discount || coupon_discount">
                                    <div class="key">折扣类型：</div>
                                    <div class="value">
                                        <span v-if="order_discount">{{'整单折('+order_discount+')'}}</span>
                                        <span v-if="member_discount">{{'会员折('+member_discount+')'}}</span>
                                        <span v-if="coupon_discount">{{'优惠券('+coupon_discount+')'}}</span>
                                    </div>
                                </div>
                                <div class="item" v-if="contentInfo.salesperson">
                                    <div class="key">导购员：</div>
                                    <div class="value multiLine" alt="contentInfo.salesperson">{{contentInfo.salesperson}}</div>
                                </div>
                                <div class="item" v-if="contentInfo.order_state !== 2">
                                    <div class="key">下单时间：</div>
                                    <div class="value">{{contentInfo.order_datetime}}</div>
                                </div>
                                <!-- <div class="item" v-else>
                                    <div class="key">退货时间：</div>
                                    <div class="value">{{$app.currentTime(new Date(contentInfo.order_datetime), 'yyyy-MM-dd HH:mm:ss')}}</div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="btnWrap">
                        <el-button class="btnItem btnBasic" @click.stop="handlePrintCustom(contentInfo)">打印</el-button>
                        <el-button class="btnItem btnBasic" :disabled="contentInfo.is_verify" @click.stop="handleVerify(contentInfo)">对账</el-button>
                        <el-button class="btnItem btnBasic" :disabled="contentInfo.return_type !== 1 && contentInfo.order_state === 2" @click.stop="returenSales(contentInfo)">撤单</el-button>
                    </div>
                </div>
            </div>
        </dc-dialog>
        <!-- 退货弹窗 -->
        <goods-return :visible.sync="goodsReturnStatus" :orderState="goodsReturnOrderStatus" :dataList="goodsReturntList" @handleBack="goodsReturnAction"></goods-return>
        <!-- 设置服务员 -->
        <order-workstation :visible.sync="workstationStatus" :emList="emList" :dealMoney="dealMoney" @handleWorkstation="handleWorkstation"></order-workstation>
    </div>
</template>

<style  lang="sass" rowd>
@import "./cosmetology.scss"
</style>
<script src="./cosmetology.js"></script>
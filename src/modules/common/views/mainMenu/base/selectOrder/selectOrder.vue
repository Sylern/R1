<!--选择订单-->
<template>
    <div class="selectOrder" ref="selectOrder" v-if="dialogVisible" tabindex="0" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1280" height="680" @close="closeDialog">
            <div class="orderContainer">
                <div class="left">
                    <!-- <div class="title">
                        <span>交易订单</span>
                    </div> -->
                    <div class="orderTitle">订单列表</div>
                    <div class="filterWrap">
                        <div class="timePicker">
                            <date-time-picker needTimePicker :paramData="defaultDate" @change="handleChangeTime"></date-time-picker>
                        </div>
                    </div>
                    <div class="inputBox">
                        <!-- <div class="radioGroup">
                            <el-radio-group v-model="searchType">
                                <el-radio :label="1">单号</el-radio>
                                <el-radio :label="2">会员</el-radio>
                            </el-radio-group>
                        </div> -->
                        <el-select v-model="searchType">
                            <el-option label="单号" :value="0"></el-option>
                            <el-option label="会员" :value="1"></el-option>
                        </el-select>
                        <el-input class="inputSearch" :class="{hasText: searctText.length > 0}" type="text" ref="inputSearch" v-model.trim="searctText" clearable @keyup.native.enter="handleInput" @clear="handleInput" :placeholder="searchPlaceholder[searchType]">
                            <i class="el-icon-search" slot="append"></i>
                            <!-- <i class="el-icon-search" slot="suffix"></i> -->
                        </el-input>
                    </div>
                    <el-scrollbar class="el-list" ref="scrollContent">
                        <div class="listWrap" ref="listWrap">
                            <div class="item" :class="{'selected': dataContent.group_id === item.group_id && dataContent.order_state === item.order_state}" v-for="(item,index) in orderList" :key="index" @click="handleOrder(item)">
                                <div class="itemLeft">
                                    <div class="itemLine">
                                        <span class="memberInfo" v-if="item.sv_mr_name">
                                            <label class="name">{{item.sv_mr_name}}</label>
                                            <label>{{item.sv_mr_mobile}}</label>
                                        </span>
                                        <span v-else>散客</span>
                                    </div>
                                    <div class="itemLine">
                                        <div>单号：<i class="el-icon-document-copy" v-copy="item.order_running_id" title="复制单号"></i> {{item.order_running_id}}</div>
                                    </div>
                                    <div class="itemLine">时间：{{item.order_datetime}}</div>
                                </div>
                                <div class="itemRight">
                                    <div class="itemLine">
                                        <span>￥{{ $app.moneyFixed($app.addNumber(item.order_money1, item.order_money2)) }}</span>
                                    </div>
                                    <div class="itemLine">
                                        <!-- <div>单号：{{item.sv_order_list_id}}</div> -->
                                        <div class="orderStatus red" v-if="item.order_state !== 0">
                                            <span v-if="item.sv_sales_return_type === 2">退货单</span>
                                            <span v-else>{{orderText[item.order_state]}}</span>
                                            <span v-if="item.is_anti_settle_new">反结账</span>
                                        </div>
                                        <div class="orderStatus red" v-if="item.order_state === 0 && item.sv_sales_return_type === 3">
                                            <span>换货单</span>
                                            <span v-if="item.is_anti_settle_new">反结账</span>
                                        </div>
                                    </div>
                                    <div class="itemLine" v-if="userInfo.sv_us_industrytype === 27">
                                        <div class="orderStatus" v-if="item.sv_catering_grade">房台：{{item.sv_catering_grade}}</div>
                                        <div class="orderStatus" v-else-if="item.order_serial_number && userInfo.sv_uit_cache_name==='cache_name_catering'">取餐号：{{item.order_serial_number}}</div>
                                    </div>
                                </div>
                                <!-- <div class="memberInfo">
                                    <div class="memberInfo_lf">
                                        <span v-if="item.sv_mr_name">
                                            <label class="name">{{item.sv_mr_name}}</label>
                                            <label>{{item.sv_mr_mobile}}</label>
                                        </span>
                                        <span v-else>散客</span>
                                    </div>
                                    <div class="memberInfo_rt">
                                        <span>￥{{ $app.moneyFixed($app.addNumber(item.order_money1, item.order_money2)) }}</span>
                                    </div>
                                </div>
                                <div class="orderNumber">
                                    <div class="orderNumber_lf">
                                        <div>单号：<i class="el-icon-document-copy" v-copy="item.order_running_id" title="复制单号"></i> {{item.order_running_id}}</div>
                                    </div>
                                    <div class="orderNumber_rt">
                                        <div class="orderStatus red" v-if="item.order_state !== 0">
                                            <span v-if="item.sv_sales_return_type === 2">退货单</span>
                                            <span v-else>{{orderText[item.order_state]}}</span>
                                            <span v-if="item.is_anti_settle_new">反结账</span>
                                        </div>
                                        <div class="orderStatus red" v-if="item.order_state === 0 && item.sv_sales_return_type === 3">
                                            <span>换货单</span>
                                            <span v-if="item.is_anti_settle_new">反结账</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="orderTime">
                                    <div>时间：{{item.order_datetime}}</div>
                                    <template v-if="userInfo.sv_us_industrytype === 27">
                                        <div class="orderStatus" v-if="item.sv_catering_grade">房台：{{item.sv_catering_grade}}</div>
                                        <div class="orderStatus" v-else-if="item.order_serial_number && userInfo.sv_uit_cache_name==='cache_name_catering'">取餐号：{{item.order_serial_number}}</div>
                                    </template>
                                </div> -->
                            </div>
                            <div class="isEmpty" v-show="orderList.length === 0">
                                <div class="img">
                                    <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/order_null.png'" />
                                </div>
                                <div class="text">
                                    <span>暂无数据</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="right">
                    <div class="top" v-show="orderContentList.length > 0">
                        <div class="rightTitle">订单详情</div>
                        <div class="orderTable">
                            <myTable ref="myTable" rowKey="id" :data="orderContentList">
                                <my-table-cell fixed label="序号" prop="序号" width="60" align="center">
                                    <template v-slot:default="scope">
                                        <span>{{scope.index+1}}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell fixed label="" prop="sv_pc_img" width="60">
                                    <template v-slot:default="row">
                                        <div class="img_cell" @click.stop="()=>{return false}">
                                            <!-- <ImgPopover :src="row.image" /> -->
                                            <el-image :src="row.image[0]" :preview-src-list="row.image"> </el-image>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell fixed label="商品名称" prop="product_name" width="200" showTooltip>
                                    <template v-slot:default="scope">
                                        <div class="contentName">
                                            <span class="main">{{scope.product_name}}</span>
                                            <!-- <span class="sub" v-html="calcTaste(scope)"></span> -->
                                            <span class="sub" v-if="scope.taste_data">{{scope.taste_data}}</span>
                                            <span class="sub" v-if="scope.sv_p_barcode && userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes'">{{ scope.sv_p_barcode }}</span>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell v-if="dataContent.sv_is_bar_code" label="票码" prop="sv_bar_code" align="center" width="200" showTooltip>
                                    <template v-slot:default="scope">
                                        <el-tooltip v-if="scope.producttype_id === 2" class="item" effect="dark" :content="scope.sv_bar_code" placement="top">
                                            <label>{{scope.sv_bar_code}}</label>
                                        </el-tooltip>
                                        <label v-else>--</label>
                                    </template>
                                </my-table-cell>
                                <!-- <my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
                                <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell> -->
                                <template v-if="dataContent.order_state === 0">
                                    <my-table-cell label="数量" prop="product_num" align="center"></my-table-cell>
                                    <my-table-cell label="单价" prop="product_price" align="center">
                                        <template v-slot:default="scope">
                                            <span>{{$app.moneyFixed(scope.product_price)}}</span>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell label="成交单价" prop="product_unitprice" align="center">
                                        <template v-slot:default="scope">{{$app.moneyFixed(scope.product_unitprice)}}</template>
                                    </my-table-cell>
                                    <my-table-cell label="优惠" prop="discountLocal" align="center" width="120" showTooltip>
                                        <template v-slot:default="scope">
                                            <span>{{scope.discountLocal}}</span>
                                            <el-tooltip effect="dark" placement="right" v-if="scope.sv_preferential_data.length > 0">
                                                <div slot="content">
                                                    <div class="tips" v-for="(item, index) in scope.sv_preferential_data" :key="index">{{ (index + 1) +'：'+ item.s }}</div>
                                                </div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell label="小计" prop="product_total" align="center"></my-table-cell>
                                </template>
                                <template v-if="dataContent.order_state === 1">
                                    <my-table-cell label="商品数量" prop="product_num_bak" align="center"></my-table-cell>
                                    <my-table-cell label="已退数量" prop="returned_num" align="center"></my-table-cell>
                                    <my-table-cell label="单价" prop="product_price" align="center">
                                        <template v-slot:default="scope">
                                            <span>{{$app.moneyFixed(scope.product_price)}}</span>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell label="成交单价" prop="product_unitprice" align="center">
                                        <template v-slot:default="scope">{{$app.moneyFixed(scope.product_unitprice)}}</template>
                                    </my-table-cell>
                                    <my-table-cell label="优惠" prop="discountLocal" align="center" width="120" showTooltip>
                                        <template v-slot:default="scope">
                                            <span>{{scope.discountLocal}}</span>
                                            <el-tooltip effect="dark" placement="right" v-if="scope.sv_preferential_data_text">
                                                <div slot="content">{{scope.sv_preferential_data_text}}</div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell label="小计" prop="product_total" align="center"></my-table-cell>
                                </template>
                                <template v-if="dataContent.order_state === 2">
                                    <!-- 整单退\退货单 -->
                                    <my-table-cell label="商品数量" prop="product_num_bak" align="center">
                                        <template v-slot:default="scope">
                                            <!-- sv_sales_return_type === 2 退货单 -->
                                            <span>{{ dataContent.sv_sales_return_type === 2 ? scope.returned_num : scope.product_num_bak }}</span>
                                        </template>
                                    </my-table-cell>
                                    <!-- <my-table-cell label="已退数量" prop="returned_num" align="center"></my-table-cell> -->
                                    <my-table-cell label="单价" prop="product_price" align="center">
                                        <template v-slot:default="scope">
                                            <span>{{$app.moneyFixed(scope.product_price)}}</span>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell label="成交单价" prop="product_unitprice" align="center" width="120">
                                        <template v-slot:default="scope">{{$app.moneyFixed(scope.product_unitprice)}}</template>
                                    </my-table-cell>
                                    <my-table-cell label="优惠" prop="discountLocal" align="center" width="120" showTooltip>
                                        <template v-slot:default="scope">
                                            <span>{{scope.discountLocal}}</span>
                                            <el-tooltip effect="dark" placement="right" v-if="scope.sv_preferential_data_text">
                                                <div slot="content">{{scope.sv_preferential_data_text}}</div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </template>
                                    </my-table-cell>
                                    <my-table-cell fixed="right" label="小计" prop="product_total" align="center" width="100"></my-table-cell>
                                </template>
                            </myTable>
                        </div>
                        <div class="statistics" v-if="orderContentList.length > 0">
                            <div class="container">
                                <div class="item" v-if="!$app.isNull(dataContent.sv_catering_grade)">
                                    <div class="key">房台：</div>
                                    <div class="value">{{dataContent.sv_catering_grade}}</div>
                                </div>
                                <div class="item" v-else-if="!$app.isNull(dataContent.order_serial_number)  && userInfo.sv_us_industrytype === 27">
                                    <div class="key">取餐号：</div>
                                    <div class="value">{{dataContent.order_serial_number}}</div>
                                </div>
                                <div class="item">
                                    <div class="key">数量合计：</div>
                                    <div class="value">{{dataContent.numcount}}</div>
                                </div>
                                <template v-if="dataContent.order_state !== 2">
                                    <div class="item">
                                        <div class="key">应收金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(dataContent.sv_order_total_money)}}</div>
                                    </div>
                                    <div class="item" v-if="dataContent.deserved">
                                        <div class="key">优惠金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(dataContent.deserved)}}</div>
                                    </div>
                                    <div class="item" v-if="dataContent.sv_coupon_names">
                                        <div class="key">优惠券(已用)：</div>
                                        <div class="value multiLine">
                                            <el-tooltip effect="dark" placement="top" :content="dataContent.sv_coupon_names.join()">
                                                <span>{{ dataContent.sv_coupon_names.join() }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <div class="key">实收金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(dataContent.order_receivable_bak_new)}}</div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="item">
                                        <div class="key">退货金额：</div>
                                        <div class="value">¥{{$app.moneyFixed(dataContent.order_receivable_bak_new)}}</div>
                                    </div>
                                </template>
                                <div class="item">
                                    <div class="key">找零金额：</div>
                                    <div class="value">¥{{$app.moneyFixed(dataContent.sv_give_change)}}</div>
                                </div>
                                <div class="item">
                                    <div class="key">抹零金额：</div>
                                    <div class="value">¥{{$app.moneyFixed(dataContent.free_change)}}</div>
                                </div>
                                <div class="item" v-if="dataContent.sv_discrepancy_money > 0">
                                    <div class="key">换货差额：</div>
                                    <div class="value">¥{{$app.moneyFixed(dataContent.sv_discrepancy_money)}}</div>
                                </div>
                                <!-- <div class="item" v-if="dataContent.sv_refund_money > 0">
                                <div class="key">退货金额：¥</div>
                                <div class="value">{{$app.moneyFixed(dataContent.sv_refund_money)}}</div>
                            </div> -->
                                <div class="item">
                                    <div class="key">支付方式：</div>
                                    <div class="value" v-if="!$app.isZero(dataContent.order_money2)">
                                        <span v-if="dataContent.order_payment === '储值卡' && !$app.isNull(dataContent.order_give)">
                                            <label>{{dataContent.order_payment +'(本金：¥'+ $app.moneyFixed(dataContent.order_principal) +'，赠金：¥'+ $app.moneyFixed(dataContent.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{dataContent.order_payment}}</span>
                                    </div>
                                    <div class="value" v-else>
                                        <span v-if="dataContent.order_payment === '储值卡' && !$app.isNull(dataContent.order_give)">
                                            <label>{{dataContent.order_payment +'(本金：¥'+ $app.moneyFixed(dataContent.order_principal) +'，赠金：¥'+ $app.moneyFixed(dataContent.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{dataContent.order_payment +'(¥'+ $app.moneyFixed(dataContent.order_money) +') '}}</span>
                                        <span v-if="dataContent.order_payment2 === '储值卡' && !$app.isNull(dataContent.order_give)">
                                            <label>{{dataContent.order_payment2 +'(本金：¥'+ $app.moneyFixed(dataContent.order_principal) +'，赠金：¥'+ $app.moneyFixed(dataContent.order_give) +'）'}}</label>
                                        </span>
                                        <span v-else>{{dataContent.order_payment2 +'(¥'+ $app.moneyFixed(dataContent.order_money2) +')'}}</span>
                                    </div>
                                </div>
                                <template v-if="!$app.isNull(dataContent.prlist)">
                                    <div class="item" v-if="!$app.isNull(dataContent.prlist[0].order_number)">
                                        <div class="key">支付单号：</div>
                                        <div class="value">{{dataContent.prlist[0].order_number}}</div>
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
                                <div class="item" v-if="dataContent.salesperson">
                                    <div class="key">导购员：</div>
                                    <div class="value multiLine" alt="dataContent.salesperson">{{dataContent.salesperson}}</div>
                                </div>
                                <div class="item">
                                    <div class="key">备注：</div>
                                    <div class="value multiLine" v-if="dataContent.sv_remarks_list.length">{{ dataContent.sv_remarks_list.join() }}</div>
                                    <div class="value multiLine" v-else>{{dataContent.sv_remarks}}</div>
                                </div>
                                <div class="item" v-if="dataContent.order_state !== 2">
                                    <div class="key">下单时间：</div>
                                    <div class="value">{{$app.currentTime(new Date(dataContent.wt_datetime), 'yyyy-MM-dd HH:mm:ss')}}</div>
                                </div>
                                <div class="item" v-else>
                                    <div class="key">退货时间：</div>
                                    <div class="value">{{$app.currentTime(new Date(dataContent.order_datetime), 'yyyy-MM-dd HH:mm:ss')}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="btnWrap">
                            <div class="btnLeft"></div>
                            <div class="btnRight" v-if="dataContent.sv_sales_return_type === 1">
                                <el-button v-if="dataContent.return_type !== 1" :class="{'isRefused': dataContent.order_state === 2}" round @click="handleSelect">选择订单</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="isEmpty" v-show="orderContentList.length === 0">
                        <div class="img">
                            <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/order_null.png'" />
                        </div>
                        <div class="text">
                            <span>{{ dataContent.group_id ? '暂无数据' : '请选择订单'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import './selectOrder.scss';
</style>
<script src="./selectOrder.js"></script>

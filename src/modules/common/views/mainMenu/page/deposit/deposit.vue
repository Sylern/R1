<template>
    <div class="deposit">
        <!-- 选择会员 -->
        <div class="memberFilerWrap" v-if="$app.isNull(selectedMemberInfo.member_id)">
            <div class="title">选择会员</div>
            <div class="contentWrap">
                <el-input class="searchWrap" ref="inputNumber" placeholder="请输入卡号/手机号/姓名" v-model.trim="queryMembers.sectkey" @keyup.native.enter="handleInputeearch" @clear="showMemberList = false" clearable>
                    <span slot="append" class="btnSelect" v-if="!showMemberList" @click="handleSelectAll">选择会员</span>
                </el-input>
                <div class="listContent">
                    <el-scrollbar v-if="showMemberList" ref="scrollContent" style="width:100%; height: 100%;">
                        <div class="listWrap" ref="listWrap">
                            <div class="listItem" v-for="(item,index) in memberList" :key="index" @click="handleMember(item)">
                                <div class="left">
                                    <div class="logo">
                                        <img class="img" v-if="item.sv_mr_headimg" :src="getUserHeadImgUrl(item)" width="100%" />
                                        <cmd-icon v-else type="icon-headDefault" size="24" color="#E5CAA0"></cmd-icon>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="user lineOccuped">
                                        <div class="nameWrap">
                                            <span class="nameText">{{item.sv_mr_name}}</span>
                                            <span class="flag" v-if="item.sv_ml_name">{{item.sv_ml_name}}</span>
                                        </div>
                                        <div>积分：{{item.sv_mw_availablepoint}}</div>
                                    </div>
                                    <div class="phoneWrap lineOccuped">
                                        <div class="telephone">{{item.sv_mr_mobile}}</div>
                                        <div class="balance">余额：¥{{item.sv_mw_availableamount}}</div>
                                    </div>
                                </div>
                                <div class="right" @click.stop="handleMemberInfo(item.member_id)">
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                    <div class="calculateWrap" v-if="!showMemberList">
                        <div class="listWrap">
                            <div class="listNumberItem" :class="{'center':index%3 == 1, 'right': index%3 == 2}" v-for="(item,index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                                <div class="keyItem">{{item.key}}</div>
                            </div>
                        </div>
                        <div class="btnSure" @click="handleSure">确定</div>
                        <!-- <div class="btnCustom">散客</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="resultWrap" :class="{'showDepositRecord': showDepositRecord}" v-else>
            <div class="controlWrap">
                <div class="iconBack" @click="handleBack">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回</span>
                </div>
                <div class="rightBtn" v-if="!showDepositRecord" @click="showReocodeList">寄存记录</div>
            </div>
            <!-- 会员寄存 -->
            <div class="resultContent">
                <div class="left">
                    <div class="searchMember">
                        <el-input placeholder="请输入卡号/手机号/姓名" v-model.trim="queryMembers.sectkey" @keyup.native.enter="getMemberList" clearable>
                            <span slot="append" class="btnSelect" @click="handleSelectAll">选择会员</span>
                        </el-input>
                    </div>
                    <div class="base">
                        <div class="top">
                            <div class="logo">
                                <img class="img" v-if="selectedMemberInfo.sv_mr_headimg" :src="getUserHeadImgUrl(selectedMemberInfo)" width="100%" />
                                <cmd-icon v-else type="icon-headDefault" size="24" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                            </div>
                            <div class="nameWrap">
                                <div class="nameText">
                                    <span class="name">{{selectedMemberInfo.sv_mr_name}}</span>
                                    <span class="flag" v-if="selectedMemberInfo.sv_ml_name">{{selectedMemberInfo.sv_ml_name}}</span>
                                </div>
                                <div class="telephone">{{selectedMemberInfo.sv_mr_mobile}}</div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{selectedMemberInfo.sv_mw_availableamount}}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{selectedMemberInfo.sv_mw_availablepoint}}</div>
                            </div>
                            <div class="item">
                                <div class="key">权益卡</div>
                                <div class="value">{{selectedMemberInfo.micard_count || 0}}</div>
                            </div>
                            <div class="item">
                                <div class="key">优惠券</div>
                                <div class="value">{{selectedMemberInfo.couponCountNumber || 0}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="content"></div>
                    <el-button class="changeBtn" :class="{'disabled': isSubmitting}" :disabled="isSubmitting" @click="showDepositOrder">{{isOnDeposit ? '取件': '寄存'}}</el-button>
                </div>
                <div class="right">
                    <!-- 寄存列表 -->
                    <template v-if="isOnDeposit">
                        <div class="tableWrap deposit">
                            <myTable ref="onDepositTable" rowKey="id" :data="depositOrderList">
                                <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                                    <template v-slot:default="row">
                                        <span>{{row.index+1}}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="单号" prop="order_id"></my-table-cell>
                                <my-table-cell label="商品名称" prop="sv_p_name" width="200" showTooltip>
                                    <template v-slot:default="row">
                                        <div class="tdWrap">
                                            <div class="goodsCode">{{row.sv_p_barcode}}</div>
                                            <el-tooltip :content="row.sv_p_name" placement="top">
                                                <div class="goodsName">{{row.sv_p_name}}</div>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="规格" prop="sv_p_specs"></my-table-cell>
                                <my-table-cell label="下单数量" prop="product_num" align="center"></my-table-cell>
                                <my-table-cell label="可寄存数量" prop="surplus_deposit_num" align="center"></my-table-cell>
                                <my-table-cell label="寄存数量" prop="depositNumber" align="center">
                                    <template v-slot:default="row">
                                        <div class="depositNumber">
                                            <span class="btn" @click="onDepositSubtract(row,row.index)">-</span>
                                            <span class="value" @click="onDepositNum(row)">{{row.depositNumber}}</span>
                                            <span class="btn" @click="onDepositAdd(row,row.index)">+</span>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                                <my-table-cell label="有效期" prop="validityDate" width="150" align="center">
                                    <template v-slot:default="row">
                                        <div class="validity_date">
                                            <el-date-picker v-model="row.validityDate" @change="onDepositDate(row)" :disabled="row.surplus_deposit_num === 0" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"> </el-date-picker>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="操作" prop="control" align="center">
                                    <template v-slot:default="row">
                                        <span class="remark" :class="{'disabled': row.surplus_deposit_num === 0}" @click="handleRemark(row.index,row.remark)">备注</span>
                                    </template>
                                </my-table-cell>
                            </myTable>
                        </div>
                    </template>
                    <!-- 取件列表 -->
                    <template v-else>
                        <div class="tableWrap" :class="{'noData': depositGoodsTotal === 0}">
                            <myTable ref="hasDepositTable" rowKey="id" :data="depositGoodsList" @select-all="handleDepositGoodsAll" @select="handleDepositGoods">
                                <my-table-cell fixed prop="selection" width="40" align="right"></my-table-cell>
                                <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                                    <template v-slot:default="row">
                                        <span>{{(queryDepositGoods.page-1)*queryDepositGoods.pagesize + row.index+1}}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="寄存单号" prop="deposit_order_code" width="120">
                                    <template v-slot:default="row">
                                        <span class="copy" v-if="row.deposit_order_code || row.deposit_order_id" v-copy="row.deposit_order_code || row.deposit_order_id" title="复制">
                                            <i class="el-icon-document-copy"></i>
                                            {{row.deposit_order_code || row.deposit_order_id}}
                                        </span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="商品名称" prop="sv_p_name" width="200">
                                    <template v-slot:default="row">
                                        <div class="tdWrap">
                                            <div class="goodsCode">{{row.sv_p_barcode}}</div>
                                            <div class="goodsName">{{row.sv_p_name}}</div>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="规格" prop="sv_p_specs"></my-table-cell>
                                <my-table-cell label="寄存门店" prop="user_name" align="center" showTooltip></my-table-cell>
                                <my-table-cell label="寄存数量" prop="deposit_surplus_amounts" align="center"></my-table-cell>
                                <my-table-cell label="取件数量" prop="depositNumber" align="center">
                                    <template v-slot:default="row">
                                        <div class="depositNumber">
                                            <span class="btn" @click="hasDepositSubtract(row,row.index)">-</span>
                                            <span class="value" @click="hasDepositNumber(row)">{{row.depositNumber}}</span>
                                            <span class="btn" @click="hasDepositAdd(row,row.index)">+</span>
                                        </div>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                                <my-table-cell label="有效期" prop="validity_date" width="200" align="center">
                                    <template v-slot:default="row">
                                        <span>{{row.showValidity_date}}</span>
                                        <el-popover :ref="'delayPop_'+ row.index" placement="left" width="300" trigger="click">
                                            <span class="tdBtn" slot="reference">延期</span>
                                            <div class="popWrap">
                                                <div class="popTitle">选择日期时间</div>
                                                <el-date-picker v-model="row.validity_date" type="datetime" placeholder="选择日期时间" default-time="23:59:59"></el-date-picker>
                                                <div class="btnSubmit" @click="handleTimeDelay(row)">
                                                    <span>确定</span>
                                                </div>
                                            </div>
                                        </el-popover>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="取件状态" prop="deposit_state" align="center">
                                    <template v-slot:default="row">
                                        <span>{{row.sv_is_cross_store_order ? '跨店寄存，不支持取件' : (row.deposit_state === 1 ? '待取件' : '不允许取件')}}</span>
                                    </template>
                                </my-table-cell>
                                <!-- <my-table-cell label="操作" prop="control" align="center"></my-table-cell> -->
                            </myTable>
                        </div>
                        <div v-if="depositGoodsTotal > 0" class="pageWrap">
                            <el-pagination @current-change="depositGoodsCurrentChange" @size-change="depositGoodsSizeChange" :current-page="queryDepositGoods.page" :page-sizes="[10,20,30,40,50]" :page-size="queryDepositGoods.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="depositGoodsTotal"></el-pagination>
                        </div>
                    </template>
                    <div class="btnWrap">
                        <div class="printSwitch">
                            <span>打印</span>
                            <el-switch v-model="checkPrint"></el-switch>
                        </div>
                        <div class="btnList" v-if="isOnDeposit">
                            <!-- <div class="btnItem" @click="selectDepositAll">全选寄存数</div> -->
                            <el-checkbox v-model="checkDepositAll">全选寄存数</el-checkbox>
                            <div class="btnItem" @click="depositOrderStatus = true">选择订单</div>
                            <el-button v-repeatClick class="btnItem last" @click="handleDeposit">确定寄存</el-button>
                        </div>
                        <div class="btnList" v-else>
                            <el-button v-repeatClick class="btnItem" @click="handleTakeDeposit">确定取件</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 寄存记录 -->
            <div class="depositRecord" :class="{'show': showDepositRecord}" @click="showDepositRecord = false">
                <div class="content" @click.stop="">
                    <div class="title">
                        <div class="left" @click="showDepositRecord = false">
                            <span>寄存记录</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <div class="searchRecord">
                            <el-input class="searchWrap" placeholder="请输入商品名称/商品编码" v-model.trim="queryRecord.keywards" @keyup.native.enter="searchRecordInfo" @clear="searchRecordInfo" clearable>
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchRecordInfo"></i>
                            </el-input>
                        </div>
                    </div>
                    <div class="tableWrap">
                        <myTable ref="myTable" rowKey="id" :data="depositRecordList">
                            <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                                <template v-slot:default="row">
                                    <span>{{(queryRecord.page-1)*queryRecord.pagesize + row.index+1}}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="存/取" prop="deposit_state" width="80">
                                <template v-slot:default="row">
                                    <span>{{row.deposit_detail_state === 0 ? '取件' : '存件'}}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="商品名称" prop="sv_p_name" showTooltip></my-table-cell>
                            <my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
                            <my-table-cell label="数量" prop="deposit_num" align="center"></my-table-cell>
                            <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                            <my-table-cell label="操作日期" prop="sv_creation_date" align="center"></my-table-cell>
                            <my-table-cell label="备注" prop="sv_remark" align="center" showTooltip></my-table-cell>
                            <my-table-cell label="操作员" prop="sv_created_name" align="center"></my-table-cell>
                        </myTable>
                    </div>
                    <div v-if="depositRecordTotal > 0" class="pageWrap">
                        <el-pagination @current-change="recordCurrentChange" @size-change="recordSizeChange" :current-page="queryRecord.page" :page-sizes="[10,20,30,40,50]" :page-size="queryRecord.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="depositRecordTotal"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dc-dialog v-if="depositOrderStatus" width="980" height="600" title="订单" @close="depositOrderStatus = false">
            <div class="orderWrap">
                <div class="filterWrap">
                    <date-time-picker :paramData="dateTime" @change="handleChangeTime" needTimePicker></date-time-picker>
                    <div class="searchOrder">
                        <el-input class="searchWrap" placeholder="请输入订单号" v-model.trim="queryOrder.keywards" @keyup.native.enter="handleSearchOrder" @clear="handleSearchOrder" clearable>
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearchOrder"></i>
                        </el-input>
                    </div>
                </div>
                <div class="order_table">
                    <myTable ref="orderTable" rowKey="order_id" :data="orderList">
                        <my-table-cell label="序号" prop="序号" width="80" align="center">
                            <template v-slot:default="row">
                                <span>{{(queryOrder.page-1)*queryOrder.pagesize + row.index+1}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="订单号" prop="order_running_id" width="200"></my-table-cell>
                        <my-table-cell label="订单金额" prop="order_money_bak" align="center"></my-table-cell>
                        <my-table-cell label="支付方式" prop="order_payment" align="center"></my-table-cell>
                        <my-table-cell label="下单时间" prop="order_datetime" align="center"></my-table-cell>
                        <my-table-cell label="操作" prop="control" align="center">
                            <template v-slot:default="row">
                                <div class="btn" @click="handleOrderItem(row)">
                                    <span class="btnSelect">选择订单</span>
                                </div>
                            </template>
                        </my-table-cell>
                    </myTable>
                </div>
                <div v-if="orderTotal > 0" class="pageWrap">
                    <el-pagination @current-change="orderCurrentChange" @size-change="orderSizeChange" :current-page="queryOrder.page" :page-sizes="[10,20,30,40,50]" :page-size="queryOrder.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="orderTotal"></el-pagination>
                </div>
            </div>
        </dc-dialog>
        <!--  -->
        <number-change :visible.sync="numberChangeStatus" title="修改数量" :compare="true" :onlyNumber="currentItem.sv_pricing_method === 0" :defaultNumber="currentItem.surplus_deposit_num || currentItem.deposit_surplus_amounts" @handleNumberChange="handleNumberChange"></number-change>
    </div>
</template>

<style lang="sass" scoped>
@import "./deposit.scss"
</style>
<script src="./deposit.js"></script>
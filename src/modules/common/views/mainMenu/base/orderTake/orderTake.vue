<!--取单弹窗-->
<template>
    <div class="orderTake" v-if="dialogVisible" tabindex="0" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1280" height="680" @close="closeDialog">
            <div class="orderContainer">
                <div class="left">
                    <div class="wrapTitle">
                        <span>取单</span>
                    </div>
                    <div class="orderSearch">
                        <el-input ref="orderTake" v-model="keywards" placeholder="搜索会员名称/电话/备注" clearable @change="handleSearch">
                            <i class="el-icon-search" slot="append"></i>
                        </el-input>
                    </div>
                    <div class="leftTitle">挂单列表</div>
                    <el-scrollbar ref="orderListSrcoll" class="el-list">
                        <div class="listWrap">
                            <div class="item" :class="{ selected: orderId === item.id }" v-for="(item, index) in orderList" :key="index" @click="handleOrder(item)">
                                <div class="orderNumber">
                                    <div>单号：{{ item.wt_nober }}</div>
                                    <div class="orderTime">{{ item.wt_datetime }}</div>
                                </div>
                                <div class="memberInfo">
                                    <span v-if="item.memberName">{{ item.memberName }} {{ item.memberMobile }}</span>
                                    <span v-else>散客</span>
                                    <!-- <span>支付中</span> -->
                                </div>
                                <div class="remark">
                                    <span>备注：{{ item.sv_remark }}</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="right" v-show="orderId !== -1">
                    <div class="rightTitle">订单详情</div>
                    <div class="orderTable">
                        <myTable ref="myTable" rowKey="id" :data="dataJson">
                            <my-table-cell fixed label="序号" prop="序号" width="60" align="center">
                                <template v-slot:default="scope">
                                    <span>{{ scope.index + 1 }}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell fixed label="商品名称" prop="product_name" width="250" showTooltip></my-table-cell>
                            <my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
                            <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                            <my-table-cell label="数量" prop="product_num" align="center"></my-table-cell>
                            <my-table-cell label="单价" prop="product_unitprice" align="center">
                                <template v-slot:default="scope">
                                    <span>{{ $app.moneyFixed(scope.product_unitprice) }}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="小计" prop="product_total" align="center">
                                <template v-slot:default="scope">
                                    <span>{{ $app.moneyFixed(scope.product_total) }}</span>
                                </template>
                            </my-table-cell>
                        </myTable>
                    </div>
                    <div class="btnWrap">
                        <el-button round @click="deleteWithOrderList">删除</el-button>
                        <el-button round type="primary" @click="getOrderProduct">取单</el-button>
                    </div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import './orderTake.scss';
</style>
<script src="./orderTake.js"></script>

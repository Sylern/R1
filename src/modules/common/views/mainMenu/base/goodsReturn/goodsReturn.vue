<!--退货弹窗-->
<template>
    <div class="goodsReturn" ref="goodsReturn" v-show="dialogVisible">
        <dc-dialog width="1100" height="580" title="订单退货" @close="closeDialog">
            <div class="contentWrap">
                <myTable ref="myTable" rowKey="id" :data="orderList">
                    <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                        <template v-slot:default="scope">
                            <span>{{ scope.index > -1 ? scope.index+1 : ''}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell fixed label="商品名称" prop="product_name" width="250" showTooltip>
                        <template v-slot:default="scope">
                            <div class="contentName">
                                <span class="main">{{scope.product_name}}</span>
                                <span class="sub" v-html="calcTaste(scope)"></span>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
                    <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                    <my-table-cell label="可退数量" prop="product_num" align="center">
                        <template v-slot:default="scope">
                            <span>{{ scope.index > -1 ? scope.product_num : '' }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="退货数量" prop="currentNumber" align="center">
                        <template v-slot:default="scope">
                            <div class="currentNumber" v-if="scope.index > -1" @click.stop="">
                                <span class="btn" @click.stop="handleGoodsNumberSubtract(scope,scope.index)">-</span>
                                <span class="value" @click.stop="showNumberChange(scope)">{{scope.currentNumber}}</span>
                                <span class="btn" @click.stop="handleGoodsNumberAdd(scope,scope.index)">+</span>
                            </div>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="成交单价" prop="product_unitprice" align="center">
                        <template v-slot:default="scope">
                            <span>{{ scope.index > -1 ? scope.product_unitprice : '' }}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell label="小计" prop="product_total" align="center"></my-table-cell>
                </myTable>
            </div>
            <div class="btnWrap">
                <div class="left">
                    <el-input v-model="remarks" placeholder="备注"></el-input>
                </div>
                <div class="right">
                    <div class="btnSure mr-20" v-if="orderState === 0" @click="showPswWrap(1)">整单退货</div>
                    <div class="btnSure" :class="{'disabled': checkedJson.length < 1}" @click="showPswWrap(2)">确定</div>
                </div>
            </div>
        </dc-dialog>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>

        <!-- 积分改数量 -->
        <number-change :visible.sync="goodsNumberChangeStatus" title="退货数量" :onlyNumber="currentReturnItem.sv_pricing_method === 0" :compare="true" :defaultNumber="currentReturnItem.product_num" @handleNumberChange="handleNumberChange"></number-change>
    </div>
</template>

<style  lang="scss" scoped>
@import './goodsReturn.scss';
</style>
<script src="./goodsReturn.js"></script>
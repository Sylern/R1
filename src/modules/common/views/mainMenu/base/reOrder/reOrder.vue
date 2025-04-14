<!--反结账弹窗-->
<template>
    <div class="reOrder" ref="reOrder" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="500" height="400" :title="reOrderInfo.title" @close="closeDialog">
            <div class="contentWrap">
                <div class="main">
                    <el-form :model="querySubmit" :rules="rules" ref="form">
                        <el-form-item prop="orderMoney" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>订单金额</span>
                                </div>
                                <el-input ref="orderMoney" disabled :value="returnMoney" placeholder="请输入退款金额"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_specs" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>{{reOrderInfo.title +'原因'}}</span>
                                </div>
                                <el-select v-model.trim="dataReason" placeholder="请选择原因">
                                    <el-option label="商品原因，客户退货" value="商品原因，客户退货"></el-option>
                                    <el-option label="商品不一致，客户退货" value="商品不一致，客户退货"></el-option>
                                    <el-option label="其他原因" value="其他原因"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>

                        <el-form-item prop="sv_p_unit" class="lineBox" v-if="dataReason === '其他原因'">
                            <div class="inputBox remark">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>其他原因</span>
                                </div>
                                <el-input v-model.trim="dataRemark" @keyup.native.stop="" type="textarea" placeholder="请输入原因"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                    <!-- <div class="payType">
                        <div>退款方式</div>
                        <div class="listWrap">
                            <div class="item" :class="{'selected': index === payTypePos}" v-for="(item, index) in payTypeList" :key="index" @click="changePayType(index)">
                                <div class="img">
                                    <img class="img" :src="item.icon" />
                                </div>
                                <div class="payTypeName">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="btnWrap">
                <!-- <div class="btnSure" @click="handleEnter">确定</div> -->
                <div class="btnSure" @click="showPswWrap">确定</div>
            </div>
        </dc-dialog>
		<!-- 撤销撤销验证退款密码 -->
		<return-psw ref="returnPsw" @submitPsw="handlePswReturn"></return-psw>
    </div>
</template>

<style  lang="scss" scoped>
@import './reOrder.scss';
</style>
<script src="./reOrder.js"></script>
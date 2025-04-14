<!--退菜弹窗-->
<template>
    <div class="cateringReturn" ref="cateringReturn" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="500" :height="hasReturnPsw ? '480' : '400'" :title="cateringReturnInfo.title" @close="closeDialog">
            <div class="contentWrap">
                <div class="main">
                    <el-form :model="querySubmit" :rules="rules" ref="form">
                        <el-form-item prop="sv_p_unitprice" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span v-textStar>{{ cateringReturnInfo.title }}数量</span>
                                </div>
                                <el-input v-model.trim="returnNumber" @keyup.native.stop="handleInput" @focus="$event.currentTarget.select()" placeholder="请输入退菜数量"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="orderMoney" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span>金额</span>
                                </div>
                                <el-input ref="orderMoney" disabled :value="returnMoney" placeholder="请输入退款金额"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item prop="password" class="lineBox" v-if="hasReturnPsw">
                            <div class="inputBox">
                                <div class="key">
                                    <span v-textStar>{{ cateringReturnInfo.title }}密码</span>
                                </div>
                                <el-input v-model.trim="returnPsw" type="password" maxlength="6" @keyup.enter.native="handleEnter" autocomplete="new-password" placeholder="请输入退菜密码"></el-input>
                            </div>
                        </el-form-item>

                        <!-- <el-form-item prop="sv_p_specs" class="lineBox">
                            <div class="inputBox">
                                <div class="key">
                                    <span class="symbol"></span>
                                    <span>{{cateringReturnInfo.title +'原因'}}</span>
                                </div>
                                <el-select v-model.trim="dataReason" placeholder="请选择原因">
                                    <el-option label="商品原因，客户退货" value="商品原因，客户退货"></el-option>
                                    <el-option label="商品不一致，客户退货" value="商品不一致，客户退货"></el-option>
                                    <el-option label="其他原因" value="其他原因"></el-option>
                                </el-select>
                            </div>
                        </el-form-item> -->

                        <el-form-item prop="sv_p_unit" class="lineBox">
                            <div class="inputBox remark">
                                <div class="key">
                                    <span>备注</span>
                                </div>
                                <el-input v-model.trim="dataRemark" maxlength="30" @keyup.native.stop="" type="textarea" placeholder="请输入备注"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btnSure" @click="handleEnter">确定</div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './cateringReturn.scss';
</style>
<script src="./cateringReturn.js"></script>
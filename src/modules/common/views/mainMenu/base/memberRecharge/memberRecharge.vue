<!--会员充值-->
<template>
    <div class="memberRecharge" ref="memberRecharge" v-if="dialogVisible" @keyup.enter.stop="handleSubmit" @keyup.esc.stop="closeDialogRecharge">
        <dc-dialog class="memberRecharge-dialog" v-if="showMain" width="560" height="8.4" :title="$store.getters.memberText +'充值'" @close="closeDialogRecharge">
            <div class="contentWrap">
                <div class="top">
                    <el-scrollbar ref="memberRechargeScroll" style="width: 100%; height: 100%;">
                        <div class="contentMain">
                            <div class="basicWrap">
                                <div class="userContent">
                                    <div class="userInfo">
                                        <div class="logo">
                                            <el-image v-if="!$app.isNull(rechargeMemberInfo.sv_mr_headimg)" :src="$app.getImgUrl(rechargeMemberInfo.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(rechargeMemberInfo.sv_mr_headimg)]"></el-image>
                                            <cmd-icon v-else type="icon-headDefault" size="30" color="rgba(var(--main-theme-color), 1);"></cmd-icon>
                                        </div>
                                        <div class="nameWrap" v-if="!$app.isNull(rechargeMemberInfo.member_id)">
                                            <div class="nameText">
                                                <span class="name">{{rechargeMemberInfo.sv_mr_name}}</span>
                                                <span class="flag" v-if="rechargeMemberInfo.sv_ml_name">{{rechargeMemberInfo.sv_ml_name}}</span>
                                            </div>
                                            <div class="telephone">{{rechargeMemberInfo.sv_mr_mobile}}</div>
                                        </div>
                                        <div class="btnSelected" @click="memberListStatus = true">
                                            <span>重新选择</span>
                                        </div>
                                    </div>
                                    <div class="userRights">
                                        <div class="item">
                                            <div class="key">余额</div>
                                            <div class="value" v-if="!$app.isNull(rechargeMemberInfo.member_id)">{{rechargeMemberInfo.sv_mw_availableamount}}</div>
                                        </div>
                                        <div class="item">
                                            <div class="key">积分</div>
                                            <div class="value" v-if="!$app.isNull(rechargeMemberInfo.member_id)">{{rechargeMemberInfo.sv_mw_availablepoint}}</div>
                                        </div>
                                        <div class="item">
                                            <div class="key">权益卡</div>
                                            <div class="value" v-if="!$app.isNull(rechargeMemberInfo.member_id)">{{rechargeMemberInfo.micard_count}}</div>
                                        </div>
                                        <div class="item">
                                            <div class="key">优惠券</div>
                                            <div class="value" v-if="!$app.isNull(rechargeMemberInfo.member_id)">{{rechargeMemberInfo.couponCountNumber}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="discountWrap">
                                    <el-scrollbar style="width:100%; height:100%;">
                                        <div class="wrapContent">
                                            <div class="item" :class="{'isRowFirst': index%3 == 0, 'selected': discountId == item.sv_user_configdetail_id}" v-for="(item,index) in discountListByMember" :key="index" @click="handleDiscount(item)">
                                                <span>{{item.discountName}}</span>
                                            </div>
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <div class="inputWrap">
                                    <div class="inputLine">
                                        <div class="key">储值卡</div>
                                        <el-select class="input" v-model="queryRecharge.sv_wallet_id" @change="handleChangeStoreCard">
                                            <el-option v-for="(item, index) in storeCardList" :key="index" :value="item.value" :label="item.label"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="inputLine">
                                        <el-input class="input right" ref="inputRechargeMoney" v-model="inputRechargeMoney" @input.native="handleInput($event, 'inputRechargeMoney')" @focus="$event.target.select()" clearable placeholder="请输入充值金额">
                                            <span slot="prepend">充值</span>
                                        </el-input>
                                        <el-input class="input right ml-10" v-model="inputPresentMoney" :disabled="!JurisdictionObj.UpdateGiveMoney" @input.native="handleInput($event, 'inputPresentMoney')" clearable placeholder="请输入赠送金额">
                                            <span slot="prepend">赠送</span>
                                        </el-input>
                                    </div>
                                    <div class="inputLine" v-if="parseFloat(queryRecharge.sv_deposit) > 0">
                                        <el-input class="input right" v-model="queryRecharge.sv_deposit" disabled clearable placeholder="请输入押金金额">
                                            <span slot="prepend">押金</span>
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <div class="payBox">
                                <div v-if="!isMultiPayType" class="multiPay">
                                    <el-input class="input right" v-model="payMoneyCalc" disabled>
                                        <span slot="prepend">支付金额</span>
                                        <span slot="suffix">元</span>
                                    </el-input>
                                </div>
                                <div class="multiPay" v-else>
                                    <template v-for="(item, index) in ($refs.payTypeListRecharge ? $refs.payTypeListRecharge.getPayTypeInfo() : [])">
                                        <div class="value" v-if="index === 0" :key="index">
                                            <el-input class="input right" v-model="payMoney1" @focus="$event.currentTarget.select()" @input="handleInputMoney($event, 1)">
                                                <span slot="prepend">{{ item.name }}</span>
                                                <span slot="suffix">元</span>
                                            </el-input>
                                        </div>
                                        <div class="value ml-10" v-else :key="index+1">
                                            <el-input class="input right" v-model="payMoney2" @focus="$event.currentTarget.select()" @input="handleInputMoney($event, 2)">
                                                <span slot="prepend">{{ item.name }}</span>
                                                <span slot="suffix">元</span>
                                            </el-input>
                                        </div>
                                    </template>
                                </div>

                                <div class="titleWrap">
                                    <div class="key">支付方式</div>
                                    <div class="value">
                                        <span class="text">打印小票</span>
                                        <el-switch v-model="checkPrint"></el-switch>
                                    </div>
                                </div>
                                <pay-type-list ref="payTypeListRecharge" :payInfo="payInfo" isRecharge :isMultiPay="hasMultiPay" :isMultiPaySelected.sync="isMultiPayType" @returnCode="getAuthCode" @paySuccess="scanPaySuccess" @closeScan="handleCloseScan"></pay-type-list>
                            </div>

                            <div class="inputWrap">
                                <div class="inputLine">
                                    <div class="key">导购员</div>
                                    <el-select class="input" v-model="employeeList" multiple-limit="3" multiple filterable>
                                        <el-option v-for="(item,index) in guiderList" :key="index" :value="item.value" :label="item.label"></el-option>
                                    </el-select>
                                </div>
                                <el-input class="input remark" v-model="queryRecharge.sv_remarks" placeholder="请输入备注"></el-input>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleSubmit">确定</div>
                </div>
                <!-- 扫码支付 -->
                <div class="qr_pay" v-if="isScanning">
                    <div class="pay_content">
                        <div class="btnClose" @click="closeScanning">
                            <i class="el-icon-close"></i>
                        </div>
                        <div class="pc_title">扫码付款</div>
                        <div class="pc_item" v-if="payStep==0">
                            <div class="pci_img_wrap"><img class="img pci_img" :src="$store.state.base.frontImgBase+'/images/vip/scanning.gif'"></div>
                            <div class="pci_text">扫描客户二维码收款</div>
                        </div>
                        <div class="pc_item" v-if="payStep==1">
                            <div class="pci_img_wrap"><i class="el-icon-loading pci_icon"></i></div>
                            <div class="pci_text">支付中</div>
                        </div>
                        <div class="pc_item" v-if="payStep==2">
                            <div class="pci_img_wrap"><i class="el-icon-circle-check pci_icon"></i></div>
                            <div class="pci_text">支付成功</div>
                        </div>
                        <div class="pc_item" v-if="payStep==3">
                            <div class="pci_img_wrap"><i class="el-icon-circle-close pci_icon"></i></div>
                            <div class="pci_text">支付失败</div>
                        </div>
                    </div>
                </div>
            </div>
        </dc-dialog>

        <!-- 会员列表 -->
        <member-list :syncStore="false" :visible.sync="memberListStatus" :title="'选择'+ $store.getters.memberText" :useType="useType" @selectMember="selectMember" @close="closeMemberListBack"></member-list>
    </div>
</template>

<style  lang="scss" scoped>
@import './memberRecharge.scss';
</style>
<script src="./memberRecharge.js"></script>
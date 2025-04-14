<!--选择储值卡弹窗-->
<template>
    <div class="storeCardSelect" ref="storeCardSelect" v-if="dialogVisible" tabindex="0" @keyup.stop="listenKeyup">
        <dc-dialog width="400" height="650" title="选择储值卡" @close="closeDialog">
            <div class="storeCardSelectContent">
                <el-scrollbar class="listWrap">
                    <div class="listContent">
                        <div class="listItem" :style="item.sv_background_image ? 'background:url(//res.decerp.cc'+ item.sv_background_image+') center / cover no-repeat;':''" :class="{ isDefault: $app.isNull(item.sv_wallet_id) }" v-for="(item,index) in memberInfo.wallets_list" :key="index" @click="handleItemClick(item)">
                            <div class="checkBox" v-if="item.sv_wallet_id === currentId">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="infoWrap">
                                <div class="cardName">{{item.sv_card_name}}</div>
                                <div class="priceWrap">
									<span>余额</span>
                                    <span>
										<label class="symbol">¥</label>
										<label class="priceValue">{{$app.moneyFixed(item.sv_balance)}}</label>
									</span>
                                </div>
                                <div class="cardPriceInfo" v-if="!$app.isNull(item.sv_wallet_id)">
                                    <span class="item">本金：¥ {{$app.moneyFixed(item.sv_principal)}}</span>
                                    <span class="item">赠金：¥ {{$app.moneyFixed(item.sv_gifts)}}</span>
                                </div>
                                <div class="infoRow">有效期：{{item.sv_validity_time}}</div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
                <div class="btnWrap">
                    <div class="btnSure" @click="handleEnter">确定</div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './storeCardSelect.scss';
</style>
<script src="./storeCardSelect.js"></script>
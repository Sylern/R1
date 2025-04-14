<!--会员列表弹窗-->
<template>
    <div class="memberList" v-if="dialogVisible">
        <dc-dialog v-show="memberListStatus" width="420" height="650" :title="title" @close="handleCloseSync">
            <div class="listContentWrap" tabindex="0" @keyup.stop="listenKeyup">
                <el-input class="searchWrap" ref="inputKeyWord" v-model.trim="queryMembers.sectkey" @keyup.native.stop="" @input="handleInputLimited" @keyup.native.enter="handleInputEnter" placeholder="刷卡或输入卡号/手机号" clearable>
                    <template v-if="memberSetting">
                        <span slot="append" v-if="!showMemberList && !memberSetting.keyCardInitial" @click="handleSelectAll">{{ title }}</span>
                    </template>
                    <span slot="append" v-if="!memberSetting" @click="handleSelectAll">{{ title }}</span>
                </el-input>
                <div class="listContent">
                    <el-scrollbar v-if="showMemberList" ref="scrollContent" style="width: 100%; height: 100%">
                        <div class="listWrap" ref="listWrap">
                            <div class="listItem" :class="{ selected: memberInfo.member_id === item.member_id }" v-for="(item, index) in memberList" :key="index" @click="handleMember(item)">
                                <div class="left">
                                    <div class="logo">
                                        <el-image v-if="!$app.isNull(item.sv_mr_headimg)" :src="$app.getImgUrl(item.sv_mr_headimg)" :preview-src-list="[$app.getImgUrl(item.sv_mr_headimg)]" @click.stop=""></el-image>
                                        <cmd-icon v-else type="icon-headDefault" size="24" color="#E5CAA0"></cmd-icon>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="user lineOccuped">
                                        <div class="nameWrap">
                                            <span class="nameText">
                                                <label>{{ item.sv_mr_name }}</label>
                                                <span class="flag" v-if="item.sv_ml_name">{{ item.sv_ml_name }}</span>
                                            </span>
                                            <span v-if="item.sv_mr_status == 1" class="invalid">(已挂失)</span>
                                            <span v-if="item.isOverdue" class="invalid">(已过期)</span>
                                        </div>
                                        <div>积分：{{ item.sv_mw_availablepoint }}</div>
                                    </div>
                                    <div class="phoneWrap lineOccuped">
                                        <div class="telephone">
                                            <div class="mobile item">
                                                <cmd-icon type="icon-phone-o" size="18" color="#333333"></cmd-icon>
                                                <span>{{ item.sv_mr_mobile }}</span>
                                            </div>
                                            <div class="cardno item">
                                                <cmd-icon type="icon-memberCard" size="18" color="#333333"></cmd-icon>
                                                <el-tooltip effect="dark" placement="top" :content="'卡号：'+ item.sv_mr_cardno">
                                                    <span>{{ item.sv_mr_cardno }}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                        <div class="balance">余额：¥{{ item.sv_mw_availableamount }}</div>
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
                            <div class="listNumberItem" :class="{ center: index % 3 == 1, right: index % 3 == 2 }" v-for="(item, index) in calculatorList" :key="index" @click="calculateInput(item.key)">
                                <div class="keyItem">{{ item.key }}</div>
                            </div>
                        </div>
                        <div class="btnSure" @click="handleSure">确定</div>
                    </div>
                </div>
            </div>
        </dc-dialog>
        <!-- 人脸识别结果展示 -->
        <head-scan :isOnWatchScan="memberListStatus && !showMemberList" handleMemberInfo @handleShow="handleHeadScanShow" @handleCancel="handleHeadScanCanel" @handleHeadScan="handleHeadScanSure"></head-scan>
        <!-- 会员次卡 -->
        <dc-dialog v-show="memberCardStatus" :width="memberInfo.cardPackageList.length > 0 ? 1020 : 420" height="700" @close="closeMemberCard" class="memberCardDialog">
            <div class="memberCardWrap">
                <div class="leftWrap">
                    <el-input class="searchMember" v-model="queryMembers.sectkey" type="text" @keyup.native.stop="handlePrevent" placeholder="输入会员号/姓名/手机">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <el-button slot="append" @click="handleSelectAll">选择会员</el-button>
                    </el-input>
                    <div class="memberInfo" v-if="!$app.isNull(memberInfo.member_id)">
                        <div class="userInfo">
                            <div class="left">
                                <div class="logo">
                                    <img class="img" v-if="!$app.isNull(memberInfo.sv_mr_headimg)" :src="memberInfo.sv_mr_headimg.indexOf('http') > -1 ? memberInfo.sv_mr_headimg : imgBase + memberInfo.sv_mr_headimg" width="100%" />
                                    <cmd-icon v-else type="icon-headDefault" size="30" color="#943FD9"></cmd-icon>
                                </div>
                                <div class="nameWrap" v-if="!$app.isNull(memberInfo.member_id)">
                                    <div class="nametext">
                                        <span class="name">{{ memberInfo.sv_mr_name }} · </span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                    </div>
                                    <div class="telephone">{{ $app.phoneNumberHiding(memberInfo.sv_mr_mobile) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="userRights">
                            <div class="item">
                                <div class="key">余额</div>
                                <div class="value">{{ memberInfo.sv_mw_availableamount }}</div>
                            </div>
                            <div class="item">
                                <div class="key">积分</div>
                                <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                            </div>
                            <div class="item">
                                <div class="key">权益卡</div>
                                <div class="value">{{ memberInfo.member_id ? memberInfo.micard_count : '' }}</div>
                            </div>
                            <div class="item discount">
                                <div class="key">优惠券</div>
                                <div class="value">{{ memberInfo.couponCountNumber }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="storeCardList">
                        <el-scrollbar style="width:100%; height:100%;">
                            <div class="listContent">
                                <div class="listItem" :style="item.sv_background_image ? 'background:url(//res.decerp.cc'+ item.sv_background_image+') center / cover no-repeat;':''" :class="{ isDefault: $app.isNull(item.sv_wallet_id) }" v-for="(item,index) in memberInfo.wallets_list" :key="index" @click="handleItemClick(item)">
                                    <div class="checkBox" v-if="item.sv_wallet_id === currentId">
                                        <i class="el-icon-check"></i>
                                    </div>
                                    <div class="infoWrap">
                                        <div class="infoTop">
                                            <div class="topLeft">
                                                <div class="cardName">{{item.sv_card_name}}</div>
                                                <div class="cardNumber">{{item.sv_card_number}}</div>
                                            </div>
                                            <div class="topRight">
                                                <div class="priceWrap">
                                                    <div class="value">
                                                        <span class="symbol">¥</span>
                                                        <span>{{$app.moneyFixed(item.sv_balance)}}</span>
                                                    </div>
                                                    <div class="key">余额</div>
                                                </div>
                                                <div class="priceWrap" v-if="!$app.isNull(item.sv_wallet_id)">
                                                    <div class="value">
                                                        <span class="symbol">¥</span>
                                                        <span>{{$app.moneyFixed(item.sv_gifts)}}</span>
                                                    </div>
                                                    <div class="key">赠送金</div>
                                                </div>
                                            </div>
                                            <!-- <div class="infoRow">有效期：{{item.sv_validity_time}}</div> -->
                                        </div>
                                        <div class="infoBottom" v-if="!$app.isNull(item.sv_wallet_id)">
                                            <div class="infoRemark">{{item.sv_remark}}</div>
                                            <div class="btnEdit" @click.stop="handleRemarkUpdate(item)">
                                                <i class="el-icon-edit"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="rightWrap">
                    <div class="cardList">
                        <el-scrollbar ref="scroll_cardList" style="width:100%; height:100%;">
                            <div class="listItem" :class="{'use_out_item': item.sv_mcc_leftcount < 1}" v-for="(item, index) in memberInfo.cardPackageList" :key="index">
                                <div class="packageName">
                                    <div class="name" :class="{ selected: !item.showValidity}" @click="handleValidity(item, false)">
                                        <span>{{item.sv_p_name}}</span>
                                        <span v-if="item.sv_package_type === 1">{{'（剩余'+ item.available_usage +'次）'}}</span>
                                    </div>
                                    <div class="validityTitle" :class="{ selected: item.showValidity }" @click="handleValidity(item, true)">查看已过期项目</div>
                                </div>
                                <template v-if="item.showValidity">
                                    <div class="item" v-for="(data, pos) in item.validityList" :key="pos">
                                        <div class="left">
                                            <div class="top">
                                                <div class="itemName">{{data.sv_p_name}}</div>
                                            </div>
                                            <div class="times" v-if="data.sv_package_detailed_type === 0">
                                                <span>剩余</span>
                                                <span :class="{'highlight': data.sv_mcc_leftcount > 0}" v-if="item.sv_package_type === 0">
                                                    {{data.sv_mcc_leftcount}}
                                                </span>
                                                <span :class="{'highlight': item.available_usage > 0 && data.sv_mcc_leftcount > 0}" v-if="item.sv_package_type === 1">
                                                    {{item.available_usage > data.sv_mcc_leftcount ? data.sv_mcc_leftcount : item.available_usage}}
                                                </span>
                                                <span>次可用</span>
                                            </div>
                                            <div class="times" v-if="data.sv_package_detailed_type === 1">
                                                <span>不限次，最多</span>
                                                <span class="highlight">{{item.available_usage}}</span>
                                                <span>次可用</span>
                                            </div>
                                            <div class="validity_date">
                                                <span>有效期至：{{data.validity_date}}</span>
                                                <span class="btn" @click="handleDelay(data)">延期</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.validityList.length === 0" class="listTips">无项目过期</div>
                                </template>
                                <template v-else>
                                    <div class="item" v-for="(data, pos) in item.list" :key="pos">
                                        <div class="left">
                                            <!-- <div class="img"></div> -->
                                            <div class="top">
                                                <div class="itemName">{{data.sv_p_name}}</div>
                                                <!-- <div class="flag" v-if="item.sv_mcc_leftcount > 0">{{item.sv_mcc_leftcount}}次</div> -->
                                                <!-- <div class="flag" v-else>剩余0次</div> -->
                                            </div>
                                            <div class="times" v-if="data.sv_package_detailed_type === 0">
                                                <span>剩余</span>
                                                <span :class="{'highlight': data.sv_mcc_leftcount > 0}" v-if="item.sv_package_type === 0">
                                                    {{data.sv_mcc_leftcount}}
                                                </span>
                                                <span :class="{'highlight': item.available_usage > 0 && data.sv_mcc_leftcount > 0}" v-if="item.sv_package_type === 1">
                                                    {{item.available_usage > data.sv_mcc_leftcount ? data.sv_mcc_leftcount : item.available_usage}}
                                                </span>
                                                <!-- <span :class="{'highlight': item.available_usage > 0 && data.sv_mcc_leftcount > 0}">{{item.available_usage > data.sv_mcc_leftcount ? data.sv_mcc_leftcount : item.available_usage}}</span> -->
                                                <span>次可用</span>
                                            </div>
                                            <div class="times" v-if="data.sv_package_detailed_type === 1">
                                                <span>不限次，最多</span>
                                                <span class="highlight">{{item.available_usage}}</span>
                                                <span>次可用</span>
                                            </div>
                                        </div>
                                        <div class="validity_date">
                                            <span>{{data.validity_date}}</span>
                                            <span class="btn" @click="handleDelay(data)">延期</span>
                                        </div>
                                        <div class="right" v-if="data.sv_mcc_leftcount > 0 || (data.sv_package_detailed_type === 1&& item.available_usage > 0)">
                                            <div class="btn btnSubtract" v-if="data.number > 0" @click="handleSubtract(item,data)">
                                                <i class="el-icon-remove-outline"></i>
                                            </div>
                                            <div class="number" @click="handleShowNumberChange(data, index, pos)">{{data.number}}</div>
                                            <div class="btn btnAdd" @click="handleAdd(item, data)">
                                                <i class="el-icon-circle-plus"></i>
                                            </div>
                                        </div>
                                        <div class="right" v-if="data.sv_mcc_leftcount < 1 || (data.sv_package_detailed_type === 1 && item.available_usage < 1)">
                                            <div class="use_out">
                                                <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/use_out.png'">
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.list.length === 0" class="listTips">次卡项目过期</div>
                                </template>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="btnWrap" @click="handleMemberCardSure">
                <div class="btn">确定</div>
            </div>
        </dc-dialog>
        <!-- 消费记录 -->
        <dc-dialog v-show="memberRecordsStatus" width="16" height="8" title="消费记录" @close="closeMemberRecords">
            <div class="memberContentWrap">
                <div class="left">
                    <div class="content" v-if="!$app.isNull(memberInfo.member_id)">
                        <div class="userInfo">
                            <div class="top">
                                <div class="logo">
                                    <img class="img" v-if="memberInfo.sv_mr_headimg" :src="memberInfo.sv_mr_headimg.indexOf('http') > -1 ? memberInfo.sv_mr_headimg : imgBase + memberInfo.sv_mr_headimg" width="100%" />
                                    <cmd-icon v-else type="icon-headDefault" size="24" color="#E5CAA0"></cmd-icon>
                                </div>
                                <div class="nameWrap">
                                    <div class="nameText">
                                        <span class="name">{{ memberInfo.sv_mr_name }}</span>
                                        <span class="flag" v-if="memberInfo.sv_ml_name">{{ memberInfo.sv_ml_name }}</span>
                                    </div>
                                    <div class="telephone">{{ memberInfo.sv_mr_mobile }}</div>
                                </div>
                            </div>
                            <div class="recodeWrap">
                                <div class="totalMoney content">
                                    <div class="key">累计消费总额</div>
                                    <div class="value">
                                        <span>¥</span>
                                        <span class="number">{{ memberInfo.sv_mw_sumamount }}</span>
                                    </div>
                                </div>
                                <div class="totalNumber content">
                                    <div class="key">消费次数</div>
                                    <div class="value">
                                        <span class="number">{{ memberInfo.shoppingCount }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="balance itemBox">
                            <div class="key">余额</div>
                            <div class="value">¥{{ memberInfo.sv_mw_availableamount }}</div>
                        </div>
                        <div class="score itemBox">
                            <div class="key">积分</div>
                            <div class="value">{{ memberInfo.sv_mw_availablepoint }}</div>
                        </div>
                        <div class="score itemBox">
                            <div class="key">权益卡</div>
                            <div class="value">{{ memberInfo.micard_count }}</div>
                        </div>
                        <div class="discountTicket itemBox">
                            <div class="key">优惠券</div>
                            <div class="value">{{ memberInfo.couponCountNumber }}</div>
                        </div>
                        <div class="arrears itemBox">
                            <div class="key">欠款</div>
                            <div class="value">{{ `¥${memberInfo.sv_mw_credit || 0}` }}</div>
                        </div>
                        <div class="nextRecord" v-if="memberInfo.sv_mw_lastcostdate">
                            <span>上次消费：{{ $app.currentTime(new Date(memberInfo.sv_mw_lastcostdate), 'yyyy-MM-dd HH:mm:ss') }}【{{ $app.friendlyDate(new Date(memberInfo.sv_mw_lastcostdate)) }}】</span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="timeWrap">
                        <date-time-picker @change="handleChangeTime"></date-time-picker>
                    </div>
                    <div class="tableWrap queryTable">
                        <div class="tableBox">
                            <myTable ref="myTable" rowKey="order_running_id" :data="memberRecords">
                                <!-- <my-table-cell label="流水号" prop="order_serial_number" width="70" align="center"></my-table-cell> -->
                                <my-table-cell label="序号" prop="order_serial_number" width="60" align="center">
                                    <template v-slot:default="scope">
                                        <span>{{ scope.index + 1 }}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="订单单号" prop="order_running_id" width="200" showTooltip>
                                    <template v-slot:default="scope">
                                        <i class="el-icon-document-copy" v-copy="scope.order_running_id" title="复制"></i>
                                        <span @click="handleJump(scope)" class="Jump">{{ scope.order_running_id }}</span>
                                    </template>
                                </my-table-cell>
                                <my-table-cell label="支付方式" prop="order_payment" align="center"></my-table-cell>
                                <my-table-cell label="实付金额" prop="order_money" align="center"></my-table-cell>
                                <my-table-cell label="优惠金额" prop="sv_coupon_amount" align="center"></my-table-cell>
                                <my-table-cell label="积分抵扣" prop="order_aintegral" align="center"></my-table-cell>
                                <my-table-cell label="抹零金额" prop="order_aintegral" align="center"></my-table-cell>
                                <my-table-cell label="收款金额" prop="order_receivable" align="center"></my-table-cell>
                                <my-table-cell label="消费时间" prop="order_datetime" align="center"></my-table-cell>
                                <!-- <my-table-cell label="消费店铺" prop="order_receivable" align="center"></my-table-cell> -->
                                <!-- <my-table-cell label="备注" prop="remark" width="150"></my-table-cell> -->
                            </myTable>
                        </div>
                        <!-- <div v-if="memberRecords.length>0" class="tableBottom"> -->
                        <div class="tableBottom">
                            <span>共</span>
                            <span class="highLight">{{ memberRecordsTotal }}</span>
                            <span>条数据，累计消费：</span>
                            <span class="highLight">{{ totalAmount }}</span>
                            <span>元</span>
                        </div>
                    </div>
                </div>
            </div>
        </dc-dialog>
        <!-- 消费详情 -->
        <dc-dialog v-if="recordsContentStatus" width="14.2" height="8" title="消费详情" @close="closeRecordsContent">
            <div class="recordsContentWrap">
                <div class="recordsInfo">
                    <span>流水号：{{ recordsContent.order_serial_number }} 订单号：{{ recordsContent.order_running_id }}</span>
                </div>
                <div class="tableWrap queryTable">
                    <div class="tableBox">
                        <myTable ref="myTableRecord" rowKey="product_id" :data="recordsContent.prlist">
                            <my-table-cell :label="$store.state.userInfo.goodsCode_charact" prop="sv_p_barcode" width="150">
                                <template v-slot:default="scope">
                                    <span>{{ scope.sv_p_barcode }}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="商品名称" prop="product_name" width="300" showTooltip></my-table-cell>
                            <my-table-cell label="规格" prop="sv_p_specs" align="center"></my-table-cell>
                            <my-table-cell label="单位" prop="sv_p_unit" align="center"></my-table-cell>
                            <my-table-cell label="零售价" prop="product_price" align="center"></my-table-cell>
                            <my-table-cell label="折扣" prop="product_discount" align="center">
                                <template v-slot:default="scope">
                                    <span v-if="scope.product_discount < 1">{{ scope.product_discount * 10 }}折</span>
                                    <span v-else>无折扣</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="销售金额" prop="product_unitprice" align="center"></my-table-cell>
                            <my-table-cell label="数量" prop="sv_product_num" align="center"></my-table-cell>
                            <my-table-cell label="小计" prop="product_total" align="center"></my-table-cell>
                        </myTable>
                    </div>
                    <!-- <div v-if="recordsContent.length>0" class="tableBottom"> -->
                    <div class="tableBottom">
                        <span>商品数量:</span>
                        <span class="highLight">{{ recordsContent.numcount }}</span>
                        <!-- <span>优惠金额:</span>
                        <span class="highLight">{{recordsContent.sv_coupon_discount}}</span> -->
                        <span>订单金额:</span>
                        <span class="highLight">{{ recordsContent.order_receivable }}</span>
                        <span>元</span>
                    </div>
                </div>
            </div>
        </dc-dialog>
        <!-- 添加会员提示 -->
        <dc-dialog v-if="memberAddTipsStatus" width="600" height="300" title="提示" @close="memberAddTipsStatus = false">
            <div class="memberAddTipsContentWrap">
                <div class="tips">
                    <div>未搜索到该会员，</div>
                    <div>
                        <span>是否将 “ </span>
                        <span class="heighLight">{{ queryMembers.sectkey }}</span>
                        <span> ” 作为会员的 <label class="heighLight">{{ handleAddType().text }}</label> 新增会员</span>
                    </div>
                </div>
                <div class="btnWrap" @click="handleMemberAddTipsSure">
                    <div class="btn">确定</div>
                </div>
            </div>
        </dc-dialog>
        <!-- 商品改数量 -->
        <number-change :visible.sync="numberChangeStatus" title="选择次数" onlyNumber :defaultNumber="currentChangeNumberObj.currentNumber" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 延期 -->
        <delay :visible.sync="delayStatus" :importTime="currentDelayItem.validity_date" @callback="handleDelayBack"></delay>

        <dc-dialog title="修改备注" width="400" height="250" v-if="updateRemarkVisible" class="system_dialog updateRemarkVisible" @close="updateRemarkVisible = false">
            <div class="updateInfoWrap">
                <div class="infoLine">
                    <div class="key">备注：</div>
                    <div class="value remark">
                        <el-input v-model="updateRemark" :rows="3" type="textarea" resize="none" @focus="$event.currentTarget.select()"></el-input>
                    </div>
                </div>
            </div>
            <div class="bottomBtnWrap">
                <el-button type="primary" class="btnPrimary" v-repeatClick @click="handleSubmitInfo">确定</el-button>
            </div>
        </dc-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import './memberList.scss';
</style>
<script src="./memberList.js"></script>

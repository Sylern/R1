<template>
    <div class="cardConsumption" tabindex="0">
        <!-- 选择会员 -->
        <div class="memberFilerWrap" v-if="$app.isNull(selectedMemberInfo.member_id)">
            <div class="title">选择会员</div>
            <div class="contentWrap">
                <el-input class="searchWrap" ref="inputNumber" placeholder="请输入会员号/手机号" v-model.trim="queryMembers.sectkey" @keyup.native.enter="getMemberList" clearable>
                    <span slot="append" class="btnSelect" v-if="!showMemberList" v-repeatClick @click="handleSelectAll">选择会员</span>
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
                    </div>
                </div>
            </div>
        </div>
        <div class="resultWrap" :class="{'showResultList': showResultList}" v-else>
            <div class="controlWrap">
                <div class="left" @click="handleBack">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回</span>
                </div>
                <div class="right" v-if="!showResultList" @click="showOrderList">扣次记录</div>
            </div>
            <!-- 会员扣次消费 -->
            <div class="memberCardContent">
                <div class="memberCardInfo">
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
                    <div class="menuWrap">
                        <div class="menuItem" :class="{ selected: isValidity === 0 }" @click="handleMenu(0)">正常项目</div>
                        <div class="menuItem" :class="{ selected: isValidity === 1 }" @click="handleMenu(1)">已过期项目</div>
                    </div>
                    <div class="content">
                        <el-scrollbar ref="cardList" style="width:100%; height:100%;">
                            <div class="listItem" :class="{'use_out_item': item.sv_mcc_leftcount < 1}" v-for="(item, index) in packageInfo" :key="index">
                                <div class="packageName">
                                    <div class="name" :class="{ selected: !item.showValidity}" @click="handleValidity(item, false)">
                                        <span>{{item.sv_p_name}}</span>
                                        <span v-if="item.sv_package_type === 1">{{'（剩余'+ item.available_usage +'次）'}}</span>
                                    </div>
                                    <div class="validityTitle" v-if="isValidity !== 1" :class="{ selected: item.showValidity }" @click="handleValidity(item, true)">查看已过期项目</div>
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
                                                <!-- <span :class="{'highlight': item.available_usage > 0 && data.sv_mcc_leftcount > 0}">{{item.available_usage > data.sv_mcc_leftcount ? data.sv_mcc_leftcount : item.available_usage}}</span> -->
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
                                            <div class="validity_date">
                                                <span>有效期至：{{data.validity_date}}</span>
                                                <span class="btn" @click="handleDelay(data)">延期</span>
                                            </div>
                                        </div>
                                        <div class="right" v-if="data.sv_mcc_leftcount > 0 || (data.sv_package_detailed_type === 1&& item.available_usage > 0)">
                                            <div class="btn btnSubtract" v-if="data.number > 0" @click="handleSubtract(item,data)">
                                                <i class="el-icon-remove-outline"></i>
                                            </div>
                                            <div class="number" @click="handleShowNumberChange(data, index, pos)">{{data.number}}</div>
                                            <div class="btn btnAdd" @click="handleAdd(item,data)">
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
                    <div class="printSwitch">
                        <div class="left">
                            <span class="name">打印</span>
                            <el-switch v-model="checkPrint"></el-switch>
                        </div>
                        <div class="right">
                            <div class="btn" @click="guiderSelectStatus = true">
                                <span>选择导购员</span>
                            </div>
                            <template v-if="guiderList.length > 0">
                                <div class="symbol">【{{ guiderList.map(e => e.name).join('、') }}】</div>
                            </template>
                        </div>
                    </div>
                    <el-button class="submitBtn" :class="{'disabled': isSubmitting}" :disabled="isSubmitting" @click="handleSubmit">确定</el-button>
                </div>
            </div>
            <!-- 扣次记录 -->
            <div class="memberConsumptionWrap" v-if="showResultList">
                <div class="title">扣次记录</div>
                <div class="tableWrap">
                    <myTable ref="myTable" rowKey="id" :data="resultList">
                        <my-table-cell fixed label="序号" prop="序号" width="80" align="center">
                            <template v-slot:default="row">
                                <span>{{(query.page-1)*query.pageSize + row.index+1}}</span>
                            </template>
                        </my-table-cell>
                        <my-table-cell label="流水号" prop="sv_order_list_id" width="250"></my-table-cell>
                        <my-table-cell label="扣次项目" prop="sv_p_name" width="250" showTooltip></my-table-cell>
                        <my-table-cell label="扣除数量" prop="product_num" align="center"></my-table-cell>
                        <my-table-cell label="扣次时间" prop="order_datetime" align="center"></my-table-cell>
                    </myTable>
                </div>
                <div v-if="resultList.length>0" class="pageWrap">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="query.page" :page-sizes="[10,20,30,40,50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 商品改数量 -->
        <number-change :visible.sync="numberChangeStatus" title="选择次数" onlyNumber :defaultNumber="currentChangeNumberObj.currentNumber" @handleNumberChange="handleNumberChange"></number-change>
        <!-- 延期 -->
        <delay :visible.sync="delayStatus" :importTime="currentDelayItem.validity_date" @callback="handleDelayBack"></delay>

        <!-- 选择销售员 -->
        <guider-select :visible.sync="guiderSelectStatus" @handleBack="getGuiderSelected"></guider-select>

        <!-- 人脸识别结果展示 -->
		<head-scan :isOnWatchScan="$app.isNull(selectedMemberInfo.member_id)" @handleShow="handleHeadScanShow" @handleCancel="handleHeadScanCanel" @handleHeadScan="handleHeadScanSure"></head-scan>
    </div>
</template>

<style lang="scss" scope>
@import './cardConsumption.scss';
</style>
<script src="./cardConsumption.js"></script>
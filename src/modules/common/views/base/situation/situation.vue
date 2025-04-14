<template>
    <div class="storeSituation">
        <el-scrollbar style="width:100%;height:100%;" ref="pageScroll" id="situationScroll">
            <!-- main警告 -->
            <div class="store_warn" v-if="expirationTips">
                <div class="store_warn_left">
                    <i class="el-icon-warning" type="danger"></i>
                    <div class="content" v-if="storeData.sv_versionexpiration>0">
                        <!-- versionId-版本id|distributorId-1非代理商|onecbuyversion-是否买过版本 -->
                        <div v-if="versionId==1&&userInfo.distributorId==1">{{onecbuyversion?'您的店铺由于到期已恢复成免费版，为避免影响店铺的正常运营，请订购升级版本！':'您的店铺当前为免费版，升级版本可以让您的店铺运营更顺畅！'}}</div>
                        <div v-else-if="versionId==2&&userInfo.distributorId==1">您的店铺当前为高级试用版，服务还有 {{storeData.sv_versionexpiration}} 天过期。现在订购可获得多种行业解决方案。立即订购</div>
                        <div v-else-if="(versionId==3||versionId==4)&&userInfo.distributorId==1">您的店铺当前为{{storeData.sv_versionid_name}}，服务还有 {{storeData.sv_versionexpiration}} 天过期。现在订购可获得多种行业解决方案。立即订购</div>
                        <div>官方咨询电话：{{userInfo.sv_d_phone}}</div>
                    </div>
                    <div class="content" v-else>
                        <div>您的店铺服务已过期。现在订购可获得多种行业解决方案。立即订购</div>
                        <div>咨询电话：{{userInfo.sv_d_phone}}</div>
                    </div>
                    <!-- 只有非代理商显示续费按钮 -->
                    <div v-if="userInfo.distributorId==1">
                        <el-button class="btnItem btnPrimary small store_btn" @click="handleRenewUrl">{{(versionId==3||versionId==4)?'立即续费':'立即升级'}}</el-button>
                    </div>
                </div>
                <div class="store_warn_right" @click="expirationTips=false">
                    <i class="el-icon-close" type="danger"></i>
                </div>
            </div>
            <!-- main头部 -->
            <div class="store_top">
                <el-popover class="store_top_left" placement="bottom" width="440" trigger="hover">
                    <div class="store_wrap">
                        <div class="item store_top">
                            <div class="store_logo">
                                <img class="img" v-if="storeData.sv_store_logo" :src="$app.getImgUrl(storeData.sv_store_logo)">
                                <cmd-icon v-else type="icon-shouye" size="24" color="#E7E7E7"></cmd-icon>
                            </div>
                            <div class="store_content">
                                <div class="store_name">{{storeData.sv_user_name}}</div>
                                <div class="store_date" v-if="storeData.hasEnd">{{storeData.isTrial?'试用期至':'有效期至'}}：{{storeData.endTime}}</div>
                                <div class="store_date" v-else>{{storeData.endTime}}</div>
                                <div class="store_function">
                                    <el-popover v-for="(item,index) in storeData.services_list" :key="index" placement="top" trigger="hover" class="services_item">
                                        <div class="popover">
                                            <div class="des">{{item.sv_services_name}}</div>
                                            <div class="btnPopover" :class="{active:item.sv_is_opened}">
                                                <div v-if="item.sv_term_validity=='永久'">{{item.sv_term_validity}}</div>
                                                <div v-else @click="handleMarketingTool(item)">
                                                    {{item.sv_term_validity}}<i v-if="!item.sv_is_opened" class="el-icon-arrow-right"></i>
                                                </div>
                                                <span class="to_renew" v-if="item.sv_is_opened&&!item.sv_is_purchase" @click="handleMarketingTool(item)">去续费</span>
                                            </div>
                                        </div>
                                        <el-tag v-if="item.sv_is_opened" effect="dark" slot="reference">{{item.sv_abbreviation}}</el-tag>
                                        <el-tag v-else type="info" slot="reference">{{item.sv_abbreviation}}</el-tag>
                                    </el-popover>
                                </div>
                            </div>
                        </div>
                        <div class="item store_btn_wrap" v-if="userInfo.distributor_id==1">
                            <!-- <el-button class="btnItem btnPrimary" @click="handleMarketingTool({sv_is_opened:false})">立即订购</el-button> -->
                            <el-button class="btnItem btnBasic" @click="handleMarketingTool({sv_is_opened:false})">了解权益</el-button>
                        </div>
                        <div class="item store_phone_wrap" v-if="userInfo.sv_d_phone">官方咨询电话：{{userInfo.sv_d_phone}}</div>
                    </div>
                    <div class="reference_wrap" slot="reference">
                        <div class="stroe_name">{{storeData.sv_user_name}}</div>
                        <div class="stroe_type">{{storeData.sv_versionid_name}}</div>
                        <!-- <div class="stroe_date">试用期</div> -->
                    </div>
                </el-popover>

                <div class="store_top_right">
                    <div class="store_tr_icon">
                        <div class="iconItem" @click="$router.push({ path: '/messageManagemen/birthday' })">
                            <cmd-icon type="icon-xiaoxitixing" size="32" color="#3B4966"></cmd-icon>
                            <span>通知</span>
                        </div>
                        <div class="iconItem" v-if="imageUrl && hasHardware" @click="handleToSchool">
                            <cmd-icon @click="handleToSchool" type="icon-xueyuan" size="34" color="#3B4966"></cmd-icon>
                            <span>学院</span>
                        </div>
                        <div class="feedbackIcon iconItem" v-if="userInfo.distributor_id === 1">
                            <cmd-icon @click="handleShowFeedback" type="icon-bianji1" size="32" color="#3B4966"></cmd-icon>
                            <span class="feedbackCount" v-if="feedbackCount > 0">{{feedbackCount > 99 ? '99+' : feedbackCount}}</span>
                            <span>反馈</span>
                        </div>
                    </div>
                    <el-popover placement="bottom" width="312" trigger="click" v-if="isNewVersion">
                        <div class="slot_wrap">
                            <div class="item" @click="handleChangeStore">切换门店</div>
                            <div class="item" @click="handleToDecerpcn" v-if="userInfo.distributor_id === 1 && hasHardware">德客官网</div>
                            <div class="item" @click="handleStoresCenter">
                                <div>管理账号</div>
                                <div class="manage_right">{{$app.phoneNumberHiding(userInfo.sv_ul_mobile)}}<i class="el-icon-arrow-right"></i></div>
                            </div>
                            <div class="item" @click="handleYes">退出登录</div>
                        </div>
                        <div class="reference_wrap" slot="reference">
                            <div class="user_icon_wrap" v-if="!$app.isNull(storeData)">
                                <img class="img store_logo" v-if="storeData.sv_store_logo" :src="$app.getImgUrl(storeData.sv_store_logo)" />
                                <i class="el-icon-user-solid" v-else></i>
                            </div>
                            <div class="user_num">{{$app.phoneNumberHiding(userInfo.sv_ul_mobile)}}</div>
                            <i class="el-icon-arrow-down"></i>
                        </div>
                    </el-popover>
                </div>
            </div>
            <!-- main内容 -->
            <div class="contentWrap">
                <!-- main左侧 -->
                <div class="contentWrap-left">
                    <overview v-if="isEducation" @refreshSrcoll="handleRefreshScroll"></overview>
                    <overview-fitness v-if="isFitness" @refreshSrcoll="handleRefreshScroll"></overview-fitness>
                    <overviewCommon v-else @refreshSrcoll="handleRefreshScroll"></overviewCommon>
                </div>
                <!-- main右侧 -->
                <div class="contentWrap-right">
                    <!-- cache_name_pleasure_ground 游乐场   cache_name_yoga_fitness健身 -->
                    <!-- 场地数据 -->
                    <div class="playground cr_ul" v-if="userInfo.sv_uit_cache_name == 'cache_name_pleasure_ground' || userInfo.sv_uit_cache_name=='cache_name_yoga_fitness'">
                        <div class="title">
                            <div>当前在场{{playGroundTotal}}人</div>
                            <a  @click="showPlayGroundData = true">更多</a>
                        </div>
                        <div class="item" v-for="(item,index) in playGroundDataList" :key="index">
                            <div class="bar_code">票码：{{ item.sv_bar_code }}</div>
                            <div class="bottom">
                                <div class="tiem">时长：{{ item.sv_consume_in_duration }}</div>
                                <div class="money">应补金额：<span>{{ $app.moneyFixed(item.paybackMoney, 2) }}</span></div>
                            </div>
                        </div>
                    </div>
                    <!-- 待办事项 -->
                    <div class="cr_ul" v-if="needDo.birthdayNum>0||needDo.intoStorage>0||needDo.needUseNum>0||needDo.distribution>0||needDo.services>0">
                        <div class="title">
                            <div>待办事项</div>
                            <!-- <el-button type="text" class="text_btn">更多</el-button> -->
                        </div>
                        <div class="backlog_list">
                            <div class="more_right_item" @click="handleToOtherModel('会员列表')" v-if="needDo.birthdayNum>0">
                                <div>会员生日</div>
                                <div class="backlog_num">{{needDo.birthdayNum}}</div>
                            </div>
                            <!-- <div class="more_right_item" @click="handleToOtherModel('库存预警')">
                                <div>库存预警</div><div class="backlog_num">{{needDo.outOfStock}}</div>
                            </div>
                            <div class="more_right_item" @click="handleToOtherModel('商品列表')">
                                <div>临期预警</div><div class="backlog_num">{{1}}</div>
                            </div> -->
                            <div class="more_right_item" @click="handleToOtherModel('待入库')" v-if="needDo.intoStorage>0">
                                <div>待入库</div>
                                <div class="backlog_num">{{needDo.intoStorage}}</div>
                            </div>
                            <!-- <div class="more_right_item" @click="handleToOtherModel('待核销')" v-if="needDo.needUseNum>0">
                                <div>待核销</div>
                                <div class="backlog_num">{{needDo.needUseNum}}</div>
                            </div> -->
                            <!-- <div class="more_right_item" @click="handleToOtherModel('待核销')" v-if="needDo.distribution>0">
                                <div>待配送</div>
                                <div class="backlog_num">{{needDo.distribution}}</div>
                            </div> -->
                            <!-- <div class="more_right_item" @click="handleToOtherModel('待服务')" v-if="needDo.services>0 && userInfo.sv_uit_cache_name==='cache_name_cosmetology'">
                                <div>待服务</div>
                                <div class="backlog_num">{{needDo.services}}</div>
                            </div> -->
                            <!-- <div class="more_right_item" @click="handleToOtherModel('待审核')">
                                <div>待审核</div><div class="backlog_num">{{needDo.audit}}</div>
                            </div> -->
                        </div>
                    </div>
                    <!-- 广告 -->
                    <div class="slider_wrap" v-if="imgList.length>0">
                        <el-carousel trigger="click" height="159px" :arrow="imgList.length>1?'hover':'never'" :indicator-position="imgList.length>1?'':'none'">
                            <el-carousel-item v-for="item in imgList" :key="item">
                                <a :href="item.url" target="_blank"><img class="img" :src="item.img"></a>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <!-- 在线客服 -->
                    <div class="cr_ul" v-if="hasHardware">
                        <el-popover placement="left" trigger="click">
                            <div class="popover_kfjy">
                                <div class="img qrcode">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/system/wxworkQrcode.png'" />
                                </div>
                            </div>
                            <div slot="reference" class="cr_dd" v-if="userInfo.distributor_id === 1">
                                <div class="imgWrap">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/system/headset@2x.png'" />
                                </div>
                                <div class="cr_section">
                                    <div class="cr_title">在线客服</div>
                                    <div class="cr_txt">专属客服为您排忧解难</div>
                                </div>
                            </div>
                        </el-popover>
                    </div>

                    <!-- 短信 -->
                    <div class="cr_ul cr_note">
                        <div class="cr_note_top">
                            <div class="cr_note_t_name">{{noteEntity.sv_usage_days}}</div>
                            <div class="cr_note_t_value">
                                <span v-if="noteEntity.sv_id_renew">剩</span>
                                <label>{{noteEntity.sv_days_remaining}}</label>
                                <span v-if="noteEntity.sv_id_renew">天</span>
                                <a v-if="noteEntity.sv_id_renew && userInfo.distributor_id===1" @click="handleRoute('renewChooseEntry')">续费</a>
                            </div>
                        </div>
                        <el-progress class="cr_note_progress" :percentage="noteEntity.sv_utilization_rate" status="success" :show-text="false"></el-progress>
                        <div class="cr_note_bottom">
                            <div class="cr_note_t_name">短信余额</div>
                            <div class="cr_note_t_value">
                                <span>剩</span>
                                <label>{{noteEntity.sv_sms_num}}</label>
                                <span>条</span>
                                <a v-if="shwoRechargeBtn" @click="handleRoute('sendSms')">充值</a>
                            </div>
                        </div>
                    </div>

                    <!-- 客户端 -->
                    <div class="cr_ul">
                        <el-popover placement="left" trigger="click" v-if="hasPcClient">
                            <div @click="handleTypeWin" class="cr_popover">
                                <div class="crp_title">点击下载</div>
                                <div class="img ig2">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/system/downcord2@2x.png'" />
                                </div>
                                <div class="crp_name">Windows版</div>
                            </div>
                            <div slot="reference" class="cr_dd">
                                <div class="imgWrap pc">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/system/desktop@2x.png'" />
                                </div>
                                <div class="cr_section">
                                    <div class="cr_title">PC桌面式客户端</div>
                                    <div class="cr_txt">如需打印请使用PC客户端</div>
                                </div>
                            </div>
                        </el-popover>

                        <el-popover placement="left" trigger="click" v-if="imageUrl">
                            <div class="cr_popover">
                                <div class="crp_title">扫码下载</div>
                                <div class="img ig1">
                                    <img class="img" :src="imageUrl" />
                                </div>
                                <div class="crp_name">手机、Pad版</div>
                            </div>
                            <div slot="reference" class="cr_dd">
                                <div class="imgWrap mobile">
                                    <img class="img" :src="$store.state.base.frontImgBase+'/images/system/mobile@2x.png'" />
                                </div>
                                <div class="cr_section">
                                    <div class="cr_title">移动客户端</div>
                                    <div class="cr_txt">使用手机、Pad管理门店</div>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                    <!-- 公告 -->
                    <!-- <div class="cr_ul">
                        <div class="title">更新公告</div>
                        <div class="notice_list">
                             <el-tooltip v-for="(item,index) in updataLog" :key="index" class="item" effect="dark" :content="item.sv_message_title" placement="top">
                                <div class="notice_item">{{$app.currentTime(new Date(item.sv_creation_date), 'MM/dd')}} {{item.sv_message_title}}</div>
                            </el-tooltip>
                        </div>
                    </div> -->
                    <!-- 支付办理 -->
                    <div class="cr_ul pay_ul">
                        <div class="title">支付办理</div>
                        <div class="pay">
                            <div class="img_wrap"><img class="img" :src="$store.state.base.frontImgBase+'/images/system/IST_7696_81465.png'"></div>
                            <div class="content_wrap">
                                <div class="content_title">开通收款功能</div>
                                <div class="content_text">支持开通微信、支付宝</div>
                                <div class="content_btn">
                                    <!-- <el-button class="btnItem btnPrimary small" @click="handleToOtherModel('立即开通')">立即开通</el-button> -->
                                    <el-button class="btnItem btnPrimary small" @click="isShowPayment = true">立即开通</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 硬件商城 -->
                    <div class="cr_ul" v-if="userInfo.distributor_id === 1 && hasHardware">
                        <div class="title">
                            <div>硬件商城</div>
                            <el-button type="text" class="text_btn" @click="handleMarketingTool()">更多</el-button>
                        </div>
                        <div class="hardware_list">
                            <div class="hardware_item" @click="handleMarketingTool()">
                                <div class="hardware_img_wrap"><img class="img hardware_img" :src="$store.state.base.frontImgBase+'/images/system/personalStores/收银机.png'"></div>
                                <div class="hardware_name">前台收银机</div>
                            </div>
                            <div class="hardware_item" @click="handleMarketingTool()">
                                <div class="hardware_img_wrap"><img class="img hardware_img" :src="$store.state.base.frontImgBase+'/images/system/personalStores/手持机.png'"></div>
                                <div class="hardware_name">移动手持机</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="sevice_wrap" :class="{'show':showAll}" v-if="!isNewVersion&&service.name">
            <div class="arrow_wrap" @click="showAll=!showAll"><i :class="{'el-icon-arrow-down':showAll,'el-icon-arrow-up':!showAll}"></i></div>
            <div class="sevice_info" @click="showAll=!showAll">
                <div class="sevice_img_wrap">
                    <img class="img sevice_img" :src="service.headerImg">
                </div>
                <div class="sevice_text">
                    <div class="sevice_name">您好，我是{{service.name}}</div>
                    <div class="sevice_title">您的<span class="exclusive">专属开店顾问</span></div>
                </div>
            </div>
            <div class="sevice_content">{{service.sv_remark}}<br />联系电话：{{service.mobile}}</div>
            <div class="sevice_qrcode"><img class="img qrcode" :src="service.wxImg"></div>
        </div>
        <!-- 代理商电话 -->
        <el-dialog title="购买功能" :visible.sync="isShowOem" :close-on-click-modal="false" width="540px" class="system_dialog">
            <div class="addEntry borderTop">
                <div class="addTxt">购买增值功能请联系客服【{{service.mobile}}】</div>
                <div class="btnWrap notMargin">
                    <el-button @click="isShowOem=false" class="btnItem btnPrimary">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 备用金 -->
        <el-dialog title="请输入备用金" :visible.sync="isShowCash" :close-on-click-modal="false" width="540px" class="system_dialog">
            <div class="addEntry borderTop">
                <div class="addTxt">
                    <el-input v-model="salesclerkCash"></el-input>
                </div>
                <div class="btnWrap notMargin">
                    <el-button @click="setSalesclerkCash" class="btnItem btnPrimary">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 支付办理 -->
        <el-dialog :visible.sync="isShowPayment" :close-on-click-modal="false" width="750px" class="system_dialog showPamentWrap">
            <div slot="title" class="showPamentTitle"></div>
            <div class="showPament">
                <div class="left">
                    <div class="line">
                        <span>开通微信/支付宝收款</span>
                    </div>
                    <div class="line">
                        <span>T+1到账自然日正常结算</span>
                    </div>
                    <div class="line">
                        <span>手续费低至0.38%</span>
                    </div>
                    <div class="line">
                        <span>无缝对接，支持退款原路返回！</span>
                    </div>
                </div>
                <div class="right">
                    <div class="imgBox">
                        <!-- <img class="img" :src="$store.state.base.frontImgBase+'/images/system/showPayment.png'" /> -->
                        <img class="img" src="@/assets/images/system/showPayment.png" />
                    </div>
                    <div class="textWrap">
                        <div class="mianText">请使用微信</div>
                        <div class="subText">扫描二维码提交资料</div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <playGroundData v-model="showPlayGroundData"></playGroundData>
    </div>
</template>

<script src="./situation.js"></script>

<style lang="scss" scoped>
@import './situation.scss';

.popover {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 13px;
    width: 200px;

    .des {
        color: #000000;
        margin: 11px 0 0 0;
    }

    .btnPopover {
        display: flex;
        color: #2b82fd;
        margin: 10px 0 0 0;
    }

    .btnPopover:hover {
        text-decoration: underline;
        color: rgba(43, 130, 253, 0.7);
        cursor: pointer;
    }

    .btnPopover.active {
        color: #ff1500;
    }

    .btnPopover.active:hover {
        text-decoration: none;
        cursor: default;
    }
}
</style>

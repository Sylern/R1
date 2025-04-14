<!--反馈建议-->
<template>
    <div class="feedback" v-if="dialogVisible">
        <dc-dialog width="1000" height="720" title="反馈内容" @close="closeDialog">
            <div class="feedbackContent">
                <div class="feedbackList">
                    <el-scrollbar ref="scrollContent" class="scrollContent">
                        <div class="listWrap" ref="listWrap">
                            <div class="noRecord" v-if="feedbackDataList.length === 0">
                                <span>暂无记录</span>
                            </div>
                            <div class="btnHasMore" v-if="hasMoreData" @click="handleGetMore">
                                <span>查看更多消息</span>
                            </div>
                            <template v-for="(item, index) in feedbackDataList">
                                <div class="itemInLeft" v-if="item.sv_record_type === 2" :key="index">
                                    <div class="left">
                                        <div class="userLogo">
                                            <template v-if="!$app.isNull(item.sv_logo)">
                                                <el-popover placement="right" width="200">
                                                    <img class="img" :src="imgBase + item.sv_logo" width="200" height="200" />
                                                    <img class="img" :src="imgBase + item.sv_logo" slot="reference" />
                                                </el-popover>
                                            </template>
                                            <template v-else>
                                                <img class="img" :src="frontImgBase + '/images/cashier/default_user_logo.png'" />
                                            </template>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="itemTime">
                                            <span>{{item.sv_created_date}}</span>
                                        </div>
                                        <div class="itemContent">
                                            <div class="arrowLeft"></div>
                                            <div class="text">
                                                <span>{{item.title.sv_ordinary_msg.text}}</span>
                                            </div>
                                            <div class="imgList">
                                                <div class="itemImg" v-for="(data, pos) in item.title.sv_ordinary_msg.img" :key="pos">
                                                    <template v-if="!$app.isNull(data)">
                                                        <el-popover placement="right" width="400">
                                                            <img class="img" :src="imgBase + data" />
                                                            <img class="img" :src="imgBase + data" slot="reference" />
                                                        </el-popover>
                                                        <!-- <span>{{imgBase + data}}</span> -->
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="itemInRight" v-if="item.sv_record_type === 1" :key="index">
                                    <div class="left">
                                        <div class="itemTime">
                                            <span>{{item.sv_created_date}}</span>
                                        </div>
                                        <div class="itemContent">
                                            <div class="arrowRight"></div>
                                            <div class="text">
                                                <span>{{item.title.sv_ordinary_msg.text}}</span>
                                            </div>
                                            <div class="imgList">
                                                <div class="itemImg" v-for="(data, pos) in item.title.sv_ordinary_msg.img" :key="pos">
                                                    <template v-if="!$app.isNull(data)">
                                                        <el-popover placement="right" width="400">
                                                            <img class="img" :src="imgBase + data" />
                                                            <img class="img" :src="imgBase + data" slot="reference" />
                                                        </el-popover>
                                                        <!-- <span>{{imgBase + data}}</span> -->
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="userLogo">
                                            <template v-if="!$app.isNull(item.sv_logo)">
                                                <el-popover placement="left" width="200" trigger="click">
                                                    <img class="img" :src="imgBase + item.sv_logo" width="200" height="200" />
                                                    <img class="img" :src="imgBase + item.sv_logo" slot="reference" />
                                                </el-popover>
                                            </template>
                                            <template v-else>
                                                <img class="img" :src="frontImgBase + '/images/cashier/default_user_logo.png'" />
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="itemInSystemInfo" v-if="item.sv_record_type === 3" :key="index">
                                    <div class="left">
                                        <div class="userLogo">
                                            <template v-if="!$app.isNull(item.sv_logo)">
                                                <el-popover placement="right" width="200">
                                                    <img class="img" :src="imgBase + item.sv_logo" width="200" height="200" />
                                                    <img class="img" :src="imgBase + item.sv_logo" slot="reference" />
                                                </el-popover>
                                            </template>
                                            <template v-else>
                                                <img class="img" :src="frontImgBase + '/images/cashier/default_user_logo.png'" />
                                            </template>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="itemTime">
                                            <span>{{item.sv_created_date}}</span>
                                        </div>
                                        <div class="itemContent">
                                            <div class="arrowLeft"></div>
                                            <div class="text">{{item.title.sv_system_msg.text}}</div>
                                            <div class="text1">{{item.title.sv_system_msg.text1}}</div>
                                            <div class="control1" v-if="item.title.sv_system_msg.text1">
                                                <div class="c_btn" :class="{'disabled': item.title.sv_system_msg.type1 !== 0, 'isSet': item.title.sv_system_msg.type1 === 100}" @click="updateBack_Message_Recor(item, 1, 100)">
                                                    <div class="btnImg">
                                                        <img class="img" :src="frontImgBase + '/images/base/feedback1.png'" />
                                                    </div>
                                                    <span>不满意</span>
                                                </div>
                                                <div class="c_btn" :class="{'disabled': item.title.sv_system_msg.type1 !== 0, 'isSet': item.title.sv_system_msg.type1 === 101}" @click="updateBack_Message_Recor(item, 1, 101)">
                                                    <div class="btnImg">
                                                        <img class="img" :src="frontImgBase + '/images/base/feedback2.png'" />
                                                    </div>
                                                    <span>一般</span>
                                                </div>
                                                <div class="c_btn" :class="{'disabled': item.title.sv_system_msg.type1 !== 0, 'isSet': item.title.sv_system_msg.type1 === 102}" @click="updateBack_Message_Recor(item, 1, 102)">
                                                    <div class="btnImg">
                                                        <img class="img" :src="frontImgBase + '/images/base/feedback3.png'" />
                                                    </div>
                                                    <span>满意</span>
                                                </div>
                                            </div>
                                            <div class="text2">{{item.title.sv_system_msg.text2}}</div>
                                            <div class="control2" v-if="item.title.sv_system_msg.text2">
                                                <div class="c_btn" :class="{'disabled': item.title.sv_system_msg.type2 !== 0, 'isSet': item.title.sv_system_msg.type2 === 103}" @click="updateBack_Message_Recor(item, 2, 103)">
                                                    <cmd-icon type="icon-cai" size="20" :color="item.title.sv_system_msg.type2 === 103 ? '#ffffff' : '#999999'"></cmd-icon>
                                                    <span class="btnText">未解决</span>
                                                </div>
                                                <div class="c_btn" :class="{'disabled': item.title.sv_system_msg.type2 !== 0, 'isSet': item.title.sv_system_msg.type2 === 104}" @click="updateBack_Message_Recor(item, 2, 104)">
                                                    <cmd-icon type="icon-zan" size="20" :color="item.title.sv_system_msg.type2 === 104 ? '#ffffff' : '#999999'"></cmd-icon>
                                                    <span class="btnText">已解决</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="bottomWrap">
                    <div class="inputWrap">
                        <div class="textareaBox">
                            <el-input type="textarea" v-model="feedbackText" resize="none" :rows="3" maxlength="500" show-word-limit placeholder="请输入反馈内容"></el-input>
                        </div>
                        <div class="imgWrap">
                            <div class="importImgTitle">图片</div>
                            <ImportImg :dataJson="feedbackImgList" @callback="callbackImportImg" :verifyJson="verifyJson" :typeEntity="typeEntity"></ImportImg>
                        </div>
                    </div>
                    <div class="btnWrap">
                        <!-- <el-button class="bottomBtn">关闭反馈</el-button> -->
                        <el-button @click="handleFeedbackSubmit" class="bottomBtn submit" v-repeatClick>发布</el-button>
                    </div>
                </div>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './feedback.scss';
</style>
<script src="./feedback.js"></script>
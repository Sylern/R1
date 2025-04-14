<template>
    <div class="helpCenter_wrap" :style="{width: pageWidth}">
        <div class="mt_center" :class="{'isShowHelp': showHelp}">
            <div class="title" v-if="$route.meta.isCustomTitle !== true">
                <span v-if="!$app.isNull(pageName)">{{pageName}}</span>
                <div class="breadcrumb" v-else>
                    <div v-for="(item,index) in breadcrumb" @click="handleBreadcrumb(item)" :key="index">
                        <span class="breadcrumb_separator" v-if="index !== 0">/</span>
                        <span class="breadcrumb_item" :class="{ isUrl: item.isBack || item.href }">{{item.name}}</span>
                    </div>
                </div>
                <span v-if="hasHelpWrap" class="showHelpWrap" @click="onShowHelp">
                    <label>帮助和服务</label>
                    <i class="btn_showHelp el-icon-d-arrow-left"></i>
                </span>
            </div>
            <div class="mt_center_content" :class="{'calcHeight': !$route.meta.isCustomTitle,'isShowHelp': showHelp}">
                <slot></slot>
            </div>
            <div class="mt_right" :class="{'show': showHelp}">
                <div class="header" @click="onHideHelp">
                    <span>帮助和服务</span>
                    <!-- <i class="btn_hideHelp el-icon-d-arrow-right"></i> -->
                    <div class="divFont"><span>点击收起</span><i class="btn_hideHelp el-icon-d-arrow-right"></i></div>
                </div>
                <div class="container">
                    <div class="help_ul" :class="{'OEMHeight': hasHelpWrap}">
                        <el-scrollbar style="width:100%; flex:1">
                            <div class="li" v-for="(item,index) in helpList" :key="index" @click="handleHelpList(item.id)">
                                <span :class="{'active': item.id == 1}">{{item.docTitle}}</span>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="other" v-if="hasHelpWrap">
                        <div class="listItem" @click="handleNewborn">
                            <span class="text">帮助中心</span>
                        </div>

                        <div class="help_btn contactWrap" @click.stop="showClickContact = !showClickContact">
                            <span>联系客服</span>
                            <div class="contact" :class="{'isClickShow': showClickContact}">
                                <div class="contact_title" v-if="kfData.name">专属客服经理</div>
                                <div class="headIcon" v-if="kfData.name">
                                    <img class="img" v-if="kfData.headImg" :src="kfData.headImg" />
                                    <img class="img" v-else :src="$store.state.base.frontImgBase+'/images/commodity/headImg.png'" />
                                </div>
                                <div class="contact_name" v-if="kfData.name">{{kfData.name}}</div>
                                <div class="contact_tel" v-if="kfData.mobile">{{kfData.mobile}}</div>
                                <div class="qrCode" v-if="kfData.kfWehcatImg && kfData.name">
                                    <img class="img" :src="kfData.kfWehcatImg" />
                                </div>
                                <div class="qrCodeText" v-if="kfData.kfWehcatImg">扫码添加微信客服</div>

                                <div class="cover"></div>
                            </div>
                        </div>
                        <div class="help_btn" @click="downloadWrapStatus = true">
                            <span>下载客户端</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- modal -->
        <el-dialog v-if="schoolVisible" class="schoolDialog" :close-on-click-modal="false" :visible.sync="schoolVisible" width="100%" fullscreen>
            <iframe class="schoolWrap" :src="schoolUrl"></iframe>
        </el-dialog>

        <!-- download -->
        <div class="downloadWrap" v-if="downloadWrapStatus" @click="downloadWrapStatus = false">
            <div class="container" @click.stop="()=>{return false}">
                <div class="close" @click="downloadWrapStatus = false">
                    <i class="el-icon-close"></i>
                </div>
                <div class="dowloadTitle">扫码下载手机客户端</div>
                <div class="qrCode">
                    <img class="img" :src="$store.state.base.frontImgBase+'/images/commodity/APP.png'" />
                </div>
                <div class="btn" @click="handleTips">
                    <cmd-icon class="btn_icon" type="icon-andriod" size="24" color="#000000"></cmd-icon>
                    <span>Android</span>
                </div>
                <div class="btn" @click="handleTips">
                    <cmd-icon class="btn_icon" type="icon-apple" size="24" color="#000000"></cmd-icon>
                    <span>iPhone</span>
                </div>
                <div class="btn typewin" @click="handleTypeWin">
                    <cmd-icon class="btn_icon" type="icon-win" size="24" color="rgba(var(--main-theme-color), 1)"></cmd-icon>
                    <span>PC客户端</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import './helpCenter.scss';
</style>
<script src="./helpCenter.js"></script>
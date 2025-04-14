<!--店铺认证-->
<template>
    <div class="authentication" ref="authentication" v-if="dialogVisible" @keyup.stop="" @keyup.esc.stop="closeDialog">
        <dc-dialog width="1000" height="580" @close="closeDialog">
            <div class="stepContent">
                <div class="stepMain">
                    <div class="steps">
                        <div class="stepItem">
                            <div class="sn" :class="{ selected: stepIndex === 1 }">
                                <span class="text">1</span>
                            </div>
                            <div class="stepText">提交资料</div>
                            <div class="tips"></div>
                        </div>
                        <div class="stepItem center">
                            <div class="snBox">
                                <div class="sn" :class="{ selected: stepIndex === 2 }">
                                    <span class="text">2</span>
                                </div>
                            </div>
                            <div class="stepText">{{ isAuditFailed ? '审核失败' : '审核中'}}</div>
                            <div class="tips">
                                <span v-if="isAuditFailed && importInfo.sv_refusereason" class="tipsText">审核失败原因：{{ importInfo.sv_refusereason }}</span>
                            </div>
                            <div class="stepline"></div>
                        </div>
                        <div class="stepItem">
                            <div class="sn" :class="{ selected: stepIndex === 3 }">
                                <span class="text">3</span>
                            </div>
                            <div class="stepText">审核完成</div>
                            <div class="tips"></div>
                        </div>
                    </div>
                    <div class="stepInfo">
                        <div class="infoTitle">需提交资料</div>
                        <div class="infoContent">
                            <div class="infoLeft">
                                <div class="infoLine">1、身份证正反面</div>
                                <div class="infoLine">2、营业执照</div>
                            </div>
                            <div class="infoRight">
                                <!-- <div class="qrCode">
                                    <img class="img" />
                                </div>
                                <div class="qrcodeText">手机扫码提交</div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <el-button class="btnItem" :disabled="isAuditing" type="primary" @click="handleShowUpload">{{ isAuditFailed ? '重新提交资料' : isAuditing ? '资料审核中' : '提交资料' }}</el-button>
                </div>
            </div>
        </dc-dialog>
        <dc-dialog v-if="showUpload" width="1000" height="720" title="上传认证资料" @close="showUpload = false">
            <div class="authContent">
                <div class="uploadWrap">
                    <div class="uploadItem">
                        <div class="itemTitle">身份证人像面</div>
                        <div class="uploadImg">
                            <ImportImg class="img" height="110" :dataJson="signatureIdentifyData.sv_idcard_front ? [signatureIdentifyData.sv_idcard_front] : []" @callback="(e)=>{callbackImportImg({value:e, type:1})}" :typeEntity="typeEntity"></ImportImg>
                        </div>
                        <div class="itemTips">
                            <span>请上传身份证人像面照片，身份证上传识别成功后被授权人姓名及身份证号将自动保持一致(支持,jpg.jpeg.png 格式)</span>
                        </div>
                    </div>
                    <div class="uploadItem">
                        <div class="itemTitle">身份证国徽面</div>
                        <div class="uploadImg">
                            <ImportImg class="img" height="110" :dataJson="signatureIdentifyData.sv_idcard_back ? [signatureIdentifyData.sv_idcard_back] : []" @callback="(e)=>{callbackImportImg({value:e, type:2})}" :typeEntity="typeEntity"></ImportImg>
                        </div>
                        <div class="itemTips">
                            <span>请上传身份证国微面照片，身份证与被授权人身份证号一致(支持.jpg.jpeg.png 格式)</span>
                        </div>
                    </div>
                    <div class="uploadItem widthRight">
                        <div class="itemTitle">营业执照</div>
                        <div class="uploadImg">
                            <ImportImg class="img" height="110" :dataJson="signatureIdentifyData.sv_creditcode_url ? [signatureIdentifyData.sv_creditcode_url] : []" @callback="(e)=>{callbackImportImg({value:e, type:3})}" :typeEntity="typeEntity"></ImportImg>
                        </div>
                        <div class="itemTips">
                            <span>图片大小不超过1MB(支持.jpg.jpeg .png 格式)</span>
                        </div>
                    </div>
                </div>
                <div class="OCR_list">
                    <div class="inputItem">
                        <div class="key">公司名称</div>
                        <div class="value">
                            <el-input placeholder="请填写公司名称" v-model.trim="signatureIdentifyData.sv_company"></el-input>
                        </div>
                    </div>
                    <div class="inputItem">
                        <div class="key">法人姓名</div>
                        <div class="value">
                            <el-input placeholder="请填写法人姓名" v-model.trim="signatureIdentifyData.sv_legalperson"></el-input>
                        </div>
                    </div>
                    <div class="inputItem">
                        <div class="key">信用代码</div>
                        <div class="value">
                            <el-input placeholder="请填写信用代码" v-model.trim="signatureIdentifyData.sv_credit_code"></el-input>
                        </div>
                    </div>
                    <div class="inputItem">
                        <div class="key">经办人姓名</div>
                        <div class="value">
                            <el-input placeholder="请填写经办人姓名" v-model.trim="signatureIdentifyData.sv_credit_username"></el-input>
                        </div>
                    </div>
                    <div class="inputItem">
                        <div class="key">经办人身份证号码</div>
                        <div class="value">
                            <el-input placeholder="请填写经办人身份证号码" v-model.trim="signatureIdentifyData.sv_idcard"></el-input>
                        </div>
                    </div>
                    <div class="inputItem">
                        <div class="key">短信签名</div>
                        <div class="value">
                            <el-input placeholder="请填写短信签名" v-model.trim="signatureIdentifyData.sv_us_signature"></el-input>
                        </div>
                    </div>
                </div>
                <div class="checkWrap">
                    <div class="inputWrap">
                        <div class="key" v-textStar>手机号</div>
                        <div class="value">
                            <el-input placeholder="请输入手机号" maxlength="11" v-model.trim="signatureIdentifyData.sv_phone" @keyup.native="handleInputNumber($event, 'sv_phone')"></el-input>
                        </div>
                    </div>
                    <div class="inputWrap">
                        <div class="key" v-textStar>验证码</div>
                        <div class="value">
                            <el-input placeholder="手机验证码" max="6" v-model.trim="signatureIdentifyData.code" @keyup.native="handleInputNumber($event, 'code')">
                                <div slot="append" class="btnVerifi" @click="handelGetVerifiCode">{{verifi_code_text}}</div>
                            </el-input>
                        </div>
                    </div>
                    <div class="ncWrap" v-if="slideDialogVisible">
                        <div class="tips">请拖动下方滑块，完成安全验证</div>
                        <div id="nc"></div>
                    </div>
                </div>
            </div>
            <div class="btnWrap">
                <el-button class="btnItem" type="primary" v-repeatClick @click="handleBtnSure">确定</el-button>
            </div>
        </dc-dialog>
    </div>
</template>

<style  lang="scss" scoped>
@import './authentication.scss';
</style>
<script src="./authentication.js"></script>
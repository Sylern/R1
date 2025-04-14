<template>
    <el-dialog title="常用功能自定义" :close-on-click-modal="false" :visible.sync="isShow" width="1100px" class="function_dialog" center>
        <div class="fc_content_wrap">
            <div class="fc_wrap_item">
                <div class="fc_titel">已选功能：</div>
                <div class="function_list">
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/1.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">前台收银</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/2.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">新增会员</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/3.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">新增商品</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/4.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">创建优惠券</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/5.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">销售流水报表</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/6.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">充值营销短信</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/7.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">新增商品套餐</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/8.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">要货管理</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/9.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">短信营销</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/10.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">小程序装修</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/11.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">查询预约服务</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-error"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                </div>
            </div>
            <div class="fc_wrap_item">
                <div class="fc_titel">未选功能：</div>
                <div class="function_list">
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                    <div class="function_item">
                        <div class="fc_img_wrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/system/12.png'">
                            <i class="el-icon-circle-plus"></i>
                        </div>
                        <div class="fc_text_wrap">采购进货</div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script src="./commonFunction.js"></script>

<style lang="sass" scope>
@import './commonFunction.scss';
</style>
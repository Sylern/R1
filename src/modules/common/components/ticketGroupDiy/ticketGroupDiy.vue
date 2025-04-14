<!-- ticketGroupDiy -->
<template>
    <div class=''>
        <div class="chose-all-group-item">
            <div>{{item.groupName}}</div>
            <div class="chose-all-info">{{item.remarks}}</div>
            <span v-for="option in item.items" :key="option.name">
                <el-checkbox v-if="option.name !== '折扣' || ticketSizeActive > 80" :label="option.id" v-model="option.checked" :checked="option.required" :disabled="option.required" @change="resourceChange(option,option.checked)" class="chose-option-item">
					<!-- {{ option.name === '编码' ? $store.state.userInfo.goodsCode_charact : option.name === '货号' ? $store.state.userInfo.goodsNumber_charact : option.name }} -->
					<span v-if="option.name === '编码'">{{ $store.state.userInfo.goodsCode_charact }}</span>
					<span v-else-if="option.name === '货号'">{{ $store.state.userInfo.goodsNumber_charact }}</span>
					<span v-else-if="option.name === '取餐号' && $store.state.userInfo.sv_us_industrytype !== 27">牌号</span>
					<span v-else-if="option.name === '就餐人数' && $store.state.userInfo.sv_us_industrytype !== 27">人数</span>
					<span v-else>{{ option.name }}</span>
				</el-checkbox>
            </span>
        </div>
        <div v-if="item.groupName!=='客户信息'">
            <div v-if="hasChecked(item.groupName, item)" class="diy-style">
                <!-- <div v-if="item.items.find(val=>val.name)" class="diy-style"> -->
                <div class="diy-style-title">自定义样式</div>
                <div v-if="ticketSizeActive===210&&item.groupName==='基本信息'">
                    <div class="min-flex min-flex-main-between pattern-printing">
                        <span>套打</span>
                        <el-switch v-model="patternPrinting" @change="handlePattern">
                        </el-switch>
                    </div>
                    <div v-if="patternPrinting" class="diy-option-item">
                        <div class="diy-option-title">纸张打印样式选择</div>
                        <div class="diy-option-detail">
                            <el-form label-width="30px">
                                <el-form-item label="">
                                    <el-radio-group v-removeAria v-model="ticket.pageType">
                                        <el-radio label="1" class="logo-style-item">
                                            <span class="bisection">
                                                <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/yideng.png'" /><br />A4/一等分
                                            </span>
                                        </el-radio>
                                        <el-radio label="2" class="logo-style-item">
                                            <span class="bisection">
                                                <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/erdeng.png'" /><br />二等分
                                            </span>
                                        </el-radio>
                                        <el-radio label="3" class="logo-style-item">
                                            <span class="bisection">
                                                <img class="img" :src="$store.state.base.frontImgBase+'/images/cashier/sandeng.png'" /><br />三等分
                                            </span>
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div v-if="patternPrinting" class="diy-option-item">
                        <div class="diy-option-title">页码</div>
                        <div class="diy-option-detail">
                            <el-form label-width="30px">
                                <el-form-item>
                                    <el-radio-group v-removeAria v-model="ticket.pageNumberType">
                                        <el-radio label="TopLeft" class="page-num-item">左上角</el-radio>
                                        <el-radio label="TopRight">右上角</el-radio>
                                        <el-radio label="BottomLeft">左下角</el-radio>
                                        <el-radio label="BottomRight">右下角</el-radio>
                                        <el-radio label="BottomCenter">底部居中</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <!-- <div class="diy-option-item">
          <div class="diy-option-title">每页底部打印</div>
          <div class="diy-option-detail">
            <el-form label-width="30px">
              <el-form-item label="">
                <el-checkbox :label="true" v-model="pageSubtotal">本页小计</el-checkbox>
                <el-checkbox :label="false" v-model="pageTotalUpper">金额合计(大写)</el-checkbox>
                <el-checkbox :label="false" v-model="pageTotal">金额总计</el-checkbox>
                <el-checkbox :label="false" v-model="pageNum">数量总计</el-checkbox>
                <el-checkbox :label="false" v-model="pagePhone">电话</el-checkbox>
                <el-checkbox :label="false" v-model="pageAddress">地址</el-checkbox>
                <el-checkbox :label="false" v-model="pageRemarks">备注</el-checkbox>
              </el-form-item>
            </el-form>
          </div>
        </div> -->
                    <div v-if="stroeLogo210&&stroeLogo210.checked&&patternPrinting" class="diy-option-item">
                        <div class="diy-option-title">LOGO名称对齐方式</div>
                        <div class="diy-option-detail">
                            <el-form :model="stroeLogo210" label-width="30px">
                                <el-form-item label="">
                                </el-form-item>
                                <el-form-item v-if="stroeLogo210.checked">
                                    <el-radio-group v-removeAria v-model="stroeName210.style210">
                                        <el-radio label="1" class="logo-style-item">居左
                                            <div class="style-wrap">
                                                <div class="logo-style-wrap left">
                                                    <div class="logo-style">LO<br />GO</div>
                                                </div>
                                                <div class="name-style">店铺名称</div>
                                            </div>
                                        </el-radio>
                                        <el-radio label="2" class="logo-style-item">居中
                                            <div class="style-wrap">
                                                <div class="logo-style-wrap center">
                                                    <div class="logo-style">LO<br />GO</div>
                                                </div>
                                                <div class="name-style">店铺名称</div>
                                            </div>
                                        </el-radio>
                                        <el-radio label="3" class="logo-style-item">居右
                                            <div class="style-wrap">
                                                <div class="logo-style-wrap right">
                                                    <div class="logo-style">LO<br />GO</div>
                                                </div>
                                                <div class="name-style">店铺名称</div>
                                            </div>
                                        </el-radio>
                                        <el-radio label="4" class="logo-style-item">左右样式
                                            <div class="style-wrap">
                                                <div class="logo-style-wrap fl">
                                                    <div class="logo-style">LO<br />GO</div>
                                                </div>
                                                <div class="name-style fl">店铺名称</div>
                                            </div>
                                        </el-radio>
                                        <el-radio label="5" class="logo-style-item">右左样式
                                            <div class="style-wrap right">
                                                <div class="name-style fl">店铺名称</div>
                                                <div class="logo-style-wrap fl">
                                                    <div class="logo-style">LO<br />GO</div>
                                                </div>
                                            </div>
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div v-for="(option,index) in item.items" :key="option.name">
                    <div v-if="option.checked">
                        <div v-if="option.name==='店铺LOGO'&&ticketSizeActive<210" class="diy-option-item">
                            <div class="diy-option-title">{{option.name}}</div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="店铺设置：">
                                        <el-radio-group v-removeAria v-model="option.resource" @change="resourceChange(option,option.resource)">
                                            <el-radio :label="false">同步店铺设置</el-radio>
                                            <el-radio :label="true">
                                                自定义店铺LOGO
                                                <el-tooltip effect="dark" content="上传图片不能大于1m" placement="top-start">
                                                    <i class="el-icon-question" style="color: #909399"></i>
                                                </el-tooltip>
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-show="option.resource">
                                        <ImportImg :dataJson="option.data?[option.data]:[]" @callback="(e)=>{callbackImportImg({value:e,option,index})}" :typeEntity="typeEntity" :verifyJson="item.verifyJson" />
                                    </el-form-item>
                                    <el-form-item label="LOGO大小：">
                                        <el-radio-group v-removeAria v-model="option.logoSize">
                                            <el-radio label="80">小</el-radio>
                                            <el-radio label="100">中</el-radio>
                                            <el-radio label="120">大</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="下边距：">
                  <el-input-number
                    v-model="option.marginBottom"
                    controls-position="right"
                    :disabled="stroeName210.style210>0"
                    :min="0"></el-input-number>
                </el-form-item> -->
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='店铺LOGO'&&ticketSizeActive===210" class="diy-option-item">
                            <div class="diy-option-title">{{option.name}}</div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="店铺设置：">
                                        <el-radio-group v-removeAria v-model="option.resource" @change="resourceChange(option,option.resource)">
                                            <el-radio :label="false">同步店铺设置</el-radio>
                                            <el-radio :label="true">
                                                自定义店铺LOGO
                                                <el-tooltip effect="dark" content="上传图片不能大于1m" placement="top-start">
                                                    <i class="el-icon-question" style="color: #909399"></i>
                                                </el-tooltip>
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-show="option.resource">
                                        <ImportImg :dataJson="option.data?[option.data]:[]" @callback="(e)=>{callbackImportImg({value:e,option,index})}" :typeEntity="typeEntity" :verifyJson="item.verifyJson" />
                                    </el-form-item>
                                    <el-form-item label="LOGO大小：">
                                        <el-radio-group v-removeAria v-model="option.logoSize">
                                            <el-radio label="80">小</el-radio>
                                            <el-radio label="100">中</el-radio>
                                            <el-radio label="120">大</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="下边距：">
                  <el-input-number
                    v-model="option.marginBottom"
                    controls-position="right"
                    :disabled="stroeName210.style210>0"
                    :min="0"></el-input-number>
                </el-form-item> -->
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='店铺名称'" class="diy-option-item">
                            <div class="diy-option-title">{{option.name}}</div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="店铺设置：">
                                        <el-radio-group v-removeAria v-model="option.resource" @change="resourceChange(option,option.resource)">
                                            <el-radio :label="false">同步店铺设置</el-radio>
                                            <el-radio :label="true">自定义店铺名称</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="option.resource">
                                        <el-input v-model="option.data" placeholder="店铺名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="打印字号：">
                                        <el-radio-group v-removeAria v-model="option.fontSize">
                                            <el-radio :label="12">小</el-radio>
                                            <el-radio :label="17">中</el-radio>
                                            <el-radio :label="23">大</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="ticketSizeActive!==210" label="对齐方式：">
                                        <el-radio-group v-removeAria v-model="option.alignment">
                                            <el-radio :label="0">居左</el-radio>
                                            <el-radio :label="1">居中</el-radio>
                                            <el-radio :label="2">居右</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div v-if="ticketSizeActive!==210" class="align-view-wrap">
                                        <div class="align-view" style="text-align:left;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                        <div class="align-view" style="text-align:center;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                        <div class="align-view" style="text-align:right;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <el-form-item label="下边距：">
                                        <el-input-number v-model="option.marginBottom" controls-position="right" :min="0"></el-input-number>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='数量'&&ticketSizeActive!==210" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                                <el-tooltip effect="dark" content="58mm小票不显示商品单位" placement="top-start">
                                    <i class="el-icon-question" style="color: #909399"></i>
                                </el-tooltip>
                            </div>
                            <div class="diy-option-detail goods">
                                <el-form :model="option">
                                    <el-form-item>
                                        <el-radio-group v-removeAria v-model="option.showUnit">
                                            <el-radio :label="false" class="goods-number">标准</el-radio>
                                            <el-radio :label="true" class="goods-number-unit">商品单位</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='店铺电话'" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                            </div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="电话设置：">
                                        <el-radio-group v-removeAria v-model="option.resource" @change="resourceChange(option,option.resource)">
                                            <el-radio :label="false">同步店铺设置</el-radio>
                                            <el-radio :label="true">自定义店铺电话</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="option.resource" label="电话信息：">
                                        <el-input v-model="option.data" inline="false"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='店铺地址'" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                            </div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="地址设置：">
                                        <el-radio-group v-removeAria v-model="option.resource" @change="resourceChange(option,option.resource)">
                                            <el-radio :label="false">同步店铺设置</el-radio>
                                            <el-radio :label="true">自定义店铺地址</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="option.resource" label="地址信息：">
                                        <el-input v-model="option.data"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='店铺公告'" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                            </div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px">
                                    <el-form-item label="对齐方式：">
                                        <el-radio-group v-removeAria v-model="option.alignment">
                                            <el-radio :label="0">居左</el-radio>
                                            <el-radio :label="1">居中</el-radio>
                                            <el-radio :label="2">居右</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="align-view-wrap">
                                        <div class="align-view" style="text-align:left;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                        <div class="align-view" style="text-align:center;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                        <div class="align-view" style="text-align:right;">
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                            <div class="align-view-item">
                                                <span class="align-line"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <el-form-item label="公告信息：">
                                        <el-input v-model="option.data" placeholder="谢谢惠顾，欢迎下次光临！"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-else-if="option.name==='自定义图片'" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                            </div>
                            <div class="diy-option-detail">
                                <ImportImg :dataJson="option.data?[option.data]:[]" @callback="(e)=>{callbackImportImg({value:e,option,index})}" :typeEntity="typeEntity" :verifyJson="item.verifyJson" />
                            </div>
                        </div>
                        <div v-else-if="option.name==='自定义文字'" class="diy-option-item">
                            <div class="diy-option-title">
                                {{option.name}}
                            </div>
                            <div class="diy-option-detail">
                                <el-form :model="option" label-width="100px" :inline="true">
                                    <el-form-item label="自定义：">
                                        <el-input v-model="option.data" type="textarea" placeholder="谢谢惠顾，欢迎下次光临！"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 非选择字段带出样式 -->
                <!-- <div
        v-if="item.groupName==='商品信息'"
        class="diy-option-item">
        <div class="diy-option-title">
          布局样式
        </div>
        <div class="goods-style-info">紧凑布局的行间距小于标准布局，更节省小票纸张</div>
        <div class="diy-option-detail">
          <el-form>
            <el-form-item>
              <el-radio-group v-removeAria v-model="item.height">
                <el-radio :label="5">标准布局</el-radio>
                <el-radio :label="1">紧凑布局</el-radio>
              </el-radio-group>
              <div class="lineheight-view-wrap">
                <div class="lineheight-view">
                  <div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                  </div>
                </div>
                <div class="lineheight-view">
                  <div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                    <div class="lineheight-view-item">
                      <span class="lineheight-line"></span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
                <div v-if="item.groupName==='支付信息'">
                    <div v-for="option in item.items" :key="option.ticketItemId">
                        <div v-if="option.name==='应收'" class="diy-option-item">
                            <div class="diy-option-title">
                                应收
                            </div>
                            <div class="diy-option-detail">
                                <el-form label-width="100px">
                                    <el-form-item label="打印字号：">
                                        <el-radio-group v-removeAria v-model="option.fontSize">
                                            <el-radio :label="10">正常</el-radio>
                                            <el-radio :label="12">大号</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-if="option.name==='实收'" class="diy-option-item">
                            <div class="diy-option-title">
                                实收
                            </div>
                            <div class="diy-option-detail">
                                <el-form label-width="100px">
                                    <el-form-item label="打印字号：">
                                        <el-radio-group v-removeAria v-model="option.fontSize">
                                            <el-radio :label="10">正常</el-radio>
                                            <el-radio :label="12">大号</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./ticketGroupDiy.js"></script>
<style lang='scss' scoped>
@import './ticketGroupDiy.scss';
</style>

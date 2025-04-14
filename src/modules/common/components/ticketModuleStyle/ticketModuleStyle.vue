<!-- ticketModuleStyle -->
<template>
    <div class='ticket-module-style' :class="isView && 'view'">
        <div v-if="ticketSizeActive === 210">
            <div v-for="item in optionSelected" :key="item.groupId" class="ticket-style-item">
                <div v-if="item.groupName === '基本信息'" :class="['chose-item', 'basic', item.groupName === activeItem && 'active']">
                    <div class="ticket-basic">
                        <div v-if="!isView">{{ item.groupName }}</div>
                        <div @click="!isView && handleItemType(item)" class="option-list basic ticket-item-content">
                            <div v-if="stroeName && stroeName.style210 === null" class="head210">
                                <div v-if="stroeLogo210 && stroeLogo210.checked" class="min-ta-center" :style="`text-align:${stroeLogo210.alignment === 1 ? 'center' : stroeLogo210.alignment === 0 ? 'left' : stroeLogo210.alignment === 3 ? 'right' : ''};`">
                                    <div v-if="stroeLogo210.resource" class="er-code-img" :style="`margin-bottom:${stroeLogo210.marginBottom * 16}px;
                                    width:${stroeLogo210.logoSize}px;
                                    height:${stroeLogo210.logoSize}px;
                                    line-height:${stroeLogo210.logoSize}px;
                                    background-image:url(${stroeLogo210.data});`">
                                    </div>
                                    <div v-else :style="`
                                      margin-bottom:${stroeLogo210.marginBottom * 16}px;
                                      width:${stroeLogo210.logoSize}px;
                                      height:${stroeLogo210.logoSize}px;
                                      line-height:${stroeLogo210.logoSize}px;
                                    `" class="er-code-img">LOGO</div>
                                </div>
                                <div v-if="stroeName.checked" class="min-ta-center">
                                    <p :style="{
                                        'text-align': stroeName.alignment === 0 ? 'left' : stroeName.alignment === 1 ? 'center' : stroeName.alignment === 2 ? 'right' : '',
                                        'fontSize': stroeName.fontSize + 10 + 'px',
                                        'margin-bottom': stroeName.marginBottom * 16 + 'px'
                                    }">
                                        {{ stroeName.resource ? stroeName.data : '店铺名称' }}
                                    </p>
                                </div>
                            </div>
                            <div v-if="stroeName && stroeName.style210 && 4 > stroeName.style210 > 0" class="head210">
                                <div v-if="stroeLogo210 && stroeLogo210.checked" class="min-ta-center" :style="`text-align:${stroeName.style210 === '1' ? 'left' : stroeName.style210 === '2' ? 'center' : 'right'};`">
                                    <div v-if="stroeLogo210.resource" class="er-code-img" :style="`
                                      background-image:url(${stroeLogo210.data});
                                      width:${stroeLogo210.logoSize}px;
                                      height:${stroeLogo210.logoSize}px;
                                      line-height:${stroeLogo210.logoSize}px;
                                    `">
                                    </div>
                                    <div v-else class="er-code-img" :style="`
                                      width:${stroeLogo210.logoSize}px;
                                      height:${stroeLogo210.logoSize}px;
                                      line-height:${stroeLogo210.logoSize}px;
                                    `">LOGO</div>
                                </div>
                                <div v-if="stroeName.checked" class="min-ta-center">
                                    <p :style="{
                                        'text-align': stroeName.alignment === 0 ? 'left' : stroeName.alignment === 1 ? 'center' : stroeName.alignment === 2 ? 'right' : '',
                                        'fontSize': stroeName.fontSize + 10 + 'px',
                                        'margin-bottom': stroeName.marginBottom * 16 + 'px'
                                    }">
                                        {{ stroeName.resource ? stroeName.data : '店铺名称' }}
                                    </p>
                                </div>
                            </div>
                            <div class="head210" v-if="stroeName && stroeName.style210 && stroeName.style210 === '4'" :style="`display:flex;align-items:center;
                            margin-bottom:${stroeName.marginBottom * 16}px`">
                                <div v-if="stroeLogo210 && stroeLogo210.checked" class="min-ta-center" :style="`text-align:left;flex:1;`">
                                    <div v-if="stroeLogo210.resource" class="er-code-img" :style="`
                                      width:${stroeLogo210.logoSize}px;
                                      height:${stroeLogo210.logoSize}px;
                                      line-height:${stroeLogo210.logoSize}px;
                                      background-image:url(${stroeLogo210.data});
                                    `">
                                    </div>
                                    <div v-else class="er-code-img" :style="`
                                      width:${stroeLogo210.logoSize}px;
                                      height:${stroeLogo210.logoSize}px;
                                      line-height:${stroeLogo210.logoSize}px;
                                    `">LOGO</div>
                                </div>
                                <div v-if="stroeName.checked" class="min-ta-center" style="flex:1;">
                                    <p :style="{
                                        'text-align': stroeName.alignment === 0 ? 'left' : stroeName.alignment === 1 ? 'center' : stroeName.alignment === 2 ? 'right' : '',
                                        'fontSize': stroeName.fontSize + 10 + 'px',
                                    }">
                                        {{ stroeName.resource ? stroeName.data : '店铺名称' }}
                                    </p>
                                </div>
                                <div style="flex:1;"></div>
                            </div>
                            <div v-if="stroeName && stroeName.style210 && stroeName.style210 === '5'" :style="`display:flex;align-items:center;
                            margin-bottom:${stroeName.marginBottom * 16}px`">
                                <div style="flex:1;"></div>
                                <div v-if="stroeName.checked" class="min-ta-center" style="flex:1;">
                                    <p :style="{
                                        'text-align': stroeName.alignment === 0 ? 'left' : stroeName.alignment === 1 ? 'center' : stroeName.alignment === 2 ? 'right' : '',
                                        'fontSize': stroeName.fontSize + 10 + 'px',
                                    }">
                                        {{ stroeName.resource ? stroeName.data : '店铺名称' }}
                                    </p>
                                </div>
                                <div v-if="stroeLogo210 && stroeLogo210.checked" class="min-ta-center" :style="`text-align:right;flex:1;`">
                                    <div v-if="stroeLogo210.resource" class="er-code-img" :style="`
                                        width: ${stroeLogo210.width};
                                        background-image:url(${stroeLogo210.data});
                                    `">
                                    </div>
                                    <div v-else class="er-code-img">LOGO</div>
                                </div>
                            </div>
                            <div v-if="ticketType.checked" class="min-ta-center">
                                <p class="min-ta-center">{{ templateName }}</p>
                            </div>
                            <div v-for="option in item.items" :key="option.name">
                                <div v-if="option.checked || option.required">
                                    <div v-if="option.name !== '店铺名称' && option.name !== '单据类型' && option.name !== '店铺LOGO'" class="half">
                                        <p>{{ option.name }}:#####</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '商品信息'" :class="['chose-item', item.groupName === activeItem && 'active']">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="option-list">
                        <table width="100%" border="1px" class="good-table">
                            <thead>
                                <tr>
                                    <td width="60px">序号</td>
                                    <td v-if="filter('商品')" width="150px">商品名称</td>
                                    <td v-if="filter('编码')" width="120px">商品编码</td>
                                    <td v-if="filter('货号')" width="120px">货号</td>
                                    <td v-if="filter('规格')" width="120px">规格</td>
                                    <td v-if="filter('数量')" width="60px">数量</td>
                                    <td v-if="filter('单位')" width="120px">单位</td>
                                    <td v-if="filter('折扣')" width="120px">折扣</td>
                                    <td v-if="filter('单价')" width="110px">单价</td>
                                    <td v-if="filter('折后单价')" width="120px">折后单价</td>
                                    <td v-if="filter('批发价')" width="120px">批发价</td>
                                    <td v-if="filter('会员价')" width="120px">会员价</td>
                                    <td v-if="filter('小计')" width="120px">小计</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td v-if="filter('商品')">中款时尚风衣</td>
                                    <td v-if="filter('编码')">54332443</td>
                                    <td v-if="filter('货号')"></td>
                                    <td v-if="filter('规格')">XS,黑色</td>
                                    <td v-if="filter('数量')">
                                        {{ isGroupName('换货信息', item) ? '-1' : '1' }}
                                    </td>
                                    <td v-if="filter('单位')">件</td>
                                    <td v-if="filter('折扣')">100%</td>
                                    <td v-if="filter('单价')">1699.00</td>
                                    <td v-if="filter('折后单价')">1699.00</td>
                                    <td v-if="filter('批发价')"></td>
                                    <td v-if="filter('会员价')"></td>
                                    <td v-if="filter('小计')">
                                        {{ isGroupName('换货信息', item) ? '-1699.00' : '1699.00' }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td v-if="filter('商品')">中款时尚风衣</td>
                                    <td v-if="filter('编码')">54332443</td>
                                    <td v-if="filter('货号')"></td>
                                    <td v-if="filter('规格')">XS,黑色</td>
                                    <td v-if="filter('数量')">1</td>
                                    <td v-if="filter('单位')">单位</td>
                                    <td v-if="filter('折扣')">100%</td>
                                    <td v-if="filter('单价')">1699.00</td>
                                    <td v-if="filter('折后单价')">1699.00</td>
                                    <td v-if="filter('批发价')"></td>
                                    <td v-if="filter('会员价')"></td>
                                    <td v-if="filter('小计')">1699.00</td>
                                </tr>
                                <tr v-if="!showPageSubTotal && filter('合计')">
                                    <td>合计</td>
                                    <td v-if="filter('商品')"></td>
                                    <td v-if="filter('编码')"></td>
                                    <td v-if="filter('货号')"></td>
                                    <td v-if="filter('规格')"></td>
                                    <td v-if="filter('数量')">2</td>
                                    <td v-if="filter('单位')"></td>
                                    <td v-if="filter('折扣')"></td>
                                    <td v-if="filter('单价')"></td>
                                    <td v-if="filter('折后单价')"></td>
                                    <td v-if="filter('批发价')"></td>
                                    <td v-if="filter('会员价')"></td>
                                    <td v-if="filter('小计')">
                                        {{ isGroupName('换货信息', item) ? '0' : '3398.00' }}
                                    </td>
                                </tr>
                                <tr v-if="showPageSubTotal">
                                    <td>小计</td>
                                    <td v-if="filter('商品')"></td>
                                    <td v-if="filter('编码')"></td>
                                    <td v-if="filter('货号')"></td>
                                    <td v-if="filter('规格')"></td>
                                    <td v-if="filter('数量')">2</td>
                                    <td v-if="filter('单位')"></td>
                                    <td v-if="filter('折扣')"></td>
                                    <td v-if="filter('单价')"></td>
                                    <td v-if="filter('折后单价')"></td>
                                    <td v-if="filter('批发价')"></td>
                                    <td v-if="filter('会员价')"></td>
                                    <td v-if="filter('小计')">
                                        {{ isGroupName('换货信息', item) ? '0' : '3398.00' }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else-if="item.groupName === '每页底部打印'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div>
                            <div v-if="isChecked('合计金额(大写)', item)" class="fl" style="width: 260px">
                                <div>合计金额（大写）:</div>
                            </div>
                            <div v-if="isChecked('合计金额', item)" class="fl" style="width: 200px">
                                <div>合计金额:</div>
                            </div>
                            <div v-if="isChecked('合计数量', item)" class="fl" style="width: 160px">
                                <div>合计数量:</div>
                            </div>
                        </div>
                        <div v-if="isChecked('店铺电话', item)">
                            <div>店铺电话:</div>
                        </div>
                        <div v-if="isChecked('店铺地址', item)">
                            <div>店铺地址:</div>
                        </div>
                        <div v-if="isChecked('备注', item)">
                            <div>备注:</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.groupName === '支付信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div class="min-flex min-flex-main-between">
                            <div class="fl" style="display:flex;width:50%;">
                                <div v-if="isChecked('原价', item)" style="width:33%;word-wrap:none;">
                                    <div style="width:65px;">原价:##</div>
                                </div>
                                <div style="width:33%;word-wrap:none;">
                                    <div style="width:65px;">应收:##</div>
                                </div>
                                <div style="width:33%;">
                                    <div style="width:65px;">实收:##</div>
                                </div>
                                <div style="width:33%;">
                                    <div style="width:107px;">支付方式:##</div>
                                </div>
                                <div style="width:150px;display:none;">
                                    <div>优惠:##</div>
                                </div>
                            </div>
                            <div class="min-flex">
                                <div class="fl">
                                    <div style="width:160px">
                                        <div>
                                            本次欠款：##
                                        </div>
                                    </div>
                                </div>
                                <div class="fl">
                                    <div style="width:160px">
                                        <div>
                                            总欠款：##
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="arrears">
              <div>
                <div style="">本次欠款：</div>
              </div>
              <div>
                <div style="">总欠款：</div>
              </div>
            </div> -->
                        </div>
                        <div>
                            <div v-if="isChecked('合计金额(大写)', item)" class="fl" style="width:260px;">
                                <div>合计金额(大写)：###</div>
                            </div>
                            <div v-if="isChecked('合计金额', item)" class="fl" style="width:200px;">
                                <div>合计金额：###</div>
                            </div>
                            <div v-if="isChecked('合计数量', item)" class="fl" style="width:160px;">
                                <div>合计数量：###</div>
                            </div>
                        </div>
                        <div v-if="isChecked('支付单号', item)">
                            <div>支付单号：fewfwe24244fee24gw24eew24e24wg4e</div>
                        </div>
                        <div v-if="isChecked('支付单号条码', item)">
                            <img class="img basic-tiaoma" :src="$store.state.base.frontImgBase + '/images/cashier/tiaoma.png'" alt="">
                        </div>
                        <div v-if="isChecked('备注', item)">
                            <div>备注：</div>
                        </div>
                        <div v-if="isChecked('顾客签名', item)">
                            <div>顾客签名：</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.groupName === '换货信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div>
                            <div class="fl">
                                <div style="width:200px;">
                                    <div>换货总数：1</div>
                                </div>
                            </div>
                            <div class="fl">
                                <div style="width:200px;">
                                    <div>客户补款：</div>
                                </div>
                            </div>
                            <div class="fl">
                                <div style="width:200px;">
                                    <div>换货方式：现金</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>备注信息：</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.groupName === '退货信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div>
                            <div class="fl">
                                <div style="width:180px;">
                                    <div>退货总数：1</div>
                                </div>
                            </div>
                            <div class="fl">
                                <div style="width:180px;">
                                    <div>退货方式：</div>
                                </div>
                            </div>
                            <div class="fl">
                                <div style="width:200px;">
                                    <div>退货原因：质量问题</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>备注信息：质量问题</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.groupName === '其他信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">其他信息</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div v-for="option in item.items" :key="option.name">
                            <div v-if="option.checked">
                                <div v-if="option.name === '电话'">
                                    <p>电话：{{ option.val || '###' }}</p>
                                </div>
                                <div v-else-if="option.name === '地址'">
                                    <p>地址：{{ option.val || '###' }}</p>
                                </div>
                                <div v-else-if="option.name === '自定义文字'">
                                    <p>{{ option.data || '自定义文字' }}</p>
                                </div>
                                <div v-else>
                                    <p>{{ option.name }}:####</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.groupName === '签名信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div>
                            <div v-for="option in item.items" :key="option.ticketItemId" class="fl">
                                <div v-if="option.checked && option.name === '顾客签名'" style="width:200px;">
                                    <div>顾客签名：</div>
                                </div>
                                <div v-if="option.checked && option.name === '店长签名'" style="width:200px;">
                                    <div>顾客签名：</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="small-ticket">
            <div v-for="item in optionSelected" :key="item.groupId" class="ticket-style-item">
                <div v-if="item.groupName === '基本信息'" :class="['chose-item', 'basic', item.groupName === activeItem && 'active']">
                    <div class="ticket-basic">
                        <div v-if="!isView">基本信息</div>
                        <div @click="!isView && handleItemType(item)" class="option-list basic ticket-item-content">
                            <div v-for="option in item.items" :key="option.name" :class="option.name === '单号' || option.name === '销售时间' || option.name === '操作员' ? 'half' : ''">
                                <div v-if="option.checked">
                                    <div v-if="option.name === '店铺LOGO'" class="min-ta-center">
                                        <div v-if="option.resource" class="er-code-img" :style="`margin-bottom:${option.marginBottom * 16}px;
                                        background-image:url(${option.data});`">
                                        </div>
                                        <div v-else :style="`margin-bottom:${option.marginBottom * 16}px;`" class="er-code-img">LOGO</div>
                                    </div>
                                    <div v-if="option.name === '店铺名称'" class="min-ta-center">
                                        <p :style="{
                                            'text-align': option.alignment === 0 ? 'left' : option.alignment === 1 ? 'center' : option.alignment === 2 ? 'right' : '',
                                            'fontSize': option.fontSize + 10 + 'px',
                                            'margin-bottom': option.marginBottom * 16 + 'px'
                                        }">
                                            {{ option.resource ? option.data : '#店铺名称' }}
                                        </p>
                                    </div>
                                    <div v-if="option.name === '单据类型'" class="min-ta-center">
                                        <p class="min-ta-center">{{ templateName }}</p>
                                    </div>
                                    <div v-if="option.name === '单号条码'" class="min-ta-center">
                                        <div>
                                            <img class="img basic-tiaoma" :src="$store.state.base.frontImgBase + '/images/cashier/tiaoma.png'" alt="">
                                        </div>
                                    </div>
                                    <div v-if="option.name === '单号'">
                                        <p>单号：#####</p>
                                    </div>
                                    <div v-if="option.name === '销售时间'">
                                        <p>销售时间：#####</p>
                                    </div>
                                    <div v-if="option.name === '操作员'">
                                        <p>操作员：####</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '商品信息'" :class="['chose-item', item.groupName === activeItem && 'active']">
                    <div v-if="!isView">商品信息</div>
                    <div @click="!isView && handleItemType(item)" class="option-list goods">
                        <table width="100%">
                            <thead v-if="ticketSizeActive === 58">
                                <tr>
                                    <td v-if="filter('商品')">商品</td>
                                    <td v-if="filter('数量')">数量</td>
                                    <td v-if="filter('单价')">单价</td>
                                    <td v-if="filter('小计')">小计</td>
                                </tr>
                            </thead>
                            <thead v-else>
                                <tr>
                                    <td v-if="filter('商品')">商品</td>
                                    <td v-if="filter('折扣')">折扣</td>
                                    <td v-if="filter('单价')">单价</td>
                                    <td v-if="filter('数量')">数量</td>
                                    <td v-if="filter('小计')">小计</td>
                                </tr>
                            </thead>
                            <tbody v-if="ticketSizeActive === 58" valign="top">
                                <tr align="left">
                                    <td v-if="filter('商品')" :colspan="goodsTable.length" style="text-align:left;padding-top: 10px;"><span :style="`display: block;width:${width - 50}px;`" class="min-ellipsis">三只松鼠休闲零食</span></td>
                                </tr>
                                <tr>
                                    <td>{{ filter('编码') ? '5454210111' : '' }}</td>
                                    <td v-if="filter('数量')">1{{ showUnit ? '个' : '' }}</td>
                                    <td v-if="filter('单价')">32.9</td>
                                    <td v-if="filter('小计')">32.9</td>
                                </tr>
                                <tr class="discount">
                                    <td :style="`padding:${item.height}px 0px`" align="right" :colspan="goodsTable.length">
                                        <div class="discount-item">优惠：32.9</div>
                                        <div class="discount-item">优惠后：30.00</div>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else valign="top">
                                <tr align="left">
                                    <td v-if="filter('商品')" :colspan="goodsTable.length" style="text-align:left;padding-top: 10px;"><span :style="`display: block;width:${width - 50}px;`" class="min-ellipsis">三只松鼠休闲零食</span></td>
                                </tr>
                                <tr>
                                    <td>{{ filter('编码') ? '5454210111' : '' }}</td>
                                    <td v-if="filter('折扣')">100%</td>
                                    <td v-if="filter('数量')">1{{ showUnit ? '个' : '' }}</td>
                                    <td v-if="filter('单价')">32.9</td>
                                    <td v-if="filter('小计')">32.9</td>
                                </tr>
                                <tr class="discount">
                                    <td :style="`padding:${item.height}px 0px`" align="right" :colspan="goodsTable.length">
                                        <div class="discount-item">优惠：32.9</div>
                                        <div class="discount-item">优惠后：30.00</div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot v-if="filter('合计')">
                                <tr v-if="ticketSizeActive === 58">
                                    <td :style="`padding:${item.height}px 0px`">
                                        合计
                                    </td>
                                    <td v-if="filter('数量')" :style="`padding:${item.height}px 0px`" align="center">
                                        1
                                    </td>
                                    <td v-if="filter('单价')" :style="`padding:${item.height}px 0px`" align="center">
                                    </td>
                                    <td v-if="filter('小计')" :style="`padding:${item.height}px 0px`">
                                        32.9
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td :style="`padding:${item.height}px 0px`">
                                        合计
                                    </td>
                                    <td v-if="filter('单价')" :style="`padding:${item.height}px 0px`" align="center">
                                    </td>
                                    <td v-if="filter('折扣')" :style="`padding:${item.height}px 0px`" align="center"></td>
                                    <td v-if="filter('数量')" :style="`padding:${item.height}px 0px`" align="center">
                                        1
                                    </td>
                                    <td v-if="filter('小计')" :style="`padding:${item.height}px 0px`">
                                        32.9
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div v-if="item.groupName === '支付信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">支付信息</div>
                    <div @click="!isView && handleItemType(item)" class="pay option-list">
                        <div>
                            <div>
                                <div class="min-flex min-flex-main-between c-right">优惠金额：2.9</div>
                                <!-- <div class="min-flex min-flex-main-between c-right">实收金额：62.9</div> -->
                            </div>
                        </div>
                        <div v-for="payitem in item.items" :key="payitem.ticketItemId">
                            <div v-if="payitem.checked && payitem.name !== '支付单号' && payitem.name !== '支付单号条码'" :style="{ 'font-size': payitem.fontSize === 9 || payitem.fontSize === 0 ? '18px' : '24px' }" class="min-flex min-flex-main-between c-right">
                                <div>{{ payitem.name }}：2.9</div>
                                <!-- <div class="c-num">2.9</div> -->
                            </div>
                            <div v-if="payitem.checked && payitem.name === '支付单号'">
                                <div class="min-flex min-flex-main-between c-right">支付方式：微信</div>
                                <div class="paynum c-right">支付单号：356a5653f3535heh355e</div>
                            </div>
                            <div v-if="payitem.checked && payitem.name === '支付单号条码'" class="min-ta-center">
                                <img class="img basic-tiaoma" :src="$store.state.base.frontImgBase + '/images/cashier/tiaoma.png'" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '换货信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay" style="padding-bottom:10px;">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div class="half">
                            <div>
                                <div>
                                    <p>换货总数：###</p>
                                </div>
                            </div>
                        </div>
                        <div class="half">
                            <div>
                                <div>
                                    <p>客户补款：###</p>
                                </div>
                            </div>
                        </div>
                        <div class="half">
                            <div>
                                <div>
                                    <p>换货方式：###</p>
                                </div>
                            </div>
                        </div>
                        <div class="half">
                            <div>
                                <div>
                                    <p>备注：###</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '退货信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay" style="padding-bottom:10px;">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div class="half">
                            <div>
                                <div>
                                    <p>退货总数：###</p>
                                </div>
                            </div>
                        </div>
                        <div v-for="option in item.items" :key="option.name" class="half">
                            <div v-if="option.checked">
                                <div v-if="option.name === '备注'">
                                    <p>备注信息：###</p>
                                </div>
                                <div>
                                    <p>{{ option.name }}:###</p>
                                </div>
                            </div>
                        </div>
                        <div class="half">
                            <div>
                                <div>
                                    <p>退货原因：###</p>
                                </div>
                            </div>
                        </div>
                        <!-- <div
            class="half">
            <div>
              <div>
                <p>备注信息：###</p>
              </div>
            </div>
          </div> -->
                    </div>
                </div>
                <div v-if="item.groupName === '客户信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay" style="padding-bottom:10px;">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div v-for="option in item.items" :key="option.name" class="half">
                            <div v-if="option.checked">
                                <div>
                                    <p>{{ option.name }}:###</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '其他信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay">
                    <div v-if="!isView">其他信息</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div v-for="option in item.items" :key="option.name">
                            <div v-if="option.checked">
                                <div v-if="option.name === '店铺电话'">
                                    <p>店铺电话：{{ option.val || '###' }}</p>
                                </div>
                                <div v-if="option.name === '店铺地址'">
                                    <p>店铺地址：{{ option.val || '###' }}</p>
                                </div>
                                <div v-if="option.name === '打印时间'">
                                    <p>打印时间：2020/06/16 13:52</p>
                                </div>
                                <div v-if="option.name === '店铺公告'">
                                    <p>{{ option.notice }}</p>
                                </div>
                                <div v-if="option.name === '店铺二维码'">
                                    <div class="min-ta-center">
                                        <div :style="`background-image:url(${option.data});`" alt="" class="er-code-img">
                                        </div>
                                        {{ option.label }}
                                    </div>
                                </div>
                                <div v-if="option.name === '自定义文字'">
                                    <p style="text-align:center;">{{ option.data || '自定义文字' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="item.groupName === '签名信息'" :class="['chose-item', item.groupName === activeItem && 'active']" class="ticket-pay" style="padding-bottom:10px;">
                    <div v-if="!isView">{{ item.groupName }}</div>
                    <div @click="!isView && handleItemType(item)" class="option-list ticket-item-content">
                        <div v-for="option in item.items" :key="option.name" class="half">
                            <div v-if="option.checked">
                                <div>
                                    <p>{{ option.name }}:###</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./ticketModuleStyle.js"></script>
<style lang='scss' scoped>
@import './ticketModuleStyle.scss';
</style>

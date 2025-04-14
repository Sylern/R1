<!--棋牌并台购物车-->
<template>
    <div class="carttingCoffeeMore" :class="{ onAddCartting: !isOrderList }" v-show="dialogVisible" @click.stop="">
        <div class="pagePopContent" :class="{ show: showContent}">
            <div class="totalInfo">
                <el-tooltip class="item" effect="dark" :content="dataList.map(e => e.sv_table_name).join('、')" placement="top-start">
                    <div class="tableNames">{{ dataList.map(e => e.sv_table_name).join('、') }}</div>
                </el-tooltip>
            </div>
            <div class="tableList">
                <el-scrollbar ref="scrollList" style="width:100%; height:100%; overflow:hidden;">
                    <div class="tableInfo" :class="{ selected: item.isShowInfo }" v-for="(item, index) in dataList" :key="index">
                        <div class="tableName">
                            <span>台号：{{ item.sv_table_name }}</span>
                            <el-popconfirm class="span" @confirm="cancelMergeCateringTable(item)" title="是否取消桌台合并结算？">
                                <div slot="reference" class>
                                    <el-button type="text" v-if="tableInfo.sv_table_id !== item.sv_table_id">取消合并</el-button>
                                </div>
                            </el-popconfirm>
                        </div>
                        <div class="billabletimeWrap" v-if="item.billabletime">
                            <div class="wrapInfo">
                                <div class="billName">
                                    <div class="key">计费服务</div>
                                    <div class="valueMore">
                                        <div class="value">
                                            <span>{{ item.billabletime.configName }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="startTime">
                                    <div class="key">开始时间</div>
                                    <div class="value" v-if="item.billabletime.startTime">{{ item.billabletime.startTime.substring(5, item.billabletime.startTime.length) }}</div>
                                </div>
                                <div class="accumulatedTime">
                                    <div class="key">累积时长</div>
                                    <div class="value" v-if="item.billabletime.duration > 59">
                                        <label class="hightLight">{{ parseInt(item.billabletime.duration / 60) }}</label>
                                        <span>小时</span>
                                        <label class="hightLight" v-if="item.billabletime.duration % 60 > 0">{{ parseInt(item.billabletime.duration % 60) }}</label>
                                        <span v-if="item.billabletime.duration % 60 > 0">分钟</span>
                                    </div>
                                    <div class="value" v-else>
                                        <label class="hightLight">{{ item.billabletime.duration }}</label>
                                        <span>分钟</span>
                                    </div>
                                </div>
                                <div class="billMoney">
                                    <div class="key">计费金额</div>
                                    <div class="value">
                                        <label class="hightLight">{{ item.billabletime.totalMoney }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableWrap" v-if="item.isShowInfo">
                            <div class="header">
                                <div class="cell1">
                                    <span>序号</span>
                                </div>
                                <div class="cell2">
                                    <span>商品名称</span>
                                </div>
                                <div class="cell3">
                                    <span>数量</span>
                                </div>
                                <div class="cell4">
                                    <span>售价</span>
                                </div>
                            </div>
                            <div class="tbody">
                                <div class="orderItem" :class="{'isPackage': item.isPackage, 'selected': currentPos === pos}" v-for="(data, pos) in item.productList" :key="pos">
                                    <div class="itemPackage" v-if="data.isPackage">套</div>
                                    <div class="itemGive" v-if="data.dealMoney === 0 && data.sv_return_status !== 2">
                                        <img class="img" :src="$store.state.base.frontImgBase + '/images/cashier/giving.png'" alt="" />
                                    </div>
                                    <div class="dataMain">
                                        <div class="itemStatus">
                                            <!-- <img class="img" :src="$store.state.base.frontImgBase +'/images/cashier/tui.png'" alt="" /> -->
                                            <img class="img" v-if="data.sv_return_status === 2" :src="$store.state.base.frontImgBase + '/images/cashier/tui.png'" alt="" />
                                            <img class="img" v-if="data.sv_return_status !== 2 && data.sv_is_rouse === 1" :src="$store.state.base.frontImgBase + '/images/cashier/deng.png'" alt="" />
                                            <img class="img" v-if="data.sv_return_status !== 2 && data.sv_is_rouse === 2" :src="$store.state.base.frontImgBase + '/images/cashier/qi.png'" alt="" />
                                        </div>
                                        <div class="rowTop row">
                                            <div class="cell1"></div>
                                            <div class="cell2">
                                                <div class="goodsNumber">{{data.barCode}}</div>
                                            </div>
                                            <div class="cell3"></div>
                                            <div class="cell4"></div>
                                            <!-- <div class="cell5"></div> -->
                                            <div class="cell6"></div>
                                        </div>
                                        <div class="rowMiddle row">
                                            <div class="cell1">
                                                <span>{{pos + 1}}</span>
                                            </div>
                                            <div class="cell2">
                                                <div class="goodsName">
                                                    <div class="nameText">
                                                        <span>{{data.isNewSpec ? data.productName +'['+ data.sepcs +']' : data.productName}}</span>
                                                    </div>
                                                    <div class="subInfo" v-html="handleCartering(item)"></div>
                                                </div>
                                            </div>
                                            <div class="cell3">
                                                <div class="product_num">
                                                    <span>{{data.number}}</span>
                                                </div>
                                            </div>
                                            <div class="cell4" @click.stop="">
                                                <div class="salePrice">
                                                    <span>{{$app.moneyFixed(data.dealPrice)}}</span>
                                                    <!-- <el-input v-model.trim="item.dealPrice" @keyup.native.stop="priceInputChange($event, item)" @blur="priceInputBlur($event, item)"></el-input> -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rowBottom row">
                                            <div class="cell1"></div>
                                            <div class="cell2" v-html="handleProductCouponDesc(data)"></div>
                                            <div class="cell3"></div>
                                            <div class="cell4" v-html="handleProductCouponMoney(data)"></div>
                                        </div>
                                    </div>
                                    <div class="dataSub" v-for="(data, pos) in data.packageGroups" :key="pos">
                                        <div class="subName" v-if="data.name">
                                            <span>—— {{data.name}} ——</span>
                                        </div>
                                        <div v-for="(k, p) in data.products" :key="p">
                                            <div class="rowTop row">
                                                <div class="cell1"></div>
                                                <div class="cell2">
                                                    <div class="goodsNumber">{{k.barCode}}</div>
                                                </div>
                                                <div class="cell3"></div>
                                                <div class="cell4"></div>
                                                <!-- <div class="cell5"></div> -->
                                                <div class="cell6"></div>
                                            </div>
                                            <div class="rowMiddle row">
                                                <div class="cell1"></div>
                                                <div class="cell2">
                                                    <div class="goodsName">
                                                        <div class="nameText">
                                                            <span>{{k.name}}</span>
                                                        </div>
                                                        <div class="subInfo" v-html="handleCarteringSub(k)"></div>
                                                    </div>
                                                </div>
                                                <div class="cell3">
                                                    <div class="product_num">
                                                        <span>x{{k.number}}</span>
                                                    </div>
                                                </div>
                                                <div class="cell4">
                                                    <div class="addPrice" v-if="k.addPrice > 0">
                                                        <span>加价：{{$app.moneyFixed(k.addPrice)}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="rowBottom row">
                                                <div class="cell1"></div>
                                                <div class="cell2" v-html="handleProductCouponDesc(k)"></div>
                                                <div class="cell3"></div>
                                                <div class="cell4" v-html="handleProductCouponMoney(k)"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableBtn">
                            <el-button type="text" @click="item.isShowInfo = ! item.isShowInfo">{{ item.isShowInfo ? '收起' : '查看详情' }}</el-button>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="popper__arrow" :class="{ show: showContent}"></div>
    </div>
</template>

<style  lang="scss" scoped>
@import './carttingCoffeeMore.scss';
</style>
<script src="./carttingCoffeeMore.js"></script>

<template>
    <main class="rfmReport-Main">
        <div class="rep_query">
            <div class="rep_top queryFilter">
                <div class="left">
                    <div class="btnItem btnPrimary" @click="exportHandle">导出</div>
                    <!-- <div class="btnItem btnPrimary">打印</div> -->
                </div>
            </div>
            <div class="rep_q_bottom">
                <div class="rep_qb_from">
                    <div class="rep_name">统计时间：</div>
                    <date-time-picker :paramData="[queryEntity.startdate, queryEntity.enddate]" @change="handleChangeTime"></date-time-picker>
                </div>
                <div class="rep_qb_from">
                    <div class="rep_name">消费次数：</div>
                    <div class="rep_value">
                        <div class="selectItem" :class="{ selected: numberPos === index }" v-for="(item, index) in numberList" :key="index" @click="handleNumItem(index)">{{ item.text }}</div>
                        <div class="customItem" :class="{ selected: numberPos === 3 }" @click="handleNumItem(3)">
                            <el-input class="input" v-model="inputData.start_num" @input.native="handleInput" @change="handleInputNumber($event, 'start')"></el-input>
                            <span class="text">至</span>
                            <el-input class="input" v-model="inputData.end_num" @input.native="handleInput" @change="handleInputNumber($event, 'end')"></el-input>
                            <span class="text">次</span>
                        </div>
                    </div>
                </div>
                <div class="rep_qb_from">
                    <div class="rep_name">订单均价：</div>
                    <div class="rep_value">
                        <div class="selectItem" :class="{ selected: pricePos === index }" v-for="(item, index) in priceList" :key="index" @click="handlePriceItem(index)">{{ item.text }}</div>
                        <div class="customItem" :class="{ selected: pricePos === 3 }" @click="handlePriceItem(3)">
                            <el-input class="input" v-model="inputData.start_price" @input.native="handleInput" @change="handleInputPrice($event, 'start')"></el-input>
                            <span class="text">至</span>
                            <el-input class="input" v-model="inputData.end_price" @input.native="handleInput" @change="handleInputPrice($event, 'end')"></el-input>
                            <span class="text">元</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="req_table">
            <div class="tableBox SheetTable">
                <!-- <my-table ref="myTable" rowKey="id" :data="dataList||[]" @select-all="handleSelectAll" @select="handleSellect">
                    <my-table-cell fixed prop="selection" width="40" align="right"></my-table-cell> -->
                <my-table ref="myTable" rowKey="id" :data="dataList||[]">
                    <my-table-cell align="center" label="序号" width="80" prop="index">
                        <template v-slot:default="row">
                            <span>{{(queryEntity.page-1) * queryEntity.pagesize + row.index + 1}}</span>
                        </template>
                    </my-table-cell>
                    <my-table-cell align="center" label="卡号" prop="sv_mr_cardno"></my-table-cell>
                    <my-table-cell align="center" label="会员名称" prop="sv_mr_name"></my-table-cell>
                    <my-table-cell align="center" label="电话号码" prop="sv_mr_mobile"></my-table-cell>
                    <my-table-cell align="center" label="等级" prop="sv_ml_name"></my-table-cell>
                    <my-table-cell align="center" label="开卡门店" prop="user_name" width="140" showTooltip></my-table-cell>
                    <my-table-cell align="center" label="可用积分" prop="sv_mw_availablepoint"></my-table-cell>
                    <my-table-cell align="center" label="储值余额" prop="sv_mw_availableamount"></my-table-cell>
                    <my-table-cell align="center" label="订单总价" prop="money"></my-table-cell>
                    <my-table-cell align="center" label="订单均价" prop="average_price"></my-table-cell>
                    <my-table-cell align="center" label="消费次数" prop="num"></my-table-cell>
                    <my-table-cell align="center" label="最后消费日期" prop="order_datetime" width="140"></my-table-cell>
                    <my-table-cell align="center" label="距今日期" prop="days"></my-table-cell>
                </my-table>
            </div>
            <div class="pageWrap" v-if="total > 0 ">
                <div class="summary"> </div>
                <el-pagination @current-change="index => { handleCurrentSize(index, 'current') }" @size-change="index => { handleCurrentSize(index, 'size') }" :current-page="queryEntity.page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="queryEntity.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './rfmReport.scss';
</style>
<script src="./rfmReport.js"></script>

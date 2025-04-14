<template>
    <div class="overviewFitness">
        <div class="fnWrap">
            <div class="total" >
                <!-- <div class="total-item">
                    <div class="num">10</div>
                    <div class="des">请假处理</div>
                </div>
                <div class="total-item">
                    <div class="num">166</div>
                    <div class="des">节续费提醒</div>
                </div> -->
                <!-- <div class="total-item">
                    <div class="num">{{ arrearsCount }}</div>
                    <div class="des">欠费待补交</div>
                </div>
                <div class="total-item">
                    <div class="num">{{ notNamedCount }}</div>
                    <div class="des">超时未点</div>
                </div> -->
            </div>

            <div class="title">
                <div class="des">快捷入口</div>
            </div>
            <div class="fnList">
                <div class="fnItem" v-for="(item, index) in fnListData" :key="index" @click="handleFn(item)">
                    <div class="fnIcon">
                        <img class="img" :src="item.icon" />
                    </div>
                    <div class="fnName">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <template >
            <div class="month-date">
                <div class="item">
                    <div class="des">当月实际营收(元)</div>
                    <div class="num">{{ $store.state.JurisdictionObj.Consolidated_Income ? (memberCourseDailySummaryRes.income || 0) : '***' }}</div>
                    <div id="map_in" class="map"></div>
                    <div class="per">上月实际营收额：{{ memberCourseDailySummaryRes.income_last || 0 }}</div>
                </div>
                <div class="item">
                    <div class="des">当月售课(节)</div>
                    <div class="num">{{ memberCourseDailySummaryRes.course_count_sell || 0 }}</div>
                    <div class="map" id="sale"></div>
                    <div class="per">上月售课：{{ memberCourseDailySummaryRes.course_count_sell_last || 0 }}</div>
                </div>
                <div class="item">
                    <div class="des">当月消课(次)</div>
                    <div class="num">
                        {{ memberCourseDailySummaryRes.course_count_expense || 0 }}
                        <div class="des">价值￥{{ memberCourseDailySummaryRes.course_amount_expense || 0 }}</div>
                    </div>
                    <div id="map_cut" class="map"></div>
                    <div class="per">上月消课：{{ memberCourseDailySummaryRes.course_count_expense_last || 0 }}</div>
                </div>
                <div class="item">
                    <div class="des">当月新增会员(人)</div>
                    <div class="num">{{ memberCourseDailySummaryRes.member_count || 0 }} <div class="des">流失：{{ memberCourseDailySummaryRes.member_count_loss || 0 }}</div>
                    </div>
                    <div id="map_add" class="map"></div>
                    <div class="per">上月新增会员：{{ memberCourseDailySummaryRes.member_count_last || 0 }}</div>
                </div>
            </div>
            <div class="dataWrap">
                <div class="title">
                    <div class="des">会员分析</div>
                    <div class="right">
                        <el-select v-model="memberReportEntity.user_list" collapse-tags multiple placeholder="请选择学校"
                            @change="classChangeHandle('member')">
                            <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <date-time-picker :paramData="[memberReportEntity.start_date, memberReportEntity.end_date]"
                            @change="sourceChangeTimeHandle"></date-time-picker>
                        <!-- <el-button type="info" plain disabled size="small">10:20更新</el-button> -->
                    </div>
                </div>
                <div class="message">
                    <div class="m-item"><span>消费会员：</span>注册会员中已转化下单的会员</div>
                    <div class="m-item"><span>上课会员：</span>消费会员中上课的会员数</div>
                    <div class="m-item"><span>下单-上课转化率：</span>上课会员数/消费会员数</div>
                </div>

                <div class="map">
                    <div class="new-content">
                        <div id="new">
                            <div class="item">
                                <div class="name">注册会员</div>
                                <div class="num">{{ memberReportRes.registered_count || 0 }}</div>
                                <div class="percent">{{ memberReportRes.consume_rate || 0 }}%</div>
                            </div>

                            <div class="item">
                                <div class="name">消费会员</div>
                                <div class="num">{{ memberReportRes.consume_count || 0 }}</div>
                            </div>

                            <div class="item">
                                <div class="percent">{{ memberReportRes.consume_class_rate || 0 }}%</div>
                                <div class="name">上课会员</div>
                                <div class="num">{{ memberReportRes.class_count || 0 }}</div>
                            </div>
                        </div>
                    </div>
                    <div id="source"></div>
                </div>
                <div class="foot">
                    <div class="current-month">
                        <span>{{ sourceDayTxt }}</span>
                        <span>新客分析</span>
                    </div>
                    <div class="item">
                        <div class="f-title"><span>会员潜力</span><span>解读</span></div>
                        <div class="f-des">
                            截止当前时间，漏斗中的消费会员平均每单消费<span>{{ memberReportRes.consume_amount_avg || 0 }}</span>元，
                            累计消费<span>{{ memberReportRes.consume_amount_total || 0 }}</span>元，
                            累计成交<span>{{ memberReportRes.consume_count_total || 0 }}</span>单,
                            上课会员平均<span>{{ memberReportRes.class_count_avg || 0 }}</span>天上一节课，
                            平均每节课价值<span>{{ memberReportRes.class_amount_avg || 0 }}</span>元
                        </div>
                    </div>
                    <div class="item">
                        <div class="f-title"><span>会员来源</span><span>解读</span></div>
                        <div class="f-des">
                            这段时间注册的会员， <template v-if="sourceRes.sv_ms_name_order"><span>{{ sourceRes.sv_ms_name_order }}</span>来源会员下单转化率最高，</template>
                            累计至当前已成交<span>{{ sourceRes.sv_order_count || 0 }}</span>单，
                            平均每单消费 <span>{{ sourceRes.sv_order_amount_avg || 0 }}</span>元，
                            <template v-if="sourceRes.sv_ms_name_class"><span>{{ sourceRes.sv_ms_name_class }}</span>会员上课转化率最高，</template>
                            累计至当前已点名 <span>{{ sourceRes.sv_class_count || 0 }}</span>次，
                            平均每节课价值 <span>{{ sourceRes.sv_class_amount_avg || 0 }}</span>元
                        </div>
                    </div>
                </div>
            </div>
            <div class="dataWrap">
                <div class="title">
                    <div class="des">上课分析</div>
                    <div class="right">
                        <el-select v-model="classReportEntity.user_list" collapse-tags multiple placeholder="请选择学校"
                            @change="classChangeHandle('class')">
                            <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <date-time-picker :paramData="[classReportEntity.start_date, classReportEntity.end_date]"
                            @change="classChangeTimeHandle"></date-time-picker>
                        <!-- <el-button type="info" plain disabled size="small">10:20更新</el-button> -->
                    </div>
                </div>
                <div class="message">
                    <div class="m-item"><span>上课人数：</span>上课会员（已上课）</div>
                    <div class="m-item"><span>上课节数：</span>私教课、团体课(已上课)</div>
                </div>
                <div id="course" class="map">
                    <div class="times-content">
                        <div id="times"></div>
                    </div>

                    <div class="ranking">
                        <div class="head">
                            <div class="td">排名</div>
                            <div class="td">教练</div>
                            <div class="td">上课节数</div>
                        </div>
                        <el-scrollbar class="ranking-content">
                            <div :class="['row', index < 3 ? `row${index + 1}` : '']" v-for="(item, index) in classReportRes.list" :key="index">
                                <div class="td">{{ index >= 3 ? index + 1 : '' }}</div>
                                <div class="td">{{ item.sv_employee_name }}</div>
                                <div class="td">{{ item.count }}</div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="foot">
                    <div class="current-month">
                        <span>{{ classDayTxt }}</span>
                        <span>上课分析</span>
                    </div>
                    <div class="item">
                        <div class="f-title"><span>上课频次</span><span>解读</span></div>
                        <div class="f-des">
                            上课频次最高的课程是<span>{{ classReportRes.sv_p_name || "" }}</span>,
                            <!-- 累计预约<span>3</span>次, -->
                            消课金额<span>{{ classReportRes.class_amount || 0 }}</span>元，
                            上课人数中<span>{{ classReportRes.sex == 1 ? '男' : classReportRes.sex == '0' ? '女' : '未知性别' }}</span>会员较多，
                            占比<span>{{ classReportRes.sex_percent || 0 }}%</span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="f-title"><span>上课排行</span><span>解读</span></div>
                        <div class="f-des">
                            私教课上课<span>{{ classReportRes.class_count_私教课 || 0 }}</span>节，
                            教练人均上课<span>{{ classReportRes.class_count_avg || 0 }}</span>节，
                            总消课价值<span>{{ classReportRes.class_amount_total || 0 }}</span>元，
                            其中<span>{{ classReportRes.member_count_low || 0 }}人</span>上课数低于平均水平
                            <!-- 建议及时关注<a href="" @click.prevent="onTest">{{ classReportRes.sv_employee_name }}</a> -->
                        </div>
                    </div>
                </div>
        
            </div>
        </template>
        <!-- 会员列表-抵扣周期卡 -->
        <member-list :visible.sync="memberListStatus" :syncStore="false" :syncSelectedClose="false" @selectMember="handleMemberInfo"></member-list>
    </div>
</template>

<script src="./overviewFitness.js"></script>

<style lang="scss" scoped>
@import './overviewFitness.scss';

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

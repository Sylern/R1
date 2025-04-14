<template>
    <div class="ticket-printing">
        <div class="ticket-content">
            <el-tabs v-model="activeId" @tab-click="getTemplate" type="card" class="ticket-tab">
                <el-tab-pane v-for="ticket in ticketList" :key="ticket.templateId" :label="ticket.templateName" :name="ticket.templateId">
                    <el-main class="ticket-main" :class="ticketSizeActive===210&&'size'">
                        <!-- <router-view /> -->
                        <el-row type="flex" justify="space-between">
                            <el-radio-group v-removeAria v-model="ticketSizeActive" @change="hanldeSize" size="medium">
                                <el-radio-button v-for="item in ticketSize" :key="item" :label="item" class="size-btn">
                                    {{item}}mm{{item===210?'(三联单)':''}}
                                </el-radio-button>
                            </el-radio-group>
                            <!-- <el-button @click="dialogTableVisible = true">预览模板效果</el-button> -->
                        </el-row>
                        <div class="flex" :class="ticketSizeActive===210&&'size'">
                            <!-- 左侧样式预览 -->
                            <el-scrollbar :style="`width:${width}px;`" class="scroll-box">
                                <div class="selected-option-box">
                                    <div v-if="itemList.length>0" :class="ticketSizeActive>80&&'two-column'">
                                        <ticketModuleStyle :optionSelected="itemList" :handleItemType="handleItemType" :activeItem="activeItem" :templateName="itemType.templateName" :width="width" :ticketSizeActive="ticketSizeActive" />
                                    </div>
                                </div>
                            </el-scrollbar>
                            <!-- 右侧配置设置 -->
                            <div class="chose-option" :style="`width:calc(100% - ${width}px - 36px);`">
                                <div v-if="itemType.ticketItemGroups" class="margin-b-bar">
                                    <el-scrollbar style="height:100%" class="dec-scrollbar">
                                        <!-- 配置项组件 -->
                                        <ticketGroupTab :itemList="itemList" :activeItem="activeItem" :ticket="itemType" :ticketSizeActive="ticketSizeActive" @changeActiveItem="changeActiveItem" />
                                    </el-scrollbar>
                                </div>
                            </div>
                        </div>
                    </el-main>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div>
            <el-dialog title="小票预览" :visible.sync="dialogTableVisible" :top="ticketSizeActive<210?'2vh':'15vh'" style="text-align:center;">
                <el-row type="flex" justify="center">
                    <el-radio-group v-removeAria v-if="ticketSize" v-model="ticketSizeActive" @change="hanldeSize" size="medium">
                        <el-radio-button v-for="item in ticketSize" :key="item" :label="item" class="size-btn">
                            {{item}}mm{{item===210?'(A4)':''}}
                        </el-radio-button>
                    </el-radio-group>
                </el-row>
                <el-row type="flex" justify="center" class="view-ticket-wrap" :class="ticketSizeActive>80&&'two-column'">
                    <ticketModuleStyle :optionSelected="itemList" :handleItemType="handleItemType" :isView="true" :ticketSizeActive="ticketSizeActive" :templateName="itemType.templateName" :width="width" :style="{'width': (ticketSizeActive > 210 ? width * 0.8 : width) +'px'}"></ticketModuleStyle>
                </el-row>
                <el-row class="view-btn-wrap">
                    <!-- <el-button type="primary" size="medium" @click="testPrint">打印测试</el-button> -->
                    <el-button type="primary" size="medium" @click="saveTemplate">保存</el-button>
                </el-row>
            </el-dialog>
        </div>
        <div class="fix-bottom-bar">
            <el-button class="btnItem" type="primary" size="medium" @click="saveTemplate">保存</el-button>
        </div>
    </div>
</template>

<script src="./customTicket.js"></script>

<style lang='scss' scoped>
@import './customTicket.scss';
</style>

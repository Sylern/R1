<template>
    <dc-dialog :title="title" v-if="dialogVisible" width="1200" height="750" zIndex="999" class="system_dialog" @close="closeDialog">
        <div class="applicationJSON">
            <div class="main">
                <section class="hpm_left">
                    <el-scrollbar style="width:100%;height:100%">
                        <div class="hpm_l_section">
                            <div v-for="(item, i) in componentGroup" :key="i" class="hpm_ls_item">
                                <div class="hpm_lsi_title">{{ item.title }}</div>
                                <div class="hpm_lsi_dl">
                                    <div @click="handleAddComponent(id)" v-for="id in item.ids" :key="id" class="hpm_lsi_dd">
                                        <cmdIcon :type="componentConfig[id].icon" :size="componentConfig[id].size" color=""></cmdIcon>
                                        <span>{{ componentConfig[id].name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </section>
                <section class="hpm_center">
                    <div class="hpm_c_iphone-content">
                        <div class="hpm_c_iphone">
                            <div class="hpm_ci_heard">
                                <div class="hpm_cih_left">{{ $app.currentTime(new Date(), 'HH:mm') }}</div>
                                <div class="hpm_cih_right">
                                    <cmd-icon type="icon-xinhao"></cmd-icon>
                                    <cmd-icon type="icon-wifi"></cmd-icon>
                                    <cmd-icon type="icon-electricity-full"></cmd-icon>
                                </div>
                            </div>
                            <div class="hpm_ci_content">
                                <div class="type_bg" :style="{ 'backgroundImage':`url(${$store.state.base.frontImgBase}/images/${typeImg}` }">
                                    <div class="productName">{{ productName || '活动标题' }}</div>
                                    <div class="ticketName">{{ productName || '票种名称' }}</div>
                                    <div class="ticketNumber">{{ productName || '1' }}张</div>
                                    <div class="productTime">
                                        <i class="el-icon-time"></i>
                                        <span>{{ productName || '活动时间' }}</span>
                                    </div>
                                    <div class="productAddress">
                                        <i class="el-icon-location-outline"></i>
                                        <span>{{ productName || '活动地点' }}</span>
                                    </div>
                                </div>
                                <el-scrollbar class="content_scroll_view" ref="myScrollbar">
                                    <vuedraggable class="hpmc_ics_section" v-model="jsonData" @change="handSortChang" v-bind="{ animation: 500, ghostClass: 'ui-state-highlight' }">
                                        <component :is="componentConfig[data.id].viewName" v-bind="{ ...data }" :class="{ 'component-active': index === activeIndex }" @del="handleDelComponent(index)" @active="handleActive(index)" v-for="(data, index) in jsonData" :key="index" ref="refcomponent" />
                                    </vuedraggable>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>

                    <div class="hpm_right">
                        <el-scrollbar class="right_scroll">
                            <div class="hpm_right_content">
                                <component :ref="`${componentConfig[jsonData[activeIndex].id].editName}_${activeIndex}`" v-if="activeIndex > -1" :is="componentConfig[jsonData[activeIndex].id].editName" v-bind="{ ...jsonData[activeIndex] }" @change="handlePropChange" />
                            </div>
                        </el-scrollbar>
                    </div>
                </section>
            </div>
            <div class="foot">
                <div class="btnItem btnPrimary big" v-repeatClick @click="handleSave">保 存</div>
            </div>
        </div>
    </dc-dialog>
</template>

<script src="./applicationJSON.js"></script>

<style lang="scss" scoped>
@import './applicationJSON.scss';
</style>
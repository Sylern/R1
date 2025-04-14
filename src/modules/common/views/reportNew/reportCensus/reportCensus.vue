
<template>
    <div class="reportCensus">
        <!-- main主要内容 -->
        <help-center pageName="智能分析" pageWidth="100%" :DocTypeIdFilter="helpCenterListId">
            <div class="containt">
                <el-scrollbar style="height:100%;width:100%;min-height:80vh;">
                    <div class="section">
                        <div v-for="item in list" :key="item.sv_func_id" class="group">
                            <template v-if="!$app.isNull(item.children)">
                                <div class="title">{{item.sv_func_name}}</div>
                                <div class="items">
                                    <a @click="onChildClick(item,children)" v-for="children in item.children" :key="children.sv_func_id" class="item">
                                        <img class="img" :src="children.sv_func_icon_n3" />
                                        <div class="nameText">
                                            <div class="name">{{children.sv_func_name}}</div>
                                            <el-tooltip effect="dark" :content="children.sv_remark" placement="bottom">
                                            <div class="text">{{children.sv_remark}}</div>
                                            </el-tooltip>
                                        </div>
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </help-center>
    </div>
</template>

<style lang="scss" scoped>
@import './reportCensus.scss';
</style>
<script src="./reportCensus.js"></script>

<template>
    <el-dialog title="选择岗位" :visible.sync="dialogVisible" :close-on-click-modal="false" width="640px" class="system_dialog">
        <div class="svim_station_dialog borderTop">
            <div class="svim_sd_section SheetFrom" :style="{height:dataJson.length>35?'400px':'auto'}">
                <el-scrollbar ref="svim_sds_scrollbar" style="height:100%;width:100%;">
                    <el-checkbox-group v-model="activeId">
                        <el-checkbox :disabled="handleIsDisabled(item)" class="svim_section_checkbox" v-for="item in dataJson" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-scrollbar>
            </div>
            <div class="btnWrap">
                <el-button @click="handleSubmit" class="btnItem btnPrimary" v-repeatClick>确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scope>
@import './checkedStation.scss';
</style>
<script src="./checkedStation.js"></script>
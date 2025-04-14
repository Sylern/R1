<template>
    <el-dialog title="概况信息" :close-on-click-modal="false" :visible.sync="isShow" width="1100px" class="chart_dialog" center>
        <div class="chart_content">
            <div class="cw_charts_list">
                <div class="cw_charts_item" v-for="item in chartsList" :key="item.type">
                    <div class="charts_check">
                        <el-checkbox v-model="item.enable" label="1" @change="setShopHomeChartConfig">{{handleItemName(item.type)}}</el-checkbox>
                    </div>
                    <div class="charts_img_wrap"><img class="img" :src="handleItemImg(item.type)"></div>
                </div>
                <div v-if="chartsList==0" style="text-align:center;width: 100%;margin-bottom: 50px;">无权限查看</div>
            </div>
        </div>
    </el-dialog>
</template>

<script src="./commonCharts.js"></script>

<style lang="sass" scope>
@import './commonCharts.scss'
</style>
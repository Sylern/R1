<template>
    <div class="dcTable">
        <el-scrollbar style="width: 100%; height: 100%">
            <div class="theader fixed">
                <!-- <dc-table-cell :prop="data.child.prop" :label="item[data.child.prop]" :width="80" fixed></dc-table-cell> -->
                <dc-table-cell v-for="(item, index) in tableProps" :key="index" :prop="item.key" :label="item.label" :width="item.width" :fixed="item.fixed"></dc-table-cell>
                <!-- <div class="cell fixed">固定</div>
                <div class="cell fixed">固定1</div>
                <div class="cell" v-for="(item, index) in 10" :key="index">{{ index }}</div> -->
            </div>
            <div ref="tr" class="tr" v-for="(dataItem, dataPos) in tableData" :key="dataPos">
                <dc-table-cell  v-for="(item, index) in tableProps" :key="index" :dataItem="{...dataItem, ...item, index: dataPos}" :prop="item.key" :label="dataItem[item.key]" :width="item.width" :fixed="item.fixed"></dc-table-cell>
                <!-- <slot :text="2"></slot> -->
                <!-- <div class="cell" v-for="(item, index) in 10" :key="index">{{ pos + '-' + index }}</div> -->
            </div>
            <div class="empty" v-if="tableData.length === 0">暂无数据</div>
        </el-scrollbar>
    </div>
</template>

<style lang="sass" scoped>
@import "./dcTable.scss"
</style>
<script src="./dcTable.js"></script>

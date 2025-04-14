<!-- ticketGroupTab -->
<template>
    <div class=''>
        <el-tabs :value="activeItem" @tab-click="changeActiveItem" type="card">
            <el-tab-pane label="所有" name="所有" class="chose-all-group">
                <div v-for="item in itemList" :key="item.groupName">
                    <TicketGroupDiy :item="item" :ticket="ticket" :ticketSizeActive="ticketSizeActive" />
                </div>
                <div v-if="itemList.length<1" class="no-content">暂无分组信息</div>
            </el-tab-pane>
            <el-tab-pane v-for="item in itemList" :key="item.groupName" :label="item.groupName" :name="item.groupName" class="chose-all-group">
                <TicketGroupDiy :item="item" :ticket="ticket" :ticketSizeActive="ticketSizeActive" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script src="./ticketGroupTab.js"></script>
<style lang='scss' scoped>
// @import './ticketGroupTab.scss';
</style>

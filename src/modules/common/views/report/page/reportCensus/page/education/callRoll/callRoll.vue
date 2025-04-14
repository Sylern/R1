<template>
    <div class="callRoll">
        <div class="tabsWrap">
            <el-tabs v-model="activeName">
                <el-tab-pane label="点名记录" name="1"></el-tab-pane>
                <el-tab-pane label="点名学员记录" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="contentWrap">
            <record v-if="activeName == '1'"></record>
            <studentRecord v-if="activeName == '2'"></studentRecord>
        </div>
    </div>
</template>

<script src="./callRoll.js"></script>
<style lang="scss" scoped>
@import "./callRoll.scss";
</style>
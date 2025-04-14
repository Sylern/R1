<template>
    <div>
        <div class="search_wrap">
            <date-time-picker :paramData="queryData.startEndTime" @change="handleChangeTime"></date-time-picker>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import './dailyStatement.scss'
</style>

<script src="./dailyStatement.js"></script>
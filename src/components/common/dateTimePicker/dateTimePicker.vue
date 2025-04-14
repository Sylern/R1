<template>
    <el-date-picker class="date-picker" :disabled="disabled" v-model.trim="dateTime" @change="handleChangeTime" :type="needTimePicker ? 'datetimerange':'daterange'" :default-time="defaultTime" align="right" unlink-panels range-separator="至" :start-placeholder="plaStart" :end-placeholder="plaEnd" :picker-options="pickerOptions"></el-date-picker>
</template>


<style lang="sass" scoped>
@import "./dateTimePicker.scss"
</style>
<script src="./dateTimePicker.js"></script>
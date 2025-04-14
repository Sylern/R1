<template>
    <div class="contentWrap">
        <div class="menuList">
            <div v-for="(item, index) in menuList" :key="index">
                <div class="menuItem" v-if="!item.isHide" :class="{selected: menuPos === index}" @click="handleMenuItem(item, index)">{{ item.name }}</div>
            </div>
        </div>
        <!-- <order-list v-if="menuPos === 0" :isShow="menuPos === 0"></order-list> -->
        <order-list v-if="menuPos === 0 && !isMeiye" :isShow="menuPos === 0"></order-list>
        <cosmetology v-if="menuPos === 0 && isMeiye" :isShow="menuPos === 0"></cosmetology>
        <recharge-record v-if="menuPos === 1" :isShow="menuPos === 1"></recharge-record>
        <cardsSale-record v-if="menuPos === 2" :isShow="menuPos === 2"></cardsSale-record>
        <card-report v-if="menuPos === 3" :isShow="menuPos === 3"></card-report>
        <reservation-record v-if="menuPos === 4" :isShow="menuPos === 4"></reservation-record>
        <pre-money-report v-if="menuPos === 5" :isShow="menuPos === 5"></pre-money-report>
    </div>
</template>

<style  lang="sass" scoped>
@import "./main.scss"
</style>
<script src="./main.js"></script>
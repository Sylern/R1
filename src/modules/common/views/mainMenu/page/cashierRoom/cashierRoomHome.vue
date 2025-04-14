<template>
    <div class="cashierRoomHome">
        <m-cashier-room v-if="isMeiye"></m-cashier-room>
        <c-cashier-room v-else></c-cashier-room>
    </div>
</template>

<style lang="sass" scoped>
@import "./cashierRoomHome.scss"
</style>
<script src="./cashierRoomHome.js"></script>

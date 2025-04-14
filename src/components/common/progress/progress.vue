<template>
    <div class="com_progress">
        <div class="com_p_div"></div>
    </div>
</template>

<style lang="scss" scoped>
.com_progress {
    width: 100%;
    margin-bottom: 18px;
    position: relative;
    .com_p_div {
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: animationa;
        animation-timing-function: linear;
        background: linear-gradient(
            45deg,
            #67c23a 0%,
            #67c23a 25%,
            #fff 25%,
            #fff 50%,
            #67c23a 50%,
            #67c23a 75%,
            #fff 75%,
            #fff 100%
        );
        // background: linear-gradient(
        //     45deg,
        //     #67c23a 0%,
        //     #67c23a 25%,
        //     #b7d1ad 25%,
        //     #b7d1ad 50%,
        //     #67c23a 50%,
        //     #67c23a 75%,
        //     #b7d1ad 75%,
        //     #b7d1ad 100%
        // );
        background-size: 10px 10px;
        height: 10px;
        position: relative;
        border-radius: 10px;
        text-align: center;
    }
}

@keyframes animationa {
    /* 修改背景定位 */
    0% {
        background-position: -10px 0;
    }
    100% {
        background-position: 10px 0;
    }
}
</style>
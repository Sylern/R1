<template>
    <router-view></router-view>
</template>

<script>
export default {
    mounted() {
        this.$app.deleteLocalStorage('token');
    },
}
</script>
<template>
    <div class="component dcNumber" @click.stop="$emit('active')">
        <div class="content">
            <div class="required" v-if="required">*</div>
            <div class="label" v-if="label"> {{ label }} </div>
            <input class="value" :value="value" :placeholder="placeholder" type="text">
        </div>
        <div id="close">
            <cmdIcon type="icon-del2" size="" color="" class="close" @click.stop="$emit('del')"></cmdIcon>
        </div>
    </div>
</template>

<script>
import config, { ID_NUMBER } from "../config"
export default {
    mixins: [config[ID_NUMBER].props]
}
</script>
<style lang="scss" scoped>
@import "./common.scss";
</style>
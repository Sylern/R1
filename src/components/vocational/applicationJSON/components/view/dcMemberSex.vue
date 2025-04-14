<template>
    <div class="component dcMemberSex" @click.stop="$emit('active')">
        <div class="content">
            <div class="required" v-if="required">*</div>
            <div class="label" v-if="label"> {{ label }} </div>
            <input class="value" :value="inputVal" :placeholder="placeholder" type="text">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div id="close">
            <cmdIcon type="icon-del2" size="" color="" class="close" @click.stop="$emit('del')"></cmdIcon>
        </div>
    </div>
</template>

<script>
import config, { ID_MEMBER_SEX } from "../config"
export default {
    mixins: [config[ID_MEMBER_SEX].props],
    computed:{
        inputVal(){
            const {value} = this
            return `${value}`==='1'?'男': `${value}`==='0'?'女':''
        }
    },
}
</script>
<style lang="scss" scoped>
@import "./common.scss";
</style>
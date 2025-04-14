<template>
    <div class="menuTree-main">
        <tree-list :data="data">
            <template v-slot:default="slotProps">
                <slot v-bind:item="slotProps.item"></slot>
            </template>

        </tree-list>
    </div>
</template>
<script>
import treeList from './list.vue'
export default {
    components: { treeList },
    props: {
        data: { type: Array, default: [] },
        config: { type: Object, default: { indent: false, indentNum: 16 } },
        activeCode: { type: String, default: '' }
    },
    provide() {
        return {
            config: this.config,
            activeCode: () => this.activeCode,
            eventBus: this.eventBus
        }
    },
    data() {
        return {
            eventBus: new Vue()
        }
    },
    mounted() {
        this.eventBus.$on('click', (item) => { this.$emit('onClick', item) })
    }
}

</script>
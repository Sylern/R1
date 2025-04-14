<template>
    <div>
        <div v-for="(item, key) in data" :key="key">
            <div @click="onClick(item)" class="tlm-c-title"
                :class="[`tlm-level` + count, { active: activeCodes === item.code }]" :style="stylePadding">
                <span>{{ item.name }}</span>
                <span v-if="item.children && item.children.length > 1">
                    <i v-if="item.isShow" class="el-icon-arrow-down"></i>
                    <i v-else class="el-icon-arrow-right"></i>
                </span>
                <span v-else>
                    <slot v-bind:item="item"></slot>
                </span>
            </div>
            <tree-list @onClick="onClick" :increment-count="count" v-if="item.children && item.isShow"
                :data="item.children" :level="[...level, item.code]">
                <template v-slot:default="slotProps">
                    <slot v-bind:item="slotProps.item"></slot>
                </template>
            </tree-list>
        </div>
    </div>
</template>
<script>
export default {
    name: "tree-list",
    props: {
        data: { type: Array, default: [] },
        incrementCount: { type: Number, default: 0 },
        level: { type: Array, default: [] }

    },
    inject: ['config', 'activeCode', 'eventBus'],
    computed: {
        count: function () {
            var c = this.incrementCount;
            return ++c;
        },
        stylePadding: function () {
            return this.config.indent ? { 'padding-left': this.count * this.config.indentNum + 'px' } : '';
        },
        activeCodes() {
            return this.activeCode()
        }
    },

    methods: {
        onClick(item) {
            item.parentArr = [...this.level, item.code];
            this.eventBus.$emit('click', item)
        }
    }
}

</script>

<style lang="scss" scoped>
.tlm-c-title {
    height: 50px;
    font-size: 15px;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        cursor: pointer;
        background: #fff;
    }

    &.active {
        background: #fff;
    }

    i {
        font-size: 15px;
        font-weight: bold;
    }
}
</style>
<template>
    <div :class="[prefixClass, type,]" :style="setStyle" @click="$_click"></div>
</template>

<script>
/**  
 * 图标组件  
 * @description 用于展示 icon。该组件的 icon 图形基于 Webfont，因此可任意放大、改变颜色。  
 * @property {String} prefix-class 自定义字体图标库前缀 - 默认cmd-icon  
 * @property {String} type 图标图案类型 - 列如：home、add  
 * @property {String} color 图标颜色 - 默认白色  
 * @property {Number} size 图标大小 - 默认24，单位px  
 * @event {Function} click 图标组件点击事件  
 * @example <cmd-icon type="bell" size="30" color="#654321"></cmd-icon>  
 */
import "./iconfont.css"
export default {
    name: 'cmd-icon',

    props: {
        /**
         * 自定义字体图标库前缀
         */

        prefixClass: {
            type: String,
            default: 'iconfont'
        },
        /**
         * 图标类型
         */
        type: String,
        /**
         * 图标颜色
         */
        color: {
            type: String,
            default: '#ffffff'
        },
        /**
         * 图标大小
         */
        size: {
            type: [Number, String],
            default: '14'
        }
    },

    computed: {
        setStyle() {
            return `color:${this.color}; font-size:${this.size}px;`
        }
    },

    methods: {
        $_click(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style>
</style>

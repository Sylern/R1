<template>
    <div v-if="isBg" :style="{ backgroundImage: `url(${srcVal})` }">
        <slot name="placeholder"></slot>
        <slot name="error"></slot>
        <slot></slot>
    </div>
    <el-image v-else :src="srcVal" :fit="fit" :alt="alt" :referre-policy="referrerPolicy" :lazy="lazy"
        :preview-src-list="previewSrcList" :z-index="zIndex" :scroll-container="scrollContainer"
        @load="$emit('load', $event)" @error="$emit('error', $event)">
        <template v-slot:placeholder>
            <slot name="placeholder"></slot>
        </template>
        <template v-slot:error>
            <slot name="error"></slot>
        </template>
        <slot></slot>
    </el-image>
</template>
<script>
import utils from '@/utils/utils';
import base from '@/api/base';
/** 
 * 使用说明： 扩展el-image组件，src自动添加http://res.decerp.cc前缀，其他所有属性与el-image相同
 * src              图片源，同原生
 * fit              确定图片如何适应容器框，同原生 object-fit fill / contain / cover / none / scale-down
 * alt              原生 alt
 * referrer-policy  原生 referrerPolicy
 * lazy             是否开启懒加载
 * scroll-container 开启懒加载后，监听 scroll 事件的容器
 * preview-src-list 开启图片预览功能
 * z-index          设置图片预览的 z-index
 *  
*/
export default {
    props: {
        src: String,
        fit: String,
        alt: String,
        referrerPolicy: String,
        lazy: {
            type: Boolean,
            default: false
        },
        previewSrcList: Array,
        zIndex: {
            type: Number,
            defalut: 2000
        },
        scrollContainer: String,
        isBg: Boolean
    },
    computed: {
        srcVal() {
            return this.$app.fmtImg(this.src)
        }
    },
}
</script>
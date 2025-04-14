<template>
  <img class="img" :src="src" v-if="!isBg" />
  <div class="imgWrap" v-else :style="{ backgroundImage: `url(${$app.fmtImg(imgsrc)})` }">
    <slot></slot>
  </div>
</template>
<script>
import base from '@/api/base';

export default {
  props: {
    imgsrc: {
      type: String,
      default: "",
    },
    isBg: {
      type: Boolean,
      default: false
    },
  },
}
</script>

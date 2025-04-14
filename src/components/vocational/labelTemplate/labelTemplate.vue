<!-- 自定义标签模板 -->
<template>
    <div class='template' :style="{transform: 'scale('+scale+')'}">
        <div class="drawing-board" id="drag--id" :style="{backgroundImage: 'url('+ labelImgurl +')', 'background-size': 'auto 100%', 'background-repeat':  'no-repeat','background-position': 'center' , height: height + 'px', width: width+'px'}">
            <span v-for="(pricesItem) in item.pricesTagItems" :key="pricesItem.uuid" v-show="pricesItem.isEnable" :style="{left: pricesItem.left + 'px', top: pricesItem.top + 'px'}" class="item-box">
                <!-- 条形码模块 start -->
                <div v-if="pricesItem.itemType === 4">
                    <div class="style" v-if="pricesItem.barCodeDisplayType === 1||pricesItem.displayType === 1">
                        <div class="font-small">22563</div>
                    </div>
                    <div class="style" v-if="pricesItem.barCodeDisplayType === 2||pricesItem.displayType === 2" :style="`width: ${pricesItem.barCodeWidth*1.625}px;`">
                        <div class="bar-code" :style="`width: ${pricesItem.barCodeWidth*1.625}px;height: ${pricesItem.barCodeHeight*1.625}px;`"></div>
                    </div>
                    <div class="style" v-if="pricesItem.barCodeDisplayType === 3||pricesItem.displayType === 3" :style="`width: ${pricesItem.barCodeWidth*1.625}px;`">
                        <div class="bar-code" :style="`width: ${pricesItem.barCodeWidth*1.625}px;height: ${pricesItem.barCodeHeight*1.625}px;`"></div>
                        <div class="font-small">22563</div>
                    </div>
                </div>
                <!-- 条形码模块 end -->
                <!-- 两行样式 start -->
                <div v-else-if="pricesItem.itemType === 5||pricesItem.itemType === 2">
                    <div v-if="pricesItem.name==='生产日期'">
                        <span :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" :style="{'font-size': getFontSize(pricesItem) + 'px'}">{{pricesItem.title}}</span>
                    </div>
                    <div v-else>
                        <div class="style min-flex min-flex-dir-top" :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" v-if="pricesItem.displayStyle*1 === 1">
                            <div :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</div>
                        </div>
                        <div class="style min-flex min-flex-dir-top" :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" v-if="pricesItem.displayStyle*1 === 2">
                            <div :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</div>
                        </div>
                        <div class="style" :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" v-if="pricesItem.displayStyle*1 === 3">
                            <span :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</span>
                        </div>
                    </div>
                </div>
                <!-- 两行样式 end -->
                <div v-else-if="pricesItem.itemType === 6">
                    <div class="style min-flex min-flex-dir-top" v-if="pricesItem.displayStyle*1 === 1">
                        <div :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</div>
                    </div>
                    <div class="style min-flex min-flex-dir-top" v-if="pricesItem.displayStyle*1 === 2">
                        <div :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</div>
                    </div>
                    <div class="style" v-if="pricesItem.displayStyle*1 === 3">
                        <span :style="{'font-size': getFontSize(pricesItem) + 'px'}">xx.xxx</span>
                    </div>
                </div>
                <!-- 洗涤样式 start -->
                <div v-else-if="pricesItem.itemType === 12">
                    <div class="style min-flex min-flex-dir-top" v-if="pricesItem.washingMethodDisplayType === 1" :style="`width: ${pricesItem.barCodeWidth*1.625}px;`">
                        <div class="wash-icon-bg" :style="`background-image: url('${pricesItem.data.iconUrl}');`"></div>
                    </div>
                    <div class="style" v-else-if="pricesItem.washingMethodDisplayType === 2" :style="`width: ${pricesItem.barCodeWidth*1.625}px;`">
                        <div class="wash-icon-bg" :style="`background-image: url('${pricesItem.data.iconUrl}');`"></div>
                        <div :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" :style="{'font-size': pricesItem.fontSize*2 + 'px','color':'#616161'}" class="font-small">{{pricesItem.title}}</div>
                    </div>
                </div>
                <!-- 基本样式 start -->
                <span v-else :class="{'item-bold': pricesItem.b, 'item-underline': pricesItem.u}" :style="{'font-size': getFontSize(pricesItem) + 'px'}">{{pricesItem.title}}</span>
            </span>
        </div>
    </div>
</template>

<script src="./labelTemplate.js"></script>
<style lang='scss' scoped>
@import './labelTemplate.scss';
</style>

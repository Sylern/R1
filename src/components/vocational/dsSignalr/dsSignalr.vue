<!--优惠券列表弹窗-->
<template>
    <div class="dsSignalr">
        <audio ref="myAudio" hidden></audio>
        <div class="msgBox" v-show="msgList.length>0">
            <!-- <el-button @click="handleAdd">+</el-button> -->
            <transition-group name="list" tag="p">
                <div class="msg_item" v-for="(item, index) in msgList" :key="item.traceId" @click="handleToOnline(item, index)" @mouseenter="handleMouseenter(item)" @mouseleave="handleMouseleave(item)">
                    <div class="msg_head">
                        <el-tag size="small" class="msg_tag">{{item.tag}}</el-tag>
                        <span class="msg_title">{{item.title}}</span>
                    </div>
                    <div cclass="msg_time">{{item.time}}</div>
                    <div class="close_btn">
                        <span></span>
                        <i class="el-icon-error" @click.stop="handleClose"></i>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
@import './dsSignalr.scss';
</style>

<script src="./dsSignalr.js"></script>
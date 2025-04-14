<template>
    <el-dialog class="system_dialog" :visible="show" :close-on-click-modal="false" :width="width" @close="onClose">
        <div slot="title" :class="search?'title-search':'title'" class="queryTable">
            <div class="content">{{title}}</div>
            <div class="searchInput" v-if="search">
                <el-input v-model.trim="keywords" suffix-icon="el-icon-search" clearable placeholder="输入关键字搜索" @keyup.enter.native="$emit('search',keywords)"></el-input>
            </div>
        </div>
        <div class="dlg-content" ref="content">
            <div class="left" :style="{height:contentHeight+'px'}" v-if="slots.nav">
                <el-scrollbar style="height:100%;width:100%">
                    <slot name="nav"></slot>
                </el-scrollbar>
            </div>
            <div class="right">
                <div class="queryFilter" v-if="slots.condition">
                    <slot name="condition"></slot>
                </div>
                
                <div class="queryFrom queryTable form" v-if="slots.default">
                    <slot></slot>
                </div>
            </div>
        </div>

        <div slot="footer" class="footer">
            <div class="left">
                <slot name="footer"></slot>
            </div>
            <div class="right" v-if="cancelTxt || confirmTxt">
                <div class="btnItem btnBasic" v-if="cancelTxt" @click="$emit('cancel');onClose()">{{cancelTxt}}</div>
                <div class="btnItem btnPrimary" v-if="confirmTxt" @click="$emit('confirm')">{{confirmTxt}}</div>
            </div>
        </div>
     
    </el-dialog>
</template>

<script>

/** 
 * 使用说明： 
 * title            弹窗标题
 * show             显示隐藏弹窗
 * search           是否显示搜索栏
 * width            弹窗宽度
 * confirmTxt       确定按钮文字，默认空，则不显示确定按钮
 * cancelTxt        取消按钮文字，默认空，则不显示取消按钮
 * 
 * <slots name="nav"></slots>     左边导航栏插槽
 * <slots></slots>                弹窗内容插槽
 * <slots name="footer"></slots>  弹窗脚本插槽
*/
export default {
    props:{
        title:String,
        show:Boolean,
        search:Boolean,
        width:{
            type:String,
            default:'50%'
        },
        confirmTxt:{
            type:String,
            default:'确定'
        },
        cancelTxt:String,
    },
    data(){
        return{
            slots:{},
            contentHeight:100,
            keywords:''
        }
    },
    mounted(){
        this.slots = this.$scopedSlots
        // this.$nextTick(()=>{
           let time =  setInterval(()=>{
               let content = this.$refs.content;
               if(content){
                   clearInterval(time)
                   this.contentHeight = content.offsetHeight
               }
               
           },300)
        // })
    },
    methods:{
        onClose(){
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>
.system_dialog >>> .el-dialog__header{
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #efeaea;
    padding: 6px 10px;
}
.system_dialog >>> .el-dialog__footer{
    padding: 6px;
}
.system_dialog >>> .cs_table{
    border: 0;
}
</style>
<style lang="scss" scoped>
.system_dialog{
    .title,.title-search{
        width: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        .content{
            height: 100%;
            line-height: 38rx;
            font-size: 17rx;
            color:#303133;
        }
    }
    .title-search{
        justify-content: space-between;
    }
    .dlg-content{
        display: flex;
        justify-content: space-between;
        background: #f7f8fa;
        border-radius: 0px 0px 9px 9px;
        overflow: hidden;
        .left{
            min-width: 200px;
            width: 200px;
            border-right: 1px solid #e6e6e6;
        }
        .right{
            flex: 1;
            display: flex;
            flex-direction: column;
            .queryFilter{
                background:#f7f8fa;
                border: 4rx solid white;
                box-sizing: border-box;
                padding: 8rx;
            }
            .queryFilter ~ .queryFrom{
                padding-top: 0;
            }
            .queryFrom{
                box-sizing: border-box;
                background: white;
                padding: 4rx 4rx 0rx 4rx;
            }
        }
    }
    .footer{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .left{
            flex: 1;
            display: flex;
            justify-content: flex-start;
        }
        .right{
            .btnBasic{
                margin-right: 10rx;
            }
        }
    }
}
</style>
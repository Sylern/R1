
<template>
    <dc-dialog :title="title" v-if="dialogVisible" width="960" height="555" zIndex="2500" class="system_dialog" @close="closeDialog">
        <div class="checkedCardBg_main borderTop">
            <div class="scrollbar">
                <el-scrollbar ref="checkedCardBg_m_scrollbar" style="width:100%;height:100%">
                    <div class="scc_item">
                        <el-tooltip class="item" effect="light" content="点击选择" placement="top-start" v-for="item in imgList" :key="item.id">
                            <div class="scc_dd" @click="handleActiveImg(item.picUrl)"><img class="img" :src="item.picUrl"></div>
                        </el-tooltip>
                        <ImportImg @callback="e=>{handleActiveImg(e[0])}" :typeEntity="typeEntity" :verifyJson="{fileNumber: 1, photoExt: ['.jpg', '.png','.jpeg'], fileSize: 5100}"></ImportImg>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </dc-dialog>
</template>

<style lang="scss" scoped>
@import './checkedCardBg.scss';
</style>
<style lang="scss">
.checkedCardBg_main {
    .ImportImg-wrap {
        .uploadImgBtn {
            width: 215px;
            height: 130px;
            line-height: 150px;

            .el-icon-plus {
                font-size: 40px;
            }
        }
        .showImg {
            width: 215px;
            height: 130px;
            margin: 0;

            i {
                top: -7px;
                right: -10px;
                font-size: 20px;
            }
        }
    }
}
</style>
<script src="./checkedCardBg.js"></script>

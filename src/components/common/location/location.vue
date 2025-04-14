
<template>
    <div class="location-wrap">
        <el-dialog class="system_dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" :title="locationEntity.title" append-to-body center>
            <div class="dialog-content borderTop">
                <div class="locationInput queryTable">
                    <div class="searchInput">
                        <el-input v-model="keywords" clearable placeholder="输入地址搜索" @keyup.enter.native="handleMarker">
                            <i @click="handleMarker" slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                </div>
                <div class="Map" id="map"></div>
            </div>
            <span slot="footer">
                <div @click="handleSubmit" class="btnItem btnPrimary" style="margin-right: 18px;">确定</div>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import './location.scss';
</style>
<style lang="scss">
.locationInput .searchInput .el-input__inner {
    background: #fff;
    border: 1px solid #d3d3d3;
}
.dialog-content {
    .Map {
        a {
            img {
                display: none;
            }
        }
    }
}
</style>
<script src="./location.js"></script>

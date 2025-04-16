<template>
    <div class="multiPage">
        <div class="mt_center">
            <div class="title">
                <el-scrollbar ref="breadcrumbScorll" style="width: 100%; height: 100%">
                    <div class="breadcrumb">
                        <div class="breadcrumbList">
                            <div class="breadcrumb_item" :class="{ selected: item.url === $route.path }" v-for="(item, index) in breadcrumb" @click="handleBreadcrumb(item, index)" :key="index">
                                <div class="itemContent">
                                    <div class="pageName">{{item.name}}</div>
                                    <div class="closeWrap" @click.stop="handleClosePage(index)" v-if="breadcrumb.length > 1">
                                        <i class="el-icon-close"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="mt_center_content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import './multiPage.scss';
</style>
<script src="./multiPage.js"></script>
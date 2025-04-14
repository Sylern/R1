<template>
    <div class="ImportImg-wrap">
        <template v-if="isTakePhoto">
            <div class="takePhotoModel" :style="{ width: width + 'px', height: height + 'px'}">
                <div v-for="(item, index) in uploadImage" :key="index" :class="{ disabled: disabled, moreImg: verifyJson.fileNumber > 1 }" class="takeImg">
                    <el-popover placement="right" width="400" :trigger="verifyJson.viewElement">
                        <template class="box" v-if="typeEntity.type === 'CommonVideo'">
                            <video slot="reference" :src="item" class="img"></video>
                            <video :src="item"></video>
                        </template>
                        <template class="box" v-else>
                            <img class="img" slot="reference" :src="item" />
                            <img class="img" :src="item" />
                        </template>
                    </el-popover>
                    <div class="iconImg">
                        <label></label>
                        <i v-if="!disabled" @click="handleDeleteImg(item)" class="el-icon-error"> </i>
                    </div>
                </div>
                <div class="defaultImg" v-if="uploadImage.length < verifyJson.fileNumber">
                    <cmd-icon type="icon-headDefault" size="140" color="#ffffff"></cmd-icon>
                </div>
                <div class="controlBtn" v-if="uploadImage.length < verifyJson.fileNumber">
                    <div class="btn" @click="handleShowTakePhoto">拍照</div>
                    <div class="btn" @click="handleUpload">上传图片</div>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-for="(item, index) in uploadImage" :key="index" :class="{ disabled: disabled, moreImg: verifyJson.fileNumber > 1 }" :style="{ width: width + 'px', height: height + 'px'}" class="showImg">
                <el-popover placement="right" width="400" :trigger="verifyJson.viewElement">
                    <template class="box" v-if="typeEntity.type === 'CommonVideo'">
                        <video slot="reference" :src="item" class="img"></video>
                        <video :src="item"></video>
                    </template>
                    <template class="box" v-else>
                        <img class="img" slot="reference" :src="item" />
                        <img class="img" :src="item" />
                    </template>
                </el-popover>
                <div class="iconImg">
                    <label></label>
                    <i v-if="!disabled" @click="handleDeleteImg(item)" class="el-icon-error"> </i>
                </div>
            </div>
            <div @click="handleUpload" class="uploadImgBtn" :style="{ width: width + 'px', height: height + 'px'}" v-if="uploadImage.length < verifyJson.fileNumber && !isTakePhoto">
                <i class="el-icon-plus"></i>
                <span v-if="uploadText" class="uploadText">{{ uploadText }}</span>
            </div>
        </template>
        <input :disabled="disabled" @change="handleFile" ref="fileUpload" class="file" type="file" />
        <!-- 拍照 -->
        <take-photo :visible.sync="takePhotoShow" @submit="handleTakePhoto"></take-photo>
    </div>
</template>

<style lang="sass" scoped>
@import "./ImportImg.scss"
</style>
<script src="./ImportImg.js"></script>

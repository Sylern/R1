
<template>
    <dc-dialog title="人脸信息录入" v-if="dialogVisible" width="480" height="600" zIndex="100" class="system_dialog" @close="closeDialog">
        <div class="takePhoto_main">
            <div class="subTitle">
                <span class="tips">为保证人脸录入质量，请确保光线充足，以免影响识别精度。</span>
            </div>
            <div class="photoWrap">
                <div class="photoContent">
                    <img class="imgWrap" v-if="imgSrc" :src="imgSrc" />
                    <video v-show="$app.isNull(imgSrc)" id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
                    <canvas id="canvasCamera" class="canvas" :width="videoWidth" :height="videoHeight" hidden></canvas>
                    <div class="imgWrap">
                        <img class="img" :src="$store.state.base.frontImgBase + '/images/base/takePhotoUser.png'" />
                    </div>
                </div>
            </div>
            <div class="btnWrap">
                <div class="btn" @click="drawImage">{{ $app.isNull(imgSrc) ? '拍照' : '重拍'}}</div>
                <div class="btn" :class="{ disabled: $app.isNull(imgSrc) }" @click="handleUpload">确认上传</div>
            </div>
        </div>
    </dc-dialog>
</template>

<style lang="scss" scoped>
@import './takePhoto.scss';
</style>
<script src="./takePhoto.js"></script>

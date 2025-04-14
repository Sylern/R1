<template>
	<div class="ImportFile-wrap">
		<el-upload :disabled="disabled" :class="{ disabled: disabled }" class="upload-file" :file-list="fileList" :before-upload="handleBeforeUpload" :on-success="onSuccess" :on-error="onError" :on-remove="onRemove" drag :action="actionUrl">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">{{ tipText }}</div>
		</el-upload>
	</div>
</template>

<style lang="scss" scope>
@import './ImportFile.scss';
</style>
<script src="./ImportFile.js"></script>

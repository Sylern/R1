<template>
	<el-dialog title="选择模板" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialogVisible" width="980px" center class="system_dialog">
		<div class="labelTemplateList borderTop">
			<el-scrollbar style="height: 100%; width: 100%">
				<div class="section">
					<div v-for="item in templateData" :key="item.templateId" class="label-list-item" @click="handleTemplate(item)">
						<div class="template-content">
							<div class="template-view">
								<labelTemplate :item="item" name="labelView" />
							</div>
							<div class="template-name">
								<div class="label-list-name-ellipsis" :title="item.templateName">{{ item.templateName }}</div>
								<span :class="`custom ${item.isCustom && 'user'}`">{{ item.isCustom ? '自定义' : '系统' }}</span>
							</div>
							<div class="template-info">
								<span>{{ item.width }}*{{ item.height }} mm</span>
								<span>{{ item.createTime }}</span>
							</div>
						</div>
					</div>
					<div @click="handleAdd" class="labelAdd">
						<i class="el-icon-plus"></i>
					</div>
				</div>
			</el-scrollbar>
			<!-- <LabelTemplateBox v-for="(item, index) in labelItemList" :key="index" :index="index" :item="item" @change="handleChange" /> -->
		</div>
	</el-dialog>
</template>
<style lang="sass" scoped>
@import "./labelTemplateList.scss"
</style>
<script src="./labelTemplateList.js"></script>

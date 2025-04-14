<template>
	<div class="cell" :class="{ fixed: fixed }" :style="cellCss" :data-prop="prop">
        <!-- <runtime-template :template="dataItem.render && dataItem.render(dataItem)"></runtime-template> -->
		<slot></slot>
		<span v-if="isTitle" >{{ label }}</span>
	</div>
</template>

<style lang="sass" scoped>
@import "./cell.scss"
</style>
<script src="./cell.js"></script>

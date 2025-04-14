
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import LabelTemplate from '../labelTemplate/labelTemplate.vue';
import { stockApi } from '@/api/index.js';

export default {
	components: {
		LabelTemplate: LabelTemplate
	},
	props: {
		item: {
			type: Object,
			default: () => { return {} }
		}
	},
	methods: {
		dateFormat(date) {                                       // 处理时间格式
			return this.$app.currentTime(new Date(date), 'yyyy-MM-dd HH:mm')
		},
		handleToEdit(item) {
			this.$emit('handleAdd');
			this.$route.query.tagId = item.templateId;
		},
		handleToDefault(item) {
			stockApi.updateCustemPriceTagTemplateDefault({tmpl_id: item.templateId}).then(res => {
				this.$message.success('设置成功')
				this.$emit('getTemplateByUser');
			})
		},
		clonTemplate(data) {
			let template = { ...data }
			template.isCustom = true
			const params = JSON.parse(JSON.stringify(template))
			delete params.templateId
			delete params.createTime
			for (var key in params) { // 循环要复制的数据，把第一个属性字母大写
				if (params[key]) {
					if (key === 'pricesTagItems') { // 如果是对象的数据，把第一个属性字母大写
						params[key].map(item => {
							for (var ckey in item) {
								item[ckey.substring(0, 1).toUpperCase() + ckey.substring(1)] = item[ckey]
								delete item[ckey] // 删除小写数据  提交时就不会连小写的一起提交
							}
							// params[key].push(item)
						})
					}
					params[key.substring(0, 1).toUpperCase() + key.substring(1)] = params[key]
					delete params[key]
				}
			}
			stockApi.addTemplate(params).then(res => {
				this.$message.success('复制成功')
				this.$emit('getTemplateByUser');
			})
		},
		deleteTemplate(data) {     // 删除模板
			this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const params = `tmpl_id=${data.templateId}`
				stockApi.deleteTemplate(params).then(res => {
					this.$message.success('删除成功')
					this.$emit('getTemplateByUser');
				})
			}).catch(() => {
				this.$message.info('已取消删除')
			})
		}
	}
}

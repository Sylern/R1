
import { labelTemplateBox } from '@/components/index';
import { stockApi } from '@/api/index.js';

export default {
    components: {
        LabelTemplateBox: labelTemplateBox
    },
    data() {
        return {
            labelTemplates: [],
        }
    },
    created() {
        this.getQueryVariable()
        this.getTemplateByUser()
        if (this.$route.query.isAdd) {
            this.handleAdd(true);
        }
    },
    methods: {
        handleAdd(isAdd = false) {                   // 跳转到模板编辑页
            this.$emit('handleSetting', '标签模版编辑');
            isAdd && (this.$route.query.tagId = '');
        },
        getQueryVariable() {            // 判断url传参做页面重定向 跳转新增标签页
            if (this.$route.query.addtem === 'yes') {
                this.handleAdd();
            }
        },
        getTemplateByUser() {
            stockApi.getTemplateByUser().then(res => {
                if (this.$app.isNull(res)) return
                this.labelTemplates = []
                // 筛选掉非本行业的系统模板
                let userInfo = localStorage.getItem('user_Info') ? JSON.parse(localStorage.getItem('user_Info')) : '';
                res = res.filter(e => e.isCustom || e.industryIds.indexOf(userInfo.sv_us_industrytype) > -1);
                this.labelTemplates = res.map(item => {
                    item.pricesTagItems = item.pricesTagItems.map(val => {
                        switch (val.fontStyle) {
                            case 0:
                                val.b = false
                                val.u = false
                                break
                            case 1:
                                val.b = true
                                val.u = false
                                break
                            case 4:
                                val.u = true
                                val.b = false
                                break
                            case 5:
                                val.b = true
                                val.u = true
                                break
                        }
                        val.itemType = val.priceTagItemType
                        val.barCodeWidth = val.barCodeWidth === 2 ? 212 : 141
                        return val
                    })
                    return item;
                })
            })
        },
    }
}

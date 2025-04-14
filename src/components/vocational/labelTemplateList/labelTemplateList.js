

import labelTemplate from '../labelTemplate/labelTemplate.vue';
import { stockApi } from '@/api/index';

export default {
    components: { labelTemplate },
    props: {
        visible: { type: Boolean, default: false },
    },
    data() {
        return {
            templateData: []                            // 模板数据集合
        }
    },
    computed: { dialogVisible: { get() { return this.visible; }, set(value) { this.$emit('update:visible', value); } }, },
    mounted() {
        this.getTemplateByUser();
    },
    methods: {
        getTemplateByUser() {                           // 获取店铺的模板与系统默认模板
            stockApi.getTemplateByUser().then(res => {
                if (res) {
                    // 筛选掉非本行业的系统模板
                    res = res.filter(e => e.isCustom || e.industryIds.indexOf(this.$store.state.userInfo.sv_us_industrytype) > -1);
                    this.templateData = res.map(e => {
                        e.pricesTagItems = this.$app.isNull(e.pricesTagItems) ? [] : e.pricesTagItems.map(e => {
                            switch (e.fontStyle) {
                                case 0: e.b = false; e.u = false; break
                                case 1: e.b = true; e.u = false; break
                                case 4: e.u = true; e.b = false; break
                                case 5: e.b = true; e.u = true; break
                            }
                            return { ...e, itemType: e.priceTagItemType, barCodeWidth: e.barCodeWidth === 2 ? 212 : e.barCodeWidth === 1 ? 141 : e.barCodeWidth }
                        });
                        return { ...e, createTime: this.$app.currentTime(new Date(e.createTime), 'yyyy-MM-dd HH:mm') }
                    });
                }
            });
        },
        handleTemplate(item) {                          // 选中模板
            this.$emit('callback', item);
            this.dialogVisible = false;
        },
        handleAdd() {
            //
            // this.$store.commit('update', { key: 'pageNestingUrl', data: '/vueview/priceTag/priceTag.html?addtem=yes' });
            if (this.$app.isVueView()) {
                window.parent.location.href = '/System/comsetpage_N3?url=/vueview/priceTag/priceTag.html?addtem=yes';
                return
            }
            // this.$router.push({ path: '/cashier/pageNesting', query: { iframeUrl: encodeURIComponent('/vueview/priceTag/priceTag.html?addtem=yes') } });
            this.$router.push({
                path: '/cashier/setting',
                query: {
                    settingTitle: '标签打印模版设置',
                    isAdd: true
                }
            })
            return

        }
    }
}

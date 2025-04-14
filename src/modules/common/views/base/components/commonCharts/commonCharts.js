import base from '@/api/base';
import { basicApi } from "@/api/index.js";

export default {
    props: {
        visible: { type: Boolean, default: () => { return false } },
        chartsList: { type: Array, default: () => { return [] } },              // enable:是否启用 type: B-销售分析 C1-店铺业绩 C2-支付方式 C3-员工销售排行 C4-支出分析 E-会员构成 F-会员消费排行榜 G-热销商品排行榜
    },
    data() {
        return {
            checked: [],
            option: [],
        }
    },
    computed: {
        isShow: {
            get() {
                return this.visible;
            },
            set(e) {
                this.$emit('updata', e, 'selectChartWrap')
            }
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        handleItemName(type) {              // 获取图表标题
            let obj = {
                B: '销售分析',
                C1: '店铺业绩',
                C2: '支付方式',
                C3: '员工销售排行',
                C4: '支出分析',
                E: '会员构成',
                F: '会员消费排行榜',
                G: '热销商品排行'
            }
            return obj[type]
        },
        handleItemImg(type) {               // 获取图表图片
            let obj = {
                B: base.frontImgBase + '/images/system/group7.png',
                C1: base.frontImgBase + '/images/system/group8.png',
                C2: base.frontImgBase + '/images/system/group8.png',
                C3: base.frontImgBase + '/images/system/group7.png',
                C4: base.frontImgBase + '/images/system/group7.png',
                E: base.frontImgBase + '/images/system/group8.png',
                F: base.frontImgBase + '/images/system/group7.png',
                G: base.frontImgBase + '/images/system/group7.png'
            }
            return obj[type]
        },
        setShopHomeChartConfig() {          // 设置门店首页图表配置
            basicApi.setShopHomeChartConfig({ config: this.chartsList }).then(res => {
                res ? this.$message({ type: 'success', message: '设置成功' }) : this.$message.error('设置失败');
            })
        }
    }
}
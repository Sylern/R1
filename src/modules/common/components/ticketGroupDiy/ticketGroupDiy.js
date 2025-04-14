import base from '@/api/base';
import { ImportImg } from '@/components/index.js'
export default {
    // import引入的组件需要注入到对象中才能使用
    components: {
        ImportImg: ImportImg
    },
    props: [
        'ticket',
        'item',
        'ticketSizeActive'
    ],
    data() {
        // 这里存放数据
        return {
            stroeLogo210: {},
            stroeName210: {},
            pageSubtotal: false,
            pageTotalUpper: false,
            pageTotal: false,
            pageNum: false,
            pagePhone: false,
            pageAddress: false,
            pageRemarks: false,
            patternPrinting: true,     // 套打开关
            typeEntity: { type: 'CommonImg', data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'Product', isCompress: true } },
        }
    },
    // 监听属性 类似于data概念
    watch: {
        ticketSizeActive: {
            handler: 'hanlderStyle',
            deep: true
        }
    },
    created() {
        this.stroeLogo210 = this.$app.isNull(this.ticket.ticketItemGroups210) ? {} : this.ticket.ticketItemGroups210.find(item => item.groupName === '基本信息').items.find(item => item.name === '店铺LOGO');
        this.stroeName210 = this.$app.isNull(this.ticket.ticketItemGroups210) ? {} : this.ticket.ticketItemGroups210.find(item => item.groupName === '基本信息').items.find(item => item.name === '店铺名称');
    },
    mounted() {
        this.patternPrinting = this.ticket.pageType !== null
    },
    // 监控data中的数据变化
    methods: {
        handlePattern(e) {
            if (!e) {
                this.ticket.pageType = null
                this.ticket.pageNumberType = null
                this.stroeName210.style210 = null
            } else {
                this.ticket.pageType = '1'
                this.ticket.pageNumberType = 'TopRight'
                if (this.stroeName210.checked) {
                    this.stroeName210.style210 = '2'
                }
            }
        },
        removeImg(url) {
        },
        diyStyleToggle(group) {
            let isShow = false
            group.items.forEach(item => {
                if (!isShow) {
                    if (item.diy) {
                        if (item.checked) {
                            isShow = true
                        }
                    }
                }
            })
            return isShow
        },
        resourceChange(option, isSelected) {
            if (!isSelected) {
                option.data = null
                option.resource = false
            }
            if (option.name === '店铺LOGO') {
                if (!isSelected) {
                    this.stroeName210.style210 = null
                } else {
                    if (this.stroeName210.checked) {
                        this.stroeName210.style210 = '2'
                    }
                }
            }
            this.$forceUpdate();
        },
        hasChecked(name, list) {
            if (name === '客户信息' || name === '签名信息' || name === '换货信息' || name === '退货信息') {
                return false
            } else if (name === '基本信息') {
                return true
            } else {
                let isDiy = false
                list.items.forEach(v => {
                    if (v.checked) {
                        if (v.name === '店铺LOGO' || v.name === '店铺名称' || v.name === '店铺电话' || v.name === '店铺地址' || v.name === '店铺公告' || v.name === '自定义文字' || v.name === '自定义图片' || (v.name === '数量' && this.ticketSizeActive !== 210)) {
                            isDiy = true
                        }
                    }
                })
                return isDiy
            }
        },
        hanlderStyle(val) {
        },
        callbackImportImg(obj) {                            // 图片上传组件回调
            let { value, item, index } = obj;
            this.item.items[index].data = this.$app.isNull(value) ? '' : value[0];
        },
    }
}

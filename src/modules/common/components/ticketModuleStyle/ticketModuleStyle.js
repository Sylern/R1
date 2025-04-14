import base from '@/api/base';
export default {
    // import引入的组件需要注入到对象中才能使用
    components: {},
    props: [
        'optionSelected',
        'activeItem',
        'isView',
        'handleItemType',
        'ticketSizeActive',
        'templateName',
        'width',
        'saveTemplate'
    ],
    data() {
        // 这里存放数据
        return {
            goodsOption: [], // 勾选的商品信息
            goodsTable: [], // 商品信息除去编码、合计（小票58/76/80表头没有编码合计: |商品|数量|单价|）
            stroeName: {}, // 210店铺名称
            stroeLogo210: {}, // 210店铺logo
            ticketType: {}, // 210单据类型
            showUnit: false, // 是否显示单位
            showPageSubTotal: false // 是否显示页小计
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        optionSelected: {
            handler: 'getCheckedGoods',
            deep: true
        }
    },
    created() {
        this.getCheckedGoods(this.optionSelected)
    },
    // 方法集合
    methods: {
        getCheckedGoods(val) {
            this.goodsOption = val.filter(item => item.groupName === '商品信息')[0].items.filter(item => item.checked)
            this.goodsTable = val.filter(item => item.groupName === '商品信息')[0].items.filter(item => item.checked && item.name !== '编码' && item.name !== '合计')
            if (this.ticketSizeActive === 58) {
                this.goodsTable = this.goodsTable.filter(item => item.name !== '折扣')
            }
            // this.goodsTable = this.goodsTable.filter(item => item.groupName === '商品信息')
            this.stroeName = val.filter(item => item.groupName === '基本信息')[0].items.filter(item => item.name === '店铺名称')[0]
            this.stroeLogo210 = val.filter(item => item.groupName === '基本信息')[0].items.filter(item => item.name === '店铺LOGO')[0]
            this.ticketType = val.filter(item => item.groupName === '基本信息')[0].items.filter(item => item.name === '单据类型')[0]
            this.showUnit = val.filter(item => item.groupName === '商品信息')[0].items.filter(val => val.name === '数量')[0].showUnit
            if (val.filter(item => item.groupName === '每页底部打印').length > 0) {
                this.showPageSubTotal = val.filter(item => item.groupName === '每页底部打印')[0].items.filter(val => val.name === '小计')[0].checked
            }
        },
        colspan(item, isTotal = true) {
            let n = 0
            item.items.forEach(val => {
                if (isTotal) {
                    val.checked && n++
                } else {
                    if (val.name === '小计') {
                        n = val.checked ? 2 : 1
                        n++
                    } else if (val.name === '商品') {}
                }
            })
            n--
            return n
        },
        tableData(item) {
            const parr = item.items.filter(item => item.name !== '编码' && item.name !== '合计' && item.checked)
            return parr
        },
        filter(val, row) {
            const newRow = this.goodsOption.filter(item => item.name === val)
            return newRow[0]
        },
        isGroupName(name, list) {
            return list.groupName === name
        },
        isChecked(name, list) {
            let isChecked = false
            list.items.forEach(item => {
                if (item.name === name) {
                    isChecked = item.checked
                }
            })
            return isChecked
        },
        hasChecked(name, list) {
            if (name === '商品信息') {
                return true
            } else if (name === '客户信息' || name === '签名信息' || name === '换货信息' || name === '退货信息') {
                return false
            } else {
                let isDiy = false
                list.items.forEach(v => {
                    if (v.checked) {
                        if (v.name === '店铺LOGO' || v.name === '店铺名称' || v.name === '数量' || v.name === '店铺电话' || v.name === '店铺地址' || v.name === '店铺公告' || v.name === '自定义文字' || v.name === '自定义图片') {
                            isDiy = true
                        }
                    }
                })
                return isDiy
            }
        }
    }
}
import base from '@/api/base';
// import UploadImg1 from '@/components/UploadImg1'
import { ImportImg } from "@/components/index";
import { Message, Loading } from 'element-ui';
import { stockApi } from '@/api/index.js';
// import { guid, print } from '@/utils/utils'
import { mapState } from "vuex";
import { printLabel } from '@/utils/prin';

export default {
    name: 'LabelPrinting',
    components: { ImportImg },
    data() {
        return {
            imgBase: 'http:' + base.imgUrl,
            importImg: [],
            typeEntity: { type: 'CommonImg', fullpath: true, data: { userId: this.$store.state.userInfo.user_id, uploadFileType: 'productServe', isCompress: true } },       // 上传图片组件的初始参数
            itemList: [],
            activeItem: '',
            activeItemType: '',
            itemType1: {
                name: '',
                title: '',
                left: 10,
                top: 10,
                b: false,
                u: false,
                fontSize: 9,
                fontStyle: 0,
                displayModel: 1,
                dateTimeDisplayModel: 1,
                itemType: 1
            },
            form: {
                name: '',
                width: 80,
                height: 40,
                imgurl: null,
                industryIds: [],
                isCustom: true
            },
            basis: [],
            price: [],
            barcodes: [],
            laundryGuide: [],
            washList: [
                {
                    title: '不可水洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/5.png'
                },
                {
                    title: '30℃水洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/30%E2%84%83%E6%B0%B4%E6%B4%97.png'
                },
                {
                    title: '40℃水洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/40%E2%84%83%E6%B0%B4%E6%B4%97.png'
                },
                {
                    title: '50℃水洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/50%E2%84%83%E6%B0%B4%E6%B4%97.png'
                },
                {
                    title: '60℃水洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/60%E2%84%83%E6%B0%B4%E6%B4%97.png'
                },
                {
                    title: '不可吊晒',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E4%B8%8D%E5%8F%AF%E5%90%8A%E6%99%92.png'
                },
                {
                    title: '不可干洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E4%B8%8D%E5%8F%AF%E5%B9%B2%E6%B4%97.png'
                },
                {
                    title: '不可机洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E4%B8%8D%E5%8F%AF%E6%9C%BA%E6%B4%97.png'
                },
                {
                    title: '不可拧干',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E4%B8%8D%E5%8F%AF%E6%8B%A7%E5%B9%B2.png'
                },
                {
                    title: '不可漂白',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E4%B8%8D%E5%8F%AF%E6%BC%82%E7%99%BD.png'
                },
                {
                    title: '常规干洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E5%B8%B8%E8%A7%84%E5%B9%B2%E6%B4%97.png'
                },
                {
                    title: '明干',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E6%98%8E%E5%B9%B2.png'
                },
                {
                    title: '平摊干燥',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E5%B9%B3%E6%91%8A%E5%B9%B2%E7%87%A5.png'
                },
                {
                    title: '手洗',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E6%89%8B%E6%B4%97.png'
                },
                {
                    title: '蒸汽熨烫',
                    iconUrl: 'https://ros.decerp.cc/dev/%E6%B4%97%E6%B0%B4%E6%A0%87/%E6%9C%8D%E8%A3%85%E6%8A%A4%E7%90%86/%E8%92%B8%E6%B1%BD%E7%86%A8%E7%83%AB.png'
                }
            ],
            otherInfo: [],
            fontSizes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            value: '',
            radio: '',
            num: '',
            allTemplate: [],
            industrysName: [
                '通用行业',
                '餐饮美食',
                '商超零售',
                '丽人美业',
                '服装鞋帽',
                '3C数码',
                '汽车服务',
                '游乐场地',
                '生活服务',
                '母婴用品'
            ],
            printData: {},
            blod: false,
            underline: false
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isShoes() {
            return this.userInfo.sv_us_industrytype === 18
        },
        width() {
            return this.form.width * 96 / 25.4 * 2.647078
        },
        height() {
            return this.form.height * 96 / 25.4 * 2.647078
        },
        labelImgurl() {
            return this.form.imgurl !== null ? this.form.imgurl : ''
        }
    },
    created() {
        this.getByIndustry()
        if (this.$route.query.tagId) {
            this.form.templateId = this.$route.query.tagId
            this.getTemplateById()
        }
        if (localStorage.getItem('labelSize')) {
            const labelSize = JSON.parse(localStorage.getItem('labelSize'))
            this.form.width = labelSize.width
            this.form.height = labelSize.height
        }
        this.washList.map(item => {
            item.displayModel = 1
            item.fontSize = 12
            item.fontStyle = 0
            item.group = '洗涤方式'
            item.itemType = 12
            item.left = 10
            item.leftReverse = 0
            item.name = '洗涤方式'
            item.priceTagItemId = null
            item.templateId = null
            item.top = 10
            item.topReverse = 0
            item.washingMethodDisplayType = 2
        })
    },
    methods: {
        goBack() {
            if (this.$route.query.isAdd) {
                this.$router.back();
                return
            }
            this.$emit('handleSetting', '标签打印模版设置');
        },

        testPrint() { // 打印测试
            if (typeof Cef === 'undefined') return

            let temJson = {
                templateName: this.form.name,
                isCustom: this.form.isCustom,
                width: this.form.width,
                height: this.form.height,
                backgroundUrl: this.form.imgurl,
                pricesTagItems: this.itemList,
                industryIds: this.form.industryIds
            }
            printLabel({
                data: [{}],
                tem: temJson,
                printName: '',
                dir: '0',
                columnNum: 1,
                userInfo: {}
            });
            return
            let printData = {
                "Width": this.form.width,
                "Height": this.form.height,
                "DataList": []
            }

            printData.DataList = this.itemList.map(e => {
                return {
                    Filed: '',
                    Type: null,
                    X: 41,
                    Y: 3,
                    Width: 0,
                    Height: 0,
                    TextFont: 0,
                    Warp: false,
                    FontSize: e.fontSize,
                    FontStyle: e.fontStyle,
                    WarpWidth: 0,
                    Text: e.title
                }
            })
            console.log(printData);
            console.log(JSON.stringify(printData));
            Cef.PrintSupMarkLabel(JSON.stringify(printData), 0, '', '1', '1')
        },
        fontView(n) {
            return parseInt(440 / 40 / 2.82 * n)
        },
        callbackImportImgEdit(val) {
            this.importImg = val.map(e => this.imgBase + e);
            this.form.imgurl = this.imgBase + val[0];
        },
        getTemplateById() {
            const loadingInstance = Loading.service({
                text: '正在加载'
            })
            stockApi.getTemplateById({
                tmpl_id: this.form.templateId
            }).then(res => {
                res.pricesTagItems.map(item => {
                    item.itemType = item.priceTagItemType;
                    this.isShoes && (item.name = item.name === '商品条码' ? '款号' : item.name === '商品货号' ? '商品条码' : item.name);
                })
                this.printData = res
                this.itemList = res.pricesTagItems
                this.form.height = res.height
                this.form.isCustom = res.isCustom
                this.form.name = res.templateName
                this.form.width = res.width
                this.form.industryIds = res.industryIds
                this.form.imgurl = res.backgroundUrl
                this.form.imgurl !== null && this.importImg.push(this.form.imgurl);
                this.itemList.map(item => {
                    switch (item.fontStyle) {
                        case 0:
                            item.b = false
                            item.u = false
                            break
                        case 1:
                            item.b = true
                            item.u = false
                            break
                        case 4:
                            item.u = true
                            item.b = false
                            break
                        case 5:
                            item.b = true
                            item.u = true
                            break
                    }
                    for (var key in item) {
                        switch (key) {
                            case 'displayStyle':
                                item[key] = item[key] * 1
                                break
                            case 'barCodeWidth':
                                item[key] = item[key] === 2 ? 212 : item[key] === 1 ? 141 : item[key]
                                break
                            case 'priceTagItemId':
                                item.uuid = item[key]
                                delete item[key]
                                break
                            case 'memberLevels':
                                this.price.forEach(value => {
                                    if (value.name === '会员价') {
                                        item[key] = value.memberLevels
                                    }
                                })
                                break
                        }
                    }
                })
                loadingInstance.close()
            }).catch(() => {
                loadingInstance.close()
            })
        },
        fontChange() {
            this.itemType1.b = this.blod
            this.itemType1.u = this.underline
            if (this.blod || this.underline) {
                if (this.blod && this.underline) {
                    this.itemType1.fontStyle = 5
                } else if (this.blod) {
                    this.itemType1.fontStyle = 1
                } else if (this.underline) {
                    this.itemType1.fontStyle = 4
                }
            } else {
                this.itemType1.fontStyle = 0
            }
        },
        getByIndustry() {
            this.basis = []
            this.price = []
            this.barcodes = []
            this.otherInfo = []
            stockApi.getByIndustry({ newVersion: true }).then(res => {
                res = res.filter(item => item.isEnable)
                res.map(item => { item.itemType = item.priceTagItemType })
                res.forEach(item => {
                    if (item.group === '基础字段') {
                        this.basis.push(item)
                    }
                    if (item.group === '价格字段') {
                        this.price.push(item)
                    }
                    if (item.group === '条码/货号字段') {
                        this.isShoes && (item.name = item.name === '商品条码' ? '款号' : item.name === '商品货号' ? '商品条码' : item.name);
                        this.barcodes.push(item)
                    }
                    if (item.group === '洗涤方式') {
                        this.laundryGuide.push(item)
                    }
                    if (item.group === '其他信息') {
                        this.otherInfo.push(item)
                    }
                })
            })
        },
        handleItem(row) {
            row = JSON.parse(JSON.stringify(row))
            row.fontSize = 9 // 文字起始大小
            row.fontStyle = 0 // 文字起始样式
            let b = false
            let u = false
            switch (row.fontStyle) {
                case 1:
                    b = true
                    break
                case 4:
                    u = true
                    break
                case 5:
                    b = true
                    u = true
                    break
            }
            const o = {
                uuid: this.$app.getGuid(),
                name: row.name,
                title: row.title + ':',
                left: row.left,
                top: row.top,
                b: b,
                u: u,
                fontSize: row.fontSize,
                fontStyle: row.fontStyle,
                displayModel: 1,
                dateTimeDisplayModel: row.dateTimeDisplayModel,
                dateDisplayModel: row.dateDisplayModel,
                itemType: row.itemType,
                barCodeDisplayType: row.barCodeDisplayType,
                displayType: row.displayType,
                barCodeWidth: row.barCodeWidth === 2 ? 212 : 141,
                barCodeHeight: row.barCodeHeight,
                showUnit: row.showUnit,
                displayStyle: row.DisplayStyle || 1
            }
            if (row.memberLevels) {
                // const vip = {
                //   memberlevel_id: 0,
                //   sv_ml_name: '普通'
                // }
                // o.memberLevels = row.memberLevels
                // o.memberLevels.unshift(vip)
                o.seletedMemberLevelId = 0
                o.showUnit = true
            }
            if (row.iconUrl) {
                o.title = row.title
                o.fontSize = 12
                o.data = {
                    iconUrl: row.iconUrl
                }
                o.washingMethodDisplayType = row.washingMethodDisplayType
            }
            if (row.name === '日期') {
                o.displayModel = 2
            }
            if (row.name === '商品条码') {
                delete o.displayStyle
            }
            // if (row.name === '自定义文本') {
            //   o.title = ''
            // }
            this.itemList.push(o)
            this.itemType1 = o
            this.activeItem = o.uuid
            this.activeItemType = o.itemType
        },
        handleItemType(row) {
            this.activeItem = row.uuid
            this.activeItemType = row.itemType
            this.itemType1 = row
            this.blod = this.itemType1.b
            this.underline = this.itemType1.u
        },
        handleRemoveItem(row) {
            let index = -1
            this.itemList.forEach((item, idx) => {
                if (row.uuid === item.uuid) {
                    index = idx
                }
            })
            this.itemList.splice(index, 1)
            const o = this.itemList[this.itemList.length - 1]
            if (o) {
                this.activeItem = o.uuid
                this.activeItemType = o.itemType
            } else {
                this.activeItem = ''
                this.activeItemType = ''
            }
            this.itemType1 = o
        },
        saveTemplate() {
            const itemList = []
            this.itemList.forEach((value, index) => {
                const nvalue = {}
                if (value.name === '商品条码') {
                    if (value.barCodeDisplayType !== 1 && value.displayModel !== 1) {
                        value.fontSize = 9;
                    }
                }
                this.isShoes && (value.name = value.name === '款号' ? '商品条码' : value.name === '商品条码' ? '商品货号' : value.name);
                if (value.top < this.height) {
                    for (var key in value) {
                        switch (key) {
                            case 'priceTagItemId':
                                // 上传参数前删掉priceTagItemId，后端会另外生成
                                delete value.key
                                break
                            case 'uuid':
                                delete value.key
                                break
                            case 'memberLevels':
                                delete value.key
                                break
                            case 'iconUrl':
                                nvalue.Data = {
                                    Title: value.title,
                                    IconUrl: value.iconUrl
                                }
                                break
                            default:
                                nvalue[key.substring(0, 1).toUpperCase() + key.substring(1)] = value[key]
                        }
                    }

                    itemList.push(nvalue)
                }
            })
            let params = {
                TemplateName: this.form.name,
                IsCustom: this.form.isCustom,
                Width: this.form.width,
                Height: this.form.height,
                WidthPx: parseInt(this.form.width * 96 / 25.4),
                HeightPx: parseInt(this.form.height * 100 / 25.4),
                BackgroundUrl: this.form.imgurl,
                PricesTagItems: itemList,
                IndustryIds: this.form.industryIds
            }
            if (this.form.templateId) {
                params.TemplateId = this.form.templateId
                const loadingInstance = Loading.service({
                    text: '正在保存'
                })
                stockApi.updateTemplate(params).then(res => {
                    Message({
                        showClose: true,
                        message: '编辑成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        loadingInstance.close()
                        // this.$router.push('/')
                        this.$emit('handleSetting', '标签打印模版设置');
                    }, 1000)
                }).catch(() => {
                    loadingInstance.close()
                })
                return
            }
            const loadingInstance = Loading.service({
                text: '正在保存'
            })
            stockApi.addTemplate(params).then(res => {
                Message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                })
                const labelSize = {
                    width: this.form.width,
                    height: this.form.height
                }
                localStorage.setItem('labelSize', JSON.stringify(labelSize))
                setTimeout(() => {
                    loadingInstance.close()
                    // this.$router.push('/')
                    this.$emit('handleSetting', '标签打印模版设置');
                }, 1000)
            }).catch(() => {
                loadingInstance.close()
            })
        }
    }
}

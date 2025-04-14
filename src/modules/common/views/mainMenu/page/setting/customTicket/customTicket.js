
import { ticketModuleStyle, ticketGroupTab } from '../../../../../components/index.js';
import { mapState } from 'vuex'

export default {
    name: 'customTicket',
    components: { ticketModuleStyle, ticketGroupTab },
    data() {
        return {
            activeId: null,                 // 当前选中的小票模板
            ticketList: [],                 // 小票模板列表
            ticketSize: [],                 // 当前模板的规格列表 例：58 76 80
            ticketSizeActive: 0,            // 当前模板选中的规格
            itemType: {},                   // 当前模板数据
            activeItem: '所有',             // 选中的右侧配置项
            dialogTableVisible: false,      // 小票预览弹窗状态
            itemList: []                    // 数据项分组列表 
        }
    },
    computed: {
        ...mapState(['userInfo']),
        width() {                           // 小票左侧样式宽度  * 随规格变化
            return this.ticketSizeActive * 96 / 25.4 * 1.3333333
        }
    },
    created() {
        this.getCustomTemplates()           // 获取所有小票模板
    },
    methods: {
        getCustomTemplates() {              // 获取所有小票模板
            ticketApi.getCustomTemplates().then(res => {
                const row = this.$app.isNull(res) ? [] : res.map(e => { delete e.createTime, delete e.updateTime; return e })
                this.ticketList = this.userInfo.sv_us_industrytype ? row.filter(e => e.industryIds.indexOf(this.userInfo.sv_us_industrytype) !== -1) : [];
                if (this.ticketList.length > 0) {
                    this.activeId = this.ticketList[0].templateId;
                }
                if (this.ticketList.length < 1) return this.$message.warning('未找到小票模版配置')
                this.getTemplate();
            })
        },
        getTemplate() {                  // 整理当前选中模板数据
            let res = this.ticketList.find(e => e.templateId === this.activeId);
            this.activeId = res.templateId
            this.activeItem = '所有'
            this.ticketSize = []
            delete res.createTime
            delete res.updateTime
            if (res.ticketTemplateStyles) {               // 兼容新接口  新版接口ticketItemGroups/ticketItemGroups210同意成了ticketTemplateStyles
                res.ticketItemGroups = res.ticketTemplateStyles[0].ticketItemGroups;
                res.ticketItemGroups210 = res.ticketTemplateStyles[1].ticketItemGroups;
            }
            if (res.ticketItemGroups.length > 0) {
                res.ticketItemGroups.forEach(item => {
                    item.items.forEach(val => {
                        val.resource = val.data !== null;                           // 是否同步门店设置   店铺名称、电话、logo等
                        val.fontSize = val.fontSize === 0 ? 9 : val.fontSize;       // 如果没有设置字体大小，设置为默认值9
                    })
                })
                const sizeList = [58, 76, 80, 110];
                this.ticketSize.push(...sizeList);
                this.ticketSizeActive = 58;
            }
            if (res.ticketItemGroups210.length > 0) {
                res.ticketItemGroups210.forEach(item => {
                    item.items.forEach(val => {
                        val.resource = val.data !== null;                           // 是否同步门店设置   店铺名称、电话、logo等
                        val.fontSize = val.fontSize === 0 ? 9 : val.fontSize;       // 如果没有设置字体大小，设置为默认值9
                    })
                })
                this.ticketSize.push(210);
                this.ticketSizeActive = 210;
            }
            this.itemType = res;
            this.ticketSizeActive = this.itemType.width !== 0 ? this.itemType.width : this.ticketSizeActive === 210 ? 210 : 58;
            if (this.ticketSizeActive === 210) {
                this.itemList = this.itemType.ticketItemGroups210;
            } else {
                this.itemList = this.itemType.ticketItemGroups;
            }
            this.itemType.width = this.ticketSizeActive;
        },
        saveTemplate() {                    // 保存模板事件 整理数据
            let diyData = true;                 // 已勾选的自定义信息是否填写
            const params = this.itemType;
            params.width = this.ticketSizeActive;
            if (params.width === 210) {
                params.ticketItemGroups210.forEach(item => {
                    if (item.groupName === '基本信息' || item.groupName === '其他信息') {
                        item.items.forEach(val => {
                            if (val.name === '店铺名称' || val.name === '店铺LOGO' || val.name === '店铺电话' || val.name === '店铺地址') {
                                if (val.resource) {
                                    if (val.data === '' || val.data === null) {
                                        diyData = false;
                                        if (val.name === '店铺LOGO') {
                                            this.$message.error('请上传自定义LOGO')
                                        } else {
                                            this.$message.error('请输入自定义' + val.name + '内容')
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            }
            // 已勾选的自定义信息一定要填写
            diyData && this.toupdateCustomTemplate(params)
        },
        ticketUpData(ticketData) {          // 更新模板信息
            const ticketObj = {
                销售小票: 'salesData',
                换货小票: 'changeData',
                退货小票: 'returnsData'
            }
            if (!this.$app.isNull(ticketData.templateName) && ticketData.templateName in ticketObj) {
                let ticketConfig = {
                    templateId: ticketData.templateId,
                    industryIds: ticketData.industryIds,
                    width: ticketData.width,
                    ticketItemGroups: ticketData.ticketItemGroups,
                    ticketItemGroups210: ticketData.ticketItemGroups210
                }
                this.$store.state.printTemplate[ticketObj[ticketData.templateName]] = ticketConfig;
            }
        },
        toupdateCustomTemplate(params) {    // 保存模板数据
            ticketApi.updateCustomTemplate(params).then(res => {
                // localStorage.setItem('newTicketSize', params.width)
                if (res) {
                    // localStorage.setItem('newTicketSize', params.width)
                    this.$message.success('保存成功')
                    this.ticketUpData(params);
                    setTimeout(() => {
                        // this.dialogTableVisible = true
                        this.viewItemList = this.itemType.ticketItemGroups;
                    }, 1000)
                } else {
                    this.$message.error('保存失败')
                }
            })
        },
        changeActiveItem(name) {            // 右侧配置项菜单切换事件
            this.activeItem = name;
        },
        handleItemType(row) {               // 左侧样式点击事件
            this.activeItem = row.groupName;
        },
        hanldeSize(value) {                 // 小票规格菜单切换事件
            this.itemType.width = value;
            if (value === 210) {
                this.itemList = this.itemType.ticketItemGroups210;
            } else {
                this.itemList = this.itemType.ticketItemGroups;
            }
        },
        testPrint() {                       // 打印测试
            // const ticketData = goodsData
            // const configData = printConfig
            // const ticketName = this.itemType.templateName
            // ticketPrint(ticketData, this.itemType, configData, ticketName)
        }
    }
}

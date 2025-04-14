import salesPrint from './salesPrint/salesPrint.vue';
import hardware from './hardware/hardware.vue';
import ECU from './ECU/ECU.vue';
import restaurantPrint from './restaurantPrint/restaurantPrint.vue';
import labelPrint from './labelPrint/labelPrint.vue';
import receiptPrint from './receiptPrint/receiptPrint.vue';
import customTicket from './customTicket/customTicket.vue';
import imgModel from './imgModel/imgModel.vue';
import cashierModel from './cashierModel/cashierModel.vue';
import screenCustom from './screenCustom/screenCustom.vue';
import goodsSetting from '@/modules/common/views/commodity/page/product/settingEntry/settingEntry.vue';
import stockSetting from './stockSetting/stockSetting.vue';
import memberSetting from '@/modules/common/views/vip/page/memberCenter/setting/setting.vue';
import douyinBind from './douyinBind/douyinBind.vue';
import cashierBase from './cashierBase/cashierBase.vue';
import cashierDiscount from './cashierDiscount/cashierDiscount.vue';
import cashierPay from './cashierPay/cashierPay.vue';
import cashierSecurity from './cashierSecurity/cashierSecurity.vue';
import menuSetting from './menuSetting/menuSetting.vue';
import priceTag from './priceTag/tagList/tagList.vue';
import priceTagAdd from './priceTag/tagAdd/tagAdd.vue';
import cloudPrint from './cloudPrint/cloudPrint.vue';
import dataManage from './dataManage/dataManage.vue';
import screenSetting from './screenSetting/screenSetting.vue';
// import hardwareManagement from './hardwareManagement/hardwareManagement.vue'
// import hardwareManagementAdd from './hardwareManagementAdd/hardwareManagementAdd.vue'
import { mapMutations, mapState } from 'vuex';
import { stockApi } from '@/api/index.js';
export default {
    name: 'setting',
    components: {
        hardware,
        ECU,
        restaurantPrint,
        salesPrint,
        receiptPrint,
        customTicket,
        labelPrint,
        imgModel,
        cashierModel,
        screenCustom,
        goodsSetting,
        stockSetting,
        memberSetting,
        douyinBind,
        cashierBase,
        cashierDiscount,
        cashierPay,
        cashierSecurity,
        menuSetting,
        priceTag,
        priceTagAdd,
        cloudPrint,
        dataManage,
        screenSetting
        // hardwareManagement,
        // hardwareManagementAdd
    },
    data() {
        return {
            isTestingMaster: false,                     // 测试是否是主机
            settingData: {
                hardware: {
                    hardwareSetting: false,
                    touchModel: false,
                    keyboardCustom: false
                },
                software: {
                    version: 'v1.0.1',
                    hasNewVersion: false,
                    funcInfo: ''
                },
                goodsInfo: {
                    updateTime: '1分钟',
                    promotionTime: '1分钟',
                    showStock: false,
                    showGoodsImg: false,
                    showBranchCode: false,
                    showSearchBox: false,
                    hideSellOut: true
                },
                moreSetting: {
                    showGetMoneyMusic: false,
                    showErrorScancode: false,
                    showCustomDirecte: false,
                    useShortcutKey: false
                }
            },
            settingPos: 1,                  // 默认-1，不展示右边内容
            settingTitle: '',                  // 默认空，不展示右边内容
            dataRight: [
                {
                    title: '小票打印机设置',
                    dataPos: 0
                },
                {
                    title: '硬件设置',
                    dataPos: 1
                },
                {
                    title: '后厨打印设置',
                    dataPos: 2
                },
                {
                    title: '小票打印模版设置',
                    dataPos: 3
                },
                {
                    title: '标签打印',
                    dataPos: 4
                },
                {
                    title: '展示商品图片设置',
                    dataPos: 5
                },

                {
                    title: '副屏设置',
                    dataPos: 6
                },
                {
                    title: '商品设置',
                    dataPos: 7
                },
                {
                    title: '会员设置',
                    dataPos: 8
                },
                {
                    title: '抖音绑定',
                    dataPos: 9
                },
                // {
                //     title: '销售设置',
                //     dataPos: 9
                // },
                // {
                //     title: '库存设置',
                //     dataPos: 9
                // },
                {
                    title: '基础设置',
                    dataPos: 10
                },
                {
                    title: '优惠设置',
                    dataPos: 11
                },
                {
                    title: '支付设置',
                    dataPos: 12
                },
                {
                    title: '安全设置',
                    dataPos: 13
                },
                {
                    title: '全局菜单管理',
                    dataPos: 14
                },
                {
                    title: '标签打印模版设置',
                    dataPos: 15
                },
                {
                    title: '标签模版编辑',
                    dataPos: 16
                },
                {
                    title: '库存设置',
                    dataPos: 17
                },
                {
                    title: '云打印设置',
                    dataPos: 18
                },
                {
                    title: '数据管理',
                    dataPos: 19
                },
                {
                    title: '电控设置',
                    dataPos: 20
                },
                {
                    title: '收银模式设置',
                    dataPos: 21
                },
                {
                    title: '客显设置',
                    dataPos: 22
                },
                // {
                //     title: '硬件管理',
                //     dataPos: 20
                // },
                // {
                //     title: '新增硬件',
                //     dataPos: 21
                // }
            ],
            ElectronicControl: null,        // 是否开启电控权限
            isClient: false,                // 是否为客户端且可获取mac地址
            appSwitch: false,               // 设为主机开关
            cateringSwitch: false,          // 主机是否打宾客单
            IsPushMaster: {},
            macAddress: '',                 // mac地址
        }
    },
    computed: {
        ...mapState(['userInfo', 'isOnAndroid', 'user_local_data', 'masterSignalrStatus']),
        contentTitle() {
            return this.settingPos > -1 ? this.dataRight[this.settingPos].title : ''
        },
        hasHardware() {                                 // 是否显示硬件设置
            // 1-丽人美业 6-棋牌茶楼 11-艺培 18-服装行业 31-beta行业 不需要硬件设置
            const excludedIndustry = [1, 6, 11, 18, 31]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype) === false
        },
        hasElectronic() {
            // 1-丽人美业 棋牌茶楼 包含电控设置
            const excludedIndustry = [1, 6]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        hasCashierModel() {
            // 棋牌茶楼 包含收银模式设置
            const excludedIndustry = [6]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        hasDouyinBind() {
            // 1-丽人美业 9-景区乐园 32-瑜伽健身
            const excludedIndustry = [1, 9, 32]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        hasCloudPrint() {                               // 是否显示云打印
            // 1-丽人美业 18-服装行业  11-艺培 不需要云打印
            const excludedIndustry = [11]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype) === false
        },
        hasKitchPrint() {                               // 是否显示后厨打印
            // 6-棋牌茶楼 27-餐饮行业
            const excludedIndustry = [6, 27]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype)
        },
        hasPriceTag() {                                 // 是否显示标签菜单
            // let has = this.userInfo.sv_us_industrytype === 24 || this.userInfo.sv_us_industrytype === 18 || this.userInfo.sv_us_industrytype === 15 || this.userInfo.sv_us_industrytype === 10 || this.userInfo.sv_us_industrytype === 20;
            // return this.userInfo.sv_us_industrytype !== 27
            const excludedIndustry = [27]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype) === false
        },
        hasScreen() {                                   // 是否显示副屏设置                                   
            const excludedIndustry = [11]
            return excludedIndustry.includes(this.userInfo.sv_us_industrytype) === false
        },
    },
    watch: {
    },
    created() {
        this.handleSetting(this.$app.isNull(this.$route.query.settingTitle) ? '小票打印机设置' : this.$route.query.settingTitle);
        let current = this.dataRight.find(e => e.title === name);
        if (current) {
            this.settingPos = current.dataPos;
        }
        // 设为主机业务 获取mac地址
        this.isClient = (typeof Cef !== 'undefined' && typeof Cef.GetMac !== 'undefined') ? true : false;
        this.isClient && this.geteprintconfig();         // 获取主机信息
        this.getMacAddress();
        this.getCateringConfig();
        this.settingData.goodsInfo.showStock = this.user_local_data.showStorage;
        !!this.hasElectronic && this.getElectronicControl();
    },
    methods: {
        ...mapMutations(['updateUserLocalData', 'clearCartting', 'update']),
        handleSetting(name) {
            if (name === '电控设置') {
                if (this.ElectronicControl === false) {
                    return this.$message.warning('尚未开通电控权限，请联系销售人员开通')
                }
                if (this.ElectronicControl === null) return
            }
            this.settingTitle = name;
            let current = this.dataRight.find(e => e.title === name);
            if (current) {
                this.settingPos = current.dataPos;
            }
            let newQuery = JSON.parse(JSON.stringify(this.$route.query));
            if (newQuery.settingTitle !== this.settingTitle) {
                newQuery.settingTitle = this.settingTitle;
                this.$router.replace({ query: newQuery })
            }
        },
        async getMacAddress() {
            if (this.isClient && typeof Cef.GetMac !== 'undefined') {
                this.macAddress = typeof Cef.getVersion === 'function' ? await Cef.GetMac() : Cef.GetMac();
            }
        },
        handleClearCartting() {                         // 清除缓存
            this.$confirm('是否清除购物车缓存?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.clearCartting();
                this.$app.deleteCookie('cacheMenu');
                this.$app.deleteCookie('cacheMenuObj');
                this.$message.success('清除成功')
            }).catch(() => {

            });
        },
        handleStockSwitch() {                           // 展示库存
            let data = {
                ...this.user_local_data,
                showStorage: this.settingData.goodsInfo.showStock
            }
            this.updateUserLocalData(data);
        },
        handTestClient() {                              // 测试是否是主机
            if (this.isTestingMaster) return;
            let query = {
                Topic: "CheckMaster",
                ReceiveUsers: [this.userInfo.user_id + ''],
                ReceiveAppType: "PcWeb",
                ExtenDataJsons: [
                    JSON.stringify({
                        text: 'isMaster'
                    })
                ],
                LifeTimeSeconds: 600,
                IsRealTime: true,
                MasterOnly: true
            }
            this.isTestingMaster = true;
            stockApi.postClientMsg(query).then(res => {
                setTimeout(() => {
                    this.isTestingMaster = false;
                    this.geteprintconfig();
                }, 2000)
            }).catch(_ => {
                this.isTestingMaster = false;
                this.$message.warning('服务器无响应，请稍候再试');
            });
        },
        handleChangeApp(open) {                         // 设为主机
            let tipsMsg = open ? '此操作会把该设备设置为主机，是否继续？' : '此操作会取消该设备的主机身份，是否继续';
            this.$confirm(tipsMsg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.editPrintconfig();
            }).catch(() => {
                this.appSwitch = !this.appSwitch;
                this.$message({ type: 'info', message: '已取消' });
            });
        },
        geteprintconfig() {                             // 获取主机信息
            stockApi.geteprintconfig().then(res => {
                if (this.$app.isNull(res) || this.$app.isNull(this.macAddress)) return;
                this.appSwitch = res === this.macAddress ? true : false;
            })
        },
        editPrintconfig() {                              // 设置主机信息 log_source PC端传100作为标识
            stockApi.editPrintconfig({ sv_host: this.appSwitch ? this.macAddress : '', log_source: '100' }).then(res => {
                this.$message.success('设置成功');
                this.update({ key: 'masterSignalrStatus', data: this.appSwitch })
            }).catch(_ => {
                this.appSwitch = !this.appSwitch;
            })
        },

        handleChangeCatering(open) {                    // 主机打宾客单
            let tipsMsg = open ? '此操作开启，主机将会打印餐饮宾客单，是否继续？' : '此操作关闭，主机将不会打印餐饮宾客单';
            this.$confirm(tipsMsg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.editCateringConfig();
            }).catch(() => {
                this.cateringSwitch = !this.cateringSwitch;
                this.$message({ type: 'info', message: '已取消' });
            });
        },
        getCateringConfig() {                           // 获取主机打宾客单状态
            stockApi.getUserModuleConfig({ moduleCode: 'IsPushMaster' }).then(res => {
                if (res) {
                    this.IsPushMaster = this.$app.isNull(res) ? {} : res[0].childInfolist.find(e => e.sv_user_config_code === 'IsPushMaster');
                    let IsPushMasterHasDetail = this.IsPushMaster.childDetailList ? true : false;
                    this.cateringSwitch = IsPushMasterHasDetail ? this.IsPushMaster.childDetailList[0].sv_detail_is_enable : false;
                }
            })
        },
        editCateringConfig() {                          // 修改主机打宾客单状态
            let hasDetail = this.IsPushMaster.childDetailList ? true : false;
            let configData = [
                {
                    sv_detail_value: '',
                    sv_user_config_id: this.IsPushMaster.sv_user_config_id,
                    sv_user_module_id: this.IsPushMaster.sv_user_module_id,
                    sv_user_configdetail_id: hasDetail ? this.IsPushMaster.childDetailList[0].sv_user_configdetail_id : 0,
                    sv_detail_is_enable: this.cateringSwitch,
                    sv_user_configdetail_name: '是否推送主机',
                    sv_remark: '是否推送主机'
                }
            ]
            stockApi.saveConfigdetailList('IsPushMaster', configData).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                } else {
                    this.$message.error('修改失败');
                }
            }).catch(_ => {
                this.cateringSwitch = !this.cateringSwitch;
            })
        },
        getElectronicControl() {                        // 获取电控权限配置
            stockApi.getConfigSwitchTwoCode({ code: 'ElectronicControl' }).then(res => {
                if (res) {
                    this.ElectronicControl = res.enable;
                    if (this.$route.query.settingTitle === '电控设置' && this.ElectronicControl) {
                        this.handleSetting(this.$route.query.settingTitle);
                    }
                }
            })
        },
    }
}
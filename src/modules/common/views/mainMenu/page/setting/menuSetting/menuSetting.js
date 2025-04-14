import base from '@/api/base';
import orderWiped from '../../../base/orderWiped/orderWiped.vue';
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'menuSetting',
    components: { orderWiped },
    data() {
        let locationUrl = window.location.href;
        const isManageSystem = locationUrl.indexOf('ds.') > -1;
        const cachae_name = this.$store.state.userInfo.sv_uit_cache_name;
        const cashierHome = {
            cache_name_catering: {
                icon: 'icon_fn28',
                name: '正餐'
            },
            cache_name_cosmetology: {
                icon: 'icon_fn31',
                name: '开单'
            },
            cache_name_wisdom_venue: {
                // 智慧场馆
                icon: 'icon_fn31',
                name: '开单'
            },
            cache_name_yoga_fitness: {
                icon: 'icon_fn31',
                name: '开单'
            },
            cache_name_coffee: {
                icon: 'icon_fn30',
                name: '房台'
            },
        }
        const cashierLight = {
            cache_name_catering: {
                icon: 'icon_fn2',
                name: '轻餐'
            }
        }
        return {
            showEdit: true,
            isOnFrontCashier: !isManageSystem,                  // 是否是在前台收银版本
            funcList: [
				{
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn30.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn30.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cashierRoom',
                    name: '房台',           // 总后台名字 房单
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn1.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn1.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/lightCashier',
                    name: '收银',           // 总后台名字 简版
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_' + (cashierHome[cachae_name] ? cashierHome[cachae_name].icon : 'icon_fn1') + '.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/' + (cashierHome[cachae_name] ? cashierHome[cachae_name].icon : 'icon_fn1') + '.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/home',
                    name: cashierHome[cachae_name] ? cashierHome[cachae_name].name : '收银',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_' + (cashierLight[cachae_name] ? cashierLight[cachae_name].icon : 'icon_fn1') + '.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/'+ (cashierLight[cachae_name] ? cashierLight[cachae_name].icon : 'icon_fn1') + '.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/lightMeal',
                    name: cashierLight[cachae_name] ? cashierLight[cachae_name].name : '收银',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn3.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn3.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/orderList',
                    name: '账单',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn4.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn4.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/appraise',
                    name: '估清',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn5.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn5.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/return',
                    name: '退货',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn6.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn6.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cardRecharge',
                    name: '售卡',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn7.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn7.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cardConsumption',
                    name: '扣次',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn8.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn8.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/cashier/situation',
                    name: '概况',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn9.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn9.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/personalStores/storesCenter',
                    name: '门店',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn10.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn10.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/memberCenter/memberEntry',
                    name: '会员',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn11.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn11.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/reservation/kanban',
                    name: '预约',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn11.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn11.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/reservation/reservationMain',
                    name: '预约',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn12.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn12.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/product/productEntry',
                    name: this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_catering' ? '菜品' : '商品'
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn27.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn27.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/student/studentEntry',
                    name: '教务',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn10.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn10.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/student/studentEntry',
                    name: '学员',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn27.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn27.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/courseManage/courseGroup',
                    name: '课程',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn21.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn21.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/cardManage/admissionCard',
                    name: '卡项',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn13.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn13.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/downPayment/listEntry',
                    name: '订金',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn14.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn14.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/reportCensus',
                    name: '报表',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn15.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn15.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/purchasePackage/purchase',
                    name: '库存',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn16.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn16.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    notOpen: false,
                    url: '/promotionMain',
                    name: '营销',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn17.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn17.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/onlineOrder',
                    name: '订单',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn18.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn18.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/orderNumber/numberList',
                    name: '叫号',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn19.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn19.png',
                    type: 3,
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    fnName: 'orderWipedStatus',
                    name: '核销',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn20.png',
                    iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn20.png',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    url: '/expendAdd',
                    name: '支出',
                },
                // {
                //     icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn29.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn29.png',
                //     type: 1,
                //     pageEnable: true,
                //     pageHide: false,
                //     url: '/distribution/overview',
                //     name: '分销',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn21.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn21.png',
                //     type: 1,
                //     pageEnable: false,
                //     url: '/memberCenter/card/purchaseTimesCard',
                //     name: '售卡',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn22.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn22.png',
                //     type: 1,
                //     pageEnable: false,
                //     url: '/commodity/labelPrintEntry',
                //     name: '标签打印',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn23.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn23.png',
                //     type: 4,
                //     pageEnable: false,
                //     url: base.domainUrl + '/base/index.html#/situation',
                //     name: '寄存',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/menuSetting/un_icon_fn24.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/menuSetting/icon_fn24.png',
                //     type: 1,
                //     pageEnable: false,
                //     url: '/cashier/handover',
                //     name: '交接班',
                // }
            ],
            dataList: [
                {
                    subTitle: '采购管理',
                    list: [
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc11.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/purchasePackage/purchase',
                            name: '采购进货',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc12.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/purchasePackage/returnGoods',
                            name: '采购退货',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc13.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/purchasePackage/replenishmentReminder',
                            name: '补货提醒',
                        }
                    ]
                },
                {
                    subTitle: '货流管理',
                    list: [
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc21.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/cargoFlow/demandList',
                            name: '要货管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc22.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/cargoFlow/directOrder',
                            name: '直调管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc23.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/warehousingManage/warehouseIn',
                            name: '入库管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc24.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/warehousingManage/warehouseOut',
                            name: '出库管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc25.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/cargoFlow/differenceOrder',
                            name: '差异单',
                        }
                    ]
                },
                {
                    subTitle: '库存管理',
                    list: [
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc31.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/stocktaking',
                            name: '库存盘点',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc32.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/stockChange',
                            name: '库存调整',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc33.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/commodityPriceAdjustment',
                            name: '商品调价',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc34.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/costAdjustment',
                            name: '成本调整',
                        }
                    ]
                },
                {
                    subTitle: '基础资料',
                    list: [
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc41.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/basicMaterial/supplierManagement',
                            name: '供应商管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/menuSetting/icon_kc42.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/basicMaterial/reconciliation',
                            name: '对账管理',
                        }
                    ]
                }
            ],

            editList: [
                {
                    icon: '',
                    type: 1,
                    name: '店铺信息',
                },
                {
                    icon: '',
                    type: 1,
                    name: '语言选择',
                },
                {
                    icon: '',
                    type: 1,
                    name: '退款密码',
                },
                {
                    icon: '',
                    type: 1,
                    name: '开钱箱',
                }
            ],

            orderWipedStatus: false,                        // 订单核销弹窗
        }
    },
    watch: {
    },
    computed: {
        ...mapState(['userInfo', 'isOnAndroid', 'isLightMeal']),
    },
    mounted() {
        this.initFuncSelected();
    },
    methods: {
        ...mapMutations(['update']),
        initFuncSelected() {                                    // 初始化功能按钮
            if (this.userInfo.Switch_Stores) {
                this.funcList.forEach(e => {
                    if (e.name === '门店') {
                        e.url = '/salesroom/switchStoresEntry'
                    }
                })
            }
            let menuJson = this.$app.getLocalStorage('menuJson');
            let cacheMenuObj = this.$app.isNull(this.$app.getCookie('cacheMenuObj')) ? { list: [] } : JSON.parse(this.$app.getCookie('cacheMenuObj'));
            if (this.isLightMeal) {
                this.funcList.remove(this.funcList.find(e => e.name === '正餐'));
            }
            this.funcList = this.funcList.map(item => {
                const menuItem = menuJson.find(e => e.menu_path === item.url);
                // const pageHide = this.$app.isNull(menuItem) ? true : menuItem.sv_is_hide;
                const pageHide = this.$app.isNull(cacheMenuObj.list) ? (this.$app.isNull(menuItem) ? true : menuItem.sv_is_hide) : cacheMenuObj.list.findIndex(cachItem => cachItem.url === item.url) > -1 ? false : true;
                return {
                    ...item,
                    notFound: this.$app.isNull(menuItem),
                    pageHide
                }
            }).filter(e => !e.notFound);
            if (!this.isOnFrontCashier || this.isOnAndroid) {
                this.funcList = this.funcList.filter(e => !e.isNotInManageSystem);
            }
        },
        handleTopIcon(item) {
            if (item.type === 1) {
                this.$router.push({
                    path: item.url
                });
                return
            }
            if (item.type === 2) {
                window.open(item.url);
                return
            }
        },
        handleFuncItem(item) {
            if (this.showEdit) {
                item.pageHide = !item.pageHide;
                let array = [];
                this.funcList.forEach(e => {
                    if (!e.pageHide) {
                        array.push({
                            url: e.url,
                            name: e.name
                        })
                    }
                })
                this.$root.$emit('handleMainMenu', array);
                return
            }
            this.handleListItem(item);
        },
        handleListItem(item) {
            // type: 1 2 3 4 ['同一个router','pageNesting嵌套','执行方法','回到老系统']
            if (item.type === 1) {
                this.$router.push(item.url);
                return
            }
            if (item.type === 2) {
                this.update({
                    key: 'pageNestingUrl',
                    data: item.url
                });
                this.$router.push({
                    path: '/pageNesting'
                });
                return
            }
            if (item.type === 3) {
                this[item.fnName] = true;
                return
            }
            if (item.type === 4) {
                let token = this.$app.getLocalStorage('token');
                window.location.href = item.url + '/Login?key=' + token;
                return
            }
        }
    }
}
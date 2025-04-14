import base from '@/api/base';
import orderWiped from '../../base/orderWiped/orderWiped.vue';
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'moreFunc',
    components: { orderWiped },
    data() {
        const nameCharat = this.$store.state.userInfo.sv_uit_cache_name === 'cache_name_catering' ? '菜品' : '商品';
        const isManageSystem = window.location.href.indexOf('ds.') > -1;
        // const isManageSystem = true;
        return {
            isManageSystem: isManageSystem,
            showEdit: true,
            topIconList: [
                // {
                //     icon: base.frontImgBase + '/images/cashier/icon_top01.png',
                //     type: 1,
                //     url: '/vip/index.html',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/icon_top02.png',
                //     type: 1,
                //     url: base.domainUrl + '/vip/index.html',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/icon_top03.png',
                //     type: 2,
                //     url: 'https://school.decerp.cc/marketing/index.html#/',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/icon_top04.png',
                //     type: 1,
                //     url: base.domainUrl + '/vip/index.html',
                // }
            ],
            funcList: [
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn15.png',             // 不显示在在旦状态的图片
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn15.png',         // 显示在菜单状态的图标
                    type: 1,
                    showToMenu: false,
                    url: '/cashier/lightMeal',
                    name: '轻餐',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn16.png',             // 不显示在在旦状态的图片
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn16.png',         // 显示在菜单状态的图标
                    type: 1,
                    showToMenu: false,
                    url: '/cashier/cardConsumption',
                    name: '扣次',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn01.png',             // 不显示在在旦状态的图片
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn01.png',         // 显示在菜单状态的图标
                    type: 1,
                    showToMenu: false,
                    url: '/cashier/situation',
                    name: '概况',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn14.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn14.png',
                    type: 1,
                    showToMenu: false,
                    url: '/salesroom/switchStoresEntry',
                    name: '门店',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn02.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn02.png',
                    type: 1,
                    showToMenu: false,
                    url: '/memberCenter/memberEntry',
                    name: '会员',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn03.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn03.png',
                    type: 1,
                    showToMenu: false,
                    url: '/product/productEntry',
                    name: nameCharat,
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn04.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn04.png',
                    type: 1,
                    showToMenu: false,
                    url: '/reportCensus',
                    name: '报表',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn05.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn05.png',
                    type: 1,
                    showToMenu: false,
                    url: '/purchasePackage/purchase',
                    name: '库存',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn06.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn06.png',
                    type: 1,
                    showToMenu: false,
                    url: '/promotionMain',
                    name: '营销',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn07.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn07.png',
                    type: 1,
                    showToMenu: false,
                    url: '/onlineOrder',
                    name: '订单',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn07.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn07.png',
                    type: 1,
                    showToMenu: false,
                    url: '/orderNumber/numberList',
                    name: '叫号',
                },
                {
                    icon: base.frontImgBase + '/images/cashier/un_icon_fn25.png',
                    iconMenu: base.frontImgBase + '/images/cashier/icon_fn25.png',
                    type: 3,
                    showToMenu: false,
                    fnName: 'orderWipedStatus',
                    name: '核销',
                },
                // {
                //     icon: base.frontImgBase + '/images/cashier/un_icon_fn09.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/icon_fn09.png',
                //     type: 1,
                //     showToMenu: false,
                //     url: '/memberCenter/card/purchaseTimesCard',
                //     name: '售卡',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/un_icon_fn10.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/icon_fn10.png',
                //     type: 1,
                //     showToMenu: false,
                //     url: '/commodity/labelPrintEntry',
                //     name: '标签打印',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/un_icon_fn11.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/icon_fn11.png',
                //     type: 4,
                //     showToMenu: false,
                //     url: base.domainUrl + '/base/index.html#/situation',
                //     name: '寄存',
                // },
                // {
                //     icon: base.frontImgBase + '/images/cashier/un_icon_fn12.png',
                //     iconMenu: base.frontImgBase + '/images/cashier/icon_fn12.png',
                //     type: 1,
                //     showToMenu: false,
                //     url: '/cashier/handover',
                //     name: '交接班',
                // }
            ],
            dataList: [
                {
                    subTitle: '采购管理',
                    list: [
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc11.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/purchasePackage/purchase',
                            name: '采购进货',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc12.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/purchasePackage/returnGoods',
                            name: '采购退货',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc13.png',
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
                            icon: base.frontImgBase + '/images/cashier/icon_kc21.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/cargoFlow/demandList',
                            name: '要货管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc22.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/cargoFlow/directOrder',
                            name: '直调管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc23.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/warehousingManage/warehouseIn',
                            name: '入库管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc24.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/warehousingManage/warehouseOut',
                            name: '出库管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc25.png',
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
                            icon: base.frontImgBase + '/images/cashier/icon_kc31.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/stocktaking',
                            name: '库存盘点',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc32.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/stockChange',
                            name: '库存调整',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc33.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/business/commodityPriceAdjustment',
                            name: '商品调价',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc34.png',
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
                            icon: base.frontImgBase + '/images/cashier/icon_kc41.png',
                            type: 2,
                            url: base.domainUrl + '/inventory_business/index.html#/basicMaterial/supplierManagement',
                            name: '供应商管理',
                        },
                        {
                            icon: base.frontImgBase + '/images/cashier/icon_kc42.png',
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
        ...mapState(['userInfo', 'isLightMeal']),
    },
    mounted() {
        this.initFuncSelected();
    },
    methods: {
        ...mapMutations(['update']),
        initFuncSelected() {                                    // 初始化功能按钮
            if (this.isManageSystem) {
                this.funcList.remove(this.funcList.find(e => e.name === '正餐'))
                this.funcList.remove(this.funcList.find(e => e.name === '轻餐'))
            } else {
                if (this.userInfo.sv_uit_cache_name !== 'cache_name_catering') {
                    this.funcList.remove(this.funcList.find(e => e.name === '轻餐'))
                } else {
                    if (this.isLightMeal) {
                        this.funcList.remove(this.funcList.find(e => e.name === '轻餐'))
                    }
                }
            }
            let cacheMenu = this.$app.getCookie('cacheMenu');
            if (!this.$app.isNull(cacheMenu)) {
                this.funcList.forEach(e => {
                    let has = JSON.parse(cacheMenu).find(k => k === e.name);
                    e.showToMenu = has ? true : false;
                })
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
                item.showToMenu = !item.showToMenu;
                let array = [];
                this.funcList.forEach(e => {
                    if (e.showToMenu === true) {
                        array.push(e.url)
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
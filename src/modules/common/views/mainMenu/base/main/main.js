import customConfig from '@/utils/config/customConfig.js';
import base from '@/api/base';
import { stockApi } from '@/api/index';
import { updatePassword } from '@/components/index';
import orderWiped from '../orderWiped/orderWiped.vue';
import orderTake from '../orderTake/orderTake.vue';
import shortcutSetting from '../shortcutSetting/shortcutSetting.vue';
import handover from '../handover/handover.vue';
import memberList from '../memberList/memberList.vue';
import memberRecharge from '../memberRecharge/memberRecharge.vue';
import storeCardSelect from '../storeCardSelect/storeCardSelect.vue';
import equityCardSelect from '../equityCardSelect/equityCardSelect.vue';
import goodsAdd from '../goodsAdd/goodsAdd.vue';
import priceChange from '../priceChange/priceChange.vue';
import numberChange from '../numberChange/numberChange.vue';
import quickCollect from '../quickCollect/quickCollect.vue';
import checkin from '../checkin/checkin.vue';
import isGoodsActivity from '../isGoodsActivity/isGoodsActivity.vue';
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
export default {
    components: { updatePassword, orderWiped, orderTake, shortcutSetting, handover, memberList, memberRecharge, storeCardSelect, equityCardSelect, goodsAdd, priceChange, numberChange, quickCollect, isGoodsActivity, checkin },
    data() {
        // let locationUrl = 'ds.decerp.cc';
        let locationUrl = window.location.href;
        const cachae_name = this.$store.state.userInfo.sv_uit_cache_name;
        const isManageSystem = locationUrl.indexOf('ds.') > -1;
        const isCatering = cachae_name === 'cache_name_catering';
        const cashierHome = {
            cache_name_catering: {
                icon: 'icon-cashier-fangtai',
                name: '正餐'
            },
            cache_name_cosmetology: {
                icon: 'icon-jianban',
                name: '开单'
            },
            cache_name_wisdom_venue: {
                // 智慧场馆
                icon: 'icon-jianban',
                name: '开单'
            },
            cache_name_yoga_fitness: {
                icon: 'icon-jianban',
                name: '开单'
            },
            cache_name_coffee: {
                icon: 'icon-cashier-fangtai',
                name: '房台'
            },
        }
        return {
            IsAuthority: true,
            hasStoreReconciliation: true,
            timer: null,
            showToMenuExpire: false,                            // 到期弹窗
            showToMenuExpireDay: false,                         // 到期天数提醒
            showToMenuCardExpire: false,                        // 微信卡券、微信推送已过期 提醒
            cardExpireText: '',                                 // 微信卡券、微信推送等提醒内容
            isOnExpireEntry: false,                             // 到期弹窗点击续费
            showLogoMenu: false,                                // logo 点击状态
            storeList: [],                                      // 门店列表
            currStoreList: [],                                  // 当前门店列表
            storeSearchText: '',                                // logo切换门店 门店列表搜索
            visiblePwd: false,
            handoverStatus: false,                              // 退出弹出交接班提示
            priceChangeType: 1,                                 // 改单价 or 改小计  1 or 2
            isOnFrontCashier: !isManageSystem,                  // 是否是在前台收银版本
            currentMenu: [
                {
                    icon: 'icon-cashier-fangtai',
                    name: '房台',                               // 美业房台
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cashierRoom',
                },
                {
                    icon: 'icon-cashier',
                    name: '收银',
                    shortcut: 'F9',
                    pageEnable: true,                           // false 只展示，点击提示
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/lightCashier',
                },
                {
                    icon: cashierHome[cachae_name] ? cashierHome[cachae_name].icon : 'icon-cashier',
                    name: cashierHome[cachae_name] ? cashierHome[cachae_name].name : '收银',
                    shortcut: 'F9',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/home',
                },
                {
                    icon: isCatering ? 'icon-canyin' : 'icon-cashier',
                    name: isCatering ? '轻餐' : '收银',
                    shortcut: 'F9',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/lightMeal',
                },
                {
                    icon: 'icon-bill',
                    name: '账单',
                    shortcut: 'F3',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/orderList',
                },
                {
                    icon: 'icon-tuihuo1',
                    name: '退货',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/return',
                },
                {
                    icon: 'icon-cika1',
                    name: '售卡',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cardRecharge',
                },
                {
                    icon: 'icon-kouci',
                    name: '扣次',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/cardConsumption',
                },
                {
                    icon: 'icon-guqing',
                    name: '估清',
                    pageEnable: true,
                    pageHide: false,
                    isNotInManageSystem: true,
                    url: '/cashier/appraise',
                },
                {
                    icon: 'icon-gaikuang',
                    name: '概况',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'situation',                     // 菜单匹配
                    url: '/cashier/situation',
                    type: 1,
                },
                {
                    icon: 'icon-mendian',
                    name: '门店',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'system',
                    url: '/personalStores/storesCenter',
                    type: 1,
                },
                {
                    icon: 'icon-shezhi',
                    name: '打印',
                    isDebug: false,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'printSetting',
                    url: '/printSetting/ticketList',
                    type: 1,
                },
                {
                    icon: 'icon-huiyuan',
                    name: '会员',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'member',
                    url: '/memberCenter/memberEntry',
                    type: 1,
                },
                {
                    icon: 'icon-yuyue',
                    name: '预约',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'reservation',
                    url: '/reservation/kanban',
                    type: 1,
                },
                {
                    icon: 'icon-shangpin',
                    name: isCatering ? '菜品' : '商品',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'product',
                    url: '/product/productEntry',
                },
                {
                    icon: 'icon-jiaowuzonglan',
                    name: '教务',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'education',
                    url: '/education/courseManagement',
                },
                {
                    icon: 'icon-huiyuan',
                    name: '学员',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'student',
                    url: '/student/studentEntry',
                },
                {
                    icon: 'icon-yuyue',
                    name: '场馆',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'reservation',
                    url: '/reservation/reservationMain',
                },
                {
                    icon: 'icon-jiaowuzonglan',
                    name: '课程',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'courseManage',
                    url: '/courseManage/courseGroup',
                },
                {
                    icon: 'icon-cika1',
                    name: '卡项',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'cardManage',
                    url: '/cardManage/admissionCard',
                },
                {
                    icon: 'icon-dingjin',
                    name: '订金',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'downPayment',
                    url: '/downPayment/listEntry',
                },
                {
                    icon: 'icon-baobiao',
                    name: '报表',
                    type: 1,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'report',
                    url: '/reportCensus',
                },
                {
                    icon: 'icon-baobiao',
                    type: 1,
                    name: '报表-N',
                    isDebug: true,
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'reportNew',
                    url: '/report/reportCensus',
                },
                {
                    icon: 'icon-kucun',
                    type: 1,
                    name: '库存',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'purchase',
                    url: '/purchasePackage/purchase',
                },
                {
                    icon: 'icon-youhuiquan',
                    type: 1,
                    name: '营销',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'promotion',
                    url: '/promotionMain',
                },
                {
                    icon: 'icon-dingdan',
                    type: 2,
                    name: '订单',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'onlineOrder',
                    url: '/onlineOrder',
                },
                {
                    icon: 'icon-REXpaiduijiaohao_',
                    type: 1,
                    name: '叫号',
                    pageEnable: true,
                    pageHide: false,
                    menuMetaMatch: 'orderNumber',
                    url: '/orderNumber/numberList',
                },
                {
                    icon: 'icon-fenxiao',
                    type: 1,
                    name: '分销',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    menuMetaMatch: 'distribution',
                    url: '/distribution/overview',
                },
                {
                    icon: 'icon-hexiao',
                    type: 3,
                    name: '核销',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: 'orderWipedStatus',
                    fnName: 'orderWipedStatus',
                },
                {
                    icon: 'icon-zhichu',
                    type: 2,
                    name: '支出',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: false,
                    menuMetaMatch: 'expend',
                    url: '/expendAdd',
                },
                {
                    icon: 'icon-shouka',
                    type: 2,
                    name: '售卡',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: base.domainUrl + '/vip/index.html#/memberCenter/card/purchaseTimesCard',
                },
                {
                    icon: 'icon-print',
                    type: 2,
                    name: '标签打印',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: base.domainUrl + '/commodity/index.html?activeName=productEntry#/labelPrintEntry',
                },
                {
                    icon: 'icon-jicun',
                    type: 4,
                    name: '寄存',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: base.domainUrl + '/base/index.html#/situation',
                },
                {
                    icon: 'icon-succession',
                    type: 5,
                    name: '交接班',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: '/cashier/handover',
                },
                {
                    icon: 'icon-servicing',
                    name: '服务中',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: '/services',
                },
                {
                    icon: 'icon-keyboard',
                    name: '快捷键',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: '',
                },
                {
                    icon: 'icon-servicing',
                    name: '消息',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: '/message',
                },
                {
                    icon: 'icon-more',
                    name: '更多',
                    pageEnable: true,
                    pageHide: false,
                    notOpen: true,
                    url: '/moreFunc',
                }
            ],
            mainLeftShow: true,                                 // 左边栏是否展示

            orderWipedStatus: false,                            // 订单核销
            orderTakeStatus: false,                             // 取单弹窗
            shortcutSettingStatus: false,                       // 快捷键设置弹窗

            useType: 'common',                                  // 会员列表是否查询跨店会员
            memberListStatus: false,                            // 会员列表弹窗
            memberRechargeStatus: false,                        // 充值状态
            storeCardStatus: false,                             // 选择储值卡弹窗状态
            equityCardStatus: false,                            // 选择权益卡弹窗状态
            goodsAddStatus: false,                              // 新增商品
            priceChangeMenuPos: 0,                              // 改价弹窗菜单 0 改价 1 改折
            priceChangeImprotMoney: 0,                          // 改价输入金额
            priceChangeStatus: false,                           // 改价弹窗

            currentPriceStatus: false,                          // 改时价弹窗

            numberChangeStatus: false,                          // 改数量弹窗
            quickCollectStatus: false,                          // 无码收银弹窗
            isGoodsActivityStatus: false,                       // 加价购、满送弹窗
            checkinStatus: false,                               // 订单结算弹窗

            localTime: '',

            isLogUpdate: false,

            entityLogUpdate: {                                  // 公告信息
                title: '',                                          // 标题
                dateTime: '',                                       // 时间
                weekTime: '',                                       // 星期几
                content: ''                                         // 内容
            },
            menuJson: [],                                       // 配置菜单列表
        }
    },
    computed: {
        ...mapGetters(['hasReturnOrExchange']),
        ...mapState(['userInfo', 'isOnAndroid', 'caleStep', 'isInCartting', 'isInShowCheckin', 'isLightMeal', 'memberInfo', 'cashierJurisdiction', 'carttingData', 'carttingSelectedPos', 'memberSetting', 'memberList']),
        ...mapState('permission', ['CashierManage']),
        store_logo() {
            let url = this.$app.isNull(this.userInfo.sv_store_logo) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : this.userInfo.sv_store_logo
            return this.$app.fmtImg(url)
        },
        mainMenu() {
            let cacheMenuObj = this.$app.isNull(this.$app.getCookie('cacheMenuObj')) ? { list: [] } : JSON.parse(this.$app.getCookie('cacheMenuObj'));
            let menuList = this.currentMenu.map(item => {
                const menuItem = this.menuJson.find(e => e.menu_path === item.url);
                const pageEnable = this.$app.isNull(menuItem) ? false : menuItem.sv_enabled;
                const pageHide = this.$app.isNull(cacheMenuObj.list) ? (this.$app.isNull(menuItem) ? true : menuItem.sv_is_hide) : cacheMenuObj.list.findIndex(cachItem => cachItem.url === item.url) > -1 ? false : true;

                const cachae_name = this.$store.state.userInfo.sv_uit_cache_name;
                const isCakeBaking = cachae_name === 'cache_name_cake_baking';          // 烘焙行业不展示收银，展示轻餐收银
                return {
                    ...item,
                    name: this.hasReturnOrExchange && item.url === '/cashier/return' ? '退换' : item.name,
                    pageHide: isCakeBaking && item.url === '/cashier/home' ? true : item.isDebug ? false : pageHide,
                    pageEnable,
                }
            }).filter(e => !e.pageHide && !e.notOpen);
            if (!this.isOnFrontCashier || this.isOnAndroid) {
                menuList = menuList.filter(e => !e.isNotInManageSystem);
            }
            return menuList
        },
        isPricingMethod() {
            return this.carttingSelectedPos > -1 && this.carttingData.productResults.length > 0 ? this.carttingData.productResults[this.carttingSelectedPos].isPricingMethod : false
        },
        showCardWrap() {
            return this.caleStep === 1 && this.userInfo.sv_us_industrytype === 1 && this.isInCartting
        },
        isMeiye() {
            return this.userInfo.sv_us_industrytype === 1
        },
        isDarkMode() {
            // 6-棋牌茶楼 9-景区乐园 11-艺培 27-餐饮 32-健身房 69-智慧场馆
            const industrytypeList = [1, 6, 8, 9, 11, 27, 32, 69]
            const pathList = ['/cashier/home', '/cashier/cashierRoom', '/cashier/lightCashier', '/cashier/lightMeal', '/cashier/cardRecharge', '/shortcuts', '/multiple', '/fitness_shortcuts', '/fitness_multiple']
            const isDarkPath = pathList.includes(this.$route.path)
            return isDarkPath && industrytypeList.includes(this.userInfo.sv_us_industrytype)
        },
        menuPathMatch() {
            // console.log('menuMatch', this.$route.matched[1].meta);
            const meta = this.$route.matched.length > 1 ? this.$route.matched[1].meta.menuMatch : '';
            return meta ? this.$route.matched[1].meta.menuMatch : ''
        },
        currentDefaultNumber() {
            this.$nextTick(() => {
                if (this.carttingSelectedPos === -1) return 0;
                let currentItem = this.carttingData.productResults[this.carttingSelectedPos];
                let number = currentItem.appraiseNumber || currentItem.number;
                return number || 0
            })
        },
        technicalSupport() {
            let value = '';
            for (const item in customConfig.technicalSupport) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.technicalSupport[item]
                }
            }
            return value
        },
    },
    watch: {
        $route: {
            deep: true, immediate: true,
            handler(val, oldval) {
                this.IsAuthority = true;
                let Jurisdiction = this.$store.state.JurisdictionObj;
                this.IsAuthority = this.$app.isNull(val.meta.authorityCode) ? true : Jurisdiction[val.meta.authorityCode] ? true : false;
                !this.IsAuthority && this.$message({ message: '无权限查看', type: 'warning' });
            }
        },
        '$route.path': {
            handler(newVal, oldVal) {
                this.checkVersionExpiration();
            }
        },
        'memberInfo.wallets_list': {                        // 监听钱包id 
            handler(newVal, oldVal) {
                if (newVal && newVal !== oldVal && newVal.length > 1 && this.$route.path === '/cashier/home') {
                    if (this.userInfo.sv_uit_cache_name !== 'cache_name_cosmetology' || this.caleStep === 3) {
                        this.showStoreCard();
                    }
                }
            }
        },
        'memberInfo.sv_wallet_id': {                        // 监听钱包id 
            handler(newVal, oldVal) {
                if (oldVal !== '' || newVal !== '') {
                    this.updateCartting();
                }
            }
        },
        caleStep: {                                             // 监听当前是否展示满减、加价购
            handler(newVal, oldVal) {
                if (newVal === 2) {
                    this.showGoodsActivity();
                    return
                }
                if (newVal === 3) {
                    this.updateCartting();
                }
            }
        },
        isInShowCheckin: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.checkinStatus = true;
                } else {
                    this.checkinStatus = false;
                }
            }
        },
        orderTakeStatus: {                                      // 监听取单弹窗弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        shortcutSettingStatus: {                                // 监听快捷键设置弹窗弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        handoverStatus: {                                       // 监听交接班弹窗弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        memberListStatus: {                                     // 监听会员列表弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        memberRechargeStatus: {                                 // 监听充值弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        goodsAddStatus: {                                       // 监听新增商品弹窗编号
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        priceChangeStatus: {                                    // 监听改价弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        numberChangeStatus: {                                   // 监听改数量弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        quickCollectStatus: {                                   // 监听无码收银弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
        isGoodsActivityStatus: {                                // 监听加价购、满送弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                    this.update({
                        key: 'caleStep',
                        data: 2
                    });
                } else {
                    this.$refs.mian.focus();
                    if (this.caleStep === 3) return;
                    this.update({
                        key: 'caleStep',
                        data: 1
                    });
                }
            }
        },
        checkinStatus: {                                        // 监听订单结算弹窗变化
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$refs.mian.blur();
                } else {
                    this.$refs.mian.focus();
                }
            }
        },
    },
    created() {
        this.checkVersionExpirationDay();
        if (this.isMeiye) {
            this.getConfigSwitchList();                 // 获取服务商品业绩平分
        }
    },
    beforeMount() {
        if (this.userInfo.sv_uit_cache_name === 'cache_name_cosmetology') {
            document.body.classList.add("theme-purple");
        }
        this.initMainMenu();
        this.getStoreInfo();                        // 获取店铺信息

        this.$root.$on('keyCode', code => {
            this.$nextTick(() => {
                !!this.$refs.mian && this.$refs.mian.focus();
            })
            const homePath = ['/cashier/', '/cashier/home', '/cashier/cashierRoom', '/cashier/lightMeal', '/cashier/lightCashier', '/cashier/return']
            if (homePath.includes(this.$route.path)) {
                this.handleHomeKeycode(code);
                return
            }

            if (this.$route.path.indexOf('/orderList') > -1) {
                this.handleOrderKeycode(code);
            }
        });
    },
    mounted() {
        this.localTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.$root.$on('setUseType', this.setUseType)
        setInterval(() => {
            this.localTime = this.$app.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }, 1000);
        // pageNesting地址控制页面跳转
        window.topPageInit = this.handleIconClick;
    },
    methods: {
        ...mapMutations(['update', 'clearCartting', 'clearMember', 'updateUserLocalData', 'decodeJurisdiction']),
        ...mapMutations('permission', ['setPermission']),
        ...mapActions(['updateCartting', 'caleCarttingGiveData', 'getUserModuleConfigs', 'getPrintTemplate', 'memberCardUpdateCartting']),
        listenKeyup(e) {                                            // 监听键盘按键
            let code = parseInt(e.keyCode);
            const homePath = ['/cashier/', '/cashier/home', '/cashier/lightMeal', '/cashier/lightCashier']
            if (homePath.includes(this.$route.path)) {
                return this.handleHomeKeycode(code);
            }
            if (this.$route.path === '/orderList') {
                return this.handleOrderKeycode(code);
            }
        },
        getConfigSwitchList() {                                     // 获取服务商品业绩平分
            stockApi.getConfigSwitchList().then(res => {
                if (res) {
                    this.update({
                        key: 'commission_Switch',
                        data: res[0].sv_is_enable
                    })
                }
            })
        },
        getStoreInfo() {                                            // 获取店铺信息
            stockApi.getStoreInfo({ sv_remind_source: this.$app.getOrigin() }).then(res => {
                if (res) {
                    this.update({
                        key: 'storeInfo',
                        data: JSON.parse(JSON.stringify(res))
                    });
                    this.cardExpireText = res.sv_remind_msg;
                    this.checkVersionExpiration();
                    if (this.isLightMeal) {
                        this.currentMenu.remove(this.currentMenu.find(e => e.name === '正餐'));
                    }
                    this.GetMenuList();
                }
            });
        },
        checkVersionExpiration() {                                  // 到期提醒
            if (this.$route.path.indexOf('renewChooseEntry') > -1) return;
            if (this.userInfo.versionId !== 5) {
                let versionexpiration = new Date(this.userInfo.versionexpiration);
                let now = new Date();
                if (now > versionexpiration) {
                    this.showToMenuExpire = true;
                    this.isOnExpireEntry = false;
                }
            }
            if (!this.$app.isNull(this.cardExpireText)) {
                this.showToMenuCardExpire = true;
            }
        },
        checkVersionExpirationDay() {                               // 到期天数提醒               
            if (this.userInfo.versionId !== 5) {
                // let expirationDay = [30, 15, 7, 5, 3, 2, 1];
                let expirationDay = [30, 15];
                if (!this.$app.getLocalStorage('expire_days_isCheck')) {
                    if (expirationDay.includes(this.userInfo.sv_expire_days) || this.userInfo.sv_expire_days < 15) {
                        this.$app.setLocalStorage('expire_days_isCheck', true)
                        this.showToMenuExpireDay = true;
                    }
                }
            }
        },
        closeCardExpire() {
            this.showToMenuCardExpire = false;
            this.cardExpireText = '';
        },
        handleRenewUrl() {                                          // 跳转续费
            this.showToMenuExpire = false;
            this.isOnExpireEntry = true;
            this.$router.push({
                path: '/renew/renewChooseEntry',
                query: {
                    singleType: this.userInfo.buyshopnumber ? 'many' : 'odd'
                }
            })
        },
        hideExpire() {                                              // 关闭到期提醒
            if (!this.isOnExpireEntry) this.popLoginout();
        },
        hideExpireDay() {
            this.showToMenuExpireDay = false;
        },
        handleHomeKeycode(code) {
            switch (code) {
                case 13:                                            // Enter
                    // this.caleCarttingGiveData();
                    // if (this.carttingData.givePromotions.length > 0) {
                    //     this.showGoodsActivity();
                    //     return
                    // }
                    if (this.carttingData.productResults.length > 0) {
                        this.update({
                            key: 'caleStep',
                            data: 3
                        });
                        return
                    }
                    if (this.userInfo.sv_uit_cache_name === 'cache_name_catering') {
                        // 餐饮行业
                        if (this.isLightMeal && this.$app.isNull(this.carttingData.productResults)) return;
                        this.update({
                            key: 'caleStep',
                            data: 3
                        });
                        return
                    }
                    if (this.userInfo.sv_uit_cache_name === 'cache_name_coffee') {
                        // 棋牌茶楼
                        this.update({
                            key: 'caleStep',
                            data: 3
                        });
                        return
                    }
                    return;
                case 112:                                           // F1
                    this.clearCarttingList();
                    return;
                case 113:                                           // F2
                    this.showGoodsAdd();
                    return;
                case 114:                                           // F3
                    this.handleIconClick(1);
                    return;
                case 117:                                           // F6
                    this.showMemberList();
                    return;
                case 118:                                           // F7 开钱箱
                    // this.showOrderTake();
                    return;
                case 120:                                           // F9
                    this.handleIconClick(0);
                    return;
                case 121:                                           // F10
                    this.showPriceChange();
                    return;
                case 122:                                           // F11
                    this.showShortcutSetting();
                    return;
                // case 123:                                           // F12 挂单/取单
                //     this.showOrderTake();
                //     return;
                case 192:                                           // `
                    this.handleLeftStatus();
                    return;
                case 67:                                            // 

                    return;
                case 71:                                            // g
                    if (this.carttingSelectedPos === -1) return this.$message({ message: '没有选中商品', type: 'warning' });
                    this.priceChangeMenuPos = 0;
                    const goodsItem = this.carttingData.productResults[this.carttingSelectedPos];
                    if (goodsItem.isCurrentPrice) {
                        this.priceChangeImprotMoney = this.carttingData.productResults[this.carttingSelectedPos].price;
                        this.currentPriceStatus = true;
                        return
                    }
                    this.showPriceChange();
                    return;
                case 72:                                            // h
                    this.$root.$emit('handleOrderTake');
                    return;
                case 73:                                            // i
                    const goodsItem2 = this.carttingData.productResults[this.carttingSelectedPos];
                    if (this.carttingSelectedPos === -1) return this.$message({ message: '没有选中商品', type: 'warning' });
                    if (goodsItem2.isCurrentPrice) return this.$message({ message: '时价商品无法修改小计', type: 'warning' });
                    this.priceChangeMenuPos = 0;
                    this.showPriceChange(2);
                    return;
                case 75:                                            // k
                    this.showQuickCollect();
                    return;
                case 80:                                            // p:储值卡
                    this.showStoreCard();
                    return;
                case 81:                                            // q
                    this.showOrderTake();
                    return;
                case 82:                                            // r
                    this.showMemberRecharge();
                    return;
                case 85:                                            // u
                    this.showEquityCard();
                    return;
                case 87:                                            // w
                    this.showMemberRecharge();
                    return;
                case 106:                                           // * 改数量
                    if (this.carttingSelectedPos === -1) return this.$message({ message: '没有选中商品', type: 'warning' });
                    this.showNumberChange();
                    return;
                case 107:                                           // +
                    if (this.carttingSelectedPos === -1) return this.$message({ message: '没有选中商品', type: 'warning' });
                    this.updateGoodsNumber('add');
                    return;
                case 109:                                           // -
                    if (this.carttingSelectedPos === -1) return this.$message({ message: '没有选中商品', type: 'warning' });
                    this.updateGoodsNumber('subtract');
                    return;
                case 1001:                                          // 订单核销
                    this.orderWipedStatus = true;
                    return;
                default:
                    console.log('home key ' + code + ' is click');
                    return;
            }
        },
        handleOrderKeycode(code) {
            switch (code) {
                case 114:                                           // F3
                    this.handleIconClick(1);
                    return;
                case 120:                                           // F9
                    this.handleIconClick(0);
                    return;
                case 121:                                           // F10

                    return;
                case 122:                                           // F11
                    this.showShortcutSetting();
                    return;
                case 192:                                           // `
                    this.handleLeftStatus();
                    return;
                default:
                    console.log('order key ' + code + ' is click');
                    return;
            }
        },
        initMainMenu() {
            this.update({
                key: 'isLightMeal',
                data: this.$app.getLocalStorage('isLightMeal')
            });
            if (this.userInfo.Switch_Stores) {
                this.currentMenu.forEach(e => {
                    if (e.name === '门店') {
                        e.url = '/salesroom/switchStoresEntry'
                    }
                })
            }
            this.$root.$on('handleMainMenu', menuList => {
                let cookieMenu = {
                    id: this.userInfo.user_id,
                    list: []
                };
                this.currentMenu.forEach(e => {
                    if (menuList.findIndex(lItem => lItem.url === e.url) > -1) {
                        e.pageHide = true;
                        cookieMenu.list.push({
                            url: e.url,
                            name: e.name
                        })
                    } else {
                        e.pageHide = false;
                    }
                })
                this.$app.setCookie('cacheMenuObj', JSON.stringify(cookieMenu), 30);
            });
        },
        syncUserLocalData() {                                       // 同步local数据到state
            let cookieLocalData = this.$app.getCookie('User-Local-Data');
            if (!cookieLocalData) return;
            try {
                let userLocalData = JSON.parse(cookieLocalData);
                if (this.userInfo.user_id === userLocalData.user_id) this.updateUserLocalData(userLocalData)
            } catch (error) {

            }
        },
        showOrderTake() {                                           // 显示取单弹窗
            if (this.carttingData.productResults.length > 0) return;
            this.orderTakeStatus = true;
        },
        showShortcutSetting() {                                     // 显示快捷键设置弹窗
            this.shortcutSettingStatus = true;
        },
        showHandover() {                                            // 显示交接班弹窗
            this.handoverStatus = true;
        },
        updateGoodsNumber(type) {                                   // 修改选中商品数量
            if (this.timer) {
                clearTimeout(this.timer);
            };
            let temp = this.carttingData.productResults[this.carttingSelectedPos];
            if (type == 'subtract' && temp.number <= 1) {
                return
            }
            if (type == 'add') {
                ++temp.number;

            } else if (type == 'subtract') {
                --temp.number;
            }
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                this.timer = null;
                this.updateCartting();
            }, 100);
        },
        clearCarttingList() {                                       // 清除购物车F1
            this.clearCartting();
        },
        showMemberList() {                                          // 显示会员列表弹窗
            this.memberListStatus = true;
        },
        setUseType(type) {                                          // 设置会员列表使用条件
            //common 全部允许 allow_Consumption 允许消费  allow_Recharge 允许充值 allow_integral 允许积分操作
            this.useType = type;
        },
        showMemberRecharge() {                                      // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },
        showStoreCard() {                                           // 显示会员储值卡弹窗
            if (this.$app.isNull(this.memberInfo.member_id)) return
            if (this.memberInfo.wallets_list.length === 0) return this.$message.warning('该会员没有储值卡')
            this.storeCardStatus = true;
        },
        showEquityCard() {                                          // 显示会员储值卡弹窗
            if (this.$app.isNull(this.memberInfo.member_id) || this.memberInfo.micard_count === 0) return
            this.equityCardStatus = true;
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        showCategorySecond() {                                      // 显示新增二级分类
            this.categorySecondStatus = true;
        },
        showGoodsAdd() {                                            // 显示新增商品
            this.goodsAddStatus = true;
        },
        showPriceChange(type = 1) {                                 // 显示改价、改小计弹窗
            this.priceChangeType = type;
            this.priceChangeImprotMoney = type === 1 ? this.carttingData.productResults[this.carttingSelectedPos].price : this.carttingData.productResults[this.carttingSelectedPos].dealMoney + '';
            this.priceChangeStatus = true;
        },
        showNumberChange() {                                        // 显示改数量弹窗
            this.numberChangeStatus = true;
        },
        showQuickCollect() {                                        // 显示无码收银弹窗
            this.quickCollectStatus = true;
        },
        showGoodsActivity() {                                       // 显示加价购满送
            this.isGoodsActivityStatus = true;
        },
        updategoodsList(e) {                                        // 修改添加的商品
            this.goodsList = e;
        },
        GetBranchShopListNew() {                                    // 获取门店列表
            let query = {
                userid: '',                                     // 店铺id
                query_type: 1,
                sv_ul_regdate_type: -1,                         // 注册时间
                sv_ul_regdate_start: "",                        // 开始时间
                sv_ul_regdate_end: "",                          // 结束时间
                sv_us_province: -1,                             // 省份
                sv_us_city: -1,                                 // 市
                sv_us_industrytype: -1,                         // 行业code
                sv_user_type: -1,                               // 门店类型
                sv_shopstate: -1,                               // 门店状态
                sv_versionid_name: "",                          // 版本
                sv_versionexpiration_type: -1,                  // 有效期
                keywards: "",
                page: 1,
                pageIndex: 999
            };
            stockApi.GetBranchStoreSwitch(query).then(res => {
                if (res) {
                    this.storeList = this.$app.isNull(res.list) ? [] : res.list.map(e => {
                        e.sv_ul_regdate = this.$app.currentTime(new Date(e.sv_ul_regdate), 'yyyy-MM-dd HH:mm:ss');
                        e['children'] = this.$app.isNull(e.list) ? [] : e.list;
                        e.sv_shopstate = e.sv_shopstate === 1;
                        return { ...e };
                    });
                    this.currStoreList = Object.assign(this.storeList);
                    // this.total = res.total;
                }
            });
        },
        handleInfo() {                                              // 点击切换门店-跳转门店中心
            this.handleIconClick(3)
        },
        handleStore() {                                             // 点击店铺中心
            if (this.$route.path === '/personalStores/storesCenter') return;
            this.showLogoMenu = false;
            this.$router.push('/personalStores/storesCenter');
        },
        handleStoreChange(item) {                                   // 切换门店
            if (item.user_id == this.userInfo.user_id || !item.sv_shopstate) return;
            let obj = { isStore: item.isStore, user_id: item.user_id }
            stockApi.GtePermissions_User(obj).then(res => {
                if (res) {
                    this.clearCartting();
                    this.clearMember();
                    this.$app.setLocalStorage('token', res.access_token);
                    this.$app.setLocalStorage('user_Info', res.userinfo);
                    // if (item.isStore) {
                    //     this.handleStore('salesroom/blockedOutEntry');
                    // } else {
                    //     window.location.replace(this.$app.getOrigin() + '/cashier/index.html#/');
                    // }
                    this.$app.deleteLocalStorage('menuJson');
                    this.GetMenuList();
                    this.decodeJurisdiction();
                    if (this.$route.path === '/cashier/' || this.$route.path === '/cashier/situation') {
                        this.$root.$emit('situationRefresh');
                    } else {
                        this.$router.push('/cashier/situation');
                    }
                }
            });
        },
        clearStoreList() {                                          // 清楚搜索条件
            this.storeSearchText = '';
            this.searchStoreList();
        },
        searchStoreList() {                                         // 搜索门店列表
            if (this.$app.isNull(this.storeSearchText)) {
                this.currStoreList = Object.assign(this.storeList);
                return
            };
            this.currStoreList = this.storeList.filter(e => e.sv_us_shortname !== null && e.sv_us_shortname.indexOf(this.storeSearchText) > -1);
        },
        handleSearchInput() {
            if (this.$app.isNull(this.storeSearchText)) return;
        },
        handleLoginout() {                                         // logo选择退出弹窗
            if (this.cashierJurisdiction.succession && this.isOnFrontCashier) return this.handoverStatus = true;
            this.popLoginout();
        },
        closeHandoverDialog() {                                    // 关闭退出交接班弹窗
            this.handoverStatus = false;
        },
        popLoginout() {
            this.closeHandoverDialog();
            window.localStorage.clear();
            window.location.href = this.$app.getOrigin();
        },
        handleHandover() {                                          // 跳转交接班页
            this.closeHandoverDialog();
            if (this.$route.path === '/cashier/handover') return;
            this.$router.push('/cashier/handover');
        },
        handleStoreReconciliation() {                               // 跳转营业日报
            this.closeHandoverDialog();
            if (this.$route.path === '/cashier/storeReconciliation') return;
            this.$router.push('/cashier/storeReconciliation');
        },
        handleIconClick(item) {                                      // 改变选中的icon
            if (item.name === '核销') {
                this[item.fnName] = true;
                return
            }
            if (this.$app.isNull(item.url) || this.$route.path === item.url) {
                return
            }
            this.$router.push({
                path: item.url
            });
        },
        handelSetting() {
            if (this.$route.path.indexOf('setting') > -1) return;
            this.$router.push({
                path: '/cashier/setting?menuPos=-1'
            });
        },
        handleLeftStatus() {                                       // 控制左边栏显示状态
            this.mainLeftShow = !this.mainLeftShow;
        },
        handleCloseMember(dataList) {                              // 关闭会员弹窗次卡选择触发的数据
            this.memberListStatus = false;
            if (this.userInfo.sv_us_industrytype === 1 && this.isInCartting) {
                if (dataList.length === 0 && this.carttingData.productResults.length === 0) return;
                let dataArray = [];
                dataList.forEach(e => {
                    for (var i = 0; i < e.number; i++) {
                        let goodsItem = {
                            productId: e.product_id,
                            setmealId: e.userecord_id,
                            number: 1,
                            tastes: null,
                            chargings: null,
                            specs: null,
                        }
                        dataArray.push(goodsItem);
                    }
                });
                let carttingData = JSON.parse(JSON.stringify(this.carttingData));
                carttingData.productResults = carttingData.productResults.map(cart => {
                    let hasItem;
                    for (let index = 0; index < dataArray.length; index++) {
                        if (cart.productId === dataArray[index].productId) {
                            hasItem = dataArray[index];
                            dataArray.removeByIndex(index);
                            break
                        }
                    }
                    return {
                        ...cart,
                        buyStepPromotion: null,
                        setmealId: this.$app.isNull(hasItem) ? null : hasItem.setmealId
                    }
                });

                carttingData.productResults = carttingData.productResults.concat(dataArray);
                this.memberCardUpdateCartting(carttingData);
            }
        },
        handlePriceChangeBack(val) {                               // 改价弹窗点击确定回调
            // this.carttingData.productResults[this.carttingSelectedPos].productChangePrice = this.$app.moneyFixed(val);
            let data = JSON.parse(JSON.stringify(this.carttingData));
            if (this.priceChangeType === 1) {
                // 改售价
                data.productResults[this.carttingSelectedPos].productChangePrice = this.$app.moneyFixed(val);
                data.productResults[this.carttingSelectedPos].productChangeMoney = null;
            } else {
                // 改小计
                data.productResults[this.carttingSelectedPos].productChangePrice = null;
                data.productResults[this.carttingSelectedPos].productChangeMoney = this.$app.moneyFixed(val);
            }
            data.productResults[this.carttingSelectedPos].tradePrice = null;
            this.updateCartting(data);
        },
        handleNumberChange(e) {                                    // 修改商品数量点击确定回调
            // this.carttingData.productResults[this.carttingSelectedPos].number = e;
            let data = JSON.parse(JSON.stringify(this.carttingData));
            if (data.productResults[this.carttingSelectedPos].appraiseNumber) {
                if (e > data.productResults[this.carttingSelectedPos].appraiseNumber) {
                    this.$confirm('此菜品已估清，最多只能点' + data.productResults[this.carttingSelectedPos].appraiseNumber, '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false
                    }).then(() => {

                    }).catch(() => {

                    });
                    return
                }
            }
            data.productResults[this.carttingSelectedPos].number = parseFloat(e);
            this.updateCartting(data);
        },
        handleGoodsActivitySelected() {                            // 满送 加价购点击确定回调
            this.update({
                key: 'caleStep',
                data: 3
            });
            this.isGoodsActivityStatus = false;
            this.caleCarttingGiveData();
        },
        GetMessageBox_info() {                                     // 检查当前登录的账号是否存在公告
            stockApi.GetMessageBox_info({ type: 'Web' }).then(data => {
                if (!this.$app.isNull(data)) {
                    this.entityLogUpdate = {
                        title: data.sv_message_title,
                        dateTime: this.$app.isNull(data.sv_creation_date) ? '' : this.$app.currentTime(new Date(data.sv_creation_date), 'yyyy.MM.dd HH:mm:ss'),
                        weekTime: this.$app.isNull(data.sv_creation_date) ? '' : this.$app.convertWeek(data.sv_creation_date),
                        content: data.sv_message_content
                    };
                    this.isLogUpdate = true;
                    this.$nextTick(() => { !this.$app.isNull(this.$refs.logupdate_scrollbar) && this.$refs.logupdate_scrollbar.update(); })
                }
            })
        },
        GetMenuList() {                         // 获取菜单
            if (!this.$app.isNull(this.$app.getLocalStorage('menuJson'))) {
                this.menuJson = this.$app.getLocalStorage('menuJson');
                this.update({
                    key: 'menuJson',
                    data: this.menuJson
                });
                return
            }
            stockApi.GetMenuList({ sv_versionid: this.userInfo.versionId, sv_versionname: this.userInfo.sv_versionname }).then(data => {
                this.menuJson = this.$app.isNull(data) ? [] : data;
                this.$app.setLocalStorage('menuJson', this.menuJson);
                this.update({
                    key: 'menuJson',
                    data: this.menuJson
                });
                if (this.menuJson.findIndex(e => e.menu_path === '/cashier/2return') > -1) {
                    this.currentMenu = this.currentMenu.map(item => {
                        return {
                            ...item,
                            name: item.url === '/cashier/return' ? '退换' : item.name,
                        }
                    })
                }
                const itemStoreReconciliation = this.menuJson.find(e => e.menu_path === '/cashier/storeReconciliation')
                if (itemStoreReconciliation) {
                    this.hasStoreReconciliation = itemStoreReconciliation.sv_enabled;
                }
                // 获取收银权限

                let industryCode = 'FrontManage';
                if (this.userInfo.sv_us_industrytype === 27) {
                    industryCode = this.$route.path === '/cashier/lightMeal' ? 'CashierlightMeal' : 'Catering';
                }
                let permissionItem = this.menuJson.find(e => e.menu_code === industryCode);
                if (this.$app.isNull(permissionItem)) return
                let query = {
                    module_code: permissionItem.menu_code,
                    sp_grouping_id: this.userInfo.sp_grouping_id
                }
                stockApi.getPermissions_Client(query).then(res => {
                    if (res) {
                        this.setPermission({
                            key: 'CashierManage',
                            data: res
                        })
                        return
                    }
                    console.log('未获取到权限');
                });
            })
        },
    }
}
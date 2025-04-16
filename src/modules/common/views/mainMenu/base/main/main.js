import { multiPage } from '@/components/index';
export default {
    components: { multiPage },
    data() {
        return {
            selected: '', 						// 当前的路由路径
            multiPageList: [],
            systemMenu: [
                {
                    name: this.$t('nav.home'),
                    icon: 'icon-home',
                    href: '/home'
                },
                {
                    name: this.$t('nav.nav1'),
                    icon: 'icon-zhupeifangguanli',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav1_1'), isHide: true, isDebug: true, href: '/formulaLibrary' },
                    ],
                },
                {
                    name: this.$t('nav.nav2'),
                    icon: 'icon-zhanghu',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav2_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav2_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav2_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: this.$t('nav.nav2_4'), isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: this.$t('nav.nav2_5'), isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                        { name: this.$t('nav.nav2_6'), isHide: true, isDebug: true, href: '/report/commoditySalesAnalysis' },
                    ],
                },
                {
                    name: this.$t('nav.nav3'),
                    icon: 'icon-shezhi',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav3_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav3_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav3_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                    ],
                },
                {
                    name: this.$t('nav.nav4'),
                    icon: 'icon-shezhi',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav4_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                    ],
                },
                {
                    name: this.$t('nav.nav5'),
                    icon: 'icon-yifahuo',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav5_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav5_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                    ],
                },
                {
                    name: this.$t('nav.nav6'),
                    icon: 'icon-caigou',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav6_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                    ],
                },
                {
                    name: this.$t('nav.nav7'),
                    icon: 'icon-gouwudai',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav7_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav7_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav7_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: this.$t('nav.nav7_4'), isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: this.$t('nav.nav7_5'), isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                    ],
                },
                {
                    name: this.$t('nav.nav8'),
                    icon: 'icon-lei-huaxueyuanliao',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav8_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav8_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav8_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: this.$t('nav.nav8_4'), isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: this.$t('nav.nav8_5'), isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                        { name: this.$t('nav.nav8_6'), isHide: true, isDebug: true, href: '/report/commoditySalesAnalysis' },
                    ],
                },
                {
                    name: this.$t('nav.nav9'),
                    icon: 'icon-cangkuguanli-',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav9_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav9_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                    ],
                },
                {
                    name: this.$t('nav.nav10'),
                    icon: 'icon-shezhi',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav10_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav10_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav10_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                    ],
                },
                {
                    name: this.$t('nav.nav11'),
                    icon: 'icon-shezhi',
                    showChild: false,
                    children: [
                        { name: this.$t('nav.nav11_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                        { name: this.$t('nav.nav11_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                        { name: this.$t('nav.nav11_3'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: this.$t('nav.nav11_4'), isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: this.$t('nav.nav11_5'), isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                        { name: this.$t('nav.nav11_6'), isHide: true, isDebug: true, href: '/report/commoditySalesAnalysis' },
                        { name: this.$t('nav.nav11_7'), isHide: true, isDebug: true, href: '/report/antiCheckout' },
                        { name: this.$t('nav.nav11_8'), isHide: true, isDebug: true, href: '/report/itemPresentationReport' },
                        { name: this.$t('nav.nav11_9'), isHide: true, isDebug: true, href: '/report/itemDiscountReport' },
                        {
                            name: this.$t('nav.nav11_10'),
                            isHide: true,
                            isDebug: true,
                            href: '/report/commoditySalesAnalysis',
                            children: [
                                { name: this.$t('nav.nav11_10_1'), isHide: true, isDebug: true, href: '/report/salesFlow' },
                                { name: this.$t('nav.nav11_10_2'), isHide: true, isDebug: true, href: '/report/returnReport' },
                            ]
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        breadcrumb() {
            // 面包屑导航
            let list = [...this.$route.meta.pageName];
            if (list.length < 2) return list;
            if (this.$route.query.type && !this.$app.isNull(this.$route.meta.name)) {
                const item = this.$route.meta.name.find((e) => e.type === this.$route.query.type);
                if (item) {
                    list[1].name = item.name;
                }
            }
            return list;
        },
        isHome() {
            return this.selected === '/report/reportCensus'
        },
    },
    watch: {
        '$route': {
            deep: true,
            immediate: true,
            handler(newval, oldval) {
                this.selected = newval.path;
                const currentPage = this.multiPageList.find(e => e.url === newval.path);
                // console.log(this.multiPageList.map(e => e.pageCode));
                this.systemMenu.forEach(subItem => {
                    if ((subItem.children || []).findIndex(e => e.href === this.selected) > -1) {
                        subItem.showChild = true;
                    } else {
                        subItem.showChild = false;
                    }
                });
                if (!currentPage && newval.path !== '/report/reportCensus') {
                    this.multiPageList.push({
                        url: newval.path,
                        pageCode: newval.name,
                        name: newval.meta.pageName
                    });
                }
            },
        },
    },
    mounted() {
        this.selected = this.$route.path; // 获取路由路径
        // console.log(this.$t('reports.staffReports'));
    },
    methods: {
        showHome() {
            if (this.$route.path === '/report/reportCensus') return
            this.multiPageList = [];
            this.$router.replace('/report/reportCensus');
        },
        closePage(pos) {
            const selectedPageUrl = this.multiPageList[pos].url;
            if (selectedPageUrl === this.selected) {
                if (this.multiPageList.length > 1) {
                    const nextUrl = pos === this.multiPageList.length - 1 ? this.multiPageList[pos - 1].url : this.multiPageList[pos + 1].url
                    this.$router.replace(nextUrl);
                } else {
                    return
                }
            }
            this.multiPageList.splice(pos, 1)
        },
        handleChildShow(_item) {
            // 点击展开
            this.systemMenu.forEach(subItem => {
                subItem.showChild = _item.code === subItem.code ? !_item.showChild : false;
            })
            if (this.$app.isNull(_item.children)) {
                _item.href && (this.$router.push(_item.href), (this.selected = _item.href));
            }
            this.handleUpdateScroll();
        },
        onChildClick(_item, _child) {
            // 设置路由跳转
            if (this.$route.path === _child.href) return;
            _child.href && this.$router.replace(_child.href);
            this.handleUpdateScroll();
        },
        handleDownLoad() {
            if (this.$route.path === '/report/downloadReport') return;
            this.$router.replace('/report/downloadReport');
        },
        handleUpdateScroll() {
            this.$nextTick(() => {
                !!this.$refs.menuSrocll && this.$refs.menuSrocll.update()
            })
        },
    },
};
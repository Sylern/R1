const base = [
    {
        path: '/',
        name: 'index',                             // 登录
        component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/login/index.vue'),
        redirect: 'login',
        children: [
            //#region 登录
            {
                path: 'login',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */  '@/modules/common/views/base/login/login/login.vue')
            },
            {
                path: 'register',
                name: '门店管理系统',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/login/register/register.vue')
            },
            {
                path: 'mRegister',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/mobile/register/register.vue')
            },
            {
                path: 'pswReset',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/login/pswReset/pswReset.vue')
            },
            {
                path: 'm',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/mobile/register/register.vue')
            },
            {
                path: 'm/registerOk',
                meta: {
                    isNullToken: true
                },
                component: () => import( /* webpackChunkName: "baseRouter" */ '@/modules/common/views/base/mobile/registerOk/registerOk.vue')
            },
            //#endregion
        ]
    },
    // {
    //     path: "/customTemplate",
    //     name: '网店装修',
    //     meta: { breadcrumb: [{ name: '网店装修', href: '' }] },
    //     component: () => import("@/modules/common/views/applets/page/customTemplate/home.vue")
    // },
    //#endregion
]
export default base;
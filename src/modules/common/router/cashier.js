import reportNew from './reportNew';
import system from './system';
const cashier = [
    {
        path: "/cashier",
        component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/mainMenu/base/main/main.vue'),
        children: [
            {
                path: '/home',
                name: "home",
                meta: { isDebug: true, pageName: '首页', },
                component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/mainMenu/home/home.vue')
            },
            {
                path: 'situation',
                name: 'situation',                          // 店铺概况
                component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/base/situation/situation.vue')
            },
            ...system,
            ...reportNew
        ]
    },
    {
        path: "/customScreen",
        component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/mainMenu/page/customScreen/customScreen.vue'),
    }
    //#endregion
]
export default cashier;
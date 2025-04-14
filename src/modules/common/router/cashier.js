import reportNew from './reportNew';
const cashier = [
    {
        path: "/cashier",
        component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/mainMenu/base/main/main.vue'),
        children: [
            {
                path: '/',
                component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/base/situation/situation.vue')
            },
            {
                path: 'situation',
                name: 'situation',                          // 店铺概况
                component: () => import( /* webpackChunkName: "cashierRouter" */ '@/modules/common/views/base/situation/situation.vue')
            },
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
const system = [
    {
        path: "/formulaLibrary",
        name: "home",
        meta: { isDebug: true, pageName: '配方库', },
        component: () => import( /* webpackChunkName: "systemRouter" */ '@/modules/common/views/system/formulaLibrary/formulaLibrary.vue'),
    }
    //#endregion
]
export default system;
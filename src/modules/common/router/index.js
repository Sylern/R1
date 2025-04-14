// import Vue from "vue";
// import Router from "vue-router";

import base from './base';
import cashier from './cashier';
import $app from '@/utils/utils';
import resetMessage from '@/utils/resetMessage.js';


Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
    routes: [
        ...base,
        ...cashier,
        //#endregion
    ]
});

router.beforeEach((to, from, next) => { // 跳转之前截取
    document.title = $app.getLocalStorage('distributor_id') === 1 ? '德客门店管理系统' : '门店管理系统';
    if (to.meta.breadcrumb && to.query.type && to.meta.name) {
        if (to.meta.name.findIndex(e => e.type === to.query.type) > -1)
            to.meta.breadcrumb[to.meta.breadcrumb.length - 1].name = to.meta.name.find(e => e.type === to.query.type).name;
    }
    let menuJson = $app.getLocalStorage('menuJson') || [];
    const defaultPathArray = ['/register', '/pswReset', '/cashier/', '/cashier/situation', '/cashier/home', '/cashier/pageNesting', '/customScreen', '/cashier/lightMeal']
    if (to.path === '/login' || to.path === '/authLogin'){
        $app.deleteLocalStorage('menuJson');
        next();
        return
    }
    if (defaultPathArray.includes(to.path)){
        next();
        return
    }
    if (to.meta.isDebug) {
        next();
        return
    }
    let item = menuJson.find(e => e.menu_path === to.fullPath || to.fullPath.indexOf(e.menu_path) > -1);
    if (item) {
        item.sv_enabled && next();
        !item.sv_enabled && resetMessage({ showClose: true, message: '版本未开放此功能，请联系客服', type: 'warning', duration: 5000 });
        return 
    }
    // next();
    resetMessage({ showClose: true, message: '版本未开放此功能，请联系客服', type: 'warning', duration: 5000 });
    
})
export default router;
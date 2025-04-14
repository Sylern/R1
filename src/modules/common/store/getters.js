import utils from '@/utils/utils';
export default {
    getLabelData: state => {                         // 获取labelData
        if (utils.isNull(state.labelData))
            return utils.isNull(utils.getSession('labelData')) ? [] : utils.getSession('labelData');
        return state.labelData;
    },
    getProductQueryEntity: state => {
        if (utils.isObject(state.ProductQueryEntity))
            return utils.isNull(utils.getSession('ProductQueryEntity')) ? {} : utils.getSession('ProductQueryEntity');
        return state.ProductQueryEntity;
    },
    getqueryProductList: state => {
        if (utils.isNull(state.queryProductList.shopId))
            state.queryProductList.shopId = utils.isNull(state.queryProductList.shopId) ? state.userInfo.user_id + '' : state.queryProductList.shopId;
        return state.queryProductList;
    },
    memberText: state => {
        return state.userInfo.sv_us_industrytype === 11 ? '学员' : '会员'
    },
    hasStoreCard: state => {
        const menuJson = utils.getLocalStorage('menuJson');
        return (menuJson || []).findIndex(e => e.menu_path === '/memberCenter/storeCardList') > -1;
    },
    hasProgramAssistant: state => {
        const menuItem = (state.menuJson || []).find(e => e.menu_path === '/staffManagement/programAssistant');
        if (menuItem) return menuItem.sv_enabled
        return false
    },
    hasAdmissionCard: state => {
        const menuJson = utils.getLocalStorage('menuJson');
        return (menuJson|| []).findIndex(e => e.menu_path === '/cardManage/admissionCard') > -1;
    },
    hasReturnOrExchange: state => {                  // 实付支持退换货
        const menuJson = utils.getLocalStorage('menuJson');
        return (menuJson || []).findIndex(e => e.menu_path === '/cashier/2return') > -1;
    },
}

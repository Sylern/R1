import $ from '@/utils/http';
import { loadingData } from "@/utils/config/config.js";
import utils from '@/utils/utils.js';
// let base = utils.getCookie('apiBase');
import base from '@/api/base';
export const getStoreInfo = (data, loadingType = false) => {                                 /* 店铺信息 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/GetStoreInfo', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetMenuList = (data, loadingType = false) => {                                     /* 获取菜单 */
    return $.Ajax({ url: base.permissionApi + '/api/Permission/GetMenuList', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getPermissions_Client = (data, loadingType = false) => {                           /* 操作权限接口 */
    return $.Ajax({ url: base.permissionApi + '/api/Permission/GetPermissions_Client', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在登录中...' } });
}
export const GetBranchStoreSwitch = (data, loadingType = false) => {                                /* 门店切换查询 */
    return $.Ajax({ url: base.systemApi + '/api/BranchStoreNew/GetBranchStoreSwitch', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getUserModuleConfigs = (data, loadingType = false) => {                            /* 获取配置列表 */
    return $.Ajax({ url: base.cashierApi + '/api/UserModuleConfig/GetUserModuleConfigs', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetUserModuleList = (data, loadingType = true) => {                                /* 获取客显配置 */
    return $.Ajax({ url: base.systemApi + '/api/UserModuleConfig/GetUserModuleList', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
//#endregion
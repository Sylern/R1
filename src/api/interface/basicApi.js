import $ from '@/utils/http';
import { loadingData } from "@/utils/config/config.js";
import base from '@/api/base';
// import utils from '@/utils/utils.js';
// let base = utils.getCookie('apiBase');

export const loginSuccessJump = () => {                                                     /* 登录成功跳转 */
    return base.domainUrl + '/cashier/index.html#/'
}
//#region 登录接口
export const getWebGetSiteConfig = (data, loadingType = false) => {                         /* 获取服务器时间戳 判断站点是德客还是OEM */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/GetSiteConfig', method: 'GET', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetDstributorConfig = (data, loadingType = false) => {                         /* ds获取服务器时间戳 判断站点是德客还是OEM */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/GetDstributorConfig', method: 'GET', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const postWebUserLogin = (data, loadingType = false) => {                            /* 账号密码登录 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/UserLogin', method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在登录中...' } });
}
export const GetLoginVierificationCode = (data, loadingType = false, code = false) => {     /* 登录图形验证码 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/GetLoginVierificationCode', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在登录中...' } });
}
export const postWebUserRegister = (code, data, loadingType = false) => {                   /* 注册账号 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/WebUserRegister?code=' + code, method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const postWebSendsmsreg = (data, code, loadingType = false) => {                     /* 发送注册短信验证码 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/WebSendsmsreg', method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在发送短信验证码...' } });
}
export const postWebSendReSetSms = (data, loadingType = false) => {                         /* 发送密码重置短信验证码 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/WebSendReSetSms', method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在发送短信验证码...' } });
}
export const webSendsmsregLogin = (data, code, loadingType = false) => {                    /* 一部手机逛商圈登录发送短信验证码 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/WebSendsmsregLogin', method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在发送短信验证码...' } });
}
export const userLoginCaptcha = (data, loadingType = false) => {                            /* 一部手机逛商圈登录 */
    return $.Ajax({ url: base.basicApi + '/api/WebLogin/UserLoginCaptcha', method: 'POST', NotToken: true, params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在登录中...' } });
}
export const postWebResetPwd = (code, password, moble, loadingType = false) => {            /* 密码重置 */
    return $.Ajax({ url: base.basicApi + `/api/WebLogin/WebResetPwd?code=${code}&password=${password}&moble=${moble}`, method: 'POST', NotToken: true, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const postCheckoutCode = (code, moble, loadingType = false) => {                     /* 对比验证码 */
    return $.Ajax({ url: base.basicApi + `/api/WebLogin/checkoutCode?code=${code}&moble=${moble}`, method: 'POST', NotToken: true, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const islogin = (data, loadingType = false) => {                                     /* 获取登录用户信息 */
    return $.Ajax({ url: base.basicApi + `/api/Login/Islogin`, method: 'POST', loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getIndustryType = (data, loadingType = false, code = false) => {               /* 获取行业数据 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/Getindustrytype', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在登录中...' } });
}
export const updateStoreInfo = (data, code, loadingType = false) => {                       /* 保存行业信息 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/UpdateStoreInfo', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
//#endregion


//#region 发送公告/消息推送
export const getMessageBoxInfo = (data, loadingType = true) => {                            /* 获取当前账号的所有消息 */
    return $.Ajax({ url: base.basicApi + '/api/MessageBox/GetMessageBoxInfo', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const postInsertToSystemMessageBox = (data, loadingType = false) => {                /* 新增公告消息 */
    return $.Ajax({ url: base.basicApi + '/api/MessageBox/InsertToSystemMessageBox', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const postUpdateSystemMessageBox = (data, loadingType = false) => {                  /* 修改公告消息 */
    return $.Ajax({ url: base.basicApi + '/api/MessageBox/UpdateSystemMessageBox', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getMessageBoxDetailInfo = (data, loadingType = false) => {                     /* 获取公告详情 */
    return $.Ajax({ url: base.basicApi + '/api/MessageBox/GetMessageBoxDetailInfo', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const deleteMessageBox = (data, loadingType = false) => {                            /* 删除公告信息 */
    return $.Ajax({ url: base.basicApi + '/api/MessageBox/DeleteMessageBox', method: 'DELETE', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
//#endregion

//#region 
export const getCategory = (data, loadingType = false) => {                                 /* 获取分类 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/GetCategory', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetCategory_list = (data, loadingType = false) => {                            /* 根据门店获取分类id */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/GetCategory_list', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const addCategory = (data, loadingType = false) => {                                 /* 添加分类 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/AddCategory', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const isCategory = (data, loadingType = false) => {                                  /* 判断分类是否在使用 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/IsCategory', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const deleteCategory = (data, loadingType = false) => {                              /* 删除分类 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/DeleteCategory', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getCategoryCartogram = (data, loadingType = false) => {                        /* 获取图表数据 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/GetCategoryCartogramTwo', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getexpenditureList = (data, loadingType = false) => {                          /* 获取支出记录 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/GetExpenditureList', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const PostExpenditureList = (data, loadingType = false) => {                         /* 获取支出记录 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/PostExpenditureList', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const addExpenditure = (data, loadingType = false) => {                              /* 添加支出 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/AddExpenditure', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getExpenditureCount = (data, loadingType = false) => {                         /* 获取支出总数据 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/GetExpenditureCount', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const deleteExpenditureNo = (data, loadingType = false) => {                         /* 添加支出 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/DeleteExpenditureNo', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const exportData = (data, loadingType = true) => {                                  /* 导出记录 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/ExportData', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在导出报表...' } });
}
export const PostExportData = (data, loadingType = true) => {                                  /* 导出记录 */
    return $.Ajax({ url: base.basicApi + '/api/Expenditure/PostExportData', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType, name: '正在导出报表...' } });
}
//#endregion

//#region 店铺概况

export const setSalesclerkCash = (data, loadingType = true) => {                             /* 设置交接班备用金 */
    return $.Ajax({ url: base.basicApi + '/System/SetSalesclerkCashMoney?cashmoney=' + data, method: 'POST', loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getMessageBoxList = (data, loadingType = true) => {                             /* 获取系统消息 messageType = 5-更新日志 1-业务消息 2-系统消息 */
    return $.Ajax({ url: '/MessageBox/GetMessageBoxList', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getStoreInfo = (data, loadingType = false) => {                                 /* 店铺信息 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/GetStoreInfo', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomePageLine = (data, loadingType = false) => {                              /* 近30天趋势 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomePageLine', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getShopHomeChartConfig = (data, loadingType = false) => {                       /* 读取门店首页图表配置 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/GetShopHomeChartConfig', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const setShopHomeChartConfig = (data, loadingType = false) => {                       /* 设置门店首页图表配置 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/SetShopHomeChartConfig', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoA = (data, loadingType = false) => {                        /* 获取店铺概况数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoA', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoB = (data, loadingType = false) => {                        /* 获取销售分析数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoB', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoC = (data, loadingType = false) => {                        /* 获取C1-店铺业绩 C2-支付方式 C3-员工销售排行 C4-支出分析 数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoC', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoE = (data, loadingType = false) => {                        /* 获取会员构成数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoE', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoF = (data, loadingType = false) => {                        /* 获取会员消费排行榜数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoF', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getHomepageModuleTwoG = (data, loadingType = false) => {                        /* 获取热销商品排行榜数据 */
    return $.Ajax({ url: base.basicApi + '/api/HomePageModule/HomepageModuleTwoG', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getReservationlist = (data, loadingType = false) => {                           /* 预约列表 */
    return $.Ajax({ url: base.basicApi + '/api/ReservationApi/GetReservationlist', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getMarketingPlatform = (data, loadingType = false) => {                         /* 常用功能 更多服务 营销工具权限 */
    return $.Ajax({ url: base.basicApi + '/api/UserModuleConfig/MarketingPlatform', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getUserPortrait = (data, loadingType = false) => {                              /* 获取客服信息 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/GetUserPortrait_img', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getAgentConfig = (data, loadingType = false) => {                               /* 获取客服信息 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/Getsv_agent_custom_config', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GeUserBasicData = (data, loadingType = false) => {                              /* 查询店铺基础数据 */
    return $.Ajax({ url: base.basicApi + '/api/StoreCenter/GeUserBasicData', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getMessage_Record_List = (data, loadingType = false) => {                       /* 查询反馈记录列表 */
    return $.Ajax({ url: base.basicApi + '/api/FeedBack_MessageApi/GetMessage_Record_List', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const updateBack_Message_Recor = (data, loadingType = false) => {                     /* 更新反馈点评 */
    return $.Ajax({ url: base.basicApi + '/api/FeedBack_MessageApi/UpdateBack_Message_Recor', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const addFeedBack_Message = (data, loadingType = false) => {                          /* 创建-添加反馈消息 */
    let serveUrlPath = data.sv_feedback_message_id === 0 ? 'AddFeedBack_Message' : 'AddFeedBack_Message_Record';
    return $.Ajax({ url: base.basicApi + '/api/FeedBack_MessageApi/'+ serveUrlPath, method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getFeedBack_Message_Record_List = (data, loadingType = false) => {              /* 查询单个反馈 */
    return $.Ajax({ url: base.basicApi + '/api/FeedBack_MessageApi/GetFeedBack_Message_Record_List', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}


//#endregion 

//#region 发送公告/消息推送
/**
 * headers = {'Content-Type': 'application/json'} queryString 传参  { 'Content-Type': 'multipart/form-data' } body 传参
 * 默认 queryString 传参
 */
function _request({ url, params = {}, method = 'GET', loadingType = true, headers } = {}) {
    return $.Ajax(Object.assign({
        url: base.basicApi + url,
        method: method,
        params: params,
        loadingData: { ...loadingData, isLoding: loadingType }
    }, headers ? { headers } : {})
    )
}

export const getPCD = () => {                       /* 获取省,市 */
    return _request({
        url: "/api/MemberInterestsCard/GetPCDList"
    })
}

export const getProvinces = () => {                 /** 获取省 */
    return _request({
        url: "/api/HardwareStore/GetPCD",
        params: { id: 1 }
    }).then(res => {
        return res && res.values ? res.values : Promise.reject(res.errmsg || res)
    })
}
//code 省编码
export const getCitys = (code) => {
    return _request({
        url: "/api/HardwareStore/GetCityInterlock",
        params: { id: code }
    }).then(res => {
        return res && res.values ? res.values : Promise.reject(res.errmsg || res)
    })
}
//code 市编码
export const getDistricts = (code) => {
    return _request({
        url: "/api/HardwareStore/GetDistrictInterlock",
        params: { id: code }
    }).then(res => {
        return res && res.values ? res.values : Promise.reject(res.errmsg || res)
    })
}
//#endregion

//#region 基本接口
export const getEmployeePageList = (data, loadingType = false) => {                          /* 查询员工列表 */
    return $.Ajax({ url: base.basicApi + '/System/GetEmployeePageList', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const getEmployeePageListV2 = (data, loadingType = false) => {                        /* 查询员工列表 */
    return $.Ajax({ url: base.basicApi + '/System/GetEmployeePageListV2', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
//#endregion


//#region 艺陪行业概况
export const GetOverviewSummary = (data, loadingType = false) => {                          /* 查询员工列表 */
    return $.Ajax({ url: base.basicApi + '/api/ProductClassHourApi/GetOverviewSummary', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetMemberAnalyseSource = (data, loadingType = false) => {                          /* 学员来源分析 */
    return $.Ajax({ url: base.basicApi + '/api/ProductClassHourApi/GetMemberAnalyseSource', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetMemberAnalyse = (data, loadingType = false) => {                          /* 学员分析汇总 */
    return $.Ajax({ url: base.basicApi + '/api/ProductClassHourApi/GetMemberAnalyse', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetMemberClassAnalyse = (data, loadingType = false) => {                          /* 学员上课分析汇总 */
    return $.Ajax({ url: base.basicApi + '/api/ProductClassHourApi/GetMemberClassAnalyse', method: 'POST', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
export const GetMemberCourseDailySummary = (data, loadingType = false) => {                          /* 售课/消课/学员情况 */
    return $.Ajax({ url: base.basicApi + '/api/ProductClassHourApi/GetMemberCourseDailySummary', method: 'GET', params: data, loadingData: { ...loadingData, isLoding: loadingType } });
}
//#endregion
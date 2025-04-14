import env from '@/utils/config/env.json';
const serveUrl = 'http://soft.dev.decerp.cc:6681';
const proxyUrl = '/api/';
const testApiUrl = env.apiPrefix === undefined ? '//api.test.decerp.cc' : '//' + env.apiPrefix + '.decerp.cc';
const buildApiUrl = '//wpf.decerp.cc';
const apiconfig = {
    serve: {                                // 本地运行地址
        stockApi: serveUrl,                                                             // 库存管理  
        basicApi: serveUrl,                                                             // 基础页面接口 
        permissionApi: '//permission.test.decerp.cc',                                   // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
    test: {                                 // 85测试地址 
        stockApi: testApiUrl,                                                           // 库存管理  
        basicApi: testApiUrl,                                                           // 基础页面接口 
        permissionApi: '//permission.test.decerp.cc',                                   // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
    build: {                                // 正式地址
        stockApi: buildApiUrl,                                                          // 库存管理  
        basicApi: buildApiUrl,                                                          // 基础页面接口 
        permissionApi: '//permission.test.decerp.cc',                                   // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
    proxy: {                                // 本地测试地址
        stockApi: proxyUrl,                                                             // 库存管理  
        basicApi: proxyUrl,                                                             // 基础页面接口 
        permissionApi: '//permission.test.decerp.cc',                                   // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
}
export default apiconfig[env.env];
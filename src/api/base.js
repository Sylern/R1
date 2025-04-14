import env from '@/utils/config/env.json';
const serveUrl = '//wpf.decerp.cc';
const apiconfig = {
    serve: {                                // 本地运行地址
        stockApi: serveUrl,                                                             // 库存管理  
        basicApi: serveUrl,                                                             // 基础页面接口 
        permissionApi: '//permission.test.decerp.cc',                                   // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
    test: {                                 // 85测试地址 
        stockApi: serveUrl,                                                             // 库存管理  
        basicApi: serveUrl,                                                             // 基础页面接口 
        permissionApi: '//permission.decerp.cc',                                        // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
    build: {                                // 正式地址
        stockApi: serveUrl,                                                             // 库存管理  
        basicApi: serveUrl,                                                             // 基础页面接口 
        permissionApi: '//permission.decerp.cc',                                        // 权限配置
        frontImgBase: '//ds.decerp.cc',                                                 // 前端图片路径
        imgUrl: '//res.decerp.cc',                                                      // 图片路径
    },
}
export default apiconfig[env.env];
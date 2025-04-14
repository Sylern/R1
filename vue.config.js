const path = require("path");
const fs = require("fs");
const glob = require("glob");
const projectname = process.argv[3];
const apiconfig = process.argv[2];
const resolve = dir => { return path.join(__dirname, dir) }
const BASE_URL = process.env.NODE_ENV === "production" ? "./" : "/"; // ?生产:测试

function getEntry() {
    var entries = {}
    if (process.env.NODE_ENV == 'production') {                     // 生成
        if (projectname === undefined) {           // 统一
            glob.sync('./src/modules/**?/*.vue').forEach(item => {
                const entry = item.replace('App.vue', 'main.js');
                let fileList = item.split('/');
                let filename = fileList[fileList.length - 2];
                entries[filename] = {
                    entry: entry,
                    template: 'public/index.html',
                    filename: `${filename}.html`
                }
            })

        } else {                                    // 分模块
            entries[projectname] = {
                entry: 'src/modules/' + projectname + '/main.js',
                template: 'public/index.html',
                filename: 'index.html',
                title: projectname
            }
        }
    } else {                                       // 测试
        var items = glob.sync('./src/modules/**?/*.vue')
        for (var i in items) {
            var filepath = items[i]
            var fileList = filepath.split('/');
            var fileName = fileList[fileList.length - 2];
            entries[fileName] = {
                entry: `src/modules/${fileName}/main.js`,
                // 模板来源
                template: `public/index.html`,
                // 在 dist/index.html 的输出
                filename: `${fileName}.html`,
                // 提取出来的通用 chunk 和 vendor chunk。
                chunks: ['chunk-vendors', 'chunk-common', fileName]
            }
        }
    }
    return entries
}
const pages = getEntry();
module.exports = {
    publicPath: BASE_URL,
    outputDir: projectname === undefined ? 'dist' : 'dist/' + projectname,         // 打包生成的生产环境构建文件的目录
    indexPath: "index.html",                                                       // 指定生成的 index.html 输入路径，默认outputDir
    pages,
    productionSourceMap: false,                                                    // 开启 生产环境的 source map?
    lintOnSave: false,
    configureWebpack: config => {
        if (apiconfig.trim() === 'serve') {
            fs.writeFileSync("./src/utils/config/env.json", JSON.stringify({ env: process.env.apiconfig }));
        }
        config.externals = {
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT',
            echarts: 'echarts',
            axios: 'axios'
        }

    },
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src")).set("_c", resolve("src/components"));  // 配置路径别名
        // 去掉 prefetch 预加载模块
        let array = [
            'common'
        ]
        array.forEach(e => { config.plugins.delete('prefetch-' + e); config.plugins.delete('preload-' + e); })
    },
    css: {
        requireModuleExtension: true,   // 启用 CSS modules
        // extract: true,               // 是否使用css分离插件  true 编译的时候不会热更新 false 编译的时候会热更新 默认是false
        sourceMap: false,               // 开启 CSS source maps? 
        loaderOptions: {                // css预设器配置项
            postcss: {                          // 配置自定义组件插件
                plugins: [
                    require("postcss-relaxed-unit")({       // 1px=1rx=0.01rem 插件必须要require引入配置 一般只使用一种  
                        rules: { rx: "div(100).unit(rem)" }
                    }),
                    require("postcss-relaxed-unit")({       // 1px=2rpx=0.02rem 插件-手机端2倍图计算，宽度750px图，对应375px，200px图片对应200rpx，在375宽度下对应100px
                        rules: { rpx: "div(200).unit(rem)" }
                    })
                ]
            }
        }
    },
    devServer: {
        open: true,
        hot: true,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        // port: 8080, // 端口
        proxy: {
            //设置代理
            "/api/": {
                target: "http://api.test.decerp.cc/",             // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写，
                    "^/api/": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/mapApi": {
                target: "https://apis.map.qq.com", // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写，
                    "^/mapApi": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/execlApi": {
                target: "http://execl.decerp.cc", // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写，
                    "^/execlApi": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/stockApi": {
                target: "http://119.23.132.106:1001", // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写，
                    "^/stockApi": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/stockApi": {
                target: "https://school.decerp.cc", // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写，
                    "^/stockApi": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/domainApi": {
                target: "http://192.168.1.69:2383", // 你请求的第三方接口
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写， http://192.168.1.69:2383/domain.json
                    "^/domainApi": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/upload": {
                target: "http://res.decerp.cc", // 你请求的第三方接口 
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写， http://192.168.1.69:2383/domain.json
                    "^/upload": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            },
            "/ApiFile":{
                target: "http://119.23.109.6:9268", // 你请求的第三方接口 
                changeOrigin: true,
                pathRewrite: {
                    // 路径重写， http://192.168.1.69:2383/domain.json
                    "^/ApiFile": "" // 替换target中的请求地址，也就是说以后你在请求http://elderlyweixin.shfusion.com/XXXXX这个地址的时候直接写成/api/XXXXX即可。
                }
            }
        },
        before: app => {
            app.get('/', (req, res) => { for (const i in pages) { res.write(`<a target="_self" href="/${i}">/${i}</a></br>`) } res.end(); })
        }
    }
};

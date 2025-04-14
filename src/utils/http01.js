
import { Message, Loading } from 'element-ui';
import com from '@/utils/utils.js';
import resetMessage from './resetMessage.js';
// import axios from 'axios';
import qs from 'qs';
import base from '@/api/base.js';

// 自定义判断元素类型JS
const toType = (obj) => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
const filterNull = (o) => {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

const queue = [];
var loading;
const header = { 'content-type': 'application/json; charset=utf-8' }
// const header = { 'Content-Type': 'application/x-www-form-urlencoded' }; // 不发送 OPTIONS 请求
async function apiAxios(config) {

    let token = com.getLocalStorage('token');
    let domain = config.url.split('/')[2]
    if (com.isNull(token) && !com.isNull(config.NotToken) && !config.NotToken)
        return resetMessage({ showClose: true, message: '请提供令牌（' + domain + '）', type: 'error', duration: 5000 });

    config.headers = com.isNull(config.headers) ? header : config.headers;
    const instance = axios.create();
    setLoading(config);
    config = setParams(config);
    interceptors(instance);
    return instance({
        //baseURL: config.url.split('api')[0], //请求基地址
        method: com.isNull(config.method) ? 'GET' : config.method,
        url: config.url,
        data: config.method === 'POST' || config.method === 'PUT' ? config.params : null,
        params: com.isNull(config.method) || config.method === 'GET' || config.method === 'DELETE' ? config.params : null,
        paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        },
        headers: config.headers,
        xsrfCookieName: '',
        xsrfHeaderName: '',
        responseType: com.isNull(config.responseType) ? 'json' : config.responseType,
        NotToken: com.isNull(config.NotToken) ? false : config.NotToken,
    });
}
// 判断Content-Type类型 返回params
const setParams = (config) => {
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded' && (config.method === 'POST' || config.method === 'PUT')) {
        if (config.params) {
            config.params = filterNull(config.params)
        }
        config.params = qs.stringify(config.params);
    }
    return config;
}


// 设置loading
const setLoading = (config) => {
    let { isLoding, name, fullscreen, background } = config.loadingData;
    if (!Object.keys(queue).length && isLoding) loading = Loading.service({ fullscreen: fullscreen, text: name, background: background });
    if (config.url && isLoding) queue[config.url] = true;
}

// 获取token
const interceptors = (instance) => {
    let token = com.isNull(com.getLocalStorage('token')) ? '' : com.getLocalStorage('token');
    let userId = com.isNull(com.getLocalStorage('userId')) ? '' : com.getLocalStorage('userId');
    instance.interceptors.request.use(res => {                  // 请求拦截  res.headers.key = token;
        // res.params = { key: token, ...res.params };
        // if (res.NotToken) delete res.NotToken, delete res.params.key;

        if (res.NotToken) {
            res.params = { ...res.params };
        } else {
            res.params = { key: token, ...res.params };
            res.headers.key = token;
            res.headers.UserId = userId;
        }
        let headers = com.getLocalStorage('headers')
        if (!com.isNull(headers)) res.headers.deketag = headers;
        return res;
    }, error => {
        return ErrorRequest(error);
    });

    instance.interceptors.response.use(res => {                 // 响应拦截
        if (res.config.url) destroy(res.config.url)
        const { status } = res
        if (status === 200) {                                   // 请求成功
            if (res.config.url.indexOf(base.ImportExecl) > -1) { return res.data; }
            // if (!com.isNull(res.data.msg) && (res.data.msg.indexOf('令牌失效') > -1 || res.data.msg.indexOf('Token失效') > -1 || res.data.msg.indexOf('请提供令牌') > -1)) loginTxt(res.config.url);
            // if (!com.isNull(res.data.code) && res.data.code === 401) window.parent.location.href = window.location.href.indexOf('vueview') >= 0 ? '/login' : '/#/login';

            if ((!com.isNull(res.data.code) && res.data.code !== 1) || (!com.isNull(res.data.status) && res.data.status !== 0)) {
                let message = !com.isNull(res.data.status) ? res.data.message : res.data.msg;
                let data = !com.isNull(res.data.data) ? res.data : false;
                return ErrorRequest({ data: data, message: message, type: 'error' });
            }
            if (!com.isNull(res.data.status)) return res.data.result;
            if (res.data.data === undefined) return res.data;
            return res.data.data;
        }
        return ErrorRequest(res);

    }, error => {
        if (error.config) destroy(error.config.url); return ErrorRequest(error);
    });
}


const loginTxt = (url) => {
    let userInfo = com.getLocalStorage('user_Info');
    let obj = {
        id: '',
        currentTime: com.currentTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        LoginTime: '',
        userService: url,
        accountName: userInfo.sv_us_name,
        token: com.getLocalStorage('token')
    }
    let data = { user_id: userInfo.user_id, userfeedback_content: JSON.stringify(obj) }
    axios.post(`${base.basicApi}/UserFeedback?key=` + com.getLocalStorage('token'), data).then(res => { }).catch(res => { })

}

const destroy = (url) => { delete queue[url]; if (!Object.keys(queue).length && !com.isNull(loading)) loading.close(); }
const ErrorRequest = (error) => {

    if (com.isNull(error.response)) {
        let message = error.message.replace(/(.*)(^Network Error$|令牌失效|请提供令牌)(.*)/,"$2")
        resetMessage({ showClose: true, message:message==='Network Error'?'当前网络异常，请检查网络再重试': message, type: 'error', duration: 5000 });
        if ( message === '令牌失效' || message === '请提供令牌'){
            setTimeout(() => { window.parent.location.href = window.location.href.indexOf('vueview') >= 0 ? '/login' : '/#/login'; }, 2000)
        }
        // let message = error.message === 'Network Error' ? '当前网络异常，请检查网络再重试' : error.message;
        // message = message.indexOf('令牌失效') > -1 || message.indexOf('请提供令牌') > -1 ? '会话已过期，请重新登录' : message;
        // resetMessage({ showClose: true, message: message, type: 'error', duration: 5000 });
        // if (message === '会话已过期，请重新登录')
        //     setTimeout(() => { window.parent.location.href = window.location.href.indexOf('vueview') >= 0 ? '/login' : '/#/login'; }, 2000)

    } else if (error.response && error.response.status === 401) {
        resetMessage({ showClose: true, message: '您还未登录，请去登录', type: 'error', duration: 5000 });
    } else if (error.response && error.response.status === 403) {
        resetMessage({ showClose: true, message: '账号无权限操作', type: 'error', duration: 5000 })
        resetMessage({ showClose: true, message: '网络异常 ' + error.response.status, type: 'error', duration: 3000 });
    }

    return Promise.reject(error.data)
}
export default { Ajax: (config, success) => apiAxios(config, success).catch(e => Promise.reject(e)) };
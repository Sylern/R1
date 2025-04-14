
import { Message, Loading } from 'element-ui';
import com from '@/utils/utils.js';
import resetMessage from './resetMessage.js';
import axios from 'axios';
import qs from 'qs';
import base from '@/api/base.js';

/** 当数据为空时返回默认值 */
const convertVal = function (str, defVal, type = 'string') {
    defVal = defVal == undefined ? '' : defVal
    const _actions = new Map([
        /** 默认值 */
        ['string', com.isNull(str) ? defVal : str],
        /** 开始日期 */
        ['startTime', com.isNull(str) ? defVal : str[0]],
        /** 结束日期 */
        ['endTime', com.isNull(str) ? defVal : str[1]],
        /** 取数组第一个值 */
        ['array0', com.isNull(str) ? defVal : str[0]]
    ])
    return _actions.get(type)
}

/** 剔除对象中的空值属性 */
const removeObj = function (obj) {
    return com.isNull(obj) ? {} : Array.isArray(obj) ? obj : Object.keys(obj).reduce((_arry, key) => {
        if (!com.isNull(obj[key])) _arry[key] = obj[key]
        return _arry
    }, {})
}

// HTTP request 拦截器
axios.interceptors.request.use(config => {
    /** 判断令牌是否为空 */
    const token = com.getLocalStorage('token')
    // const domain = config.url.split('/')[2]
    const _headers = com.getLocalStorage('headers')
    const userId = com.getLocalStorage('userId');
    if (com.isNull(token) && !com.isNull(config.NotToken) && !config.NotToken) {
        // resetMessage({ showClose: true, message: '请提供令牌（' + domain + '）', type: 'error', duration: 5000 })
        return Promise.reject('令牌失效')
    }
    if (!config.NotToken) {
        com.isNull(config.params) ? config['params'] = { key: token } : config.params['key'] = token
        config.headers['key'] = token
        config.headers['UserId'] = userId
    }
    if (!com.isNull(_headers)) config.headers['deketag'] = headers
    config.headers['Content-Type'] = com.isNull(config.headers['Content-Type']) ? 'application/json; charset=utf-8' : config.headers['Content-Type']
    setLoading(config)

    return config
}, error => {
    return ErrorRequest(error)
})

// HTTP response 拦截器
axios.interceptors.response.use(response => {
    const _status = response.status
    if (_status !== 200) return ErrorRequest(response)

    if (response.config.url.indexOf(base.ImportExecl) > -1) { return response.data }

    const { code, status } = response.data
    const isCode = !com.isNull(code) && code !== 1
    const isStatus = !com.isNull(status) && status !== 0
    const data = !com.isNull(response.data.data) ? response.data : false;
    if (isCode || isStatus) {
        let message = !com.isNull(response.data.status) ? response.data.message : response.data.msg;
        return ErrorRequest({ data: data, message: message, type: 'error' });
    }
    if (!com.isNull(response.data.status)) return response.data.result;
    if (response.data.data === undefined) return response.data;
    return response.data.data;
}, error => {
    return ErrorRequest(error)
})

const ErrorRequest = (error) => {
    const _actions = new Map([
        [true, () => {
            let message = (error.message || '').replace(/(.*)(^Network Error$|令牌失效|请提供令牌)(.*)/, "$2")
            resetMessage({ showClose: true, message: message === 'Network Error' ? '当前网络异常，请检查网络再重试' : message, type: 'error', duration: 5000 });
            if (['令牌失效', '请提供令牌'].includes(message)) {
                setTimeout(() => { window.parent.location.href = window.location.href.indexOf('vueview') >= 0 ? '/login' : '/#/login'; }, 2000)
            }
        }],
        [401, () => {
            resetMessage({ showClose: true, message: '您还未登录，请去登录', type: 'error', duration: 5000 })
        }],
        [403, () => {
            resetMessage({ showClose: true, message: '网络异常 ' + error.response.status, type: 'error', duration: 3000 })
        }],
        [404, () => {
            resetMessage({ showClose: true, message: error, type: 'error', duration: 5000 })
        }]
    ])
    const _key = com.isNull(error.response) ? true : error.response.status
    _actions.get(_key).apply(this)
    return Promise.reject(error.data)
}

var queue = [], loadingData;

const setLoading = (config) => {
    let { isLoding, name, fullscreen, background } = config.loadingData;
    if (!Object.keys(queue).length && isLoding) loadingData = Loading.service({ fullscreen: fullscreen, text: name, background: background });
    if (config.url && isLoding) queue[config.url] = true;
}
const destroy = (url) => {
    if (com.isNull(url)) return false
    delete queue[url]
    if (!Object.keys(queue).length && !com.isNull(loadingData)) loadingData.close();
}

function apiAxios(config) {
    return new Promise((resolve, reject) => {
        /** 获取参数 - 并处理序列化问题 */
        let _params = config.params;
        if (!com.isNull(config.headers) && config.headers['Content-Type'] === 'application/x-www-form-urlencoded' && ['POST', 'PUT'].includes(config.method))
            _params = qs.stringify(_params);
        const _axiosObj = {
            method: com.isNull(config.method) ? 'GET' : config.method,
            url: config.url,
            data: config.method === 'POST' || config.method === 'PUT' ? _params : null,
            params: com.isNull(config.method) || config.method === 'GET' || config.method === 'DELETE' ? _params : null,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
            responseType: convertVal(config.responseType, 'json'),
            NotToken: convertVal(config.NotToken, false),
        }
        /** 发送请求 */
        axios({ ...config, ..._axiosObj }).then(response => {
            resolve(response)
        }).catch(error => reject(error)).finally(() => destroy(config.url))
    })
}

export default {
    Ajax: (config, success) => apiAxios(config, success).catch(e => Promise.reject(e))
};
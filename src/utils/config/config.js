import env from '@/utils/config/env.json';
export const setToken = (key = false) => {                          /* 设置token */
    let token = key ? key : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlblR5cGUiOiJDb21tb25Ub2tlbk1vZGVsIiwiaWF0IjoiMTYzODQ5NTgwMCIsImRlY19zYWxlc2NsZXJrX2lkIjoiMCIsInN2X2VtcGxveWVlX25hbWUiOiIiLCJvcGVyYXRpbmdwbGF0Zm9ybSI6IiIsInN5c3RlbW5hbWUiOiIiLCJzdl9hcHBfdmVyc2lvbiI6IiIsIm9yZGVyX29wZXJhdG9yIjoiIiwiZGVjX2lzc2FsZXNjbGVyayI6IkZhbHNlIiwicG9zY29kZSI6IiIsInN2X3N0b3JlX3N3aXRjaGluZyI6IiIsImV4cCI6MTYzOTEwMDYwMCwiaXNzIjoiNTE5NjE2NjUiLCJhdWQiOiI1MTk2MTY2NSJ9.ba_IaaPIsvONjlxWjCZC7E_8gD-ChbQ9931knwKc8Qc';
    if (env.env === 'serve' || key) {
        // utils.setLocalStorage('token', token);
        // utils.setLocalStorage('user_Info', user_Info)
    }
    // getApiBase();
}
//#endregion

//#region 接口loading 配置项
export const loadingData = {
    isLoding: false,
    name: '拼命加载中...',
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0.7)'
}
//#endregion

//#region 富文本编辑器的配置项

export const editorConfig = {
    menus: ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'indent', 'lineHeight', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', /*'video',*/ 'table', /* 'code', */ 'splitLine', 'undo', 'redo',]
}

//#endregion

import { Message } from 'element-ui'
const permission = {
    /*
      bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
      el: 作用的 dom 对象
      permissionItem: 传给指令的值，也就是我们要 copy 的值
    */
    bind(el, { value }) {
        el.$value = value;
        let permissionItem = el.$value.permission || { enabled: true };
        let actions = permissionItem.actions ? JSON.parse(permissionItem.actions) : { visible: true };
        // 门店权限未勾选，取actions配置
        if (!permissionItem.enabled && !actions.visible) {
            el.style.visibility = 'hidden';
        }
        el.handler = (event) => {
            let permissionItem = el.$value.permission || { enabled: true };
            let actions = permissionItem.actions ? JSON.parse(permissionItem.actions) : { visible: true };
            if (!permissionItem.enabled && actions.disabled) return event.preventDefault();
            if (!permissionItem.enabled) {
                if (el.$value.executableDefault) {
                    el.$value.executableDefault()
                }
                Message.warning(permissionItem.tips || '无权限')
                return
            };
            if (el.$value.param) {
                el.$value.fn(...el.$value.param);
            } else {
                el.$value.fn()
            }
            event.preventDefault();
        };
        el.addEventListener('click', el.handler);
    },
    componentUpdated(el, { value }) {
        el.$value = value;
        let permissionItem = value.permission || { enabled: true };
        let actions = permissionItem.actions ? JSON.parse(permissionItem.actions) : { visible: true };
        if (!permissionItem.enabled && !actions.visible) {
            el.style.visibility = 'hidden';
        }
        // el.style.cursor = actions.disabled ? 'not-allowed' : 'pointer';
        // if (value.fnType !== 'switch') return
        // if (actions.disabled && el.className.indexOf('is-disabled') === -1) {
        //     el.parentNode.style.cursor = 'not-allowed';
        //     if (el.className.indexOf('is-disabled') === -1) el.classList.add('is-disabled')
        // } else {
        //     el.classList.remove('is-disabled')
        // }
    },
    unbind(el) {
        el.removeEventListener('click', el.handler);
    },
};
export default permission;
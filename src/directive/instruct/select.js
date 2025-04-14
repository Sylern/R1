const vSelect = {
    bind(el, { value }) {
        el.handler = () => {
            el.querySelector('input').focus() // 获取焦点
            el.querySelector('input').select() // 选中文字
        };
        el.addEventListener('click', el.handler);
    },
};
export default vSelect;
const debounce = {
    /*
        防抖：只执行一次
        inserted 钩子函数，对比bind，inserted页面载入dom节点后点用
        el: 作用的 dom 对象
    */
    inserted(el, binding) {
        let timer = null;
        el.addEventListener('click', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                binding.value()
            }, 300);
        })
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el) {

    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {

    },
};
export default debounce;
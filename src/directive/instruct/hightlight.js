const hightlight = {
    /*
      inserted 钩子函数，对比bind，inserted页面载入dom节点后点用
      el: 作用的 dom 对象
      value: 传给指令的值，也就是我们要 copy 的值
    */
    inserted(el, { value }) {
        if (el.innerText.indexOf(value) > -1 && value !== '') {
            const innerText = el.innerText.replace(value, '<span class="hightlightText">' + value + '</span>');
            if (el.className.indexOf('hightlight') === -1) el.className += ' hightlight';
            el.innerHTML = innerText;
        }
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
        if (el.innerText.indexOf(value) > -1 && value !== '') {
            const innerText = el.innerText.replace(value, '<span class="hightlightText">' + value + '</span>');
            if (el.className.indexOf('hightlight') === -1) el.className += ' hightlight';
            el.innerHTML = innerText;
        } else {
            // const innerText = el.innerText.replace(value, '<span class="hightlightText">' + value + '</span>');
            el.classList.remove('hightlight');
            el.innerHTML = el.innerText;
        }
        if (value === '' && el.className.indexOf('hightlight') > -1) {
            el.classList.remove('hightlight');
            el.innerHTML =  el.innerText;
        }
    },
};
export default hightlight;
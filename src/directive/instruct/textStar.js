const textStar = {
    /*
      inserted 钩子函数，对比bind，inserted页面载入dom节点后点用
      el: 作用的 dom 对象
      value: 传给指令的值
    */
    inserted(el, { value }) {
        if (el.innerText) {
            const innerText = el.innerText.replace(el.innerText, '<i class="textStar">*</i>'+ el.innerText);
            el.innerHTML = innerText;
        }
    },
};
export default textStar;
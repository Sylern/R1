const scale = {
    /*
        条码秤列表最初使用
        inserted 钩子函数，对比bind，inserted页面载入dom节点后点用
        el: 作用的 dom 对象
    */
    inserted(el) {
        let windowWidth = window.innerWidth;
        let scale = windowWidth / 1920;

        let elWidth = el.clientWidth;
        let elHeight = el.clientHeight;

        let tWidth = (scale - 1) * elWidth + 'px';
        let tHeight = (scale - 1) * elHeight + 'px';

        let width = parseFloat(1920 / windowWidth) <= 1 ? el.clientWidth : (1920 / windowWidth) * elWidth + 'px';
        let height = parseFloat(1920 / windowWidth) <= 1 ? el.clientHeight : (1920 / windowWidth) * elHeight + 'px';
        let trans = 'scale(' + scale + ') translate(' + tWidth + ', ' + tHeight + ')';

        el.style.cssText = 'width:' + width + ';height:' + height + ';transform:' + trans + ';-webkit-transform:' + trans + ';';
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el) {

    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {

    },
};
export default scale;
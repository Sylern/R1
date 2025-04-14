import com from '@/utils/utils.js';
function setRem() {
    let wW = window.innerWidth;                                       // 窗口宽度
    let designSize = wW > 640 ? 1920 : 375;                           // 设计图尺寸
    document.documentElement.style.fontSize = 100 * wW / designSize + 'px';

    if (!com.isPC()) {
        let className = document.body.className;
        document.body.setAttribute('class', className + ' bodyScrollbar');
    } else {
        document.body.classList.remove('bodyScrollbar')
    }
}
setRem();                                                    // 初始化
window.onresize = function () {                              // 改变窗口大小时重新设置 rem
    setRem()
};
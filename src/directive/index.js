import copy from './instruct/copy.js';                          // 拷贝指令
import repeatClick from './instruct/repeat_click.js';           // 防止重复点击的指令  v-repeatClick='5000' 可自由设置禁用时间
import scale from './instruct/scaleFont.js';                    // 字体缩放指令
import debounce from './instruct/debounce.js';                  // 防抖指令
import throttle from './instruct/throttle.js';                  // 节流指令
import imgBase64 from './instruct/imgBase64.js';                // 图片转base64
import height from './instruct/height.js';                      // 动态设置高度
import select from './instruct/select.js';                      // el-input自动获取焦点并选中输入框里面的值
import tooltip from './instruct/tooltip.js';                    // tooltip
import permission from './instruct/permission.js';              // 权限指令
import hightlight from './instruct/hightlight.js';              // 高亮颜色
import textStar from './instruct/textStar.js';                  // 文本前带 * 
import removeAria from './instruct/removeAria.js';              // 移除elmentUI el-radio chrome 属性报错

// 自定义指令
const directives = {
    copy,
    repeatClick,
    scale,
    debounce,
    throttle,
    imgBase64,
    height,
    select,
    tooltip,
    permission,
    hightlight,
    textStar,
    removeAria
};
// 这种写法可以批量注册指令
export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key]);
        });
    },
};
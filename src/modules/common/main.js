// import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import i18n from '@/language'

import '@babel/polyfill';

//#region es6转es5语法
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();

//#region 单位换算
import '@/utils/rem';

//#region 统一样式
import '@/assets/style/style.scss';
//#region 收银台统一样式
import '@/assets/style/cashier/style.scss';

//#region 
import '@/assets/style/onlineOrder/style.scss';

//#region 弹窗组件引入
import { dcDialog, cmdIcon, dcImg, dcCheckbox, dateTimePicker } from '@/components/index';
// #region 弹窗引入
Vue.component('dcDialog', dcDialog);

//#region 字体图标引入
Vue.component('cmdIcon', cmdIcon);

//#region 图片组件引入
Vue.component('dcImg', dcImg);

//#region 勾选框
Vue.component('dcCheckbox', dcCheckbox);

//#region 时间组件引入
Vue.component('dateTimePicker', dateTimePicker);

//#region 表格引入
import Table from '@/components/common/myTable/index'
Vue.use(Table);

//#region 新表格引入
import dcTable from '@/components/common/dcTable/dcTable.vue'
Vue.component('dcTable', dcTable);
import dcTableCell from '@/components/common/dcTable/cell/cell.vue'
Vue.component('dcTableCell', dcTableCell);

//#region 引入dcMessageBox
import dcMessageBox from "@/components/common/dcMessageBox";
Vue.use(dcMessageBox)

//#region 自定义指令引入
import directives from '@/directive/index';
Vue.use(directives);

Vue.config.productionTip = false;

import { Loading } from 'element-ui';
Vue.prototype.$loading = Loading;

import print from '@/utils/print';
Vue.prototype.$print = print;

import utils from '@/utils/utils';
Vue.prototype.$app = utils;                          // 将公共方法绑定到全局

Vue.directive('drag', {
    bind: function (el, binding) {
        el.onmousedown = (e) => {
            const dragBox = document.getElementById('drag--id')

            el.style.position = 'absolute'
            el.style.cursor = 'move'
            const disX = e.clientX - el.offsetLeft
            const disY = e.clientY - el.offsetTop

            document.onmousemove = (e) => {
                let left = e.clientX - disX
                let top = e.clientY - disY

                if (top < 0) {
                    top = 0
                }
                if (top > dragBox.clientHeight - el.clientHeight) {
                    top = dragBox.clientHeight - el.clientHeight
                }
                if (left < 0) {
                    left = 0
                }
                if (left > dragBox.clientWidth - el.clientWidth) {
                    left = dragBox.clientWidth - el.clientWidth
                }

                binding.value.left = left
                binding.value.top = top
                el.style.left = left + 'px'
                el.style.top = top + 'px'
            }
            document.onmouseup = (e) => {
                el.style.cursor = 'default'
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }
})

new Vue({ router, store, i18n, render: h => h(App) }).$mount("#app");

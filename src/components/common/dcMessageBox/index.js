import Main from './dcMessageBox.vue'

let instance = null
let current = null
const destroy = () => {
    if (current) {
        document.body.removeChild(current.$el)
        current = null
    }
    if (instance) {
        instance.$destroy()
        instance = null
    }
}


//1.使用 this.$dcMessageBox({title,btnTxt,content,closeable,zIndex}).then().catch()
//title标题，默认值温馨提示
//btnTxt按钮文本, 默认值确定
//content弹窗内容,支持普通字符串或者html文本
//closeable是否可关闭，默认true|undefined可关闭,false 不可关闭
//zIndex层级,默认2055
//$dcMessageBox为promise 点击确定按钮触发resolve,点击蒙版并且close为(true|undefined)触发reject

//2.使用this.$dcMessageBox(content) 直接传入content，其它保持默认值

const dcMessageBox = {
    install: (Vue) => {
        if (!Vue.prototype.$dcMessageBox) {
            Vue.prototype.$dcMessageBox = (option) => {
                const isString = typeof (option) === 'string'
                return new Promise((resolve, reject) => {
                    if (!instance) {
                        instance = new Vue({
                            render(h) {
                                return h(Main, {
                                    props: { ...(isString ? {} : option), ...{ visible: true } },
                                    on: {
                                        close: () => {
                                            destroy()
                                            reject()
                                        },
                                        confirm: () => {
                                            destroy()
                                            resolve()
                                        }
                                    },
                                    scopedSlots: {
                                        default: props => h('span', {
                                            domProps: {
                                                innerHTML: isString ? option : option.content
                                            }
                                        })
                                    },
                                })
                            }
                        })
                    }
                    if (!current) {
                        current = instance.$mount()
                    }
                    document.body.appendChild(current.$el)
                })
            }
        }
    }
}

export default dcMessageBox
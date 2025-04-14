import VueI18n from 'vue-i18n'
import Vue from 'vue'

// 引入语言包
import zh from './zh.js'
import en from './en.js'

Vue.use(VueI18n)

// 构造i18n对象
const i18n = new VueI18n({
    // 默认语言，这里的local属性，对应message中的zh、en属性
    locale: 'zh',
    // 引入语言文件
    messages: {
    // 这里的属性名是任意的，您也可以把zh设置为cn等，只是后续切换语言时
    // 要标识这里的语言属性，如：this.$i18n.locale = zh|en|zh|xxx
        zh, // 这里为上面通过import引入的语言包
        en,
    },
})

export default i18n

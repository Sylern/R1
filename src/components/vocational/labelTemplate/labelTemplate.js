export default {
  props: ['item'],
  data() { return { domWidth: 260, templateWidth: 440 } },
  computed: {
    width() {                                              // 计算标签模板宽度
      return this.item.width * 96 / 25.4 * 2.647078
    },
    height() {                                             // 计算标签模板高度
      return this.item.height * 96 / 25.4 * 2.647078
    },
    scale() {                                              // 标签模板缩放比例
      return this.domWidth / this.width
    },
    labelImgurl() {                                        // 标签模板背景图
      return this.item.backgroundUrl !== null ? this.item.backgroundUrl : ''
    }
  },
  methods: {
    getFontSize(pricesItem) {                              // 获取标签模板字体大小
      const fontSize = parseInt(440 / this.item.width / 2.89 * pricesItem.fontSize)
      return fontSize
    }
  }
}

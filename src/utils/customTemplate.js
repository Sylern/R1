export function isDeepColor (_color) {
    var color = _color === 'transparent' ? 'rgb(0,0,0)' : _color
    if (color.indexOf('#') > -1) {
      color = colorToRgb(color)
    }
    color = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    var total = 0
    for (var i = 0; i < color.length; i++) {
      // r * 0.299 + g * 0.578 + b * 0.114 >= 192//浅色
      total += (i === 0 ? color[i] * 0.299 : i === 1 ? color[i] * 0.578 : color[i] * 0.114)
    }
    return !(total >= 192)
  }

  export function colorToRgb (sColor) {
    sColor = sColor.toLowerCase()
    // 十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 处理六位的颜色值
      var sColorChange = []
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'RGB(' + sColorChange.join(',') + ')'
    } else {
      throw new Error('颜色值格式不对')
    }
  }
/**
 * 所有模块公有方法文件
 * 1.先引入基本模块
 * 2.对模块方法加工调用
 * 3.暴露模块
 */
// import string from './base/string.js'

/**
 *  渲染文字
 *  @param ctx 画布对象
 *  @param {Object} obj
 */
var drawText = function (obj, ctx) {
  console.log('渲染文字')
  ctx.save()
  ctx.setFillStyle(obj.color)
  ctx.setFontSize(obj.size)
  ctx.setTextAlign(obj.align)
  ctx.setTextBaseline(obj.baseline)

  if (obj.bold) {
    console.log('字体加粗')
    ctx.fillText(obj.text, obj.x, obj.y - 0.3)
    ctx.fillText(obj.text, obj.x - 0.3, obj.y)
  }

  ctx.fillText(obj.text, obj.x, obj.y)

  if (obj.bold) {
    ctx.fillText(obj.text, obj.x, obj.y + 0.3)
    ctx.fillText(obj.text, obj.x + 0.3, obj.y)
  }

  ctx.restore()
}
/**
 * 获取文本折行
 * @param {Object} obj
 * @param ctx 画布对象
 * @return {Array} arrTr
 */

var getTextLine = function (obj, ctx) {
  ctx.setFontSize(obj.size)
  const arrText = obj.text.split('')
  let line = ''
  const arrTr = []

  for (let i = 0; i < arrText.length; i++) {
    var testLine = line + arrText[i]
    var metrics = ctx.measureText(testLine)
    var width = metrics.width

    if (width > obj.width && i > 0) {
      arrTr.push(line)
      line = arrText[i]
    } else {
      line = testLine
    }

    if (i == arrText.length - 1) {
      arrTr.push(line)
    }
  }

  return arrTr
}
/**
 * 文本换行
 *
 * @param {Object} obj
 */

var textWrap = function (obj, ctx) {
  console.log('文本换行')
  const tr = getTextLine(obj, ctx)

  for (let i = 0; i < tr.length; i++) {
    if (i < obj.line) {
      const txt = {
        x: obj.x,
        y: obj.y + i * obj.height,
        color: obj.color,
        size: obj.size,
        align: obj.align,
        baseline: obj.baseline,
        text: tr[i],
        bold: obj.bold,
      }

      if (i == obj.line - 1) {
        txt.text = txt.text.substring(0, txt.text.length - 3) + '......'
      }

      this.drawText(txt, ctx)
    }
  }
}
/**
 * @description 绘制图片
 * key: 路径字段
 * id:画布 canvas 标识；
 * width: canvas的 宽度
 * height: canvas的 高度
 * isdraw: 是否接着 上一次的绘制
 */

var drawShareImg = function ({ id, key, width, height, isdraw, fn }) {
  const ctx = uni.createCanvasContext(id)
  var widthTemp = width + width * 0.04 || 300
  var heightTemp = 0
  var draw = isdraw || false

  if (fn) {
    fn(ctx).then((h) => {
      heightTemp = h
    })
  } else {
    heightTemp = height || 500
  }

  return new Promise(function (resolve, reject) {
    ctx.draw(draw, function () {
      setTimeout(function () {
        uni.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: widthTemp,
          height: heightTemp,
          destWidth: widthTemp * 6,
          destHeight: heightTemp * 6,
          canvasId: id,
          fileType: 'jpg',
          success: function (res) {
            ctx.clearRect(0, 0, widthTemp, heightTemp + 100)
            const iObj = {}
            iObj[key + ''] = res.tempFilePath
            resolve(iObj)
            uni.hideLoading()
          },
          fail: function (res) {
            console.log(res)
            uni.hideLoading()
          },
        })
      }, 200)
    })
  })
}
/**
 *  网络图片 转本地链接
 */

var getFilePath = function (picUrl) {
  return new Promise(function (resolve, reject) {
    uni.downloadFile({
      url: picUrl,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        }
      },
      fail: function (err) {
        console.log(err, picUrl)
        resolve(picUrl)
      },
    })
  })
}

module.exports = {
  drawText: drawText,
  textWrap: textWrap,
  drawShareImg: drawShareImg,
  getCloudPath: getFilePath,
}

/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-04 09:53:42
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-05 13:24:59
 */
var tool = {
  /**
   * @description 手机号加密
   */
  phoneEncryption(phone) {
    return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
  },

  /**
   * 是否是身份证
   * @param {*} params
   * @returns
   */
  isIDCard(params) {
    return /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
      params
    )
  },
  /**
   * @description 根据身份证号获取 生日
   */
  getBirthdayFromIdCard(idCard) {
    let birthday = ''
    if (idCard !== null && idCard !== '') {
      if (idCard.length === 15) {
        birthday = '19' + idCard.substr(6, 6)
      } else if (idCard.length === 18) {
        birthday = idCard.substr(6, 8)
      }
      birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    }
    return birthday
  },
  /**
   * @description 根据身份证号获取 性别
   */
  getSexFromIdCard(idCard) {
    if (idCard !== undefined && idCard !== '') {
      const sexIndex = idCard.substr(idCard.length - 2, 1)
      if (Number(sexIndex) % 2 === 0) {
        return '女'
      } else {
        return '男'
      }
    }
  },
  /**
   * @description 根据 生日 获取 年龄
   */
  getAgeFromBirthday(val) {
    if (val === null || val === '' || val === undefined) {
      return ''
    }
    const cDate = new Date(val)
    return new Date().getFullYear() - parseInt(cDate.getFullYear()) + ''
  },
  /**
   * 校验手机号
   * @description https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
   */
  validatePhone(num) {
    return /^1[3456789]\d{9}$/.test(num)
  },

  /**
   * 保留两位小数
   * param： 数值
   * isRounding 是否四舍五入
   * RegExp 中 \ => \\
   * */

  decimalTwo(param, isRounding = false, digit = 2) {
    if (isRounding) {
      if (typeof param === 'string') {
        param = Number(param)
      }

      return param.toFixed(digit)
    } else {
      const re = new RegExp('^\\d+(?:\\.\\d{0,' + digit + '})?')

      if (typeof param === 'number') {
        param = param.toString()
      }

      return Number(param.match(re))
    }
  },

  /**
   * 清楚本地缓存
   * 只保留openid 和orgid
   * */

  clearLocal() {
    const loacl = {
      orgId: uni.$localStorage.getItem('orgId'),
      appletId: uni.$localStorage.getItem('appletId'),
      userOrgId: uni.$localStorage.getItem('userOrgId'),
      userOpenId: uni.$localStorage.getItem('userOpenId'),
      myAuthority: uni.$localStorage.getItem('myAuthority'),
      ENV_CURRENT: uni.$localStorage.getItem('ENV_CURRENT'),
    }
    return new Promise((resolve) => {
      // console.log(loacl, "————清楚缓存之前");
      const keys = Object.keys(loacl)
      uni.clearStorage({
        success: () => {
          keys.forEach((item) => {
            if (loacl[item]) {
              uni.$localStorage.setItem(item, loacl[item])
            }
          })
          resolve()
          // console.log("clearLocal———— 清楚缓存");
        },
      })
    })
  },

  /**
   * 图片旋转
   * @param angle 角度
   * */
  pictureRotation(angle) {
    const animation = uni.createAnimation({
      duration: 1,
      timingFunction: 'linear',
      // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 1,
      transformOrigin: '50% 50% 0',
    })
    animation.rotate(180 * angle).step()
    return animation
  },

  /**
   * 下载文件-h5
   * @param {fileName: string, fileLink: string}
   */
  downLoadFile({ fileName, fileUrl } = {}) {
    const downloadEl = document.createElement('a')
    downloadEl.download = fileName
    downloadEl.href = fileUrl
    document.body.appendChild(downloadEl)
    downloadEl.click()
    downloadEl.remove()
  },

  /**
   * 是否是图片链接
   * @param {string} imgUrl
   * @returns
   */
  isImgUrl(imgUrl) {
    const imgArr = ['png', 'jpg', 'jpeg', 'gif']
    return imgArr.includes(imgUrl.slice(imgUrl.lastIndexOf('.') + 1).toLowerCase())
  },

  /**
   * 创建单利
   * */
  Proxy(func) {
    let instance
    const handler = {
      construct(target, args) {
        if (!instance) {
          instance = Reflect.construct(func, args)
        }
        return instance
      },
    }
    return new Proxy(func, handler)
  },

  /**
   * 优雅的处理 async/await
   * let [err,res] = await errorCaptured(asyncFunc)
   * */
  async errorCaptured(asyncFunc) {
    try {
      const res = await asyncFunc()
      return [null, res]
    } catch (e) {
      return [e, null]
    }
  },

  /**
   * @description 函数防抖
   * @param {Function} func -需要函数防抖的函数
   * @param {Number} time -延迟时间
   * @param {Options} options -配置项
   * @return {Function} -经过防抖处理的函数
   * 配置项
   * @typedef {Object} Options -配置项
   * @property {Boolean} leading -开始是否需要额外触发一次
   * @property {Boolean} trailing -结束后是否需要额外触发一次
   * @property {this} context -上下文
   **/

  debounce(
    func,
    time = 17,
    options = {
      leading: true,
      context: null,
    }
  ) {
    let timer
    const _debounce = (...args) => {
      if (timer) {
        clearTimeout(timer)
      }
      if (options.leading && !timer) {
        timer = setTimeout(null, time)
        func.apply(options.context, args)
      } else {
        timer = setTimeout(() => {
          func.apply(options.context, args)
          timer = null
        }, time)
      }
    }
    /**
     * @description 取消函数
     * @see https://juejin.im/post/5931561fa22b9d0058c5b87d
     **/
    _debounce.cancel = () => {
      clearTimeout(timer)
      timer = null
    }
    return _debounce
  },
}

const requireTool = require.context('../tool', false, /\.js$/)
// 遍历出每个组件的路径
requireTool.keys().forEach((path) => {
  const jsInstance = requireTool(path)
  if (!path.includes('index')) {
    tool = { ...tool, ...jsInstance.default }
  }
})

export default tool

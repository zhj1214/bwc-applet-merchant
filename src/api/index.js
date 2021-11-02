/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-02 18:32:35
 */
import http from '../utils/http'
import userCenter from './user' // 个人中心
// const apis = require.context('./apis', false, /\.js$/)

var api = {
  ...userCenter,
  /************** 外链 *************/
  mapSearch: 'https://apis.map.qq.com/ws/place/v1/search',
  /************** 云函数 错误日志上报 *************/
  errApi: 'errLog/errlogUpload',

  /**
   * 当前请求域名
   * */
  getApiHost() {
    return http.baseURL
  },
  /**
   * @description  获取小程序二维码
   * @param {*} options
   * 老街口 /api/platform/miniQrCodeGenerate
   * 新街口 /api/platform/component/miniQrCodeGenerate
   */
  getWXQrcodeData() {
    return http.baseURL + '/mos-webchatmall-server/api/platform/component/miniQrCodeGenerate'
  },
  /**
   * @description api接口调用
   * @param {Strung} key 接口字段
   * @param {*} options  入参
   * */
  apiRequest(key, options) {
    return new Promise((resolve, reject) => {
      // 进入数据加工逻辑
      const resolveGenerator = (data) => {
        if (Object.prototype.toString.call(this[key]) === '[object GeneratorFunction]') {
          const generator = this[key](data, options, resolve)
          generator.next()
          generator.next()
          // console.log('进来了吗：', generator)
        } else if (typeof this[key] === 'function') {
          this[key](data, options, resolve)
        } else {
          resolve(data)
        }
      }
      // 处理 Generator url
      if (Object.prototype.toString.call(this[key]) === '[object GeneratorFunction]') {
        var generatorUrl = this[key]().next().value
      }
      console.log('url :>> ', generatorUrl || this[key])
      http.request(generatorUrl || this[key], resolveGenerator, reject, options)
    })
  },
  /**
   * @description 云函数调用
   * @param {Strung} key 接口字段
   * @param {Object} data  入参
   * @param {String} loadingText  loading提示语
   */
  cloudRequest(key, data = {}, loadingText = '请稍等') {
    const apis = this[key].split('/')
    var cloudBase = wx.cloud
    if (!key.includes('WX_')) cloudBase = uni.$uniCloud
    data.createTime = new Date().getTime()
    data.createTimeStr = new Date().Format('YYYY-MM-DD HH:mm:ss')
    return http.cloud(cloudBase, apis, data, loadingText)
  },
}

export default new Proxy(api, {
  get: function (taget, propkey, receiver) {
    return (options) => {
      // 目前接口有两种形式的封装为了兼容函数的封装
      if (Object.prototype.toString.call(propkey) === '[object Function]') {
        return taget.propkey(options)
      } else {
        return taget.apiRequest(propkey, options)
      }
    }
  },
})

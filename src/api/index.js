/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-03 09:54:03
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
   * @description api接口调用
   * @param {Strung} key 接口字段
   * @param {*} options  入参
   * */
  apiRequest(key, options) {
    return new Promise((resolve, reject) => {
      // 校验书否有缓存数据
      if (options.cache && uni.$localStorage.getItem(key)) {
        resolve(uni.$localStorage.getItem(key))
        return
      }
      // 获取请求 url
      const keyValue = this[key]
      var generatorUrl = typeof keyValue !== 'string' ? keyValue.url : keyValue
      // 保存请求key
      options['api_key'] = key
      // 进入数据加工逻辑
      var resolveGenerator = (response, config) => {
        // 是否有缓存逻辑
        if (config.cache) uni.$localStorage.setItem(key, response, config.setExpireTime)
        // 加工数据
        if (typeof keyValue !== 'string') {
          keyValue.callBack(response, options, resolve)
        } else {
          resolve(response)
        }
      }
      // 请求重试 逻辑
      const reject_try = (config) => {
        if (config.retry === 0) {
          reject(90000)
        } else {
          options.retry = config.retry - 1
          http.request(generatorUrl, resolveGenerator, reject_try, options)
        }
      }
      // 开始调用请求方法 console.log('url :>> ', generatorUrl )
      http.request(generatorUrl, resolveGenerator, reject_try, options)
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

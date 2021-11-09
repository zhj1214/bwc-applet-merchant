/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-09 14:47:47
 */
import http from './index'

var api = {
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

/**
 * @description: 合并api文件下的所有接口，如有重名字段则会提示
 * @author: zhj1214
 */
const apis = require.context('../../api', false, /\.js$/)
const apis_arr = Object.keys(api)
apis.keys().forEach((name) => {
  const obj = apis(name).default
  // 校验
  Object.keys(obj).forEach((key) => {
    let isHas = false
    apis_arr.forEach((oldKey) => {
      // console.log(oldKey, '==========', key)
      if (oldKey === key) {
        isHas = true
        console.error(`接口api，发现重复字段：${oldKey} 请检查文件后修改。`)
      }
    })
    if (!isHas) apis_arr.push(key)
  })

  api = { ...api, ...obj }
})

/**
 * @description: 劫持当前类的get方法
 * @author: zhj1214
 */
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

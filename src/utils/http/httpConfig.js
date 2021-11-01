/*
 * @Description: 请求配置
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-11-01 17:10:16
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-01 22:57:15
 */

export var urls = {}
export var method_fn = {}
uni.$util.forEach(['get', 'post', 'put'], (method) => {
  method_fn[method] = (url) => {
    urls[url] = method.toUpperCase()
    return url
  }
})

export const defaultConfig = function (config) {
  const header = {
    'content-type': 'application/json',
  }
  return {
    timeout: 120000, // 超时时间
    loading: true, // 是否显示遮罩层
    retry: 0, // 请求重试次数
    retryDelay: 1000, // 请求重试间隔
    cache: false, // 是否缓存该请求
    setExpireTime: 1000 * 60 * 60 * 24 * 30, // 单位毫秒，缓存有效时间1个月
    header: { ...header, ...config.header }, // 合并 自定义配置
    ...config.fig,
  }
}

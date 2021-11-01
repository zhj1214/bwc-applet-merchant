/*
 * @Description: 请求配置
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-11-01 17:10:16
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-01 18:11:43
 */
import { STORAGE } from '@/utils/constant'
var urls = {}
export var method_fn = {}
uni.$util.forEach(['get', 'post', 'put'], (method) => {
  method_fn[method] = (url) => {
    urls[url] = method.toUpperCase()
    return url
  }
})

export const defaultConfig = function (app, config) {
  //   method
  return {
    rootOrgId:
      uni.$localStorage.getItem(STORAGE.ROOT_ORG_ID) ||
      (app.globalData && app.globalData.rootOrgId) ||
      '', // 商户orgId
    orgId:
      uni.$localStorage.getItem(STORAGE.ORG_ID) || (app.globalData && app.globalData.orgId) || '',
    uToken: uni.$localStorage.getItem(STORAGE.TOKEN) || '', // 当前组织orgId
    uid: uni.$localStorage.getItem(STORAGE.MEMBER_ID) || '1', // uid就是memberId
    'content-type': 'application/json',
    loading: true, // 是否显示遮罩层
    ...config, // 合并 自定义配置
  }
}

/*
 * @Description: 拦截器
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-11-02 17:31:10
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-02 18:20:12
 */

import { STORAGE } from '@/utils/constant'
import { defaultConfig } from './httpConfig'

function getGloubleValue(key, value = '') {
  const one_t = getApp()
  return uni.$localStorage.getItem(key) || (one_t.globalData && one_t.globalData[key]) || value
}

export default {
  /**
   * @description: 请求之前拦截,一般设置请求头
   * @author: zhj1214
   */
  request: function () {
    // console.log('请求之前拦截') // , arguments
    // 自定义请求头
    const config = {
      header: {
        rootOrgId: getGloubleValue(STORAGE.ROOT_ORG_ID), // 商户orgId
        orgId: getGloubleValue(STORAGE.ORG_ID), // 当前组织orgId
        uToken: getGloubleValue(STORAGE.TOKEN), // Token
        uid: getGloubleValue(STORAGE.MEMBER_ID, '1'), // uid就是memberId
      },
      fig: {},
    }

    const options = arguments[3] // arguments: url, resolve, reject, data = {}
    uni.$util.forEach(['loading', 'retry', 'retryDelay', 'cache', 'setExpireTime'], (key) => {
      if (options.hasOwnProperty(key)) {
        config.fig[key] = options[key]
        delete options[key]
      }
    })
    return defaultConfig(config)
  },
  /**
   * @description: 请求完成后处理code业务逻辑
   * @author: zhj1214
   */
  reponse: function (resolve, requestUrl, data, show_error) {
    return (res) => {
      console.log('请求完成')
      const code = res.data.code
      const msg = res.data.message || ''
      if (code === 10000 || code === 3003) {
        resolve(res.data)
      } else if (res.data.code === 30001) {
        this.reportErrlog(requestUrl, data, res.data)
        uni.reLaunch({
          url: '/pages/login/login',
        })
      } else if (res.data.code === 90000) {
        this.reportErrlog(requestUrl, data, res.data)
        show_error(msg || '服务异常，请重试')
      } else {
        this.reportErrlog(requestUrl, data, res.data)
        if (msg) show_error(msg)
        resolve(res.data)
      }
    }
  },
  /**
   * @description: 请求开始进入padding状态
   * @author: zhj1214
   */
  beginPadding: () => {
    console.log('开始请求')
  },
  /**
   * @description: 错误日志上报
   * @author: zhj1214
   */
  reportErrlog: (url, data, result) => {
    const userObj = uni.$localStorage.getCurrentUser() || {}
    this.one_t = getApp()
    if (!userObj.phone || !this.one_t.globalData.isEnableCloud) return
    uni.$api.cloudRequest('cctvApi', {
      memberId: userObj.memberId,
      nickName: userObj.nickName,
      phone: userObj.phone,
      url: url,
      apiParam: data,
      apiResult: result,
    })
  },
}

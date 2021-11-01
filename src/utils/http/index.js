/*
 * @Description: 请求类封装
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-18 21:51:18
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-01 23:11:43
 */

// import md5 from "md5";
// import { Notice, Message } from "view-design";
import { STORAGE } from '@/utils/constant'
import { defaultConfig, urls } from './httpConfig'

const tpls = require('../../ext.json')

const getBaseUrl = (env) => {
  // #ifdef MP-WEIXIN
  let base = {
    release: '', // 测试环境
    development: '', // 正式环境
    prod: 'https://yhqtdev.data4truth.com', // 预发布
  }[env]

  if (!base) {
    base = 'https://yhqtdev.data4truth.com'
  }
  return base
  // #endif
  // #ifdef H5
  return ''
  // #endif
}
class NewAxios {
  /**
   * @description: 构造函数
   * @author: zhj1214
   */

  constructor() {
    this.baseURL = getBaseUrl(tpls.applet_env)
    this.requestCount = 0 // 请求连接数
    this.one_t = getApp()
  }

  /**
   * @description api请求封装
   * */
  request = (url, resolve, reject, data = {}, config = {}) => {
    // 判断是否为外链,如果是外链则不需使用默认域名
    if (!url.includes('http')) {
      var requestUrl = this.baseURL + url
    }
    // 是否加载loading
    if (config.loading) {
      uni.$alert.showLoading('请稍等')
      this.requestCount += 1
    }

    if (!this.one_t) this.one_t = getApp()
    uni.request({
      url: requestUrl,
      timeout: config.timeout,
      method: urls[url],
      data: data,
      header: config.header,
      success: (res) => {
        const code = res.data.code
        const msg = res.data.message || ''
        if (code === 10000 || code === 3003) {
          resolve(res.data)
        } else if (res.data.code === 30001) {
          this.reportErrlog(url, data, res.data)
          uni.reLaunch({
            url: '/pages/login/login',
          })
        } else if (res.data.code === 90000) {
          this.reportErrlog(url, data, res.data)
          this.show_error(msg || '服务异常，请重试')
        } else {
          this.reportErrlog(url, data, res.data)
          if (msg) this.show_error(msg)
          resolve(res.data)
        }
      },
      fail: (err) => {
        this.reportErrlog(url, data, '请求 TCP 建立失败')
        reject(err)
      },
      complete: (res) => {
        if (config.loading) {
          this.requestCount -= 1
          if (this.requestCount === 0) {
            uni.hideLoading()
          }
        }
        if (res.statusCode !== 200) {
          console.error(res, '____error')

          this.one_t.globalData.fundebug.notifyHttpError(
            {
              method: urls[url],
              url: this.baseURL + url,
            },
            {
              statusCode: res.statusCode,
            }
          )

          this.show_error('当前页面访问人数过多，请稍后再试')
        }
      },
    })
  }

  /**
   * 云函数
   * */
  cloud = (cloudBase, apis, data, loadingText) => {
    return new Promise((resolve, reject) => {
      cloudBase.callFunction({
        name: apis[0],
        data: {
          ...data,
          ...{
            api: apis[1],
          },
        },
        success: (res) => {
          const code = (res.result && res.result.code) || 200
          const msg = (res.result && res.result.msg) || ''
          console.log(code, msg, res)
          if (code == 10000 || code == 20000) {
            resolve(res.result)
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  }

  /**
   * 错误日志上报
   * */
  reportErrlog = (url, data, result) => {
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
  }

  show_error = (msg) => {
    setTimeout(
      () => {
        uni.showToast({
          title: msg || '',
          icon: 'none',
          duration: 3000,
          success: () => {
            setTimeout(() => {
              uni.hideLoading()
            }, 3000)
          },
        })
      },
      this.requestCount !== 0 ? 300 : 0
    )
  }

  /**
   * 返回当前请求状态
   * */
  currentRequestStatus(block) {
    let requestCount = this.requestCount
    Object.defineProperty(this, 'requestCount', {
      get: function () {
        return requestCount
      },
      set: function (newVal) {
        // console.log(newVal, "---------设置新值——————", requestCount);
        requestCount = newVal
        if (newVal !== undefined && newVal === 0 && this.onect_key) {
          block(this.onect_key)
        }
      },
    })
  }
}

const axiox = new NewAxios()

function getGloubleValue(key, value = '') {
  return (
    uni.$localStorage.getItem(key) ||
    (axiox.one_t.globalData && axiox.one_t.globalData[key]) ||
    value
  )
}
/**
 * @description: 拦截器
 * @author: zhj1214
 */
const interceptors = {
  request: function () {
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
  reponse: () => {},
}

axiox.request = axiox.request.before(interceptors.request).after(interceptors.reponse)

export default axiox

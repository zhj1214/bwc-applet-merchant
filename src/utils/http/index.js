/*
 * @Description: 请求类封装
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-18 21:51:18
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-02 18:19:17
 */

// import md5 from "md5";
import interceptors from './interceptors'
import { urls } from './httpConfig'
class NewAxios {
  constructor() {
    this.requestCount = 0 // 请求连接数
  }

  /**
   * @description api请求封装
   * */
  request = (url, resolve, reject, data = {}, config = {}) => {
    // 判断是否为外链,如果是外链则不需使用默认域名
    if (!url.includes('http')) {
      var requestUrl = config.baseURL + url
    }
    // 是否加载loading
    if (config.loading) {
      uni.$alert.showLoading('请稍等')
      this.requestCount += 1
    }

    return uni.request({
      url: requestUrl,
      timeout: config.timeout,
      method: urls[url],
      data: data,
      header: config.header,
      success: interceptors.reponse(resolve, requestUrl, data, this.show_error),
      fail: (err) => {
        interceptors.reportErrlog(requestUrl, data, '请求 TCP 建立失败')
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
          // fundebug.notifyHttpError(
          //   {
          //     method: urls[url],
          //     url: this.baseURL + url,
          //   },
          //   {
          //     statusCode: res.statusCode,
          //   }
          // )
          this.show_error('当前页面访问人数过多，请稍后再试')
        }
      },
    })
  }

  /**
   * @description: 云函数
   * @author: zhj1214
   */
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
}

const axiox = new NewAxios()

axiox.request = axiox.request.before(interceptors.request).after(interceptors.beginPadding)

export default axiox

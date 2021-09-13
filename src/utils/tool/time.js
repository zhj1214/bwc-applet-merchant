/*
 * @Description:时间的方法
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-04 09:36:40
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-04 10:24:54
 */
export default {
  /**
   * @description 时间戳转时间
   * @param format 时间格式
   * @param date   时间戳 默认当前时间
   * @example (new Date()).Format("YYYY-MM-DD HH:mm:ss.S")
   * */
  getTimeFormat(format, date) {
    const time = date || new Date()
    return time.Format(format)
  },
  /**
   * @description 公共方法定义文件，需要使用时可以在js文件中按需引入
   */

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return (
      [year, month, day].map(formatNumber).join('/') +
      ' ' +
      [hour, minute, second].map(formatNumber).join(':')
    )
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * @description 计算两个时间  时间间隔
   * @param time1  开始时间 YYYY-MM-DD HH:mm:ss 时间格式  必填
   * @param time2  结束时间 YYYY-MM-DD HH:mm:ss 时间格式  默认当前时间
   * */
  /*eslint prefer-promise-reject-errors: "error"*/
  calculateAtoBtimeDifference(time1, time2 = new Date()) {
    if (this.isEmpty(time1)) {
      return 0
    }
    var self = this
    return new Promise(function (resolve, reject) {
      if (window.currentiOSSystem) {
        time2 = time2.Format('YYYY-MM-DD HH:mm:ss')
        const end = new Date(time2.replace(/-/g, '/')).getTime()
        const star = new Date(time1.replace(/-/g, '/')).getTime()
        if (!isNaN(end) && !isNaN(star)) {
          resolve((end - star) / 1000)
        }
      } else {
        const d1 = new Date(time1)
        time2 = time2 || new Date()
        const d2 = new Date(time2)
        const difference = parseInt(d2 - d1)
        if (difference != undefined && difference != null && !isNaN(difference)) {
          resolve(difference / 1000)
        }
      }
    })
  },
}

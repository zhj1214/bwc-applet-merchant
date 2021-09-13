/*
 * @Description: 时间对象扩展
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-07-20 09:46:53
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-08-10 11:38:20
 */
/**
 * @description: 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {*} fmt YYYY-MM-dd hh:mm:ss.ms
 * @return {*} 2006-07-02 08:09:04.423
 * @example: (new Date()).Format("YYYY-MM-DD HH:mm:ss.S") ==> 2006-07-02 08:09:04.423  (new Date()).Format("YYYY-M-D H:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @author: zhj1214
 */
Date.prototype.Format = function (fmt) {
  const m = this.getMonth()
  const o = {
    'M+': m + 1, // 月份
    'D+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'Q+': Math.floor((m + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

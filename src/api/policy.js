/*
 * @Author: NineNan
 * @Date: 2021-07-22 16:21:34
 * @LastEditTime: 2021-11-09 14:50:56
 * @LastEditors: zhj1214
 * @Description: 政策模块 api
 * @FilePath: \yh_client\src\api\policy.js
 */
import { get, post } from '../utils/http/httpConfig'
import api from '../utils/http/apiRequest'
import moment from 'moment'
import { API_SERVICE } from '@/utils/constant'

/**
 * 获取政策福利列表数据
 * @param {*} params
 */
export const getPolicyWelfareList = (options) => {
  return api
    .apiRequest({
      url: `${API_SERVICE.POLICY}api/server/policy/page`,
      options,
      method: 'post',
    })
    .then((res) => {
      if (res.data.pageData.count) {
        res.data.pageData.list = formatTime(res.data.pageData.list.slice())
      }
      return Promise.resolve(res)
    })
}
/**
 * 获取政策主题和部门数据
 * @param {*} params
 */
export const getPolicyThemeList = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.POLICY}api/server/dic/list`,
    options,
    method: 'post',
  })
}
/**
 * 获取政策详情
 * @param {*} params
 */
export const getPolicyDetail = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.POLICY}api/server/policy/detail`,
    options,
    method: 'post',
  })
}
// 用户阅读政策记录插入
export const setRecord = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.POLICY}api/server/policy/addRecord`,
    options,
    method: 'post',
  })
}
/**
 * 格式化时间
 * @param {*} arr
 * @returns
 */
function formatTime(arr) {
  let timeArr = arr.slice()
  timeArr = timeArr.map((time) => {
    const item = { ...time }
    if (moment(new Date()).diff(moment(item.releaseTime), 'minutes') < 60) {
      item.releaseTimeStr = `${moment(new Date()).diff(moment(item.releaseTime), 'minutes')}分钟`
    } else if (moment(new Date()).diff(moment(item.releaseTime), 'hours') <= 24) {
      item.releaseTimeStr = `${moment(new Date()).diff(moment(item.releaseTime), 'hours')}小时`
    } else {
      item.releaseTimeStr = moment(item.releaseTime).format(`YYYY-MM-DD`)
    }
    return item
  })
  return timeArr
}

export default {
  /**************登录*************/
  loginPhone2: post('/yhqt-server/wechat-server/api/webchat/registerOrLoginV2'), // 手机号登录

  /**
   * @description:  验证客户手机号是否注册 示例
   * @param {*} response 请求结果
   * @param {*} params   请求参数
   * @param {*} resolve 回调函数
   * @author: zhj1214
   */
  checkRegistPhone2: get(
    '/yhqt-server/wechat-server/api/webchat/verifyIsRegister',
    (response, params, resolve) => {
      console.log('开始加工请求,拿到入参：', params)
      response.time = '2021-09-05'
      resolve(response)
    }
  ),
}

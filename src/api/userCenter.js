/*
 * @Author: NineNan
 * @Date: 2021-07-24 12:51:45
 * @LastEditTime: 2021-11-03 14:53:43
 * @LastEditors: zhj1214
 * @Description: 个人中心 api
 * @FilePath: /yhqt-h5-client/src/api/userCenter.js
 */
import { get, post } from '../utils/http/httpConfig'
import api from '@/utils/http/apiRequest'
import { API_SERVICE } from '@/utils/constant'
import moment from 'moment'

/**
 * 获取我的报名
 * @param {*} options
 */
export const getMySignUp = (options) => {
  return api
    .apiRequest({
      url: `${API_SERVICE.COMPETITION}registryInfo/myregistry`,
      options,
      method: 'post',
    })
    .then((res) => {
      if (res?.data?.records.length) {
        let records = res.data.records.slice()
        records = records.map((item) => {
          const record = { ...item }
          record.registryTime = moment(record.registryTime).format('YYYY-MM-DD hh:mm:ss')
          return record
        })
        console.log('records :>> ', records)
        res.data.records = records
      }
      return Promise.resolve(res)
    })
}

/**
 * 获取我的报名详情
 * @param {*} options
 */
export const getMySignUpDetails = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}/registryInfo/detail`,
    options,
    method: 'get',
  })
}

/**
 * 修改密码
 * @param {*} options
 */
export const changePassword = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.WE_CHAT}api/webchat/member/edit/password`,
    options,
    method: 'post',
  })
}

/**
 * 修改昵称
 * @param {*} options
 */
export const changeNickName = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.WE_CHAT}api/webchat/member/edit`,
    options,
    method: 'post',
  })
}

/**
 * 获取用户信息
 * @param {*} options
 * @returns
 */
export const getUserInfo = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.WE_CHAT}api/webchat/member/info`,
    options,
    method: 'get',
  })
}

/**
 * 退出登陆
 * @param {*} options
 */
export const logOut = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.WE_CHAT}api/webchat/logout`,
    options,
    method: 'get',
  })
}

/**
 * 荣誉详情
 * @param {*} params
 */
export const getHonorDetails = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}results/detail`,
    options,
    method: 'get',
  })
}

/**
 * 实名认证
 * @param {*} options
 */
export const personnelCertification = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.WE_CHAT}api/webchat/member/edit`,
    options,
    method: 'post',
  })
}

export default {
  /**************登录*************/
  loginPhone1: post('/yhqt-server/wechat-server/api/webchat/registerOrLoginV2'), // 手机号登录

  /**
   * @description:  验证客户手机号是否注册 示例
   * @param {*} response 请求结果
   * @param {*} params   请求参数
   * @param {*} resolve 回调函数
   * @author: zhj1214
   */
  checkRegistPhone1: get(
    '/yhqt-server/wechat-server/api/webchat/verifyIsRegister',
    (response, params, resolve) => {
      console.log('开始加工请求,拿到入参：', params)
      response.time = '2021-09-05'
      resolve(response)
    }
  ),
}

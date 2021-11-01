/*
 * @Author: NineNan
 * @Date: 2021-07-22 17:39:50
 * @LastEditTime: 2021-11-01 17:19:30
 * @LastEditors: zhj1214
 * @Description: 比赛 api
 * @FilePath: \yh_client\src\api\competition.js
 */
import api from './index'
import { API_SERVICE } from '@/utils/constant'
import moment from 'moment'

/**
 * 获取比赛列表数据
 * @param {*} options
 * @returns Promse
 */
export const getCompetitionList = (options) => {
  return api
    .apiRequest({
      url: `${API_SERVICE.COMPETITION}event/page`,
      options,
      method: 'post',
    })
    .then((res) => {
      let records = res.data.pageData.records.slice()
      if (records.length) {
        records = records.map((item) => {
          const record = { ...item }
          record.createTimeStr = moment(record.createTime).format('YYYY-MM-DD hh:mm:ss')
          return record
        })
        res.data.pageData.records = records
      }
      return Promise.resolve(res)
    })
}

/**
 * 获取组织列表
 * @param {*} params
 */
export const getOrganizationList = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.USER}internal/organization/searchDepartment`,
    options,
    method: 'post',
  })
}

/**
 * 获取赛事区域枚举
 * @param {*} params
 * @returns
 */
let competitionEnumInfoCache = {}

export const getCompetitionEnumInfo = (options) => {
  if (JSON.stringify(competitionEnumInfoCache) !== '{}') {
    return Promise.resolve(competitionEnumInfoCache)
  }
  return api
    .apiRequest({
      url: `${API_SERVICE.COMPETITION}event/getEnumInfo`,
      options,
      method: 'get',
    })
    .then((res) => {
      competitionEnumInfoCache = res
      return Promise.resolve(res)
    })
}

/**
 * 获取赛事详情
 * @param {*} params
 */
export const getCompetitionDetails = (options) => {
  return api
    .apiRequest({
      url: `${API_SERVICE.COMPETITION}event/detail`,
      options,
      method: 'post',
    })
    .then((res) => {
      // console.log('res :>> ', res);
      res.data.endTime = moment(res.data.endTime).format('YYYY-MM-DD hh:mm:ss')
      res.data.startTime = moment(res.data.startTime).format('YYYY-MM-DD hh:mm:ss')
      return Promise.resolve(res)
    })
}

/**
 * 获取的荣誉
 * @param {*} options
 * @returns
 */
export const getMyHonor = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}results/glory`,
    options,
    method: 'post',
  })
}

/**
 * 添加搜索历史记录
 * @param {*} params
 */
export const addSearchHistory = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}api/log/addSearchLog`,
    options,
    method: 'post',
  })
}

/**
 * 获取搜索历史记录
 * @param {*} params
 */
export const getSearchHistory = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}api/log/getSearchLogList`,
    options,
    method: 'post',
  })
}

/**
 * 删除搜索历史记录
 * @param {*} params
 */
export const deleteSearchHistory = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}api/log/deleteSearchLog`,
    options,
    method: 'post',
  })
}

/**
 * 报名比赛
 * @param {*} params
 */
export const signUpCompetition = (options) => {
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}registryInfo/add`,
    options,
    method: 'post',
  })
}

/**
 * 是否是已经报过名
 * @param {*} options
 */
export const isHaveSignUp = (options) => {
  // matchId=37e3e53061244f60a2dc31f940b1528d&userId=18
  return api.apiRequest({
    url: `${API_SERVICE.COMPETITION}registryInfo/registered`,
    options,
    method: 'get',
  })
}

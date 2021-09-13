/*
 * @Author: NineNan
 * @Date: 2021-07-22 16:21:34
 * @LastEditTime: 2021-07-26 09:15:02
 * @LastEditors: Please set LastEditors
 * @Description: 政策模块 api
 * @FilePath: \yh_client\src\api\policy.js
 */
import api from './index';
import moment from 'moment';
import { API_SERVICE } from '@/utils/constant';

/**
 * 获取政策福利列表数据
 * @param {*} params
 */
export const getPolicyWelfareList = (options) => {
    return api.apiRequestFun({
        url: `${API_SERVICE.POLICY}api/server/policy/page`,
        options,
        method: 'post'
    }).then(res => {
        if (res.data.pageData.count) {
            res.data.pageData.list = formatTime(res.data.pageData.list.slice())
        }
        return Promise.resolve(res)
    })
};
/**
 * 获取政策主题和部门数据
 * @param {*} params
 */
export const getPolicyThemeList = (options) => {
    return api.apiRequestFun({
        url: `${API_SERVICE.POLICY}api/server/dic/list`,
        options,
        method: 'post'
    })
};
/**
 * 获取政策详情
 * @param {*} params
 */
export const getPolicyDetail = (options) => {
    return api.apiRequestFun({
        url: `${API_SERVICE.POLICY}api/server/policy/detail`,
        options,
        method: 'post'
    })
};
// 用户阅读政策记录插入
export const setRecord = (options) => {
    return api.apiRequestFun({
        url: `${API_SERVICE.POLICY}api/server/policy/addRecord`,
        options,
        method: 'post'
    })
};
/**
 * 格式化时间
 * @param {*} arr
 * @returns
 */
function formatTime(arr) {
    let timeArr = arr.slice();
    timeArr = timeArr.map(time => {
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

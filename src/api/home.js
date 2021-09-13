/*
 * @Author: NineNan
 * @Date: 2021-07-19 13:58:32
 * @LastEditTime: 2021-07-24 14:34:47
 * @LastEditors: Please set LastEditors
 * @Description: home api
 * @FilePath: \yh_client\src\api\home.js
 */
import api from './index';
// import { API_SERVICE } from '@/utils/constant';

/**
 * demo get请求
 * @param {*} params 
 */
export const demoGet = (params) => {
    api.apiRequest(`/activity-server/api/mkt/getMarketingByEvent`, params)
};


/**
 * demo post请求
 * @param {*} params 
 */
export const demoPost = (params) => {
    api.apiRequest(`POST::/activity-server/api/mkt/getMarketingByEvent`, params)
};


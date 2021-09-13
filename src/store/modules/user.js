/*
 * @Description: 用户信息模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 16:14:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-25 18:52:45
 */
import { STORAGE, MUTATIONS_TYPE } from '@/utils/constant';
import local from '@/utils/localStorage'
import { getUserInfo, logOut } from '@/api/userCenter';

export default {
  state: {
    userInfo: local.getItem(STORAGE.WX_USER_INFO) || {},
    isLogin: !!local.getItem(STORAGE.TOKEN)
  },
  mutations: {
    /* setOpenId(state, payload) {
      getApp().globalData.userOpenId = payload;
      uni.$localStorage.setItem("userOpenId", payload);
      state.userOpenId = payload;
    },
    setUserInfo(state, payload) {
      state = { ...state, ...payload };
    }, */
    /**
     * 设置用户信息
     * @param {*} state 
     * @param {*} payload 
     */
    [MUTATIONS_TYPE.SET_USER_INFO]: (state, payload) => {
      state.userInfo = payload
    },
    /**
     * 设置是否登陆
     */
    [MUTATIONS_TYPE.SET_IS_LOGIN]: (state, payload) => {
      state.isLogin = payload
    }
  },
  actions: {
    /**
     * 设置用户信息并存储
     * @param {*} param0 
     */
    setUserInfo: async ({ commit }) => {
      const params = {
        uToken: local.getItem(STORAGE.TOKEN)
      }
      const { data } = await getUserInfo(params)

      commit(MUTATIONS_TYPE.SET_USER_INFO, data)
      local.setItem(STORAGE.WX_USER_INFO, data)
      Promise.resolve()
    },
    /**
     * 退出登陆并清除本地数据
     */
    logOut: async ({ commit }) => {
      const params = {
        uToken: local.getItem(STORAGE.TOKEN)
      }
      await logOut(params)

      commit(MUTATIONS_TYPE.SET_USER_INFO, {})
      commit(MUTATIONS_TYPE.SET_IS_LOGIN, false)

      Object.values(STORAGE).map(key => {
        key !== STORAGE.ORG_ID && uni.removeStorageSync(key)
      })
      Promise.resolve()
    }
    /**
     * @description: 获取用户openId
     * @author: zhj1214
     */
    /* getOpenId(context) {
      uni.login({
        success: (res) => {
          console.log(res, "微信login成功");
          uni.$api
            .apiRequest("getOpenId", {
              code: res.code,
            })
            .then((response) => {
              if (
                response.code == 10000 &&
                response.data &&
                response.data.openid
              ) {
                context.commit("setOpenId", response.data.openid);
              } else {
                response.data && uni.$alert.showToast(response.data.message);
              }
            });
        },
      });
    }, */
  },
};

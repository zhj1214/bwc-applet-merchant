/*
 * @Description: 状态管理
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 15:55:05
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-01 15:55:05
 */
import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  modules: {
    user,
  },
  state: {
    orgId: "", // 当前商场ID
    appletId: "", // 当前授权小城西 APPID
    rootOrgId: "", // 当前授权小程序 商户ID
    token:"" // 登录token
  },
});
export default store;

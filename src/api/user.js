/*
 * @Description: 用户、登录、个人中心页面 相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:39:48
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-07-27 16:24:33
 */

export default {
  /**************登录*************/
  loginPhone: 'POST::/yhqt-server/wechat-server/api/webchat/registerOrLoginV2', // 手机号登录
  loginPassword: 'POST::/yhqt-server/wechat-server/api/webchat/loginByAccount', // 密码登录
  loginPhoneCode: '/yhqt-server/wechat-server/api/webchat/getSmsCode', // 获取验证码
  checkloginPhone: 'POST::/yhqt-server/wechat-server/api/webchat/verifyPhone', // 验证客户手机号
  checkRegistPhone: '/yhqt-server/wechat-server/api/webchat/verifyIsRegister', // 验证客户手机号是否注册
  setloginPassword: 'POST::/yhqt-server/wechat-server/api/webchat/reset/password', // 设置密码
  
  /**
   * @description: 获取订单详情 示例
   * @param {*} response 请求结果
   * @param {*} params   请求参数
   * @param {*} resolve 回调函数
   * @author: zhj1214
   */  
  getOrderDetailDemo: (response, params, resolve) => {
    if (!response) return 'POST::/marketing-server/api/remote/pay/getOrderDetail'
    console.log('入参：', params)
    response.time = '2021-09-05'
    resolve(response)
  },
}

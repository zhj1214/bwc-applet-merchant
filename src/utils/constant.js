/*
 * @Author: NineNan
 * @Date: 2021-07-19 14:03:44
 * @LastEditTime: 2021-09-03 23:27:04
 * @LastEditors: zhj1214
 * @Description: constant 全局常量
 * 为什么要有这个文件，就是为了以后的代码可以更好的维护，
 * 把公共的常量名称定义在一个地方，需要的地方再进行引入，
 * 保证了只要修改一个文件就可以修改所有需要修改的地方。
 *
 * 举个栗子
 * 本地存储的token本来定义的名称是 TOKEN，但是因为某些原因，
 * 需要改成 USER_TOKEN, 如果每个开发者，都是在自己的页面写了 TOKEN 来获取的，
 * 而不是用一个全局常量的，就需要改很多的地方，因此这个文件是很有必要存在的。
 * @FilePath: \yh_client\src\utils\constant.js
 */

export const CODE_SUCCESS = 10000

// 公共服务前缀
export const API_SERVICE = {
  SERVICE: '/yhqt-server/',
  COMPETITION: '/yhqt-server/competition-server/',
  POLICY: '/yhqt-server/policy-server/',
  USER: '/yhqt-server/user-server/',
  WE_CHAT: '/yhqt-server/wechat-server/',
  UPLOAD_SERVICE: '/yhqt-server/oss-server/api/open/upload',
}

// 全局本地存储常量
export const STORAGE = {
  WX_USER_INFO: 'wxUserInfo',
  TOKEN: 'Token',
  MEMBER_ID: 'memberId',
  ROOT_ORG_ID: 'rootOrgId',
  ORG_ID: 'orgId',
  SEARCH_HISTORY: 'SEARCH_HISTORY', // 搜索历史
}

export const MUTATIONS_TYPE = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_IS_LOGIN: 'SET_IS_LOGIN',
}

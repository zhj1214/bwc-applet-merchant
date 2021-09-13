/*
 * @Description:本地存储封装
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-04 09:26:36
 */
/****************** 基本存储 操作 ******************/
const setItem = function (key, val) {
  try {
    uni.setStorageSync(key, JSON.stringify(val))
  } catch (e) {
    uni.setStorageSync(key, '')
  }
}

const getItem = function (key) {
  try {
    let value = uni.getStorageSync(key)

    value = JSON.parse(value)
    return value || ''
  } catch (e) {
    return ''
  }
}

const remove = function (key) {
  uni.removeStorage({
    key: key,
    success() {
      console.log('删除本地缓存___' + key)
    },
  })
}
/****************** 用于保存当前用户相关信息 val 新增属性，或者修改原属性 ******************/
const setCurrentUser = function (val) {
  const user = this.getItem('wxUserInfo')
  const obj = { ...user, ...val }
  this.setItem('wxUserInfo', obj)
  if (obj.memberIdStr || obj.memberId) this.setItem('memberId', obj.memberIdStr || obj.memberId)
  if (obj.organizationId) this.setItem('userOrgId', obj.organizationId)
}

const getCurrentUser = function () {
  return this.getItem('wxUserInfo')
}

const removeCurrentUserKey = function (key) {
  const user = this.getItem('wxUserInfo')
  delete user[key]
  this.setItem('wxUserInfo', user)
}

module.exports = {
  setItem,
  getItem,
  remove,
  setCurrentUser,
  getCurrentUser,
  removeCurrentUserKey,
}

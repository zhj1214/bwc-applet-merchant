/*
 * @Description:本地存储封装
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-02 23:24:06
 */
/****************** 基本存储 操作 ******************/
const EXPIRETIMEKEY = 'expireTimeKey_1214'

const setItem = function (key, val, expireTime) {
  try {
    uni.setStorageSync(key, JSON.stringify(val))
    if (expireTime) {
      let keyArr = getItem(EXPIRETIMEKEY)
      if (!keyArr) keyArr = []
      keyArr.push({
        key: key,
        expireTime: new Date().getTime() + expireTime,
      })
      uni.setStorageSync(EXPIRETIMEKEY, JSON.stringify(keyArr))
    }
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

// 清楚本地过期的缓存数据
const runExpireTime = function () {
  const keyArr = getItem(EXPIRETIMEKEY)
  if (keyArr && keyArr.length > 0) {
    const curTime = new Date().getTime()
    const newArr =
      keyArr.filter((element) => {
        const isDelete = element.expireTime <= curTime
        if (isDelete) {
          remove(element.key)
        }
        return !isDelete
      }) || []
    setItem(EXPIRETIMEKEY, newArr)
  }
}
runExpireTime()

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

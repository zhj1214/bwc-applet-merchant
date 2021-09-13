/*
 * @Description: 全局提示
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-03 22:28:24
 */
const showToast = (text = '缺少提示内容', icon = 'none') =>
  uni.showToast({
    icon,
    title: text,
    duration: 3000,
  })

/**
 * @description: Loading
 * @author: zhj1214
 */
const showLoading = (text, mask = true) =>
  uni.showLoading({
    mask,
    title: text,
  })

/**
 * @description: 自定义提示
 * @param {*} title
 * @param {*} content
 * @param {*} showCancel
 * @return {*} Promise
 * @example: uni.$toast.showModal('标题','内容')
 * @author: zhj1214
 */
const showModal = async (title, content, showCancel = false) => {
  uni.hideToast()
  uni.showModal({
    title,
    content,
    showCancel,
    success(res) {
      if (res.confirm) {
        return true
      } else if (res.cancel) {
        return false
      }
    },
  })
}

module.exports = {
  showLoading,
  showToast,
  showModal,
}

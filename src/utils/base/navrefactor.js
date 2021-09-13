/*
 * @Description: 重写导航跳转事件
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-19 17:40:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-19 11:25:39
 */
import sence from '../sceneManage'

const SCENE_PARSE_KEY = '$_scene_parsed' // 场景析构
const SCENE_DONE_KEY = '$_scene_done' // 场景模式所有逻辑执行完成

class Nav {
  constructor() {
    this.senceObj = {}
    this.init()
  }
  refactor(jumpKey) {
    uni[jumpKey] = (param) => {
      console.log('跳转页面', param)
      this.senceObj = sence.getQueueScene()
      console.log('场景~~~', this.senceObj)
      if (this.senceObj) {
        if (
          !uni.$localStorage.getItem('orgId') ||
          this.senceObj[SCENE_PARSE_KEY].orgId != uni.$localStorage.getItem('orgId')
        ) {
          this.changeMall(param, jumpKey) // 是否存在商场，不存在/存在但不一致 都要切换商场
        } else if (!uni.$localStorage.getItem('Token')) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          // 逻辑完成 替换旧的 场景队列中的场景对象。
          this.senceObj[SCENE_DONE_KEY] = true
          sence.updataManageQueue(this.senceObj)
          param.url = this.senceObj.pagePath
          wx.navigateTo(param)
        }
      } else {
        wx[jumpKey](param)
      }
    }
  }
  init() {
    this.refactor('switchTab')
    this.refactor('reLaunch')
    this.refactor('redirectTo')
    this.refactor('navigateTo')
    // uni.navigateBack = this.refactor(param, "navigateBack");
    // console.log("初始化完成");
  }

  /**
   * 切换商场（把新的商场重新写入缓存）
   * 更新用户信息（积分、成长值）
   * */
  changeMall(param, jumpKey) {
    const app = getApp()
    this.senceObj = sence.getQueueScene()
    console.log(this.senceObj, 'this.senceObjthis.senceObj')
    app.globalData.orgId = this.senceObj[SCENE_PARSE_KEY].orgId
    uni.$localStorage.setItem('orgId', this.senceObj[SCENE_PARSE_KEY].orgId)

    uni.$api
      .apiRequest('getMallInfoUserServer', {
        orgId: this.senceObj[SCENE_PARSE_KEY].orgId,
      })
      .then((res) => {
        if (res.code === 10000) {
          uni.$localStorage.setItem('currentMall', {
            marketName: res.data.name,
            orgId: this.senceObj[SCENE_PARSE_KEY].orgId,
            orgid: this.senceObj[SCENE_PARSE_KEY].orgId,
          })

          uni[jumpKey](param) // 重新走一遍逻辑
        }
      })

    this.updataUserInfo()
  }
  /**
   * @description: 更新用户信息
   * @author: zhj1214
   */
  updataUserInfo() {
    // var self = this
    uni.$util.getMemberInfo().then((res) => {
      if (res) {
        // const u = { ...self.userInfo, ...res }
        // app.globalData.integral = res.integral
        uni.$localStorage.setCurrentUser(res)
        uni.$localStorage.setItem('memberId', res.memberId)
      }
    })
  }
}

export default new Nav()

/**
 * @description: 云函数mixin
 * @author: zhj1214
 */
export default {
  /**
   * 运行介绍：这个文件主要用于处理云函数的逻辑
   * 1.加载使用的工具类的模块
   * 2.初始化 所需要使用的模块
   * 3.获取小程序模板配置、并配置rootOrgId
   * 4.调用小程序login、获取openID；检查小程序是否需要更新；保存手机信息
   * 5.小程序逻辑处理
   * 6.是否需要 上报错误日志（默认不需要）
   * */
  onLaunch: function (options) {
    // 第三方平台，自定义配置
    if (uni.getExtConfig) {
      var self = this
      uni.getExtConfig({
        success(res) {
          // console.log(res.extConfig, 'getExtConfig')
          if (res.extConfig) {
            self.globalData.configExt = res.extConfig
            let rootOrgId = ''
            if (res.extConfig.appId) {
              self.globalData.appletId = res.extConfig.appId
              uni.$localStorage.setItem('appletId', res.extConfig.appId)
              // self.initCloud()
              // 配置rootOrgId
              if (res.extConfig.orgId) {
                rootOrgId = res.extConfig.orgId
              }
            }
            self.globalData.rootOrgId = rootOrgId
            uni.$localStorage.setItem('rootOrgId', rootOrgId)
            // 获取设备信息
            self.getCurrentIphoneInfo()
          }
        },
      })
    }
  },

  methods: {
    /**
     * @description: 初始化云函数
     * @author: zhj1214
     */
    initCloud() {
      this.globalData.isEnableCloudError = false // 是否开启错误上报
      // 获取用户的openId还是使用原生的最为方便
      wx.cloud.init({
        env: 'dev-avbw2', // 少华椒麻鸡
        // env: 'slmostest-21s4r', // 恒太测试
        traceUser: true,
      })
      // uni-app 会打包编译，所以使用uniCloud才是最好的体验
      const myCloud = uniCloud.init({
        provider: 'tencent',
        spaceId: 'zhj1214-525887',
        clientSecret: '',
      })
      uni.$uniCloud = myCloud
      this.getShopId()
    },
    /**
     * 获取手机型号、版本信息
     */
    getCurrentIphoneInfo() {
      let iphoneInfo = uni.getSystemInfoSync()
      const accountInfo = uni.getAccountInfoSync()
      iphoneInfo = {
        ...iphoneInfo,
        ...accountInfo,
      }
      this.globalData.iphoneInfo = iphoneInfo
      // #ifdef MP-WEIXIN
      //导航高度
      this.globalData.navHeight = iphoneInfo.statusBarHeight + 46
      const version = iphoneInfo.SDKVersion
      if (uni.$util.compareVersion(version, '2.5.2') >= 0) {
        if (iphoneInfo.model.search('iPhone X') !== -1) {
          this.globalData.isIPX = true
        }
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        uni.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        })
      }
      // #endif
    },
    /**
     * @description: 获取当前店铺Id
     * @author: zhj1214
     */
    async getShopId() {
      var self = this
      const db = uni.$uniCloud.database()
      const result = await db
        .collection('zhxShopData')
        .field({
          switchExamine: true,
        })
        .get()
      //   console.log('result:', result)
      if (result.result.data && result.result.data.length > 0) {
        result.result.data.forEach((element) => {
          if (element.switchExamine) {
            self.globalData.shopCurrentId = element._id
          }
        })
        // console.log('当前要使用的是：', self.globalData.shopCurrentId)
      } else {
        self.globalData.shopCurrentId = '17453ede60924ddb0776196f21488f33'
      }
      // 没有要展示的店铺这种情况就是审核界面
      uni.$eventbus.$emit('initIndexData', self.globalData)
    },

    // #ifdef MP-WEIXIN
    /**
     * 获取 code、openid
     */
    userLogin(isApi) {
      var success = (res) => {
        if (res.code === 10000) {
          if (res.data.openid) {
            this.globalData.userOpenId = res.data.openid
            uni.$localStorage.setItem('userOpenId', res.data.openid)
          }
          if (!isApi) {
            this.globalData.info = res.data
            uni.$localStorage.setItem('info', res.data)
            uni.$eventbus.$emit('mangerShow', res.data) // 通知回调执行后续逻辑
          }
        } else {
          res.message && uni.$alert.showToast(res.message)
        }
      }

      uni.login({
        success: (res) => {
          if (isApi && !uni.$localStorage.getItem('userOpenId')) {
            uni.$api
              .apiRequest('getOpenId', {
                code: res.code,
              })
              .then(success)
          }
          if (!uni.$localStorage.getItem('openId')) {
            uni.$api
              .cloudRequest('getInfo', {
                code: res.code,
              })
              .then(success)
          }
        },
      })
    },
    /**
     * 动态监听 网络
     * */
    async dynamicNetWorking() {
      uni.onNetworkStatusChange(function (res) {
        if (res.networkType === 'none' || res.networkType === 'unknown') {
          uni.$alert.showModal('网络异常', '请检查当前网络是否可用')
        }
      })
    },
    /**
     * 小程序更新操作
     */
    async appIsUptate() {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        res.hasUpdate
          ? console.warn('当前版本过低，可以安装最新版本')
          : console.warn('当前小程序已是最新版本')
      })
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，需要重启应用？',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate() // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            }
          },
        })
      })
      updateManager.onUpdateFailed(function () {
        uni.$alert.showModal('更新提示', '新版本下载失败') // 新的版本下载失败
      })
    },
    // #endif
  },
}

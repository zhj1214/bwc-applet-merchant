<script>
  import './utils/base/string'
  import local from './utils/localStorage'
  import toast from './utils/toast'
  import util from './utils/tool'
  import eventbus from './utils/observer/index.js'
  import api from './api'
  import scene from './utils/sceneManage'
  import { STORAGE } from '@/utils/constant'
  import appMixin from './AppMixin'
  // import canvas from './utils/canvas'
  // import navigation from './utils/base/navrefactor'
  // import theme from './utils/theme' 弃用，后续使用store配置主题
  // import statistics from './utils/sampling/statistics' 弃用
  // import sampling from './utils/sampling/sampling' 弃用

  /**
   * fundebug 错误跟踪
   * "fundebug-wxjs": "^1.4.1",
   * var fundebug = require('fundebug-wxjs')
   * this.initFundebug() // 初始化 fundebug
   * */

  export default {
    name: 'AppDelegate',
    mixins: [appMixin],
    globalData: {
      // fundebug: fundebug,
    },
    onShow: function (options) {
      console.warn(options, '____onShow')
      this.globalData.onShowOptions = options // 存储入口参
    },
    /**
     * 运行介绍
     * 1.加载使用的工具类的模块
     * 2.初始化 所需要使用的模块
     * 3.获取小程序模板配置、并配置rootOrgId
     * 4.调用小程序login、获取openID；检查小程序是否需要更新；保存手机信息
     * 5.小程序逻辑处理
     * 6.是否需要 上报错误日志（默认不需要）
     * */
    onLaunch: function () {
      /***************************************** ① 绑定全局属性、并初始化 *****************************************/
      uni.$api = api
      uni.$alert = toast
      uni.$util = util
      uni.$localStorage = local
      uni.$eventbus = eventbus
      uni.$scene = scene
      // uni.$canvas = canvas
      /***************************************** ② 初始化配置信息 *****************************************/
      uni.$localStorage.setItem(STORAGE.ORG_ID, '58265426') // 余杭的组织ID
      this.globalData.orgId = '58265426'
      /***************************************** ③ 逻辑代码 *****************************************/
      this.getCurrentIphoneInfo() // 获取设备信息

      // this.initFundebug()
      // #ifdef MP-WEIXIN
      this.initCloud() // 初始化云函数
      this.dynamicNetWorking()
      this.appIsUptate() //小程序是否有最新版本
      this.getThirdpartyConfig() // 小程序 第三方平台，自定义配置
      // #endif

      setTimeout(() => {
        eventbus.$emit('testinitindexdata', this.globalData)
      }, 2000)
    },

    methods: {
      /**
       * @description: 初始化 fundebug
       * @author: zhj1214
       */
      initFundebug() {
        // if (process.env.NODE_ENV !== 'production') {
        //   fundebug.init({
        //     apikey: 'bc54da06260628ce66655e75364fbc0085580b61ef0fc0d0a764555126d06bb2',
        //     httpTimeout: 6000,
        //   })
        // }
      },

      /**
       * @description: 获取 小程序 第三方授权配置
       * @author: zhj1214
       */
      getThirdpartyConfig() {
        if (uni.getExtConfig) {
          const self = this
          uni.getExtConfig({
            success(res) {
              if (res.extConfig) {
                self.globalData.configExt = res.extConfig
                // 小程序 AppId
                if (res.extConfig.appId) {
                  self.globalData.appletId = res.extConfig.appId
                  local.setItem('appletId', res.extConfig.appId)
                }
                // Root组织 rootOrgId
                if (res.extConfig.orgId) {
                  var rootOrgId = res.extConfig.orgId
                  self.globalData.rootOrgId = rootOrgId
                  local.setItem('rootOrgId', rootOrgId)
                }
              }
            },
          })
        }
      },
    },
    /**
     * @description: 小程序进入后台
     * @author: zhj1214
     */
    onHide: function () {
      console.warn('App 小程序进入后台')
    },
  }
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';
  @import '@/style/reset.scss';
</style>

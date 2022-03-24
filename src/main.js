/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 11:44:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-09 16:43:50
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

Vue.use(uView)
Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.mixin({
  onShow() {
    console.log(`📲 进入 ${this.$options.name || 'page'}；`)
  },
  onHide() {
    console.log(`🔚 离开 ${this.$options.name || 'page'}；`)
  },
  methods: {
    setData: function (obj, callback) {
      const that = this
      const handleData = (tepData, tepKey, afterKey) => {
        tepKey = tepKey.split('.')
        tepKey.forEach((item) => {
          if (tepData[item] === null || tepData[item] === undefined) {
            const reg = /^[0-9]+$/
            tepData[item] = reg.test(afterKey) ? [] : {}
            tepData = tepData[item]
          } else {
            tepData = tepData[item]
          }
        })
        return tepData
      }
      const isFn = function (value) {
        return typeof value === 'function' || false
      }
      Object.keys(obj).forEach(function (key) {
        const val = obj[key]
        key = key.replace(/\]/g, '').replace(/\[/g, '.')
        let front, after
        const index_after = key.lastIndexOf('.')
        if (index_after != -1) {
          after = key.slice(index_after + 1)
          front = handleData(that, key.slice(0, index_after), after)
        } else {
          after = key
          front = that
        }
        if (front.$data && front.$data[after] === undefined) {
          Object.defineProperty(front, after, {
            get() {
              return front.$data[after]
            },
            set(newValue) {
              front.$data[after] = newValue
              that.$forceUpdate()
            },
            enumerable: true,
            configurable: true,
          })
          front[after] = val
        } else {
          that.$set(front, after, val)
        }
      })
      // this.$forceUpdate();
      isFn(callback) && this.$nextTick(callback)
    },
  },
})

Sentry.init({
  dsn: 'https://254db14b9ecc43fb8c2206d9aeb6496b@o1064678.ingest.sentry.io/6055684',

  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()

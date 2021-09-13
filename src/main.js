/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 11:44:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-03 23:56:24
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui'

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

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()

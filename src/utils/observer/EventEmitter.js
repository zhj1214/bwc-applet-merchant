/*
 * @Description: 观察者：通过 on 方法注册事件，trigger 方法触发事件，来达到事件之间的松散解耦，并且额外添加了 once 和 off 辅助函数用于注册只触发一次的事件以及注销事件promisify
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2020-12-22 03:55:53
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-03 23:01:38
 */

/**
 * @description: 创建 观察者类
 * @example: eventEmitter.constructor();eventEmitter.on('abc',()=>{});eventEmitter.trigger('abc',{data:'test'})
 * @author: zhj1214
 */
export default {
  constructor() {
    this.subs = {}
  },

  on(event, cb) {
    ;(this.subs[event] || (this.subs[event] = [])).push(cb)
  },

  trigger(event, ...args) {
    this.subs[event] &&
      this.subs[event].forEach((cb) => {
        cb(...args)
      })
  },

  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args)
      this.off(event, onceCb)
    }
    this.on(event, cb)
  },

  off(event, offCb) {
    if (this.subs[event]) {
      const index = this.subs[event].findIndex((cb) => cb === offCb)
      this.subs[event].splice(index, 1)
      if (!this.subs[event].length) delete this.subs[event]
    }
  },
}

// 此处是为了解决 第一次进入程序，获取token后，在获取用户信息
// var self = this;
// uni.$eventEmitter.on("onectGetUserinfo", () => {
// 	self.getHomeMemberInfo();
// 	self.initData();
// });

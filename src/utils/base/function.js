/*
 * @Description: 函数装饰器
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-04 09:51:15
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-01 18:37:07
 */

Function.prototype.before = function (beforefn) {
  var self = this //保存原函数引用
  return function () {
    console.log(arguments, 'arguments')
    //返回包含了原函数和新函数的 '代理函数'
    const rtr = beforefn.apply(this, arguments) || {} //执行新函数，修正this
    return self.apply(this, { arguments, ...rtr }) //执行原函数
  }
}
Function.prototype.after = function (afterfn) {
  var self = this
  return function () {
    var ret = self.apply(this, arguments)
    afterfn.apply(this, arguments)
    return ret
  }
}
// @example:
var func = function (val) {
  console.log('2', val)
}
//func1和func3为挂载函数
var func1 = function () {
  console.log('1')
  return { a: 111 }
}
var func3 = function () {
  console.log('3')
}
func = func.before(func1).after(func3)
func('1234567')

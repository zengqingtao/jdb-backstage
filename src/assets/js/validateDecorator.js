// 私有方法/属性方法 创建的实例的私有方法不会相等，这跟new操作有关
// new操作会在函数内部创建一个新的Object，所有this绑定到Object上
// 公有/原型链方法 创建实例的公有方法会相等
// 在这里使用私有方法，由于自定义指令绑定方法需要不同
// 还有为什么原有的校验函数不能用this.oldValidate绑定
// 因为在rules生成相应的校验函数时装饰器this已经被改变了，所以采取闭包
/**
 * @description: 针对某些表单控件需要后端请求才知道是否校验成功，增加表单校验装饰器的方法 构造函数
 * @param {Function} old 构造函数
 * @oldAttr {Function} customerCheck 方法
 * @useFn {Function} check 方法
 */
function validateDecorator(old) {
  const oldValidate = old
  const _this = this
  //私有方法
  this.check = function (rule, value, callback) {
    oldValidate.customerCheck(rule, value, callback)
    _this.checkRequestError(rule, value, callback, this.validator.error)
  }
}
//公有方法
validateDecorator.prototype.checkRequestError = function (
  rule,
  value,
  callback,
  error
) {
  error ? callback(new Error(error)) : callback()
}
export default validateDecorator
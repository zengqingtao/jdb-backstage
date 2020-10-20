/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-09-09 13:54:40
 * @LastEditTime: 2020-09-09 14:14:36
 * @Descripttion: 自定义指令
 */
import input from './debounce-input.js'
export default {
  install: function(Vue, options){
    Vue.directive('debounce-input', input)
  }
}

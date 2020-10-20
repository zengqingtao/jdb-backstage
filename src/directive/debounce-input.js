/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-09-09 13:55:55
 * @LastEditTime: 2020-09-14 18:15:35
 * @Descripttion: 防抖输入，等用户输入完成0.5秒后调用函数
 * @notice: 使用时，组件定义了debounce-input，修改该值时，请刷新页面，不然看不到效果
 */
export default {
  bind: (el, binding, Node) => {
    let awaitTime = 0
    if(!Number.isNaN(+Node.data.attrs["debounce-second"])){
      awaitTime = +Node.data.attrs["debounce-second"] * 1000;
    }else{
      console.error('debounce-second type is number or string digit')
    }
    console.log("debounce-input awaitTime", awaitTime);
    el.handleInput = function(val) {
      if (el.timer) {
        clearTimeout(el.timer);
      }
      el.timer = setTimeout(() => {
        binding.value(val);
      }, awaitTime || 500);
    };
    el.addEventListener("input", el.handleInput);
  },
  unbind: (el) => {
    el.timer && clearTimeout(el.timer);
    el && el.removeEventListener("input", el.handleInput);
  },
};

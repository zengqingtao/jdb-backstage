import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "../router";
import { Message } from "element-ui";

let Axios = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 1000 * 60,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
});

// POST传参序列化（添加请求拦截器）
Axios.interceptors.request.use(
  (config) => {
    if (localStorage.jdb_token) {
      config.headers.token = localStorage.jdb_token;
    }
    return config;
  },
  (error) => {
    Message({
      showClose: true,
      message: "网络出错",
      type: "error",
    });
    return Promise.reject("网络出错");
  }
);

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  (res) => {
    // 对响应数据做些事
    if (res.data && res.data.code === 2003) {
      localStorage.removeItem("jdb_token");
      localStorage.removeItem("jdb_userInfo");
      localStorage.removeItem("jdb_menu");
      router.push({ path: "/" });
      Message({
        showClose: true,
        message: "登录失效，请重新登录！",
        type: "error",
      });
    } else if (res.data && res.data.code && ![200, 204, 8027].includes(res.data.code)) {
      // 由于大部分接口都已经写了判断请求返回的状态码，若不是200便提示错误，故这里需要注释，否则会出现两遍错误提示
      // let errorMsgArr = ['该年份无业绩', '该用户不存在，请重新输入', '此时间段没有充值记录', '没有相关联用户，请重新输入']
      // if (res.data.msg && !errorMsgArr.includes(res.data.msg)) {
      //     Message({
      //         showClose: true,
      //         message: res.data.msg,
      //         type: 'error'
      //     })
      // }
      res.data.msg && Message.error(res.data.msg);
    }
    return res;
  },
  (error) => {
    // 用户登录的时候会拿到一个基础信息,比如用户名,token 直接丢localStorage
    if (
      !localStorage.jdb_token ||
      !localStorage.jdb_userInfo ||
      !localStorage.jdb_menu
    ) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({ path: "/" });
    } else {
      // 返回 response 里的错误信息
      Message.error("网络异常");
      return Promise.reject(error);
    }
  }
);

Vue.use(VueAxios, Axios);

export default Axios;

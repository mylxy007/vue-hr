import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { success, message } = response.data;
    if (success) {
      return response.data;
    } else {
      Message.error(message);
      return Promise.reject(message);
    }
  },
  (error) => {
    // 4xx/5xx的响应状态
    Message.error(
      (error.response && error.response.data && error.response.data) ||
        error.message
    );
    // 具体分析
    // 通过http状态码判断 error.response.status === 401
    // 还可以用code逻辑码来判断
    // 左侧有值才会继续往下去点属性(防止空值) (可选链操作符) 新版语法，需要babel支持才能使用
    if (error?.response?.data?.code === 10002) {
      // 清除token
      // 清除用户信息
      // 返回login页面
      store.dispatch("user/logoutActions");
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`);
    }
    return Promise.reject(error);
  }
);

export default service;

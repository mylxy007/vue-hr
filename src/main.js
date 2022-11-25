import Vue from "vue";
import "normalize.css/normalize.css"; // 清除默认css样式的包
import ELEMENT from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // 全局css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // 图标
import "@/permission"; // 路由守卫
import power from "@/directive/power";
Vue.directive("power", power);
// 全局注册组件
import Global from "@/components";
Vue.use(Global);
// 多语言配置
import i18n from "@/lang";
// Vue.use(ElementUI, {
//   locale,
// });
// 中文版 elment-ui
Vue.use(ELEMENT);
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});

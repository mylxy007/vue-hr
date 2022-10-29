import router from "./router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import store from "@/store";

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration

const whiteList = ["/login", "/404"]; // 白名单，进入页面无需token

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = store.getters.token;
  if (token) {
    if (to.path === "/login") {
      //登录后不能再去登录页
      next("/");
      NProgress.done();
    } else {
      next();
      if (!store.getters.name) {
        store.dispatch("user/getUserInfoActions");
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

// 正常next()放行了跳转了，才会走后置守卫，关闭正常流程进度条
router.afterEach((to, from, next) => {
  NProgress.done();
});

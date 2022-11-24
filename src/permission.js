import router, { asyncRoutes } from "./router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import store from "@/store";
import getPageTitle from "@/utils/get-page-title";
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
        const menus = await store.dispatch("user/getUserInfoActions");
        console.log(menus);
        // 用menus权限点英文字符串和路由规则对象name匹配
        // 把所有准备好的8个路由规则对象取出，看看名字和menus是否匹配，匹配就证明
        // 此登录的用户有这个页面的访问权限，让filter收集此路由规则对象到新数组中
        const filterList = asyncRoutes.filter((routeObj) => {
          const routeName = routeObj.children[0].name.toLowerCase();
          return menus.includes(routeName);
        });
        filterList.push({
          path: "*",
          redirect: "/404",
          hidden: true,
        });
        router.addRoutes(filterList);
        store.commit("permission/SETROUTES", filterList);
        // 路由再跳转一次，因为上面next()会导致白屏(因为放行时，动态路由还没有加入到内存中 )
        next({
          path: to.path,
          replace: true, //不让回退，类似this.$router.replace();
        });
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
  document.title = getPageTitle(to.meta.title);
  NProgress.done();
});

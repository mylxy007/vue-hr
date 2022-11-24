import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";
import approvals from "./modules/approvals";
import attendances from "./modules/attendances";
import departments from "./modules/departments";
import employees from "./modules/employees";
import permission from "./modules/permission";
import salarys from "./modules/salarys";
import setting from "./modules/setting";
import social from "./modules/social";
// 动态路由规则
export const asyncRoutes = [
  departments,
  setting,
  employees,
  permission,
  approvals,
  attendances,
  salarys,
  social,
];
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: {
          title: "首页",
          icon: "dashboard",
        },
      },
    ],
  },
  // {
  //   path: "*",
  //   redirect: "/404",
  //   hidden: true,
  // },
  {
    path: "/excel",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/excel"),
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    // routes: [...constantRoutes, ...asyncRoutes],
    routes: [...constantRoutes],
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

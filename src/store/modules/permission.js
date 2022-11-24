import { constantRoutes } from "@/router";

export default {
  namespaced: true,
  state: {
    routes: constantRoutes,
  },
  actions: {},
  mutations: {
    SETROUTES(state, asyncRoutes) {
      console.log(asyncRoutes);
      state.routes = [...constantRoutes, ...asyncRoutes];
    },
  },
  getters: {},
};

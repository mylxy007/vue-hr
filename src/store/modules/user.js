import { loginAPI, getUserInfoAPI, getUserPhotoAPI } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
    setToken(token);
  },
  REMOVE_TOKEN(state) {
    state.token = "";
    removeToken();
  },
  // 保存用户信息
  SET_USER(state, userInfo) {
    state.userInfo = userInfo;
  },
  // 清空用户信息
  REMOVE_USER(state) {
    state.userInfo = {};
  },
};

const actions = {
  // 封装登录逻辑
  async loginActions({ commit }, data) {
    const res = await loginAPI(data);
    commit("SET_TOKEN", res.data);
    return res;
  },

  // 获取用户信息
  async getUserInfoActions({ commit, state }) {
    const res = await getUserInfoAPI();
    const res2 = await getUserPhotoAPI(res.data.userId);
    commit("SET_USER", { ...res.data, ...res2.data });
    return res.data.roles.menus; //返回页面权限点英文字符串数组
  },

  // 封装-退出登录逻辑
  logoutActions({ commit }) {
    commit("REMOVE_TOKEN");
    commit("REMOVE_USER");
    // 重置路由
    resetRouter();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

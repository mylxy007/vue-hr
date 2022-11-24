/**
 * 按钮级权限控制
 */
import store from "@/store";

export default {
  inserted(el, binding) {
    // 从 vuex 中取出 points
    const points = store.state.user.userInfo.roles.points; //按钮权限点的英文字符串数组
    // 如果 points 中有 binding.value 则显示
    // 不存在则隐藏
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  },
};

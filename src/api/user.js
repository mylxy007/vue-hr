import request from "@/utils/request";

/**
 *
 * @param {*} data 手机号+密码的对象
 * @returns Promise对象
 */
export const loginAPI = (data) =>
  request({
    url: "/sys/login",
    method: "post",
    data,
  });

/**
 * 获取用户基本信息
 * @returns
 */
export const getUserInfoAPI = () =>
  request({
    url: "/sys/profile",
    method: "post",
  });

/**
 * 获取员工基本信息(那到头像)
 */
export const getUserPhotoAPI = (id) =>
  request({
    url: `/sys/user/${id}`,
  });

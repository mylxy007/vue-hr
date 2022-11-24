import request from "@/utils/request";

/**
 * 请求所有角色列表
 * @param {*} params {page: 页码, size: 每页条数}
 * @returns Promise对象
 */
export const getRoleListAPI = (params) =>
  request({
    url: "/sys/role",
    method: "get",
    params,
  });

/**
 * 根据id获取公司信息
 * @param {*} companyId 公司id
 * @returns
 */
export const getCompanyInfoAPI = (companyId) =>
  request({
    url: `/company/${companyId}`,
  });

/**
 * 添加角色
 * @param {*} data { name:角色名称, description: 角色描述 }
 * @returns Promise对象
 */
export const addRoleAPI = (data) =>
  request({
    url: "/sys/role",
    method: "post",
    data,
  });
/**
 * 根据id获取角色详情
 * @param {*} roleId 角色id
 * @returns Promise对象
 */
export const getRoleDetailAPI = (roleId) =>
  request({
    url: `/sys/role/${roleId}`,
  });

/**
 * 编辑角色
 * @param {*} roleObj 角色对象
 * @returns Promise对象
 */
export const editRoleAPI = (roleObj) =>
  request({
    url: `/sys/role/${roleObj.id}`,
    method: "put",
    data: roleObj,
  });

/**
 * 删除角色
 * @param {*} roleId 角色id
 * @returns Promise对象
 */
export const delRoleAPI = (roleId) =>
  request({
    url: `/sys/role/${roleId}`,
    method: "delete",
  });

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns Promise对象
 */
export function assignPermAPI(data) {
  return request({
    url: "/sys/role/assignPrem",
    method: "put",
    data,
  });
}

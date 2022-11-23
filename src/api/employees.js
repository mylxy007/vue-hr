import request from "@/utils/request";

/**
 * 获取员工列表
 * @param {*} params {page: 页码, size: 条数}
 * @returns Promise对象
 */
export const getEmployeesListAPI = (params) =>
  request({
    url: "/sys/user",
    params,
  });

/**
 * 新增员工
 * @param {*} data 员工信息对象
 * @returns Promise对象
 */
export const addEmployeesAPI = (data) =>
  request({
    url: "/sys/user",
    method: "post",
    data,
  });
/**
 * 删除员工
 * @param {*} id 员工id
 * @returns Promise对象
 */
export const delEmployeeAPI = (id) =>
  request({
    url: `/sys/user/${id}`,
    method: "delete",
  });

// 批量导入员工
export const importEmployeeAPI = (data) =>
  request({
    url: "/sys/user/batch",
    method: "post",
    data,
  });

export const updateEmployeesAPI = (data) =>
  request({
    url: `/sys/user/${data.id}`,
    method: "put",
    data,
  });

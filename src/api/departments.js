import request from "@/utils/request";

/**
 * 获取-部门列表-方法
 * @returns Promise对象
 */
export const getDepartmentsListAPI = () =>
  request({
    url: "/company/department",
  });

/**
 * 获取-员工简单列表（只有名字和员工id）
 * @returns Promise对象
 */
export const getEmployeesSimpleListAPI = () =>
  request({
    url: "/sys/user/simple",
  });

/**
 * 添加-部门
 * @returns Promise对象
 */
export const addDepartmentsAPI = (data) =>
  request({
    url: "/company/department",
    method: "post",
    data,
  });

/**
 * 查询部门详情-根据id
 * @returns Promise对象
 */
export const getDepartDetailAPI = (departId) =>
  request({
    url: `/company/department/${departId}`,
  });

/**
 * 更新部门详情
 *
 */

export const updateDepartmentsAPI = (data) =>
  request({
    url: `/company/department/${data.id}`,
    method: "put",
    data,
  });

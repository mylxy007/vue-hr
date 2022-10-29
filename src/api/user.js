import request from '@/utils/request'

/**
 * 
 * @param {*} data 手机号+密码的对象 
 * @returns Promise对象
 */
export const loginAPI = (data) => request({
  url: '/sys/login',
  method: 'post',
  data,
})

export const getUserInfoAPI = () => request({
  url: '/sys/profile',
  method: 'post'
})

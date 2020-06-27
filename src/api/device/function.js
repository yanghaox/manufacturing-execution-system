import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取功能列表
export function getFunctionList(params) {
  return request({
    url: '/fbi/device/function',
    method: 'get',
    params,
    baseURL
  })
}

// 添加功能
export function postFunction(data) {
  return request({
    url: '/fbi/device/function',
    method: 'post',
    data,
    baseURL
  })
}

// 设备方式列表
export function getMethodList() {
  return request({
    url: '/fbi/device/function/method',
    method: 'get',
    baseURL
  })
}

// 获取功能详情
export function getFunctionDetail(functionId) {
  return request({
    url: `/fbi/device/function/${functionId}`,
    method: 'get',
    baseURL
  })
}

// 修改功能
export function putFunction(data, functionId) {
  return request({
    url: `/fbi/device/function/${functionId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deleteFunction(functionId) {
  return request({
    url: `/fbi/device/function/${functionId}`,
    method: 'delete',
    baseURL
  })
}


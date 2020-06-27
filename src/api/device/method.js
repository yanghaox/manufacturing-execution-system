import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取方式列表
export function getMethodList(params) {
  return request({
    url: '/fbi/device/method',
    method: 'get',
    params,
    baseURL
  })
}

// 添加方式
export function postMethod(data) {
  return request({
    url: '/fbi/device/method',
    method: 'post',
    data,
    baseURL
  })
}

// 获取方式详情
export function getMethodDetail(methodId) {
  return request({
    url: `/fbi/device/method/${methodId}`,
    method: 'get',
    baseURL
  })
}

// 修改方式
export function putMethod(data, methodId) {
  return request({
    url: `/fbi/device/method/${methodId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deleteMethod(methodId) {
  return request({
    url: `/fbi/device/method/${methodId}`,
    method: 'delete',
    baseURL
  })
}

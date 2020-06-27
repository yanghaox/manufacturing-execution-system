import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取类型列表
export function getType(params) {
  return request({
    url: '/fbi/device/type',
    method: 'get',
    params,
    baseURL
  })
}

// 添加类型
export function postType(data) {
  return request({
    url: '/fbi/device/type',
    method: 'post',
    data,
    baseURL
  })
}

// 修改类型
export function putType(data, typeId) {
  return request({
    url: `/fbi/device/type/${typeId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除类型
export function deleteType(typeId) {
  return request({
    url: `/fbi/device/type/${typeId}`,
    method: 'delete',
    baseURL
  })
}

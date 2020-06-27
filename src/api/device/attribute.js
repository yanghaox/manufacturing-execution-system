import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取属性列表
export function getAttributesList(params) {
  return request({
    url: '/fbi/device/attribute',
    method: 'get',
    params,
    baseURL
  })
}

// 新增属性
export function postAttributes(data) {
  return request({
    url: '/fbi/device/attribute',
    method: 'post',
    data,
    baseURL
  })
}

// 提交修改
export function putAttributes(data, attributeId) {
  return request({
    url: `/fbi/device/attribute/${attributeId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除属性
export function deleteAttributes(attributeId) {
  return request({
    url: `/fbi/device/attribute/${attributeId}`,
    method: 'delete',
    baseURL
  })
}


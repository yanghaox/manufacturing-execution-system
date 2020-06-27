import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 功能列表
export function getFunction() {
  return request({
    url: '/fbi/device/unit/function',
    method: 'get',
    baseURL
  })
}

// 属性列表
export function getAttribute() {
  return request({
    url: '/fbi/device/unit/attribute',
    method: 'get',
    baseURL
  })
}

// 类型列表
export function getDeviceType() {
  return request({
    url: `/fbi/device/unit/type`,
    method: 'get',
    baseURL
  })
}

// 获取管道物料列表
export function getPipelineMaterial() {
  return request({
    url: `/fbi/device/unit/material`,
    method: 'get',
    baseURL
  })
}

// 获取管道列表
export function getPipeline(params) {
  return request({
    url: `/fbi/device/unit/pipeline`,
    method: 'get',
    params,
    baseURL
  })
}

// 获取设备单元列表
export function getDeviceUnit(params) {
  return request({
    url: '/fbi/device/unit',
    method: 'get',
    params,
    baseURL
  })
}

// 新增设备单元
export function addDeviceUnit(data) {
  return request({
    url: `/fbi/device/unit`,
    method: 'post',
    data,
    baseURL
  })
}

// 编辑设备单元
export function editDeviceUnit(data, deviceId) {
  return request({
    url: `/fbi/device/unit/${deviceId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除设备单元
export function deleteDeviceUnit(deviceId) {
  return request({
    url: `/fbi/device/unit/${deviceId}`,
    method: 'delete',
    baseURL
  })
}

// 设备单元详情
export function getDeviceUnitDetail(deviceId) {
  return request({
    url: `/fbi/device/unit/${deviceId}`,
    method: 'get',
    baseURL
  })
}

// 工位列表
export function getWorkLocation() {
  return request({
    url: '/fbi/device/unit/work-location',
    method: 'get',
    baseURL
  })
}

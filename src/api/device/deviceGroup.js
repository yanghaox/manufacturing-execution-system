import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取设备组列表
export function getDeviceGroupList(query) {
  return request({
    url: '/fbi/device/group',
    method: 'get',
    params: query,
    baseURL
  })
}

// 新增设备组
export function postDeviceGroup(data) {
  return request({
    url: '/fbi/device/group',
    method: 'post',
    data,
    baseURL
  })
}

// 属性列表
export function getAttribute() {
  return request({
    url: '/fbi/device/group/attribute',
    method: 'get',
    baseURL
  })
}

// 部门列表
export function getDepartment() {
  return request({
    url: '/fbi/device/group/department',
    method: 'get',
    baseURL
  })
}

// 功能列表
export function getFunction() {
  return request({
    url: '/fbi/device/group/function',
    method: 'get',
    baseURL
  })
}

// 工位列表
export function getWorkLocation() {
  return request({
    url: '/fbi/device/group/work-location',
    method: 'get',
    baseURL
  })
}

// 设备组详情
export function getDeviceGroupDetail(query) {
  return request({
    url: `/fbi/device/group/${query.groupId}`,
    method: 'get',
    baseURL
  })
}

// 修改数组
export function putDeviceGroup(data) {
  return request({
    url: `/fbi/device/group/${data.groupId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除设备组
export function deleteDeviceGroup(data) {
  return request({
    url: `/fbi/device/group/${data.groupId}`,
    method: 'delete',
    baseURL
  })
}

// 设备单元列表
export function getDeviceUnit() {
  return request({
    url: '/fbi/device/group/unit',
    method: 'get',
    baseURL
  })
}

// 新增设备单元
export function addDeviceUnit(data, groupId) {
  return request({
    url: `/fbi/device/group/unit/${groupId}`,
    method: 'post',
    data,
    baseURL
  })
}

// 编辑设备单元
export function editDeviceUnit(data, deviceId) {
  return request({
    url: `/fbi/device/group/unit/${deviceId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除设备单元
export function deleteDeviceUnit(data, groupId) {
  return request({
    url: `/fbi/device/group/unit/${groupId}`,
    method: 'delete',
    data,
    baseURL
  })
}

// 设备单元详情
export function getDeviceUnitDetail(deviceId) {
  return request({
    url: `/fbi/device/group/unit/${deviceId}`,
    method: 'get',
    baseURL
  })
}

// 类型列表
export function getDeviceType() {
  return request({
    url: `/fbi/device/group/type`,
    method: 'get',
    baseURL
  })
}

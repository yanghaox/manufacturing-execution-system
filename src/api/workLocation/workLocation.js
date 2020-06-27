import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取列表
export function getWorkLocationList(params) {
  return request({
    url: '/fbi/work-location/work-location',
    method: 'get',
    params,
    baseURL
  })
}

// 新增工位信息
export function addWorkLocation(data) {
  return request({
    url: '/fbi/work-location/work-location',
    method: 'post',
    data,
    baseURL
  })
}

// 获取负责人列表
export function getPrincipal() {
  return request({
    url: `/fbi/work-location/work-location/principal`,
    method: 'get',
    baseURL
  })
}

// 获取车间列表
export function getWorkShop() {
  return request({
    url: `/fbi/work-location/work-location/work-shop`,
    method: 'get',
    baseURL
  })
}

// 修改工位信息
export function putWorkLocation(data, workLocationId) {
  return request({
    url: `/fbi/work-location/work-location/${workLocationId}`,
    method: 'put',
    baseURL,
    data
  })
}

// 删除工位信息
export function deleteWorkLocation(workLocationId) {
  return request({
    url: `/fbi/work-location/work-location/${workLocationId}`,
    method: 'delete',
    baseURL
  })
}

import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取原料列表
export function getMaterialList(params) {
  return request({
    url: '/fbi/formula/material',
    method: 'get',
    params,
    baseURL
  })
}

// 新增原料
export function postMaterial(data) {
  return request({
    url: '/fbi/formula/material',
    method: 'post',
    data,
    baseURL
  })
}

// 详情
export function getMaterialDetail(materialId) {
  return request({
    url: `/fbi/formula/material/${materialId}`,
    method: 'get',
    baseURL
  })
}

// 修改原料
export function putMaterial(data, materialId) {
  return request({
    url: `/fbi/formula/material/${materialId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除原料
export function deletedMaterial(materialId) {
  return request({
    url: `/fbi/formula/material/${materialId}`,
    method: 'delete',
    baseURL
  })
}

// 批量删除
export function batchDeletion(data) {
  return request({
    url: '/fbi/formula/material/batch',
    method: 'delete',
    data,
    baseURL
  })
}

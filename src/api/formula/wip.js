import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取半成品信息列表
export function getWipList(params) {
  return request({
    url: '/fbi/formula/wip',
    method: 'get',
    params,
    baseURL
  })
}

// 新增半成品信息
export function postWip(data) {
  return request({
    url: '/fbi/formula/wip',
    method: 'post',
    data,
    baseURL
  })
}

// 半成品信息详情
export function getWipDetail(materialId) {
  return request({
    url: `/fbi/formula/wip/${materialId}`,
    method: 'get',
    baseURL
  })
}

// 修改半成品
export function putWip(data, materialId) {
  return request({
    url: `/fbi/formula/wip/${materialId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除半成品信息
export function deleteWip(materialId) {
  return request({
    url: `/fbi/formula/wip/${materialId}`,
    method: 'delete',
    baseURL
  })
}

// 批量删除
export function batchDeletionWip(data) {
  return request({
    url: `/fbi/formula/wip/batch`,
    method: 'delete',
    data
  })
}

import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取成品BOM列表
export function getBomWipList(params) {
  return request({
    url: '/fbi/formula/bom-wip',
    method: 'get',
    params,
    baseURL
  })
}

// 新增成品BOM
export function addBomWip(data) {
  return request({
    url: '/fbi/formula/bom-wip',
    method: 'post',
    data,
    baseURL
  })
}

// 编辑成品BOM
export function editBomWip(data, id) {
  return request({
    url: `/fbi/formula/bom-wip/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除成品BOM
export function deleteBomWip(id) {
  return request({
    url: `/fbi/formula/bom-wip/${id}`,
    method: 'delete',
    baseURL
  })
}

// 获取成品BOM详情
export function getBomWipDetail(data, id) {
  return request({
    url: `/fbi/formula/bom-wip/${id}`,
    method: 'get',
    data,
    baseURL
  })
}

// 获取半成品,包材信息
export function getBomWipInfo(params) {
  return request({
    url: '/fbi/formula/bom-wip/material/list',
    method: 'get',
    params,
    baseURL
  })
}

// 获取成品BOM版本列表
export function getBomWipVersion(id) {
  return request({
    url: `/fbi/formula/bom-wip/version/list/${id}`,
    method: 'get',
    baseURL
  })
}

// 获取成品BOM版本详情
export function getBomWipVersionDetail(id) {
  return request({
    url: `/fbi/formula/bom-wip/version/${id}`,
    method: 'get',
    baseURL
  })
}

// 新增成品BOM版本
export function addBomWipVersion(data, id) {
  return request({
    url: `/fbi/formula/bom-wip/version/${id}`,
    method: 'post',
    data,
    baseURL
  })
}

// 编辑成品BOM版本
export function editBomWipVersion(data, id) {
  return request({
    url: `/fbi/formula/bom-wip/version/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除成品BOM版本
export function deleteBomWipVersion(id) {
  return request({
    url: `/fbi/formula/bom-wip/version/${id}`,
    method: 'delete',
    baseURL
  })
}


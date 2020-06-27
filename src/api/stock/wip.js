import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取半成品列表
export function getWipList(params) {
  return request({
    url: '/fbi/stock/wip',
    method: 'get',
    params,
    baseURL
  })
}

// 新增半成品
export function postWip(data) {
  return request({
    url: '/fbi/stock/wip',
    method: 'post',
    data,
    baseURL
  })
}

// 半成品信息列表
export function getWipInfoList() {
  return request({
    url: '/fbi/stock/wip/wip',
    method: 'get',
    baseURL
  })
}

// 获取半成品详情
export function getWipDetail(stockId) {
  return request({
    url: `/fbi/stock/wip/${stockId}`,
    method: 'get',
    baseURL
  })
}

// 修改半成品
export function putWip(data, stockId) {
  return request({
    url: `/fbi/stock/wip/${stockId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deleteWip(stockId) {
  return request({
    url: `/fbi/stock/wip/${stockId}`,
    method: 'delete',
    baseURL
  })
}

// 半成品审核通过
export function audited(data) {
  return request({
    url: `/fbi/stock/wip/audited`,
    method: 'put',
    data,
    baseURL
  })
}

// 半成品取消审核
export function pending(data) {
  return request({
    url: `/fbi/stock/wip/pending`,
    method: 'put',
    data,
    baseURL
  })
}

// 半成品作废
export function invalid(data) {
  return request({
    url: `/fbi/stock/wip/invalid`,
    method: 'put',
    data,
    baseURL
  })
}

// 半成品包装库存列表
export function getMaterialPackageList(params, stockId) {
  return request({
    url: `/fbi/stock/wip/package/${stockId}`,
    method: 'get',
    params,
    baseURL
  })
}

// 包装库存正常
export function packageNormal(packageId) {
  return request({
    url: `/fbi/stock/wip/package/normal/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存变质
export function packageMetamorphism(packageId) {
  return request({
    url: `/fbi/stock/wip/package/metamorphism/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存过期
export function packageExpired(packageId) {
  return request({
    url: `/fbi/stock/wip/package/expired/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存作废
export function packageInvalid(packageId) {
  return request({
    url: `/fbi/stock/wip/package/invalid/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 半成品包装库存日志列表
export function getPackageLog(params, packageId) {
  return request({
    url: `/fbi/stock/wip/package/log/${packageId}`,
    method: 'get',
    params,
    baseURL
  })
}

// 盘点
export function inventory(data, packageId) {
  return request({
    url: `/fbi/stock/material/package/inventory/${packageId}`,
    method: 'put',
    data,
    baseURL
  })
}

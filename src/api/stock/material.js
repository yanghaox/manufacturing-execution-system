import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取原料列表
export function getMaterialList(params) {
  return request({
    url: '/fbi/stock/material',
    method: 'get',
    params,
    baseURL
  })
}

// 新增原料
export function postMaterial(data) {
  return request({
    url: '/fbi/stock/material',
    method: 'post',
    data,
    baseURL
  })
}

// 原料信息列表
export function getMaterialInfoList() {
  return request({
    url: '/fbi/stock/material/material',
    method: 'get',
    baseURL
  })
}

// 获取原料详情
export function getMaterialDetail(stockId) {
  return request({
    url: `/fbi/stock/material/${stockId}`,
    method: 'get',
    baseURL
  })
}

// 修改原料
export function putMaterial(data, stockId) {
  return request({
    url: `/fbi/stock/material/${stockId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 原料删除
export function deleteMaterial(stockId) {
  return request({
    url: `/fbi/stock/material/${stockId}`,
    method: 'delete',
    baseURL
  })
}

// 原料审核通过
export function audited(data) {
  return request({
    url: `/fbi/stock/material/audited`,
    method: 'put',
    data,
    baseURL
  })
}

// 原料取消审核
export function pending(data) {
  return request({
    url: `/fbi/stock/material/pending`,
    method: 'put',
    data,
    baseURL
  })
}

// 原料作废
export function invalid(data) {
  return request({
    url: `/fbi/stock/material/invalid`,
    method: 'put',
    data,
    baseURL
  })
}

// 原料包装库存列表
export function getMaterialPackageList(params, stockId) {
  return request({
    url: `/fbi/stock/material/package/${stockId}`,
    method: 'get',
    params,
    baseURL
  })
}

// 包装库存正常
export function packageNormal(packageId) {
  return request({
    url: `/fbi/stock/material/package/normal/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存变质
export function packageMetamorphism(packageId) {
  return request({
    url: `/fbi/stock/material/package/metamorphism/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存过期
export function packageExpired(packageId) {
  return request({
    url: `/fbi/stock/material/package/expired/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存作废
export function packageInvalid(packageId) {
  return request({
    url: `/fbi/stock/material/package/invalid/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 原料包装库存日志列表
export function getPackageLog(params, packageId) {
  return request({
    url: `/fbi/stock/material/package/log/${packageId}`,
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

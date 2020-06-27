import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取包材列表
export function getPackageList(params) {
  return request({
    url: '/fbi/stock/package',
    method: 'get',
    params,
    baseURL
  })
}

// 新增包材
export function postPackage(data) {
  return request({
    url: '/fbi/stock/package',
    method: 'post',
    data,
    baseURL
  })
}

// 包材信息列表
export function getPackageInfoList() {
  return request({
    url: '/fbi/stock/package/package',
    method: 'get',
    baseURL
  })
}

// 获取包材详情
export function getPackageDetail(stockId) {
  return request({
    url: `/fbi/stock/package/${stockId}`,
    method: 'get',
    baseURL
  })
}

// 修改包材
export function putPackage(data, stockId) {
  return request({
    url: `/fbi/stock/package/${stockId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deletePackage(stockId) {
  return request({
    url: `/fbi/stock/package/${stockId}`,
    method: 'delete',
    baseURL
  })
}

// 包材审核通过
export function audited(data) {
  return request({
    url: `/fbi/stock/package/audited`,
    method: 'put',
    data,
    baseURL
  })
}

// 包材取消审核
export function pending(data) {
  return request({
    url: `/fbi/stock/package/pending`,
    method: 'put',
    data,
    baseURL
  })
}

// 包材作废
export function invalid(data) {
  return request({
    url: `/fbi/stock/package/invalid`,
    method: 'put',
    data,
    baseURL
  })
}

// 包材包装库存列表
export function getMaterialPackageList(params, stockId) {
  return request({
    url: `/fbi/stock/package/package/${stockId}`,
    method: 'get',
    params,
    baseURL
  })
}

// 包装库存正常
export function packageNormal(packageId) {
  return request({
    url: `/fbi/stock/package/package/normal/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存变质
export function packageMetamorphism(packageId) {
  return request({
    url: `/fbi/stock/package/package/metamorphism/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存过期
export function packageExpired(packageId) {
  return request({
    url: `/fbi/stock/package/package/expired/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存作废
export function packageInvalid(packageId) {
  return request({
    url: `/fbi/stock/package/package/invalid/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包材包装库存日志列表
export function getPackageLog(params, packageId) {
  return request({
    url: `/fbi/stock/package/package/log/${packageId}`,
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

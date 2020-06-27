import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取成品列表
export function getProductList(params) {
  return request({
    url: '/fbi/stock/product',
    method: 'get',
    params,
    baseURL
  })
}

// 新增成品
export function postProduct(data) {
  return request({
    url: '/fbi/stock/product',
    method: 'post',
    data,
    baseURL
  })
}

// 成品信息列表
export function getProductInfoList() {
  return request({
    url: '/fbi/stock/product/product',
    method: 'get',
    baseURL
  })
}

// 获取成品详情
export function getProductDetail(stockId) {
  return request({
    url: `/fbi/stock/product/${stockId}`,
    method: 'get',
    baseURL
  })
}

// 修改成品
export function putProduct(data, stockId) {
  return request({
    url: `/fbi/stock/product/${stockId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deleteProduct(stockId) {
  return request({
    url: `/fbi/stock/product/${stockId}`,
    method: 'delete',
    baseURL
  })
}

// 成品审核通过
export function audited(data) {
  return request({
    url: `/fbi/stock/product/audited`,
    method: 'put',
    data,
    baseURL
  })
}

// 成品取消审核
export function pending(data) {
  return request({
    url: `/fbi/stock/product/pending`,
    method: 'put',
    data,
    baseURL
  })
}

// 成品作废
export function invalid(data) {
  return request({
    url: `/fbi/stock/product/invalid`,
    method: 'put',
    data,
    baseURL
  })
}

// 成品包装库存列表
export function getMaterialPackageList(params, stockId) {
  return request({
    url: `/fbi/stock/product/package/${stockId}`,
    method: 'get',
    params,
    baseURL
  })
}

// 包装库存正常
export function packageNormal(packageId) {
  return request({
    url: `/fbi/stock/product/package/normal/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存变质
export function packageMetamorphism(packageId) {
  return request({
    url: `/fbi/stock/product/package/metamorphism/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存过期
export function packageExpired(packageId) {
  return request({
    url: `/fbi/stock/product/package/expired/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 包装库存作废
export function packageInvalid(packageId) {
  return request({
    url: `/fbi/stock/product/package/invalid/${packageId}`,
    method: 'put',
    baseURL
  })
}

// 成品包装库存日志列表
export function getPackageLog(params, packageId) {
  return request({
    url: `/fbi/stock/product/package/log/${packageId}`,
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

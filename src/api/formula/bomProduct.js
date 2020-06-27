import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取成品BOM列表
export function getBomProductList(params) {
  return request({
    url: '/fbi/formula/bom-product',
    method: 'get',
    params,
    baseURL
  })
}

// 新增成品BOM
export function addBomProduct(data) {
  return request({
    url: '/fbi/formula/bom-product',
    method: 'post',
    data,
    baseURL
  })
}

// 编辑成品BOM
export function editBomProduct(data, id) {
  return request({
    url: `/fbi/formula/bom-product/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除成品BOM
export function deleteBomProduct(id) {
  return request({
    url: `/fbi/formula/bom-product/${id}`,
    method: 'delete',
    baseURL
  })
}

// 获取成品BOM详情
export function getBomProductDetail(data, id) {
  return request({
    url: `/fbi/formula/bom-product/${id}`,
    method: 'get',
    data,
    baseURL
  })
}

// 获取半成品,包材信息
export function getBomProductInfo(params) {
  return request({
    // TODO 这里应该是两个查询 url: '/fbi/formula/bom-product/package/list',
    url: '/fbi/formula/bom-product/package-wip/list',
    method: 'get',
    params,
    baseURL
  })
}

// 获取成品BOM版本列表
export function getBomProductVersion(id) {
  return request({
    url: `/fbi/formula/bom-product/version/list/${id}`,
    method: 'get',
    baseURL
  })
}

// 获取成品BOM版本详情
export function getBomProductVersionDetail(id) {
  return request({
    url: `/fbi/formula/bom-product/version/${id}`,
    method: 'get',
    baseURL
  })
}

// 新增成品BOM版本
export function addBomProductVersion(data, id) {
  return request({
    url: `/fbi/formula/bom-product/version/${id}`,
    method: 'post',
    data,
    baseURL
  })
}

// 编辑成品BOM版本
export function editBomProductVersion(data, id) {
  return request({
    url: `/fbi/formula/bom-product/version/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除成品BOM版本
export function deleteBomProductVersion(id) {
  return request({
    url: `/fbi/formula/bom-product/version/${id}`,
    method: 'delete',
    baseURL
  })
}


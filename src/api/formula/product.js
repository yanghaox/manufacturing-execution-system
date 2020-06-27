import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取成品信息列表
export function getProductList(params) {
  return request({
    url: '/fbi/formula/product',
    method: 'get',
    params,
    baseURL
  })
}

// 新增成品信息
export function postProduct(data) {
  return request({
    url: '/fbi/formula/product',
    method: 'post',
    data,
    baseURL
  })
}

// 成品信息详情
export function getProductDetail(materialId) {
  return request({
    url: `/fbi/formula/product/${materialId}`,
    method: 'get',
    baseURL
  })
}

// 修改成品
export function putProduct(data, materialId) {
  return request({
    url: `/fbi/formula/product/${materialId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除成品信息
export function deleteProduct(materialId) {
  return request({
    url: `/fbi/formula/product/${materialId}`,
    method: 'delete',
    baseURL
  })
}

// 批量删除
export function batchDeletionProduct(data) {
  return request({
    url: `/fbi/formula/product/batch`,
    method: 'delete',
    data
  })
}

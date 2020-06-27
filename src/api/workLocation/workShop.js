import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

/**
 * 获取车间列表
 * @param params
 * @returns {never}
 */
export function getWorkShopList(params) {
  return request({
    url: '/fbi/work-location/work-shop',
    method: 'get',
    params,
    baseURL
  })
}

/**
 * 添加车间
 * @param data
 * @returns {AxiosPromise}
 */
export function postWorkShop(data) {
  return request({
    url: '/fbi/work-location/work-shop',
    method: 'post',
    data,
    baseURL
  })
}

/**
 * 负责人列表
 */
export function getPrincipalList() {
  return request({
    url: '/fbi/work-location/work-shop/principal',
    method: 'get',
    baseURL
  })
}

/**
 * 获取车间详情
 * @param workShopId
 * @returns {AxiosPromise}
 */
export function getWorkShopDetail(workShopId) {
  return request({
    url: `/fbi/work-location/work-shop/${workShopId}`,
    method: 'get',
    baseURL
  })
}

/**
 * 修改车间
 * @param data
 * @param workShopId
 * @returns {AxiosPromise}
 */
export function putWorkShop(data, workShopId) {
  return request({
    url: `/fbi/work-location/work-shop/${workShopId}`,
    method: 'put',
    data,
    baseURL
  })
}

/**
 * 删除车间
 * @param workShopId
 * @returns {AxiosPromise}
 */
export function deleteWorkShop(workShopId) {
  return request({
    url: `/fbi/work-location/work-shop/${workShopId}`,
    method: 'delete',
    baseURL
  })
}

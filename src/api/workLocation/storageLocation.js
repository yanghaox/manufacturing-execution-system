import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

/**
 * 获取库位列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getStorageLocationList(params) {
  return request({
    url: '/fbi/work-location/storage-location',
    method: 'get',
    params,
    baseURL
  })
}

/**
 * 添加库位
 * @param data
 * @returns {AxiosPromise}
 */
export function addStorageLocation(data) {
  return request({
    url: '/fbi/work-location/storage-location',
    method: 'post',
    data,
    baseURL
  })
}

/**
 * 获取负责人列表
 * @returns {AxiosPromise}
 */
export function getPrincipalList() {
  return request({
    url: '/fbi/work-location/storage-location/principal',
    method: 'get',
    baseURL
  })
}

/**
 * 获取车间列表
 * @returns {AxiosPromise}
 */
export function getWorkShopList() {
  return request({
    url: '/fbi/work-location/storage-location/work-shop',
    method: 'get',
    baseURL
  })
}

/**
 * 获取库位详情
 * @param storageLocationId
 * @returns {AxiosPromise}
 */
export function getStorageLocationDetail(storageLocationId) {
  return request({
    url: `/fbi/work-location/storage-location/${storageLocationId}`,
    method: 'get',
    baseURL
  })
}

/**
 * 修改库位
 * @param data
 * @param storageLocationId
 * @returns {AxiosPromise}
 */
export function putStorageLocation(data, storageLocationId) {
  return request({
    url: `/fbi/work-location/storage-location/${storageLocationId}`,
    method: 'put',
    data,
    baseURL
  })
}

/**
 * 删除库位
 * @param storageLocationId
 * @returns {AxiosPromise}
 */
export function deleteStorageLocation(storageLocationId) {
  return request({
    url: `/fbi/work-location/storage-location/${storageLocationId}`,
    method: 'delete'
  })
}

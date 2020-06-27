import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

/**
 * 获取工作类型列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getType(params) {
  return request({
    url: '/fbi/produce/type',
    metho: 'get',
    params,
    baseURL
  })
}

/**
 * 新增工作类型
 * @param data Object
 * @returns {AxiosPromise}
 */
export function postType(data) {
  return request({
    url: '/fbi/produce/type',
    method: 'post',
    data,
    baseURL
  })
}

/**
 * 修改工作类型
 * @param data
 * @param typeId  类型id
 * @returns {AxiosPromise}
 */
export function putType(data, typeId) {
  return request({
    url: `/fbi/produce/type/${typeId}`,
    method: 'put',
    data,
    baseURL
  })
}

/**
 * 删除工作类型
 * @param typeId
 * @returns {AxiosPromise}
 */
export function deleteType(typeId) {
  return request({
    url: `/fbi/produce/type/${typeId}`,
    method: 'delete',
    baseURL
  })
}

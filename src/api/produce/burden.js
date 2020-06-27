import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'

const baseURL = ''

/**
 * 获取配料列表
 * @param params
 * @returns {never}
 */
// export function getBurdenList(params) {
//   return request({
//     url: '/fbi/produce/burden',
//     metho: 'get',
//     params,
//     baseURL
//   })
// }

/**
 * 获取配料过程列表
 * @param burdenId
 * @returns {never}
 */
// export function getprocess(params, burdenId) {
//   return request({
//     url: `/fbi/produce/burden/process/${burdenId}`,
//     metho: 'get',
//     params,
//     baseURL
//   })
// }

/**
 * 打印配料过程列表
 * @param burdenId
 * @returns {never}
 */
// export function printProcess(params, burdenId) {
//   return request({
//     url: `/fbi/produce/burden/process/print/${burdenId}`,
//     metho: 'get',
//     params,
//     baseURL
//   })
// }

/**
 * 获取工单列表
 * @returns {AxiosPromise}
 */
export function getWorkOrder(params) {
  return request({
    url: '/fbi/produce/burden/work-order',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 获取批次列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getBatch(params) {
  return request({
    url: '/fbi/produce/burden/batch',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 获取配料列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getBurden(params) {
  return request({
    url: '/fbi/produce/burden',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 获取配料过程列表
 * @param params
 * @param burdenId
 * @returns {AxiosPromise}
 */
export function getProcess(params, burdenId) {
  return request({
    url: `/fbi/produce/burden/process/${burdenId}`,
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 打印
 * @param params
 * @param burdenId
 * @returns {AxiosPromise}
 */
export function processPrint(params, burdenId) {
  return request({
    url: `/fbi/produce/burden/process/print/${burdenId}`,
    params,
    method: 'get',
    baseURL
  })
}

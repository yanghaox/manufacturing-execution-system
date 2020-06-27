import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'

const baseURL = ''

/**
 * 获取批次列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getBatch(params) {
  return request({
    url: '/fbi/produce/batch',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 新增批次
 * @param data
 * @returns {AxiosPromise}
 */
export function postBatch(data) {
  return request({
    url: '/fbi/produce/batch',
    data,
    method: 'post',
    baseURL
  })
}

/**
 * 审批通过
 * @param batchId
 * @returns {AxiosPromise}
 */
export function audited(batchId) {
  return request({
    url: `/fbi/produce/batch/audited/${batchId}`,
    method: 'put',
    baseURL
  })
}

/**
 * 审批拒绝
 * @param batchId
 * @returns {AxiosPromise}
 */
export function auditedFailure(batchId) {
  return request({
    url: `/fbi/produce/batch/audited_failure/${batchId}`,
    method: 'put',
    baseURL
  })
}

/**
 * 批次作废
 * @param batchId
 * @returns {AxiosPromise}
 */
export function invalid(batchId) {
  return request({
    url: `/fbi/produce/batch/invalid/${batchId}`,
    method: 'put',
    baseURL
  })
}

/**
 * 获取工艺列表
 * @returns {AxiosPromise}
 */
export function getTech() {
  return request({
    url: '/fbi/produce/batch/tech',
    method: 'get',
    baseURL
  })
}

/**
 * 获取工艺版本
 * @param techId
 * @returns {AxiosPromise}
 */
export function getTechVersion(techId) {
  return request({
    url: `/fbi/produce/batch/tech/version/${techId}`,
    method: 'get',
    baseURL
  })
}

/**
 * 获取工单列表
 * @returns {AxiosPromise}
 */
export function getWorkOrder() {
  return request({
    url: '/fbi/produce/batch/work-order',
    method: 'get',
    baseURL
  })
}

/**
 * 获取部门
 * @returns {AxiosPromise}
 */
export function getDepartment() {
  return request({
    url: '/fbi/produce/batch/department',
    method: 'get',
    baseURL
  })
}

/**
 * 获取类型列表
 * @returns {AxiosPromise}
 */
export function getType() {
  return request({
    url: '/fbi/produce/batch/type',
    method: 'get',
    baseURL
  })
}

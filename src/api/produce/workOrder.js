import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'

const baseURL = ''

/**
 * 工单列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getWorkOrder(params) {
  return request({
    url: '/fbi/produce/work-order',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 添加工单
 * @param data
 * @returns {AxiosPromise}
 */
export function postWorkOrder(data) {
  return request({
    url: '/fbi/produce/work-order',
    data,
    method: 'post',
    baseURL
  })
}

/**
 * 工单详情
 * @param workOrderId
 * @returns {AxiosPromise}
 */
export function getWorkOrderDetail(workOrderId) {
  return request({
    url: `/fbi/produce/work-order/detail/${workOrderId}`,
    method: 'get',
    baseURL
  })
}

/**
 * 删除工单
 * @param workOrderId
 * @returns {AxiosPromise}
 */
export function deleteWorkOrder(workOrderId) {
  return request({
    url: `/fbi/produce/work-order/${workOrderId}`,
    method: 'delete',
    baseURL
  })
}

/**
 * 部门列表
 * @returns {AxiosPromise}
 */
export function getDepartment() {
  return request({
    url: '/fbi/produce/work-order/department',
    method: 'get',
    baseURL
  })
}


import request from '@/utils/request'

const baseURL = 'http://172.16.1.141:3000/mock/17'

// const baseURL = ''

/**
 * 获取生产批次清单
 * @param params
 * @returns {AxiosPromise}
 */
export function getBatch(params) {
  return request({
    url: '/fbi/burden-site/review/batch',
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 获取库位信息
 * @param params
 * @param batchCode
 * @returns {AxiosPromise}
 */
export function getStorageLocation(batchCode, params) {
  return request({
    url: `/fbi/burden-site/review/storage-location/${batchCode}`,
    params,
    method: 'get',
    baseURL
  })
}

/**
 * 复核清单
 * @param params
 * @param batchCode
 * @returns {AxiosPromise}
 */
export function getBurdenProcess(batchCode, params) {
  return request({
    url: `/fbi/burden-site/review/burden-process/${batchCode}`,
    params,
    method: 'get',
    baseURL
  })
}

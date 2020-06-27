import request from '@/utils/request'

// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取列表
export function getErrorList(params) {
  return request({
    url: '/fbi/formula/error',
    method: 'get',
    params,
    baseURL
  })
}

// 新增
export function postError(data) {
  return request({
    url: '/fbi/formula/error',
    method: 'post',
    data,
    baseURL
  })
}

// 修改
export function putError(data, errorId) {
  return request({
    url: `/fbi/formula/error/${errorId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除

export function deleteError(errorId) {
  return request({
    url: `/fbi/formula/error/${errorId}`,
    method: 'delete',
    baseURL
  })
}

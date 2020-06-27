import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取包材列表
export function getPackageList(params) {
  return request({
    url: '/fbi/formula/package',
    method: 'get',
    params,
    baseURL
  })
}

// 添加包材
export function postPackage(data) {
  return request({
    url: '/fbi/formula/package',
    method: 'post',
    data,
    baseURL
  })
}

// 详情
export function getpackageDetail(materialId) {
  return request({
    url: `/fbi/formula/package/${materialId}`,
    method: 'get',
    baseURL
  })
}

// 编辑
export function putPackage(data, materialId) {
  return request({
    url: `/fbi/formula/package/${materialId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除
export function deletePackae(materialId) {
  return request({
    url: `/fbi/formula/package/${materialId}`,
    method: 'delete',
    baseURL
  })
}

// 批量删除
export function batchDeletion(data) {
  return request({
    url: '/fbi/formula/package/batch',
    method: 'delete',
    data,
    baseURL
  })
}

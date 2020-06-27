import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取岗位列表
export function getPostList(params) {
  return request({
    url: '/fbi/security/postion',
    method: 'get',
    params,
    baseURL
  })
}

// 获取岗位详情
export function getPostDeatil(postionId) {
  return request({
    url: `/fbi/security/postion/${postionId}`,
    method: 'get',
    baseURL
  })
}

// 添加岗位
export function addPost(data) {
  return request({
    url: '/fbi/security/postion',
    method: 'post',
    data,
    baseURL
  })
}

// 获取角色列表
export function getRolesList(params) {
  return request({
    url: '/fbi/security/postion/role/list',
    method: 'get',
    params,
    baseURL
  })
}

// 编辑岗位
export function editPost(data, id) {
  return request({
    url: `/fbi/security/postion/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除单条
export function deletPost(id) {
  return request({
    url: `/fbi/security/postion/${id}`,
    method: 'delete',
    baseURL
  })
}

// 删除多条
export function batchDelete(data) {
  return request({
    url: `/fbi/security/postion/batch`,
    method: 'delete',
    data,
    baseURL
  })
}

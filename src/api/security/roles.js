import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取角色列表
export function getRolesList(params) {
  return request({
    url: '/fbi/security/role',
    method: 'get',
    params,
    baseURL
  })
}

// 获取权限列表
export function getCompetence() {
  return request({
    url: '/fbi/security/role/resource/list',
    method: 'get',
    baseURL
  })
}

// 新增角色
export function addRoles(data) {
  return request({
    url: '/fbi/security/role',
    method: 'post',
    data,
    baseURL
  })
}

// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/fbi/security/role/${id}`,
    method: 'get',
    baseURL
  })
}

// 编辑角色
export function editRole(data, id) {
  return request({
    url: `/fbi/security/role/${id}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: `/fbi/security/role/${data}`,
    method: 'delete',
    baseURL
  })
}

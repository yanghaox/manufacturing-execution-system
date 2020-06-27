import request from '@/utils/request'

// 获取部门列表
export function getDepartList() {
  return request({
    url: '/fbi/security/department-postion-user',
    method: 'get'
  })
}

// 列出本部门的其它非本岗位员工
export function getDepartNotPostionUsersSelect(params) {
  return request({
    url: `/fbi/security/department-postion-user/department-not-postion-user`,
    method: 'get',
    params
  })
}

// 新增员工
export function addUser(data) {
  return request({
    url: '/fbi/security/department-postion-user/department-postion-user',
    method: 'post',
    data
  })
}

// 批量添加非本岗位员工用户
export function addDepartPostionUserList(id, data) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion-user/batch/${id}`,
    method: 'post',
    data
  })
}

// 批量删除员工
export function deleteUser(id, data) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion-user/batch/${id}`,
    method: 'delete',
    data
  })
}

// 查询部门岗位已分配用户列表
export function getDepartPostionUserList(params) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion-user/list`,
    method: 'get',
    params
  })
}

// 修改员工
export function editUser(id, data) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion-user/${id}`,
    method: 'put',
    data
  })
}

// 删除员工
export function deleteSingleUser(data) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion-user/${data.postionId}/${data.userId}`,
    method: 'delete'
  })
}

// 查询部门岗位列表
export function getDepartPostionList(id) {
  return request({
    url: `/fbi/security/department-postion-user/department-postion/list/${id}`,
    method: 'get'
  })
}

// 启用员工
export function enableUser(id) {
  return request({
    url: `/fbi/security/department-postion-user/enable/${id}`,
    method: 'put'
  })
}

// 禁用员工
export function disableUser(id) {
  return request({
    url: `/fbi/security/department-postion-user/disable/${id}`,
    method: 'put'
  })
}

// 角色列表
export function getRolesSelect() {
  return request({
    url: '/fbi/security/department-postion-user/role/list',
    method: 'get'
  })
}

// 员工详情
export function getUserInfo(id) {
  return request({
    url: `/fbi/security/department-postion-user/${id}`,
    method: 'get'
  })
}

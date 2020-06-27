import request from '@/utils/request'

// 获取部门列表
export function getDepartList() {
  return request({
    url: '/fbi/security/department-postion',
    method: 'get'
  })
}

// 列出本部门的其它非本岗位员工
export function getDepartNotPostionUser() {
  return request({
    url: '/fbi/security/department-postion-user/department-not-postion-user',
    method: 'get'
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/fbi/security/department-postion',
    method: 'post',
    data
  })
}

// 修改部门
export function editDepartment(id, data) {
  return request({
    url: `/fbi/security/department-postion/${id}`,
    method: 'put',
    data
  })
}

// 删除部门
export function deleteDepartment(id) {
  return request({
    url: `/fbi/security/department-postion/${id}`,
    method: 'delete'
  })
}

// 鼠标拖拽移动部门位置
export function movePostion(data) {
  return request({
    url: '/fbi/security/department-postion/move-position',
    method: 'put',
    data
  })
}

// 获取角色列表
export function getRolesSelect() {
  return request({
    url: '/fbi/security/department-postion/role/list',
    method: 'get'
  })
}

// 获取部门详情
export function getDepartInfo(id) {
  return request({
    url: `/fbi/security/department-postion/${id}`,
    method: 'get'
  })
}

// 查询部门岗位列表
export function getDepartPostionList(id) {
  return request({
    url: `/fbi/security/department-postion/department-postion/list/${id}`,
    method: 'get'
  })
}

// 查询所有岗位列表
export function getPostionsSelect(departmentId) {
  return request({
    url: `/fbi/security/department-postion/postion/list/${departmentId}`,
    method: 'get'
  })
}

// 批量添加部门岗位
export function addDepartPostions(id, data) {
  return request({
    url: `/fbi/security/department-postion/department-postion/batch/${id}`,
    method: 'post',
    data
  })
}

// 批量删除
export function deleteDepartPostions(id, data) {
  return request({
    url: `/fbi/security/department-postion/department-postion/batch/${id}`,
    method: 'delete',
    data
  })
}

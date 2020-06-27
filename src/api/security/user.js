import request from '@/utils/request'

// 员工列表
export function getStaffList(params) {
  return request({
    url: '/fbi/security/user',
    method: 'get',
    params
  })
}

// 禁用员工
export function postDisableStaff(id) {
  return request({
    url: `/fbi/security/user/disable/${id}`,
    method: 'put'
  })
}

// 启用员工
export function postEnableStaff(id) {
  return request({
    url: `/fbi/security/user/enable/${id}`,
    method: 'put'
  })
}

// 员工详情
export function getStaffDetail(query) {
  return request({
    url: `/fbi/security/user/${query}`,
    method: 'get'
  })
}

// 删除单条
export function deleteStaff(id) {
  return request({
    url: `/fbi/security/user/${id}`,
    method: 'delete'
  })
}

// 批量删除
export function batchDeleteStaff(data) {
  return request({
    url: `/fbi/security/user/batch`,
    method: 'delete',
    data
  })
}

import request from '@/utils/request'

export function getUserCompetence() {
  return request({
    url: '/fbi/security/account/resource',
    method: 'get'
  })
}

// 个人信息
export function getUserInfo() {
  return request({
    url: '/fbi/security/user/personal/info',
    method: 'get'
  })
}

// 个人信息修改
export function editUserInfo(data) {
  return request({
    url: '/fbi/security/user/personal/info',
    method: 'put',
    data
  })
}

// 个人信息修改密码
export function editUserPassword(data) {
  return request({
    url: '/fbi/security/user/personal/info/password',
    method: 'put',
    data
  })
}

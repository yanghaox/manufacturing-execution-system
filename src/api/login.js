import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/fbi/security/account/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/fbi/security/account/logout',
    method: 'get'
  })
}


export default {
  userList: {
    action: 'get',
    url: '/fbi/security/user'
  },
  disableUser: { // 禁用员工
    action: 'put',
    url: '/fbi/security/user/disable/{id}'
  },
  enableUser: { // 启用
    action: 'put',
    url: '/fbi/security/user/enable/{id}'
  },
  batchDeleteUser: {
    action: 'delete',
    url: '/fbi/security/user/batch'
  },
  deleteUser: {
    action: 'delete',
    url: '/fbi/security/user/{id}'
  },
  userDetile: {
    action: 'get',
    url: '/fbi/security/user/{id}'
  }
}

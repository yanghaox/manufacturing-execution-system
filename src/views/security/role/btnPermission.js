export default {
  roleList: {
    action: 'get',
    url: '/fbi/security/role'
  },
  addRole: {
    action: 'post',
    url: '/fbi/security/role'
  },
  editRole: {
    action: 'put',
    url: '/fbi/security/role/{id}'
  },
  deleteRole: {
    action: 'delete',
    url: '/fbi/security/role/{id}'
  }
}

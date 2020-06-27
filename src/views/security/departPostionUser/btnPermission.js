const btnPermission = {
  // 获取部门列表
  getDepartList: {
    url: '/fbi/security/department-postion-user',
    action: 'get'
  },

  // 列出本部门的其它非本岗位员工
  getDepartNotPostionUsersSelect: {
    url: '/fbi/security/department-postion-user/department-not-postion-user',
    action: 'get'
  },

  // 新增员工
  addUser: {
    url: '/fbi/security/department-postion-user/department-postion-user',
    action: 'post'
  },

  // 批量添加非本岗位员工用户
  addDepartPostionUserList: {
    url: '/fbi/security/department-postion-user/department-postion-user/batch/{postionId}',
    action: 'post'
  },

  // 批量删除员工
  deleteUser: {
    url: '/fbi/security/department-postion-user/department-postion-user/batch/{postionId}',
    action: 'delete'
  },

  // 查询部门岗位已分配用户列表
  getDepartPostionUserList: {
    url: '/fbi/security/department-postion-user/department-postion-user/list',
    action: 'get'
  },

  // 修改员工
  editUser: {
    url: '/fbi/security/department-postion-user/department-postion-user/{id}',
    action: 'put'
  },

  // 删除员工
  deleteSingleUser: {
    url: '/fbi/security/department-postion-user/department-postion-user/{postionId}/{userId}',
    action: 'delete'
  },

  // 查询部门岗位列表
  getDepartPostionList: {
    url: '/fbi/security/department-postion-user/department-postion/list/{id}',
    action: 'get'
  },

  // 启用员工
  enableUser: {
    url: '/fbi/security/department-postion-user/enable/{userId}',
    action: 'put'
  },

  // 禁用员工
  disableUser: {
    url: '/fbi/security/department-postion-user/disable/{userId}',
    action: 'put'
  },

  // 角色列表
  getRolesSelect: {
    url: '/fbi/security/department-postion-user/role/list',
    action: 'get'
  },

  // 员工详情
  getUserInfo: {
    url: '/fbi/security/department-postion-user/{id}',
    action: 'get'
  }
}

export default btnPermission

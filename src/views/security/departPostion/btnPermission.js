const btnPermission = {
  // 获取部门列表
  getDepartList: {
    url: '/fbi/security/department-postion',
    action: 'get'
  },

  // 列出本部门的其它非本岗位员工
  getDepartNotPostionUser: {
    url: '/fbi/security/department-postion-user/department-not-postion-user',
    action: 'get'
  },

  // 新增部门
  addDepartment: {
    url: '/fbi/security/department-postion',
    action: 'post'
  },

  // 修改部门
  editDepartment: {
    url: '/fbi/security/department-postion/{id}',
    action: 'put'
  },

  // 删除部门
  deleteDepartment: {
    url: '/fbi/security/department-postion/{id}',
    action: 'delete'
  },

  // 鼠标拖拽移动部门位置
  movePostion: {
    url: '/fbi/security/department-postion/move-position',
    action: 'put'
  },

  // 获取角色列表
  getRolesSelect: {
    url: '/fbi/security/department-postion/role/list',
    action: 'get'
  },

  // 获取部门详情
  getDepartInfo: {
    url: '/fbi/security/department-postion/{id}',
    action: 'get'
  },

  // 查询部门岗位列表
  getDepartPostionList: {
    url: '/fbi/security/department-postion/department-postion/list/{id}',
    action: 'get'
  },

  // 查询所有岗位列表
  getPostionsSelect: {
    url: '/fbi/security/department-postion/postion/list',
    action: 'get'
  },

  // 批量添加部门岗位
  addDepartPostions: {
    url: '/fbi/security/department-postion/department-postion/batch/{id}',
    action: 'post'
  },

  // 批量删除
  deleteDepartPostions: {
    url: '/fbi/security/department-postion/department-postion/batch/{id}',
    action: 'delete'
  }
}

export default btnPermission

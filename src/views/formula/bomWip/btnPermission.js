const btnPermission = {
  // 获取半成品BOM列表
  getBomWipList: {
    url: '/fbi/formula/bom-wip',
    action: 'get'
  },

  // 新增半成品BOM
  addBomWip: {
    url: '/fbi/formula/bom-wip',
    action: 'post'
  },

  // 编辑半成品BOM
  editBomWip: {
    url: '/fbi/formula/bom-wip/{id}',
    action: 'put'
  },

  // 删除半成品BOM
  deleteBomWip: {
    url: '/fbi/formula/bom-wip/{id}',
    action: 'delete'
  },

  // 获取半成品BOM详情
  getBomWipDetail: {
    url: '/fbi/formula/bom-wip/{id}',
    action: 'get'
  },

  // 获取原料信息
  getBomWipInfo: {
    url: '/fbi/formula/bom-wip/package/list',
    action: 'get'
  },

  // 获取半成品BOM版本列表
  getBomWipVersion: {
    url: '/fbi/formula/bom-wip/version/list/{id}',
    action: 'get'
  },

  // 获取半成品BOM版本详情
  getBomWipVersionDetail: {
    url: '/fbi/formula/bom-wip/version/{id}',
    action: 'get'
  },

  // 新增半成品BOM版本
  addBomWipVersion: {
    url: '/fbi/formula/bom-wip/version/{id}',
    action: 'post'
  },

  // 编辑半成品BOM版本
  editBomWipVersion: {
    url: '/fbi/formula/bom-wip/version/{id}',
    action: 'put'
  },

  // 删除半成品BOM版本
  deleteBomWipVersion: {
    url: '/fbi/formula/bom-wip/version/{id}',
    action: 'delete'
  }
}

export default btnPermission

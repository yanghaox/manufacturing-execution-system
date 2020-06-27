const btnPermission = {
  // 获取成品BOM列表
  getBomProductList: {
    url: '/fbi/formula/bom-product',
    action: 'get'
  },

  // 新增成品BOM
  addBomProduct: {
    url: '/fbi/formula/bom-product',
    action: 'post'
  },

  // 编辑成品BOM
  editBomProduct: {
    url: '/fbi/formula/bom-product/{id}',
    action: 'put'
  },

  // 删除成品BOM
  deleteBomProduct: {
    url: '/fbi/formula/bom-product/{id}',
    action: 'delete'
  },

  // 获取成品BOM详情
  getBomProductDetail: {
    url: '/fbi/formula/bom-product/{id}',
    action: 'get'
  },

  // 获取原料信息
  getBomProductInfo: {
    url: '/fbi/formula/bom-product/package/list',
    action: 'get'
  },

  // 获取成品BOM版本列表
  getBomProductVersion: {
    url: '/fbi/formula/bom-product/version/list/{id}',
    action: 'get'
  },

  // 获取成品BOM版本详情
  getBomProductVersionDetail: {
    url: '/fbi/formula/bom-product/version/{id}',
    action: 'get'
  },

  // 新增成品BOM版本
  addBomProductVersion: {
    url: '/fbi/formula/bom-product/version/{id}',
    action: 'post'
  },

  // 编辑成品BOM版本
  editBomProductVersion: {
    url: '/fbi/formula/bom-product/version/{id}',
    action: 'put'
  },

  // 删除成品BOM版本
  deleteBomProductVersion: {
    url: '/fbi/formula/bom-product/version/{id}',
    action: 'delete'
  }
}

export default btnPermission

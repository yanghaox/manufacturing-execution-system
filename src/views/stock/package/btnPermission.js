export default {
  getPackage: {
    action: 'get',
    url: '/fbi/stock/package'
  },
  addPackage: {
    action: 'post',
    url: '/fbi/stock/package'
  },
  editPackage: {
    action: 'put',
    url: '/fbi/stock/package/{stockId}'
  },
  deletePackage: {
    action: 'delete',
    url: '/fbi/stock/package/{stockId}'
  },

  audited: {
    action: 'put',
    url: '/fbi/stock/package/audited'
  },
  pending: {
    action: 'put',
    url: '/fbi/stock/package/pending'
  },
  invalid: {
    action: 'put',
    url: '/fbi/stock/package/invalid'
  },

  // 包装库存
  normal: {
    action: 'put',
    url: '/fbi/stock/package/package/normal/{packageId}'
  },
  metamorphism: {
    action: 'put',
    url: '/fbi/stock/package/package/metamorphism/{packageId}'
  },
  expired: {
    action: 'put',
    url: '/fbi/stock/package/package/expired/{packageId}'
  },
  packageInvalid: {
    action: 'put',
    url: '/fbi/stock/package/package/invalid/{packageId}'
  },
  inventory: {
    action: 'put',
    url: '/fbi/stock/material/package/inventory/{packageId}'
  }
}

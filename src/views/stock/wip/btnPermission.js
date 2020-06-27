export default {
  getWip: {
    action: 'get',
    url: '/fbi/stock/wip'
  },
  addWip: {
    action: 'post',
    url: '/fbi/stock/wip'
  },
  editWip: {
    action: 'put',
    url: '/fbi/stock/wip/{stockId}'
  },
  deleteWip: {
    action: 'delete',
    url: '/fbi/stock/wip/{stockId}'
  },

  audited: {
    action: 'put',
    url: '/fbi/stock/wip/audited'
  },
  pending: {
    action: 'put',
    url: '/fbi/stock/wip/pending'
  },
  invalid: {
    action: 'put',
    url: '/fbi/stock/wip/invalid'
  },

  // 包装库存
  normal: {
    action: 'put',
    url: '/fbi/stock/wip/package/normal/{packageId}'
  },
  metamorphism: {
    action: 'put',
    url: '/fbi/stock/wip/package/metamorphism/{packageId}'
  },
  expired: {
    action: 'put',
    url: '/fbi/stock/wip/package/expired/{packageId}'
  },
  packageInvalid: {
    action: 'put',
    url: '/fbi/stock/wip/package/invalid/{packageId}'
  },
  inventory: {
    action: 'put',
    url: '/fbi/stock/material/package/inventory/{packageId}'
  }
}

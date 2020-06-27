export default {
  getMaterial: {
    action: 'get',
    url: '/fbi/stock/material'
  },
  addMaterial: {
    action: 'post',
    url: '/fbi/stock/material'
  },
  editMaterial: {
    action: 'put',
    url: '/fbi/stock/material/{stockId}'
  },
  deleteMaterial: {
    action: 'delete',
    url: '/fbi/stock/material/{stockId}'
  },

  audited: {
    action: 'put',
    url: '/fbi/stock/material/audited'
  },
  pending: {
    action: 'put',
    url: '/fbi/stock/material/pending'
  },
  invalid: {
    action: 'put',
    url: '/fbi/stock/material/invalid'
  },

  // 包装库存
  normal: {
    action: 'put',
    url: '/fbi/stock/material/package/normal/{packageId}'
  },
  metamorphism: {
    action: 'put',
    url: '/fbi/stock/material/package/metamorphism/{packageId}'
  },
  expired: {
    action: 'put',
    url: '/fbi/stock/material/package/expired/{packageId}'
  },
  packageInvalid: {
    action: 'put',
    url: '/fbi/stock/material/package/invalid/{packageId}'
  },
  inventory: {
    action: 'put',
    url: '/fbi/stock/material/package/inventory/{packageId}'
  }
}

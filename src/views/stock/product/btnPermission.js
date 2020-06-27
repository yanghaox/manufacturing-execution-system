export default {
  getProduct: {
    action: 'get',
    url: '/fbi/stock/product'
  },
  addProduct: {
    action: 'post',
    url: '/fbi/stock/product'
  },
  editProduct: {
    action: 'put',
    url: '/fbi/stock/product/{stockId}'
  },
  deleteProduct: {
    action: 'delete',
    url: '/fbi/stock/product/{stockId}'
  },

  audited: {
    action: 'put',
    url: '/fbi/stock/product/audited'
  },
  pending: {
    action: 'put',
    url: '/fbi/stock/product/pending'
  },
  invalid: {
    action: 'put',
    url: '/fbi/stock/product/invalid'
  },

  // 包装库存
  normal: {
    action: 'put',
    url: '/fbi/stock/product/package/normal/{packageId}'
  },
  metamorphism: {
    action: 'put',
    url: '/fbi/stock/product/package/metamorphism/{packageId}'
  },
  expired: {
    action: 'put',
    url: '/fbi/stock/product/package/expired/{packageId}'
  },
  packageInvalid: {
    action: 'put',
    url: '/fbi/stock/product/package/invalid/{packageId}'
  },
  inventory: {
    action: 'put',
    url: '/fbi/stock/material/package/inventory/{packageId}'
  }
}

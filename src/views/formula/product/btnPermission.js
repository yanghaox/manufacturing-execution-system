export default {
  getProduct: {
    action: 'get',
    url: '/fbi/formula/product'
  },
  addProduct: {
    action: 'post',
    url: '/fbi/formula/product'
  },
  editProduct: {
    action: 'put',
    url: '/fbi/formula/product/{id}'
  },
  deleteProduct: {
    action: 'delete',
    url: '/fbi/formula/product/{id}'
  },
  batchDeleteProduct: {
    action: 'delete',
    url: '/fbi/formula/product/batch'
  }
}

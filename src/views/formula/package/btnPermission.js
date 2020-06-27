export default {
  getPachage: {
    action: 'get',
    url: '/fbi/formula/package'
  },
  addPachage: {
    action: 'post',
    url: '/fbi/formula/package'
  },
  editPachage: {
    action: 'put',
    url: '/fbi/formula/package/{id}'
  },
  deletePachage: {
    action: 'delete',
    url: '/fbi/formula/package/{id}'
  },
  batchDeletePachage: {
    action: 'delete',
    url: '/fbi/formula/package/batch'
  }
}

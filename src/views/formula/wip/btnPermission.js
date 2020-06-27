export default {
  getWip: {
    action: 'get',
    url: '/fbi/formula/wip'
  },
  addWip: {
    action: 'post',
    url: '/fbi/formula/wip'
  },
  editWip: {
    action: 'put',
    url: '/fbi/formula/wip/{id}'
  },
  deleteWip: {
    action: 'delete',
    url: '/fbi/formula/wip/{id}'
  },
  batchDeleteWip: {
    action: 'delete',
    url: '/fbi/formula/wip/batch'
  }
}

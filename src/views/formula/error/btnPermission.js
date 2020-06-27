export default {
  getList: {
    action: 'get',
    url: '/fbi/formula/error'
  },
  addError: {
    action: 'post',
    url: '/fbi/formula/error'
  },
  editError: {
    action: 'put',
    url: '/fbi/formula/error/{errorId}'
  },
  deleteError: {
    action: 'delete',
    url: '/fbi/formula/error/{errorId}'
  }
}

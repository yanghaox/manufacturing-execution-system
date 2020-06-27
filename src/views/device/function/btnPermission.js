export default {
  getFunction: {
    action: 'get',
    url: '/fbi/device/function'
  },
  addFunction: {
    action: 'post',
    url: '/fbi/device/function'
  },
  editFunction: {
    action: 'put',
    url: '/fbi/device/function/{functionId}'
  },
  deleteFunction: {
    action: 'delete',
    url: '/fbi/device/function/{functionId}'
  }
}

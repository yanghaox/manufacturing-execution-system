export default {
  getMethod: {
    action: 'get',
    url: '/fbi/device/method'
  },
  addMethod: {
    action: 'post',
    url: '/fbi/device/method'
  },
  editMethod: {
    action: 'put',
    url: '/fbi/device/method/{methodId}'
  },
  deleteMethod: {
    action: 'delete',
    url: '/fbi/device/method/{methodId}'
  }
}

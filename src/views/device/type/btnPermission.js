export default {
  getType: {
    action: 'get',
    url: '/fbi/device/type'
  },
  addType: {
    action: 'post',
    url: '/fbi/device/type'
  },
  editType: {
    action: 'put',
    url: '/fbi/device/type/{typeId}'
  },
  deleteType: {
    action: 'delete',
    url: '/fbi/device/type/{typeId}'
  }
}

export default {
  getAttribute: {
    action: 'get',
    url: '/fbi/device/attribute'
  },
  addAttribute: {
    action: 'post',
    url: '/fbi/device/attribute'
  },
  editAttribute: {
    action: 'put',
    url: '/fbi/device/attribute/{attributeId}'
  },
  deleteAttribute: {
    action: 'delete',
    url: '/fbi/device/attribute/{attributeId}'
  }
}

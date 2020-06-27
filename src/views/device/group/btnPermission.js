export default {
  getGroupList: {
    action: 'get',
    url: '/fbi/device/group'
  },
  addGroup: {
    action: 'post',
    url: '/fbi/device/group'
  },
  editGroup: {
    action: 'put',
    url: '/fbi/device/group/{groupId}'
  },
  deleteGroup: {
    action: 'delete',
    url: '/fbi/device/group/{groupId}'
  },
  addUnit: {
    action: 'post',
    url: '/fbi/device/group/unit/{groupId}'
  },
  deleteUnit: {
    action: 'delete',
    url: '/fbi/device/group/unit/{groupId}'
  },
  unitDetail: {
    action: 'get',
    url: '/fbi/device/group/unit/{deviceId}'
  }
}

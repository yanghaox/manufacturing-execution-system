export default {
  // 功能列表
  getFunction: {
    url: '/fbi/device/unit/function',
    action: 'get'
  },
  // 属性列表
  getAttribute: {
    url: '/fbi/device/unit/attribute',
    action: 'get'
  },
  // 类型列表
  getDeviceType: {
    url: '/fbi/device/unit/type',
    action: 'get'
  },
  // 获取管道物料列表
  getPipelineMaterial: {
    url: '/fbi/device/unit/material',
    action: 'get'
  },
  // 获取管道列表
  getPipeline: {
    url: '/fbi/device/unit/pipeline',
    action: 'get'
  },
  // 获取设备单元列表
  getDeviceUnit: {
    url: '/fbi/device/unit',
    action: 'get'
  },
  // 新增设备单元
  addDeviceUnit: {
    url: '/fbi/device/unit',
    action: 'post'
  },
  // 编辑设备单元
  editDeviceUnit: {
    url: '/fbi/device/unit/{deviceId}',
    action: 'put'
  },
  // 删除设备单元
  deleteDeviceUnit: {
    url: '/fbi/device/unit/{deviceId}',
    action: 'delete'
  },
  // 设备单元详情
  getDeviceUnitDetail: {
    url: '/fbi/device/unit/{deviceId}',
    action: 'get'
  },
  // 工位列表
  getWorkLocation: {
    url: '/fbi/device/unit/work-location',
    action: 'get'
  }
}

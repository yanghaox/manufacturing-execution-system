export default {
  // ------------------------------------工艺------------------------------------
  // 获取部门列表
  getDepartmentList: {
    url: '/fbi/tech/info/department',
    action: 'get'
  },
  // 获取bom列表
  getBomList: {
    url: '/fbi/tech/info/bom',
    action: 'get'
  },
  // 获取bom版本列表
  getBomVersionList: {
    url: '/fbi/tech/info/bomVersion/{bomId}',
    action: 'get'
  },
  // 获取设备组列表
  getDeviceGroupList: {
    url: '/fbi/tech/info/group',
    action: 'get'
  },
  // 获取工艺列表
  getTechList: {
    url: '/fbi/tech/info',
    action: 'get'
  },
  // 新增工艺
  addTech: {
    url: '/fbi/tech/info',
    action: 'post'
  },
  // 修改工艺
  editTech: {
    url: '/fbi/tech/info/{techId}',
    action: 'put'
  },
  // 删除工艺
  delTech: {
    url: '/fbi/tech/info/{techId}',
    action: 'delete'
  },
  // ------------------------------------工艺版本------------------------------------
  // 根据设备组标识获取设备单元列表
  getDeviceUnitList: {
    url: '/fbi/tech/version/deviceGroup',
    action: 'get'
  },
  // 根据设备标识获取功能方式列表
  getDeviceUnitFunMethodList: {
    url: '/fbi/tech/version/device/{groupId}',
    action: 'get'
  },
  // 根据设备编号获取外相设备详情
  getDeviceUnitOuterPhase: {
    url: '/fbi/tech/version/device-unit/{deviceCode}',
    action: 'get'
  },
  // 根据管道id获取管道详情
  getPipelineDetail: {
    url: '/fbi/tech/version/pipeline',
    action: 'get'
  },
  // 获取bom版本详情
  getBomVersionDetail: {
    url: '/fbi/tech/version/bom-version-detail',
    action: 'get'
  },
  // 获取工艺版本详情
  getTechVersionDetail: {
    url: '/fbi/tech/version/techData/{techVersionId}',
    action: 'get'
  },
  // 获取工艺版本表数据
  getTechVersionList: {
    url: '/fbi/tech/info/version',
    action: 'get'
  },
  // 新增工艺版本
  addTechVersion: {
    url: '/fbi/tech/version',
    action: 'post'
  },
  // 修改工艺版本
  editTechVersion: {
    url: '/fbi/tech/version/{techVersionId}',
    action: 'put'
  },
  // 删除工艺版本
  delTechVersion: {
    url: '/fbi/tech/version/{techVersionId}',
    action: 'delete'
  },
  // ------------------------------------导入导出------------------------------------
  // 导出excel
  exportExcel: {
    url: '/fbi/tech/version/export',
    action: 'get'
  },
  // 导出excel模板
  exportExcelTemplate: {
    url: '/fbi/tech/version/exportTemplate',
    action: 'get'
  },
  // 导入excel
  importExcel: {
    url: '/fbi/tech/version/import',
    action: 'post'
  },
  // ------------------------------------草稿------------------------------------
  // 获取草稿
  getDraftList: {
    url: '/fbi/tech/draft',
    action: 'get'
  },
  // 获取草稿详情
  getDraftDetail: {
    url: '/fbi/tech/draft/techData/{draftId}',
    action: 'get'
  },
  // 添加草稿
  addDraft: {
    url: '/fbi/tech/draft/{draftId}',
    action: 'post'
  },
  // 删除草稿
  deleteDraft: {
    url: '/fbi/tech/draft/{draftId}',
    action: 'delete'
  },
  // ------------------------------------工艺版本审核------------------------------------
  // 工艺版本审核通过
  examineTechVersionPassed: {
    url: '/fbi/tech/version/passed/{techVersionId}',
    action: 'put'
  },
  // 工艺版本审核失败
  examineTechVersionFailure: {
    url: '/fbi/tech/version/failure/{techVersionId}',
    action: 'put'
  },
  // 工艺版本审核作废
  examineTechVersionInvalid: {
    url: '/fbi/tech/version/invalid/{techVersionId}',
    action: 'put'
  }
}

const btnPermission = {

  // 获取批次列表
  getBatch: {
    url: '/fbi/produce/batch',
    action: 'get'
  },
  // 添加批次
  addBatch: {
    url: '/fbi/produce/batch',
    action: 'post'
  },
  // 审批通过
  audited: {
    url: '/fbi/produce/batch/audited/{batchId}',
    action: 'put'
  },
  // 审批拒绝
  failure: {
    url: '/fbi/produce/batch/audited_failure/{batchId}',
    action: 'put'
  },
  // 批次作废
  invalid: {
    url: '/fbi/produce/batch/invalid/{batchId}',
    action: 'put'
  }
}

export default btnPermission
